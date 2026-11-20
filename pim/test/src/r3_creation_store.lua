-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store=require("store")
local M={}
local fail=true
function M.reset(value) fail=value~=false end
-- This fixture injects the registration result after the real reservation
-- retry. The Jobs integration exercises Component's native producer admission.
function M.register_root_attachment(request,catalog_id,plugin)
    assert(request.private_context.catalog_id==catalog_id and request.private_context.pim_plugin==plugin)
    assert(type(request.private_context.pim_creation)=="string")
    return {success=true,component_id=request.component_id}
end
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
