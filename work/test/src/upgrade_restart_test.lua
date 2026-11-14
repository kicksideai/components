-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local json = require("json")
local jobs = require("jobs")
local function seed()
    test.describe("published predecessor recovery", function()
        test.it("persists a running legacy attempt without an enrolled timeout", function()
            local h = fixture.board({ declaration = { key_prefix = fixture.fresh_prefix(), fields = {},
                item_types = { { id = "task", fields = {}, process = "flow" } },
                processes = { { id = "flow", initial = "build", states = {
                    { id = "build", category = "started", kind = "automated", run = { stage = "build", on_fail = "stop" } },
                    { id = "stopped", category = "canceled" },
                }, transitions = { { id = "stop", from = { "build" }, to = "stopped" } } } } } })
            local id = steps.create(h,"task")
            local batch={}
            for chunk=1,6 do
                batch={}
                for _=1,(chunk==6 and 4 or 100) do batch[#batch+1]={op="create",type="task"} end
                local added=assert(steps.apply(h,batch))
                for _,outcome in ipairs(added.outcomes) do test.eq(outcome.status,"applied") end
            end
            local purged = steps.create(h,"task")
            steps.one(h,{op="delete",item=purged})
            local comment=steps.one(h,{op="comment",item=id,body="obsolete payload"}).comment
            steps.one(h,{op="comment",item=id,comment=comment,delete=true})
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life='purged',document='{}',process_data='{}' WHERE board_id=$1 AND item_id=$2",{h.id,purged}))
            assert(db:execute("UPDATE kickside_work_comment SET body='old deleted payload' WHERE board_id=$1",{h.id}))
            local item = assert(store.item(db,h.id,id))
            local work = item.work
            work.stage_visit,work.stage_visits,work.timer_due = nil,nil,nil
            work.entered_at = "2000-01-01T00:00:00.000000000Z"
            assert(db:execute("UPDATE kickside_work_item SET process_data=$1 WHERE board_id=$2 AND life<>'purged'",{json.encode(work),h.id}))
            assert(db:execute("UPDATE kickside_work_stage_run SET started='2000-01-01T00:00:00.000000000Z' WHERE board_id=$1",{h.id}))
            assert(db:execute("CREATE TABLE work_upgrade_fixture (board_id TEXT PRIMARY KEY,item_id TEXT NOT NULL,purged_item TEXT NOT NULL,rearmed_after TEXT,resume_after TEXT)"))
            assert(db:execute("INSERT INTO work_upgrade_fixture (board_id,item_id,purged_item) VALUES ($1,$2,$3)",{h.id,id,purged}))
            assert(db:execute("DELETE FROM _migrations WHERE id LIKE '%03_hardening%'"))
            local page=assert(db:query("SELECT id FROM kickside_job WHERE owner_id=$1 AND job_type='kickside.work.jobs:process' AND status='pending'",{h.id}))
            db:release()
            test.is_true(#page>=1)
            for _,job in ipairs(page) do assert(jobs.cancel(job.id)) end
            db=assert(store.open())
            test.eq(#assert(db:query("SELECT id FROM kickside_job WHERE owner_id=$1 AND job_type='kickside.work.jobs:process' AND status='pending'",{h.id})),0)
            db:release()
        end)
    end)
end
local function saved()
    local db=assert(store.open())
    local row=assert(db:query("SELECT * FROM work_upgrade_fixture",{}))[1]
    db:release()
    return row
end
local function interrupted()
    test.describe("interrupted recovery",function()
        test.it("commits four recovery batches and rearms before the next runtime restart",function()
            steps.wait_for("four recovery batches and native rearm",function()
                return saved().rearmed_after~=nil
            end)
            local row=saved()
            local db=assert(store.open())
            local recovery=assert(db:query("SELECT key,status FROM kickside_work_job WHERE board_id=$1 AND job_type='recovery'",{row.board_id}))[1]
            local recovered=assert(db:query("SELECT item_id FROM kickside_work_item WHERE board_id=$1 AND life<>'purged' AND item_id<=$2",{row.board_id,row.rearmed_after}))
            db:release()
            test.eq(#recovered,400)
            test.eq(json.decode(recovery.key).after,row.rearmed_after)
            test.is_true(recovery.status~="done")
        end)
    end)
end
local function verify()
    test.describe("published predecessor recovery", function()
        test.it("retires predecessor tombstone history and deleted comment payloads", function()
            local row=saved()
            local db=assert(store.open())
            test.eq(tonumber(assert(db:query("SELECT count(*) AS n FROM kickside_work_change WHERE board_id=$1 AND subject=$2",{row.board_id,"i:"..row.purged_item}))[1].n),0)
            test.eq(assert(db:query("SELECT body FROM kickside_work_comment WHERE board_id=$1",{row.board_id}))[1].body,"")
            db:release()
        end)
        test.it("automatically times out the legacy attempt after a real runtime restart", function()
            local row=saved()
            steps.wait_for("all 505 automatically recovered attempts",function()
                local db=assert(store.open())
                local count=tonumber(assert(db:query("SELECT count(*) AS n FROM kickside_work_stage_run WHERE board_id=$1 AND outcome='failed'",{row.board_id}))[1].n)
                db:release()
                return count==505
            end)
            local db=assert(store.open())
            local run=assert(db:query("SELECT outcome,outputs FROM kickside_work_stage_run WHERE board_id=$1 AND item_id=$2",{row.board_id,row.item_id}))[1]
            db:release()
            test.eq(run.outcome,"failed");test.eq(json.decode(run.outputs).error,"stage_timeout")
        end)
        test.it("persists the resume position between bounded recovery pages",function()
            local row=saved()
            local db=assert(store.open())
            local recovery=assert(db:query("SELECT key,status FROM kickside_work_job WHERE board_id=$1 AND job_type='recovery'",{row.board_id}))[1]
            db:release()
            test.not_nil(recovery)
            test.eq(recovery.status,"done")
            test.eq(row.resume_after,row.rearmed_after)
            test.is_true(json.decode(recovery.key).after>row.rearmed_after)
            test.is_true(json.decode(recovery.key).after~="", "the first bounded page persisted its resume position")
        end)
    end)
end
return {seed=test.run_cases(seed),interrupted=test.run_cases(interrupted),verify=test.run_cases(verify)}
