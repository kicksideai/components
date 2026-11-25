-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local work = require("work")
local mapping = require("mapping")
local M = {}

function M.date_order(input: work.GuardRequest): work.GuardResult
    local start = input.item.values.planning_start :: string?
    local finish = input.item.values.planning_end :: string?
    if start and finish and start > finish then
        return { allow = false, findings = { { code = "planning_dates_out_of_order", message = "Start must be on or before end." } } }
    end
    return { allow = true, findings = {} }
end

function M.adopt_fields(input: { config: mapping.Config }): (types.SchemaResult?, error?)
    local extensions: { types.ItemTypeExtension } = {}
    local by_type: { [string]: types.ItemTypeExtension } = {}
    for _, id in ipairs(input.config.issue_types or {}) do
        local extension = { id = id, fields = { "current_sprint", "milestone" } }
        extensions[#extensions + 1], by_type[id] = extension, extension
    end
    for _, id in ipairs(input.config.epic_types or {}) do
        if id == "sprint" or id == "milestone" then
            return nil, errors.new({ kind = errors.INVALID, message = "Planning periods already have dates.",
                details = { code = "planning_invalid_epic_type", item_type = id } })
        end
        local extension = by_type[id]
        if not extension then
            extension = { id = id, fields = {} }
            extensions[#extensions + 1] = extension
        end
        extension.fields[#extension.fields + 1] = "planning_start"
        if not input.config.epic_due_field then extension.fields[#extension.fields + 1] = "planning_end" end
    end
    return { fragment = { item_types = extensions } }, nil
end

return M
