-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/history - change history newest first.
local access = require("access")

local function handler()
    access.read("list_history", { product = true, text = { "before" }, int = { "limit", "min_seq" } })
end

return { handler = handler }
