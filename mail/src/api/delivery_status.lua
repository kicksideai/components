-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_admin, function(_req)
        return funcs.call("kickside.mail.read:delivery_status")
    end)
end

return {handler = handler}
