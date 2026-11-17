-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local clock = require("clock")
local types = require("types")
local M = {}
function M.run(input: { board_id: string, elapsed_ms: integer, caller_ms: integer? }): (types.ReadStamp?, error?)
    clock.reset()
    local asked = input.caller_ms and { deadline = clock.deadline(input.caller_ms).at } or nil
    local result, err = access.with_snapshot(input.board_id, nil, function(_tx: types.Executor, _board: unknown, _dialect: string): (types.ReadStamp?, error?)
        clock.advance(input.elapsed_ms)
        return {}, nil
    end, nil, asked)
    clock.clear()
    return result, err
end
return M
