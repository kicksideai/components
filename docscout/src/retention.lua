-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The one retention window for processed documents and run history.
local contract = require("contract")
local time = require("time")

local M = {}

-- The configured window as its setting text, for example "2h".
function M.window(): (string?, error?)
    local definition, definition_err = contract.get("kickside.settings:settings")
    if definition_err or not definition then return nil, definition_err end
    local settings, open_err = definition:open()
    if open_err or not settings then return nil, open_err end
    local result, err = settings:get({ namespace = "kickside.docscout", key = "retention" })
    if err then return nil, err end
    if type(result) ~= "table" or result.success == false then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "retention setting is unavailable: " .. tostring(result and result.error) })
    end
    return tostring(result.value), nil
end

-- The RFC3339 instant at which something created now expires.
function M.expires_at(): (string?, error?)
    local window, err = M.window()
    if err then return nil, err end
    local duration, parse_err = time.parse_duration(window :: string)
    if parse_err then
        return nil, errors.new({ kind = errors.INVALID, message = "retention setting is not a duration: " .. tostring(window) })
    end
    return time.now():utc():add(duration):format(time.RFC3339), nil
end

return M
