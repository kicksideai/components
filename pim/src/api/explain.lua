-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/explain - how a value resolved.
local access = require("access")

local function handler()
    access.read("explain", { product = true, text = { "attr" }, json = { "context" } })
end

return { handler = handler }
