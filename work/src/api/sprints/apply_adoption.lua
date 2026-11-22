-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")

local function handler()
    access.endpoint("apply_adoption", nil, "kickside.work.planning:sprints", true)
end

return { handler = handler }
