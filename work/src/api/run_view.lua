-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")

local function handler()
    access.endpoint("run", "view_id", "kickside.work:view")
end

return { handler = handler }
