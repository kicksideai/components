-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
return { handler = function() access.endpoint("move", "board_id") end }
