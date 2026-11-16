-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/releases - release products to channels.
local access = require("access")

local function handler()
    access.command("release")
end

return { handler = handler }
