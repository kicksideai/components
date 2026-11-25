-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local request = require("request")
local principals = require("principals")

local function handler()
    return request.handle(client.require_library, function(req)
        local library, open_err = client.library()
        if not library then return nil, open_err end
        local filter: types.LibraryPageRequest = {kind = req:query("kind"), state = req:query("state"), q = req:query("q")}
        local names = req:query("names")
        if names and names ~= "" then
            local list: {string} = {}
            for name in names:gmatch("[^,]+") do list[#list + 1] = name end
            filter.names = list
        end
        local limit, err = request.query_integer(req, "limit")
        if err then return nil, err end
        filter.limit, filter.cursor = limit, req:query("cursor")
        return principals.page("author", library:list(filter))
    end)
end

return {handler = handler}
