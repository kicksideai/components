-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store=require("store")
local M={}
local fail=true
function M.reset(value) fail=value~=false end
function M.open() return store.open() end
function M.release(db,err) return store.release(db,err) end
function M.transaction(what,fn)
    return store.transaction(what,function(tx,dialect)
        local wrapped={query=function(_self,s,p) return tx:query(s,p) end,
            execute=function(_self,s,p)
                if fail and s:find("INSERT INTO kickside_pim_creation",1,true) then
                    fail=false
                    return nil,errors.new({kind=errors.UNAVAILABLE,retryable=true,message="transient provenance failure"})
                end
                return tx:execute(s,p)
            end}
        return fn(wrapped,dialect)
    end)
end
return M
