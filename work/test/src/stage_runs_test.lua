-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local funcs = require("funcs")
local scoped = require("scoped")
local time = require("time")

type Map = { [string]: unknown }
local function declaration(): Map
    return { key_prefix = fixture.fresh_prefix(), fields = { { code = "title", form = "text" } },
        item_types = { { id = "task", process = "flow", fields = { "title" } } },
        processes = { { id = "flow", initial = "triage", states = {
            { id = "triage", category = "started", kind = "automated", run = { stage = "triage", on_pass = "implement" } },
            { id = "implement", category = "started", kind = "automated", run = { stage = "implement", on_pass = "verify" } },
            { id = "verify", category = "started", kind = "automated", run = { stage = "verify", on_pass = "complete", on_cancel = "stop", on_fail = "stop" } },
            { id = "done", category = "completed" }, { id = "canceled", category = "canceled" },
        }, transitions = {
            { id = "implement", from = { "triage" }, to = "implement" },
            { id = "verify", from = { "implement" }, to = "verify" },
            { id = "complete", from = { "verify" }, to = "done" },
            { id = "stop", from = { "verify" }, to = "canceled" },
        } } } }
end
local function legacy(): Map
    local d = declaration()
    d.processes[1].states = {
        { id = "triage", category = "started", kind = "automated", run = { stage = "build" } },
        { id = "done", category = "completed" }, { id = "canceled", category = "canceled" },
    }
    d.processes[1].transitions = {
        { id = "passed", from = { "triage" }, to = "done" },
        { id = "canceled", from = { "triage" }, to = "canceled" },
        { id = "restart", from = { "done" }, to = "triage" },
    }
    return d
end
local function report(h: fixture.Handle, id: string, visit: integer, outcome: string)
    local out, err = h.call("report", { item = id, visit = visit, attempt = 1, outcome = outcome,
        outputs = { artifact = "https://example.com/build", count = 3 }, progress = { build = "complete" }, trace_context = { trace_id = "stage-trace", run_id = "flow-123" } })
    assert(out, steps.detail(err))
    test.eq(out.outcomes[1].status, "applied")
end
local function define()
    test.describe("stage routing", function()
        test.it("routes each of three automated stages through its own pass transition", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            for visit, state in ipairs({ "implement", "verify", "done" }) do
                report(h, id, visit, "passed")
                test.eq(assert(steps.get(h, id)).item.state, state)
            end
        end)
        test.it("keeps omitted pass and cancel routes compatible", function()
            local d = legacy()
            d.processes[1].transitions[4] = { id = "failed", from = { "triage" }, to = "canceled" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            report(h, id, 1, "passed")
            test.eq(assert(steps.get(h, id)).item.state, "done")
            local canceled = steps.create(h, "task")
            report(h, canceled, 1, "canceled")
            test.eq(assert(steps.get(h, canceled)).item.state, "canceled")
            local failed = steps.create(h, "task")
            report(h, failed, 1, "failed")
            test.eq(assert(steps.get(h, failed)).item.state, "canceled")
        end)
        test.it("uses a stage-specific cancellation transition", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            report(h, id, 1, "passed"); report(h, id, 2, "passed"); report(h, id, 3, "canceled")
            test.eq(assert(steps.get(h, id)).item.state, "canceled")
        end)
        for _, key in ipairs({ "on_pass", "on_cancel", "on_fail" }) do
            test.it("refuses unknown and foreign " .. key .. " transitions at compile", function()
                for _, transition in ipairs({ "missing", "restart" }) do
                    local d = legacy()
                    d.processes[1].states[1].run[key] = transition
                    local h = fixture.board({ bare = true }); d.key_prefix = h.prefix
                    local _, err = h.call("plan_schema", { declaration = d })
                    test.not_nil(err)
                    test.eq(err:kind(), errors.INVALID)
                    test.eq(err:details().code, "stage_" .. key .. "_unknown")
                end
            end)
        end
        test.it("classifies a changed pass route as a semantic process change", function()
            local d = declaration()
            d.processes[1].transitions[5] = { id = "alternate", from = { "triage" }, to = "verify" }
            local h = fixture.board({ declaration = d })
            d.processes[1].states[1].run.on_pass = "alternate"
            local plan = assert(h.call("plan_schema", { declaration = d }))
            test.eq(plan.class, "semantic")
            test.is_true(#plan.changes > 0)
        end)
    end)
    test.describe("stage timeout", function()
        test.it("fails a silent attempt and applies its failure route", function()
            local d = legacy()
            d.policy = { stage_timeout = "P1D" }
            d.processes[1].states[1].run.timeout = "PT0.1S"
            d.processes[1].states[1].run.on_fail = "canceled"
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.wait_for("silent stage timeout", function()
                return assert(steps.get(h, id)).item.state == "canceled"
            end)
            local runs = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs
            test.eq(#runs, 1); test.eq(runs[1].outcome, "failed")
            test.eq(runs[1].outputs.error, "stage_timeout")
            local late = assert(h.call("report", { item = id, visit = 1, attempt = 1, outcome = "passed" }))
            test.eq(late.outcomes[1].status, "invalid")
            test.eq(late.outcomes[1].findings[1].code, "stage_attempt_finished")
        end)
        test.it("times out every retry using the board policy", function()
            local d = legacy()
            d.policy = { stage_timeout = "PT0.1S" }
            d.processes[1].states[1].run.on_fail = "canceled"
            d.processes[1].states[1].run.retry = { max = 2, backoff = "PT0.1S" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.wait_for("retry timeout", function()
                return assert(steps.get(h, id)).item.state == "canceled"
            end)
            local runs = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs
            test.eq(#runs, 2)
            for _, run in ipairs(runs) do
                test.eq(run.outcome, "failed"); test.eq(run.outputs.error, "stage_timeout")
            end
        end)
        test.it("arms the engine deadline and lets a report finish first", function()
            local h = fixture.board({ declaration = legacy() })
            local id = steps.create(h, "task")
            local db = assert(store.open())
            local item = assert(store.item(db, h.id, id)); db:release()
            local deadlines = 0
            for _, at in pairs(item.work.timer_due or {}) do
                test.is_true(at > item.work.entered_at); deadlines = deadlines + 1
            end
            test.eq(deadlines, 1)
            report(h, id, 1, "passed")
            test.eq(assert(steps.get(h, id)).item.state, "done")
        end)
    end)
    test.describe("stage visit budget", function()
        test.it("stops ping-pong at the per-state budget without starting another automation", function()
            local d = declaration()
            d.processes[1].states[2].run.max_visits = 2
            d.processes[1].states[3].run.on_fail = "repair"
            d.processes[1].transitions[5] = { id = "repair", from = { "verify" }, to = "implement" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            for visit, outcome in ipairs({ "passed", "passed", "failed", "passed", "failed" }) do
                report(h, id, visit, outcome)
            end
            local got = assert(steps.get(h, id, { "stage_runs" }))
            test.eq(got.item.state, "implement")
            test.eq(#got.stage_runs, 1)
            test.eq(got.stage_runs[1].outcome, "failed")
            test.eq(got.stage_runs[1].outputs.error, "stage_visits_exhausted")
            local entered = 0
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:stage.entered" and event.body.item == id then entered = entered + 1 end
            end
            test.eq(entered, 5)
            local fresh = steps.create(h, "task")
            report(h, fresh, 1, "passed")
            test.is_nil(assert(steps.get(h, fresh, { "stage_runs" })).stage_runs[1].outcome)
        end)
        test.it("routes an exhausted destination from its incoming state", function()
            local d = declaration()
            d.policy = { stage_max_visits = 1 }
            d.processes[1].transitions[4].from = "any"
            d.processes[1].states[2].run.on_exhausted = "stop"
            d.processes[1].states[3].run.on_fail = "repair"
            d.processes[1].transitions[5] = { id = "repair", from = { "verify" }, to = "implement" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            report(h, id, 1, "passed"); report(h, id, 2, "passed"); report(h, id, 3, "failed")
            test.eq(assert(steps.get(h, id)).item.state, "canceled")
            test.eq(#assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs, 3)
        end)
        test.it("rejects exhaustion routes that cannot leave every incoming state", function()
            local d = declaration()
            d.processes[1].states[2].run.on_exhausted = "complete"
            local h = fixture.board({ bare = true }); d.key_prefix = h.prefix
            local _, err = h.call("plan_schema", { declaration = d })
            test.not_nil(err); test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "stage_on_exhausted_unknown")
        end)
    end)
    test.describe("human stage control", function()
        test.it("lists people actions without automation-only routes on point and awaiting pages", function()
            local d = legacy()
            d.processes[1].initial = "waiting"
            d.processes[1].states[4] = { id = "waiting", category = "started", awaiting = { group = "app.security:work_test" } }
            d.processes[1].states[1].run = { stage = "build", on_pass = "passed", on_fail = "failed", on_cancel = "canceled", on_exhausted = "exhausted" }
            d.processes[1].transitions = {
                { id = "passed", from = "any", to = "done" },
                { id = "failed", from = "any", to = "done" },
                { id = "canceled", from = "any", to = "canceled" },
                { id = "exhausted", from = "any", to = "canceled" },
                { id = "start", name = "Start build", from = { "waiting" }, to = "triage" },
            }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            local function check(expected: integer)
                local point = steps.get(h, id, { "transitions" }).transitions
                local page = assert(h.call("query", { where = { awaiting = true }, include = { "transitions", "awaiting" } }))
                test.eq(#point, expected)
                test.eq(#page.items, 1)
                test.eq(#page.items[1].transitions, expected)
                test.eq(point[1].id, "start")
                test.eq(point[1].name, "Start build")
            end
            check(1)
            d.processes[1].transitions[4].people = true
            d.processes[1].transitions[4].order = 1
            d.processes[1].transitions[4].name = "Stop work"
            assert(h.call("apply_schema", { declaration = d }))
            steps.wait_for("people action migration", function(): boolean return steps.get(h, id).item.process_generation == 2 end)
            check(2)
        end)
        test.it("lets an administrator take a global transition and closes the open attempt", function()
            local d = legacy()
            d.processes[1].transitions[4] = { id = "stop", from = "any", to = "canceled" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            local transitions = assert(steps.get(h, id, { "transitions" })).transitions
            local offered = false
            for _, t in ipairs(transitions) do if t.id == "stop" then offered = true end end
            test.is_true(offered)
            test.eq(steps.one(h, { op = "transition", item = id, transition = "stop" }).status, "applied")
            test.eq(assert(steps.get(h, id)).item.state, "canceled")
            local run = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1]
            test.eq(run.outcome, "canceled"); test.eq(run.outputs.reason, "transition")
            local canceled, transitioned = nil, nil
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:stage.reported" then canceled = event end
                if event.type == "kickside.work.events:item.transitioned" then transitioned = event end
            end
            test.not_nil(canceled); test.not_nil(transitioned)
            test.eq(run.outputs.by, transitioned.body.actor)
            test.is_true(canceled.seq < transitioned.seq)
            local late = assert(h.call("report", { item = id, visit = 1, attempt = 1, outcome = "passed" }))
            test.eq(late.outcomes[1].findings[1].code, "stage_attempt_finished")
        end)
        test.it("lets a writer stop a stage only when the named transition condition holds", function()
            local d = legacy()
            d.processes[1].transitions[4] = { id = "stop", from = "any", to = "canceled", when = { field = "title", op = "eq", value = "stop" } }
            d.fields[1].index = "key"
            local h = scoped.board(scoped.admin(), d)
            local writer = scoped.member()
            assert(h.call("grant", { subject_id = writer.id, mask = 3 }))
            local id = steps.create(h, "task", { title = "keep" })
            local denied = assert(writer.call("apply", { ops = { { op = "transition", item = id, transition = "stop" } } }, h.id))
            test.eq(denied.outcomes[1].status, "denied")
            test.eq(denied.outcomes[1].findings[1].code, "when_failed")
            test.is_nil(assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1].outcome)
            steps.one(h, { op = "set", item = id, values = { title = "stop" } })
            local stopped = assert(writer.call("apply", { ops = { { op = "transition", item = id, transition = "stop" } } }, h.id))
            test.eq(stopped.outcomes[1].status, "applied")
            test.eq(assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1].outputs.by, writer.id)
        end)
    end)
    test.describe("stage lifecycle boundaries", function()
        test.it("bounds visits by the engine default when no budget is declared", function()
            local h = fixture.board({ declaration = legacy() })
            local id = steps.create(h, "task")
            for n = 1, 5 do
                report(h, id, n * 2 - 1, "passed")
                test.eq(steps.one(h, { op = "transition", item = id, transition = "restart" }).status, "applied")
            end
            local run = assert(steps.get(h, id, { "stage_runs" })).stage_runs[1]
            test.eq(run.visit, 11); test.eq(run.outputs.error, "stage_visits_exhausted")
        end)
        test.it("cancels only the departing regional attempt and closes all attempts on a forced parent exit", function()
            local d = legacy()
            local p = d.processes[1]
            p.initial = "lanes"
            p.states[4] = { id = "lanes", category = "started", kind = "parallel", regions = { { id = "qa", initial = "triage" }, { id = "security", initial = "triage" } }, join = "all" }
            p.transitions[4] = { id = "stop", from = "any", to = "canceled" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            test.eq(steps.one(h, { op = "transition", item = id, region = "qa", transition = "stop" }).status, "applied")
            local runs = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs
            local closed = 0
            for _, run in ipairs(runs) do if run.outcome == "canceled" then closed = closed + 1 end end
            test.eq(closed, 1)
            test.eq(steps.one(h, { op = "transition", item = id, transition = "stop", force = true }).status, "applied")
            for _, run in ipairs(assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs) do
                test.eq(run.outcome, "canceled"); test.eq(run.outputs.reason, "transition")
            end
        end)
        test.it("records a timeout even when the stage declares no failure exit", function()
            local d = legacy(); d.processes[1].states[1].run.timeout = "PT0.1S"
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.wait_for("visible unrouted timeout", function()
                return assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1].outcome == "failed"
            end)
            local run = assert(steps.get(h, id, { "stage_runs" })).stage_runs[1]
            test.eq(run.outputs.error, "stage_timeout")
            test.eq(assert(steps.get(h, id)).item.state, "triage")
        end)
    end)
    test.describe("stage entry ownership", function()
        test.it("keeps a finished visit timer from failing the next stage", function()
            local d = declaration()
            d.processes[1].states[1].run.timeout = "PT0.5S"
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            report(h, id, 1, "passed")
            time.sleep("700ms")
            local got = assert(steps.get(h, id, { "stage_runs" }))
            test.eq(got.item.state, "implement")
            test.is_nil(got.stage_runs[1].outcome)
            test.eq(#assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs, 2)
        end)
        test.it("shares a state visit budget across parallel regions", function()
            local d = legacy(); local p = d.processes[1]
            p.initial = "lanes"; p.states[1].run.max_visits = 1
            p.states[4] = { id = "lanes", category = "started", kind = "parallel", regions = { { id = "qa", initial = "triage" }, { id = "security", initial = "triage" } }, join = "all" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            local runs = assert(steps.get(h, id, { "stage_runs" })).stage_runs
            test.eq(#runs, 2)
            test.eq(runs[1].outputs.error, "stage_visits_exhausted")
            test.is_nil(runs[2].outcome)
            local entered = 0
            for _, event in ipairs(steps.events(h)) do if event.type == "kickside.work.events:stage.entered" then entered = entered + 1 end end
            test.eq(entered, 1)
        end)
        test.it("keeps automated visit counts when a follow migration re-enters a regional state", function()
            local d = legacy(); local p = d.processes[1]
            p.initial, p.migration = "lanes", "follow"; p.states[1].run.max_visits = 1
            p.states[4] = { id = "lanes", category = "started", kind = "parallel", regions = { { id = "qa", initial = "triage" } }, join = "all" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            report(h, id, 2, "passed")
            table.remove(p.states :: { Map }, 2)
            p.transitions = { { id = "passed", from = { "triage" }, to = "canceled" }, { id = "canceled", from = { "triage" }, to = "canceled" } }
            p.map = { done = "triage" }
            assert(h.call("apply_schema", { declaration = d }))
            steps.wait_for("regional stage migration", function()
                return assert(steps.get(h, id)).item.process_generation == 2
            end)
            local run = assert(steps.get(h, id, { "stage_runs" })).stage_runs[1]
            test.eq(run.outputs.error, "stage_visits_exhausted")
            test.eq(run.outcome, "failed")
        end)
    end)
    test.describe("exhaustion route declarations", function()
        test.it("rejects a cycle made only of exhaustion routes", function()
            local d = legacy()
            d.processes[1].states[1].run.on_exhausted = "restart"
            d.processes[1].transitions[3].from = "any"
            local h = fixture.board({ bare = true }); d.key_prefix = h.prefix
            local _, err = h.call("plan_schema", { declaration = d })
            test.not_nil(err); test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "stage_on_exhausted_cycle")
        end)
    end)
    test.describe("regional exhaustion routing", function()
        test.it("takes a global exhaustion route for a regional initial entry", function()
            local d = legacy(); local p = d.processes[1]
            p.initial = "lanes"; p.states[1].run.max_visits = 1; p.states[1].run.on_exhausted = "stop"
            p.states[4] = { id = "lanes", category = "started", kind = "parallel", regions = { { id = "qa", initial = "triage" }, { id = "security", initial = "triage" } }, join = "all" }
            p.transitions[4] = { id = "stop", from = "any", to = "canceled" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            local got = assert(steps.get(h, id))
            test.eq(got.item.state.qa, "triage"); test.eq(got.item.state.security, "canceled")
            test.eq(#assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs, 1)
        end)
    end)
    test.describe("stage run retention", function()
        test.it("drains stage runs when their item is purged", function()
            local d = legacy(); d.policy = { trash_days = 1 }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            report(h, id, 1, "passed")
            steps.one(h, { op = "delete", item = id })
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2 AND item_id = $3", { "2000-01-01T00:00:00Z", h.id, id }))
            assert(db:execute("UPDATE kickside_work_retention SET board_after = $1, inclusive = 1, item_after = '', deadline_ms = NULL WHERE owner_id = 'work'", { h.id }))
            db:release()
            steps.retention_sweep(function(): boolean
                assert(h.call("settle", {}))
                db = assert(store.open())
                local item = assert(store.item(db, h.id, id))
                local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2", { h.id, id }))
                db:release()
                return item.life == "purged" and tonumber(rows[1].n) == 0
            end)
        end)
    end)
    test.describe("stage run reads", function()
        test.it("pages runs newest first and includes only the current visit in get", function()
            local h = fixture.board({ declaration = legacy() })
            local id = steps.create(h, "task")
            local entered = assert(steps.get(h, id, { "stage_runs" }))
            test.eq(#entered.stage_runs, 1); test.eq(entered.stage_runs[1].state, "triage")
            test.not_nil(entered.stage_runs[1].started_at); test.is_nil(entered.stage_runs[1].finished_at)
            report(h, id, 1, "passed")
            steps.one(h, { op = "transition", item = id, transition = "restart" })
            report(h, id, 3, "passed")
            test.eq(#assert(steps.get(h, id, { "stage_runs" })).stage_runs, 0)
            local first, err = h.call("list_stage_runs", { item = { id = id }, limit = 1 })
            assert(first, steps.detail(err))
            test.eq(#first.stage_runs, 1); test.eq(first.stage_runs[1].visit, 3)
            test.eq(first.stage_runs[1].attempt, 1); test.eq(first.stage_runs[1].outcome, "passed")
            test.eq(first.stage_runs[1].outputs.count, 3); test.eq(first.stage_runs[1].progress.build, "complete")
            test.eq(first.stage_runs[1].flow_run, "flow-123"); test.not_nil(first.stage_runs[1].finished_at)
            test.not_nil(first.after)
            steps.one(h, { op = "transition", item = id, transition = "restart" })
            report(h, id, 5, "passed")
            local second = assert(h.call("list_stage_runs", { item = { key = assert(steps.get(h, id)).item.key }, limit = 1, after = first.after }))
            test.eq(#second.stage_runs, 1); test.eq(second.stage_runs[1].visit, 1); test.is_nil(second.after)
        end)
        test.it("exposes the recorded retry deadline only while its attempt is current", function()
            local d = legacy()
            d.processes[1].states[1].run.retry = { max = 2, backoff = "PT1H" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            test.is_nil(assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1].retry_at)
            report(h, id, 1, "failed")
            local paged = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1]
            test.not_nil(paged.retry_at)
            local point = assert(steps.get(h, id, { "stage_runs" })).stage_runs[1]
            test.eq(point.retry_at, paged.retry_at)
            steps.one(h, { op = "transition", item = id, transition = "passed" })
            test.is_nil(assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1].retry_at)
        end)
        test.it("pages retry attempts within a visit newest first", function()
            local d = legacy()
            d.processes[1].states[1].run.retry = { max = 2, backoff = "PT0.05S" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            report(h, id, 1, "failed")
            steps.wait_for("second stage attempt", function(): boolean
                local got = assert(h.call("list_stage_runs", { item = { id = id } }))
                return got.stage_runs[1].attempt == 2
            end)
            local current = assert(steps.get(h, id, { "stage_runs" })).stage_runs
            test.eq(#current, 2); test.eq(current[1].attempt, 2); test.eq(current[2].outcome, "failed")
            local first = assert(h.call("list_stage_runs", { item = { id = id }, limit = 1 }))
            test.eq(first.stage_runs[1].visit, 1); test.eq(first.stage_runs[1].attempt, 2)
            local second = assert(h.call("list_stage_runs", { item = { id = id }, limit = 1, after = first.after }))
            test.eq(second.stage_runs[1].attempt, 1); test.is_nil(second.after)
            local completed = assert(h.call("report", { item = id, visit = 1, attempt = 2, outcome = "passed" }))
            test.eq(completed.outcomes[1].status, "applied")
        end)
        test.it("rejects malformed stage-run continuations", function()
            local h = fixture.board({ declaration = legacy() })
            local id = steps.create(h, "task")
            for _, after in ipairs({ "bad", "0:1", "1:0", "999999999999999999999:1" }) do
                local _, err = h.call("list_stage_runs", { item = { id = id }, after = after })
                test.not_nil(err); test.eq(err:kind(), errors.INVALID); test.eq(err:details().code, "stage_runs_cursor_invalid")
            end
        end)
        test.it("serves the same stage run page over HTTP and the read tool", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin, legacy())
            local id = steps.create(h, "task")
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local page, err = member.call("list_stage_runs", { item = { id = id }, limit = 1 }, h.id)
            assert(page, steps.detail(err)); test.eq(page.stage_runs[1].state, "triage")
            local http = member.http("POST", "/" .. h.id .. "/list_stage_runs", { item = { id = id }, limit = 1 })
            test.eq(http.status, 200); test.eq(http.body.data.stage_runs[1].visit, page.stage_runs[1].visit)
            local tool, terr = funcs.new():with_actor(member.actor):with_scope(member.scope):with_context({ board_id = h.id }):call("kickside.work.traits:list_stage_runs", { item = { id = id }, limit = 1 })
            assert(tool, steps.detail(terr)); test.is_true(tool.success); test.eq(tool.stage_runs[1].visit, page.stage_runs[1].visit)
        end)
        test.it("requires board READ and item visibility for stage run pages", function()
            local d = legacy()
            d.fields[2] = { code = "level", form = "text", index = "key" }
            d.item_types[1].fields[2] = "level"
            d.visibility = { field = "level", levels = { { id = "hidden", holders = {} } } }
            local h = scoped.board(scoped.admin(), d)
            local id = steps.create(h, "task")
            test.eq(steps.one(h, { op = "set", item = id, values = { level = "hidden" } }).status, "applied")
            local _, err = h.call("list_stage_runs", { item = { id = id } })
            test.not_nil(err); test.eq(err:kind(), errors.NOT_FOUND, steps.detail(err))
            local reader = scoped.member()
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local _, hidden = reader.call("list_stage_runs", { item = { id = id } }, h.id)
            test.not_nil(hidden); test.eq(hidden:kind(), errors.NOT_FOUND, steps.detail(hidden))
            local other = scoped.member()
            local _, denied = other.call("list_stage_runs", { item = { id = id } }, h.id)
            test.not_nil(denied)
        end)
    end)
end
return { run = test.run_cases(define) }
