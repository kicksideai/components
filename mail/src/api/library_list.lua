-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_library, function(req)
        return request.items(funcs.call("kickside.mail.library:list", {kind = req:query("kind"), state = req:query("state"), q = req:query("q")}))
    end)
end

return {handler = handler}
