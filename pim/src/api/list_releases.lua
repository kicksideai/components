-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/releases - a product's releases newest first.
local access = require("access")

local function handler()
    access.read("list_releases", { product = true, int = { "before", "limit" } })
end

return { handler = handler }
