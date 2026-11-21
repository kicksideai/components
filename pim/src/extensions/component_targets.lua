-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local types = require("types")

type Request = { ids: { string } }
local M = {}

function M.resolve(request: Request): ({ ids: { string } }?, error?)
    local ids: { string } = {}
    if #request.ids == 0 then return { ids = ids }, nil end
    local rows, err = component.query({ component_ids = request.ids, access_mask = component.ACCESS.READ })
    if err or not rows then return nil, err end
    for _, row in ipairs(rows) do ids[#ids + 1] = row.component_id end
    return { ids = ids }, nil
end

function M.describe(request: Request): ({ targets: { [string]: types.LinkTarget } }?, error?)
    local targets: { [string]: types.LinkTarget } = {}
    if #request.ids == 0 then return { targets = targets }, nil end
    local rows, err = component.query({ component_ids = request.ids, access_mask = component.ACCESS.READ, include = { meta = true } })
    if err or not rows then return nil, err end
    for _, row in ipairs(rows) do
        local title = row.meta and row.meta.title
        targets[row.component_id] = { label = type(title) == "string" and title or row.component_id }
    end
    return { targets = targets }, nil
end

return M
