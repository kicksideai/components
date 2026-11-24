-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local board = require("board")
local client = require("client")
local commands = require("commands")
local mapping = require("mapping")
local values = require("values")
local work = require("work")
local M = {}

type Membership = { item: string, expected_version: integer, sprint_id: string? }
type Plan = { board_id: string, sprint_id: string, key: string, changes: { Membership } }
type Move = { board_id: string, item: string, key: string, expected_version: integer, start: string, finish: string }
M.Plan = Plan
M.Move = Move

local function apply(board_id: string, key: string, source: string, ops: { commands.Op }, origin: work.JsonObject?): (commands.ApplyResult?, error?)
    local result, err = client.call("apply", { board_id = board_id, key = key, source = source, mode = "atomic", ops = ops, origin = origin })
    return result :: commands.ApplyResult?, err
end

function M.plan_sprint(request: Plan): (commands.ApplyResult?, error?)
    local ops: { commands.Op } = {}
    local seen: { [string]: boolean } = {}
    for _, change in ipairs(request.changes) do
        if seen[change.item] then
            return nil, board.problem(errors.INVALID, "planning_duplicate_item", "Plan each item once.")
        end
        seen[change.item] = true
        local op: commands.Op = { op = "set", item = change.item, expect_version = change.expected_version }
        if change.sprint_id then
            if change.sprint_id ~= request.sprint_id then
                return nil, board.problem(errors.INVALID, "planning_sprint_mismatch", "Each assignment must name the sprint being planned.")
            end
            op.values = { [board.SPRINT_FIELD] = { board = request.board_id, item = request.sprint_id } }
        else
            op.clear = { board.SPRINT_FIELD }
        end
        ops[#ops + 1] = op
    end
    local schema, _, err = board.active(request.board_id)
    if not schema then return nil, err end
    local sprint, read_err = board.sprint(request.board_id, request.sprint_id, schema.as_of)
    if not sprint then return nil, read_err end
    if sprint.item.state ~= "planned" and sprint.item.state ~= "active" then
        return nil, board.problem(errors.INVALID, "planning_sprint_ineligible", "Choose a planned or active sprint.")
    end
    return apply(request.board_id, request.key, "planning.plan_sprint", ops, { sprint_id = request.sprint_id })
end

function M.move_dates(request: Move): (commands.ApplyResult?, error?)
    local shape: work.ValueShape = { form = "time", cardinality = "one", config = {} }
    local start = values.normalize(shape, request.start)
    local finish = values.normalize(shape, request.finish)
    if type(start) ~= "string" or type(finish) ~= "string" then
        return nil, board.problem(errors.INVALID, "planning_invalid_date", "Choose valid start and end dates.")
    end
    if start > finish then
        return nil, board.problem(errors.INVALID, "planning_dates_out_of_order", "Start must be on or before end.")
    end
    local schema, plugin, err = board.active(request.board_id)
    if not schema or not plugin then return nil, err end
    local found, read_err = board.get(request.board_id, request.item)
    if not found then return nil, read_err end
    if found.as_of ~= schema.as_of then return nil, board.stale() end
    local item_type = found.item.type
    local first, last = "planning_start", "planning_end"
    if item_type ~= "sprint" then
        local mapped, map_err = mapping.roadmap(schema.compiled :: work.Compiled, (plugin.config or {}) :: mapping.Config)
        if not mapped then return nil, map_err end
        local period = mapped[item_type]
        if not period then
            return nil, board.problem(errors.INVALID, "planning_date_type", "Choose a sprint, milestone, or configured epic.")
        end
        first, last = period.start, period.finish
    end
    return apply(request.board_id, request.key, "planning.move_dates", {
        { op = "set", item = request.item, expect_version = request.expected_version, values = { [first] = start, [last] = finish } },
    })
end

return M
