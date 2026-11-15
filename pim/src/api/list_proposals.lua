-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/proposals - proposals for review.
local access = require("access")

local function handler()
    access.read("list_proposals", { text = { "status" }, int = { "limit" }, json = { "after" } })
end

return { handler = handler }
