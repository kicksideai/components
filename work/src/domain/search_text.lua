-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local casefold = require("casefold")

local M = {}

-- Use Unicode default full case folding on input and on plugin-owned search
-- columns. The fold preserves accents and does not normalize combining marks.
function M.fold(value: string): string?
    if value:find("\0", 1, true) then return nil end
    return (casefold.fold(value))
end

return M
