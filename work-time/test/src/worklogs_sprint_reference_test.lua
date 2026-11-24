-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local funcs = require("funcs")
local sql = require("sql")
local time = require("time")
local board_client = require("board_client")
local scoped = require("scoped")
local uuid = require("uuid")
local steps = require("steps")
local test = require("test")

local M = {}
local TIME = "kickside.work.time:plugin"
local PLANNING = "kickside.work.planning:plugin"

-- Planning's optional resolver makes an authenticated Work read on a separate
-- call frame, the same connection boundary used by the installed capability.
function M.resolve(request)
    local result, err = board_client.call("get", { board_id = request.board_id, item = { id = request.item } })
    if err then return nil, err end
    local membership = result.item.values.current_sprint
    return { sprint_id = request.sprint_id or (membership and membership.item) }
end

function M.report(request)
    local result, err = board_client.call("query", {
        board_id = request.board_id, limit = 50,
        where = { field = "current_sprint", op = "eq", value = { board = request.board_id, item = request.sprint_id } },
    })
    if err then return nil, err end
    local items = {}
    for _, item in ipairs(result.items) do items[#items + 1] = item.id end
    return { items = items, as_of = result.as_of, coverage = result.after and "limited" or "complete" }
end

local function invoke(session, action, request)
    local exec = funcs.new():with_actor(session.actor):with_scope(session.scope)
    local future = assert(exec:async("kickside.work.time.worklogs:" .. action, request))
    local timeout = time.after("5s")
    local response = future:response()
    local done = channel.select({ response:case_receive(), timeout:case_receive() })
    if done.channel == timeout then future:cancel() end
    test.eq(done.channel, response, "Planning's Work read must finish while the Time mutation is in flight")
    local result, err = future:result()
    assert(result and not err, steps.detail(err))
    return assert(result:data())
end

local function setup(entry_visibility)
    local admin = scoped.admin()
    local result, create_err = admin.call("create", {
        idempotency_key = uuid.v4(), pack = "kickside.work.planning:pack",
    })
    assert(result and not create_err, steps.detail(create_err))
    local board = {
        id = result.board_id,
        call = function(method, request) return admin.call(method, request, result.board_id) end,
    }
    local reply = admin.http("POST", "/" .. board.id .. "/apply_schema", {
        declaration = { plugins = { { use = TIME }, { use = PLANNING } } },
        plugin_configs = { [TIME] = { item_types = { "issue" }, entry_visibility = entry_visibility } },
    })
    test.eq(reply.status, 200, reply.raw)
    steps.wait_for("Time attachment ready", function()
        local plugin = steps.call(board, "plugin_context", { plugin = TIME })
        return plugin.lifecycle.state == "ready"
    end)
    local now = time.now():utc()
    local sprint = steps.create(board, "sprint", { name = "Current",
        planning_start = now:add(-48 * time.HOUR):format("2006-01-02"),
        planning_end = now:add(48 * time.HOUR):format("2006-01-02"),
    })
    test.eq(steps.one(board, { op = "transition", item = sprint, transition = "start" }).status, "applied")
    return admin, board, sprint, now
end

M.run = test.run_cases(function()
    test.describe("Worklog sprint attribution", function()
        test.it("resolves the caller's Work item before a create or date edit holds SQLite's writer", function()
            local admin, board, sprint, now = setup("all")
            local item = steps.create(board, "issue", { current_sprint = { board = board.id, item = sprint } })
            local created = invoke(admin, "create", { board_id = board.id, item = item, key = "combined",
                minutes = 1, work_date = now:format("2006-01-02") })
            invoke(admin, "edit", { board_id = board.id, id = created.id, expected_version = 1,
                work_date = now:add(-24 * time.HOUR):format("2006-01-02") })
            local db = assert(sql.get("app:db"))
            local rows, err = db:query("SELECT sprint_id, version FROM kickside_work_time_worklog WHERE board_id = $1", { board.id })
            db:release()
            assert(rows and not err, steps.detail(err))
            test.eq(rows[1].sprint_id, sprint)
            test.eq(tonumber(rows[1].version), 2)
        end)

        test.it("returns personal sprint actuals under self-only entry visibility", function()
            local admin, board, sprint, now = setup("self")
            local member = scoped.member()
            assert(board.call("grant", { subject_id = member.id, mask = 3 }))
            local item = steps.create(board, "issue", { current_sprint = { board = board.id, item = sprint },
                time_original_minutes = 60 })
            local day = now:format("2006-01-02")
            invoke(admin, "create", { board_id = board.id, item = item, key = "other", minutes = 20, work_date = day })
            invoke(member, "create", { board_id = board.id, item = item, key = "self", minutes = 15, work_date = day })
            local route = "/" .. board.id .. "/time/"
            local response = member.http("POST", route .. "totals", { group_by = "sprint", sprint = sprint, from = day, to = day })
            test.eq(response.status, 200, response.raw)
            local group = response.body.data.groups[1]
            test.eq(group.person, member.id)
            test.eq(group.sprint, sprint)
            test.eq(group.minutes, 15)
            test.eq(group.entry_count, 1)
            test.is_nil(group.original_minutes)
            test.is_nil(group.points)
            local csv = member.http("GET", route .. "export.csv?group_by=sprint&sprint=" .. sprint .. "&from=" .. day .. "&to=" .. day)
            test.eq(csv.status, 200, csv.raw)
            test.not_nil(csv.raw:find('"1","15"', 1, true))
        end)

        test.it("compares sprint actuals with current estimates after rollover", function()
            local admin, board, sprint, now = setup("all")
            local day = now:format("2006-01-02")
            local assigned = { board = board.id, item = sprint }
            local moved = steps.create(board, "issue", { current_sprint = assigned, time_original_minutes = 60 })
            steps.create(board, "issue", { current_sprint = assigned, time_original_minutes = 20 })
            invoke(admin, "create", { board_id = board.id, item = moved, key = "rolled", minutes = 30, work_date = day })
            local request = { group_by = "sprint", sprint = sprint, from = day, to = day }
            local route = "/" .. board.id .. "/time/totals"
            local before = admin.http("POST", route, request)
            test.eq(before.status, 200, before.raw)
            test.eq(before.body.data.groups[1].original_minutes, 80)
            test.eq(before.body.data.groups[1].minutes, 30)

            local next_sprint = steps.create(board, "sprint", { name = "Next" })
            local preview = admin.http("POST", "/api/work/sprints/plan_close", {
                board_id = board.id, sprint_id = sprint, rollover_id = next_sprint,
            })
            test.eq(preview.status, 200, preview.raw)
            local plan = preview.body.data
            local closed = admin.http("POST", "/api/work/sprints/close", {
                key = "time-report-rollover", snapshot = plan.snapshot, token = plan.token,
            })
            test.eq(closed.status, 200, closed.raw)
            test.eq(steps.one(board, { op = "set", item = moved, values = { time_original_minutes = 45 } }).status, "applied")
            local after = admin.http("POST", route, request)
            test.eq(after.status, 200, after.raw)
            local group = after.body.data.groups[1]
            test.eq(group.original_minutes, 45)
            test.eq(group.minutes, 30)
            test.eq(group.entry_count, 1)
        end)
    end)
end)

return M
