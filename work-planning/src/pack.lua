-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}

function M.date_order(input: { item: { values: { planning_start: string?, planning_end: string? } } }): unknown
    local start, finish = input.item.values.planning_start, input.item.values.planning_end
    if start and finish and start > finish then
        return { allow = false, findings = { { code = "planning_dates_out_of_order", message = "Start must be on or before end." } } }
    end
    return { allow = true, findings = {} }
end

function M.adopt_fields(input: { config: { issue_types: { string }? } }): (unknown, error?)
    local extensions: { { id: string, fields: { string } } } = {}
    for _, id in ipairs(input.config.issue_types or {}) do
        if id == "issue" or id == "sprint" or id == "milestone" then
            return nil, errors.new({ kind = errors.INVALID, message = "Adoption requires a custom issue type.", details = { code = "planning_invalid_issue_type" } })
        end
        extensions[#extensions + 1] = { id = id, fields = { "current_sprint", "milestone" } }
    end
    return { fragment = { item_types = extensions } }, nil
end

-- Planning stores everything in the board, so attachment teardown has no plugin data to remove.
function M.delete(): { success: boolean }
    return { success = true }
end

return M
