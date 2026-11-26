-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")
local types = require("types")

local function handler()
    return request.handle(client.require_admin, function(req)
        local body, err = request.body(req, true)
        if err then return nil, err end
        local mailer, open_err = client.mailer()
        if not mailer then return nil, open_err end
        return mailer:send_delivery_test((body :: unknown) :: types.DeliveryTestRequest)
    end, 202)
end

return {handler = handler}
