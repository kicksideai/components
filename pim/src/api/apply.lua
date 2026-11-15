-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/apply - product and term changes.
local access = require("access")

local function handler()
    access.command("apply")
end

return { handler = handler }
