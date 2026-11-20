-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local operations = require("operations")
local prepare = require("prepare")
local outcomes = require("outcomes")
local store = require("store")
local sql = require("sql")
local json = require("json")
local registry = require("registry")
local security = require("security")
local uuid = require("uuid")
local identifiers = require("identifiers")
local policy = require("policy")
local tables = require("tables")

local function declaration()
    return { key_prefix = fixture.fresh_prefix(), fields = {
        { code = "title", form = "text", track = true },
        { code = "level", form = "text", index = "key" },
        { code = "owner", type = "principal", index = "key" },
    }, item_types = { { id = "task", process = "flow", fields = { "title", "level", "owner" }, parent_types = { "task" } } },
        processes = { { id = "flow", initial = "open", states = { { id = "open", category = "started" } } } },
        visibility = { field = "level", bypass = "admin", levels = {
            { id = "private", holders = { { field = "owner" } } },
        } } }
end

local function define()
    test.describe("Work hardening regressions", function()
        test.it("grants exact framework calls for both plugin lifecycle entrypoints", function()
            local entry = assert(registry.get("kickside.work.security:framework_callbacks"))
            local policy = entry.data.policy
            for _, id in ipairs({ "kickside.work.jobs:plugins", "kickside.work.extensions:plugin_batch" }) do
                local found = false
                for _, resource in ipairs(policy.resources) do if resource == id then found = true end end
                test.is_true(found,id)
            end
        end)

        test.it("keeps native named-scope dependency conditions in principal resolution", function()
            local _, native = security.named_scope("app:no_such_holder")
            local h=fixture.board()
            local _, err=h.call("direct",{target="kickside.work.read:resolve_principal",input={groups={"app:no_such_holder"},validate_only=true}})
            test.not_nil(err)
            if native then test.eq(err:kind(),native:kind());test.eq(err:retryable(),native:retryable())
            else test.eq(err:details().code,"access_group_missing") end
        end)

        test.it("rechecks frozen source visibility before any deferred import", function()
            local admin=scoped.admin()
            local h=scoped.board(admin,declaration())
            local target=scoped.board(admin,declaration())
            local call,member_id=fixture.user(h,nil,true)
            assert(h.call("grant",{subject_id=member_id,mask=7}))
            assert(target.call("grant",{subject_id=member_id,mask=3}))
            local id=steps.create(h,"task",{level="private",owner={kind="user",id=member_id}})
            local request=operations.move_request(target,id,"source-authority")
            local plan,plan_err=call("plan_move",request); assert(plan, "plan: "..steps.detail(plan_err));test.is_true(plan.allowed)
            steps.one(h,{op="set",item=id,values={owner={kind="user",id=admin.id}}})
            local _,err=call("direct",{target="app:hardening_probe",input={op="move",owner={board_id=h.id,operation_id=uuid.v4(),
                status="pending",processed=0,counts={},data={plan=plan,request={board_id=h.id,item=id,to_board=target.id,map={}}}}}})
            test.eq(assert(target.call("count",{})).total,0)
            test.not_nil(err);test.eq(err:kind(),errors.PERMISSION_DENIED)
        end)

        test.it("rechecks copied field access after group membership is revoked", function()
            local d=declaration()
            d.fields[1].access={read={{group="app.security:work_admin"}}}
            local h=scoped.board(scoped.admin(),d)
            local target=scoped.board(scoped.admin(),declaration())
            local call,member_id=fixture.user(h)
            assert(h.call("grant",{subject_id=member_id,mask=7}))
            assert(target.call("grant",{subject_id=member_id,mask=3}))
            local id=steps.create(h,"task",{title="copied secret"})
            local request=operations.move_request(target,id,"field-authority")
            local plan=assert(call("plan_move",request));test.is_true(plan.allowed)
            local db=assert(store.open())
            assert(db:execute("DELETE FROM app_user_groups WHERE user_id=$1 AND group_id=$2",{member_id,"app.security:work_admin"}));db:release()
            test.not_nil(assert(call("get",{item={id=id}})).item)
            local _,err=call("direct",{target="app:hardening_probe",input={op="move",owner={board_id=h.id,operation_id=uuid.v4(),
                status="pending",processed=0,counts={},data={plan=plan,request={board_id=h.id,item=id,to_board=target.id,map={}}}}}})
            test.eq(assert(target.call("count",{})).total,0)
            test.not_nil(err);test.eq(err:kind(),errors.PERMISSION_DENIED)
        end)

        test.it("ages visibility history and returns a gap without deleting an item", function()
            local h=fixture.board({declaration=declaration()})
            local id=steps.create(h,"task")
            local cursor=assert(h.call("list_changes",{})).next
            for _=1,4 do
                steps.one(h,{op="set",item=id,values={level="private"}})
                steps.one(h,{op="set",item=id,clear={"level"}})
            end
            local db=assert(store.open())
            assert(db:execute("UPDATE kickside_work_visibility SET at='2000-01-01T00:00:00.000000000Z' WHERE board_id=$1",{h.id}));db:release()
            steps.retention_sweep(function() return steps.count_rows("kickside_work_visibility",h.id)==1 end)
            test.not_nil(assert(h.call("list_changes",{cursor=cursor})).gap)
            test.eq(assert(steps.get(h,id)).item.life,"live")
        end)

        test.it("resumes bootstrap below the aged feed floor without looping on gaps", function()
            local h=fixture.board({declaration=declaration()})
            steps.create(h,"task")
            local newer=steps.create(h,"task")
            steps.one(h,{op="set",item=newer,values={level="private"}})
            steps.one(h,{op="set",item=newer,clear={"level"}})
            local db=assert(store.open())
            assert(db:execute("UPDATE kickside_work_visibility SET at='2000-01-01T00:00:00.000000000Z' WHERE board_id=$1",{h.id}));db:release()
            steps.retention_sweep(function() return steps.count_rows("kickside_work_visibility",h.id)==2 end)
            local page=assert(h.call("list_changes",{limit=1}))
            test.is_true(page.has_more)
            local next_page=assert(h.call("list_changes",{limit=1,cursor=page.next}))
            test.is_nil(next_page.gap)
            test.eq(#next_page.items,1)
        end)

        test.it("fences atomic apply against its expected board head and hashes the precondition", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Before" })
            local head = assert(steps.get(h, id)).as_of :: integer
            local request = { key = "guarded", expected_head = head, ops = { { op = "set", item = id, values = { title = "After" } } } }
            local first, err = h.call("apply", request)
            assert(first and first.applied, steps.detail(err))
            test.is_true(assert(h.call("apply", request)).replayed)
            request.expected_head = first.as_of
            local failed, conflict = h.call("apply", request)
            test.is_nil(failed)
            test.eq(conflict:details().code, "idempotency_conflict")
            local invalid, mode_err = h.call("apply", { mode = "independent", expected_head = head, ops = request.ops })
            test.is_nil(invalid)
            test.eq(mode_err:details().code, "invalid_request")
        end)

        test.it("rejects a head change between atomic preparation and append", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Before" })
            local head = assert(steps.get(h, id)).as_of :: integer
            local db = assert(store.open())
            assert(db:execute("CREATE TABLE IF NOT EXISTS work_keyed_churn (board_id TEXT PRIMARY KEY,item_id TEXT NOT NULL)"))
            assert(db:execute("INSERT INTO work_keyed_churn VALUES ($1,$2)", { h.id, id })); db:release()
            local result, err = h.call("apply", { key = "guarded-append", expected_head = head,
                ops = { { op = "set", item = id, values = { title = "After" } } } })
            db = assert(store.open()); assert(db:execute("DELETE FROM work_keyed_churn WHERE board_id=$1", { h.id })); db:release()
            test.is_nil(result)
            test.eq(err:details().code, "head_changed")
            test.eq(assert(steps.get(h, id)).item.values.title, "Before")
        end)

        test.it("keeps keyed item CAS when unrelated commands advance the board", function()
            local h = fixture.board()
            local id = steps.create(h,"task",{ title = "Before" })
            local db = assert(store.open())
            assert(db:execute("CREATE TABLE IF NOT EXISTS work_keyed_churn (board_id TEXT PRIMARY KEY,item_id TEXT NOT NULL)"))
            assert(db:execute("INSERT INTO work_keyed_churn VALUES ($1,$2)",{h.id,id})); db:release()
            local result, err = h.call("apply",{ key = "head-independent",ops = { { op = "set", item = id, expect_version = 1, values = { title = "After" } } } })
            db = assert(store.open()); assert(db:execute("DELETE FROM work_keyed_churn WHERE board_id=$1",{h.id})); db:release()
            test.is_nil(err); test.eq(result.outcomes[1].status,"applied")
            test.eq(assert(steps.get(h,id)).item.values.title,"After")
        end)

        test.it("keeps failed visibility backfill admission after diagnostics expire", function()
            local h = fixture.board({ declaration = declaration() })
            local member = scoped.member()
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            steps.create(h, "task", { level = "private" })
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            local column = "f" .. board.model.fields.level.id .. "_key"
            -- Model the incomplete newly indexed visibility column of a failed backfill.
            assert(db:execute("UPDATE " .. tables.names(h.id).item .. " SET " .. column .. "=NULL", {}))
            assert(db:execute([[INSERT INTO kickside_work_job (board_id,job_id,job_type,key,status,error,failed_at)
                VALUES ($1,'visibility-backfill','reindex','{"fields":["level"]}','failed','old diagnostic',$2)]], { h.id, "2000-01-01T00:00:00.000000000Z" }))
            db:release()
            local _, before = member.call("query", {}, h.id)
            test.eq((before:details() or {}).code, "rebuild_failed")
            steps.retention_prune(h.id, policy.DEFAULTS, 500)
            local out, err = member.call("query", {}, h.id)
            test.is_nil(out); test.not_nil(err)
            test.eq((err:details() or {}).code, "rebuild_failed")
            db = assert(store.open())
            local demand = assert(db:query("SELECT error,failed_at FROM kickside_work_job WHERE board_id=$1 AND job_id='visibility-backfill'", {h.id}))
            test.eq(#demand, 1); test.is_nil(demand[1].error); test.is_nil(demand[1].failed_at)
            assert(db:execute("UPDATE kickside_work_job SET status='done' WHERE board_id=$1", {h.id})); db:release()
            steps.retention_prune(h.id, policy.DEFAULTS, 500)
            test.eq(steps.count_rows("kickside_work_job",h.id),0)
        end)

        test.it("fences discovery counts while visibility indexes rebuild", function()
            local h = fixture.board({ declaration = declaration() })
            local member = scoped.member()
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            steps.create(h, "task", { level = "private" })
            local db = assert(store.open())
            assert(db:execute([[INSERT INTO kickside_work_job (board_id,job_id,job_type,key,status)
                VALUES ($1,'discovery-fence','reindex','{"fields":["level"]}','pending')]], { h.id }))
            db:release()
            local out, err = member.call("list", {})
            test.is_nil(out); test.not_nil(err); test.eq(err:details().code, "projection_pending")
            db = assert(store.open()); assert(db:execute("DELETE FROM kickside_work_job WHERE board_id=$1", { h.id })); db:release()
        end)

        test.it("keeps pending move phase receipts past the ordinary replay window", function()
            local h, target = fixture.board(), fixture.board()
            operations.grant(h, target); operations.gate(h, false)
            local id = steps.create(h, "task")
            local started = assert(h.call("move", operations.move_request(target, id, "old-phase")))
            steps.wait_for("target import before interruption", function()
                local db = assert(store.open())
                local rows = assert(db:query("SELECT arrived FROM work_deferred_gate WHERE board_id=$1", { h.id })); db:release()
                return tonumber(rows[1].arrived) == 1
            end)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_receipt SET at='2000-01-01T00:00:00.000000000Z' WHERE command_key LIKE $1", { "move/" .. started.move_id .. "/%" }))
            db:release()
            local imported=assert(target.call("query",{})).items[1].id
            steps.one(target,{op="set",item=imported,values={title="Edited after import"}})
            steps.retention_sweep()
            local protected = assert(h.call("direct", { target = "app:hardening_probe", input = { op = "receipt", board_id = target.id, key = "move/" .. started.move_id .. "/in" } }))
            test.is_true(protected.found)
            operations.gate(h, true)
            assert(h.call("operation_batch", { operation_id = started.move_id }))
            test.eq(assert(h.call("move_status", { move_id = started.move_id })).status, "done")
            test.eq(assert(steps.get(target,imported)).item.values.title,"Edited after import")
        end)

        test.it("bounds comments at admission including additions in one atomic command", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM numbers WHERE n<9999)
                INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at)
                SELECT $1,'cap-' || n,$2,'existing','[]','fixture',1,0,'2020-01-01T00:00:00Z' FROM numbers]], { h.id,id }))
            db:release()
            local result = assert(steps.apply(h, { { op = "comment", item = id, body = "last" }, { op = "comment", item = id, body = "too many" } }))
            test.is_false(result.applied)
            test.eq(result.outcomes[2].findings[1].code, "comments_limit")
            test.eq(steps.one(h, { op = "comment", item = id, body = "last" }).status, "applied")
            test.eq(steps.one(h, { op = "comment", item = id, body = "refused" }).status, "invalid")
            local repeated = assert(steps.apply(h, {
                { op = "comment", item = id, comment = "cap-1", delete = true },
                { op = "comment", item = id, comment = "cap-1", delete = true },
                { op = "comment", item = id, body = "replacement" },
                { op = "comment", item = id, body = "still too many" },
            }))
            test.is_false(repeated.applied)
            test.eq(repeated.outcomes[2].findings[1].code, "unknown_comment")
            local db = assert(store.open())
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_comment WHERE board_id=$1 AND item_id=$2 AND deleted=0", { h.id, id })), 10000)
            db:release()
        end)

        test.it("bounds snapshots when a fresh board allows more than 10000 comments", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.policy = { comments_per_item = 20000 }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM numbers WHERE n<10001)
                INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at)
                SELECT $1,'feed-' || n,$2,'existing','[]','fixture',1,0,'2020-01-01T00:00:00Z' FROM numbers]], { h.id,id }))
            db:release()
            local page=assert(h.call("list_changes",{}))
            test.eq(#page.items,1);test.eq(#page.items[1].comments,10000)
            test.is_true(page.items[1].comments_truncated)
            test.is_false(page.has_more)
            test.eq(#assert(h.call("list_changes",{cursor=page.next})).items,0)
            test.eq(steps.count_rows("kickside_work_comment",h.id),10001)
        end)

        test.it("keeps subject retirement out of ordinary installed member and administrator scopes", function()
            local admin=scoped.admin()
            local h=scoped.board(admin,declaration())
            local id=steps.create(h,"task")
            local out,err=admin.call("retire_subjects",{thread_id=h.id,subjects={"i:" .. id}},h.id)
            test.is_nil(out);test.not_nil(err)
            local db=assert(store.open())
            local kept=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_thread_subject WHERE thread_id=$1 AND subject=$2",{h.id,"i:" .. id}))
            db:release();test.eq(kept,1)
        end)

        test.it("collects deleted comments independently of their living item", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local added = steps.one(h, { op = "comment", item = id, body = "expire" })
            steps.one(h, { op = "comment", item = id, comment = added.comment, delete = true })
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_comment SET edited_at='2000-01-01T00:00:00.000000000Z' WHERE board_id=$1", { h.id })); db:release()
            steps.retention_sweep(function() return steps.count_rows("kickside_work_comment", h.id) == 0 end)
            local db=assert(store.open())
            local remaining=assert(store.count(db,"SELECT COUNT(*) AS n FROM kickside_thread_subject WHERE thread_id=$1 AND subject=$2",{h.id,"c:" .. added.comment}))
            db:release()
            test.eq(remaining,0)
            test.eq(assert(steps.get(h, id)).item.life, "live")
        end)

        test.it("preserves native command error envelopes through outcomes", function()
            local native = errors.new({ kind = errors.INTERNAL, message = "dependency corrupt", retryable = false,
                details = { code = "dependency_corrupt", nested = { reason = "fixture" } } })
            local plan = prepare.failed(native)
            local err = assert(outcomes.error(plan.status, plan.findings, plan.error))
            test.eq(err:kind(), native:kind())
            test.eq(err:message(), native:message())
            test.eq(err:retryable(), false)
            test.eq(err:details().code, native:details().code)
            test.eq(err:details().nested.reason, "fixture")
        end)

        test.it("enrolls visit timers as ordinary Jobs eligible for terminal retention", function()
            local h=fixture.board({declaration={key_prefix=fixture.fresh_prefix(),fields={},
                item_types={{id="task",fields={},process="flow"}},processes={{id="flow",initial="build",states={
                    {id="build",category="started",kind="automated",run={stage="build"}}
                }}}}})
            steps.create(h,"task")
            local db=assert(store.open())
            local rows=assert(db:query("SELECT slot FROM kickside_job WHERE owner_id=$1 AND job_type='kickside.work.jobs:process'",{h.id}))
            db:release()
            test.eq(#rows,1);test.is_true(rows[1].slot==false or rows[1].slot==0)
        end)

        test.it("replays creation after editable board metadata changes", function()
            local admin = scoped.admin()
            local input = { idempotency_key = "immutable-creation", title = "Original" }
            local first = assert(admin.call("create", input))
            assert(admin.call("update", { title = "Renamed" }, first.board_id))
            local replay, err = admin.call("create", input)
            test.is_nil(err); test.eq(replay.board_id, first.board_id); test.is_true(replay.replayed)
            local _, conflict = admin.call("create", { idempotency_key = input.idempotency_key, title = "Different" })
            test.eq(conflict:kind(), errors.CONFLICT)
        end)

        test.it("replays completed creation after schema receipt expiry without resetting a label", function()
            local admin=scoped.admin()
            local d=declaration();d.fields[1].title="Original"
            local input={idempotency_key=uuid.v4(),declaration=d}
            local first=assert(admin.call("create",input))
            local changed=json.decode(assert(json.encode(d)));changed.fields[1].title="Renamed"
            assert(admin.call("apply_schema",{declaration=changed},first.board_id))
            local db=assert(store.open())
            assert(db:execute("UPDATE kickside_work_receipt SET at='2000-01-01T00:00:00Z' WHERE board_id=$1",{first.board_id}));db:release()
            local replay=assert(admin.call("create",input))
            test.is_true(replay.replayed);test.eq(replay.generation,first.generation)
            local schema=assert(admin.call("get_schema",{},first.board_id))
            test.eq(schema.declaration.fields[1].title,"Renamed")
        end)

        test.it("leaves no creation receipt when component admission fails", function()
            local admin=scoped.admin()
            local key="failed-admission"
            local id=assert(identifiers.uuid("kickside.work.create.v1".."\0"..admin.id.."\0"..key))
            local out,err=admin.call("create",{idempotency_key=key,parent_id=uuid.v4()})
            test.is_nil(out);test.not_nil(err)
            test.eq(steps.count_rows("kickside_work_receipt",id),0)
        end)

        test.it("refuses the complete delete and restore when a descendant is hidden", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin, declaration())
            assert(h.call("grant", { subject_id = member.id, mask = 7 }))
            local parent = steps.create(h, "task")
            local child = steps.create(h, "task", { level = "private" }, parent)
            local result = assert(member.call("apply", { ops = { { op = "delete", item = parent } } }, h.id))
            test.is_false(result.applied)
            test.eq(assert(steps.get(h, parent)).item.life, "live")
            test.eq(assert(steps.get(h, child)).item.life, "live")
            test.eq(steps.one(h, { op = "delete", item = parent }).status, "applied")
            result = assert(member.call("apply", { ops = { { op = "restore", item = parent } } }, h.id))
            test.is_false(result.applied)
            test.eq(assert(steps.get(h, parent)).item.life, "trashed")
        end)

        test.it("keeps retained hidden history private after purge", function()
            local h = fixture.board({ declaration = declaration() })
            local member = scoped.member()
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local id = steps.create(h, "task", { title = "Retained secret", level = "private" })
            steps.one(h, { op = "delete", item = id })
            assert(h.call("trusted_append", { writes = { { thread_id = h.id, events = {
                { type = "kickside.work.events:item.purged", subject = "i:" .. id,
                    body = { item = id, at = "2026-11-13T00:00:00Z", actor = h.actor:id(), source = "test" } },
            } } } }))
            assert(h.call("settle", {}))
            local history = assert(member.call("list_history", {}, h.id))
            for _, entry in ipairs(history.entries) do test.is_true(entry.subject ~= "i:" .. id) end
            test.is_true(#assert(h.call("list_history", {})).entries > 0)
            local db = assert(store.open())
            local item = assert(store.item(db, h.id, id)); db:release()
            local board = assert(h.call("get_schema", {}))
            for _, field in ipairs(board.compiled.fields) do
                if field.code == "title" then test.is_nil(item.document[tostring(field.id)]) end
            end
        end)

        test.it("redacts move history and status for readers without peer board access", function()
            local h = fixture.board()
            local target = fixture.board()
            operations.grant(h, target)
            operations.gate(h, true)
            local member = scoped.admin()
            assert(h.call("grant", { subject_id = member.id, mask = 15 }))
            local id = steps.create(h, "task", { title = "Move" })
            local moved = operations.moved(h, operations.move_request(target, id, "redacted-move"))
            local status = assert(member.call("move_status", { move_id = moved.move_id }, h.id))
            test.is_nil(status.item); test.is_nil(status.items)
            local history = assert(member.call("list_history", {}, h.id))
            local found = false
            for _, entry in ipairs(history.entries) do
                if entry.kind == "moved_out" then
                    found = true; test.is_true(entry.after.unavailable); test.is_nil(entry.after.board); test.is_nil(entry.after.item)
                end
            end
            test.is_true(found)
        end)

        test.it("redacts inaccessible peer endpoints even on a refused move plan", function()
            local h,target,peer=fixture.board(),fixture.board(),fixture.board()
            operations.grant(h,target)
            assert(peer.call("grant",{subject_id=h.actor:id(),mask=1}))
            local item=steps.create(h,"task")
            local foreign=steps.create(peer,"task")
            test.eq(steps.one(h,{op="link",item=item,type="blocks",target={board=peer.id,item=foreign}}).status,"applied")
            assert(peer.call("revoke",{subject_id=h.actor:id()}))
            local plan=assert(h.call("plan_move",operations.move_request(target,item,"refused-peer")))
            test.is_false(plan.allowed)
            test.is_true(plan.links[1].target.unavailable)
            test.is_nil(plan.links[1].target.board);test.is_nil(plan.links[1].target.item)
        end)

        test.it("activates plugins with ordinary installed Work administrator roles", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:folding_plugin" } } } }))
            steps.wait_for("ordinary role plugin activation", function()
                for _, plugin in ipairs(assert(h.call("get_schema", {})).plugins) do
                    if plugin.plugin == "app:folding_plugin" then return plugin.lifecycle.state == "ready" end
                end
                return false
            end)
        end)

        test.it("refuses generic board registration context and metadata outside Work admission", function()
            local admin=scoped.admin();local h=scoped.board(admin)
            local out,err=admin.call("register_kind",{impl_id="kickside.work.binding:board"})
            test.is_nil(out);test.not_nil(err)
            out,err=admin.call("component_update",{{type="PATCH_CONTEXT",payload={patch={traits={"injected"}}}}},h.id)
            test.is_nil(out);test.not_nil(err)
            out,err=admin.call("component_meta",{title="Bypass"},h.id)
            test.is_nil(out);test.not_nil(err)
            test.eq(assert(admin.call("get_meta",{},h.id)).meta.title,"Scoped board")
        end)
        test.it("allows owners to relocate a board with ordinary Component placement", function()
            local admin=scoped.admin();local h=scoped.board(admin)
            local folder=assert(admin.call("register_kind",{impl_id="app:placement_folder"})).component_id
            local out,err=admin.call("placement",{parent_id=folder},h.id)
            test.is_nil(err);test.not_nil(out)
            test.eq(assert(admin.call("get_meta",{},h.id)).parent_id,folder)
        end)
        test.it("allows owners to relocate a folder containing a board", function()
            local admin=scoped.admin();local h=scoped.board(admin)
            local folder=assert(admin.call("register_kind",{impl_id="app:placement_folder"})).component_id
            local target=assert(admin.call("register_kind",{impl_id="app:placement_folder"})).component_id
            assert(admin.call("placement",{parent_id=folder},h.id))
            local db=assert(store.open())
            local before=assert(db:query("SELECT path FROM kickside_components WHERE component_id=$1",{h.id}))[1].path;db:release()
            local out,err=admin.call("placement",{parent_id=target},folder)
            test.is_nil(err);test.not_nil(out)
            local after=assert(admin.call("get_meta",{},h.id))
            test.eq(after.parent_id,folder)
            test.eq(assert(admin.call("get_meta",{},folder)).parent_id,target)
            db=assert(store.open())
            test.is_true(assert(db:query("SELECT path FROM kickside_components WHERE component_id=$1",{h.id}))[1].path~=before);db:release()
        end)
        test.it("allows owners to delete a containing folder with reparent_root", function()
            local admin=scoped.admin();local h=scoped.board(admin)
            local folder=assert(admin.call("register_kind",{impl_id="app:placement_folder"})).component_id
            assert(admin.call("placement",{parent_id=folder},h.id))
            local out,err=admin.call("delete",{child_policy="reparent_root"},folder)
            test.is_nil(err);test.not_nil(out)
            steps.wait_for("board reroot",function()
                return assert(admin.call("get_meta",{},h.id)).parent_id==nil
            end)
        end)

        test.it("denies member calls to private board metadata publication", function()
            local h = scoped.board(scoped.admin())
            local member = scoped.member()
            local out, err = member.call("direct", { target = "kickside.work.persist:publish_meta", input = { thread_id = h.id } })
            test.is_nil(out); test.not_nil(err)
        end)

        test.it("clears deleted comment payloads while the owning item survives", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local added = steps.one(h, { op = "comment", item = id, body = "Erase me", mentions = { { kind = "user", id = h.actor:id() } } })
            steps.one(h, { op = "comment", item = id, comment = added.comment, delete = true })
            local db = assert(sql.get("app:db"))
            local row = assert(db:query("SELECT body,mentions FROM kickside_work_comment WHERE board_id=$1 AND comment_id=$2", { h.id, added.comment }))[1]
            db:release()
            test.eq(row.body, ""); test.eq(#json.decode(row.mentions), 0)
        end)
    end)
end
return { run = test.run_cases(define) }
