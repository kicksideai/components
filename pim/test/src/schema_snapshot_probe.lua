-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local reader=require("reader")
local store=require("store")
local M={}
function M.run(input:{catalog_id:string}): (unknown,error?)
    store.set("schema")
    local out,err=reader.get_schema(input.catalog_id)
    store.set("")
    return out,err
end
return M
