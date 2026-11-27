-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
return { fold = function(input) return funcs.call("acme.other.publish:meta", input) end }
