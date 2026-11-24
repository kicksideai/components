-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local config = require("config")
local work = require("work")

local ORIGINAL = "time_original_minutes"
local REMAINING = "time_remaining_minutes"
local M = {}

function M.resolve(request: { config: work.JsonObject }): work.ProviderResult
    local item_types = config.effective(request.config).item_types
    if #item_types == 0 then return { fragment = {} } end

    -- Work composes field-only extensions with the board declaration before validation.
    local extensions: { work.JsonObject } = {}
    for _, id in ipairs(item_types) do
        extensions[#extensions + 1] = { id = id, fields = { ORIGINAL, REMAINING } }
    end
    table.sort(extensions, function(a: work.JsonObject, b: work.JsonObject): boolean
        return (a.id :: string) < (b.id :: string)
    end)
    return { fragment = {
        fields = {
            { code = ORIGINAL, title = "Original estimate (minutes)", form = "int", index = "number", track = true },
            { code = REMAINING, title = "Remaining estimate (minutes)", form = "int", index = "number", track = true },
        },
        item_types = extensions,
    } }
end

return M
