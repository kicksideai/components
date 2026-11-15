-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/proposals - store changes for a decision.
local access = require("access")

local function handler()
    access.command("propose")
end

return { handler = handler }
