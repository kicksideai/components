-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/publications - a channel publication feed.
local access = require("access")

local function handler()
    access.read("list_publications", { text = { "channel" }, int = { "limit" }, json = { "after" } })
end

return { handler = handler }
