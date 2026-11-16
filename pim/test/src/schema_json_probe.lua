-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local M = {}
local decodes = 0
function M.decode(text: string): (unknown, error?)
    decodes = decodes + 1
    return json.decode(text)
end
M.validate = json.validate
function M.count(): integer return decodes end
return M
