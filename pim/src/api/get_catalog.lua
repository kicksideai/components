-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access=require("access")
local function handler() access.read("get_catalog",{}) end
return {handler=handler}
