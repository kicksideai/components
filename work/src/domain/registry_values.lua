-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Registry declarations use the same numeric representation as command declarations.
local M = {}
local function canonical(value: unknown): unknown
    if type(value) == "number" then return math.tointeger(value) or value end
    if type(value) ~= "table" then return value end
    local out: { [unknown]: unknown } = {}
    for key, child in pairs(value :: { [unknown]: unknown }) do out[key] = canonical(child) end
    return out
end
function M.canonical<T>(value: T): T
    return canonical(value) :: T
end
return M
