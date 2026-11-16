-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local create=require("create")
local threads=require("threads")
local attachments=require("attachments")
local component=require("component")
local M={}
function M.run(input: {catalog_id: string, attachment: boolean?,phase:string?,grant:string?}): (unknown,error?)
    if input.phase then
        local id=assert(attachments.id(input.catalog_id,"app:projection_plugin",99))
        local service=assert(component.get_service())
        if input.phase=="create_delete" then
            assert(attachments.ensure(input.catalog_id,"app:projection_plugin",99,"app:empty_plugin_attachment","Plugin",{}))
            local removed=assert(service:delete({component_id=id}))
            assert(removed.success)
            for _=1,600 do
                local rows=assert(component.list_system({component_ids={id},limit=1}))
                if #rows==0 then return true,nil end
                require("time").sleep("50ms")
            end
            error("attachment deletion did not finish")
        elseif input.phase=="replace" then
            local registered=assert(service:register({component_id=id,impl_id="app:empty_plugin_attachment",private_context={catalog_id=input.catalog_id,pim_plugin="app:projection_plugin",generation=99},additional_access={{subject_id=input.grant,subject_type="user",access_mask=7}},meta={title="Replacement"}}))
            assert(registered.success,require("json").encode(registered))
            return true,nil
        else
            local out,_,err=attachments.ensure(input.catalog_id,"app:projection_plugin",99,"app:empty_plugin_attachment","Plugin",{})
            return out,err
        end
    end
    if input.attachment then
        local id=assert(attachments.id(input.catalog_id,"app:projection_plugin",99))
        local service=assert(component.get_service())
        local registered,err=service:register({component_id=id,impl_id="app:empty_plugin_attachment",private_context={catalog_id=input.catalog_id,pim_plugin="app:projection_plugin",generation=99},meta={title="Plugin"}})
        if err then return nil,err end
        assert(registered.success, registered.error)
        local out,_,aerr=attachments.ensure(input.catalog_id,"app:projection_plugin",99,"app:empty_plugin_attachment","Plugin",{})
        return out,aerr
    end
    local key="foreign-"..input.catalog_id
    local id=assert(create.catalog_id(key))
    assert(threads.create(assert(threads.open()),{id=id,impl_id="kickside.pim.binding:catalog",thread_class="pim.catalog",title="Catalog"}))
    return create.create({idempotency_key=key,title="Catalog"})
end
return M
