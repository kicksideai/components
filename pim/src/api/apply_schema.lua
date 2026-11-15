-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/schema - apply a schema change.
local access = require("access")

local function handler()
    access.command("apply_schema")
end

return { handler = handler }
