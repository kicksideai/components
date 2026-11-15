-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The catalog creation authority. A request owns one actor-scoped,
-- deterministic component id; the component and its thread are created through
-- the threads contract, then an optional initial declaration is applied as an
-- ordinary schema command keyed by the catalog id, so a retried request
-- converges on the same catalog and schema.
local failure = require("failure")
local component = require("component")
local hash = require("hash")
local security = require("security")
local consts = require("consts")
local envelope = require("envelope")
local component_types=require("component_types")
local json = require("json")
local threads = require("threads")
local writer = require("writer")
local locate = require("locate")
local types = require("types")

local creations=require("creations")
local M = {}

local ID_NAMESPACE = "kickside.pim.create.v1"
local ICON = "tabler:packages"

local trim = locate.trim

local invalid = failure.invalid

local function uuid_from_digest(digest: string): string
    local hex = digest:gsub("[^a-fA-F0-9]", ""):lower():sub(1, 32)
    hex = hex:sub(1, 12) .. "5" .. hex:sub(14, 16) .. "8" .. hex:sub(18)
    return table.concat({ hex:sub(1, 8), hex:sub(9, 12), hex:sub(13, 16), hex:sub(17, 20), hex:sub(21, 32) }, "-")
end

-- catalog_id derives the caller's catalog id for an idempotency key.
function M.catalog_id(key: string): (string?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({ details = { code = "authentication_required" }, kind = errors.PERMISSION_DENIED, message = "authentication required" }) end
    local digest, err = hash.sha256(ID_NAMESPACE .. "\0" .. actor:id() .. "\0" .. key)
    if err then return nil, errors.wrap(err, "catalog id hash failed") end
    if not digest then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "catalog id hash returned nothing" }) end
    return uuid_from_digest(tostring(digest)), nil
end

local function existing(catalog_id: string, title: string, parent_id: string): (boolean?, error?)
    local rows, err = component.query({ component_ids = { catalog_id }, include = { meta = true, placement = true }, limit = 1 })
    if err then return nil, errors.wrap(err, "catalog idempotency lookup failed") end
    local first: unknown = type(rows) == "table" and (rows :: { unknown })[1] or nil
    if first == nil then return false, nil end
    if type(first) ~= "table" then return nil, failure.corrupt("catalog component row is malformed") end
    local context,cerr=component.get_private_context(catalog_id)
    if cerr then return nil,cerr end
    context=context or {}
    local proven,perr=creations.proves(catalog_id,catalog_id,{title=title,parent_id=parent_id},context.pim_creation)
    if perr then return nil,perr end
    if not proven then
        return nil, errors.new({kind=errors.CONFLICT,retryable=false,message="catalog id has no matching PIM creation provenance",details={code="idempotency_conflict"}})
    end
    return true, nil
end

function M.create(input: types.CreateRequest): (types.CreateResult?, error?)
    local key = trim(input.idempotency_key)
    if key == "" then return nil, invalid("idempotency_key is required") end
    if #key > 255 then return nil, invalid("idempotency_key must be at most 255 characters") end
    local title = trim(input.title)
    if title == "" then title = "Catalog" end
    local parent_id = trim(input.parent_id)
    local catalog_id, id_err = M.catalog_id(key)
    if not catalog_id then return nil, id_err end

    local found, ferr = existing(catalog_id, title, parent_id)
    if ferr then return nil, ferr end
    if not found then
        local service,oerr=component.get_service()
        if oerr or not service then return nil,oerr end
        local token,perr=creations.prepare(catalog_id,catalog_id,{title=title,parent_id=parent_id})
        if perr or not token then return nil,perr end
        local raw,rawerr=service:register({component_id=catalog_id,impl_id=consts.CATALOG_IMPL,
            parent_id=parent_id~="" and parent_id or nil,private_context={pim_creation=token},
            thread={thread_class=consts.THREAD_CLASS,attrs=json.encode({owner_principal={kind="user",id=(security.actor() :: security.Actor):id()},user_ids={(security.actor() :: security.Actor):id()}}),parent_id=parent_id~="" and parent_id or nil},
            meta={title=title,icon=ICON,type="thread",thread_class=consts.THREAD_CLASS}})
        local result=raw :: component_types.ServiceEnvelope?
        local cerr=rawerr :: error?
        if not cerr then cerr=envelope.error_of(result,"register") end
        local created=result~=nil and result.success==true and cerr==nil
        if not created then
            local winner, werr = existing(catalog_id, title, parent_id)
            if not winner then return nil, errors.wrap(cerr or werr or "missing", "catalog create failed") end
        end
    end

    local confirmed=creations.confirm(catalog_id)
    if confirmed then return nil,confirmed end

    local client,terr=threads.open()
    if terr or not client then return nil,terr end
    local terr=threads.ensure(client,{component_id=catalog_id,impl_id=consts.CATALOG_IMPL,thread_class=consts.THREAD_CLASS})
    if terr then return nil,terr end

    local generation: integer? = nil
    local declaration = input.declaration
    if declaration then
        local applied, serr = writer.apply_schema(catalog_id, { declaration = declaration, plugin_configs = input.plugin_configs,
            idempotency = { namespace = "create", key = catalog_id } })
        if serr then return nil, errors.wrap(serr, "initial schema failed") end
        if not applied then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "initial schema returned no result" }) end
        generation = applied.generation
    end
    return { catalog_id = catalog_id, title = title, generation = generation, replayed = found == true }, nil
end

return M
