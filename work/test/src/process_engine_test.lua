-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local rows = require("rows")
local time = require("time")

type Map = { [string]: unknown }

local function definition(): Map
    return { key_prefix = fixture.fresh_prefix(), fields = { { code = "owner", type = "principal" }, { code = "points", form = "int", index = "number" } },
        item_types = { { id = "task", process = "flow", fields = { "owner", "points" }, parent_types = { "task" } } },
        processes = { { id = "flow", initial = "todo", states = {
            { id = "todo", category = "unstarted" }, { id = "doing", category = "started" },
            { id = "done", category = "completed" }, { id = "canceled", category = "canceled" },
        }, transitions = { { id = "start", from = { "todo" }, to = "doing" }, { id = "finish", from = { "doing" }, to = "done" } } } } }
end

local function view(h: fixture.Handle, id: string): Map
    return assert(steps.get(h, id)).item :: Map
end

local function event_count(h: fixture.Handle, event: string): integer
    local page = assert(h.call("events", {}))
    local count = 0
    for _, e in ipairs(page.events) do if e.type == "kickside.work.events:" .. event then count = count + 1 end end
    return count
end

local function define()
    test.describe("gate execution", function()
        test.it("requires every gate condition and records eligible decisions once per visit", function()
            local h = fixture.board({ bare = true })
            local other, other_id = fixture.user(h)
            assert(h.call("grant", { subject_id = other_id, mask = 3 }))
            local d = definition()
            d.key_prefix = h.prefix
            local p = d.processes[1]
            p.states[2] = { id = "doing", category = "started", kind = "gate", release_when = {
                approvals = { min = 1, from = { { kind = "user", id = other_id } }, prevent_self = true },
                when = { field = "points", op = "gte", value = 2 },
            } }
            p.transitions[2].auto, p.transitions[2].default = true, true
            p.transitions[3] = { id = "reject", from = { "doing" }, to = "canceled" }
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task", { points = 1 })
            test.eq(steps.one(h, { op = "transition", item = id, transition = "start" }).status, "applied")
            local denied = assert(h.call("approve", { item = id, visit = 2 }))
            test.eq(denied.outcomes[1].status, "denied")
            local approved = assert(other("approve", { item = id, visit = 2 }))
            test.eq(approved.outcomes[1].status, "applied")
            test.eq(view(h, id).state, "doing")
            test.eq(assert(other("approve", { item = id, visit = 2 })).outcomes[1].status, "unchanged")
            test.eq(steps.one(h, { op = "set", item = id, values = { points = 2 } }).status, "applied")
            test.eq(view(h, id).state, "done")
            test.eq(event_count(h, "approval.recorded"), 1)
        end)

        test.it("accepts a live group holder at a pinned gate after its declaration changes", function()
            local h = fixture.board({ bare = true })
            local reviewer, reviewer_id = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = reviewer_id, mask = 3 }))
            local d = definition()
            d.key_prefix = h.prefix
            local p = d.processes[1]
            p.migration = "pin"
            p.states[2] = { id = "doing", category = "started", kind = "gate", release_when = {
                approvals = { min = 1, from = { group = "app.security:work_test" }, prevent_self = true },
            } }
            p.transitions[2].auto, p.transitions[2].default = true, true
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task")
            test.eq(steps.one(h, { op = "transition", item = id, transition = "start" }).status, "applied")
            p.states[2].release_when.approvals.from = { group = "app.security:work_admin" }
            assert(h.call("apply_schema", { declaration = d }))
            local approved = assert(reviewer("approve", { item = id, visit = 2 }))
            test.eq(approved.outcomes[1].status, "applied")
            test.eq(view(h, id).state, "done")
            test.eq(event_count(h, "approval.recorded"), 1)
        end)

        test.it("wait gates release only after the exact deadline and stale timers do nothing", function()
            local d = definition()
            d.processes[1].states[2] = { id = "doing", category = "started", kind = "gate", release_when = { wait = "PT0.05S" } }
            d.processes[1].transitions[2].auto, d.processes[1].transitions[2].default = true, true
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            assert(steps.one(h, { op = "transition", item = id, transition = "start" }))
            steps.wait_for("wait gate release", function() return view(h, id).state == "done" end)
            test.eq(event_count(h, "timer.fired"), 1)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND item_id = $2 AND visit = 3", { h.id, id }), 1)
        end)
    end)

    test.describe("automated stages", function()
        test.it("records reports, rejects stale attempts and retries with a new entered event", function()
            local d = definition()
            local p = d.processes[1]
            p.states[2] = { id = "doing", category = "started", kind = "automated", run = {
                stage = "build", retry = { max = 2, backoff = "PT0.05S" }, on_fail = "failed",
            } }
            p.transitions[2] = { id = "passed", from = { "doing" }, to = "done" }
            p.transitions[3] = { id = "failed", from = { "doing" }, to = "canceled" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            test.eq(event_count(h, "stage.entered"), 1)
            local stale = assert(h.call("report", { item = id, visit = 1, attempt = 1, outcome = "passed" }))
            test.eq(stale.outcomes[1].findings[1].code, "stage_visit_mismatch")
            local first = assert(h.call("report", { item = id, visit = 2, attempt = 1, outcome = "failed", outputs = { log = "failed" } }))
            test.eq(first.outcomes[1].status, "applied")
            steps.wait_for("retry entry", function() return event_count(h, "stage.entered") == 2 end)
            local old = assert(h.call("report", { item = id, visit = 2, attempt = 1, outcome = "passed" }))
            test.eq(old.outcomes[1].findings[1].code, "stage_attempt_finished")
            assert(h.call("report", { item = id, visit = 2, attempt = 2, outcome = "passed", outputs = { artifact = "built" } }))
            test.eq(view(h, id).state, "done")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2 AND finished IS NOT NULL", { h.id, id }), 2)
        end)
    end)

    test.describe("process execution boundaries", function()
        test.it("restricts gate exits to rejection or a recorded administrator force", function()
            local d = definition()
            d.processes[1].states[2] = { id = "doing", category = "started", kind = "gate", release_when = { wait = "P1D" } }
            local h = fixture.board({ declaration = d })
            local member, member_id = fixture.user(h)
            assert(h.call("grant", { subject_id = member_id, mask = 3 }))
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            test.eq(steps.one(h, { op = "transition", item = id, transition = "finish" }).status, "denied")
            local denied = assert(member("apply", { ops = { { op = "transition", item = id, transition = "finish", force = true } } }))
            test.eq(denied.outcomes[1].status, "denied")
            test.eq(steps.one(h, { op = "transition", item = id, transition = "finish", force = true }).status, "applied")
            test.eq(view(h, id).state, "done")
            local forced = false
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:item.transitioned" and event.body.force then forced = true end
            end
            test.is_true(forced)
        end)

        test.it("advances each parallel region independently and joins at the declared count", function()
            for _, join in ipairs({ "all", "any", 1 }) do
                local d = definition()
                local p = d.processes[1]
                p.states[2] = { id = "doing", category = "started", kind = "parallel", regions = {
                    { id = "qa", initial = "review" }, { id = "security", initial = "review" },
                }, join = join }
                p.states[5] = { id = "review", category = "unstarted" }
                p.transitions[2].auto, p.transitions[2].default = true, true
                p.transitions[3] = { id = "checked", from = { "review" }, to = "done" }
                local h = fixture.board({ declaration = d })
                local id = steps.create(h, "task")
                steps.one(h, { op = "transition", item = id, transition = "start" })
                test.eq(view(h, id).state.qa, "review")
                test.eq(view(h, id).category, "started")
                test.eq(steps.one(h, { op = "transition", item = id, region = "qa", transition = "checked" }).status, "applied")
                if join == "all" then
                    test.eq(view(h, id).state.qa, "done")
                    test.eq(view(h, id).state.security, "review")
                    test.eq(view(h, id).category, "started")
                    test.eq(steps.one(h, { op = "transition", item = id, region = "security", transition = "checked" }).status, "applied")
                end
                test.eq(view(h, id).state, "done")
            end
        end)

        test.it("re-arms repeating timers from their exact deadline and leaves stale visits unchanged", function()
            local d = definition()
            d.processes[1].states[2].timers = { { id = "sla", after = "PT0.05S", ["repeat"] = "PT0.05S", interrupting = false, ["then"] = { emit = "sla.breached" } } }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            steps.wait_for("repeated escalation", function() return event_count(h, "timer.fired") >= 2 end)
            steps.one(h, { op = "transition", item = id, transition = "finish" })
            local count = event_count(h, "timer.fired")
            time.sleep("150ms")
            test.eq(view(h, id).state, "done")
            test.eq(event_count(h, "timer.fired"), count)
        end)

        test.it("advances a parent when a projected child category satisfies its guard", function()
            local d = definition()
            d.fields[3] = { code = "complete", type = "rollup", form = "bool", index = "key", of = "children", fn = "all", where = { field = "category", op = "eq", value = "completed" } }
            d.item_types[1].fields[3] = "complete"
            d.processes[1].transitions[2].auto = true
            d.processes[1].transitions[2].when = { field = "complete", op = "eq", value = true }
            local h = fixture.board({ declaration = d })
            local parent = steps.create(h, "task")
            local child = steps.one(h, { op = "create", type = "task", parent = parent }).item
            steps.one(h, { op = "transition", item = parent, transition = "start" })
            test.eq(view(h, parent).state, "doing")
            steps.one(h, { op = "transition", item = child, transition = "start" })
            steps.wait_for("rollup-driven advance", function() return view(h, parent).state == "done" end)
        end)

        test.it("refuses statically visible conditional automatic cycles", function()
            local d = definition()
            local p = d.processes[1]
            p.transitions[1] = { id = "a", from = { "todo" }, to = "doing", auto = true, when = { field = "points", op = "gte", value = 1 } }
            p.transitions[2] = { id = "b", from = { "doing" }, to = "todo", auto = true, when = { field = "points", op = "gte", value = 1 } }
            local h = fixture.board({ bare = true })
            d.key_prefix = h.prefix
            local _, err = h.call("plan_schema", { declaration = d })
            test.not_nil(err)
            test.eq(err:details().code, "process_auto_cycle")
        end)
    end)

    test.describe("process durability", function()
        test.it("retains rejection until administrator force when a gate has no reject transition", function()
            local h = fixture.board({ bare = true })
            local other, other_id = fixture.user(h)
            assert(h.call("grant", { subject_id = other_id, mask = 3 }))
            local d = definition()
            d.key_prefix = h.prefix
            d.processes[1].states[2] = { id = "doing", category = "started", kind = "gate", release_when = {
                approvals = { min = 1, from = { { kind = "user", id = h.actor:id() }, { kind = "user", id = other_id } } },
                when = { field = "points", op = "gte", value = 1 },
            } }
            d.processes[1].transitions[2].auto, d.processes[1].transitions[2].default = true, true
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task", { points = 0 })
            steps.one(h, { op = "transition", item = id, transition = "start" })
            assert(other("approve", { item = id, visit = 2, decision = "reject" }))
            assert(h.call("approve", { item = id, visit = 2 }))
            steps.one(h, { op = "set", item = id, values = { points = 1 } })
            test.eq(view(h, id).state, "doing")
            test.eq(steps.one(h, { op = "transition", item = id, transition = "finish", force = true }).status, "applied")
            test.eq(view(h, id).state, "done")
            local forced = false
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:item.transitioned" and event.body.force then forced = true end
            end
            test.is_true(forced)
        end)

        test.it("bounds report outputs and records progress before taking on_fail at the attempt limit", function()
            local d = definition()
            local p = d.processes[1]
            p.states[2] = { id = "doing", category = "started", kind = "automated", run = { stage = "build", retry = { max = 1, backoff = "PT1S" }, on_fail = "stop" } }
            p.transitions[3] = { id = "stop", from = { "doing" }, to = "canceled" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            local oversized = assert(h.call("report", { item = id, visit = 2, attempt = 1, outcome = "failed", outputs = { log = string.rep("x", 65536) } }))
            test.eq(oversized.outcomes[1].findings[1].code, "stage_outputs_limit")
            test.eq(view(h, id).state, "doing")
            assert(h.call("report", { item = id, visit = 2, attempt = 1, outcome = "failed", progress = { build = "failed", nodes = string.rep("p", 70000) } }))
            test.eq(view(h, id).state, "canceled")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2 AND outcome = 'failed' AND progress IS NOT NULL", { h.id, id }), 1)
        end)

        test.it("accepts compound wall-clock durations and refuses zero durations", function()
            for _, duration in ipairs({ "P1DT2H", "P2DT3H4M5.5S", "PT1H30M", "P0D" }) do
                local d = definition()
                d.processes[1].states[2] = { id = "doing", category = "started", kind = "gate", release_when = { wait = duration } }
                local h = fixture.board({ bare = true })
                d.key_prefix = h.prefix
                local result, err = h.call("plan_schema", { declaration = d })
                if duration == "P0D" then
                    test.not_nil(err)
                    test.eq(err:details().code, "timer_duration_invalid")
                else test.is_nil(err, steps.detail(err)); test.not_nil(result) end
            end
        end)
    end)

    test.describe("parallel stage execution", function()
        test.it("reports independent regional stage visits and joins after both finish", function()
            local d = definition()
            local p = d.processes[1]
            p.states[2] = { id = "doing", category = "started", kind = "parallel", regions = {
                { id = "qa", initial = "build" }, { id = "security", initial = "build" },
            }, join = "all" }
            p.states[5] = { id = "build", category = "started", kind = "automated", run = { stage = "verify" } }
            p.transitions[2].auto, p.transitions[2].default = true, true
            p.transitions[3] = { id = "passed", from = { "build" }, to = "done" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            local entries = {}
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:stage.entered" then entries[#entries + 1] = event.body end
            end
            test.eq(#entries, 2)
            local current = assert(steps.get(h, id, { "stage_runs" })).stage_runs
            test.eq(#current, 2)
            test.is_true(entries[1].visit ~= entries[2].visit)
            for n, entry in ipairs(entries) do
                local result = assert(h.call("report", { item = id, visit = entry.visit, attempt = 1, outcome = "passed" }))
                test.eq(result.outcomes[1].status, "applied")
                if n == 1 then test.eq(view(h, id).category, "started") end
            end
            test.eq(view(h, id).state, "done")
        end)
    end)

    test.describe("timer ownership", function()
        test.it("retains the entering command's causal trace through a timer job", function()
            local d = definition()
            d.processes[1].states[1].timers = { { id = "trace", after = "PT0.05S", ["then"] = { emit = "sla.breached" } } }
            local h = fixture.board({ declaration = d })
            assert(steps.apply(h, { { op = "create", type = "task" } }, { trace_context = { trace_id = "timer-trace", run_id = "timer-run" } }))
            steps.wait_for("traced timer", function() return event_count(h, "timer.fired") == 1 end)
            local entered, fired = nil, nil
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:item.created" then entered = event end
                if event.type == "kickside.work.events:timer.fired" then fired = event end
            end
            test.not_nil(entered)
            test.not_nil(fired)
            test.eq(fired.trace_context.trace_id, "timer-trace")
            test.eq(fired.trace_context.run_id, "timer-run")
            test.eq(fired.trace_context.caused_by_event_id, entered.id)
        end)

        test.it("keeps declared timer names separate from gate wait timers", function()
            local d = definition()
            local p = d.processes[1]
            p.states[2] = { id = "doing", category = "started", kind = "gate", release_when = { wait = "P1D" }, timers = {
                { id = "wait", after = "PT0.05S", ["then"] = { emit = "sla.breached" } },
            } }
            p.transitions[2].auto, p.transitions[2].default = true, true
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            steps.wait_for("independent declared timer", function() return event_count(h, "timer.fired") == 1 end)
            test.eq(view(h, id).state, "doing")
        end)

        test.it("removes stage and approval rows when their board is deleted", function()
            local h = fixture.board({ bare = true })
            local d = definition()
            d.key_prefix = h.prefix
            d.processes[1].states[1] = { id = "todo", category = "unstarted", kind = "gate", release_when = { approvals = { min = 1, from = { { kind = "user", id = h.actor:id() } } } } }
            d.processes[1].states[2] = { id = "doing", category = "started", kind = "automated", run = { stage = "build" } }
            d.processes[1].transitions[1].auto, d.processes[1].transitions[1].default = true, true
            d.processes[1].transitions[2].id = "passed"
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task")
            assert(h.call("approve", { item = id, visit = 1 }))
            assert(h.call("report", { item = id, visit = 2, attempt = 1, outcome = "passed" }))
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_approval WHERE board_id=$1", { h.id }), 1)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id=$1", { h.id }), 1)
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_approval WHERE board_id=$1", { h.id }), 0)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id=$1", { h.id }), 0)
        end)
    end)

    test.describe("process declarations", function()
        test.it("allows an automatic cycle whose declared effect makes progress", function()
            local d = definition()
            d.processes[1].transitions[3] = { id = "mark", from = { "doing" }, to = "doing", auto = true,
                when = { field = "points", op = "eq", value = 0 }, set = { { field = "points", value = 1 } } }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { points = 0 })
            test.eq(steps.one(h, { op = "transition", item = id, transition = "start" }).status, "applied")
            test.eq(view(h, id).values.points, 1)
            test.eq(view(h, id).state, "doing")
        end)

        test.it("validates timer lookup values before accepting the transition", function()
            local d = definition()
            d.processes[1].states[2].timers = { { id = "sla", after = "PT1H", by = "points", table = { ["1"] = "PT0.05S" }, ["then"] = { transition = "finish" }, interrupting = true } }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { points = 2 })
            local result = steps.one(h, { op = "transition", item = id, transition = "start" })
            test.eq(result.status, "invalid")
            test.eq(result.findings[1].code, "timer_lookup_missing")
            test.eq(view(h, id).state, "todo")
            test.eq(steps.one(h, { op = "set", item = id, values = { points = 1 } }).status, "applied")
            test.eq(steps.one(h, { op = "transition", item = id, transition = "start" }).status, "applied")
            steps.wait_for("lookup deadline", function() return view(h, id).state == "done" end)
        end)

        test.it("accepts the declared stage attempt budget without an undeclared cap", function()
            local d = definition()
            d.processes[1].states[2] = { id = "doing", category = "started", kind = "automated", run = {
                stage = "build", retry = { max = 1000, backoff = "PT1S" },
            } }
            local h = fixture.board({ bare = true })
            d.key_prefix = h.prefix
            assert(h.call("apply_schema", { declaration = d }))
            test.eq(assert(h.call("get_schema", {})).compiled.processes[1].states[2].run.retry.max, 1000)
        end)

        test.it("classifies gate release changes as semantic and validates their predicates", function()
            local d = definition()
            d.processes[1].states[2] = { id = "doing", category = "started", kind = "gate", release_when = { when = { field = "points", op = "gte", value = 1 } } }
            local h = fixture.board({ declaration = d })
            d.processes[1].states[2].release_when.when.value = 2
            local plan = assert(h.call("plan_schema", { declaration = d }))
            test.eq(plan.class, "semantic")
            test.is_true(#plan.changes > 0)
            d.processes[1].states[2].release_when.when.field = "owner"
            local _, err = h.call("plan_schema", { declaration = d })
            test.not_nil(err)
            test.eq(err:details().code, "field_unindexed")
        end)
    end)

    test.describe("process entry facts", function()
        test.it("enters an automated remediation stage through a gate rejection", function()
            local h = fixture.board({ bare = true })
            local d = definition()
            d.key_prefix = h.prefix
            d.processes[1].states[2] = { id = "doing", category = "started", kind = "gate", release_when = { approvals = { min = 1, from = { { kind = "user", id = h.actor:id() } } } } }
            d.processes[1].states[5] = { id = "remediate", category = "started", kind = "automated", run = { stage = "repair" } }
            d.processes[1].transitions[3] = { id = "reject", from = { "doing" }, to = "remediate" }
            d.processes[1].transitions[4] = { id = "passed", from = { "remediate" }, to = "done" }
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            assert(h.call("approve", { item = id, visit = 2, decision = "reject" }))
            test.eq(event_count(h, "stage.entered"), 1)
            test.eq(assert(h.call("report", { item = id, visit = 3, attempt = 1, outcome = "passed" })).outcomes[1].status, "applied")
            test.eq(view(h, id).state, "done")
        end)

        test.it("enters and reports a stage reached by a follow migration", function()
            local d = definition()
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            d.processes[1].states[2] = { id = "build", category = "started", kind = "automated", run = { stage = "build" } }
            d.processes[1].transitions[1].to = "build"
            d.processes[1].transitions[2] = { id = "passed", from = { "build" }, to = "done" }
            d.processes[1].map = { doing = "build" }
            assert(h.call("apply_schema", { declaration = d }))
            steps.wait_for("stage migration", function() return rows.stale(h.id) == 0 end)
            test.eq(event_count(h, "stage.entered"), 1)
            test.eq(assert(h.call("report", { item = id, visit = 3, attempt = 1, outcome = "passed" })).outcomes[1].status, "applied")
            test.eq(view(h, id).state, "done")
        end)
    end)

    test.describe("pinned migration ownership", function()
        test.it("keeps existing pinned items on their generation when new items follow", function()
            local d = definition()
            d.processes[1].migration = "pin"
            local h = fixture.board({ declaration = d })
            local old = steps.create(h, "task")
            d.processes[1].migration = "follow"
            d.processes[1].transitions[1].id = "begin"
            assert(h.call("apply_schema", { declaration = d }))
            steps.wait_for("new follow migration", function() return rows.job(h.id).status == "done" end)
            test.eq(view(h, old).process_generation, 1)
            test.eq(steps.one(h, { op = "transition", item = old, transition = "start" }).status, "applied")
            local fresh = steps.create(h, "task")
            test.eq(view(h, fresh).process_generation, 2)
            test.eq(steps.one(h, { op = "transition", item = fresh, transition = "begin" }).status, "applied")
        end)
    end)

    test.describe("WIP acceptance", function()
        test.it("admits only one concurrent entrant at a hard WIP limit", function()
            local d = definition()
            d.policy = { wip = { doing = { limit = 1, hard = true } } }
            local h = fixture.board({ declaration = d })
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            local results = steps.parallel(h, {
                { ops = { { op = "transition", item = a, transition = "start" } } },
                { ops = { { op = "transition", item = b, transition = "start" } } },
            })
            local applied, refused = 0, 0
            for _, result in ipairs(results) do
                local outcome = result.outcomes[1]
                if outcome.status == "applied" then applied = applied + 1
                else
                    test.eq(outcome.status, "invalid")
                    test.eq(outcome.findings[1].code, "wip_limit")
                    refused = refused + 1
                end
            end
            test.eq(applied, 1)
            test.eq(refused, 1)
        end)

        test.it("enforces hard limits and reports soft limits without rejecting the command", function()
            for _, hard in ipairs({ true, false }) do
                local d = definition()
                d.policy = { wip = { doing = { limit = 1, hard = hard } } }
                local h = fixture.board({ declaration = d })
                local a, b = steps.create(h, "task"), steps.create(h, "task")
                test.eq(steps.one(h, { op = "transition", item = a, transition = "start" }).status, "applied")
                local out = steps.one(h, { op = "transition", item = b, transition = "start" })
                test.eq(out.status, hard and "invalid" or "applied")
                test.eq(out.findings[1].code, "wip_limit")
                test.eq(view(h, b).state, hard and "todo" or "doing")
            end
        end)
    end)
end

return { run = test.run_cases(define) }
