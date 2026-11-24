-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_library, function(req)
        local filter = {kind = req:query("kind"), state = req:query("state"), q = req:query("q")}
        local view = req:query("view")
        if view == "summary" then
            local limit = req:query("limit")
            filter.limit = limit and math.tointeger(tonumber(limit)) or nil
            if limit and not filter.limit then return nil, request.invalid("Limit must be an integer") end
            filter.cursor = req:query("cursor")
            return funcs.call("kickside.mail.library:list_page", filter)
        end
        if view then return nil, request.invalid("Library view must be summary") end
        return request.items(funcs.call("kickside.mail.library:list", filter))
    end)
end

return {handler = handler}
