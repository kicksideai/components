-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local CONTRACT = "kickside.work.planning:sprints"
return {
    plan = function() access.endpoint("plan_adoption", nil, CONTRACT) end,
    apply = function() access.endpoint("apply_adoption", nil, CONTRACT) end,
}
