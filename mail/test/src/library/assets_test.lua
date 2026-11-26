-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local delivery_wait = require("delivery_wait")
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local fs = require("fs")
local uuid = require("uuid")
local sql = require("sql")
local base64 = require("base64")
local contract = require("contract")
local time = require("time")
local json = require("json")
local lookup = require("lookup")
local settings = require("settings")
local fixtures = require("fixtures")
local prune = require("prune")
local threads_fixture = require("threads_fixture")
local asset_lifetime_cases = require("asset_lifetime_cases")
local asset_content_cases = require("asset_content_cases")
local asset_delivery_cases = require("asset_delivery_cases")

local function setup_actor(role)
    local member = settings.session(role)
    local exec = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
    return member.id, exec, member.actor, member.scope
end

local function define(kind, name, html)
    return {kind = kind, name = name, title = name, description = "", html = html, text = "Plain text",
        schema = {type = "object", properties = {}}, samples = {}}
end

local function gif()
    return "GIF89a\1\0\1\0\128\0\0\0\0\0\255\255\255!\249\4\1\0\0\0\0,\0\0\0\0\1\0\1\0\0\2\2D\1\0;"
end

local function terminal(executor, id)
    return delivery_wait.terminal(function()
        return fixtures.mailer(executor, "get_message", id)
    end, "25s")
end

local function prune_through(actor, seq)
    local thread = fixtures.library_component_id()
    local definition = assert(contract.get("kickside.core:threads"))
    local threads = assert(definition:with_actor(actor):open())
    local before = assert(threads:find({thread_id = thread}))
    local db = assert(sql.get("app:db"))
    local result, err = prune.prune_thread(db, thread, {
        cutoff = "2099-01-01T00:00:00Z", max_total = seq - before.max_pruned_seq,
    })
    assert(db:release())
    assert(result, tostring(err))
    test.eq(seq, result.max_pruned_seq)
end

local function cases(race_only)
    test.describe("Mail library images", function()
        local state = {}
        if race_only then
            test.before_all(function() fixtures.await_live(0) end)
        end
        test.before_each(function()
            state.owned, state.uploaders, state.configured = {}, {}, false
            state.storage = assert(fs.get("app:uploads"))
            state.uploader, state.editor, state.actor, state.scope = setup_actor("upload_editor_sender")
        end)
        test.after_each(function()
            if state.restore_upload_info then
                state.restore_upload_info()
                state.restore_upload_info = nil
            end
            if state.restore_threads then
                state.restore_threads()
                state.restore_threads = nil
            end
            if state.resume_projection then state.resume_projection() end
            fixtures.remove(state.owned)
            if state.configured then settings.settings("", "") end
            for owner in pairs(state.uploaders) do
                lookup.cleanup(owner)
            end
        end)
        local function call(method, input)
            local draft
            if input.kind ~= "asset" then
                local message = input.kind == "message" and input.name or "notice"
                if method == "create" then
                    draft = {message = message, create = input}
                elseif method == "update" then
                    draft = {message = message, resources = {input}}
                end
            end
            if draft then
                local preview = assert(fixtures.call(state.editor, "preview", draft))
                input.preview_id = assert(preview.preview_id, preview.errors[1] and preview.errors[1].message)
            end
            local result, err = fixtures.call(state.editor, method, input)
            if type(result) == "table" and input.kind ~= "asset" and method ~= "get" then fixtures.await_live(result.seq) end
            return assert(result, err and tostring(err) .. " " .. assert(json.encode(err:details() or {})))
        end
        local function upload(mime, bytes, actor)
            local owner = actor or state.actor
            local source, err = lookup.store(owner, mime, bytes)
            assert(source, tostring(err))
            state.uploaders[owner] = true
            return source
        end
        local function sweep()
            local result = assert(funcs.call(fixtures.retention_id(), {}))
            assert(result.success, tostring(result.error))
            return result
        end

        local cases = {
            test = test,
            state = state,
            call = call,
            upload = upload,
            gif = gif,
            sweep = sweep,
            retention_owner = fixtures.retention_id,
            prune_through = function(seq) prune_through(state.actor, seq) end,
            terminal = terminal,
            define = define,
            setup_actor = setup_actor,
        }
        if race_only then
            asset_lifetime_cases.register(cases, true)
            return
        end
        test.it("refuses to append an adoption after its lease expires", function()
            local name = "expired-adoption-lease"
            local source = upload("image/gif", gif())
            state.restore_threads = threads_fixture.select()
            local policy = assert(security.policy("app.mail_library:threads_fixture_dispatch"))
            local gate = uuid.v4()
            local paused = threads_fixture.observe_pause(gate)
            local writer = assert(state.editor:with_scope(assert(state.scope:with(policy))))
            writer = assert(writer:with_context({mail_fixture_threads = {subject = "asset/" .. name, gate = gate}}))
            local started = time.now():unix_nano() // 1000000
            local call = assert(fixtures.async(writer, "add_asset", {kind = "asset", name = name, upload_id = source}))
            paused()
            local db = assert(sql.get("app:db"))
            local expired = assert(db:execute([[UPDATE mail_asset_file SET reserved_at=$1,due_at=$2
                WHERE reserved_at>=$3 AND due_at>$3 AND hold_seq IS NULL]],
                {started - 16 * 60000, started - 60000, started}))
            assert(db:release())
            threads_fixture.resume(gate)
            call:response():receive()
            local result, failure = call:result()
            state.restore_threads()
            state.restore_threads = nil
            test.eq(1, expired.rows_affected)
            test.is_nil(result)
            test.eq("mail_asset_version_unavailable", assert(failure):details().code)
            local item, missing = fixtures.call(state.editor, "get", {kind = "asset", name = name})
            test.is_nil(item)
            test.eq(errors.NOT_FOUND, assert(missing):kind())
            sweep()
        end)

        asset_lifetime_cases.register(cases)
        asset_content_cases.register(cases)
        asset_delivery_cases.register(cases)

    end)
end

local expiry = test.run_cases(function()
    test.describe("Mail asset expiry", function()
        local owner, uploader
        test.before_each(function()
            owner = fixtures.retention_id()
        end)
        test.after_each(function()
            if uploader then
                settings.settings("", "")
                lookup.cleanup(uploader)
                uploader = nil
            end
        end)

        test.it("reports blocked assets while expiring messages and progressing beyond a failed batch", function()
            local _, sender, actor = setup_actor("upload_editor_sender")
            uploader = actor
            settings.settings("app.mail_harness:admitted", "mail@example.org")
            local queued = assert(fixtures.mailer(sender, "send", {
                to = {"reader@example.org"}, subject = "Resend fixture", text = "Expiry fixture",
            }))
            local expired = terminal(sender, queued.message_id)
            test.eq("failed", expired.status)
            local source = assert(lookup.store(uploader, "image/gif", gif()))
            local image = assert(fixtures.call(sender, "add_asset", {
                kind = "asset", name = "expiry-collectable", upload_id = source,
            }))
            local version = assert(lookup.get(image.asset.upload_id))
            local storage = assert(fs.get("app:uploads"))
            assert(fixtures.call(sender, "delete", {
                kind = "asset", name = image.name, expected_revision = image.revision,
            }))
            fixtures.await_sync_idle()
            prune_through(actor, image.seq)

            local db = assert(sql.get("app:db"))
            local day = 86400000
            local now = time.now():unix_nano() // 1000000
            local prefix = "invalid-" .. uuid.v4()
            local batch = 200
            local tx = assert(db:begin())
            -- Mail refuses malformed upload IDs at admission.
            for i = 1, batch do
                assert(tx:execute([[INSERT INTO mail_asset_file
                    (upload_id,due_at) VALUES ($1,$2)]],
                    {prefix .. "-" .. i, now - 2}))
            end
            assert(tx:execute("UPDATE mail_message SET created_at=$1,finished_at=$1 WHERE id=$2",
                {now - 31 * day, expired.message_id}))
            assert(tx:commit())

            local function sweep()
                local report = assert(funcs.call(owner, {}))
                assert(report.success, tostring(report.error))
                return report
            end
            local first = sweep()
            test.is_true(storage:exists(version.storage_path), "The first page leaves the collectable upload")
            local second = sweep()
            local message, missing = fixtures.mailer(sender, "get_message", expired.message_id)
            local assets = assert(db:query("SELECT upload_id, due_at FROM mail_asset_file WHERE upload_id LIKE $1 OR upload_id=$2",
                {prefix .. "%", version.uuid}))
            assert(db:execute("UPDATE mail_asset_file SET due_at=$1 WHERE upload_id LIKE $2", {now - 1, prefix .. "%"}))
            local at_deadline = sweep()
            assert(db:execute("DELETE FROM mail_asset_file WHERE upload_id LIKE $1", {prefix .. "%"}))
            assert(db:release())

            test.is_nil(message, "Asset failures cannot prevent delivery log expiry")
            test.eq("message_not_found", assert(missing):details().code)
            test.eq(batch, #assets, "The collectable row beyond the failed page is removed")
            test.is_false(storage:exists(version.storage_path))
            test.is_true(first.needs_continue, "The first page leaves a due asset for the next sweep")
            test.eq(batch, #first.blocked)
            test.eq("invalid_asset_request", first.blocked[1].error:details().code)
            test.is_false(second.needs_continue)
            test.eq(0, #second.blocked)
            test.is_true(second.deadline_ms > now, "Retries are scheduled in the future")
            test.eq(second.deadline_ms, assets[1].due_at)
            test.eq(batch, #at_deadline.blocked)
        end)

        test.it("keeps an asset reference when a message enters the expiry batch after unlink starts", function()
            local db = assert(sql.get("app:db"))
            local postgres = assert(db:type()) == "postgres"
            local day = 86400000
            local now = time.now():unix_nano() // 1000000
            local cutoff = now - 30 * day - 60000
            local first, late, version = uuid.v4(), uuid.v4(), uuid.v4()
            local seed = assert(db:begin())
            assert(seed:execute([[INSERT INTO mail_asset_file
                (upload_id) VALUES ($1)]], {version}))
            assert(seed:execute([[INSERT INTO mail_library_upload_ref (upload_id,asset,live,last_seq)
                VALUES ($1,'fixture',FALSE,0)]], {version}))
            for i, id in ipairs({first, late}) do
                assert(seed:execute([[INSERT INTO mail_message
                    (id,created_at,finished_at,status,sender,recipients,subject,from_address,attachments)
                    VALUES ($1,$2,$2,'failed','fixture','{}','Expiry','mail@example.org','[]')]], {id, cutoff + i - 2}))
                assert(seed:execute([[INSERT INTO mail_message_asset
                    (message_id,name,content_id,upload_id) VALUES ($1,'fixture','fixture',$2)]], {id, version}))
            end
            assert(seed:execute("UPDATE mail_message SET finished_at=$1 WHERE id=$2", {cutoff + 120000, late}))
            assert(seed:commit())
            local exec = funcs.new()
            local report
            if postgres then
                local lock = assert(db:begin())
                local blocker = assert(lock:query("SELECT pg_backend_pid() AS pid"))[1].pid
                assert(lock:query("SELECT message_id FROM mail_message_asset WHERE message_id=$1 FOR UPDATE", {first}))
                local sweep = assert(exec:async(owner, {}))
                local deadline = time.now():add(25 * time.SECOND):unix_nano()
                local waiting = {}
                repeat
                    waiting = assert(db:query([[SELECT pid FROM pg_stat_activity
                        WHERE $1 = ANY(pg_blocking_pids(pid))
                          AND query LIKE 'DELETE FROM mail_message_asset%']], {blocker}))
                    if #waiting > 0 then break end
                    time.sleep("15ms")
                until time.now():unix_nano() >= deadline
                if #waiting > 0 then
                    assert(db:execute("UPDATE mail_message SET finished_at=$1 WHERE id=$2", {cutoff, late}))
                end
                assert(lock:commit())
                sweep:response():receive()
                report = assert(assert(sweep:result()):data())
                test.eq(1, #waiting, "The expiry unlink waits on the first message")
            else
                report = assert(exec:call(owner, {}))
                assert(db:execute("UPDATE mail_message SET finished_at=$1 WHERE id=$2", {cutoff, late}))
            end
            local refs = assert(db:query("SELECT message_id FROM mail_message_asset WHERE upload_id=$1", {version}))
            local held = assert(db:query("SELECT state FROM mail_asset_file WHERE upload_id=$1", {version}))
            assert(db:release())
            test.is_true(report.success, tostring(report.error))
            test.eq(1, #refs, "The next expiry pass must still be able to release the late message reference")
            test.eq(late, refs[1].message_id)
            test.eq("held", held[1].state)
            if postgres then test.is_true(report.needs_continue) end
            local next_report = assert(exec:call(owner, {}))
            test.is_true(next_report.success, tostring(next_report.error))
            local check = assert(sql.get("app:db"))
            local released = assert(check:query("SELECT state FROM mail_asset_file WHERE upload_id=$1", {version}))
            assert(check:release())
            test.eq(0, #released, "The owner did not reap the upload after its last delivery expired")
        end)
    end)
end)

return {
    run = test.run_cases(function() cases(false) end),
    race = test.run_cases(function() cases(true) end),
    expiry = expiry,
}
