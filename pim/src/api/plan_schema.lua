-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/schema/plan - classify a schema change; applying it is separate.
local access = require("access")

local function handler()
    access.command("plan_schema")
end

return { handler = handler }
