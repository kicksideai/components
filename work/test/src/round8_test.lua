-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local fixture=require("fixture")
local steps=require("steps")
local store=require("store")
local limits=require("limits")
local threads=require("threads")
local defaults=require("defaults")
local time=require("time")
local sql=require("sql")
local clock=require("clock")
local plugin_batch=require("plugin_batch")
local probe=require("probe")
local function define()
    test.describe("retired items, protected reads and projection budgets",function()
        local held: fixture.Handle?
        test.after_each(function()
            if held then
                for key in pairs(limits.DEFINITIONS) do assert(held.call("unset_setting",{namespace="kickside.work",key=key})) end
                held=nil
            end
        end)
        test.it("migrates past a retained retired tombstone and rebuild skips purged identities",function()
            local h=fixture.board();held=h
            for key,value in pairs({rebuild_batch=1,rebuild_batches_per_run=1,migration_batch=1,migration_batches_per_run=1}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=value}).success)
            end
            local ids: {string}={}
            for _=1,6 do ids[#ids+1]=steps.create(h,"task",{estimate=1}) end
            table.sort(ids)
            steps.one(h,{op="delete",item=ids[1]})
            assert(h.call("trusted_append",{thread_id=h.id,events={{type="kickside.work.events:item.purged",subject="i:" .. ids[1],body={item=ids[1],actor="system:kickside.work.retention",at=clock.now(),source="retention"}}}}))
            assert(h.call("settle",{}))
            test.is_nil(threads.retire(h.id,{"i:" .. ids[1]}))
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
                    test.eq(assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id=$1 AND life<>'purged' AND item_id>$2 AND item_id<=$3",{h.id,span.after,span.through})),1)
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

        test.it("settles advance and timer admission after permanent retirement",function()
            local h=fixture.board()
            local id=steps.create(h,"task")
            steps.one(h,{op="delete",item=id})
            assert(h.call("trusted_append",{thread_id=h.id,events={{type="kickside.work.events:item.purged",subject="i:" .. id,body={item=id,actor="system:kickside.work.retention",at=clock.now(),source="retention"}}}}))
            assert(h.call("settle",{}))
            test.is_nil(threads.retire(h.id,{"i:" .. id}))
            local before=#steps.events(h)
            for _,worker in ipairs({"advance","process"}) do
                local result,err=h.call("worker_batch",{worker=worker,item=id,state="open",visit=1,timer="stale"})
                test.is_nil(err,tostring(err));test.not_nil(result)
                test.eq(result.record.status,"completed")
            end
            test.eq(#steps.events(h),before)
        end)
        test.it("bounds protected approval and generation inspection and continues",function()
            local h=fixture.board()
            local id=steps.create(h,"task")
            local db=assert(store.open());local tx=assert(db:begin())
            assert(tx:execute("UPDATE kickside_work_board SET generation=30000 WHERE board_id=$1",{h.id}))
            assert(tx:execute([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<20000)
                INSERT INTO kickside_work_generation (board_id,generation,declaration,compiled,maps,digest,class,actor,applied_seq,applied_at)
                SELECT g.board_id,n+1,g.declaration,g.compiled,g.maps,g.digest,g.class,g.actor,g.applied_seq,'2000'
                FROM numbers CROSS JOIN kickside_work_generation g WHERE g.board_id=$1 AND g.generation=1]],{h.id}))
            assert(tx:execute([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<20000)
                INSERT INTO kickside_work_approval (board_id,item_id,visit,actor,decision,at)
                SELECT $1,$2,1,'actor-' || n,'approve','2000' FROM numbers]],{h.id,id}))
            assert(tx:commit());db:release()
            local base=assert(defaults.read())
            local cursor=""
            local seen=false
            for _=1,4 do
                local page=assert(steps.retention_prune(h.id,base,100,cursor))
                test.is_true((page.spent or page.removed)<=100)
                test.is_true((page.examined or 0)>0,"retained candidates consume inspection budget")
                test.is_true(page.more,"a full protected page continues")
                test.not_nil(page.cursor);test.is_true(page.cursor~=cursor)
                cursor=page.cursor;seen=true
            end
            test.is_true(seen)
            db=assert(store.open())
            test.eq(assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_generation WHERE board_id=$1 AND generation>1",{h.id})),20000)
            test.eq(assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_approval WHERE board_id=$1",{h.id})),20000)
            assert(db:execute("DELETE FROM kickside_work_generation WHERE board_id=$1 AND generation>1",{h.id}))
            assert(db:execute("DELETE FROM kickside_work_approval WHERE board_id=$1",{h.id}))
            assert(db:execute("UPDATE kickside_work_board SET generation=1 WHERE board_id=$1",{h.id}));db:release()
        end)
        test.it("sets PostgreSQL timeout from the remaining deadline",function()
            local statements: {string}={}
            local tx={execute=function(_self: unknown,statement: string,_params: {unknown}): (unknown,error?)
                statements[#statements+1]=statement;return {},nil
            end}
            local until_at=clock.deadline(10000)
            test.is_nil(store.read_snapshot(tx :: any,until_at))
            local milliseconds=statements[2]:match("(%d+)ms")
            test.not_nil(milliseconds,"statement timeout consumes the effective allowance")
            local timeout=tonumber(milliseconds)
            test.not_nil(timeout);test.is_true(timeout>9000 and timeout<=10000)
            statements={}
            test.is_nil(store.read_snapshot(tx :: any,clock.deadline(25)))
            timeout=tonumber(statements[2]:match("(%d+)ms"))
            test.is_true(timeout>=1 and timeout<=25)
            local err=store.read_snapshot(tx :: any,clock.deadline(-1))
            test.not_nil(err);test.eq(err:kind(),errors.TIMEOUT)
        end)
        test.it("runs a three second PostgreSQL read with a raised setting and honors a shorter caller deadline",function()
            local db=assert(store.open());local dialect=db:type();db:release()
            if dialect~="postgres" then return end
            local h=fixture.board();held=h
            assert(h.call("set_setting",{namespace="kickside.work",key="read_deadline_ms",value=10000}).success)
            local result,err=h.executor:call("app:round8_read_budget",{board_id=h.id,seconds=3})
            test.is_nil(err,tostring(err));test.not_nil(result)
            result,err=h.executor:call("app:round8_read_budget",{board_id=h.id,seconds=0.3,budget={deadline=clock.deadline(100).at}})
            test.is_nil(result);test.not_nil(err)
        end)
        test.it("bounds internal storage chunks with committed settings",function()
            local h=fixture.board();held=h
            assert(h.call("set_setting",{namespace="kickside.work",key="storage_batch",value=1}).success)
            local calls=0
            local db={query=function(_self: unknown,_statement: string,params: {unknown})
                calls=calls+1
                test.is_true(#params<=2,"one board binding and one item per statement")
                return {},nil
            end}
            local items,err=store.items(db :: any,h.id,{"a","b","c"})
            test.is_nil(err,tostring(err));test.eq(#items,0);test.eq(calls,3)
        end)
        test.it("uses settings for projection registration discovery and removal pages",function()
            local h=fixture.board();held=h
            for key in pairs({plugin_batch=true,plugin_batches_per_run=true,plugin_projection_batch=true,plugin_discovery_batch=true}) do
                assert(h.call("set_setting",{namespace="kickside.work",key=key,value=1}).success)
            end
            probe.reset(false)
            local page=assert(plugin_batch.batch({board_id="fixture"}))
            test.is_false(page.done)
            test.eq(probe.counts().registered,1)
            test.eq(probe.counts().limit,1)
            probe.reset(true)
            page=assert(plugin_batch.batch({board_id="fixture"}))
            test.eq(probe.counts().removed,1)
            test.eq(probe.counts().limit,1)
        end)
    end)
end
return {run=test.run_cases(define)}
