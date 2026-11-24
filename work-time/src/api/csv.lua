-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local M = {}

local GROUP = { "board_id", "sprint", "person", "person_name", "week", "entry_count", "minutes", "original_minutes", "points" }
local ITEM = { "direct_minutes", "subtree_minutes", "entry_count", "original_minutes", "remaining_minutes", "over_estimate", "coverage" }

local function cell(value: unknown): string
    local text = value == nil and "" or tostring(value)
    if type(value) == "string" and (text:match("^[%s%c]*[=+@%-]") or text:match("^[\t\r\n]")) then
        text = "'" .. text
    end
    return '"' .. text:gsub('"', '""') .. '"'
end

function M.render(report: types.Report): string
    local columns = report.groups and GROUP or ITEM
    local rows = report.groups or { report }
    local output: { string } = {}
    for _, column in ipairs(columns) do output[#output + 1] = cell(column) end
    local lines = { table.concat(output, ",") }
    for _, row in ipairs(rows) do
        local data = row :: { [string]: unknown }
        for index, column in ipairs(columns) do output[index] = cell(data[column]) end
        lines[#lines + 1] = table.concat(output, ",")
    end
    return table.concat(lines, "\r\n") .. "\r\n"
end

return M
