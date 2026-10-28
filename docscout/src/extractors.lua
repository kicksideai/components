-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local config = require("config")
local repository = require("repository")
local retention = require("retention")
local contract = require("contract")
local M = {}
local KIND = "kickside.docscout:extractor"
local function invalid(message)
    return errors.new({kind=errors.INVALID,message=message})
end
local function service()
    return component.get_service()
end
local function checked(result: any, err: any)
    if err then return nil, err end
    if not result or result.success == false then
        return nil, errors.new({kind=result and result.kind or errors.INTERNAL, message=tostring(result and result.error or "Component operation failed"),details=result and result.details})
    end
    return result, nil
end
local function access(id, mask)
    local svc, err = service()
    if err or not svc then return nil, err end
    local result, read_err = svc:get_access_context({component_id=id,access_mask=mask,include_context=true})
    local context, context_err = checked(result,read_err)
    if context_err then return nil, context_err end
    if context.impl_id ~= KIND then return nil, invalid("Component is not a Docscout") end
    return context, nil
end
local function validate(dto, update)
    if type(dto) ~= "table" then return invalid("Request must be an object") end
    local allowed = {title=true,description=true,config=true,parent_id=not update,expected_revision=update}
    for key in pairs(dto) do if not allowed[key] then return invalid("Unknown request field: " .. tostring(key)) end end
    if type(dto.title) ~= "string" or not dto.title:match("%S") or #dto.title > 200 then return invalid("Name is required and must be at most 200 characters") end
    if dto.description ~= nil and (type(dto.description) ~= "string" or #dto.description > 4000) then return invalid("Description must be at most 4000 characters") end
    if dto.parent_id ~= nil and (type(dto.parent_id) ~= "string" or dto.parent_id == "") then return invalid("Parent must be a component id") end
    if update and (type(dto.expected_revision) ~= "number" or dto.expected_revision < 0 or math.floor(dto.expected_revision) ~= dto.expected_revision) then return invalid("Expected revision is required") end
    return config.validate(dto.config)
end
local function meta(dto)
    return {title=dto.title,description=dto.description or "",field_count=#dto.config.fields,status="configured",class="kickside.docscout",icon="tabler:file-search"}
end
function M.create(dto)
    local err = validate(dto,false)
    if err then return nil, err end
    local svc, svc_err = service()
    if svc_err or not svc then return nil,svc_err end
    return checked(svc:register({impl_id=KIND,private_context={config=dto.config},meta=meta(dto),parent_id=dto.parent_id}))
end
function M.get(id)
    local context, err = access(id,component.ACCESS.READ)
    if err then return nil,err end
    local svc, svc_err = service()
    if svc_err or not svc then return nil,svc_err end
    local row, row_err = checked(svc:get({component_id=id}))
    if row_err then return nil,row_err end
    local can_edit = math.floor(context.access_level / component.ACCESS.WRITE) % 2 == 1
    local records, records_err = repository.snapshot(id)
    if records_err then return nil, records_err end
    local window,retention_err = retention.window()
    if retention_err then return nil,retention_err end
    return {retention=window,success=true,id=id,title=row.meta.title,description=row.meta.description,field_count=tonumber(row.meta.field_count),status=row.meta.status,
        config=can_edit and context.context.config or nil,expected_revision=can_edit and context.context_revision or nil,
        can_edit=can_edit,runs=records.runs,cases=can_edit and records.cases or nil},nil
end
-- The configuration a run uses; READ access is enough to run an extractor.
function M.for_run(id)
    local context, err = access(id,component.ACCESS.READ)
    if err then return nil, err end
    return {config=context.context.config, revision=context.context_revision or 0}, nil
end
function M.update(id,dto)
    local _, err = access(id,component.ACCESS.WRITE)
    if err then return nil,err end
    local validation_err = validate(dto,true)
    if validation_err then return nil,validation_err end
    return component.update(id,{{type="PATCH_CONTEXT",payload={patch={config=dto.config}}},{type="SET_META",payload={fields=meta(dto)}}},{expected_revision=dto.expected_revision})
end
function M.delete(id)
    local _, err = access(id,component.ACCESS.DELETE)
    if err then return nil,err end
    local svc,svc_err = service()
    if svc_err or not svc then return nil,svc_err end
    return checked(svc:delete({component_id=id}))
end
function M.list()
    local rows,err = component.query({impl_ids={KIND},include={meta=true},limit=100})
    if err then return nil,err end
    return {success=true,items=rows},nil
end
function M.add_case(id,dto)
    local context,err=access(id,component.ACCESS.WRITE)
    if err then return nil,err end
    if type(dto)~="table" or type(dto.upload_id)~="string" or dto.upload_id=="" or type(dto.upload_name)~="string" or dto.upload_name=="" then return nil,invalid("Choose an upload") end
    for key in pairs(dto) do if key~="upload_id" and key~="upload_name" and key~="expected" then return nil,invalid("Unknown case field: "..tostring(key)) end end
    local validation_err=config.validate_expected(context.context.config.fields,dto.expected)
    if validation_err then return nil,validation_err end
    return repository.add_case(id,dto)
end
function M.delete_case(id,case_id)
    local _,err=access(id,component.ACCESS.WRITE)
    if err then return nil,err end
    if type(case_id)~="string" or case_id=="" then return nil,invalid("Case id is required") end
    return repository.delete_case(id,case_id)
end
return M
