-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_send, function(req)
        return client.resend((req:param("id") :: string?) or "")
    end, 202)
end

return {handler = handler}
