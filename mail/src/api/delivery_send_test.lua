-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_admin, function(req)
        local body, err = request.body(req, true)
        if err then return nil, err end
        return funcs.call("kickside.mail.service:delivery_send_test", body)
    end, 202)
end

return {handler = handler}
