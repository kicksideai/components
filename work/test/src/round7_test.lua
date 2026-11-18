-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local fixture=require("fixture")
local steps=require("steps")
local store=require("store")
local operations=require("operations")
local durations=require("durations")
local rows=require("rows")
local defaults=require("defaults")
local limits=require("limits")
local function define()
    test.describe("round 7 backend",function()
        local held: fixture.Handle?
        test.after_each(function()
            if held then
                for key in pairs(limits.DEFINITIONS) do assert(held.call("unset_setting",{namespace="kickside.work",key=key})) end
                held=nil
            end
        end)
        test.it("rejects positive subnanosecond durations even with signed and zero options",function()
            for _,raw in ipairs({"PT0.0000000001S","PT0.0000000009S","PT0." .. string.rep("0",400) .. "1S"}) do
                for _,options in ipairs({{}, {zero=true}, {signed=true}}) do
                    local value,err=durations.duration(raw,options)
                    test.is_nil(value,raw);test.not_nil(err);test.eq(err:kind(),errors.INVALID)
                end
            end
            local negative,err=durations.duration("-PT0.0000000001S",{signed=true,zero=true})
            test.is_nil(negative);test.eq(err:kind(),errors.INVALID)
            test.eq(assert(durations.duration("PT0S",{zero=true})),0)
            test.eq(assert(durations.after("2026-01-01T00:00:00.000000000Z","PT0.000000001S")),"2026-01-01T00:00:00.000000001Z")
        end)
        test.it("replays an accepted bulk chunk after both batching settings change",function()
            local h=fixture.board();held=h
            operations.gate(h)
            for _=1,5 do steps.create(h,"task",{estimate=1}) end
            for key,value in pairs({bulk_batch_items=4,bulk_batch_ops=2}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=value}).success)
            end
            operations.page_gate(h,false)
            local db=assert(store.open())
            assert(db:execute("UPDATE work_bulk_page_gate SET interrupt=2 WHERE board_id=$1",{h.id}));db:release()
            local started=assert(h.call("bulk",{key="settings-replay",query={},ops_template={{op="set",values={estimate=2}}}}))
            operations.gate(h,true)
            steps.wait_for("first accepted chunk",function(): boolean
                local db=assert(store.open())
                local gate=assert(db:query("SELECT arrived FROM work_bulk_page_gate WHERE board_id=$1",{h.id}))[1]
                db:release();return tonumber(gate.arrived)==1
            end)
            for key,value in pairs({bulk_batch_items=1,bulk_batch_ops=1}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=value}).success)
            end
            db=assert(store.open());assert(db:execute("UPDATE work_bulk_page_gate SET released=1 WHERE board_id=$1",{h.id}));db:release()
            local done=operations.finished(h,started.bulk_id)
            test.eq(done.status,"done");test.eq(done.processed,5);test.eq(done.applied,5)
            local items=assert(h.call("query",{})).items
            for _,item in ipairs(items) do test.eq(item.version,2);test.eq(item.values.estimate,2) end
        end)
        test.it("continues an idle pass across 20000 surviving visibility baselines",function()
            local h=fixture.board()
            local id=steps.create(h,"task")
            local db=assert(store.open());local tx=assert(db:begin())
            assert(tx:execute([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<20000)
                INSERT INTO kickside_work_item
                (board_id,item_id,number,type,state,category,process_generation,visit,path,version,life,document,created_seq,updated_seq,created_at,updated_at)
                SELECT i.board_id,'baseline-' || n,100000+n,i.type,i.state,i.category,i.process_generation,i.visit,i.path,i.version,'live',i.document,1,1,i.created_at,i.updated_at
                FROM numbers CROSS JOIN kickside_work_item i WHERE i.board_id=$1 AND i.item_id=$2]],{h.id,id}))
            assert(tx:execute([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<20000)
                INSERT INTO kickside_work_visibility (board_id,item_id,seq,document,at)
                SELECT $1,'baseline-' || n,1000+n,'{}','2000' FROM numbers]],{h.id}))
            assert(tx:execute("UPDATE kickside_work_board SET tombstone_floor_seq=22000 WHERE board_id=$1",{h.id}))
            assert(tx:commit());db:release()
            local base=assert(defaults.read())
            local first=assert(steps.retention_prune(h.id,base,100,""))
            local second=assert(steps.retention_prune(h.id,base,100,first.cursor))
            test.is_true(first.more);test.is_true(second.more)
            test.is_true(first.examined<=50);test.is_true(second.examined<=50)
            test.is_true(first.cursor~=second.cursor,"keyset advances through surviving baselines")
            test.is_true(first.spent<=100);test.is_true(second.spent<=100)
            db=assert(store.open())
            local snapshot=assert(store.board(db,h.id))
            db:release()
            local position = { board_after = h.id, inclusive = 1, board_scan = "all", discovery_turn = 0, pending_page_budget = 0 }
            test.is_nil((rows.advance(position, {{board_id=h.id,applied_seq=snapshot.applied_seq,after=second.cursor,due_ms=0}})))
            db=assert(store.open())
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~' WHERE owner_id='work'",{}))
            db:release()
            test.is_true(steps.retention_run().needs_continue)
            db=assert(store.open())
            local saved=assert(db:query("SELECT retention_after FROM kickside_work_board WHERE board_id=$1",{h.id}))[1]
            db:release()
            test.is_true(type(saved.retention_after) == "string")
            test.is_true(saved.retention_after~=second.cursor,"the owner persists inspection continuation")
            db=assert(store.open())
            test.eq(assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_visibility WHERE board_id=$1 AND item_id LIKE 'baseline-%'",{h.id})),20000)
            -- Release the large synthetic population before unrelated harness cases.
            assert(db:execute("DELETE FROM kickside_work_visibility WHERE board_id=$1 AND item_id LIKE 'baseline-%'",{h.id}))
            assert(db:execute("DELETE FROM kickside_work_item WHERE board_id=$1 AND item_id LIKE 'baseline-%'",{h.id}))
            db:release()
        end)
        test.it("bounds visibility candidate work and continues past retained baselines",function()
            local h=fixture.board()
            local id=steps.create(h,"task")
            local db=assert(store.open());local tx=assert(db:begin())
            for i=1,600 do
                assert(tx:execute("INSERT INTO kickside_work_visibility (board_id,item_id,seq,document,at) VALUES ($1,$2,$3,'{}','2000')",{h.id,id,1000+i}))
            end
            assert(tx:execute("UPDATE kickside_work_board SET tombstone_floor_seq=2000 WHERE board_id=$1",{h.id}))
            assert(tx:commit());db:release()
            local base=assert(defaults.read())
            local cursor=""
            local scanned=0
            for _=1,20 do
                local page=assert(steps.retention_prune(h.id,base,100,cursor)) :: {examined: integer?, cursor: string?, more: boolean}
                test.is_true((page.examined or 0)<=100)
                scanned=scanned+(page.examined or 0)
                cursor=page.cursor or ""
                if not page.more then break end
            end
            test.is_true(scanned>=600,"candidate work is accounted")
            db=assert(store.open())
            test.eq(assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_visibility WHERE board_id=$1 AND seq<=2000",{h.id})),1)
            db:release()
        end)
        test.it("executes rebuild and follow migration in configured one-item batches",function()
            local h=fixture.board();held=h
            for key,value in pairs({rebuild_batch=1,rebuild_batches_per_run=1,migration_batch=1,migration_batches_per_run=1}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=value}).success)
            end
            for _=1,5 do steps.create(h,"task",{estimate=1}) end
            assert(h.call("apply_schema",{declaration={
                fields={{code="child_count",type="rollup",form="int",of="children",fn="count"}},
                item_types={{id="task",process="delivery",fields={"title","estimate","child_count"}}}
            }}))
            steps.rebuilt(h.id,"recompute")
            local ranges=0
            local db=assert(store.open())
            for _,event in ipairs(steps.events(h)) do
                if event.type=="kickside.work.events:rollups.recomputed" then
                    local span=event.body.recompute
                    test.eq(assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id=$1 AND item_id>$2 AND item_id<=$3",{h.id,span.after,span.through})),1)
                    ranges=ranges+1
                end
            end
            db:release();test.eq(ranges,5)
            assert(h.call("apply_schema",{declaration={processes={{id="delivery",initial="backlog",migration="follow",map={open="backlog"},states={{id="backlog",category="started"}}}}}}))
            steps.wait_for("five migrated items",function(): boolean
                local db=assert(store.open())
                local n=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id=$1 AND state='backlog'",{h.id}))
                db:release();return n==5
            end)
            local times: {[string]:integer}={}
            for _,event in ipairs(steps.events(h)) do
                if event.type=="kickside.work.events:item.migrated" then times[event.body.at]=(times[event.body.at] or 0)+1 end
            end
            local count=0
            for _,n in pairs(times) do test.eq(n,1);count=count+n end
            test.eq(count,5)
        end)
        test.it("limits pack effects with committed settings",function()
            local h=fixture.board();held=h
            for key,value in pairs({pack_steps_per_run=1}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=value}).success)
            end
            local plan=assert(h.call("pack_plan",{board_id=h.id,pack="app:kanban_pack",expected_generation=1}))
            local owner=assert(h.call("pack_owner",{key="one-step",data={plan=plan,expected_generation=1,starter=false}}))
            local done,err=h.call("pack_step",owner)
            test.is_nil(err,tostring(err));test.is_false(done)
            local db=assert(store.open())
            local progress=assert(db:query("SELECT processed FROM kickside_work_operation WHERE board_id=$1 AND operation_id=$2",{h.id,owner.operation_id}))[1]
            test.eq(tonumber(progress.processed),1)
            db:release()
        end)
        test.it("validates install throughput controls and preserves defaults",function()
            local h=fixture.board();held=h
            local bounds={storage_batch={100,1,1000},plugin_projection_batch={20,1,100},plugin_discovery_batch={200,1,200},projection_catchup_ticks={1000,1,100000},cleanup_batch={100,1,5000},plugin_batch={20,1,100},plugin_batches_per_run={1,1,100},rebuild_batch={500,1,500},rebuild_batches_per_run={20,1,100},migration_batch={500,1,500},migration_batches_per_run={20,1,100},rebalance_batch={500,1,500},rebalance_batches_per_run={20,1,100},pack_steps_per_run={20,1,100},operation_batches_per_run={20,1,100}}
            for key,rule in pairs(bounds) do
                for _,value in ipairs({rule[2]-1,rule[3]+1,1.5}) do
                    local out,err=h.call("set_setting",{namespace="kickside.work",key=key,value=value})
                    test.is_true(err~=nil or not out or not out.success,key)
                end
                for _,value in ipairs({rule[2],rule[3]}) do
                    local out=assert(h.call("set_setting",{namespace="kickside.work",key=key,value=value}))
                    test.is_true(out.success,key);test.eq(assert(limits.read())[key],value)
                end
                assert(h.call("unset_setting",{namespace="kickside.work",key=key}))
                test.eq(assert(limits.read())[key],rule[1],key)
            end
        end)
    end)
end
return {run=test.run_cases(define)}
