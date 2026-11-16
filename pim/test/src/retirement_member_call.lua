-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local threads=require("threads")
local M={}
function M.run(input)
    local c,err=threads.open()
    if err then return nil,err end
    return c:retire_subjects({thread_id=input.catalog_id,subjects={"p:absent"}})
end
return M
