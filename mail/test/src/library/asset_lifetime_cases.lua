-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
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

local function register(support)
    local test = support.test
    local state = support.state
    local call = support.call
    local upload = support.upload
    local gif = support.gif
    local sweep = support.sweep
    local prune_through = support.prune_through

    local function restore_race(name, reap_first)
        local image = {kind = "asset", name = name, upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local first = call("add_asset", image)
        local source = assert(lookup.get(first.asset.upload_id))
        image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
        local latest = call("add_asset", image)
        local restore_gate = reap_first and "before_reserve" or "before_append"
        local restore = assert(state.editor:with_context({mail_test_asset_gate = restore_gate}))
        local saved = assert(fixtures.async(restore, "restore", {
            kind = "asset", name = name, seq = first.seq, expected_revision = latest.revision,
        }))
        interleave.await(restore_gate)
        if reap_first then interleave.arm_reap(source.storage_path) end
        prune_through(first.seq)

        local function head()
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT event_count FROM kickside_thread WHERE id=$1",
                {content.library_component_id()}))
            assert(db:release())
            return rows[1].event_count
        end
        local now = time.now():unix_nano() // 1000000
        if reap_first then
            local before = head()
            local owner = assert(funcs.new():with_context({mail_test_now = now}))
            local reaping = assert(owner:async("kickside.mail.jobs:owner", {}))
            interleave.await("after_claim")
            test.is_true(state.storage:exists(source.storage_path))
            interleave.release(restore_gate)
            fixtures.await(function() return saved:is_complete() end, "The refused restore did not finish")
            local value, err = saved:result()
            interleave.release("after_claim")
            fixtures.await(function() return reaping:is_complete() end, "The reap did not finish")
            local collected = assert(reaping:result()):data()
            assert(collected.success, tostring(collected.error))
            test.is_nil(value)
            test.eq(before, head())
            test.eq(errors.NOT_FOUND, assert(err):kind())
            test.eq("mail_asset_source_gone", err:details().code)
            test.eq(latest.seq, call("get", image).seq)
            fixtures.await(function()
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT upload_id FROM mail_asset_file WHERE upload_id=$1", {source.uuid}))
                assert(db:release())
                return #rows == 0
            end, "Uploads did not acknowledge the reap")
            test.is_false(state.storage:exists(source.storage_path))
        else
            sweep(now)
            local kept = state.storage:exists(source.storage_path)
            interleave.release(restore_gate)
            fixtures.await(function() return saved:is_complete() end, "The accepted restore did not finish")
            local payload, err = saved:result()
            local value = assert(payload, tostring(err)):data()
            test.is_true(kept)
            test.eq(first.asset.upload_id, value.asset.upload_id)
            test.eq(gif(), call("asset_content", {kind = "asset", name = name}).bytes)
        end
    end

    test.it("keeps a restore reservation when Core prunes before the append", function()
        restore_race("restore-before-reap", false)
    end)

    test.it("refuses a restore without appending after reaping claims its upload", function()
        restore_race("reap-before-restore", true)
    end)

    local function reserve_restore(name, strand)
        local image = {kind = "asset", name = name, upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local first = call("add_asset", image)
        local source = assert(lookup.get(first.asset.upload_id))
        image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
        local latest = call("add_asset", image)
        local now = time.now():unix_nano() // 1000000
        local writer = assert(state.editor:with_context({mail_test_now = now, mail_test_strand_restore = strand}))
        local restored, err = fixtures.call(writer, "restore", {
            kind = "asset", name = name, seq = first.seq, expected_revision = latest.revision,
            command_id = uuid.v4(),
        })
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
        local source, original_seq, now, restored, err = reserve_restore("stranded-restore", true)
        test.is_nil(restored)
        test.eq(errors.UNAVAILABLE, assert(err):kind())
        local reserved = assert(hold(source.uuid))
        prune_through(original_seq)
        sweep(now + 15 * 60 * 1000 - 1)
        test.eq(reserved, hold(source.uuid))
        test.is_true(state.storage:exists(source.storage_path))
        sweep(now + 15 * 60 * 1000 + 1)
        test.is_nil(hold(source.uuid))
        test.is_false(state.storage:exists(source.storage_path))
    end)

    test.it("releases a stranded restore reservation when the prune boundary is absent", function()
        local source, _, now, restored, err = reserve_restore("restore-without-prune-record", true)
        test.is_nil(restored)
        test.eq(errors.UNAVAILABLE, assert(err):kind())
        test.not_nil(hold(source.uuid))
        sweep(now + 15 * 60 * 1000 + 1, true)
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
        local actor = assert(security.new_actor(state.uploader, {security_groups = {"app:mail_editors", "app:mail_senders"}}))
        local scope = assert(security.named_scope("wippy.security:process"))
        local fault = assert(funcs.new():with_actor(actor):with_scope(scope):with_context({mail_test_append_failure = true}))
        local value, err = fixtures.call(fault, "add_asset", image)
        test.is_nil(value)
        test.eq("mail_test_append_failure", assert(err):details().code)
        local db = assert(sql.get("app:db"))
        local rows = assert(db:query("SELECT upload_id,due_at FROM mail_asset_file WHERE due_at IS NOT NULL"))
        assert(db:release())
        local reservation
        for _, row in ipairs(rows) do
            local file = lookup.get(row.upload_id)
            if file then reservation = {path = file.storage_path, due_at = row.due_at}; break end
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
        local before = query("SELECT event_count FROM kickside_thread WHERE id=$1", {thread})[1].event_count
        local first = call("add_asset", image)
        image.expected_revision = first.revision
        image.upload_id = upload("image/gif", gif() .. "replacement")
        local latest = call("add_asset", image)
        local older = call("asset_content", {name = image.name, revision = first.revision})
        test.eq(gif(), older.bytes)
        test.neq(first.asset.upload_id, latest.asset.upload_id)
        local indexed = query([[SELECT h.seq FROM mail_library_history h
            JOIN kickside_event e ON e.thread_id=$1 AND e.seq=h.seq
            WHERE h.kind='asset' AND h.name=$2]], {thread, image.name})
        local after = query("SELECT event_count FROM kickside_thread WHERE id=$1", {thread})[1].event_count
        test.eq(2, #indexed, ("asset create and replace advanced the thread from %d to %d"):format(before, after))
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
