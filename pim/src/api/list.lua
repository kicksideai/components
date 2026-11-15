-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs - the catalogs the caller can read.
local access = require("access")

local function handler()
    access.read("list", {int={"limit","after"}}, false)
end

return { handler = handler }
