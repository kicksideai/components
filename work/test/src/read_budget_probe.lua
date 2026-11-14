-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local time = require("time")
local types = require("types")
local M = {}
function M.run(input: { board_id: string }): (types.ReadStamp?, error?)
    return access.with_snapshot(input.board_id, nil, function(_tx: types.Executor, _board: unknown, _dialect: string): (types.ReadStamp?, error?)
        time.sleep("2100ms")
        return {}, nil
    end)
end
return M
