-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}

-- Scan each edge once; internal whitespace and non-ASCII bytes are preserved.
function M.trim(value: unknown): string
    if type(value) ~= "string" then return "" end
    local first, last = 1, #value
    while first <= last do
        local byte = value:byte(first)
        if byte ~= 32 and (byte < 9 or byte > 13) then break end
        first = first + 1
    end
    while last >= first do
        local byte = value:byte(last)
        if byte ~= 32 and (byte < 9 or byte > 13) then break end
        last = last - 1
    end
    return value:sub(first, last)
end

return M
