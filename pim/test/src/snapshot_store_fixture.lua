-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store=require("store")
local funcs=require("funcs")
local types=require("types")
local M={}
local mode=""
local armed=false
function M.set(value:string) mode=value;armed=value~="" end
local function interleave(id:string)
    if not armed then return end
    armed=false
    assert(funcs.call("app:pim_call",{op="configure_plugin",catalog_id=id,request={plugin="app:state_plugin",config={marker="after-snapshot"}}}))
    local changed=assert(funcs.call("app:pim_call",{
        op="apply",catalog_id=id,request={items={
            {product={sku="RDG-moss-40"},expect_version="any",set={{attr="core.gtin",value="after-snapshot"}}}
        }}
    }))
    assert(changed.outcomes[1].outcome=="updated")
end
function M.snapshot<T>(id:string,fn:(types.Executor,types.Catalog,string)->(T?,error?)): (T?,types.Catalog?,error?)
    local out,catalog,err=store.snapshot(id,function(tx:types.Executor,c:types.Catalog,dialect:string): (T?,error?)
        return fn(tx,c,dialect)
    end)
    if (mode=="schema" or mode=="feed") and not err then interleave(id) end
    return out,catalog,err
end
M.open=store.open
M.catalog=store.catalog
M.release=store.release
M.decode_row=store.decode_row
M.generation=store.generation
M.with_db=store.with_db
return M
