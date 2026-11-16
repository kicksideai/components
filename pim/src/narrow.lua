-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Narrowing of values read from SQL rows and contract results, whose column
-- and field types differ by driver: integers may arrive as numbers or text.
local M = {}

-- int returns v as an integer, and nil for anything else.
function M.int(v: unknown): integer?
    if type(v) == "number" then return math.tointeger(v) end
    if type(v) == "string" then return math.tointeger(tonumber(v)) end
    return nil
end

-- text returns v when it is a string, or nil.
function M.text(v: unknown): string?
    if type(v) == "string" then return v end
    return nil
end

return M
