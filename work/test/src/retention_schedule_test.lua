-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local process = require("process")
local fixture = require("fixture")
local store = require("store")
local steps = require("steps")
local clock = require("clock")
local M = {}
local NAME = "kickside.core.retention.service:sweeper_process"
local function define()
    test.describe("retention scheduling", function()
        local child: string?
        local settings_board: fixture.Handle?
        test.after_each(function()
            if settings_board then
                assert(settings_board.call("unset_setting",{namespace="kickside.work",key="trash_days"}))
                settings_board=nil
            end
            if child then
                assert(process.terminate(child))
                child = nil
            end
        end)
        test.it("reschedules earlier eligibility after an application policy change", function()
            local pid,err=process.spawn_monitored(NAME,"app:processes")
            test.is_nil(err,steps.detail(err))
            child=pid
            steps.wait_for("retention startup",function(): boolean return process.registry.lookup(NAME,process.registry.CONSISTENT)~=nil end)
            local h=fixture.board()
            settings_board=h
            local id=steps.create(h,"task")
            steps.one(h,{op="delete",item=id})
            local db=assert(store.open())
            assert(db:execute("UPDATE kickside_work_retention SET board_after='',inclusive=0,item_after='',deadline_ms=NULL WHERE owner_id='work'",{}))
            db:release()
            assert(h.call("set_setting",{namespace="kickside.work",key="trash_days",value=0}))
            steps.create(h,"task")
            steps.wait_for("policy-driven purge",function(): boolean
                assert(h.call("settle",{}))
                local db=assert(store.open())
                local item=assert(store.item(db,h.id,id))
                db:release()
                return item.life=="purged"
            end)
        end)
        test.it("reports committed trash eligibility and collects it at the owner deadline", function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.policy = { trash_days = 0 }
            local h = fixture.board({ declaration = declaration })
            local id = steps.create(h, "task", { title = "Retained" })
            local future = clock.deadline(60000)
            assert(h.call("trusted_append", { thread_id = h.id, events = {
                { type = "kickside.work.events:item.deleted", subject = "i:" .. id,
                    body = { item = id, actor = h.actor:id(), at = future.at, source = "retention_schedule_test" } },
            } }))
            assert(h.call("settle", {}))
            for pass = 1, 2 do
                local db = assert(store.open())
                assert(db:execute("UPDATE kickside_work_retention SET board_after=$1,inclusive=1,item_after='',deadline_ms=NULL WHERE owner_id='work'", { h.id }))
                db:release()
                local _, result = steps.retention_sweep()
                test.is_false(result.needs_continue)
                assert(h.call("settle", {}))
                db = assert(store.open())
                local item = assert(store.item(db, h.id, id))
                db:release()
                if pass == 1 then
                    test.eq(item.life, "trashed")
                    test.eq(result.deadline_ms, future.ns // 1000000 + 1)
                    steps.wait_for("owner eligibility deadline", function(): boolean
                        return clock.deadline(0).ns // 1000000 >= result.deadline_ms
                    end)
                else
                    test.eq(item.life, "purged")
                end
            end
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
