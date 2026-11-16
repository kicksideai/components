-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local function handler() access.command("configure_plugin") end
return { handler = handler }
