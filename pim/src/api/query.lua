-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/query - items by filter tree, text and hierarchy.
local access = require("access")

local function handler()
    access.command("query")
end

return { handler = handler }
