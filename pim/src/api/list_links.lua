-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/links - products referencing a target.
local access = require("access")

local function handler()
    access.read("list_links", { text = { "kind", "target" }, int = { "limit" }, json = { "after" } })
end

return { handler = handler }
