-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")

local function handler()
    access.endpoint("instantiate", "board_id", "kickside.work.templates:templates")
end

return { handler = handler }
