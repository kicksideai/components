-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local types = require("types")
local request = require("request")

local function handler()
    return request.handle(client.require_library, function(req)
        local library, open_err = client.library()
        if not library then return nil, open_err end
        local body, err = request.resource(req)
        if err then return nil, err end
        if body.kind == "asset" then
            if body.expected_revision == nil then return nil, request.invalid("Expected revision is required") end
            return library:add_asset((body :: unknown) :: types.AssetWrite)
        end
        return library:update((body :: unknown) :: types.ResourceEdit)
    end)
end

return {handler = handler}
