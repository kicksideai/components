-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local function handler()
    access.endpoint("list", nil, "kickside.work:packs")
end
return { handler = handler }
