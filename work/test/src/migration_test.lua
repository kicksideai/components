-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Process versioning (spec 4.7): plans that name the states items hold, state maps, and the follow migration job.
local test = require("test")
local json = require("json")
local time = require("time")
local fixture = require("fixture")
local steps = require("steps")
local rows = require("rows")
local store = require("store")
local process_changes = require("process_changes")
local domain = require("domain")
local authorization_probe = require("authorization_probe")

type Map = { [string]: unknown }

local READ, WRITE, ADMIN = 1, 2, 8

local function board(): fixture.Handle
    return fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
end

local function person(id: string): Map
    return { kind = "user", id = id }
end

local function copy(value: unknown): Map
    return json.decode(json.encode(value)) :: Map
end

-- renamed returns the workflow declaration with the todo state renamed to backlog, optionally mapping it.
local function renamed(prefix: string, map: Map?): Map
    local d = fixture.workflow(prefix)
    local p = (d.processes :: { Map })[1]
    p.initial = "backlog"
    p.map = map
    for _, s in ipairs(p.states :: { Map }) do
        if s.id == "todo" then s.id = "backlog" end
    end
    for _, t in ipairs(p.transitions :: { Map }) do
        if t.from ~= "any" then
            for i, s in ipairs(t.from :: { string }) do if s == "todo" then (t.from :: { string })[i] = "backlog" end end
        end
        if t.to == "todo" then t.to = "backlog" end
    end
    return d
end

-- without_doing returns the workflow declaration without the doing state.
local function without_doing(prefix: string, map: Map?): Map
    local d = fixture.workflow(prefix)
    local p = (d.processes :: { Map })[1]
    p.map = map
    local states = {}
    for _, s in ipairs(p.states :: { Map }) do
        if s.id ~= "doing" then states[#states + 1] = s end
    end
    p.states = states
    p.transitions = {
        { id = "start", from = { "todo" }, to = "review", set = { { field = "started", value = "$now" } } },
        { id = "finish", from = { "review" }, to = "done" },
        { id = "cancel", from = "any", to = "canceled" },
    }
    return d
end

local function item_view(h: fixture.Handle, id: string): Map
    return (assert(steps.get(h, id)) :: Map).item :: Map
end

local function create_many(h: fixture.Handle, count: integer): { string }
    local ids: { string } = {}
    while #ids < count do
        local ops = {}
        for i = 1, math.min(200, count - #ids) do ops[i] = { op = "create", type = "task", values = { title = "T" .. (#ids + i), estimate = 1 } } end
        local out, err = steps.apply(h, ops)
        for _, o in ipairs((assert(out, steps.detail(err)) :: Map).outcomes :: { Map }) do
            assert(o.status == "applied", json.encode(o))
            ids[#ids + 1] = o.item :: string
        end
    end
    return ids
end

local function define()
    test.describe("process plan", function()
        test.it("refuses removing a state items hold and reports how many", function()
            local h = board()
            local a = steps.create(h, "task", { title = "A", estimate = 1, assignee = person("u1") })
            local b = steps.create(h, "task", { title = "B", estimate = 1, assignee = person("u1") })
            steps.create(h, "task", { title = "C", estimate = 1 })
            for _, id in ipairs({ a, b }) do
                assert(steps.one(h, { op = "transition", item = id, transition = "start" }).status == "applied")
            end
            local plan = assert(h.call("plan_schema", { declaration = without_doing(h.prefix) }))
            test.eq(plan.class, "refused")
            test.eq(#plan.refused, 1)
            test.eq(plan.refused[1].what, "state.remove")
            test.eq(plan.refused[1].detail, "doing")
            test.eq(plan.refused[1].count, 2)
            test.is_true(plan.migration:find("map", 1, true) ~= nil)
            local _, err = h.call("apply_schema", { declaration = without_doing(h.prefix) })
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "migration_required")
            test.eq(assert(h.call("get_schema", {})).generation, 1)
        end)

        test.it("accepts removing a state with a map and reports the affected items", function()
            local h = board()
            local id = steps.create(h, "task", { title = "A", estimate = 1, assignee = person("u1") })
            assert(steps.one(h, { op = "transition", item = id, transition = "start" }).status == "applied")
            local plan = assert(h.call("plan_schema", { declaration = without_doing(h.prefix, { doing = "review" }) }))
            test.eq(#plan.refused, 0)
            test.eq(plan.class, "semantic")
            local mapped
            for _, c in ipairs(plan.changes) do if c.what == "state.map" then mapped = c end end
            test.not_nil(mapped)
            test.eq(mapped.detail, "doing")
            test.eq(mapped.to, "review")
            test.eq(mapped.count, 1)
        end)

        test.it("allows removing a state no item holds without a map", function()
            local h = board()
            steps.create(h, "task", { title = "A", estimate = 1 })
            local plan = assert(h.call("plan_schema", { declaration = without_doing(h.prefix) }))
            test.eq(#plan.refused, 0)
        end)

        test.it("refuses a state kind change and reports category changes with their counts", function()
            local function compiled(kind: string, category: string): domain.Compiled
                local state: domain.State = { id = "a", name = "a", category = category, kind = kind, assign = {}, require = {} }
                return { key_prefix = "AB", fields = {}, relation_types = {}, policy = { audit = "fields" }, next_field_id = 1,
                    item_types = { { id = "t", title = "t", process = "p", parent_types = {}, fields = {}, inherit = {} } },
                    processes = { { id = "p", name = "p", initial = "a", migration = "follow", generation = 1, states = { state }, transitions = {} } } }
            end
            local usage: domain.Usage = { fields = {}, items = 4, types = { t = 4 }, links = {}, states = { t = { a = 4 } } }
            local out: { domain.SchemaChange } = {}
            process_changes.changes(out, compiled("human", "started"), compiled("gate", "started"), usage, {})
            test.eq(out[1].what, "state.kind")
            test.eq(out[1].class, "refused")
            local recategorized: { domain.SchemaChange } = {}
            process_changes.changes(recategorized, compiled("human", "started"), compiled("human", "completed"), usage, {})
            test.eq(recategorized[1].what, "state.category")
            test.eq(recategorized[1].class, "semantic")
            test.eq(recategorized[1].count, 4)
        end)

        test.it("refuses removing a held state from a pinned process even with a map", function()
            local h = board()
            local pinned = fixture.workflow(h.prefix)
            local p = (pinned.processes :: { Map })[1]
            p.migration = "pin"
            assert(h.call("apply_schema", { declaration = pinned }))
            local id = steps.create(h, "task", { title = "A", estimate = 1, assignee = person("u1") })
            assert(steps.one(h, { op = "transition", item = id, transition = "start" }).status == "applied")
            local d = without_doing(h.prefix, { doing = "review" })
            ;(d.processes :: { Map })[1].migration = "pin"
            local plan = assert(h.call("plan_schema", { declaration = d }))
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].what, "state.remove")
        end)
    end)

    test.describe("follow migration", function()
        test.it("moves items out of a removed state and records the move in their history", function()
            local h = board()
            local id = steps.create(h, "task", { title = "A", estimate = 1, assignee = person("u1") })
            assert(steps.one(h, { op = "transition", item = id, transition = "start" }).status == "applied")
            local waiting = steps.create(h, "task", { title = "B", estimate = 1 })
            local applied = assert(h.call("apply_schema", { declaration = without_doing(h.prefix, { doing = "review" }) }))
            test.eq(applied.generation, 2)
            steps.wait_for("the migration", function() return rows.stale(h.id) == 0 end)
            local item = item_view(h, id)
            test.eq(item.state, "review")
            test.eq(item.category, "started")
            test.eq(item.process_generation, 2)
            test.eq(item.visit, 3)
            local other = item_view(h, waiting)
            test.eq(other.state, "todo")
            test.eq(other.process_generation, 2)
            test.eq(other.visit, 1)
            local history = assert(h.call("list_history", { item = { id = id } }))
            local moves = {}
            for _, e in ipairs(history.entries) do if e.kind == "migration" then moves[#moves + 1] = e end end
            test.eq(#moves, 1)
            test.eq(moves[1].before.state, "doing")
            test.eq(moves[1].after.state, "review")
            test.eq(moves[1].after.generation, 2)
            local spans = assert(h.call("get_time_in_state", { item = { id = id } }))
            test.eq(spans.periods[#spans.periods].value, "review")
            test.is_nil(spans.periods[#spans.periods].ended_at)
            test.eq(rows.job(h.id).status, "done")
        end)

        test.it("stamps new items with the current process generation and migrates nothing for a pinned process", function()
            local h = board()
            local pinned = fixture.workflow(h.prefix)
            ;(pinned.processes :: { Map })[1].migration = "pin"
            assert(h.call("apply_schema", { declaration = pinned }))
            local old = steps.create(h, "task", { title = "A", estimate = 1 })
            local changed = copy(pinned)
            local states = (changed.processes :: { Map })[1].states :: { Map }
            states[#states + 1] = { id = "parked", category = "backlog" }
            assert(h.call("apply_schema", { declaration = changed }))
            local fresh = steps.create(h, "task", { title = "B", estimate = 1 })
            test.eq(item_view(h, old).process_generation, 2)
            test.eq(item_view(h, fresh).process_generation, 3)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_job WHERE board_id = $1", { h.id }), 0)
        end)

        test.it("moves 1,200 items across batches and records each move once", function()
            local h = board()
            local ids = create_many(h, 1200)
            local applied = assert(h.call("apply_schema", { declaration = renamed(h.prefix, { todo = "backlog" }) }))
            test.eq(applied.generation, 2)
            steps.wait_for("the migration", function() return rows.stale(h.id) == 0 end)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND state = 'backlog' AND process_generation = 2", { h.id }), 1200)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1 AND kind = 'migration'", { h.id }), 1200)
            test.eq(rows.scalar("SELECT COUNT(DISTINCT subject) AS n FROM kickside_work_change WHERE board_id = $1 AND kind = 'migration'", { h.id }), 1200)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_interval WHERE board_id = $1 AND field_id = 'state' AND value_key = 'backlog' AND ended_at IS NULL", { h.id }), 1200)
            local sample = item_view(h, ids[777])
            test.eq(sample.state, "backlog")
            test.eq(sample.visit, 2)
            local page = assert(h.call("list_history", { item = { id = ids[777] } }))
            test.eq(page.entries[1].kind, "migration")
        end)

        test.it("keeps execution identity out of the event log and the job row", function()
            local h = board()
            create_many(h, 3)
            assert(h.call("apply_schema", { declaration = renamed(h.prefix, { todo = "backlog" }) }))
            steps.wait_for("the migration", function() return rows.stale(h.id) == 0 end)
            local reader, reader_id = fixture.user(h)
            assert(h.call("grant", { subject_id = reader_id, mask = READ + ADMIN }))
            local page = assert(reader("events", {})) :: { events: { Map } }
            local applied = 0
            for _, e in ipairs(page.events) do
                local encoded = json.encode(e)
                test.is_false(encoded:find("actor_context", 1, true) ~= nil, "event " .. tostring(e.type) .. " carries actor_context")
                test.is_false(encoded:find("actor_id", 1, true) ~= nil, "event " .. tostring(e.type) .. " carries actor_id")
                if e.type == "kickside.work.events:schema.applied" then applied = applied + 1 end
            end
            test.eq(applied, 2)
            local db = assert(store.open())
            local _, err = db:query("SELECT identity FROM kickside_work_job", {})
            db:release()
            test.not_nil(err)
        end)

        test.it("runs under the board identity, not the identity of whoever applied", function()
            local h = board()
            create_many(h, 3)
            local admin, admin_id = fixture.user(h)
            assert(h.call("grant", { subject_id = admin_id, mask = READ + WRITE + ADMIN }))
            local db = assert(store.open())
            assert(db:execute("UPDATE app_users SET status = 'disabled' WHERE user_id = $1", { admin_id }))
            db:release()
            assert(admin("apply_schema", { declaration = renamed(h.prefix, { todo = "backlog" }) }))
            steps.wait_for("the migration", function() return rows.stale(h.id) == 0 end)
            steps.wait_for("the job record", function() return rows.job(h.id).status == "done" end)
        end)

        test.it("parks when the board identity can no longer act, reports it and resumes where it stopped", function()
            local h = board()
            local total = 2000
            create_many(h, total)
            local admin, admin_id = fixture.user(h)
            assert(h.call("grant", { subject_id = admin_id, mask = READ + WRITE + ADMIN }))
            assert(h.call("apply_schema", { declaration = renamed(h.prefix, { todo = "backlog" }) }))
            local moving = false
            for _ = 1, 3000 do
                if rows.stale(h.id) < total then
                    moving = true
                    break
                end
                time.sleep("10ms")
            end
            test.is_true(moving, "the migration did not start")
            local db = assert(store.open())
            assert(db:execute("UPDATE app_users SET status = 'disabled' WHERE user_id = $1", { h.actor:id() }))
            db:release()
            steps.wait_for("the parked job", function() return rows.job(h.id).status == "failed" end)
            test.not_nil(rows.job(h.id).error)
            test.is_true(rows.stale(h.id) > 0, "the migration finished before the identity was disabled")
            local view = assert(admin("get_schema", {}))
            test.not_nil(view.migration_error)
            local db2 = assert(store.open())
            assert(db2:execute("UPDATE app_users SET status = 'active' WHERE user_id = $1", { h.actor:id() }))
            db2:release()
            local resumed, rerr = admin("resume_migration", {})
            test.is_nil(rerr, steps.detail(rerr))
            test.not_nil(resumed)
            steps.wait_for("the migration", function() return rows.stale(h.id) == 0 end)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1 AND kind = 'migration'", { h.id }), total)
            test.eq(rows.scalar("SELECT COUNT(DISTINCT subject) AS n FROM kickside_work_change WHERE board_id = $1 AND kind = 'migration'", { h.id }), total)
            steps.wait_for("the job record", function() return rows.job(h.id).status == "done" end)
            test.is_nil(assert(admin("get_schema", {})).migration_error)
        end)

        test.it("follows every mapping from the recorded generation across overlapping upgrades", function()
            local h = board()
            local id = steps.create(h, "task", { title = "Held", estimate = 1 })
            local admin, admin_id = fixture.user(h)
            assert(h.call("grant", { subject_id = admin_id, mask = READ + WRITE + ADMIN }))
            authorization_probe.fail(h.id, ADMIN, errors.PERMISSION_DENIED)
            assert(admin("apply_schema", { declaration = renamed(h.prefix, { todo = "backlog" }) }))
            steps.wait_for("parked first mapping", function() return rows.job(h.id).status == "failed" end)
            local d = renamed(h.prefix)
            local p = d.processes[1]
            p.initial, p.map = "queued", { backlog = "queued" }
            for _, state in ipairs(p.states) do if state.id == "backlog" then state.id = "queued" end end
            for _, transition in ipairs(p.transitions) do
                if type(transition.from) == "table" then
                    for n, state in ipairs(transition.from) do if state == "backlog" then transition.from[n] = "queued" end end
                end
                if transition.to == "backlog" then transition.to = "queued" end
            end
            assert(admin("apply_schema", { declaration = d }))
            steps.wait_for("parked overlapping mapping", function() return rows.job(h.id).status == "failed" end)
            authorization_probe.clear(h.id)
            assert(admin("resume_migration", {}))
            steps.wait_for("composed follow mapping", function() return rows.stale(h.id) == 0 end)
            test.eq(item_view(h, id).state, "queued")
            test.eq(item_view(h, id).process_generation, 3)
        end)

        test.it("resumes a migration only for administrators and only while one is parked", function()
            local h = board()
            create_many(h, 3)
            local writer, writer_id = fixture.user(h)
            assert(h.call("grant", { subject_id = writer_id, mask = READ + WRITE }))
            local _, denied = writer("resume_migration", {})
            test.not_nil(denied)
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
            local _, none = h.call("resume_migration", {})
            test.not_nil(none)
            test.eq(none:kind(), errors.INVALID)
            test.eq(none:details().code, "no_parked_migration")
        end)
    end)
end

return { run = test.run_cases(define) }
