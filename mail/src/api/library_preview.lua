-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local client = require("client")
local request = require("request")

local function handler()
    return request.handle(client.require_library, function(req)
        local body, err = request.body(req)
        if err then return nil, err end
        return funcs.call("kickside.mail.library:render_draft", body)
    end)
end

return {handler = handler}
