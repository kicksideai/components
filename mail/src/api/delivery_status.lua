-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_admin, function(_req)
        return client.delivery_status()
    end)
end

return {handler = handler}
