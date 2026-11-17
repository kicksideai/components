-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local observer = require("observer")
local durations = require("durations")
local budget = require("budget")
local job_deadline = require("job_deadline")
local clock = require("clock")
local operations = require("operations")
local function define()
    test.describe("final backend review", function()
        local setting_owner: fixture.Handle?
        test.after_each(function()
            if setting_owner then
                for _,key in ipairs({"comments_per_item","command_deadline_ms","read_deadline_ms","retention_batch","bulk_batch_items","bulk_batch_ops"}) do
                    assert(setting_owner.call("unset_setting",{namespace="kickside.work",key=key}))
                end
                setting_owner=nil
            end
        end)
        test.it("deletes incoming links in bounded complete-key pages without touching surviving targets", function()
            local target, a, b = fixture.board(), fixture.board(), fixture.board()
            local id = steps.create(target,"task")
            local survivor = steps.create(a,"task")
            local db = assert(store.open())
            local tx = assert(db:begin())
            for i=1,205 do
                for _, source in ipairs({a,b}) do
                    assert(tx:execute([[INSERT INTO kickside_work_link (board_id,from_id,type,to_board_id,to_id,at,seq)
                        VALUES ($1,$2,'relates',$3,$4,'2000',1)]],{source.id,"same-" .. i,target.id,id}))
                end
            end
            assert(tx:execute([[INSERT INTO kickside_work_link (board_id,from_id,type,to_board_id,to_id,at,seq)
                VALUES ($1,'same-1','relates',$2,$3,'2000',1)]],{b.id,a.id,survivor}))
            assert(tx:commit());db:release()
            assert(target.call("delete",{}));steps.deleted(target.id)
            db=assert(store.open())
            local dead=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_link WHERE to_board_id=$1",{target.id}))
            local kept=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_link WHERE board_id=$1 AND to_board_id=$2",{b.id,a.id}))
            db:release()
            test.eq(dead,0);test.eq(kept,1)
            local pages=observer.pages(target.id)
            local deleted=0
            for _,page in ipairs(pages) do
                test.is_true(tonumber(page.removed)<=100)
                deleted=deleted+(tonumber(page.removed) :: integer)
            end
            test.is_true(deleted>=410,"incoming rows count against shared teardown budget")
        end)
        test.it("rejects unrepresentable retention windows in settings and declarations", function()
            local h=fixture.board()
            setting_owner=h
            for _,key in ipairs({"audit_days","trash_days","tombstone_days","interval_days"}) do
                for _,value in ipairs({106752,1152921504606846976}) do
                    local out,err=h.call("plan_schema",{declaration={policy={[key]=value}}})
                    test.is_nil(out,key);test.not_nil(err,key);test.eq(err:kind(),errors.INVALID,key)
                    test.eq(err:details().code,"invalid_policy",key)
                    local setting,serr=h.call("set_setting",{namespace="kickside.work",key=key,value=value})
                    test.is_true(serr~=nil or not setting or setting.success~=true,key)
                end
                test.not_nil(assert(h.call("plan_schema",{declaration={policy={[key]=106751}}})))
            end
        end)
        test.it("rejects ISO duration overflow before integer arithmetic", function()
            for _,raw in ipairs({"P106752D","P1152921504606846976D","PT9223372037S","PT999999999999999999999999999999999999H"}) do
                local seconds,err=durations.duration(raw)
                test.is_nil(seconds,raw);test.not_nil(err,raw);test.eq(err:kind(),errors.INVALID)
            end
            test.eq(assert(durations.duration("P106751D")),9223286400)
        end)
        test.it("rejects unknown WIP states including removal of a referenced state", function()
            local h=fixture.board({declaration=fixture.workflow(fixture.fresh_prefix())})
            setting_owner=h
            local out,err=h.call("plan_schema",{declaration={policy={wip={reveiw={limit=1,hard=true}}}}})
            test.is_nil(out);test.not_nil(err);test.eq(err:kind(),errors.INVALID);test.eq(err:details().code,"wip_state_unknown")
            assert(h.call("apply_schema",{declaration={policy={wip={review={limit=1,hard=true}}}}}))
            local d=fixture.workflow(h.prefix)
            for _,p in ipairs(d.processes) do
                local states={}
                for _,s in ipairs(p.states) do if s.id~="review" then states[#states+1]=s end end
                p.states=states
                local transitions={}
                for _,t in ipairs(p.transitions or {}) do if t.to~="review" then
                        if type(t.from)=="table" then
                            local from={}
                            for _,state in ipairs(t.from) do if state~="review" then from[#from+1]=state end end
                            t.from=from
                        end
                        transitions[#transitions+1]=t
                    end end
                p.transitions=transitions
            end
            local _,removed=h.call("plan_schema",{declaration={processes=d.processes}})
            test.not_nil(removed);test.eq(removed:kind(),errors.INVALID)
        end)
        test.it("uses the configured live comment admission and permits a board override", function()
            local h=fixture.board()
            setting_owner=h
            assert(h.call("set_setting",{namespace="kickside.work",key="comments_per_item",value=1}).success)
            local id=steps.create(h,"task")
            local first=steps.one(h,{op="comment",item=id,body="first"})
            local second=steps.one(h,{op="comment",item=id,body="second"})
            assert(h.call("unset_setting",{namespace="kickside.work",key="comments_per_item"}))
            test.eq(first.status,"applied");test.eq(second.status,"invalid");test.eq(second.findings[1].code,"comments_limit")
            assert(h.call("apply_schema",{declaration={policy={comments_per_item=2}}}))
            test.eq(steps.one(h,{op="comment",item=id,body="second"}).status,"applied")
        end)
        test.it("raises command and read deadlines through validated settings", function()
            local h=fixture.board()
            setting_owner=h
            for _,key in ipairs({"command_deadline_ms","read_deadline_ms"}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=10000}).success)
            end
            local before=clock.deadline(0).ns
            local command=assert(job_deadline.bound(nil))
            local read=assert(budget.start(nil))
            for _,key in ipairs({"command_deadline_ms","read_deadline_ms"}) do assert(h.call("unset_setting",{namespace="kickside.work",key=key})) end
            test.is_true(command.ns-before>8000000000)
            test.is_true(read.deadline.ns-before>8000000000)
            local caller=clock.deadline(10)
            local short=assert(budget.start({deadline=caller.at}))
            test.eq(short.deadline.ns,caller.ns)
        end)
        test.it("uses configured retention pages and bulk item and apply chunks", function()
            local h=fixture.board()
            setting_owner=h
            operations.gate(h)
            for i=1,7 do steps.create(h,"task",{estimate=1}) end
            for key,value in pairs({retention_batch=205,bulk_batch_items=3,bulk_batch_ops=2}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=value}).success)
            end
            local db=assert(store.open())
            local tx=assert(db:begin())
            for i=1,410 do
                assert(tx:execute([[INSERT INTO kickside_work_receipt (board_id,command_key,request_hash,principal,at,result,seq)
                    VALUES ($1,$2,'hash','fixture','2000-01-01T00:00:00.000000000Z','{}',1)]],{h.id,"limits-" .. i}))
            end
            assert(tx:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,board_scan='all',deadline_ms=NULL WHERE owner_id='work'",{h.id}))
            assert(tx:commit());db:release()
            local result=steps.retention_run()
            db=assert(store.open())
            local left=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_receipt WHERE board_id=$1 AND command_key LIKE 'limits-%'",{h.id}))
            db:release()
            -- The shared budget includes eligible nonfixture receipts as well.
            test.is_true(left>=205 and left<410,"configured retention ceiling: " .. left)
            test.is_true(result.needs_continue)
            local started=assert(h.call("bulk",{key="tuned",query={},ops_template={{op="set",values={estimate=2}}}}))
            operations.gate(h,true)
            local done=operations.finished(h,started.bulk_id)
            test.eq(done.status,"done");test.eq(done.processed,7)
            local progress={}
            for _,event in ipairs(steps.events(h)) do
                if event.type=="kickside.work.events:bulk.progress" then progress[#progress+1]=event.body.processed end
            end
            test.eq(#progress,3);test.eq(progress[1],3);test.eq(progress[2],6);test.eq(progress[3],7)
            db=assert(store.open())
            local chunks=assert(db:query("SELECT n FROM app_work_bulk_chunks WHERE board_id=$1 ORDER BY first_key",{h.id}))
            db:release()
            local total=0
            for _,chunk in ipairs(chunks) do test.is_true(tonumber(chunk.n)<=2);total=total+(tonumber(chunk.n) :: integer) end
            test.eq(total,7)
            for _,key in ipairs({"retention_batch","bulk_batch_items","bulk_batch_ops"}) do assert(h.call("unset_setting",{namespace="kickside.work",key=key})) end
        end)
        test.it("refuses templates larger than the configured bulk apply chunk", function()
            local h=fixture.board()
            setting_owner=h
            assert(h.call("set_setting",{namespace="kickside.work",key="bulk_batch_ops",value=1}).success)
            local out,err=h.call("bulk",{key="large-template",query={},ops_template={
                {op="set",values={estimate=2}},{op="set",values={title="updated"}}}})
            test.is_nil(out);test.not_nil(err);test.eq(err:kind(),errors.INVALID);test.eq(err:details().code,"bulk_template_limit")
        end)
        test.it("validates operational controls and their safe ceilings", function()
            local h=fixture.board()
            setting_owner=h
            local bounds={comments_per_item={1,100000},command_deadline_ms={1,60000},read_deadline_ms={1,60000},
                retention_batch={205,5000},bulk_batch_items={1,2000},bulk_batch_ops={1,200}}
            for key,range in pairs(bounds) do
                for _,value in ipairs({range[1]-1,range[2]+1,1.5}) do
                    local out,err=h.call("set_setting",{namespace="kickside.work",key=key,value=value})
                    test.is_true(err~=nil or not out or out.success~=true,key)
                end
                for _,value in ipairs(range) do
                    local out,err=h.call("set_setting",{namespace="kickside.work",key=key,value=value})
                    test.is_nil(err,steps.detail(err));test.is_true(out.success,key)
                end
                assert(h.call("unset_setting",{namespace="kickside.work",key=key}))
            end
        end)
    end)
end
return {run=test.run_cases(define)}
