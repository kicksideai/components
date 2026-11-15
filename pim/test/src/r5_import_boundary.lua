-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work=require("work")
local storage=require("storage")
local M={}
function M.run(input:{catalog_id:string}): unknown
    storage.reset()
    local done,err=work.batch(input.catalog_id)
    return {done=done,error=err and tostring(err) or nil,io=storage.stats()}
end
return M
