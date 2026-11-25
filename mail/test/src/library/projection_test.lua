-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local autoinit = require("autoinit")
local contract = require("contract")
local events = require("events")
local fs = require("fs")
local funcs = require("funcs")
local json = require("json")
local resource = require("resource")
local originals = require("originals")
local security = require("security")
local sql = require("sql")
local test = require("test")
local time = require("time")
local uuid = require("uuid")

local KIND = "kickside.mail:library_tables"
local WORKER = "kickside.mail.persist:library_projection"
local PREFIX = "kickside.mail.events:"
local THREAD = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library")

local function query(statement, args)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query(statement, args or {})
    db:release()
    return assert(rows, tostring(err))
end

local function editor(id)
    local actor = assert(security.new_actor(id, {user_id = id, security_groups = {"app:mail_editors"}}))
    local policy = assert(security.policy("kickside.mail.security:library_threads"))
    local database = assert(security.policy("app:member_database"))
    local component = assert(security.policy("kickside.mail.security:library_component_read"))
    local registry = assert(security.policy("kickside.mail.security:library_component_registry"))
    local context = assert(security.policy("app.mail_library:projection_editor_context"))
    local notifications = assert(security.policy("app.mail_library:projection_editor_notifications"))
    local scope = assert(security.new_scope({policy, database, component, registry, context, notifications}))
    local definition = assert(contract.get("kickside.core:threads"))
    return assert(definition:with_actor(actor):with_scope(scope):open())
end

local function event(id, name, key, revision, change, fields)
    local body = fields or {}
    body.key, body.revision, body.change, body.author = key, revision, change, id
    local envelope, err = events.build(PREFIX .. name, body)
    assert(envelope, tostring(err))
    envelope.external = {external_source = "actor:" .. id, external_id = uuid.v4(), external_version = "1"}
    return envelope
end

local function snapshot(preview, base, state, origin)
    return {
        content = events.snapshot({title = "Snapshot", description = "A full template", html = '{{ include "part/snapshot" }}',
            text = "Text", subject = "Subject", schema = {type = "object"}, samples = {example = true}}),
        base = base, state = state, origin = origin, origin_label = origin and "Packaged fixture",
        preview_id = preview,
    }
end

local function watermark()
    return query("SELECT projected_seq,template_seq FROM mail_library_live WHERE id = 1")[1]
end

local function pending_sync()
    return query([[SELECT owner_id,payload FROM kickside_job
        WHERE job_type = 'kickside.mail.jobs:library_sync' AND owner_kind = 'mail-library' AND owner_id = $1]],
        {THREAD})
end

local function upload_state(id)
    return query("SELECT live,last_seq FROM mail_library_upload_ref WHERE upload_id = $1", {id})[1]
end

local function live(row)
    return row.live == true or row.live == 1
end

local function cases()
    test.it("keeps packaged Mail content within the event snapshot limit", function()
        local count = 0
        for _, declaration in pairs(assert(originals.list())) do
            test.is_nil(resource.check_content(declaration.resource))
            count = count + 1
        end
        test.is_true(count > 0)
    end)

    test.it("folds all library inputs from their snapshots, with replay and transactional watermarks", function()
        local id = uuid.v4()
        local threads = editor(id)
        local suffix = id:sub(1, 8)
        local message = {kind = "message", name = "projection-message-" .. suffix}
        local created = {kind = "message", name = "projection-created-" .. suffix}
        local part = {kind = "part", name = "projection-part-" .. suffix}
        local asset = {kind = "asset", name = "projection-asset-" .. suffix}
        local preview = uuid.v4()
        local first
        local last_template = 0
        local largest_body, largest_row = 0, 0

        local function apply(envelope, template_changed, sync)
            local body_bytes = #assert(json.encode(envelope.body))
            local row_bytes = body_bytes + #envelope.type + #"user" + #envelope.subject + #"application/json"
                + #envelope.external.external_source + #envelope.external.external_id + #envelope.external.external_version
            local result, err = threads:append_events({thread_id = THREAD, events = {envelope}})
            assert(result, tostring(err))
            if row_bytes > largest_row then largest_body, largest_row = body_bytes, row_bytes end
            test.eq(1, result.inserted)
            local seq = result.max_seq
            first = first or seq
            local receipt, catch_err = threads:catch_up_projection({thread_id = THREAD, kind = KIND, target_seq = seq,
                deadline = time.now():add(assert(time.parse_duration("10s"))):format(time.RFC3339)})
            assert(receipt, tostring(catch_err))
            test.eq(true, receipt.done, tostring(receipt.error or receipt.reason))
            local mark = watermark()
            test.eq(seq, mark.projected_seq)
            if template_changed then last_template = seq end
            test.eq(last_template, mark.template_seq)
            local history = query("SELECT * FROM mail_library_history WHERE seq = $1", {seq})[1]
            test.eq(envelope.body.change, history.action)
            test.eq(envelope.body.revision, history.version)
            test.eq(id, history.author)
            test.eq(envelope.body.from_version, history.restored_from)
            local count = 0
            for _, job in ipairs(pending_sync()) do
                if assert(json.decode(job.payload)).seq == seq then count = count + 1 end
            end
            test.eq(sync and 1 or 0, count)
            return seq
        end

        local first_snapshot = snapshot(preview, "before", "customized", "packaged:fixture")
        first_snapshot.previous_base = "original"
        local first_seq = apply(event(id, "resource.base_set", message, 1, "base_changed", first_snapshot), true, true)
        local function row(key)
            return query("SELECT * FROM mail_library WHERE kind = $1 AND name = $2", {key.kind, key.name})[1]
        end
        local projected = row(message)
        test.eq("before", projected.base)
        test.eq(first_snapshot.content.html, projected.html)
        test.eq(first_snapshot.content.description, projected.description)
        test.eq(first_snapshot.origin, projected.origin)
        test.eq(first_snapshot.origin_label, projected.origin_label)
        test.eq(first_seq, projected.last_seq)
        local function refs(key)
            return query([[SELECT to_kind,to_name FROM mail_library_reference
                WHERE from_kind = $1 AND from_name = $2 ORDER BY to_kind,to_name]], {key.kind, key.name})
        end
        test.eq("before", refs(message)[1].to_name)
        test.eq("snapshot", refs(message)[2].to_name)

        local first_update = snapshot(preview, nil, "customized", first_snapshot.origin)
        first_update.content.subject = nil
        apply(event(id, "resource.updated", part, 1, "edited", first_update), true, true)
        test.eq(1, row(part).revision)
        local update = snapshot(preview, "after", "customized", first_snapshot.origin)
        update.content.html = "Replaced"
        apply(event(id, "resource.updated", message, 2, "edited", update), true, true)
        test.eq("Replaced", row(message).html)
        test.eq("after", refs(message)[1].to_name)
        test.eq(1, #refs(message))

        apply(event(id, "resource.reset", message, 3, "reset",
            snapshot(preview, "original", "original", first_snapshot.origin)), true, true)
        test.is_nil(row(message))
        test.eq(0, #refs(message))

        local maximum = snapshot(preview, "base", "created")
        local limit = 512 * 1024
        local escaped = string.char(1)
        maximum.content.html = string.rep(escaped, limit // 2)
        maximum.content.text = string.rep(escaped, limit // 2 - 1)
        maximum.content.description = escaped
        maximum.content.subject = string.rep(escaped, 64 * 1024)
        maximum.content.title = string.rep(escaped, 4096)
        maximum.content.schema.description = string.rep("s", 32 * 1024 - #assert(json.encode(
            {type = "object", description = ""})))
        maximum.content.samples = {data = string.rep("v", 64 * 1024 - #assert(json.encode({data = ""})))}
        maximum.note = string.rep(escaped, 500)
        maximum.content.description = escaped .. escaped
        local refused, refused_content = events.build(PREFIX .. "resource.created", {
            key = created, revision = 1, author = id, change = "created", content = maximum.content,
            base = maximum.base, state = maximum.state, preview_id = preview,
        })
        test.is_nil(refused)
        test.eq(errors.INVALID, assert(refused_content):kind())
        test.eq("mail_resource_too_large", refused_content:details().code)
        maximum.content.description = escaped
        local created_seq = apply(event(id, "resource.created", created, 1, "created", maximum), true, true)
        test.eq(limit, #row(created).html + #row(created).text + #row(created).description)
        apply(event(id, "resource.archived", created, 2, "archived"), false, false)
        test.is_true(row(created).archived == true or row(created).archived == 1)
        test.eq(2, row(created).revision)
        local restore = snapshot(preview, "base", "created")
        restore.from_seq, restore.from_version = created_seq, 1
        apply(event(id, "resource.restored", created, 3, "restored", restore), true, true)
        test.is_false(row(created).archived == true or row(created).archived == 1)
        test.eq(3, row(created).revision)

        apply(event(id, "resource.deleted", part, 2, "deleted"), true, true)
        test.is_nil(row(part))
        test.eq(0, #refs(part))

        local upload1, upload2 = uuid.v4(), uuid.v4()
        local function image(upload)
            return {asset = {upload_id = upload, filename = "snapshot.png", content_type = "image/png", size = 8},
                title = "Snapshot", description = "An image"}
        end
        local added = apply(event(id, "asset.added", asset, 1, "created", image(upload1)), false, true)
        local replaced = apply(event(id, "asset.added", asset, 2, "edited", image(upload2)), false, true)
        test.is_false(live(upload_state(upload1)))
        test.eq(added, upload_state(upload1).last_seq)
        test.eq(replaced, upload_state(upload2).last_seq)
        local asset_restore = image(upload1)
        asset_restore.from_seq, asset_restore.from_version = added, 1
        local restored = apply(event(id, "asset.restored", asset, 3, "restored", asset_restore), false, true)
        local saved_asset = query("SELECT * FROM mail_library_asset WHERE name = $1", {asset.name})[1]
        test.eq(upload1, saved_asset.upload_id)
        test.eq("snapshot.png", saved_asset.filename)
        test.eq(restored, saved_asset.last_seq)
        apply(event(id, "asset.removed", asset, 4, "deleted"), false, true)
        local last = apply(event(id, "resource.archived", created, 4, "archived"), false, false)
        test.is_false(live(upload_state(upload1)))
        test.eq(restored, upload_state(upload1).last_seq)
        test.eq(0, #query("SELECT name FROM mail_library_asset WHERE name = $1", {asset.name}))

        local refused, refused_err = threads:append_events({thread_id = THREAD, events = {
            {type = "kickside.threads:message.created", body = {text = "Unlisted input"}},
        }})
        test.is_nil(refused)
        test.eq(errors.PERMISSION_DENIED, assert(refused_err):kind())
        test.eq(last, watermark().projected_seq)

        local batch = assert(threads:list_events({thread_id = THREAD, from_seq = first, to_seq = last, ascending = true}))
        local jobs_before = #pending_sync()
        local replay, replay_err = funcs.call(WORKER, {thread_id = THREAD, events = batch.events,
            range = {from_seq = first, to_seq = last}})
        assert(replay, tostring(replay_err))
        test.eq(last, replay.body.projected_seq)
        test.eq(last, replay.last_seq)
        test.eq(#batch.events, #query("SELECT seq FROM mail_library_history WHERE seq BETWEEN $1 AND $2", {first, last}))
        test.eq(jobs_before, #pending_sync())
        test.eq(last_template, watermark().template_seq)

        local missing = {kind = "part", name = "projection-gap-" .. suffix}
        local before_gap = event(id, "resource.created", missing, 1, "created", snapshot(preview, nil, "created"))
        before_gap.body.content.subject = nil
        before_gap.seq, before_gap.created_at = last + 1, batch.events[#batch.events].created_at
        local skipped = event(id, "resource.archived", created, 5, "archived")
        skipped.seq, skipped.created_at = last + 3, before_gap.created_at
        local result, gap = funcs.call(WORKER, {thread_id = THREAD, events = {before_gap, skipped},
            range = {from_seq = before_gap.seq, to_seq = skipped.seq}})
        test.is_nil(result)
        test.eq(errors.INTERNAL, assert(gap):kind())
        test.eq("mail_projection_source_gap", gap:details().code)
        test.eq(last, watermark().projected_seq)
        test.is_nil(row(missing))
        test.eq(0, #query("SELECT seq FROM mail_library_history WHERE seq > $1", {last}))
        test.eq(jobs_before, #pending_sync())

        local unknown, unknown_err = funcs.call(WORKER, {thread_id = THREAD,
            events = {{type = "kickside.threads:message.created", seq = last + 1, body = {}, created_at = before_gap.created_at}},
            range = {from_seq = last + 1, to_seq = last + 1}})
        test.is_nil(unknown)
        test.eq(errors.INTERNAL, assert(unknown_err):kind())
        test.eq("mail_unknown_event", unknown_err:details().code)
        test.eq(last, watermark().projected_seq)

        test.is_true(largest_body >= 6 * limit)
        test.is_true(largest_row <= 4194304)
        local storage = assert(fs.get("app:uploads"))
        assert(storage:writefile("l12-snapshot-size.txt", string.format(
            "body_bytes\tthreads_row_bytes\n%d\t%d\n", largest_body, largest_row)))
    end)
end

return {run = test.run_cases(function()
    test.describe("Mail library projection", cases)
end)}
