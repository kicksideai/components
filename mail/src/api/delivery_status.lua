-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_admin, function(_req)
        local mailer, open_err = client.mailer()
        if not mailer then return nil, open_err end
        return mailer:delivery_status()
    end)
end

return {handler = handler}
