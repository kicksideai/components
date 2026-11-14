-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Base-36 fractions and evenly spaced rebalance keys. Digits and lowercase letters sort alike in byte order and in every database collation.
local M = {}
local DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz"
local BASE = 36
local MIDDLE = "i"
local WIDTH = 10
local SPACE = 3656158440062976 -- 36^10

local function digit(key: string, at: integer, fallback: integer): integer
    local c = key:sub(at, at)
    if c == "" then return fallback end
    return (DIGITS:find(c, 1, true) :: integer) - 1
end

-- The terminal digit keeps encoded boundaries open to fractional insertions.
function M.encode(value: integer): string
    local out = ""
    for _ = 1, WIDTH do
        local d = value % BASE
        out = DIGITS:sub(d + 1, d + 1) .. out
        value = value // BASE
    end
    return out .. MIDDLE
end

-- midpoint examines at most one digit beyond the longer neighbor.
function M.midpoint(after: string?, before: string?): string
    local low, high = after or "", before or ""
    local prefix = ""
    for at = 1, math.max(#low, #high) + 1 do
        local a, b = digit(low, at, 0), digit(high, at, BASE)
        if b - a > 1 then return prefix .. DIGITS:sub((a + b) // 2 + 1, (a + b) // 2 + 1) end
        prefix = prefix .. DIGITS:sub(a + 1, a + 1)
        if a < b then high = "" end
    end
    return prefix
end

-- ending advances fixed-width keys before extending the fraction.
function M.ending(last: string?): string
    if not last then return M.encode(SPACE // 4) end
    if #last == WIDTH + 1 and last:sub(-1) == MIDDLE then
        local n = 0
        for i = 1, WIDTH do n = n * BASE + digit(last, i, 0) end
        local next_value = n + 60466176 -- 36^5
        if next_value < SPACE then return M.encode(next_value) end
    end
    return M.midpoint(last, nil)
end

function M.spaced(position: integer, total: integer): string
    return M.encode((SPACE // (total + 1)) * position)
end

return M
