-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local request = require("request")
local principals = require("principals")

local function handler()
    return request.handle(client.require_activity, function(req)
        return principals.item("sender", client.get_message((req:param("id") :: string?) or ""))
    end)
end

return {handler = handler}
