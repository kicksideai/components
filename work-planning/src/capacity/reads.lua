-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local board_client = require("board_client")
local work = require("work")
local work_reads = require("work_reads")
local query = require("query")
local budget = require("budget")
local storage = require("storage")
local mapping = require("mapping")
local types = require("types")
local contract = require("contract")
local M = {}

local PLUGIN = "kickside.work.planning:plugin"
local TIME_PLUGIN = "kickside.work.time:plugin"
local TIME_FIELDS = "kickside.work.time:estimate_fields"
local OPEN = { "triage", "backlog", "unstarted", "started" }

type Request = { board_id: string, sprint_id: string?, budget: work_reads.ReadBudget? }
type Bucket = { load: number, missing_estimates: integer, items: integer }
type Person = Bucket & { person: string, capacity: number? }
type Report = {
    unit: storage.Unit?, version: integer?, rows: { Person },
    total: Bucket & { capacity: number? }, unassigned: Bucket,
    estimates_available: boolean, caller_visible: boolean, incomplete: boolean, as_of: integer,
}
type Board = { schema: work_reads.SchemaView, plugin: work.PluginView }

M.Request = Request
M.Report = Report

local function problem(kind: string, code: string, message: string): error
    return errors.new({ kind = kind, message = message, details = { code = code } })
end

local function stale(): error
    return problem(errors.CONFLICT, "planning_snapshot_stale", "The board changed during the Planning read.")
end

local function active_board(id: string): (Board?, error?)
    local raw, err = board_client.call("get_schema", { board_id = id })
    if err or not raw then return nil, err end
    local schema = raw :: work_reads.SchemaView
    for _, plugin in ipairs(schema.plugins or {}) do
        if plugin.plugin == PLUGIN and plugin.active and plugin.attachment_id then
            return { schema = schema, plugin = plugin }, nil
        end
    end
    return nil, problem(errors.NOT_FOUND, "plugin_inactive", "Work Planning is inactive on this board.")
end

local function estimates(board_id: string, schema: work_reads.SchemaView): (types.EstimateFields?, error?)
    local active = false
    for _, plugin in ipairs(schema.plugins or {}) do
        if plugin.plugin == TIME_PLUGIN and plugin.active then active = true end
    end
    if not active then return nil, nil end
    local definition, err = contract.get(TIME_FIELDS, types.EstimateFieldsClient)
    if errors.is(err, errors.NOT_FOUND) then return nil, nil end
    if not definition then return nil, err end
    local client, open_err = definition:open()
    if not client then return nil, open_err end
    return client:fields({ board_id = board_id })
end

local function bucket(): Bucket
    return { load = 0, missing_estimates = 0, items = 0 }
end

local function add(target: Bucket, amount: number?)
    target.items = target.items + 1
    if amount ~= nil then
        target.load = target.load + amount
    else
        target.missing_estimates = target.missing_estimates + 1
    end
end

local function assignee(value: unknown): string?
    if type(value) ~= "table" then return nil end
    local principal = value :: work.PrincipalDecl
    return principal.kind == "user" and principal.id or nil
end

local function person(people: { [string]: Person }, id: string): Person
    local held = people[id]
    if held then return held end
    local row: Person = { person = id, load = 0, missing_estimates = 0, items = 0 }
    people[id] = row
    return row
end

local function amount(item: work_reads.ItemView, original: string?, remaining: string?): number?
    local values = item.values
    -- Work distinguishes suppressed fields from absent and cleared values.
    -- A suppressed remaining estimate must not be interpreted as unset.
    if remaining and item.value_states[remaining] == nil then return nil end
    return tonumber(remaining and values[remaining]) or tonumber(original and values[original])
end

local function eligible_types(schema: work.Compiled, sprint: string?): { string }
    local ids: { string } = {}
    if not sprint then return ids end
    for _, item_type in ipairs(schema.item_types) do
        for _, field in ipairs(item_type.fields) do
            if field == sprint then ids[#ids + 1] = item_type.id; break end
        end
    end
    return ids
end

local function selection(board: work.Compiled, request: Request, workload: boolean, fields: mapping.Workload): (work.Where?, string?)
    local category: work.Where = { field = "category", op = workload and "in" or "neq",
        value = workload and OPEN or "canceled" }
    if request.sprint_id and fields.sprint then
        return { ["and"] = { category, {
            field = fields.sprint, op = "eq", value = { board = request.board_id, item = request.sprint_id },
        } } }, fields.sprint
    end
    local ids = eligible_types(board, fields.sprint)
    if #ids == 0 or request.sprint_id then return nil, nil end
    return { ["and"] = { category, { field = "type", op = "in", value = ids } } }, "type"
end

local function read(request: Request, workload: boolean): (Report?, error?)
    local board, err = active_board(request.board_id)
    if not board then return nil, err end
    local schema = board.schema
    local held: storage.Capacity = { rows = {} }
    if request.sprint_id then
        local raw, read_err = board_client.call("get", { board_id = request.board_id, item = { id = request.sprint_id } })
        if read_err or not raw then return nil, read_err end
        local sprint = raw :: work_reads.GetResult
        if sprint.item.type ~= "sprint" or sprint.item.life ~= "live" then
            return nil, problem(errors.NOT_FOUND, "planning_sprint_unavailable", "Sprint not found on this board.")
        end
        if sprint.snapshot_seq ~= schema.snapshot_seq then return nil, stale() end
        local capacity, storage_err = storage.read(request.board_id, board.plugin.attachment_id :: string,
            request.sprint_id, schema.snapshot_seq)
        if not capacity then return nil, storage_err end
        held = capacity
    elseif not workload then
        return nil, problem(errors.INVALID, "planning_sprint_required", "Choose a sprint.")
    end

    local unit = held.unit
    if not request.sprint_id then unit = "minutes" end
    local time_fields: types.EstimateFields? = nil
    if unit == "minutes" then
        local found, field_err = estimates(request.board_id, schema)
        if field_err then return nil, field_err end
        time_fields = found
    end
    local compiled = schema.compiled :: work.Compiled
    local fields = mapping.workload(compiled, board.plugin.config :: mapping.Config or {}, time_fields)
    local original = unit == "points" and fields.points or fields.original
    local remaining = workload and fields.remaining or nil
    local result: Report = {
        unit = unit, version = held.version, rows = table.create(1, 0), total = bucket(), unassigned = bucket(),
        estimates_available = original ~= nil, caller_visible = true, incomplete = false, as_of = schema.as_of :: integer,
    }
    local people: { [string]: Person } = {}
    local total_capacity: number? = nil
    for _, row in ipairs(held.rows) do
        person(people, row.person).capacity = row.amount
        total_capacity = (total_capacity or 0) + row.amount
    end
    result.total.capacity = total_capacity

    local where, order = selection(compiled, request, workload, fields)
    if where and unit then
        local allowance, budget_err = budget.start(request.budget)
        if not allowance then return nil, budget_err end
        local context: work_reads.ReadContext = { admitted = {}, holders = {}, allowance = allowance }
        local args: work_reads.QueryRequest = { board_id = request.board_id, where = where,
            order = { field = order :: string }, limit = 200, min_seq = schema.as_of }
        repeat
            local page, page_err = query.page(args, context)
            if not page then return nil, page_err end
            if page.snapshot_seq ~= schema.snapshot_seq then return nil, stale() end
            for _, item in ipairs(page.items) do
                local id = fields.assignee and assignee(item.values[fields.assignee]) or nil
                local target = id and person(people, id) or result.unassigned
                local estimate = amount(item, original, remaining)
                add(target, estimate)
                add(result.total, estimate)
            end
            args.after = page.after
            result.incomplete = page.incomplete == true or page.reindexing or (args.after ~= nil and budget.expired(allowance))
        until not args.after or result.incomplete
    end
    for _, row in pairs(people) do result.rows[#result.rows + 1] = row end
    table.sort(result.rows, function(a: Person, b: Person): boolean return a.person < b.person end)
    return result, nil
end

function M.check_capacity(request: Request): (Report?, error?)
    return read(request, false)
end

function M.workload(request: Request): (Report?, error?)
    return read(request, true)
end

function M.roadmap(board_id: string): ({ [string]: mapping.RoadmapType }?, error?)
    local board, err = active_board(board_id)
    if not board then return nil, err end
    return mapping.roadmap(board.schema.compiled :: work.Compiled, board.plugin.config :: mapping.Config or {})
end

return M
