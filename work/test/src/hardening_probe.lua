-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local receipts = require("receipts")
local move = require("move")
local M = {}
function M.run(input)
    if input.op == "receipt" then
        local result, err = receipts.command(input.board_id,input.key)
        if err then return nil,err end
        return { found = result ~= nil }, nil
    end
    return move.batch(input.owner)
end
return M
