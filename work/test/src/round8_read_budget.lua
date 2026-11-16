-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access=require("access")
local types=require("types")
local M={}
function M.run(input: {board_id: string, seconds: number, budget: types.ReadBudget?}): (types.ReadStamp?,error?)
    return access.with_snapshot(input.board_id,nil,function(tx: types.Executor,_board: unknown,_dialect: string): (types.ReadStamp?,error?)
        local _,err=tx:query("SELECT pg_sleep($1)",{input.seconds})
        if err then return nil,err end
        return {},nil
    end,nil,input.budget)
end
return M
