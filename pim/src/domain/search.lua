-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- SKU prefixes and text tokens use the same Unicode case folding.
local casefold = require("casefold")
local hash = require("hash")
local text = require("text")
local M = { fold = casefold.fold }
local WORDS = assert(text.regexp.compile([[[\p{L}\p{N}][\p{L}\p{M}\p{N}]*]]))

local function hex_byte(byte: string): string
    return string.format("%02x", byte:byte())
end

-- Keep every encoded lexeme at most 65 bytes for both text indexes.
local function lexeme(token: string): string
    local ascii = token:match("^[a-z0-9]+$")
    if ascii and #token <= 64 then return "t" .. token end
    if not ascii and #token <= 32 then return "u" .. token:gsub(".", hex_byte) end
    return "h" .. assert(hash.sha256(token))
end

function M.tokens(value: string): { string }
    local tokens: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, word in ipairs(WORDS:find_all_string(value)) do
        local token = lexeme(assert(M.fold(word)))
        if not seen[token] then
            tokens[#tokens + 1] = token
            seen[token] = true
        end
    end
    return tokens
end

function M.body(value: string): string
    return table.concat(M.tokens(value), " ")
end

return M
