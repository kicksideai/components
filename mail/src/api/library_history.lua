-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")
local principals = require("principals")

local function handler()
    return request.handle(client.require_library, function(req)
        local library, open_err = client.library()
        if not library then return nil, open_err end
        local key = request.key(req)
        local revision, revision_err = request.query_integer(req, "revision")
        if revision_err then return nil, revision_err end
        if revision then
            return principals.resource(library:read_revision({kind = key.kind, name = key.name, revision = revision}))
        end
        local limit, err = request.query_integer(req, "limit")
        if err then return nil, err end
        return principals.page("author", library:read_history({kind = key.kind, name = key.name,
            limit = limit, cursor = req:query("cursor")}))
    end)
end

return {handler = handler}
