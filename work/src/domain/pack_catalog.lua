-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
local registry = require("registry")
local hash = require("hash")
local values = require("values")
local shape = require("shape")
local types = require("types")
local manifests = require("manifests")
local domain = require("domain")
local declaration = require("declaration")
local requests = require("requests")
local M = {}
local STRING: domain.JsonObject = { type = "string", minLength = 1 }
local function array(item: domain.JsonObject): domain.JsonObject return { type = "array", items = item } end
local function object(properties: domain.JsonObject, required: { string }): domain.JsonObject
    return { type = "object", properties = properties, required = required, additionalProperties = false }
end
local STATE = { type = "object", properties = { id = STRING, name = { type = "string" }, category = STRING }, required = { "id", "category" } }
local PROCESSES = shape.tolerant(array({ type = "object", properties = {
    id = STRING, initial = STRING, states = { type = "array", minItems = 1, items = STATE },
}, required = { "id", "initial", "states" } }))
local DATA = shape.tolerant(object({ additive = { type = "boolean" }, ui_app = STRING, schema = { type = "object" }, processes = array({ type = "object" }),
    views = array(object({ id = STRING, title = STRING, view = { type = "object" } }, { "id", "title", "view" })),
    automations = array(object({ id = STRING, type = STRING, input = { type = "object" } }, { "id", "type", "input" })),
    traits = array(STRING), requires = array(STRING), starter = object({ items = array({ type = "object" }), default = { type = "boolean" } }, { "items", "default" }),
}, { "schema", "views", "automations", "traits", "requires", "starter" }))
local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = "invalid_pack" } })
end
local function data_digest(data: unknown): (string?, error?)
    local digest, err = hash.sha256(values.canonical(data))
    if err then return nil, err end
    return tostring(digest), nil
end

local function processes_of(data: types.Data): { domain.ProcessDecl }?
    return data.processes or data.schema.processes
end

function M.declaration(data: types.Data): domain.Declaration
    local out = declaration.copy(data.schema)
    out.processes = declaration.copy(processes_of(data))
    out.policy = out.policy or {}
    out.scopes = out.scopes or {}
    out.plugins = out.plugins or {}
    local listed: { [string]: boolean } = {}
    for _, plugin in ipairs(out.plugins) do listed[plugin.use] = true end
    for _, id in ipairs(data.requires) do if not listed[id] then out.plugins[#out.plugins + 1] = { use = id } end end
    return out :: domain.Declaration
end

local function decode(entry: registry.Entry): (types.Pack?, error?)
    local meta = registry_values.canonical(entry.meta or {})
    if entry.kind ~= "registry.entry" or meta.type ~= "kickside.work.pack" then return nil, invalid("entry must declare kickside.work.pack") end
    for _, key in ipairs({ "title", "version", "icon", "description" }) do
        if type(meta[key]) ~= "string" or meta[key] == "" then return nil, invalid("pack metadata requires " .. key) end
    end
    local data = registry_values.canonical(entry.data)
    local err = shape.check(DATA, data, "pack data")
    if err then return nil, invalid(err:message()) end
    local data = data :: types.Data
    local effective = declaration.copy(data.schema)
    effective.processes = processes_of(data)
    local schema_err = declaration.check_shape(effective)
    if schema_err then
        if schema_err:kind() ~= errors.INVALID then return nil, schema_err end
        return nil, invalid(schema_err:message())
    end
    local processes = processes_of(data) or {}
    local process_err = shape.check(PROCESSES, processes, "pack processes")
    if process_err then return nil, invalid(process_err:message()) end
    local process_ids: { [string]: boolean } = {}
    for _, process in ipairs(processes) do
        if process_ids[process.id] then return nil, invalid("duplicate pack process id: " .. process.id) end
        process_ids[process.id] = true
    end
    for _, view in ipairs(data.views) do
        local view_err = requests.parse("create", { board_id = "$board", title = view.title, view = view.view }, "kickside.work:view")
        if view_err then
            if view_err:kind() ~= errors.INVALID then return nil, view_err end
            return nil, invalid("view " .. view.id .. ": " .. view_err:message())
        end
    end
    for _, section in ipairs({ data.views :: { { id: string } }, data.automations :: { { id: string } } }) do
        local seen: { [string]: boolean } = {}
        for _, item in ipairs(section) do
            if seen[item.id] then return nil, invalid("duplicate pack resource id: " .. item.id) end
            seen[item.id] = true
        end
    end
    local plugins: { types.Plugin } = {}
    local seen: { [string]: boolean } = {}
    for _, id in ipairs(data.requires) do
        if seen[id] or not id:match("^[^:]+:[^:]+$") then return nil, invalid("requires names unique exact plugin ids") end
        seen[id] = true
        local manifest, ierr = manifests.load(id)
        if ierr and ierr:kind() ~= errors.INVALID then return nil, ierr end
        plugins[#plugins + 1] = { plugin = id, installed = manifest ~= nil or (ierr and ierr:details().code ~= "unknown_plugin") == true,
            title = manifest and manifest.title, description = manifest and manifest.description, icon = manifest and manifest.icon,
            config_schema = manifest and manifest.config_schema,
            active = false, requires = manifest and manifest.requires or {}, tools = manifest and manifest.tools or {},
            lifecycle = ierr and { state = "failed", error = { kind = ierr:kind(), code = ierr:details().code, message = ierr:message() } } or { state = "ready" },
            projections = table.create(0, 1), problem = ierr and { code = ierr:details().code, message = ierr:message() } or nil }
    end
    local digest, herr = data_digest(data)
    if herr or not digest then return nil, herr end
    return { id = tostring(entry.id), title = meta.title :: string, version = meta.version :: string, icon = meta.icon :: string,
        description = meta.description :: string, digest = tostring(digest), requires = data.requires, plugins = plugins, data = data }, nil
end
function M.load(id: string, version: string?): (types.Pack?, error?)
    local entry, err = registry.get(id)
    if err then return nil, err end
    if not entry then return nil, errors.new({ kind = errors.NOT_FOUND, message = "pack is unavailable", details = { code = "pack_unavailable", pack = id } }) end
    local pack, perr = decode(entry)
    if perr or not pack then return nil, perr end
    if version ~= nil and version ~= pack.version then
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "requested pack version is unavailable", details = { code = "pack_version_unavailable", pack = id, version = version } })
    end
    return pack, nil
end
function M.list(): (types.Discovery?, error?)
    local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.work.pack" })
    if err then return nil, err end
    local packs: { types.Summary } = {}
    for _, entry in ipairs(entries or {}) do
        local pack, perr = decode(entry)
        if perr then
            if perr:kind() ~= errors.INVALID then return nil, perr end
            local meta = entry.meta or {}
            packs[#packs + 1] = { id = tostring(entry.id), title = type(meta.title) == "string" and meta.title or nil,
                version = type(meta.version) == "string" and meta.version or nil,
                icon = type(meta.icon) == "string" and meta.icon or nil, description = type(meta.description) == "string" and meta.description or nil,
                problem = { code = "invalid_pack", message = perr:message() } }
        elseif pack then
            packs[#packs + 1] = { id = pack.id, title = pack.title, version = pack.version, icon = pack.icon,
                description = pack.description, digest = pack.digest, requires = pack.requires, plugins = pack.plugins }
        end
    end
    table.sort(packs, function(a: types.Summary, b: types.Summary): boolean return a.id < b.id end)
    return { packs = packs }, nil
end
function M.revision(id: string): ({ version: string, digest: string }?, error?)
    local entry, err = registry.get(id)
    if err then
        if err:kind() == errors.NOT_FOUND then return nil, nil end
        return nil, err
    end
    if not entry then return nil, nil end
    if entry.kind ~= "registry.entry" or (entry.meta or {}).type ~= "kickside.work.pack" then return nil, nil end
    local digest, derr = data_digest(registry_values.canonical(entry.data))
    if derr then return nil, derr end
    return { version = (entry.meta or {}).version :: string, digest = digest }, nil
end
function M.outdated(id: string, version: string, stored_digest: string): (boolean?, error?)
    local current, err = M.revision(id)
    if err then return nil, err end
    return not current or current.version ~= version or current.digest ~= stored_digest, nil
end
return M
