-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local rows = require("rows")
local time = require("time")

local function declaration()
    return {
        key_prefix = fixture.fresh_prefix(),
        fields = { { code = "points", form = "int", index = "number" } },
        item_types = { { id = "task", process = "flow", fields = { "points" } } },
        processes = { {
            id = "flow", initial = "ready", migration = "pin",
            states = {
                { id = "ready", category = "unstarted" },
                { id = "build", category = "started", kind = "automated", run = { stage = "build", on_pass = "pass", on_fail = "fail" } },
                { id = "done", category = "completed" },
                { id = "stopped", category = "canceled" },
            },
            transitions = {
                { id = "start", from = { "ready" }, to = "build" },
                { id = "pass", from = { "build" }, to = "done" },
                { id = "fail", from = { "build" }, to = "stopped" },
                { id = "again", from = { "done" }, to = "build" },
            },
        } },
    }
end

local function start(h: fixture.Handle, values: { [string]: unknown }?): string
    local item = steps.create(h, "task", values)
    test.eq(steps.one(h, { op = "transition", item = item, transition = "start" }).status, "applied")
    return item
end

local function runs(h: fixture.Handle, item: string)
    local out, err = h.call("list_stage_runs", { item = { id = item } })
    assert(out, steps.detail(err))
    return out.stage_runs
end

local function state(h: fixture.Handle, item: string)
    return assert(steps.get(h, item)).item.state
end

local function process_jobs(h: fixture.Handle, predicate: string): integer
    return rows.scalar("SELECT COUNT(*) AS n FROM kickside_job WHERE owner_id = $1 AND job_type = $2 AND " .. predicate,
        { h.id, "kickside.work.jobs:process" })
end

local function gate_board(when_reject)
    local h = fixture.board({ bare = true })
    local decl = declaration()
    decl.key_prefix = h.prefix
    decl.processes[1].states[2] = { id = "build", category = "started", kind = "gate",
        release_when = { approvals = { min = 1, from = { { kind = "user", id = h.actor:id() } } } } }
    decl.processes[1].transitions[2].auto = true
    decl.processes[1].transitions[3].id = "reject"
    decl.processes[1].transitions[3].when = when_reject
    assert(h.call("apply_schema", { declaration = decl }))
    return h
end

local function facts(h: fixture.Handle, item: string, event_type: string): integer
    local count = 0
    for _, event in ipairs(steps.events(h)) do
        if event.type == event_type and event.body.item == item then count = count + 1 end
    end
    return count
end

local function assert_replay(h: fixture.Handle, method: string, request, first)
    local replay = assert(h.call(method, request))
    test.is_true(replay.replayed)
    test.not_nil(first.seq)
    test.eq(replay.seq, first.seq)
    test.eq(#replay.outcomes, #first.outcomes)
    for i, outcome in ipairs(first.outcomes) do
        test.eq(replay.outcomes[i].status, outcome.status)
        test.eq(replay.outcomes[i].version, outcome.version)
    end
end

local function define()
    test.describe("Work process routes", function()
        test.it("records a timeout whose failure transition is ineligible", function()
            local decl = declaration()
            decl.processes[1].states[2].run.timeout = "PT0.25S"
            decl.processes[1].transitions[3].when = { field = "points", op = "gte", value = 1 }
            local h = fixture.board({ declaration = decl })
            local item = start(h, { points = 0 })
            steps.wait_for("terminal native timeout job", function()
                return process_jobs(h, "status IN ('done','dead','cancelled')") == 1
            end)
            local run = runs(h, item)[1]
            test.eq(run.outcome, "failed")
            test.eq(run.outputs.error, "stage_timeout")
            test.eq(state(h, item), "build")
            test.eq(process_jobs(h, "status = 'done'"), 1)
            test.eq(facts(h, item, "kickside.work.events:timer.fired"), 1)
            test.eq(facts(h, item, "kickside.work.events:stage.reported"), 1)
        end)

        test.it("keeps an attempt outcome when a hard WIP limit refuses its failure route", function()
            local decl = declaration()
            decl.processes[1].states[4].category = "started"
            decl.policy = { wip = { stopped = { limit = 1, hard = true } } }
            local h = fixture.board({ declaration = decl })
            local first, second = start(h), start(h)
            test.eq(assert(h.call("report", { item = first, visit = 2, attempt = 1, outcome = "failed" })).outcomes[1].status, "applied")
            test.eq(state(h, first), "stopped")
            local refused = assert(h.call("report", { item = second, visit = 2, attempt = 1, outcome = "failed" })).outcomes[1]
            test.eq(refused.status, "applied")
            test.eq(refused.findings[1].code, "wip_limit")
            test.eq(runs(h, second)[1].outcome, "failed")
            test.eq(state(h, second), "build")
        end)

        test.it("records an eligible rejection whose reject transition is ineligible", function()
            local h = gate_board({ field = "points", op = "gte", value = 1 })
            local item = start(h, { points = 0 })
            local result = assert(h.call("approve", { item = item, visit = 2, decision = "reject" }))
            test.eq(result.outcomes[1].status, "applied")
            local gate = assert(steps.get(h, item)).item.gate
            test.eq(gate.approvals[1].decision, "reject")
            test.eq(state(h, item), "build")
        end)

        test.it("uses the same live reference validation for report and named transitions", function()
            local h = fixture.board({ bare = true })
            local decl = declaration()
            decl.key_prefix = h.prefix
            decl.fields[2] = { code = "peer", type = "item", index = "key" }
            decl.item_types[1].fields[2] = "peer"
            assert(h.call("apply_schema", { declaration = decl }))
            local peer = steps.create(h, "task")
            decl.processes[1].transitions[2].set = {
                { field = "peer", value = { board = h.id, item = peer } },
            }
            assert(h.call("apply_schema", { declaration = decl }))
            local manual_item, reported_item = start(h), start(h)
            test.eq(steps.one(h, { op = "delete", item = peer }).status, "applied")
            local manual = steps.one(h, { op = "transition", item = manual_item, transition = "pass" })
            test.eq(manual.status, "invalid")
            test.eq(manual.findings[1].code, "invalid_reference")
            local input = { item = reported_item, visit = 2, attempt = 1, outcome = "passed" }
            local reported = assert(h.call("report", input)).outcomes[1]
            test.eq(state(h, reported_item), "build")
            test.eq(reported.status, "invalid")
            test.eq(reported.findings[1].code, "invalid_reference")
            test.is_nil(runs(h, reported_item)[1].outcome)
            test.eq(steps.one(h, { op = "restore", item = peer }).status, "applied")
            test.eq(assert(h.call("report", input)).outcomes[1].status, "applied")
            test.eq(state(h, reported_item), "done")
        end)

        test.it("closes an unfinished sibling when a join-any parallel state exits", function()
            local decl = declaration()
            local process = decl.processes[1]
            process.initial = "lanes"
            process.states[5] = { id = "lanes", category = "started", kind = "parallel", join = "any",
                regions = { { id = "first", initial = "build" }, { id = "second", initial = "build" } } }
            process.transitions[5] = { id = "join", from = { "lanes" }, to = "done", auto = true }
            local h = fixture.board({ declaration = decl })
            local item = steps.create(h, "task")
            local result = assert(h.call("report", { item = item, visit = 2, attempt = 1, outcome = "passed" }))
            test.eq(result.outcomes[1].status, "applied")
            test.eq(state(h, item), "done")
            local stages = runs(h, item)
            test.eq(#stages, 2)
            test.eq(stages[2].outcome, "passed")
            test.eq(stages[1].outcome, "canceled")
            test.not_nil(stages[1].finished_at)
            test.eq(facts(h, item, "kickside.work.events:stage.reported"), 2)
        end)

        test.it("does not strand a failed visit when the board visit limit is lowered", function()
            local decl = declaration()
            decl.policy = { stage_max_visits = 2 }
            decl.processes[1].states[2].run.retry = { max = 2, backoff = "PT1H" }
            local h = fixture.board({ declaration = decl })
            local item = start(h)
            local first = assert(h.call("report", { item = item, visit = 2, attempt = 1, outcome = "passed" }))
            test.eq(first.outcomes[1].status, "applied")
            test.eq(steps.one(h, { op = "transition", item = item, transition = "again" }).status, "applied")
            decl.policy.stage_max_visits = 1
            assert(h.call("apply_schema", { declaration = decl }))
            local second = assert(h.call("report", { item = item, visit = 4, attempt = 1, outcome = "failed" }))
            test.eq(second.outcomes[1].status, "applied")
            local run = runs(h, item)[1]
            test.eq(run.outcome, "failed")
            test.is_true(run.retry_at ~= nil or state(h, item) == "stopped",
                "the failed visit has neither a retry nor its failure transition")
            test.not_nil(run.retry_at)
            test.eq(state(h, item), "build")
        end)

        test.it("anchors a timed-out attempt's retry at its finish plus backoff", function()
            local decl = declaration()
            decl.processes[1].states[2].run.timeout = "PT0.25S"
            decl.processes[1].states[2].run.retry = { max = 2, backoff = "PT1H" }
            local h = fixture.board({ declaration = decl })
            local item = start(h)
            steps.wait_for("the failed timeout and scheduled retry", function()
                return runs(h, item)[1].retry_at ~= nil
            end)
            local run = runs(h, item)[1]
            test.eq(run.outputs.error, "stage_timeout")
            local finished = assert(time.parse(time.RFC3339, run.finished_at))
            test.eq(run.retry_at, finished:utc():add(3600000000000):format("2006-01-02T15:04:05.000000000Z"))
            test.eq(facts(h, item, "kickside.work.events:stage.entered"), 1)
        end)

        test.it("honors the when predicate of a default automatic transition", function()
            local decl = declaration()
            decl.processes[1].transitions[5] = { id = "default", from = { "ready" }, to = "done", auto = true, default = true,
                when = { field = "points", op = "gte", value = 1 } }
            local h = fixture.board({ declaration = decl })
            local item = steps.create(h, "task", { points = 0 })
            test.eq(state(h, item), "ready")
            test.eq(steps.one(h, { op = "set", item = item, values = { points = 1 } }).status, "applied")
            test.eq(state(h, item), "done")
        end)

        test.it("replays a keyed report after exit and refuses a changed outcome", function()
            local h = fixture.board({ declaration = declaration() })
            local item = start(h)
            local input = { key = "stage-result", item = item, visit = 2, attempt = 1, outcome = "failed" }
            local first = assert(h.call("report", input))
            test.eq(first.outcomes[1].status, "applied")
            test.eq(state(h, item), "stopped")
            assert_replay(h, "report", input, first)
            input.outcome = "passed"
            local _, err = h.call("report", input)
            test.eq(assert(err):details().code, "idempotency_conflict")
            test.eq(facts(h, item, "kickside.work.events:stage.reported"), 1)
        end)

        test.it("replays keyed gate decisions after exit and refuses a changed decision", function()
            local h = gate_board(nil)
            for _, decision in ipairs({ "approve", "reject" }) do
                local item = start(h)
                local input = { key = "gate-" .. decision, item = item, visit = 2, decision = decision }
                local first = assert(h.call("approve", input))
                test.eq(first.outcomes[1].status, "applied")
                test.eq(state(h, item), decision == "approve" and "done" or "stopped")
                assert_replay(h, "approve", input, first)
                input.decision = decision == "approve" and "reject" or "approve"
                local _, err = h.call("approve", input)
                test.eq(assert(err):details().code, "idempotency_conflict")
                test.eq(facts(h, item, "kickside.work.events:approval.recorded"), 1)
            end
        end)

        test.it("replays an atomic report batch through its final transition sequence", function()
            local h = fixture.board({ declaration = declaration() })
            local first, second = start(h), start(h)
            local ops = {
                { op = "report", item = first, visit = 2, attempt = 1, outcome = "failed" },
                { op = "report", item = second, visit = 2, attempt = 1, outcome = "passed" },
            }
            local input = { key = "report-batch", mode = "atomic", ops = ops }
            local result = assert(h.call("apply", input))
            test.eq(state(h, first), "stopped")
            test.eq(state(h, second), "done")
            local events = steps.events(h)
            test.eq(events[#events].seq, result.seq)
            assert_replay(h, "apply", input, result)
            test.eq(facts(h, first, "kickside.work.events:stage.reported"), 1)
            test.eq(facts(h, second, "kickside.work.events:stage.reported"), 1)
        end)
    end)
end

return { run = test.run_cases(define) }
