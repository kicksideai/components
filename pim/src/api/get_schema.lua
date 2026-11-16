-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/schema - the declaration and compiled schema.
local access = require("access")

local function handler()
    access.read("get_schema", { int = { "generation" } })
end

return { handler = handler }
