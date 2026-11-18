-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local case_folding = require("case_folding")

local M = {}

-- Use Unicode default full case folding on input and on plugin-owned search
-- columns. The fold preserves accents and does not normalize combining marks.
function M.fold(value: string): string?
    if value:find("\0", 1, true) or not utf8.len(value) then return nil end
    return (value:gsub("[A-Z\194-\244][\128-\191]*", case_folding))
end

return M
