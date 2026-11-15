-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- kickside.contract:portable import_into: restores an exported catalog into the
-- registered shell through the write path - schema, then terms, then products
-- parents first (import mode keeps each value's source), then product
-- references remapped to the new ids. id_map gains rows.pim_product.
local fs = require("fs")
local ctx = require("ctx")
local component = require("component")
local input = require("input")
local defaults = require("defaults")
local consts = require("consts")
local threads = require("threads")
local types = require("types")
local portable_result = require("portable_result")
local failure = require("failure")

local work=require("work")
local jobs=require("jobs")
local clock=require("clock")
local M = {}



local fail = portable_result.failure

-- strip_resolved drops what the source catalog's write path assigned: attribute
-- ids, which the target assigns, and plugin schema copies, which the target
-- resolves again from each plugin's source.
local function strip_resolved(declaration: types.Declaration)
    for _, aspect in ipairs(declaration.aspects or {}) do
        for _, a in ipairs(aspect.attributes or {}) do a.id = nil end
    end
    for _, entry in pairs(declaration.plugins or {}) do entry.schema = nil end
end

function M.handler(args: types.PortableArgs): types.PortableResult
    local catalog_id = ctx.get("component_id")
    if type(catalog_id) ~= "string" or catalog_id == "" then return fail(failure.invalid("no component_id in context")) end
    local _, access_err = component.validate_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return fail(errors.wrap(access_err, "catalog access denied")) end
    local base = args.path .. "/data/"
    local storage, ferr = fs.get(args.storage_id)
    if ferr or not storage then return fail(errors.wrap(ferr, "storage")) end

    local c, oerr = threads.open()
    if oerr or not c then return fail(errors.wrap(oerr, "threads open failed")) end
    local terr = threads.ensure(c, { component_id = catalog_id, impl_id = consts.CATALOG_IMPL, thread_class = consts.THREAD_CLASS })
    if terr then return fail(errors.wrap(terr, "thread")) end

    local decoded, decode_err = input.object(storage,base .. "schema.json")
    if decode_err or not decoded then return fail(decode_err :: error) end
    local declaration = decoded :: types.Declaration
    strip_resolved(declaration)
    local plugin_configs: { [string]: types.JsonObject } = {}
    if #(declaration.plugins or {}) > 0 then
        local configs,jerr=input.object(storage,base .. "plugin-configs.json")
        if jerr or not configs then return fail(jerr :: error) end
        plugin_configs = configs :: { [string]: types.JsonObject }
    end
    local task,serr=work.start(catalog_id,args.storage_id,args.path,declaration,plugin_configs)
    if serr or not task then return fail(serr :: error) end
    local operating,operr=defaults.catalog(catalog_id)
    if operr or not operating then return fail(operr :: error) end
    local deadline=clock.deadline(operating.command_deadline_ms*5)
    for _=1,operating.job_batches do
        if clock.passed(deadline) then break end
        local done,berr=work.batch(catalog_id)
        if berr then
            local _,werr=jobs.wake_job(task.job_id,{control=true,ensure_due=true})
            if werr then return fail(errors.wrap(werr,"import wake after "..tostring(berr))) end
            return fail(berr)
        end
        if done then
            local id_map,merr=work.result(catalog_id,args.id_map)
            if merr then return fail(merr) end
            return {success=true,id_map=id_map,warnings={}}
        end
    end
    local _,werr=jobs.wake_job(task.job_id,{control=true,ensure_due=true})
    if werr then return fail(werr) end
    return fail(errors.new({kind=errors.UNAVAILABLE,retryable=true,message="import continues in its durable job",details={code="import_pending",job_id=task.job_id}}))
end
return M
