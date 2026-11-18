-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- SKU prefixes and text tokens use the same Unicode case folding.
local case_folding = require("case_folding")
local hash = require("hash")
local text = require("text")
local M = { fold = case_folding.fold }
local WORDS = assert(text.regexp.compile([[\p{L}[\p{L}\p{N}]*|\p{N}[\p{L}\p{N}]*]]))

local function hex_byte(byte: string): string
    return string.format("%02x", byte:byte())
end

-- Disjoint ASCII lexemes give both text indexes the same token boundaries.
-- A digest keeps words that would exceed PostgreSQL's lexeme limit searchable.
local function lexeme(token: string): string
    if #token > 1000 then return "h" .. assert(hash.sha256(token)) end
    if token:find("[^a-z0-9]") then return "u" .. token:gsub(".", hex_byte) end
    return "t" .. token
end

function M.tokens(value: string): { string }
    local tokens: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, word in ipairs(WORDS:find_all_string(value)) do
        local token = lexeme(M.fold(word))
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
