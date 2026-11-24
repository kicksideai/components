-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_activity, function(req)
        local limit, since = req:query("limit"), req:query("since")
        local size = limit == nil and 50 or math.tointeger(tonumber(limit))
        local start = since and math.tointeger(tonumber(since)) or nil
        if not size or (since and not start) then
            return nil, request.invalid("Limit and since must be integers")
        end
        return client.list_messages({limit = size, since = start, status = req:query("status") :: string?,
            q = req:query("q") :: string?, template = req:query("message") :: string?, cursor = req:query("cursor") :: string?})
    end)
end

return {handler = handler}
