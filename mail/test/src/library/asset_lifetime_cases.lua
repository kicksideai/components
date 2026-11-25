-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
local sql = require("sql")
local base64 = require("base64")
local time = require("time")
local lookup = require("lookup")
local settings = require("settings")
local fixtures = require("fixtures")
local attachments = require("attachments")
local content = require("content")
local interleave = require("asset_interleave")
local database = require("database")
local ledger = require("ledger")

local function register(support)
    local test = support.test
    local state = support.state
    local call = support.call
    local upload = support.upload
    local gif = support.gif
    local sweep = support.sweep
    local prune_through = support.prune_through

    local function restore_history(name)
        local image = {kind = "asset", name = name, upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local first = call("add_asset", image)
        local source = assert(lookup.get(first.asset.upload_id))
        image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
        local latest = call("add_asset", image)
        return source, first, latest, {
            kind = "asset", name = name, seq = first.seq, expected_revision = latest.revision, command_id = uuid.v4(),
        }
    end

    local function library_thread()
        local definition = assert(contract.get("kickside.core:threads"))
        return assert(definition:with_actor(state.actor):open())
    end

    test.it("keeps a pending restore reservation while Core prunes its source event", function()
        local source, first, _, restore = restore_history("restore-before-reap")
        local threads = library_thread()
        local projection = {thread_id = content.library_component_id(), kind = "kickside.mail:library_tables"}
        assert(threads:pause_projection(projection))
        state.resume_projection = function()
            assert(threads:resume_projection(projection))
            state.resume_projection = nil
        end
        local saved, err = fixtures.call(state.editor, "restore", restore)
        assert(saved, tostring(err))
        test.is_true(saved.committed)
        test.is_false(saved.projected)
        prune_through(first.seq)
        sweep(time.now():unix_nano() // 1000000)
        local kept = state.storage:exists(source.storage_path)
        state.resume_projection()
        local folded = assert(threads:catch_up_projection({
            thread_id = projection.thread_id, kind = projection.kind, target_seq = saved.seq,
            deadline = time.now():add(5 * time.SECOND):format(time.RFC3339),
        }))
        test.is_true(folded.done)
        test.is_true(kept)
        local current = call("get", {kind = "asset", name = restore.name})
        test.eq(first.asset.upload_id, current.asset.upload_id)
        test.eq(gif(), call("asset_content", {kind = "asset", name = restore.name}).bytes)
    end)

    test.it("refuses a restore without appending after reaping claims its upload", function()
        local source, first, latest, restore = restore_history("reap-before-restore")
        local threads = library_thread()
        local id = content.library_component_id()
        local now = time.now():add(time.HOUR):unix_nano() // 1000000
        local before = assert(threads:find({thread_id = id})).event_count
        interleave.arm_reap(source.storage_path)
        -- Model a restore that already read its source when the reap claim commits.
        local claimed = assert(database.with_tx(function(tx)
            return ledger.claim_retired(tx, latest.seq, first.seq, 200, now)
        end))
        local target
        for _, row in ipairs(claimed) do
            if row.upload_id == source.uuid then target = row end
        end
        test.not_nil(target)
        local owner = assert(funcs.new():with_context({mail_test_now = now}))
        local reaping = assert(owner:async("kickside.mail.jobs:owner", {}))
        interleave.await("after_claim")
        local kept = state.storage:exists(source.storage_path)
        local value, err = fixtures.call(state.editor, "restore", restore)
        interleave.release("after_claim")
        reaping:response():receive()
        local collected = assert(reaping:result()):data()
        assert(collected.success, tostring(collected.error))
        test.is_true(kept, "The Uploads fixture holds the bytes until the restore is refused")
        test.is_nil(value)
        test.eq(before, assert(threads:find({thread_id = id})).event_count)
        test.eq(errors.NOT_FOUND, assert(err):kind())
        test.eq("mail_asset_source_gone", err:details().code)
        test.eq(latest.seq, call("get", restore).seq)
        test.is_false(state.storage:exists(source.storage_path), "Uploads removes the bytes after the gate opens")
    end)

    local function reserve_restore(name, strand)
        local source, first, latest, restore = restore_history(name)
        local now = time.now():unix_nano() // 1000000
        if strand then
            assert(database.with_tx(function(tx)
                return ledger.hold_restore(tx, source.uuid, latest.seq, uuid.v4(), state.uploader,
                    restore.command_id, now, now + 15 * 60 * 1000)
            end))
            return source, first.seq, now
        end
        local writer = assert(state.editor:with_context({mail_test_now = now}))
        local restored, err = fixtures.call(writer, "restore", restore)
        return source, first.seq, now, restored, err
    end

    local function hold(id)
        local db = assert(sql.get("app:db"))
        local rows = assert(db:query("SELECT hold_id,restore_check_at FROM mail_asset_file WHERE upload_id=$1", {id}))
        assert(db:release())
        local row = rows[1]
        return row and row.hold_id, row and row.restore_check_at
    end

    test.it("releases a stranded restore reservation after its grace period and reaps the upload", function()
        local source, original_seq, now = reserve_restore("stranded-restore", true)
        local reserved = assert(hold(source.uuid))
        prune_through(original_seq)
        sweep(now + 15 * 60 * 1000 - 1)
        test.eq(reserved, hold(source.uuid))
        test.is_true(state.storage:exists(source.storage_path))
        sweep(now + 15 * 60 * 1000 + 1)
        test.is_nil(hold(source.uuid))
        test.is_false(state.storage:exists(source.storage_path))
    end)

    test.it("releases a stranded restore reservation while History retains the upload", function()
        local source, _, now = reserve_restore("restore-with-unpruned-source", true)
        test.not_nil(hold(source.uuid))
        sweep(now + 15 * 60 * 1000 + 1)
        test.is_nil(hold(source.uuid))
        test.is_true(state.storage:exists(source.storage_path))
    end)

    test.it("keeps an expired restore reservation whose event exists", function()
        local source, _, now, restored, err = reserve_restore("appended-restore", false)
        assert(restored, tostring(err))
        local reserved, deadline = hold(source.uuid)
        test.not_nil(reserved)
        test.eq(now + 15 * 60 * 1000, deadline)
        sweep(now + 15 * 60 * 1000 + 1)
        local kept, next_check = hold(source.uuid)
        test.eq(reserved, kept)
        test.is_nil(next_check)
        test.eq(gif(), call("asset_content", {kind = "asset", name = restored.name}).bytes)
    end)

    test.it("keeps an old upload through History and pending delivery, then reaps it", function()
        local image = {kind = "asset", name = "retained-image", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local first = call("add_asset", image)
        local version = assert(lookup.get(first.asset.upload_id))
        image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
        local latest = call("add_asset", image)
        local now = time.now():add(24 * time.HOUR):unix_nano() // 1000000
        sweep(now)
        test.is_true(state.storage:exists(version.storage_path))
        test.not_nil(first.seq)
        test.not_nil(latest.seq)
        local db = assert(sql.get("app:db"))
        local pending = uuid.v4()
        assert(db:execute([[INSERT INTO mail_message
            (id,created_at,status,sender,recipients,subject,from_address,attachments,next_attempt_at,next_check_at,actor_context)
            VALUES ($1,$2,'queued','fixture','{}','Pending','mail@example.org','[]',$3,$3,'{}')]],
            {pending, now, now + 86400000}))
        assert(db:execute([[INSERT INTO mail_message_asset (message_id,name,content_id,upload_id)
            VALUES ($1,$2,$2,$3)]], {pending, image.name, version.uuid}))
        assert(db:release())
        prune_through(first.seq)
        sweep(now)
        local protected = state.storage:exists(version.storage_path)
        db = assert(sql.get("app:db"))
        assert(db:execute("DELETE FROM mail_message WHERE id=$1", {pending}))
        assert(db:release())
        sweep(now)
        test.is_true(protected)
        test.is_false(state.storage:exists(version.storage_path))
        test.eq(latest.asset.upload_id, call("get", image).asset.upload_id)
    end)

    test.it("reaps an adopted reservation after a failed append and its grace", function()
        local image = {kind = "asset", name = "failed-append-image", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local function reservations()
            local db = assert(sql.get("app:db"))
            local rows, err = db:query("SELECT upload_id,due_at FROM mail_asset_file WHERE due_at IS NOT NULL")
            assert(db:release())
            return assert(rows, tostring(err))
        end
        local existing = {}
        for _, row in ipairs(reservations()) do existing[row.upload_id] = true end
        local policy = assert(security.policy("app.mail_library:deny_library_append"))
        local fault = assert(state.editor:with_scope(state.scope:with(policy)))
        local value, err = fixtures.call(fault, "add_asset", image)
        test.is_nil(value)
        test.eq(errors.PERMISSION_DENIED, assert(err):kind())
        local reservation
        for _, row in ipairs(reservations()) do
            if not existing[row.upload_id] then
                test.is_nil(reservation)
                local file = assert(lookup.get(row.upload_id))
                reservation = {path = file.storage_path, due_at = row.due_at}
            end
        end
        assert(reservation, "The adopted file has a ledger reservation")
        sweep(reservation.due_at - 1)
        test.is_true(state.storage:exists(reservation.path))
        sweep(reservation.due_at)
        test.is_false(state.storage:exists(reservation.path))
    end)

    test.it("publishes the replaced image revision in the library event log", function()
        local image = {kind = "asset", name = "history-image-probe", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local thread = content.library_component_id()
        local function query(statement, args)
            local db = assert(sql.get("app:db"))
            local rows, err = db:query(statement, args)
            assert(db:release())
            return assert(rows, tostring(err))
        end
        local first = call("add_asset", image)
        image.expected_revision = first.revision
        image.upload_id = upload("image/gif", gif() .. "replacement")
        local latest = call("add_asset", image)
        local older = call("asset_content", {name = image.name, revision = first.revision})
        test.eq(gif(), older.bytes)
        test.neq(first.asset.upload_id, latest.asset.upload_id)
        local indexed = query("SELECT seq FROM mail_library_history WHERE kind='asset' AND name=$1 ORDER BY seq", {image.name})
        local source = assert(library_thread():list_events({thread_id = thread, from_seq = first.seq,
            to_seq = latest.seq, ascending = true}))
        test.eq(2, #indexed)
        test.eq(2, #source.events)
        for index, row in ipairs(indexed) do
            test.eq(row.seq, source.events[index].seq)
            test.eq("asset/" .. image.name, source.events[index].subject)
        end
    end)

    test.it("adopts, replaces, restores and resets an image in the same library", function()
        local original = call("get", {kind = "asset", name = "logo"})
        test.eq("original", original.state)
        local source = upload("image/gif", gif())
        state.owned[1] = {kind = "asset", name = "logo"}
        local replaced = call("add_asset", {kind = "asset", name = "logo", upload_id = source,
            expected_revision = original.revision})
        test.eq("customized", replaced.state)
        test.eq(original.origin, replaced.origin)
        test.is_nil(replaced.asset.width)
        test.neq(source, replaced.asset.upload_id)
        local person = settings.session("editor")
        local preview_client = assert(funcs.new():with_actor(person.actor):with_scope(person.scope))
        local scoped, scoped_err = fixtures.call(preview_client, "preview", {message = "notice"})
        assert(scoped, tostring(scoped_err))
        local uri = "data:image/gif;base64," .. assert(base64.encode(gif()))
        test.eq(uri, scoped.inline_assets["mail-library-logo"])
        local restored_package = call("reset", {kind = "asset", name = "logo", expected_revision = replaced.revision})
        test.eq("original", restored_package.state)
        local history = call("read_history", {kind = "asset", name = "logo"}).items
        local reset_detail = call("read_revision", {kind = "asset", name = "logo", seq = history[1].seq})
        test.eq("original", reset_detail.content.asset.source)
        test.is_nil(reset_detail.content.asset.upload_id)
        local restored = call("restore", {kind = "asset", name = "logo", expected_revision = restored_package.revision,
            seq = replaced.seq})
        test.eq(replaced.asset.upload_id, restored.asset.upload_id)
        local reset = call("restore", {kind = "asset", name = "logo", expected_revision = restored.revision,
            seq = restored_package.seq})
        test.eq("original", reset.state)
        local preview = call("preview", {message = "notice"})
        test.not_nil(preview.inline_assets["mail-library-logo"]:match("^data:image/png;base64,"))
    end)
end

return {register = register}
