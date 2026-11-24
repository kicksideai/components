-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(nil, function()
        return client.capabilities(), nil
    end)
end

return {handler = handler}
