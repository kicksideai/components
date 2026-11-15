-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs - create a catalog, idempotent per caller and key.
local access = require("access")

local function handler()
    access.command("create", nil, false)
end

return { handler = handler }
