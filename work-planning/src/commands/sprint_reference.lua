-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local board = require("board")
local budget = require("budget")
local mapping = require("mapping")
local query = require("query")
local reads = require("reads")
local storage = require("storage")
local values = require("values")
local work = require("work")
local M = {}

type Resolve = { board_id: string, item: string, work_date: string, sprint_id: string? }
type Report = { board_id: string, sprint_id: string, limit: integer }
type Result = { items: { string }, as_of: integer, coverage: string, unit: storage.Unit, points_field: string? }
M.Resolve = Resolve
M.Report = Report
M.Result = Result

local function candidate(request: Resolve, id: string, at: integer?): (string?, error?)
    local found, err = board.sprint(request.board_id, id, at)
    if errors.is(err, errors.NOT_FOUND) then return nil, nil end
    if err or not found then return nil, err end
    local first, last = found.item.values.planning_start, found.item.values.planning_end
    -- Work times can also be UTC instants. Time attribution is by UTC calendar day.
    if type(first) == "string" and type(last) == "string"
        and first:sub(1, 10) <= request.work_date and request.work_date <= last:sub(1, 10) then
        return id, nil
    end
    return nil, nil
end

function M.resolve(request: Resolve): ({ sprint_id: string? }?, error?)
    local shape: work.ValueShape = { form = "time", cardinality = "one", config = {} }
    if not values.normalize(shape, request.work_date) then
        return nil, board.problem(errors.INVALID, "planning_invalid_date", "Work date must be an ISO calendar date.")
    end
    local schema, _, err = board.active(request.board_id)
    if not schema then return nil, err end
    local item, read_err = board.get(request.board_id, request.item)
    if not item then return nil, read_err end
    if item.item.life ~= "live" then
        return nil, board.problem(errors.NOT_FOUND, "planning_item_unavailable", "Item not found on this board.")
    end
    if item.as_of ~= schema.as_of then return nil, board.stale() end
    if request.sprint_id then
        local id, sprint_err = candidate(request, request.sprint_id, item.as_of)
        if sprint_err then return nil, sprint_err end
        if id then return { sprint_id = id }, nil end
    end
    local result: { sprint_id: string? } = table.create(0, 1)
    local membership = item.item.values[board.SPRINT_FIELD] :: work.Target?
    if membership and membership.board == request.board_id and membership.item ~= request.sprint_id then
        local id, sprint_err = candidate(request, membership.item, item.as_of)
        if sprint_err then return nil, sprint_err end
        result.sprint_id = id
    end
    return result, nil
end

function M.report(request: Report): (Result?, error?)
    local schema, plugin, err = board.active(request.board_id)
    if not schema or not plugin then return nil, err end
    local sprint, read_err = board.sprint(request.board_id, request.sprint_id, schema.as_of)
    if not sprint then return nil, read_err end
    local at = sprint.as_of :: integer
    local capacity, capacity_err = storage.read(request.board_id, plugin.attachment_id :: string, request.sprint_id, at)
    if not capacity then return nil, capacity_err end
    local fields = mapping.workload(schema.compiled :: work.Compiled, (plugin.config or {}) :: mapping.Config)
    local result: Result = { items = {}, as_of = at, coverage = "complete", unit = capacity.unit or "minutes",
        points_field = capacity.unit == "points" and fields.points or nil }
    if not fields.sprint then return result, nil end

    local allowance, budget_err = budget.start()
    if not allowance then return nil, budget_err end
    local context: reads.ReadContext = { admitted = {}, holders = {}, allowance = allowance }
    local args: reads.QueryRequest = {
        board_id = request.board_id, min_seq = at,
        where = { field = fields.sprint, op = "eq", value = { board = request.board_id, item = request.sprint_id } },
        order = { field = fields.sprint },
    }
    repeat
        args.limit = math.min(200, request.limit - #result.items)
        local page, page_err = query.page(args, context)
        if not page then return nil, page_err end
        if page.as_of ~= at then return nil, board.stale() end
        for _, item in ipairs(page.items) do result.items[#result.items + 1] = item.id end
        args.after = page.after
        if page.incomplete or page.reindexing or (args.after and #result.items >= request.limit) then
            result.coverage = "limited"
        end
    until not args.after or result.coverage == "limited"
    return result, nil
end

return M
