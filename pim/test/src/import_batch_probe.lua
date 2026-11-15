-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work=require("work")
local storage=require("storage")
local M={}
function M.run(input:{catalog_id:string}): (unknown,error?)
    storage.reset()
    local done,err=work.batch(input.catalog_id)
    if err then return nil,err end
    return {done=done,io=storage.stats()},nil
end
return M
