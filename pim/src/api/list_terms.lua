-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/terms - a vocabulary's terms by code.
local access = require("access")

local function handler()
    access.read("list_terms", { text = { "vocabulary", "parent", "after" }, int = { "limit" }, bool = { "retired" } })
end

return { handler = handler }
