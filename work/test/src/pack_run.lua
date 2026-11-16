-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs=require("funcs")
local M={}
function M.run(input)
    return funcs.call("kickside.work.jobs:operation_batch",input)
end
return M
