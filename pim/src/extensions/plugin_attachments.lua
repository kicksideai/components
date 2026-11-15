-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Attachments belong to the catalog lifecycle and hold each plugin's private state.
local hash = require("hash")
local component = require("component")
local creations=require("creations")
local component_types=require("component_types")
local envelope = require("envelope")
local types = require("types")
local values = require("values")
local M = {}

function M.id(catalog_id: string, plugin: string, generation: integer): (string?, error?)
    local digest, err = hash.sha256("kickside.pim.plugin.attachment\0" .. plugin .. "\0" .. catalog_id .. "\0" .. generation)
    if err then return nil, errors.wrap(err, "plugin attachment identity") end
    local hex = tostring(digest):gsub("[^a-fA-F0-9]", ""):lower():sub(1, 32)
    hex = hex:sub(1, 12) .. "5" .. hex:sub(14, 16) .. "8" .. hex:sub(18)
    return table.concat({ hex:sub(1, 8), hex:sub(9, 12), hex:sub(13, 16), hex:sub(17, 20), hex:sub(21, 32) }, "-"), nil
end

function M.ensure(catalog_id: string, plugin_id: string, generation: integer, kind: string, title: string?, config: types.JsonObject): (string?, boolean?, error?)
    local id, ierr = M.id(catalog_id, plugin_id, generation)
    if ierr or not id then return nil, nil, ierr end
    local rows, rerr = component.list_system({ component_ids = { id }, include = { meta = true, private_context = true }, limit = 1 })
    if rerr then return nil, nil, rerr end
    local row = rows and rows[1]
    local request={plugin=plugin_id,generation=generation,kind=kind}
    if row then
        local proven,perr=creations.proves(catalog_id,id,request,(row.private_context or {}).pim_creation)
        if perr then return nil,nil,perr end
        if not proven then return nil,nil,errors.new({kind=errors.CONFLICT,retryable=false,message="attachment has no PIM creation provenance",details={code="attachment_mismatch"}}) end
    end
    if not row then
        local service, serr = component.get_service()
        if serr then return nil, nil, serr end
        if not service then return nil, nil, errors.new({ kind = errors.UNAVAILABLE, message = "component service unavailable", details = { code = "contract_unavailable" } }) end
        local token,perr=creations.prepare(catalog_id,id,request)
        if perr or not token then return nil,nil,perr end
        local registered, err = service:register({ component_id = id, impl_id = kind, private_context = { pim_creation=token, catalog_id = catalog_id, pim_plugin = plugin_id, generation = generation, config = config }, meta = { title = title or "Plugin" } })
        if err then return nil, nil, err :: error end
        local eerr = envelope.error_of(registered :: component_types.ServiceEnvelope?, "register")
        if eerr then return nil, nil, eerr end
    end
    local confirmed=creations.confirm(id)
    if confirmed then return nil,nil,confirmed end
    if not row or (row.meta or {}).owner~=catalog_id then
        local _,merr=component.set_meta(id,{owner=catalog_id})
        if merr then return nil,nil,merr end
    end
    if row and not values.equal((row.private_context or {}).config,config) then
        local _,cerr=component.update(id,{{type="PATCH_CONTEXT",payload={patch={config=config}}}})
        if cerr then return nil,nil,cerr end
    end
    return id, row == nil, nil
end

-- remove requests platform deletion once; completion belongs to the component lifecycle.
function M.remove(id: string): error?
    local service,serr=component.get_service()
    if serr or not service then return serr end
    local result,err=service:delete({component_id=id})
    if err then return err :: error end
    local eerr=envelope.error_of(result :: component_types.ServiceEnvelope?,"delete")
    if eerr then return eerr end
    return creations.forget(id)
end
return M
