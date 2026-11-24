-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local process = require("process")
local channel = require("channel")
local time = require("time")
local runner = require("runner")
local fixture = require("fixture")
local store = require("store")
local steps = require("steps")
local clock = require("clock")
local append_probe = require("append_probe")
local M = {}
local NAME = "kickside.core.retention.service:sweeper_process"
local TOPIC = "kickside.core.retention.changed"
local function trash_board(): fixture.Handle
    local declaration = fixture.declaration(fixture.fresh_prefix())
    declaration.policy = { trash_days = 0 }
    return fixture.board({ declaration = declaration })
end

local function first_of_trash_boards(): fixture.Handle
    local first = trash_board()
    for _ = 1, 8 do
        local other = trash_board()
        if other.id < first.id then first = other end
    end
    return first
end

local function trash_at(board: fixture.Handle, item: string, at: string)
    assert(board.call("trusted_append", { thread_id = board.id, events = {
        { type = "kickside.work.events:item.deleted", subject = "i:" .. item,
            body = { item = item, actor = board.actor:id(), at = at, source = "retention_schedule_test" } },
    } }))
    assert(board.call("settle", {}))
end

local function life(board: fixture.Handle, item: string): string
    assert(board.call("settle", {}))
    local db = assert(store.open())
    local row = assert(store.item(db, board.id, item))
    db:release()
    return row.life
end

local function start_at(board: fixture.Handle)
    local db = assert(store.open())
    assert(db:execute([[UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,
        board_scan='all',pending_page_budget=0,board_through=NULL,discovery_turn=0 WHERE owner_id='work']], { board.id }))
    db:release()
end

local function define()
    test.describe("retention scheduling", function()
        local child: string?
        local settings_board: fixture.Handle?
        local batch_board: fixture.Handle?
        local stop_listening: (() -> ())?
        local registered = false
        test.after_each(function()
            if registered then
                registered = false
                assert(process.registry.unregister(NAME, process.registry.CONSISTENT))
            end
            if stop_listening then
                stop_listening()
                stop_listening = nil
            end
            if settings_board then
                assert(settings_board.call("unset_setting",{namespace="kickside.work",key="trash_days"}))
                settings_board=nil
            end
            if batch_board then
                assert(batch_board.call("unset_setting", { namespace = "kickside.work", key = "cleanup_batch" }))
                batch_board = nil
            end
            if child then
                assert(process.terminate(child))
                child = nil
            end
        end)
        -- Settings 0.3.8 revisions do not wake Core 0.3.17 retention. The
        -- settings-alone reproduction is retained in REPORT6; this asserts the
        -- Work-owned boundary without inventing a Work watcher.
        test.it("reads committed application policy on the next owner invocation", function()
            local h=fixture.board()
            settings_board=h
            local id=steps.create(h,"task")
            steps.one(h,{op="delete",item=id})
            assert(h.call("set_setting",{namespace="kickside.work",key="trash_days",value=0}))
            steps.retention_sweep(function(): boolean
                assert(h.call("settle",{}))
                local db=assert(store.open())
                local item=assert(store.item(db,h.id,id))
                db:release()
                return item.life=="purged"
            end)
        end)
        test.it("reports the deadline and quiesces with future-eligible trash", function()
            local h = trash_board()
            local id = steps.create(h, "task")
            steps.retention_sweep()
            local future = clock.deadline(15000)
            trash_at(h, id, future.at)
            start_at(h)
            local _, waiting = steps.retention_sweep()
            test.is_false(waiting.needs_continue)
            test.eq(life(h, id), "trashed")
            test.eq(waiting.deadline_ms, future.ns // 1000000 + 1)
            steps.wait_for("owner eligibility deadline", function(): boolean
                return clock.deadline(0).ns // 1000000 >= waiting.deadline_ms
            end)
            local _, done = steps.retention_sweep(function(): boolean return life(h, id) == "purged" end)
            if done.needs_continue == true then _, done = steps.retention_sweep() end
            test.is_false(done.needs_continue)
            test.eq(life(h, id), "purged")
        end)

        test.it("serves an elapsed board deadline ahead of the rest of discovery", function()
            local h = first_of_trash_boards()
            batch_board = h
            local id = steps.create(h, "task")
            steps.retention_sweep()
            assert(h.call("set_setting", { namespace = "kickside.work", key = "cleanup_batch", value = 1 }))
            local future = clock.deadline(5000)
            trash_at(h, id, future.at)
            start_at(h)
            local visited = steps.retention_run()
            test.is_true(visited.needs_continue)
            test.eq(visited.deadline_ms, future.ns // 1000000 + 1)
            test.eq(life(h, id), "trashed")
            steps.wait_for("deadline during discovery", function(): boolean
                return clock.deadline(0).ns // 1000000 >= visited.deadline_ms
            end)
            steps.retention_run()
            test.eq(life(h, id), "purged", "the next callback must serve the elapsed deadline")
        end)

        test.it("keeps committed eligibility behind a coalesced discovery continuation", function()
            local h = first_of_trash_boards()
            batch_board = h
            local id = steps.create(h, "task")
            steps.retention_sweep()
            assert(h.call("set_setting", { namespace = "kickside.work", key = "cleanup_batch", value = 1 }))
            start_at(h)
            test.is_true(steps.retention_run().needs_continue)
            local db = assert(store.open())
            local position = assert(db:query("SELECT board_after,pending_page_budget FROM kickside_work_retention WHERE owner_id='work'", {}))[1]
            db:release()
            test.eq(position.board_after, h.id, "discovery has passed the target")
            test.is_true((tonumber(position.pending_page_budget) or 0) > 0)
            local mailbox = assert(process.listen(TOPIC))
            stop_listening = function() process.unlisten(mailbox) end
            assert(process.registry.register(NAME, nil, process.registry.CONSISTENT))
            registered = true
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            assert(h.call("settle", {}))
            local timer = time.after("5s")
            local wake: { [string]: unknown }? = nil
            while not wake do
                local message = channel.select({ mailbox:case_receive(), timer:case_receive() })
                assert(message.channel == mailbox, "committed projection did not deliver the retention wake")
                local change = message.value :: { [string]: unknown }
                if change.kind == "projection_eligibility_changed" and change.thread_id == h.id then
                    wake = change
                end
            end
            local connection = assert(store.open())
            local result, pass_err = runner.on_wakes(connection, tostring(process.pid()), { { kind = "continue" }, wake })
            connection:release()
            assert(result, steps.detail(pass_err))
            test.eq(#result.owner_failures, 0)
            steps.retention_run()
            test.eq(life(h, id), "purged", "the wake must reach the target within two callbacks")
        end)

        test.it("reports eligibility that crosses the cutoff while another item is being purged", function()
            local h = trash_board()
            local other = trash_board()
            local expired, next_item = steps.create(h, "task"), steps.create(h, "task")
            steps.retention_sweep()
            trash_at(h, expired, clock.offset(-60))
            local future = clock.deadline(5000)
            local expected_deadline = future.ns // 1000000 + 1
            local other_deadline = expected_deadline - 1
            trash_at(h, next_item, future.at)
            append_probe.wait_on_purge(h.id, expired, future.at)
            start_at(h)
            -- Another board has an earlier wake outside this discovery page.
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_board SET retention_due_ms=$1 WHERE board_id=$2",
                { other_deadline, other.id }))
            assert(db:execute("UPDATE kickside_work_retention SET board_through=$1 WHERE owner_id='work'", { h.id }))
            db:release()
            local result = steps.retention_run()
            db = assert(store.open())
            local scheduled = assert(db:query("SELECT retention_due_ms FROM kickside_work_board WHERE board_id=$1", { h.id }))[1]
            db:release()
            test.eq(store.int(scheduled.retention_due_ms), expected_deadline)
            test.is_true(assert(store.int(result.deadline_ms)) <= other_deadline, "the owner must cover the earlier wake")
            test.is_true(result.needs_continue, "a deadline elapsed during the pass")
            test.eq(life(h, expired), "purged")
            test.eq(life(h, next_item), "trashed", "the target was future-eligible at collection")
        end)
        test.it("collects future-eligible trash at the reported deadline without another change", function()
            local pid,err=process.spawn_monitored(NAME,"app:processes")
            test.is_nil(err,steps.detail(err))
            child=pid
            steps.wait_for("retention startup",function(): boolean return process.registry.lookup(NAME,process.registry.CONSISTENT)~=nil end)
            local d=fixture.declaration(fixture.fresh_prefix())
            d.policy={trash_days=0}
            local h=fixture.board({declaration=d})
            local id=steps.create(h,"task")
            local future=clock.deadline(10000)
            assert(h.call("trusted_append",{thread_id=h.id,events={{type="kickside.work.events:item.deleted",subject="i:"..id,
                body={item=id,actor=h.actor:id(),at=future.at,source="retention_schedule_test"}}}}))
            assert(h.call("settle",{}))
            local db=assert(store.open())
            test.eq(assert(store.item(db,h.id,id)).life,"trashed")
            db:release()
            steps.wait_for("future scheduled purge",function(): boolean
                assert(h.call("settle",{}))
                local db=assert(store.open())
                local item=assert(store.item(db,h.id,id))
                db:release()
                return item.life=="purged"
            end)
        end)
    end)
end
return { run = test.run_cases(define) }
