-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")
local principals = require("principals")

local function handler()
    return request.handle(client.require_admin, function(req)
        local mailer, open_err = client.mailer()
        if not mailer then return nil, open_err end
        return principals.item("sender", mailer:get_message((req:param("id") :: string?) or ""))
    end)
end

return {handler = handler}
