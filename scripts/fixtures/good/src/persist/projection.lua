-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local function fold(input)
    return funcs.call("acme.good.persist:publish_meta", input)
end
return { fold = fold }
