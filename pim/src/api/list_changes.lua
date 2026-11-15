-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/changes - the product change feed.
local access = require("access")

local function handler()
    access.read("list_changes", { int = { "limit" }, json = { "cursor" }, list = { "families" } })
end

return { handler = handler }
