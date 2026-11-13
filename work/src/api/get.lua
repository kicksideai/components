-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")

local function handler()
    access.endpoint("get", "board_id")
end

return { handler = handler }
