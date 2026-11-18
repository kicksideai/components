-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The catalog creation authority. A request owns one actor-scoped,
-- deterministic component id. Only a fully validated declaration can reach
-- registration, and only the registration winner can commit it.
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
local store = require("store")
local types = require("types")
local values = require("values")

local creations=require("creations")
local M = {}

local ID_NAMESPACE = "kickside.pim.create.v1"
local ICON = "tabler:packages"

local trim = require("trim_text").trim

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

local function existing(catalog_id: string, request: types.JsonObject): (boolean?, error?)
    local rows, err = component.query({ component_ids = { catalog_id }, limit = 1 })
    if err then return nil, errors.wrap(err, "catalog idempotency lookup failed") end
    local first: unknown = type(rows) == "table" and (rows :: { unknown })[1] or nil
    if first == nil then return false, nil end
    if type(first) ~= "table" then return nil, failure.corrupt("catalog component row is malformed") end
    local context,cerr=component.get_private_context(catalog_id)
    if cerr then return nil,cerr end
    context=context or {}
    local proven,perr=creations.proves(catalog_id,catalog_id,request,context.pim_creation)
    if perr then return nil,perr end
    if not proven then
        return nil, errors.new({kind=errors.CONFLICT,retryable=false,message="catalog id has no matching PIM creation provenance",details={code="idempotency_conflict"}})
    end
    return store.with_db(function(db: types.Executor): (boolean?, error?)
        local rows, err = db:query("SELECT catalog_id FROM kickside_pim_catalog WHERE catalog_id=$1", { catalog_id })
        if err then return nil, err end
        if not rows or not rows[1] then return nil, failure.catalog_not_initialized() end
        return true, nil
    end)
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

    local schema_request: types.SchemaRequest = { declaration = input.declaration or {}, plugin_configs = input.plugin_configs }
    local digest, herr = hash.sha256(values.canonical(schema_request))
    if herr or not digest then return nil, herr or failure.corrupt("initial schema request hash is missing") end
    local request: types.JsonObject = { title = title, parent_id = parent_id, schema_hash = tostring(digest) }
    local found, ferr = existing(catalog_id, request)
    if ferr then return nil, ferr end
    if found then return { catalog_id = catalog_id, title = title, generation = 1, replayed = true }, nil end

    local plan, serr = writer.prepare_initial_schema(catalog_id, schema_request)
    if serr or not plan then return nil, serr end

    local service,oerr=component.get_service()
    if oerr or not service then return nil,oerr end
    local token,perr=creations.prepare(catalog_id,catalog_id,request)
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
        local winner, werr = existing(catalog_id, request)
        if werr then return nil, werr end
        if not winner then return nil, errors.wrap(cerr or "missing", "catalog create failed") end
        return { catalog_id = catalog_id, title = title, generation = 1, replayed = true }, nil
    end

    local confirmed=creations.confirm(catalog_id)
    if confirmed then return nil,confirmed end

    local client,terr=threads.open()
    if terr or not client then return nil,terr end
    local terr=threads.ensure(client,{component_id=catalog_id,impl_id=consts.CATALOG_IMPL,thread_class=consts.THREAD_CLASS})
    if terr then return nil,terr end

    local commit_err = writer.commit_initial_schema(client, catalog_id, plan)
    if commit_err then return nil, errors.wrap(commit_err, "initial schema failed") end
    return { catalog_id = catalog_id, title = title, generation = 1, replayed = false }, nil
end

return M
