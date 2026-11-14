-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Retention owner: key prefixes of deleted boards are released on the registry and removed,
-- in bounded batches, under the owner's own authority.
local test = require("test")
local funcs = require("funcs")
local uuid = require("uuid")
local autoinit = require("autoinit")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local operation_steps = require("operation_steps")
local clock = require("clock")

type Map = { [string]: unknown }

local OWNER = "kickside.work.retention:owner"

local function registry_id(): string
    return autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "work_registry") :: string
end

local function held(prefix: string): integer
    local db = assert(store.open())
    local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_work_prefix WHERE prefix = $1", { prefix }))
    db:release()
    return math.tointeger(tonumber(rows[1].n)) :: integer
end

-- subject_version counts the registry events of a prefix, read as a work administrator.
local function subject_version(reader: fixture.Handle, prefix: string): integer
    local n = 0
    local from_seq = 1
    while true do
        local out, err = reader.executor:call("app:work_call", { op = "events", board_id = registry_id(), request = { from_seq = from_seq } })
        assert(not err, steps.detail(err))
        local events = (out :: { events: { Map } }).events
        if #events == 0 then return n end
        for _, event in ipairs(events) do
            if event.subject == "prefix:" .. prefix then n = n + 1 end
        end
        from_seq = (math.tointeger(tonumber(events[#events].seq)) :: integer) + 1
    end
end

local run_owner, drain = steps.retention_run, steps.retention_sweep

local function release_event(prefix: string, board: string): Map
    return { type = "kickside.work.events:prefix.released", subject = "prefix:" .. prefix,
        body = { prefix = prefix, board = board, at = "2026-11-03T00:00:00.000Z" } }
end

local function define()
    test.describe("prefix retention", function()
        test.it("drains legacy hidden state rows while retaining declared audit history", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.policy = { audit_days = 0 }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { title = "Retained" })
            local before = steps.get(h, id).item
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM numbers WHERE n<205)
                INSERT INTO kickside_work_change (board_id,seq,n,subject,kind,field_id,after,actor,at)
                SELECT $1,2,1000+n,$2,'query_value',-1,'"open"',$3,'2026-01-01T00:00:00Z' FROM numbers]], { h.id, "i:" .. id, h.actor:id() }))
            assert(db:execute("UPDATE kickside_work_retention SET board_after=$1,inclusive=1,item_after='',deadline_ms=NULL WHERE owner_id='work'", { h.id }))
            db:release()
            drain(function(): boolean return steps.count_rows("kickside_work_change", h.id, " AND kind='query_value'") == 0 end)
            db = assert(store.open())
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id=$1 AND kind='query_value'", { h.id })), 0)
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id=$1 AND kind='created'", { h.id })), 1)
            db:release()
            local after = steps.get(h, id).item
            test.eq(after.version, before.version)
            test.eq(after.state, before.state)
            test.eq(after.values.title, "Retained")
        end)
        test.it("carries an earlier page's deadline through sweep completion", function()
            local deadline = clock.deadline(86400000).ns // 1000000
            local db = assert(store.open())
            local last = assert(db:query("SELECT MAX(board_id) AS board_id FROM kickside_work_board", {}))[1].board_id
            assert(db:execute("UPDATE kickside_work_retention SET board_after=$1,inclusive=0,item_after='',deadline_ms=$2 WHERE owner_id='work'", { last or "", deadline }))
            db:release()
            local out = run_owner()
            test.is_false(out.needs_continue)
            test.eq(out.deadline_ms, deadline)
            db = assert(store.open())
            local position = assert(db:query("SELECT board_after, deadline_ms FROM kickside_work_retention WHERE owner_id='work'", {}))[1]
            db:release()
            test.eq(position.board_after, "")
            test.is_nil(store.int(position.deadline_ms))
        end)
        test.it("retires completed operation replay state with the event window", function()
            local h = fixture.board()
            operation_steps.gate(h, true)
            local operation = assert(h.call("bulk", { key = "retired-operation", query = {}, ops_template = { { op = "set", values = { title = "Unused" } } } }))
            steps.wait_for("empty bulk completion", function() return assert(h.call("bulk_status", { bulk_id = operation.bulk_id })).status == "done" end)
            local db = assert(store.open())
            local row = assert(db:query("SELECT actor_context FROM kickside_work_operation WHERE board_id = $1 AND operation_id = $2", { h.id, operation.bulk_id }))[1]
            local identity = assert(store.stored(row.actor_context, {} :: Map))
            identity.captured_at = "2000-01-01T00:00:00Z"
            assert(db:execute("UPDATE kickside_work_operation SET actor_context = $1 WHERE board_id = $2 AND operation_id = $3", { store.encode(identity), h.id, operation.bulk_id }))
            db:release()
            drain(function(): boolean return steps.count_rows("kickside_work_operation", h.id) == 0 end)
            db = assert(store.open())
            local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_work_operation WHERE board_id = $1", { h.id }))
            local jobs = assert(db:query("SELECT COUNT(*) AS n FROM kickside_job WHERE id=$1", {operation.job_id}))
            db:release()
            test.eq(tonumber(rows[1].n), 0)
            test.eq(tonumber(jobs[1].n),0)
            local restarted = assert(h.call("bulk", { key = "retired-operation", query = {}, ops_template = { { op = "set", values = { title = "Unused" } } } }))
            test.is_true(restarted.bulk_id ~= operation.bulk_id)
        end)

        test.it("reports a future eligibility deadline after a sweep drains", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            steps.one(h, { op = "delete", item = id })
            local _, result = drain()
            test.not_nil(result.deadline_ms)
            test.is_true(result.deadline_ms > 0)
        end)

        test.it("drains keyed receipts with the board event retention window", function()
            local h = fixture.board()
            for i = 1, 5 do assert(steps.apply(h, { { op = "create", type = "task" } }, { key = "expires-" .. i })) end
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_receipt SET at = '2000-01-01T00:00:00.000000000Z' WHERE board_id = $1", { h.id }))
            assert(db:execute("UPDATE kickside_work_retention SET board_after = (SELECT MAX(board_id) FROM kickside_work_board), inclusive = 0, item_after = '', deadline_ms = NULL WHERE owner_id = 'work'", {}))
            db:release()
            drain(function(): boolean return steps.count_rows("kickside_work_receipt", h.id) == 0 end)
            db = assert(store.open())
            local receipts = assert(db:query("SELECT COUNT(*) AS n FROM kickside_work_receipt WHERE board_id = $1", { h.id }))
            db:release()
            test.eq(tonumber(receipts[1].n), 0)
            test.eq(assert(steps.apply(h, { { op = "create", type = "task" } }, { key = "expires-1" })).outcomes[1].status, "applied")
            test.eq(assert(h.call("count", {})).total, 6)
        end)

        test.it("releases the prefixes of a deleted board so another board claims them and its keys resolve", function()
            local holder = fixture.board()
            local renamed = fixture.fresh_prefix()
            assert(holder.call("apply_schema", { declaration = fixture.declaration(renamed) }))
            local _, derr = holder.call("delete", {})
            test.is_nil(derr, steps.detail(derr))
            steps.deleted(holder.id)
            test.eq(held(holder.prefix), 1)
            test.eq(held(renamed), 1)

            local blocked = fixture.board({ bare = true })
            local _, taken = blocked.call("apply_schema", { declaration = fixture.declaration(holder.prefix) })
            test.not_nil(taken)
            test.eq((taken :: error):details().code, "key_prefix_taken")

            drain(function(): boolean return held(holder.prefix) == 0 and held(renamed) == 0 end)
            test.eq(held(holder.prefix), 0)
            test.eq(held(renamed), 0)

            local first = fixture.board({ bare = true })
            local second = fixture.board({ bare = true })
            local a, aerr = first.call("apply_schema", { declaration = fixture.declaration(holder.prefix) })
            test.is_nil(aerr, steps.detail(aerr))
            test.eq((a :: Map).generation, 1)
            local b, berr = second.call("apply_schema", { declaration = fixture.declaration(renamed) })
            test.is_nil(berr, steps.detail(berr))
            test.eq((b :: Map).generation, 1)
            local item = steps.create(first, "task", { title = "Reclaimed" })
            local found, gerr = first.call("get", { item = { key = holder.prefix .. "-1" } })
            test.is_nil(gerr, steps.detail(gerr))
            test.eq((found :: Map).item.id, item)
        end)

        test.it("releases only the claim recorded by a trusted log fixture", function()
            local admin = fixture.board({ bare = true })
            local prefix = fixture.fresh_prefix()
            local dead = uuid.v4()
            local live = uuid.v4()
            local function append(expected: integer, event: Map)
                local _, err = admin.call("trusted_append", { thread_id = registry_id(), expect = { subject = "prefix:" .. prefix, version = expected },
                    events = { event } })
                assert(not err, steps.detail(err))
            end
            append(0, { type = "kickside.work.events:prefix.claimed", subject = "prefix:" .. prefix,
                body = { prefix = prefix, board = dead, actor = "probe", at = "2026-11-03T00:00:00.000Z" } })
            append(1, release_event(prefix, dead))
            append(2, { type = "kickside.work.events:prefix.claimed", subject = "prefix:" .. prefix,
                body = { prefix = prefix, board = live, actor = "probe", at = "2026-11-03T00:00:00.000Z" } })
            local db = assert(store.open())
            assert(db:execute("INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, 1, 1)", { prefix, dead }))
            db:release()

            drain(function(): boolean return held(prefix) == 0 end)
            test.eq(held(prefix), 0)
            test.eq(subject_version(admin, prefix), 3)
        end)

        test.it("releases the claim its row records and leaves the subject released", function()
            local h = fixture.board()
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            test.eq(subject_version(h, h.prefix), 1)
            drain(function(): boolean return held(h.prefix) == 0 end)
            test.eq(held(h.prefix), 0)
            test.eq(subject_version(h, h.prefix), 2)
        end)

        test.it("records a failed prefix and releases the next orphan in the same run", function()
            drain()
            local h = fixture.board()
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            local prefix = "0" .. fixture.fresh_prefix()
            local db = assert(store.open())
            assert(db:execute("INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, 1, 1)", { prefix, (uuid.v4()) }))
            db:release()
            local out, err = funcs.call(OWNER, {})
            local result = out :: Map
            local remaining = held(h.prefix)
            local cleanup = assert(store.open())
            assert(cleanup:execute("DELETE FROM kickside_work_prefix WHERE prefix = $1", { prefix }))
            cleanup:release()
            test.is_nil(err, steps.detail(err))
            test.eq(remaining, 0)
            test.is_true(result.success)
            test.is_true(result.deleted >= 1)
            test.eq(#result.blocked, 1)
            local failed = result.blocked[1]
            test.eq(failed.error:kind(), errors.INTERNAL)
            test.eq(failed.error:details().code, "prefix_claim_ahead")
            test.eq(failed.error:details().prefix, prefix)
            local _, final = drain()
            test.is_false(final.needs_continue)
        end)

        test.it("reports a row that claims a version the registry has not reached", function()
            local prefix = fixture.fresh_prefix()
            local db = assert(store.open())
            assert(db:execute("INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, 1, 1)", { prefix, (uuid.v4()) }))
            db:release()
            local out, err = funcs.call(OWNER, {})
            assert(not err, steps.detail(err))
            local result = out :: Map
            test.is_true(result.success)
            test.eq(#result.blocked, 1)
            local failed = result.blocked[1].error
            test.eq(failed:kind(), errors.INTERNAL)
            test.eq(failed:details().code, "prefix_claim_ahead")
            test.eq(failed:details().prefix, prefix)
            test.eq(held(prefix), 1)
            local cleanup = assert(store.open())
            assert(cleanup:execute("DELETE FROM kickside_work_prefix WHERE prefix = $1", { prefix }))
            cleanup:release()
        end)

        test.it("leaves the prefixes of live boards in place", function()
            local live = fixture.board()
            local gone = fixture.board()
            assert(gone.call("delete", {}))
            steps.deleted(gone.id)
            drain(function(): boolean return held(gone.prefix) == 0 end)
            test.eq(held(live.prefix), 1)
            test.eq(held(gone.prefix), 0)
        end)

        test.it("converges when a prefix is already released on the registry", function()
            local gone = fixture.board()
            assert(gone.call("delete", {}))
            steps.deleted(gone.id)
            drain(function(): boolean return held(gone.prefix) == 0 end)
            local db = assert(store.open())
            assert(db:execute("INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, 1, 1)", { gone.prefix, gone.id }))
            db:release()
            drain(function(): boolean return held(gone.prefix) == 0 end)
            test.eq(held(gone.prefix), 0)
        end)

        test.it("releases orphan prefixes over successive runs when more than one batch exists", function()
            local admin = fixture.board({ bare = true })
            local total = 250
            local seeded: { string } = {}
            for _ = 1, total do
                local prefix = fixture.fresh_prefix()
                seeded[#seeded + 1] = prefix
                local _, err = admin.call("trusted_append", { thread_id = registry_id(), expect = { subject = "prefix:" .. prefix, version = 0 },
                    events = { { type = "kickside.work.events:prefix.claimed", subject = "prefix:" .. prefix,
                        body = { prefix = prefix, board = "orphan", actor = "probe", at = "2026-11-03T00:00:00.000Z" } } } })
                assert(not err, steps.detail(err))
            end
            local db = assert(store.open())
            for _, prefix in ipairs(seeded) do
                assert(db:execute("INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, 1, 1)", { prefix, (uuid.v4()) }))
            end
            local function remaining(): integer
                local n = 0
                for _, prefix in ipairs(seeded) do n = n + held(prefix) end
                return n
            end
            db:release()
            local first = run_owner()
            test.is_true(first.needs_continue == true, "more orphans than one batch")
            local after_first = remaining()
            test.is_true(after_first > 0 and after_first < total, "first run releases a bounded part: " .. after_first)
            test.is_true(drain(function(): boolean return remaining() == 0 end) >= 1)
            test.eq(remaining(), 0)
        end)
    end)

    test.describe("prefix release authority", function()
        test.it("denies a work administrator appending a release directly", function()
            local h = fixture.board()
            local admin = fixture.user(h, { "app:user", "app:no_output_publish" })
            local out, err = admin("append", { thread_id = registry_id(), expect = { subject = "prefix:" .. h.prefix, version = 1 },
                events = { release_event(h.prefix, h.id) } })
            test.is_nil(out)
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.PERMISSION_DENIED, steps.detail(err))
        end)

        test.it("resolves a bare key of a deleted board as an unknown key before its prefix is released", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "Gone" })
            local anywhere = fixture.user(nil)
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            local _, err = anywhere("get", { item = { key = h.prefix .. "-1" } })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.NOT_FOUND)
            local _, unknown = anywhere("get", { item = { key = fixture.fresh_prefix() .. "-1" } })
            test.eq((unknown :: error):kind(), errors.NOT_FOUND)
            test.eq((err :: error):details().code, (unknown :: error):details().code)
        end)
    end)
end

return { run = test.run_cases(define) }
