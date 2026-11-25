-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")

local TIME = "kickside.work.time:plugin"
local PLANNING = "kickside.work.planning:plugin"

local function ok(reply)
    test.eq(reply.status, 200, reply.raw)
    return reply.body.data
end

local function planning(actor, action, input)
    return actor.http("POST", "/api/work/planning/" .. action, input)
end

local function setup(admin, with_time)
    local board = scoped.board(admin, { key_prefix = fixture.fresh_prefix() }, "kickside.work.planning:pack")
    local declaration = {
        fields = {
            { code = "assignee", type = "principal", index = "key" },
            { code = "story_points", form = "dec", index = "number", config = { scale = 1 } },
        },
        item_types = { { id = "issue", process = "planning_issue",
            fields = { "title", "current_sprint", "milestone", "assignee", "story_points" } } },
    }
    local config = {}
    if with_time then
        declaration.plugins = { { use = PLANNING }, { use = TIME } }
        config[TIME] = { item_types = { "issue" } }
    end
    steps.call(board, "apply_schema", { declaration = declaration, plugin_configs = config })
    for _, plugin in ipairs(with_time and { PLANNING, TIME } or { PLANNING }) do
        steps.wait_for(plugin .. " ready", function()
            return steps.call(board, "plugin_context", { plugin = plugin }).lifecycle.state == "ready"
        end)
    end
    return board
end

local function day(now, offset)
    return now:add(offset * 24 * time.HOUR):format("2006-01-02")
end

local run = test.run_cases(function()
    test.describe("installed Time and Planning capabilities", function()
        test.it("loads point capacity on a Planning-only board", function()
            local admin = scoped.admin()
            local board = setup(admin, false)
            local sprint = steps.create(board, "sprint", { name = "Points" })
            steps.create(board, "issue", { title = "Issue", story_points = "5.5",
                current_sprint = { board = board.id, item = sprint } })
            ok(planning(admin, "set_capacity", { board_id = board.id, sprint_id = sprint,
                expected_version = 0, unit = "points", rows = { { person = admin.id, amount = 8 } } }))
            local report = ok(planning(admin, "check_capacity", { board_id = board.id, sprint_id = sprint }))
            test.eq(report.unit, "points")
            test.eq(report.total.load, 5.5)
            test.eq(report.total.capacity, 8)
            test.eq(report.incomplete, false)
        end)

        test.it("uses Time estimates in Planning and keeps sprint actuals after rollover", function()
            local admin = scoped.admin()
            local board = setup(admin, true)
            local now = time.now():utc()
            local today = day(now, 0)
            local sprint = steps.create(board, "sprint", { name = "Current",
                planning_start = day(now, -2), planning_end = day(now, 2) })
            local next_sprint = steps.create(board, "sprint", { name = "Next",
                planning_start = day(now, 3), planning_end = day(now, 7) })
            test.eq(steps.one(board, { op = "transition", item = sprint, transition = "start" }).status, "applied")
            local issue = steps.create(board, "issue", { title = "Issue",
                current_sprint = { board = board.id, item = sprint },
                time_original_minutes = 90, time_remaining_minutes = 60 })
            ok(planning(admin, "set_capacity", { board_id = board.id, sprint_id = sprint,
                expected_version = 0, unit = "minutes", rows = { { person = admin.id, amount = 120 } } }))
            local capacity = ok(planning(admin, "check_capacity", { board_id = board.id, sprint_id = sprint }))
            test.eq(capacity.total.load, 90)
            test.eq(capacity.total.capacity, 120)
            local member = scoped.member()
            steps.call(board, "grant", { subject_id = member.id, mask = 1 })
            test.eq(ok(planning(member, "workload", { board_id = board.id, sprint_id = sprint })).total.load, 60)

            local route = "/" .. board.id .. "/time/"
            local logged = ok(admin.http("POST", route .. "worklogs", { item = issue, minutes = 30,
                key = "combined", work_date = today }))
            local preview = ok(admin.http("POST", "/api/work/sprints/plan_close", {
                board_id = board.id, sprint_id = sprint, rollover_id = next_sprint }))
            test.eq(ok(admin.http("POST", "/api/work/sprints/close", { snapshot = preview.snapshot,
                token = preview.token, key = "combined-close" })).applied, true)
            ok(admin.http("PATCH", route .. "worklogs/" .. logged.id, {
                expected_version = logged.version, work_date = day(now, -1) }))
            local summary = ok(admin.http("POST", route .. "totals", { group_by = "sprint", sprint = sprint,
                from = day(now, -1), to = today })).groups[1]
            test.eq(summary.minutes, 30)
            test.eq(summary.entry_count, 1)
            test.eq(summary.original_minutes, 90)
        end)
    end)
end)

local run_failure = test.run_cases(function()
    test.describe("Planning's Time estimate capability", function()
        test.it("propagates the conflict returned by the active Time estimate binding", function()
            local admin = scoped.admin()
            local board = setup(admin, true)
            local sprint = steps.create(board, "sprint", { name = "Minutes" })
            local request = { board_id = board.id, sprint_id = sprint }
            ok(planning(admin, "set_capacity", {
                board_id = board.id, sprint_id = sprint, expected_version = 0, unit = "minutes",
                rows = { { person = admin.id, amount = 120 } },
            }))
            local reply = planning(admin, "workload", request)
            test.eq(reply.status, 409, reply.raw)
            test.eq(reply.body.details.code, "estimate_fields_test_conflict", reply.raw)
        end)
    end)
end)

local run_malformed = test.run_cases(function()
    test.describe("Planning's Time estimate capability", function()
        test.it("refuses estimate fields that do not match the declared contract", function()
            local admin = scoped.admin()
            local board = setup(admin, true)
            local sprint = steps.create(board, "sprint", { name = "Minutes" })
            local request = { board_id = board.id, sprint_id = sprint }
            ok(planning(admin, "set_capacity", {
                board_id = board.id, sprint_id = sprint, expected_version = 0, unit = "minutes",
                rows = { { person = admin.id, amount = 120 } },
            }))
            local reply = planning(admin, "workload", request)
            test.eq(reply.status, 500, reply.raw)
            test.eq(reply.body.details.code, "time_estimates_invalid", reply.raw)
        end)
    end)
end)

return { run = run, run_failure = run_failure, run_malformed = run_malformed }
