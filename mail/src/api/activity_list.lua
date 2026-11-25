-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")
local principals = require("principals")

local function handler()
    return request.handle(client.require_admin, function(req)
        local limit, limit_err = request.query_integer(req, "limit")
        if limit_err then return nil, limit_err end
        local since, since_err = request.query_integer(req, "since")
        if since_err then return nil, since_err end
        return principals.page("sender", client.list_messages({limit = limit or 50, since = since, status = req:query("status") :: string?,
            q = req:query("q") :: string?, template = req:query("message") :: string?, cursor = req:query("cursor") :: string?}))
    end)
end

return {handler = handler}
