-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")

local function handler()
    access.endpoint("plan_close", nil, "kickside.work.planning:sprints")
end

return { handler = handler }
