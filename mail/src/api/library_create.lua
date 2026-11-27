-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local types = require("types")
local request = require("request")

local function handler()
    return request.handle(client.require_library, function(req)
        local library, open_err = client.library()
        if not library then return nil, open_err end
        local body, err = request.body(req)
        if err then return nil, err end
        if body.kind == "asset" then
            if body.expected_revision ~= nil then return nil, request.invalid("Use the image URL to replace an asset") end
            return library:add_asset((body :: unknown) :: types.AssetWrite)
        end
        return library:create((body :: unknown) :: types.ResourceCreate)
    end, 201)
end

return {handler = handler}
