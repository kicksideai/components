-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M={}
function M.run(_limit:integer): (unknown,error?)
    return {success=true,deleted=1,needs_continue=true,sweep_complete=false,blocked={}},nil
end
return M
