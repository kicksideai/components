-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Search documents and queries share Unicode letter/number tokens.
local text = require("text")
local M = {}
local WORDS = assert(text.regexp.compile([[\p{L}[\p{L}\p{N}]*|\p{N}[\p{L}\p{N}]*]]))

function M.tokens(value: string): { string }
    return WORDS:find_all_string(value) :: {string}
end

function M.body(value: string): string
    return table.concat(M.tokens(value), " ")
end

return M
