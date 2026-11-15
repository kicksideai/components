-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Source-linked owner sees a lost reply after Core commits; its PIM address must survive.
local threads=require("threads")
local M={append=threads.append,mismatch=threads.mismatch}
function M.open()
    local c,err=threads.open()
    if err then return nil,err end
    return {
        append_events=function(_self,input) return c:append_events(input) end,
        retire_subjects=function(_self,input)
            local out,rerr=c:retire_subjects(input)
            if rerr then return nil,rerr end
            assert(out)
            return nil,errors.new({kind=errors.UNAVAILABLE,message="retirement reply lost",retryable=true})
        end,
    },nil
end
return M
