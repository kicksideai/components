-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/rebuild - resume a parked rebuild.
local access = require("access")

local function handler()
    access.command("rebuild")
end

return { handler = handler }
