-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/product - one product by sku or id, with resolved values.
local access = require("access")

local function handler()
    access.read("get", { product = true, json = { "context" }, int = { "min_seq" } })
end

return { handler = handler }
