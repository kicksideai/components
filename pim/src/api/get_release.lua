-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/releases/{release_id} - one release snapshot.
local access = require("access")

local function handler()
    access.read("get_release", { path = { "release_id" } })
end

return { handler = handler }
