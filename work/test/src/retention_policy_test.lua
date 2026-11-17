-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local uuid = require("uuid")
local tables = require("tables")
local race = require("race")
local rows = require("rows")
local policy = require("policy")
local jobs = require("jobs")
local lifecycle = require("lifecycle")
local operations = require("operations")
local clock = require("clock")
local M = {}
local OLD = "2000-01-01T00:00:00.000000000Z"

local count = steps.count_rows

local function set_count(board_id: string, item_id: string): integer
    local db = assert(store.open())
    local rows = assert(db:query("SELECT COUNT(*) AS n FROM " .. tables.names(board_id).set .. " WHERE item_id = $1", { item_id }))
    db:release()
    return tonumber(rows[1].n) :: integer
end

-- A collection allowance includes retained inspection, so every subsequent
-- page resumes its returned keyset even when it removed no rows.
local function prune_all(board_id: string, limit: integer): (integer,integer)
    local total=0
    for _,name in ipairs({"receipt","key_alias","change","interval","generation","approval","stage_run","job","visibility","comment"}) do
        total=total+count("kickside_work_" .. name,board_id)
    end
    local cursor=""
    local removed,pages=0,0
    while true do
        local page=assert(rows.prune(board_id,policy.DEFAULTS,limit,cursor))
        test.is_true((page.spent or page.removed)<=limit,"inspection and deletion share the allowance")
        removed=removed+page.removed;pages=pages+1
        if not page.more then return removed,pages end
        if page.removed==0 then test.not_nil(page.cursor);test.is_true(page.cursor~=cursor,"retained candidates advance") end
        cursor=page.cursor or cursor
        assert(pages<=total*3+32,"a stable fixture drains within its candidate and deletion work")
    end
end

local sweep = steps.retention_sweep

local function define()
    test.describe("board retention policy", function()
        test.it("reaches the next board while one earlier board receives expired comments", function()
            local left, right = fixture.board(), fixture.board()
            local first, second = left, right
            if first.id > second.id then first, second = second, first end
            local item = steps.create(first, "task")
            steps.create(second, "task")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_change SET at=$1 WHERE board_id=$2", { OLD, second.id }))
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,pending_only=0,deadline_ms=NULL WHERE owner_id='work'", { first.id }))
            db:release()
            for _ = 1, 4 do
                local comment = steps.one(first, { op = "comment", item = item, body = "Expired comment" }).comment
                test.eq(steps.one(first, { op = "comment", item = item, comment = comment, delete = true }).status, "applied")
                db = assert(store.open())
                assert(db:execute("UPDATE kickside_work_comment SET edited_at=$1 WHERE board_id=$2 AND comment_id=$3", { OLD, first.id, comment }))
                db:release()
                steps.retention_run()
                test.eq(steps.count_rows("kickside_work_comment", first.id), 0)
            end
            test.eq(steps.count_rows("kickside_work_change", second.id), 0, "eligible rows on the second board must make progress")
        end)

        test.it("rotates after a full comment page and resumes the unfinished board", function()
            local first, second = fixture.board(), fixture.board()
            if first.id > second.id then first, second = second, first end
            local item = steps.create(first, "task")
            steps.create(second, "task")
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<203)
                INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at,edited_at)
                SELECT $1,'expired-' || n,$2,'','[]','fixture',1,1,$3,$3 FROM numbers]], { first.id, item, OLD }))
            assert(db:execute("UPDATE kickside_work_change SET at=$1 WHERE board_id=$2", { OLD, second.id }))
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,pending_only=0,deadline_ms=NULL WHERE owner_id='work'", { first.id }))
            db:release()
            assert(first.call("set_setting", { namespace = "kickside.work", key = "retention_batch", value = 205 }))
            local ok, err = pcall(function()
                test.is_true(steps.retention_run().needs_continue)
                test.eq(count("kickside_work_comment", first.id), 103)
                steps.retention_sweep(function(): boolean return count("kickside_work_change", second.id) == 0 end)
                test.eq(count("kickside_work_comment", first.id), 103)
                steps.retention_sweep(function(): boolean return count("kickside_work_comment", first.id) == 0 end)
            end)
            assert(first.call("unset_setting", { namespace = "kickside.work", key = "retention_batch" }))
            assert(ok, tostring(err))
        end)

        test.it("preserves command replay for the board's stored event window", function()
            local board = fixture.board()
            local ops = { { op = "create", type = "task", values = { title = "One item" } } }
            local options = { key = "audit-window-retry" }
            local original = assert(steps.apply(board, ops, options))
            test.eq(original.outcomes[1].status, "applied")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_retention_policy SET event_hot_retention_days=365 WHERE thread_id=$1", { board.id }))
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_retention_policy WHERE thread_id=$1 AND event_hot_retention_days=365", { board.id })), 1)
            assert(db:execute("UPDATE kickside_work_receipt SET at=$1 WHERE board_id=$2", { clock.offset(-120 * 86400), board.id }))
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,pending_only=0,deadline_ms=NULL WHERE owner_id='work'", { board.id }))
            db:release()
            steps.retention_sweep()
            local retry = assert(steps.apply(board, ops, options))
            test.eq(retry.outcomes[1].item, original.outcomes[1].item, "a retry inside the effective event window must replay")
            test.eq(assert(board.call("count", {})).total, 1)

            db = assert(store.open())
            assert(db:execute("UPDATE kickside_retention_policy SET event_hot_retention_days=7,enabled=FALSE WHERE thread_id=$1", { board.id }))
            db:release()
            steps.retention_sweep()
            test.eq(assert(steps.apply(board, ops, options)).outcomes[1].item, original.outcomes[1].item)

            db = assert(store.open())
            assert(db:execute("UPDATE kickside_retention_policy SET enabled=TRUE WHERE thread_id=$1", { board.id }))
            db:release()
            steps.retention_sweep(function(): boolean return count("kickside_work_receipt", board.id) == 0 end)
            test.is_true(assert(steps.apply(board, ops, options)).outcomes[1].item ~= original.outcomes[1].item)
        end)

        test.it("retires purged item and comment subjects in bounded owner pages", function()
            local h=fixture.board()
            local id=steps.create(h,"task")
            local live=steps.create(h,"task")
            local retired={id}
            for _=1,4 do retired[#retired+1]=steps.create(h,"task") end
            local db=assert(store.open())
            local tx=assert(db:begin())
            for i=1,205 do
                local cid="retire-" .. i
                assert(tx:execute([[INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at)
                    VALUES ($1,$2,$3,'old','[]','fixture',1,0,$4)]],{h.id,cid,id,OLD}))
                assert(tx:execute("INSERT INTO kickside_thread_subject (thread_id,subject,version,last_seq,updated_at) VALUES ($1,$2,1,1,'2000-01-01T00:00:00Z')",{h.id,"c:" .. cid}))
            end
            assert(tx:commit());db:release()
            for _,item in ipairs(retired) do test.eq(steps.one(h,{op="delete",item=item}).status,"applied") end
            db=assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at=$1 WHERE board_id=$2 AND life='trashed'",{OLD,h.id}))
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,pending_only=0,deadline_ms=NULL WHERE owner_id='work'",{h.id}))
            db:release()
            local previous,pages=205,0
            sweep(function(): boolean
                assert(h.call("settle",{}))
                local db=assert(store.open())
                local n=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_thread_subject WHERE thread_id=$1 AND subject LIKE 'c:retire-%'",{h.id}))
                local pending=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id=$1 AND purge_pending=1",{h.id}))
                local purged=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id=$1 AND life='purged'",{h.id}))
                db:release()
                test.is_true(previous-n<=100,"one bounded comment retirement page")
                if n<previous then pages=pages+1 end
                previous=n
                return pending==0 and purged==5
            end)
            db=assert(store.open())
            local dead=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_thread_subject WHERE thread_id=$1 AND ((subject LIKE 'i:%' AND subject<>$2) OR subject LIKE 'c:retire-%')",{h.id,"i:" .. live}))
            local kept=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_thread_subject WHERE thread_id=$1 AND subject=$2",{h.id,"i:" .. live}))
            db:release()
            test.eq(dead,0);test.eq(kept,1)
            test.is_true(pages>=3)
            test.eq(steps.one(h,{op="set",item=live,values={title="still live"}}).status,"applied")
            local out,err=h.call("trusted_append",{thread_id=h.id,expect={subject="i:" .. id,version=1},events={
                {type="kickside.work.events:item.deleted",subject="i:" .. id,body={item=id,actor=h.actor:id(),at=OLD,source="retirement_test"}}
            }})
            test.is_nil(out);test.eq(err:kind(),errors.CONFLICT);test.eq(err:details().reason,"version_mismatch")
        end)

        test.it("retries exact retirement names after a lost Core response without dropping the owner page", function()
            local h=fixture.board()
            local id=steps.create(h,"task")
            local added=steps.one(h,{op="comment",item=id,body="gone"})
            steps.one(h,{op="comment",item=id,comment=added.comment,delete=true})
            local db=assert(store.open())
            assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_retirement_retry (board_id TEXT PRIMARY KEY,phase INTEGER NOT NULL,names TEXT NOT NULL)",{}))
            assert(db:execute("INSERT INTO app_work_retirement_retry VALUES ($1,0,'')",{h.id}))
            assert(db:execute("UPDATE kickside_work_comment SET edited_at=$1 WHERE board_id=$2",{OLD,h.id}))
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,pending_only=0,deadline_ms=NULL WHERE owner_id='work'",{h.id}))
            db:release()
            local out,err=funcs.call("kickside.work.retention:owner",{})
            test.is_nil(err);test.is_false(out.success)
            test.eq(count("kickside_work_comment",h.id),1)
            db=assert(store.open())
            local remaining=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_thread_subject WHERE thread_id=$1 AND subject=$2",{h.id,"c:" .. added.comment}))
            local position=assert(db:query("SELECT board_after,inclusive FROM kickside_work_retention WHERE owner_id='work'",{}))[1]
            db:release()
            test.eq(remaining,0);test.eq(position.board_after,h.id);test.eq(tonumber(position.inclusive),1)
            steps.retention_run()
            test.eq(count("kickside_work_comment",h.id),0)
            db=assert(store.open())
            local phase=assert(db:query("SELECT phase FROM app_work_retirement_retry WHERE board_id=$1",{h.id}))[1].phase
            db:release()
            test.eq(tonumber(phase),2)
        end)

        test.it("bounds command subjects independently of fresh keys", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Original" })
            for i = 1, 270 do
                local out = assert(h.call("apply", { key = "storage/" .. i, ops = { { op = "set", item = id, values = { title = "Title " .. i } } } }))
                test.eq(out.outcomes[1].status, "applied")
            end
            local db = assert(store.open())
            local subjects = assert(db:query("SELECT subject FROM kickside_thread_subject WHERE thread_id=$1 AND subject LIKE 'command:%'", { h.id }))
            assert(db:execute("UPDATE kickside_work_receipt SET at=$1 WHERE board_id=$2", {OLD,h.id}))
            db:release()
            test.is_true(#subjects <= 256, "fresh keys must share a fixed subject population")
            local _,pages=prune_all(h.id,5)
            test.is_true(pages>50)
            test.eq(count("kickside_work_receipt",h.id),0)
        end)

        test.it("expires intervals by default and drains purged-item intervals independently of age", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_interval SET ended_at=$1 WHERE board_id=$2", { OLD, h.id }))
            db:release()
            db = assert(store.open())
            for i=1,13 do
                assert(db:execute([[INSERT INTO kickside_work_interval (board_id,item_id,field_id,start_seq,value_key,started_at,ended_at)
                    VALUES ($1,$2,'old',$3,'old',$4,$4)]],{h.id,id,10000+i,OLD}))
            end
            db:release()
            local _,pages=prune_all(h.id,5)
            test.is_true(pages>=3)
            test.eq(count("kickside_work_interval",h.id),0)
            db = assert(store.open())
            for i = 1, 13 do
                assert(db:execute([[INSERT INTO kickside_work_interval (board_id,item_id,field_id,start_seq,value_key,started_at)
                    VALUES ($1,$2,'state',$3,'old',$4)]], { h.id, id, 10000+i, OLD }))
            end
            assert(db:execute("UPDATE kickside_work_item SET life_at=$1 WHERE board_id=$2", { OLD, h.id }))
            db:release()
            local ok, err = pcall(function() sweep(function(): boolean
                assert(h.call("settle", {}))
                return count("kickside_work_interval", h.id) == 0 and count("kickside_work_item", h.id, " AND life='purged'") == 1
            end) end)
            assert(ok, "purged interval cleanup: " .. tostring(err))
        end)

        test.it("ages past visits and failed local jobs while preserving current visits", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local db = assert(store.open())
            for i = 1, 13 do
                assert(db:execute([[INSERT INTO kickside_work_approval (board_id,item_id,visit,actor,decision,at)
                    VALUES ($1,$2,0,$3,'approve',$4)]], { h.id, id, tostring(i), OLD }))
                assert(db:execute([[INSERT INTO kickside_work_stage_run (board_id,item_id,visit,attempt,state,started)
                    VALUES ($1,$2,0,$3,'old',$4)]], { h.id, id, i, OLD }))
                assert(db:execute([[INSERT INTO kickside_work_job (board_id,job_id,job_type,key,status,failed_at)
                    VALUES ($1,$2,'migration','old','failed',$3)]], { h.id, "storage/" .. i, OLD }))
            end
            local item = assert(store.item(db, h.id, id))
            assert(db:execute([[INSERT INTO kickside_work_approval (board_id,item_id,visit,actor,decision,at)
                VALUES ($1,$2,$3,'current','approve',$4)]], { h.id, id, item.visit, OLD }))
            assert(db:execute([[INSERT INTO kickside_work_stage_run (board_id,item_id,visit,attempt,state,started)
                VALUES ($1,$2,$3,1,'current',$4)]], { h.id, id, item.visit, OLD }))
            db:release()
            local _,pages=prune_all(h.id,5)
            test.is_true(pages>=8)
            test.eq(count("kickside_work_approval",h.id),1)
            test.eq(count("kickside_work_stage_run",h.id),1)
            test.eq(count("kickside_work_job",h.id," AND status='failed'"),0)
        end)

        test.it("keeps root and regional current visits after another region advances", function()
            local h=fixture.board({declaration={key_prefix=fixture.fresh_prefix(),fields={},
                item_types={{id="task",fields={},process="flow"}},processes={{id="flow",initial="parallel",states={
                    {id="parallel",category="started",kind="parallel",join="all",regions={{id="left",initial="review"},{id="right",initial="review"}}},
                    {id="review",category="started"},{id="done",category="completed"}},
                    transitions={{id="pass",from={"review"},to="done"}}}}}})
            local id=steps.create(h,"task")
            local db=assert(store.open())
            local item=assert(store.item(db,h.id,id))
            local visits={item.work.visit,item.work.region_data.left.visit,item.work.region_data.right.visit}
            for _,visit in ipairs(visits) do
                assert(db:execute([[INSERT INTO kickside_work_approval (board_id,item_id,visit,actor,decision,at)
                    VALUES ($1,$2,$3,'actor','approve',$4)]],{h.id,id,visit,OLD}))
                assert(db:execute([[INSERT INTO kickside_work_stage_run (board_id,item_id,visit,attempt,state,started)
                    VALUES ($1,$2,$3,1,'review',$4)]],{h.id,id,visit,OLD}))
            end
            db:release()
            test.eq(prune_all(h.id,5),0)
            test.eq(count("kickside_work_approval",h.id),3)
            test.eq(count("kickside_work_stage_run",h.id),3)
            test.eq(steps.one(h,{op="transition",item=id,transition="pass",region="left"}).status,"applied")
            test.eq(prune_all(h.id,5),2)
            test.eq(count("kickside_work_approval",h.id),2)
            test.eq(count("kickside_work_stage_run",h.id),2)
        end)

        test.it("drains advance-slot history and purged associations in bounded continuations", function()
            local h = fixture.board()
            local id = steps.create(h,"task")
            local db = assert(store.open())
            local tx = assert(db:begin())
            local job = assert(jobs.enqueue_tx(tx, db:type(), { namespace="kickside.work",scope=h.id,key="advance:" .. id,
                owner_locator={kind="component",id=h.id},job_type="kickside.work.jobs:advance",slot=true,parked=true,
                immutable_payload={board_id=h.id,item=id} }))
            for i=1,205 do
                assert(tx:execute([[INSERT INTO kickside_job_run (id,job_id,job_type,attempt_no,status,owner_kind,owner_id,execution_seq)
                    VALUES ($1,$2,'kickside.work.jobs:advance',$3,'completed','component',$4,$5)]], {uuid.v4(),job.id,i,h.id,i}))
                assert(tx:execute([[INSERT INTO kickside_work_interval (board_id,item_id,field_id,start_seq,value_key,started_at)
                    VALUES ($1,$2,'test',$3,'old',$4)]], {h.id,id,10000+i,OLD}))
            end
            assert(tx:commit()); db:release()
            test.eq(steps.one(h,{op="delete",item=id}).status,"applied")
            db=assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at=$1 WHERE board_id=$2", {OLD,h.id}))
            db:release()
            local previous,continuations=205,0
            local trace={}
            local ok,err=pcall(function() sweep(function(): boolean
                assert(h.call("settle",{}))
                local db=assert(store.open())
                local runs=assert(db:query("SELECT COUNT(*) AS n FROM kickside_job_run WHERE job_id=$1", {job.id}))
                local slots=assert(db:query("SELECT id FROM kickside_job WHERE id=$1", {job.id}))
                local item=assert(db:query("SELECT life,purge_pending FROM kickside_work_item WHERE board_id=$1 AND item_id=$2",{h.id,id}))[1]
                db:release()
                trace[#trace+1]=tostring(item.life) .. ":" .. tostring(item.purge_pending) .. ":" .. tostring(runs[1].n) .. ":" .. tostring(#slots)
                local remaining=tonumber(runs[1].n) :: integer
                test.is_true(previous-remaining<=100,"one native history page per callback")
                if remaining<previous then continuations=continuations+1 end
                previous=remaining
                return #slots==0 and count("kickside_work_interval",h.id)==0
            end) end)
            assert(ok,tostring(err) .. " " .. table.concat(trace,","))
            test.is_true(continuations>=3)
            test.eq(count("kickside_work_item",h.id," AND purge_pending=1"),0)
        end)

        test.it("drains an age backlog larger than the owner budget without waiting for another sweep", function()
            local h=fixture.board()
            local id=steps.create(h,"task")
            local db=assert(store.open())
            local tx=assert(db:begin())
            for i=1,1005 do
                assert(tx:execute([[INSERT INTO kickside_work_approval (board_id,item_id,visit,actor,decision,at)
                    VALUES ($1,$2,0,$3,'approve',$4)]],{h.id,id,tostring(i),OLD}))
            end
            assert(tx:commit())
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,pending_only=0,deadline_ms=NULL WHERE owner_id='work'",{h.id}))
            db:release()
            local runs=0
            while count("kickside_work_approval",h.id)>0 do
                local before=count("kickside_work_approval",h.id)
                local result=steps.retention_run()
                local remaining=count("kickside_work_approval",h.id)
                test.is_true(before-remaining<=500)
                if remaining>0 then test.is_true(result.needs_continue) end
                runs=runs+1
                assert(runs<10,"owner backlog must drain")
            end
            test.is_true(runs>=3)
        end)

        test.it("writes no rows on unchanged retention and item passes", function()
            local h=fixture.board()
            local id=steps.create(h,"task",{title="Unchanged"})
            sweep()
            local db=assert(store.open())
            local position=assert(rows.position(db))
            local orphan=assert(db:query("SELECT orphan_after FROM kickside_work_retention WHERE owner_id='work'",{}))[1].orphan_after :: string
            -- A row trigger observes physical writes, including redundant UPDATEs.
            assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_storage_writes (n integer NOT NULL)",{}))
            assert(db:execute("DELETE FROM app_work_storage_writes",{}))
            assert(db:execute("INSERT INTO app_work_storage_writes VALUES (0)",{}))
            local postgres=db:type()=="postgres"
            local names={"retention","item","interval","change","approval","stage_run","receipt","job","visibility"}
            if postgres then
                assert(db:execute([[CREATE OR REPLACE FUNCTION app_work_storage_write() RETURNS trigger LANGUAGE plpgsql AS $$
                    BEGIN UPDATE app_work_storage_writes SET n=n+1; RETURN NULL; END $$]],{}))
            end
            for _,name in ipairs(names) do
                if postgres then
                    assert(db:execute("CREATE TRIGGER app_work_storage_write AFTER INSERT OR UPDATE OR DELETE ON kickside_work_" .. name .. " FOR EACH ROW EXECUTE FUNCTION app_work_storage_write()",{}))
                else
                    for _,action in ipairs({"INSERT","UPDATE","DELETE"}) do
                        assert(db:execute("CREATE TRIGGER app_work_storage_" .. name .. action .. " AFTER " .. action .. " ON kickside_work_" .. name .. " BEGIN UPDATE app_work_storage_writes SET n=n+1; END",{}))
                    end
                end
            end
            db:release()
            local ok,err=pcall(function()
                for _=1,2 do
                    test.eq(assert(rows.prune(h.id,policy.DEFAULTS,5)).removed,0)
                    assert(not rows.advance(position))
                    assert(not lifecycle.advance_orphans(orphan))
                    local result=assert(h.call("apply",{key=uuid.v4(),ops={{op="set",item=id,values={title="Unchanged"}}}}))
                    test.eq(result.outcomes[1].status,"unchanged")
                end
            end)
            db=assert(store.open())
            local writes=tonumber(assert(db:query("SELECT n FROM app_work_storage_writes",{}))[1].n)
            for _,name in ipairs(names) do
                if postgres then assert(db:execute("DROP TRIGGER app_work_storage_write ON kickside_work_" .. name,{}))
                else
                    for _,action in ipairs({"INSERT","UPDATE","DELETE"}) do assert(db:execute("DROP TRIGGER app_work_storage_" .. name .. action,{})) end
                end
            end
            if postgres then assert(db:execute("DROP FUNCTION app_work_storage_write()",{})) end
            db:release()
            assert(ok,tostring(err))
            test.eq(writes,0,"unchanged passes must cause no physical writes")
        end)

        test.it("writes no progress events or receipts for an unchanged bulk pass", function()
            local h=fixture.board()
            operations.gate(h,true)
            for _=1,3 do steps.create(h,"task",{title="Unchanged"}) end
            local before=#steps.events(h)
            local receipts=count("kickside_work_receipt",h.id)
            local started=assert(h.call("bulk",{key="unchanged-bulk",query={},ops_template={{op="set",values={title="Unchanged"}}}}))
            steps.wait_for("unchanged bulk completion",function()
                return assert(h.call("bulk_status",{bulk_id=started.bulk_id})).status=="done"
            end)
            local status=assert(h.call("bulk_status",{bulk_id=started.bulk_id}))
            test.eq(status.unchanged,3);test.eq(status.processed,3)
            test.eq(count("kickside_work_receipt",h.id),receipts)
            test.eq(#steps.events(h),before)
            local replay=assert(h.call("bulk",{key="unchanged-bulk",query={},ops_template={{op="set",values={title="Unchanged"}}}}))
            test.eq(replay.bulk_id,started.bulk_id);test.eq(replay.status,"done")
        end)

        test.it("indexes every retained row class by board and eligibility timestamp", function()
            local db = assert(store.open())
            local query = db:type() == "postgres" and "SELECT indexname AS name, indexdef AS definition FROM pg_indexes WHERE schemaname = current_schema()"
                or "SELECT name, sql AS definition FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL"
            local indexes = assert(db:query(query, {}))
            db:release()
            local definitions: { [string]: string } = {}
            for _, index in ipairs(indexes) do definitions[index.name :: string] = index.definition :: string end
            for _, class in ipairs({
                { name = "item_expiry", column = "life, life_at", predicate = "life" },
                { name = "key_alias_expiry", column = "at" },
                { name = "change_at", column = "at" },
                { name = "interval_expiry", column = "ended_at", predicate = "ended_at" },
                { name = "generation_expiry", column = "applied_at" },
                { name = "receipt_expiry", column = "at" },
                { name = "approval_age", column = "at" },
                { name = "stage_run_age", column = "(coalesce(finished, started)" },
                { name = "job_failed", column = "failed_at", predicate = "failed" },
                { name = "job_done", column = "job_id", predicate = "done" },
                { name = "field_unused", column = "field_id", predicate = "items" },
                { name = "plugin_converged", column = "plugin", predicate = "active" },
                { name = "purge_pending", column = "life_at, item_id", predicate = "purge_pending" },
                { name = "visibility_floor", column = "seq" },
                { name = "operation_expiry", column = "(substr", predicate = "status" },
            }) do
                local definition = definitions["kickside_work_" .. class.name]
                test.not_nil(definition, class.name)
                test.is_true(definition:lower():gsub("%(+", "("):gsub("coalesce%(", "(coalesce("):find("(board_id, " .. class.column, 1, true) ~= nil, definition)
                if class.predicate then
                    test.is_true(definition:find("WHERE", 1, true) ~= nil, definition)
                    test.is_true(definition:find(class.predicate, 1, true) ~= nil, definition)
                end
            end
        end)

        test.it("preserves a restore accepted after the retention scan and before purge acceptance", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Restored" })
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2", { OLD, h.id }))
            db:release()
            race.seed(h.id, id)
            sweep(function(): boolean return race.fired(h.id) end)
            assert(h.call("settle", {}))
            local got = assert(h.call("get", { item = { id = id } })).item
            test.eq(got.life, "live")
            test.eq(got.values.title, "Restored")
            for _, event in ipairs(steps.events(h)) do test.is_true(event.type ~= "kickside.work.events:item.purged") end
        end)

        test.it("purges expired trash through a trusted version-checked event and preserves live items", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 1 }, fields = { { code = "labels", form = "text", cardinality = "set", index = "key" } } } }))
            local labels: { string } = {}
            for i = 1, 505 do labels[i] = "tag" .. i end
            local expired = steps.create(h, "task", { title = "Expired", labels = labels })
            local live = steps.create(h, "task", { title = "Live" })
            test.eq(steps.one(h, { op = "comment", item = expired, body = "Owned" }).status, "applied")
            test.eq(steps.one(h, { op = "link", item = expired, type = "blocks", target = { item = live } }).status, "applied")
            test.eq(steps.one(h, { op = "delete", item = expired }).status, "applied")
            local version = steps.version(h, expired)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2 AND item_id = $3", { OLD, h.id, expired }))
            assert(db:execute("UPDATE kickside_work_retention SET board_after = $1, inclusive = 0, pending_only=0, deadline_ms = NULL WHERE owner_id = 'work'", { h.id }))
            db:release()
            sweep(function(): boolean
                assert(h.call("settle", {}))
                return count("kickside_work_item", h.id, " AND life = 'purged'") == 1
            end)
            local event = steps.events(h)
            local found = false
            for _, e in ipairs(event) do
                if e.type == "kickside.work.events:item.purged" then found = true; test.eq(e.body.item, expired) end
            end
            test.is_true(found)
            db = assert(store.open())
            local item = assert(store.item(db, h.id, expired))
            db:release()
            test.is_true(set_count(h.id, expired) > 0, "purge keeps excess generated set rows for bounded collection")
            test.eq(item.version, version + 1)
            test.is_nil(next(item.document))
            test.eq(assert(h.call("get", { item = { id = live } })).item.values.title, "Live")
            sweep(function(): boolean
                return count("kickside_work_comment", h.id) == 0 and count("kickside_work_link", h.id) == 0 and set_count(h.id, expired) == 0
            end)
        end)

        test.it("prunes audit intervals and tombstones by board windows and advances the feed floor", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 1, audit_days = 1, interval_days = 1, tombstone_days = 1 } } }))
            local id = steps.create(h, "task", { title = "Old" })
            local cursor = assert(h.call("list_changes", {})).next
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2", { OLD, h.id }))
            assert(db:execute("UPDATE kickside_work_change SET at = $1 WHERE board_id = $2", { OLD, h.id }))
            assert(db:execute("UPDATE kickside_work_interval SET started_at = $1, ended_at = $1 WHERE board_id = $2", { OLD, h.id }))
            assert(db:execute("UPDATE kickside_work_retention SET board_after = $1, inclusive = 0, pending_only=0, deadline_ms = NULL WHERE owner_id = 'work'", { h.id }))
            db:release()
            sweep(function(): boolean
                assert(h.call("settle", {}))
                return count("kickside_work_item", h.id, " AND life = 'purged'") == 1
            end)
            db = assert(store.open())
            local item = assert(store.item(db, h.id, id))
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2", { OLD, h.id }))
            db:release()
            sweep(function(): boolean return count("kickside_work_item", h.id) == 0 end)
            db = assert(store.open())
            local board = assert(store.board(db, h.id))
            db:release()
            test.eq(board.tombstone_floor_seq, item.updated_seq)
            test.eq(count("kickside_work_interval", h.id), 0)
            test.eq(count("kickside_work_change", h.id, " AND at = '" .. OLD .. "'"), 0)
            test.eq(assert(h.call("list_changes", { cursor = cursor })).gap.floor, item.updated_seq)
        end)

        test.it("advances a durable orphan cursor beyond a full page of blocked prefixes", function()
            local h = fixture.board()
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            local db = assert(store.open())
            local seeded: { string } = {}
            for i = 1, 501 do
                local prefix = "0" .. string.format("%03d", i) .. fixture.fresh_prefix()
                seeded[#seeded + 1] = prefix
                assert(db:execute("INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, 1, 1)", { prefix, uuid.v4() }))
            end
            db:release()
            sweep(function(): boolean return count("kickside_work_prefix", h.id) == 0 end)
            db = assert(store.open())
            for _, prefix in ipairs(seeded) do assert(db:execute("DELETE FROM kickside_work_prefix WHERE prefix = $1", { prefix })) end
            db:release()
            test.eq(count("kickside_work_prefix", h.id), 0)
        end)

        test.it("bounds teardown pages and keeps the board shell until every owned row is gone", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "T" })
            local db = assert(store.open())
            for i = 1, 2701 do
                assert(db:execute([[INSERT INTO kickside_work_comment (board_id, comment_id, item_id, body, mentions, author, version, deleted, created_at)
                    VALUES ($1, $2, $3, 'body', '[]', 'test', 1, 0, $4)]], { h.id, tostring(i), id, OLD }))
            end
            db:release()
            local before = count("kickside_work_comment", h.id)
            local out, err = h.call("delete", {})
            test.is_nil(err, steps.detail(err))
            test.is_true(out.success)
            test.is_true(out.in_progress)
            test.is_true(out.cleanup_pending)
            test.is_true(before - count("kickside_work_comment", h.id) <= 100)
            test.eq(count("kickside_work_board", h.id), 1)
            test.is_true(count("kickside_work_comment", h.id) > 0)
            steps.deleted(h.id)
            test.eq(count("kickside_work_board", h.id), 0)
            db = assert(store.open())
            local names = tables.names(h.id)
            local query = db:type() == "postgres" and "SELECT tablename AS name FROM pg_tables WHERE tablename = $1"
                or "SELECT name FROM sqlite_master WHERE type='table' AND name = $1"
            local rows = assert(db:query(query, { names.item }))
            db:release()
            test.eq(#rows, 0)
        end)
    end)
end
return { run = test.run_cases(define) }
