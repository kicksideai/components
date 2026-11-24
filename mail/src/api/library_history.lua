-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local client = require("client")
local request = require("request")
local principals = require("principals")

local function handler()
    return request.handle(client.require_library, function(req)
        return principals.page("author", request.items(funcs.call("kickside.mail.library:history", request.key(req))))
    end)
end

return {handler = handler}
