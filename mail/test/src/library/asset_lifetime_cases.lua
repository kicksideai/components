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
local threads_fixture = require("threads_fixture")
local delivery_wait = require("delivery_wait")
local jobs = require("jobs")

local function register(support, race_only)
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

    local function fixture_threads()
        state.restore_threads = threads_fixture.select()
        local policy = assert(security.policy("app.mail_library:threads_fixture_dispatch"))
        return assert(state.editor:with_scope(assert(state.scope:with(policy))))
    end

    local function fixture_retention(fault, upload_pause)
        return assert(funcs.new():with_context({mail_fixture_threads = fault,
            mail_fixture_upload_pause = upload_pause}))
    end

    if race_only then
        test.it("refuses a restore without appending after reaping claims its upload", function()
            local source, first, latest, restore = restore_history("reap-before-restore")
            local threads = library_thread()
            local id = fixtures.library_component_id()
            local before = assert(threads:find({thread_id = id})).event_count
            local writer = fixture_threads()
            local source_gate, reap_gate = uuid.v4(), uuid.v4()
            local source_read = threads_fixture.observe_pause(source_gate)
            local reap_claimed = threads_fixture.observe_pause(reap_gate)
            writer = assert(writer:with_context({mail_fixture_threads = {source_seq = first.seq, gate = source_gate}}))
            local restoring = assert(fixtures.async(writer, "restore", restore))
            source_read()
            local owner = fixture_retention({pruned = first.seq}, {path = source.storage_path, gate = reap_gate})
            local reaping = assert(owner:async(support.retention_owner(), {}))
            reap_claimed()
            local kept = state.storage:exists(source.storage_path)
            threads_fixture.resume(source_gate)
            restoring:response():receive()
            local value, err = restoring:result()
            threads_fixture.resume(reap_gate)
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
        return
    end

    test.it("keeps a pending restore reservation while Core prunes its source event", function()
        local source, first, _, restore = restore_history("restore-before-reap")
        local threads = library_thread()
        local writer = fixture_threads()
        local projection = {thread_id = fixtures.library_component_id(), kind = "kickside.mail:library_tables"}
        assert(threads:pause_projection(projection))
        state.resume_projection = function()
            assert(threads:resume_projection(projection))
            state.resume_projection = nil
        end
        local gate = uuid.v4()
        local paused = threads_fixture.observe_pause(gate)
        writer = assert(writer:with_context({mail_fixture_threads = {append = "pause", gate = gate}}))
        local restoring = assert(fixtures.async(writer, "restore", restore))
        paused()
        prune_through(first.seq)
        sweep()
        local kept = state.storage:exists(source.storage_path)
        threads_fixture.resume(gate)
        restoring:response():receive()
        local response, err = restoring:result()
        local saved = response and response:data()
        assert(saved, tostring(err))
        test.is_true(saved.committed)
        test.is_false(saved.projected)
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


    local function reserve_restore(name, strand)
        local source, first, _, restore = restore_history(name)
        local executor = strand and fixture_threads() or state.editor
        local writer = strand and assert(executor:with_context({mail_fixture_threads = {append = "lost"}})) or executor
        local restored, err = fixtures.call(writer, "restore", restore)
        if strand then
            test.is_nil(restored)
            test.eq(errors.UNAVAILABLE, assert(err):kind())
            test.eq("fixture_lost_append", err:details().code)
            return source, first.seq
        end
        return source, first.seq, restored, err
    end

    local function hold(id)
        local db = assert(sql.get("app:db"))
        local rows = assert(db:query("SELECT hold_id,restore_check_at,restore_reserved_at FROM mail_asset_file WHERE upload_id=$1", {id}))
        assert(db:release())
        local row = rows[1]
        return row and row.hold_id, row and row.restore_check_at, row and row.restore_reserved_at
    end

    local grace = 15 * 60 * 1000

    local function expire_hold(id)
        local db = assert(sql.get("app:db"))
        local due = time.now():unix_nano() // 1000000 - 1000
        assert(db:execute("UPDATE mail_asset_file SET restore_reserved_at=$1,restore_check_at=$2 WHERE upload_id=$3",
            {due - grace, due, id}))
        assert(db:release())
    end

    test.it("releases a stranded restore reservation after its grace period and reaps the upload", function()
        local source, original_seq = reserve_restore("stranded-restore", true)
        local reserved, due, reserved_at = hold(source.uuid)
        test.not_nil(reserved)
        test.eq(grace, due - reserved_at)
        prune_through(original_seq)
        sweep()
        test.eq(reserved, hold(source.uuid))
        test.is_true(state.storage:exists(source.storage_path))
        expire_hold(source.uuid)
        sweep()
        test.is_nil(hold(source.uuid))
        test.is_false(state.storage:exists(source.storage_path))
    end)

    test.it("releases a stranded restore reservation while History retains the upload", function()
        local source = reserve_restore("restore-with-unpruned-source", true)
        test.not_nil(hold(source.uuid))
        local owner_id = support.retention_owner()
        expire_hold(source.uuid)
        local owner = fixture_retention({missing_boundary = true})
        local report = assert(owner:call(owner_id, {}))
        test.is_true(report.success, tostring(report.error))
        test.is_nil(hold(source.uuid))
        test.is_true(state.storage:exists(source.storage_path))
    end)

    test.it("keeps an expired restore reservation whose event exists", function()
        local source, _, restored, err = reserve_restore("appended-restore", false)
        assert(restored, tostring(err))
        local reserved, deadline, reserved_at = hold(source.uuid)
        test.not_nil(reserved)
        test.eq(grace, deadline - reserved_at)
        support.retention_owner()
        expire_hold(source.uuid)
        sweep()
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
        local message = support.define("message", "retained-image-delivery",
            '{{ block body() }}<img src="{{ assets["retained-image"] }}">{{ end }}')
        message.subject = "Fixture pin"
        state.owned[2] = message
        call("create", message)
        state.configured = true
        settings.settings("app.mail_harness:capture", "mail@example.org")
        local queued = assert(fixtures.mailer(state.editor, "send", {
            template = message.name, vars = {}, to = {"reader@example.org"},
        }))
        local function read_message()
            return fixtures.mailer(state.editor, "get_message", queued.message_id)
        end
        local waiting = assert(delivery_wait.observe("activity", "25s")(read_message, function(row)
            return row and row.last_error ~= nil
        end))
        test.eq("queued", waiting.status)
        test.eq("rate_limited", assert(waiting.last_error).code)

        image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
        local latest = call("add_asset", image)
        sweep()
        test.is_true(state.storage:exists(version.storage_path))
        prune_through(first.seq)
        sweep()
        test.is_true(state.storage:exists(version.storage_path))
        local pending = assert(jobs.list_owner_jobs({kind = "mail-message", id = queued.message_id}))
        test.eq(1, #pending)
        test.is_true(assert(jobs.wake_job(pending[1].id, {control = true})).woken)
        test.eq("sent", support.terminal(state.editor, queued.message_id).status)
        sweep()
        test.is_false(state.storage:exists(version.storage_path))
        test.eq(latest.asset.upload_id, call("get", image).asset.upload_id)
    end)

    test.it("reaps an adopted reservation after a failed append and its grace", function()
        local image = {kind = "asset", name = "failed-append-image", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local function reservations()
            local db = assert(sql.get("app:db"))
            local rows, err = db:query("SELECT upload_id,due_at,reserved_at FROM mail_asset_file WHERE due_at IS NOT NULL")
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
                reservation = {id = row.upload_id, path = file.storage_path,
                    reserved_at = row.reserved_at, due_at = row.due_at}
            end
        end
        assert(reservation, "The adopted file has a ledger reservation")
        test.eq(grace, reservation.due_at - reservation.reserved_at)
        sweep()
        test.is_true(state.storage:exists(reservation.path))
        local db = assert(sql.get("app:db"))
        local due = time.now():unix_nano() // 1000000 - 1000
        assert(db:execute("UPDATE mail_asset_file SET reserved_at=$1,due_at=$2 WHERE upload_id=$3",
            {due - grace, due, reservation.id}))
        assert(db:release())
        sweep()
        test.is_false(state.storage:exists(reservation.path))
    end)

    test.it("publishes the replaced image revision in the library event log", function()
        local image = {kind = "asset", name = "history-image-probe", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local thread = fixtures.library_component_id()
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
