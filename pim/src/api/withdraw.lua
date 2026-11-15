-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/withdrawals - withdraw products from channels.
local access = require("access")

local function handler()
    access.command("withdraw")
end

return { handler = handler }
