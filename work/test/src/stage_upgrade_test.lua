-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local funcs = require("funcs")
local json = require("json")

type Map = { [string]: unknown }
local AT = "2020-01-01T00:00:00.000000000Z"
local function declaration(): Map
    return { key_prefix = fixture.fresh_prefix(), fields = { { code = "title", form = "text" } },
        item_types = { { id = "task", process = "flow", fields = { "title" } } },
        processes = { { id = "flow", initial = "build", migration = "follow", states = {
            { id = "build", category = "started", kind = "automated", run = { stage = "build", retry = { max = 2, backoff = "PT1S" }, on_fail = "stop" } },
            { id = "done", category = "completed" }, { id = "canceled", category = "canceled" },
        }, transitions = {
            { id = "passed", from = { "build" }, to = "done" },
            { id = "stop", from = "any", to = "canceled" },
            { id = "restart", from = { "done" }, to = "build" },
        } } } }
end
local function exec(db, statement: string, params: { unknown })
    local _, err = db:execute(statement, params)
    assert(not err, steps.detail(err))
end
local function old_rows(h: fixture.Handle, id: string, waiting: boolean?)
    local db = assert(store.open())
    local board = assert(store.board(db, h.id))
    board.compiled.policy.stage_timeout, board.compiled.policy.stage_max_visits = nil, nil
    exec(db, "UPDATE kickside_work_board SET compiled = $1 WHERE board_id = $2", { json.encode(board.compiled), h.id })
    exec(db, "UPDATE kickside_work_generation SET compiled = $1 WHERE board_id = $2", { json.encode(board.compiled), h.id })
    local item = assert(store.item(db, h.id, id))
    local work = item.work
    work.stage_visit, work.stage_visits, work.timer_due = nil, nil, nil
    work.entered_at, work.waiting = AT, waiting
    for _, data in pairs(work.region_data or {}) do
        data.stage_visit, data.timer_due, data.entered_at = nil, nil, AT
    end
    exec(db, "UPDATE kickside_work_item SET process_data = $1 WHERE board_id = $2 AND item_id = $3", { json.encode(work), h.id, id })
    exec(db, "UPDATE kickside_work_stage_run SET started = $1 WHERE board_id = $2 AND item_id = $3", { AT, h.id, id })
    if waiting then
        exec(db, "UPDATE kickside_work_stage_run SET finished = $1, outcome = 'failed' WHERE board_id = $2 AND item_id = $3", { AT, h.id, id })
    end
    db:release()
end
local function upgraded(h: fixture.Handle, id: string)
    local db = assert(store.open())
    local item, err = store.item(db, h.id, id)
    db:release()
    assert(item, steps.detail(err))
    test.eq(item.work.stage_visit, 1)
    return item
end
local function fire(h: fixture.Handle, id: string, timer: string, attempt: integer, visit: integer?)
    local out, err = funcs.new():with_actor(h.actor):call("kickside.work.jobs:process_batch", { board_id = h.id, item = id, state = "build", visit = visit or 1, timer = timer, attempt = attempt })
    assert(out, steps.detail(err))
end
local function define()
    test.describe("running board stage safety upgrade", function()
        test.it("folds an old in-flight report without resetting the board", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            old_rows(h, id)
            local out, rerr = h.call("report", { item = id, visit = 1, attempt = 1, outcome = "passed" })
            assert(out, steps.detail(rerr))
            test.eq(assert(steps.get(h, id)).item.state, "done")
        end)
        test.it("resumes a retry recorded before the upgrade and arms its engine timeout", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            old_rows(h, id, true)
            upgraded(h, id)
            fire(h, id, "$retry:2", 2)
            local runs = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs
            test.eq(runs[1].attempt, 2); test.is_nil(runs[1].outcome)
            local db = assert(store.open())
            local item = assert(store.item(db, h.id, id)); db:release()
            test.not_nil(item.work.timer_due["$stage:2"])
        end)
        test.it("fires an old attempt timeout and preserves retry semantics", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            old_rows(h, id)
            upgraded(h, id)
            fire(h, id, "$stage:1", 1)
            local run = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1]
            test.eq(run.outcome, "failed"); test.eq(run.outputs.error, "stage_timeout")
            test.eq(assert(steps.get(h, id)).item.state, "build")
        end)
        test.it("lets a human leave an old attempt and records cancellation", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            old_rows(h, id)
            upgraded(h, id)
            test.eq(steps.one(h, { op = "transition", item = id, transition = "stop" }).status, "applied")
            test.eq(assert(steps.get(h, id)).item.state, "canceled")
            local run = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1]
            test.eq(run.outcome, "canceled"); test.eq(run.outputs.reason, "transition")
        end)
        test.it("migrates an old running stage and retains its spent visit", function()
            local d = declaration()
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            old_rows(h, id)
            upgraded(h, id)
            local p = d.processes[1]
            p.states[1].id = "rebuild"; p.initial = "rebuild"; p.map = { build = "rebuild" }
            p.transitions[1].from = { "rebuild" }; p.transitions[3].to = "rebuild"
            assert(h.call("apply_schema", { declaration = d }))
            steps.wait_for("old running stage migration", function()
                return assert(steps.get(h, id)).item.process_generation == 2
            end)
            local db = assert(store.open())
            local item = assert(store.item(db, h.id, id)); db:release()
            test.eq(item.state, "rebuild"); test.eq(item.work.stage_visits.build, 1)
            test.eq(item.work.stage_visits.rebuild, 1)
        end)
        test.it("derives spent visits from distinct historical visits rather than retry attempts", function()
            local d = declaration(); d.processes[1].states[1].run.max_visits = 2
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            assert(h.call("report", { item = id, visit = 1, attempt = 1, outcome = "passed" }))
            steps.one(h, { op = "transition", item = id, transition = "restart" })
            old_rows(h, id)
            local db = assert(store.open())
            exec(db, [[INSERT INTO kickside_work_stage_run (board_id,item_id,visit,attempt,state,started,finished,outcome)
                VALUES ($1,$2,1,2,'build',$3,$3,'passed')]], { h.id, id, AT })
            local item = assert(store.item(db, h.id, id)); db:release()
            test.eq(item.work.stage_visit, 2); test.eq(item.work.stage_visits.build, 2)
            assert(h.call("report", { item = id, visit = 3, attempt = 1, outcome = "passed" }))
            test.eq(assert(steps.get(h, id)).item.state, "done")
            steps.one(h, { op = "transition", item = id, transition = "restart" })
            local run = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1]
            test.eq(run.outcome, "failed"); test.eq(run.outputs.error, "stage_visits_exhausted")
        end)
        test.it("exposes engine safety defaults when reading an old compiled generation", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            old_rows(h, id)
            local generation = assert(h.call("get_schema", { generation = 1 }))
            test.eq(generation.compiled.policy.stage_timeout, "PT1H")
            test.eq(generation.compiled.policy.stage_max_visits, 5)
        end)
        test.it("starts at the current visit when no stage history remains", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "task")
            old_rows(h, id)
            local db = assert(store.open())
            exec(db, "DELETE FROM kickside_work_stage_run WHERE board_id = $1 AND item_id = $2", { h.id, id })
            local item = assert(store.item(db, h.id, id)); db:release()
            test.eq(item.work.stage_visit, 1); test.eq(item.work.stage_visits.build, 1)
            test.eq(item.work.timer_due["$stage:1"], "2020-01-01T01:00:00.000000000Z")
            fire(h, id, "$stage:1", 1)
            local run = assert(h.call("list_stage_runs", { item = { id = id } })).stage_runs[1]
            test.eq(run.outcome, "failed"); test.eq(run.outputs.error, "stage_timeout")
        end)
        test.it("normalizes both active regions and their shared visit budget", function()
            local d = declaration(); local p = d.processes[1]
            p.initial = "lanes"
            p.states[4] = { id = "lanes", category = "started", kind = "parallel", regions = { { id = "qa", initial = "build" }, { id = "security", initial = "build" } }, join = "all" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            old_rows(h, id)
            local db = assert(store.open())
            local item = assert(store.item(db, h.id, id)); db:release()
            test.eq(item.work.stage_visits.build, 2)
            test.eq(item.work.region_data.qa.stage_visit, 1)
            test.eq(item.work.region_data.security.stage_visit, 2)
            test.not_nil(item.work.region_data.qa.timer_due["$stage:1"])
            test.eq(steps.one(h, { op = "transition", item = id, region = "qa", transition = "stop" }).status, "applied")
        end)
    end)
end
return { run = test.run_cases(define) }
