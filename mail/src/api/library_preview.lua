-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local client = require("client")
local types = require("types")
local request = require("request")

local function handler()
    return request.handle(client.require_library, function(req)
        local library, open_err = client.library()
        if not library then return nil, open_err end
        local body, err = request.body(req)
        if err then return nil, err end
        return library:preview((body :: unknown) :: types.EditPreview)
    end)
end

return {handler = handler}
