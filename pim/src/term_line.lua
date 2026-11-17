-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The encoded term record shared by write admission and catalog portability.
local json = require("json")
local failure = require("failure")
local types = require("types")

local M = {}
M.BYTES = 3000000

function M.too_large(): error
    return failure.invalid("term exceeds the " .. M.BYTES .. "-byte portable line limit", { code = "import_chunk_limit" })
end

function M.encode(term: types.ExportedTerm): (string?, error?)
    local line, err = json.encode(term)
    if err or not line then return nil, err end
    if #line + 1 > M.BYTES then return nil, M.too_large() end
    return line .. "\n", nil
end

return M
