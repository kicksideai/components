-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local hash = require("hash")
local M = {}
function M.uuid(text: string): (string?, error?)
    local digest, err = hash.sha256(text)
    if err then return nil, err end
    local hex = tostring(digest):sub(1, 32)
    hex = hex:sub(1, 12) .. "5" .. hex:sub(14, 16) .. "8" .. hex:sub(18)
    return table.concat({ hex:sub(1, 8), hex:sub(9, 12), hex:sub(13, 16), hex:sub(17, 20), hex:sub(21, 32) }, "-"), nil
end
function M.resource(board_id: string, kind: string, id: string): (string?, error?)
    return M.uuid("kickside.work.pack.v1\0" .. board_id .. "\0" .. kind .. "\0" .. id)
end
return M
