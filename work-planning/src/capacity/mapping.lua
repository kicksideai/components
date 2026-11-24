-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work = require("work")
local types = require("types")
local M = {}

type Config = {
    issue_types: { string }?, epic_types: { string }?, epic_due_field: string?, points_field: string?,
}
type Workload = { assignee: string?, points: string?, original: string?, remaining: string?, sprint: string? }
type RoadmapType = { start: string, finish: string, progress_field: string?, membership: string? }

M.Config = Config
M.Workload = Workload
M.RoadmapType = RoadmapType

local function catalog(schema: work.Compiled): { [string]: work.Field }
    local fields: { [string]: work.Field } = {}
    for _, field in ipairs(schema.fields) do fields[field.code] = field end
    return fields
end

local function indexed_scalar(field: work.Field?, form: string): boolean
    return field ~= nil and field.form == form and field.cardinality == "one" and field.index ~= "none"
end

local function numeric(field: work.Field?): boolean
    return field ~= nil and field.cardinality == "one" and (field.form == "int" or field.form == "dec")
end

function M.workload(schema: work.Compiled, config: Config, estimates: types.EstimateFields?): Workload
    local fields = catalog(schema)
    local points = fields[config.points_field or "story_points"]
    local original = estimates and fields[estimates.original]
    local remaining = estimates and fields[estimates.remaining]
    local assignee = fields.assignee
    local sprint = fields.current_sprint
    return {
        assignee = assignee and assignee.type == "principal" and assignee.cardinality == "one" and assignee.code or nil,
        points = numeric(points) and points.index == "number" and points.code or nil,
        original = numeric(original) and original.code or nil,
        remaining = numeric(remaining) and remaining.code or nil,
        sprint = sprint and sprint.type == "item" and sprint.index == "key" and sprint.config.item_type == "sprint" and sprint.code or nil,
    }
end

function M.roadmap(schema: work.Compiled, config: Config): ({ [string]: RoadmapType }?, error?)
    local all_fields = catalog(schema)
    local epics: { [string]: boolean } = {}
    for _, id in ipairs(config.epic_types or {}) do epics[id] = true end
    local mapping: { [string]: RoadmapType } = table.create(0, 1)
    for _, kind in ipairs(schema.item_types) do
        local epic = epics[kind.id]
        if epic or kind.id == "milestone" then
            local fields: { [string]: work.Field } = {}
            local progress: string? = nil
            for _, code in ipairs(kind.fields) do
                local field = all_fields[code]
                fields[code] = field
                local rollup = field and field.rollup
                if epic and rollup and rollup.of == "children" and rollup.fn == "percent_done" and rollup.where == nil then
                    progress = progress or code
                end
            end
            local finish = epic and config.epic_due_field or "planning_end"
            if finish == "planning_start" or not indexed_scalar(fields.planning_start, "time") or not indexed_scalar(fields[finish], "time") then
                return nil, errors.new({ kind = errors.INVALID, message = "Review indexed start and end dates for " .. kind.id .. ".",
                    details = { code = "planning_roadmap_dates_invalid", item_type = kind.id, end_field = finish } })
            end
            mapping[kind.id] = { start = "planning_start", finish = finish,
                progress_field = progress, membership = kind.id == "milestone" and "milestone" or nil }
        end
    end
    return mapping, nil
end

return M
