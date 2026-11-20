-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture=require("fixture")
local attachments=require("attachments")
local create=require("create")
local threads=require("threads")
local M={}
function M.run(input)
    if input.catalog then
        fixture.reset(false);threads.reset()
        local request={idempotency_key="r3-thread-"..input.catalog_id,title="Recovery"}
        local _,first=create.create(request)
        assert(first and first:kind()==errors.UNAVAILABLE,tostring(first))
        local out,err=create.create(request)
        assert(out==nil and err and err:details().code=="catalog_not_initialized",tostring(err))
        local retry,retry_err=create.create({idempotency_key=request.idempotency_key.."-retry",title=request.title})
        if retry_err then return nil,retry_err end
        return {refused=true,catalog_id=assert(create.catalog_id(request.idempotency_key)),retry_id=retry.catalog_id},nil
    end
    fixture.reset()
    local expected=assert(attachments.id(input.catalog_id,"app:projection_plugin",98))
    local _,_,first=attachments.ensure(input.catalog_id,"app:projection_plugin",98,"app:empty_plugin_attachment","Plugin",{},expected)
    assert(first and first:kind()==errors.UNAVAILABLE,tostring(first))
    local id,_,err=attachments.ensure(input.catalog_id,"app:projection_plugin",98,"app:empty_plugin_attachment","Plugin",{},expected)
    if err then return nil,err end
    return {recovered=id~=nil},nil
end
return M
