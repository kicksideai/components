-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugins for PIM. A kickside.pim.plugin registry entry declares what a plugin
-- is: its settings namespace (app-level values), the schema of its per-catalog
-- config, its attachment component kind and an optional schema source.
-- Whether a catalog uses a plugin and with which config is the catalog's own
-- data; effective config is the catalog's keys over the app's.
--
-- A schema source is a template in the manifest or a kickside.pim:schema_provider
-- binding called as the caller when a catalog's admin names the plugin. The
-- catalog stores what it resolved; nothing reads the source again until the
-- admin names the plugin again, so the registry and the provider's own store only
-- declare, and every catalog's schema stays its own data. Manifests and app
-- values are read here only.
local contract = require("contract")
local hash = require("hash")
local registry = require("registry")
local worker = require("worker")
local security = require("security")
local failure = require("failure")
local shape = require("shape")
local values = require("values")
local defaults = require("defaults")
local types = require("types")

local M = {}

M.TYPE = "kickside.pim.plugin"
M.PROVIDER = "kickside.pim:schema_provider"
M.INTERFACE_VERSION = 1

type Provider = { resolve: (self: Provider, request: types.ProviderRequest) -> (unknown, error?) }

local function invalid_projection(plugin: string, message: string): error
    return errors.new({ kind = errors.INVALID, retryable = false, message = message, details = { code = "plugin_projection_invalid", plugin = plugin, field = "projections" } })
end

local function projection_declarations(plugin: string, raw: unknown): ({ types.PluginProjection }?, error?)
    if raw == nil then return {}, nil end
    if type(raw) ~= "table" then return nil, invalid_projection(plugin, "projections must be a list") end
    local out: { types.PluginProjection } = {}
    local kinds: { [string]: boolean } = {}
    for key, value in pairs(raw :: { [unknown]: unknown }) do
        if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #(raw :: { unknown }) or type(value) ~= "table" then
            return nil, invalid_projection(plugin, "projections must be a list of declarations")
        end
    end
    for _, value in ipairs(raw :: { unknown }) do
        local p = value :: { [string]: unknown }
        if type(p.kind) ~= "string" or p.kind == "" or kinds[p.kind :: string] then
            return nil, invalid_projection(plugin, "projection kinds must be nonempty and distinct")
        end
        if p.input ~= "state" and p.input ~= "events" then return nil, invalid_projection(plugin, "projection input must be state or events") end
        local revision = 1
        if p.revision ~= nil then
            local explicit = type(p.revision) == "number" and math.tointeger(p.revision) or nil
            if not explicit or explicit < 1 then return nil, invalid_projection(plugin, "projection revision must be a positive integer") end
            revision = explicit
        end
        local ref = p.worker_ref
        local id = type(ref) == "string" and (ref :: string):match("^func://(.+)$") or nil
        if not id then return nil, invalid_projection(plugin, "plugin workers require a func:// reference") end
        local entry, err = registry.get(id)
        if err and err:kind() ~= errors.NOT_FOUND then return nil, errors.wrap(err, "plugin worker lookup") end
        if not entry then return nil, invalid_projection(plugin, "plugin projection worker is missing") end
        if not entry.meta or entry.meta.type ~= "projection.worker" then
            return nil, invalid_projection(plugin, "plugin worker must declare projection.worker")
        end
        local declaration = entry :: {meta: {private: boolean?}?, security: types.JsonObject?, data: {security: types.JsonObject?}?}
        local configured = declaration.security or (declaration.data and declaration.data.security)
        if (declaration.meta and declaration.meta.private) or (configured and next(configured) ~= nil) then
            return nil, invalid_projection(plugin, "plugin projection worker declares a private security frame")
        end
        local binding, perr = worker.parse(ref :: string, true)
        if perr or not binding then return nil, perr end
        local _, verr = worker.validate(binding, false)
        if verr then return nil, errors.wrap(verr, "plugin projection worker") end
        if p.input == "state" and p.events ~= nil then return nil, invalid_projection(plugin, "state input declares no event filter") end
        if p.input == "events" and type(p.events) ~= "table" then return nil, invalid_projection(plugin, "projection events must be a list") end
        local events: { string } = {}
        for key, event in pairs((p.events or {}) :: { [unknown]: unknown }) do
            if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #(p.events :: { unknown }) or type(event) ~= "string" or event == "" then
                return nil, invalid_projection(plugin, "projection events must be a list of event types")
            end
        end
        for _, event in ipairs((p.events or {}) :: { string }) do events[#events + 1] = event end
        kinds[p.kind :: string] = true
        out[#out + 1] = { kind = p.kind :: string, worker_ref = ref :: string, input = p.input :: string, revision = revision, events = events }
    end
    return out, nil
end

-- The tools catalog owns descriptor resolution; MCP scope metadata is checked at
-- this boundary because the current normalized descriptor omits those scopes.
function M.tool(id: string): ({id: string,required_scopes: {string}}?,error?)
    local function invalid_tool(): error
        return errors.new({kind=errors.INVALID,retryable=false,message="plugin tool descriptor is incomplete",details={code="plugin_tool_invalid",tool=id}})
    end
    local definition,derr=contract.get("kickside.agents:tools")
    if derr or not definition then return nil,derr or invalid_tool() end
    local service,oerr=definition:with_actor(security.actor()):with_scope(security.scope()):open()
    if oerr or not service then return nil,oerr or invalid_tool() end
    local descriptor,ferr=service:find({id=id})
    if ferr then
        if ferr:kind()==errors.INVALID or ferr:kind()==errors.NOT_FOUND then return nil,invalid_tool() end
        return nil,ferr :: error
    end
    if type(descriptor)~="table" or descriptor.id~=id or type(descriptor.input_schema)~="table" then return nil,invalid_tool() end
    local entry,rerr=registry.get(id)
    if rerr then return nil,rerr end
    local meta=entry and entry.meta
    local mcp=meta and meta.mcp
    if type(mcp)~="table" or shape.array_length(mcp.required_scopes)==nil then return nil,invalid_tool() end
    local scopes: {string}={}
    for _,scope in ipairs(mcp.required_scopes :: {unknown}) do
        if type(scope)~="string" or scope=="" then return nil,invalid_tool() end
        scopes[#scopes+1]=scope
    end
    return {id=id,required_scopes=scopes},nil
end

-- Declared tool ids resolve at the same boundary as every plugin field.
local function tool_declarations(plugin: string, raw: unknown): ({ string }?, error?)
    if raw == nil then return {}, nil end
    local function invalid_tool(): error
        return errors.new({ kind = errors.INVALID, retryable = false, message = "plugin tools must name registered tool entries", details = { code = "plugin_tool_invalid", plugin = plugin } })
    end
    if shape.array_length(raw)==nil then return nil,invalid_tool() end
    local list = raw :: { unknown }
    local out: { string } = {}
    for key, id in pairs(raw :: { [unknown]: unknown }) do
        if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #list or type(id) ~= "string" then return nil, invalid_tool() end
        local tool,err=M.tool(id :: string)
        if err or not tool then return nil,err or invalid_tool() end
    end
    for _, id in ipairs(list) do out[#out + 1] = id :: string end
    return out, nil
end

local EMPTY_SCHEMA: types.JsonObject = { type = "object", additionalProperties = false }

local function invalid(message: string, details: types.JsonObject?): error
    local fields = details or {}
    fields.code = fields.code or "plugin_invalid"
    return failure.invalid(message, fields)
end

-- secret follows schema-bearing keywords and local references once per node.
local function secret(schema: unknown, path: string, root: types.JsonObject, seen: { [unknown]: boolean }): string?
    if type(schema) ~= "table" or seen[schema] then return nil end
    seen[schema] = true
    local s = schema :: types.JsonObject
    if s.format == "password" or s.writeOnly == true then return path end
    local ref = s["$ref"]
    if type(ref) == "string" and (ref :: string):sub(1, 1) == "#" then
        local pointer = (ref :: string):sub(2):gsub("%%(%x%x)", function(hex: string): string
            return string.char(tonumber(hex, 16) :: integer)
        end)
        local target: unknown = root
        if pointer:sub(1, 1) == "/" then
            for part in (pointer:sub(2) .. "/"):gmatch("([^/]*)/") do
                local key = part:gsub("~1", "/"):gsub("~0", "~")
                if type(target) == "table" then
                    local container = target :: { [unknown]: unknown }
                    local index = key:match("^%d+$") and tonumber(key) or nil
                    if type(next(container)) == "number" and index then target = container[index + 1]
                    else target = container[key] end
                else target = nil end
            end
        elseif pointer ~= "" then target = nil end
        local found = secret(target, path .. " -> " .. (ref :: string), root, seen)
        if found then return found end
    end
    for _, keyword in ipairs({ "properties", "patternProperties", "$defs", "definitions", "dependentSchemas", "dependencies" }) do
        if type(s[keyword]) == "table" then
            local entries = s[keyword] :: types.JsonObject
            local names: { string } = {}
            for name in pairs(entries) do names[#names + 1] = name end
            table.sort(names)
            for _, name in ipairs(names) do
                local found = secret(entries[name], path .. "." .. name, root, seen)
                if found then return found end
            end
        end
    end
    for _, keyword in ipairs({ "allOf", "anyOf", "oneOf", "prefixItems" }) do
        if type(s[keyword]) == "table" then
            for i, item in ipairs(s[keyword] :: { unknown }) do
                local found = secret(item, path .. "." .. keyword .. "[" .. i .. "]", root, seen)
                if found then return found end
            end
        end
    end
    for _, keyword in ipairs({ "items", "additionalItems", "additionalProperties", "unevaluatedProperties", "unevaluatedItems", "contains", "propertyNames", "contentSchema", "not", "if", "then", "else" }) do
        local found = secret(s[keyword], path .. "." .. keyword, root, seen)
        if found then return found end
        if keyword == "items" and type(s.items) == "table" then
            for i, item in ipairs(s.items :: { unknown }) do
                local nested = secret(item, path .. "[" .. i .. "]", root, seen)
                if nested then return nested end
            end
        end
    end
    return nil
end

local function identities(id: string, field: string, raw: unknown): ({ string }?, error?)
    if raw == nil then return {}, nil end
    local function malformed(): error
        return invalid(id .. " " .. field .. " must be a list of distinct nonempty ids", { field = field })
    end
    if type(raw) ~= "table" then return nil, malformed() end
    local list = raw :: { unknown }
    local seen: { [string]: boolean } = {}
    for key, value in pairs(raw :: { [unknown]: unknown }) do
        if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #list or type(value) ~= "string" or value == "" then
            return nil, malformed()
        end
        if seen[value :: string] then return nil, malformed() end
        seen[value :: string] = true
    end
    return list :: { string }, nil
end

-- schema_source reads the manifest's schema source: exactly one of template
-- (an object) or provider (a binding id).
local function schema_source(id: string, raw: unknown): (types.PluginSchemaSource?, error?)
    if raw == nil then return nil, nil end
    if type(raw) ~= "table" then return nil, invalid(id .. " schema must name a template or a provider") end
    local s = raw :: { [string]: unknown }
    local template, provider = s.template, s.provider
    if (template ~= nil) == (provider ~= nil) then return nil, invalid(id .. " schema names exactly one of template or provider") end
    if template ~= nil and type(template) ~= "table" then return nil, invalid(id .. " schema template must be an object") end
    if provider ~= nil and (type(provider) ~= "string" or provider == "") then return nil, invalid(id .. " schema provider must be a binding id") end
    return { template = template :: types.JsonObject?, provider = provider :: string? }, nil
end

-- load reads the manifest id.
function M.load(id: string): (types.Plugin?, error?)
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, errors.wrap(err, "plugin lookup " .. id) end
    if not entry then return nil, invalid("unknown plugin " .. id, { code = "unknown_plugin", entry = id }) end
    local meta = entry.meta
    if type(meta) ~= "table" then return nil, invalid(id .. " is not a plugin") end
    local m = meta :: { [string]: unknown }
    if m.type ~= M.TYPE then return nil, invalid(id .. " is not a plugin") end
    if m.interface_version ~= nil and m.interface_version ~= M.INTERFACE_VERSION then
        return nil, invalid(id .. " requires an unsupported plugin interface version",
            { code = "plugin_interface_version_unsupported", plugin = id })
    end
    if type(m.attachment) ~= "string" or m.attachment == "" then
        return nil, invalid(id .. " attachment must name a component binding", { field = "attachment" })
    end
    local requires, rerr = identities(id, "requires", m.requires)
    if rerr then return nil, rerr end
    local seams, serr = identities(id, "seams", m.seams)
    if serr then return nil, serr end
    local schema: types.JsonObject = EMPTY_SCHEMA
    if m.config_schema ~= nil then
        if type(m.config_schema) ~= "table" or (m.config_schema :: { [string]: unknown }).type ~= "object" then
            return nil, invalid(id .. " config_schema must describe an object")
        end
        schema = m.config_schema :: types.JsonObject
        local leak = secret(schema, "config", schema, {})
        if leak then return nil, invalid(id .. " declares secret " .. leak .. "; secrets belong in its attachment or a connection", { field = "config_schema" }) end
    end
    for _, field in ipairs({ "title", "settings" }) do
        if m[field] ~= nil and type(m[field]) ~= "string" then return nil, invalid(id .. " " .. field .. " must be a string") end
    end
    local tools, tool_err = tool_declarations(id, m.tools)
    if tool_err then return nil, tool_err end
    local source, serr = schema_source(id, m.schema)
    if serr then return nil, serr end
    local projections: { types.PluginProjection } = {}
    if m.projections ~= nil then
        local declared, perr = projection_declarations(id, m.projections)
        if perr then return nil, perr end
        projections = declared :: { types.PluginProjection }
    end
    return { id = id, interface_version = M.INTERFACE_VERSION,
        title = m.title :: string?, description = m.description :: string?, icon = m.icon :: string?, settings = m.settings :: string?,
        attachment = m.attachment :: string, requires = requires, seams = seams, config_schema = schema, schema = source, projections = projections, tools = tools }, nil
end

local function manifests(): ({ registry.Entry }?, error?)
    local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = M.TYPE })
    if err then return nil, errors.wrap(err, "plugin lookup failed") end
    local sorted = entries or {}
    table.sort(sorted, function(a: registry.Entry, b: registry.Entry): boolean return tostring(a.id) < tostring(b.id) end)
    return sorted, nil
end

-- find lists the ids of the installed manifests.
function M.find(): ({ string }?, error?)
    local entries, err = manifests()
    if err or not entries then return nil, err end
    local ids: { string } = {}
    for _, entry in ipairs(entries) do ids[#ids + 1] = tostring(entry.id) end
    return ids, nil
end

type ProjectionStates = (types.Plugin, types.PluginIntent?) -> ({ [string]: types.PluginProjectionState }?, error?)

-- list reports installed and active plugins whose metadata the caller can read.
function M.list(states: { [string]: types.PluginIntent }?, membership: { [string]: types.PluginEntry }?,
    projections: ProjectionStates?): ({ types.PluginOption }?, error?)
    local ids, err = M.find()
    if err or not ids then return nil, err end
    local installed: { [string]: boolean } = {}
    for _, id in ipairs(ids) do installed[id] = true end
    for id in pairs(membership or {}) do if not installed[id] then ids[#ids + 1] = id end end
    table.sort(ids)
    local out: { types.PluginOption } = {}
    for _, id in ipairs(ids) do
        local p, lerr = M.load(id)
        if not lerr or lerr:kind() ~= errors.PERMISSION_DENIED then
            if lerr and lerr:kind() ~= errors.INVALID then return nil, lerr end
            local state = states and states[id]
            local active = membership ~= nil and membership[id] ~= nil
            if p and state and active then
                local _, cerr = M.merged(p, {}, state.config)
                if cerr then lerr = cerr end
            end
            local entry: types.PluginOption = { plugin = id, installed = installed[id] == true, active = active,
                requires = {}, tools = {}, lifecycle = active and { state = "pending" } or { state = "ready" }, projections = {}, config_schema = {} }
            if state and active then
                entry.attachment_id, entry.config, entry.lifecycle = state.attachment_id, state.config, state.lifecycle
            end
            if p then
                entry.interface_version = p.interface_version
                entry.title, entry.description, entry.icon = p.title, p.description, p.icon
                entry.requires, entry.tools, entry.config_schema = p.requires or {}, p.tools or {}, p.config_schema
            end
            if lerr then
                local details = lerr:details()
                entry.problem = { code = details.code :: string, message = tostring(lerr), field = details.field :: string? }
                if active then entry.lifecycle = { state = "failed", error = { kind = lerr:kind(), code = details.code :: string?, message = tostring(lerr) } } end
            end
            if projections and p and active and not lerr then
                local live, perr = projections(p, state)
                if perr then return nil, perr end
                entry.projections = live or {}
            end
            out[#out + 1] = entry
        end
    end
    return out, nil
end

-- check validates the installed declaration independently of configuration.
function M.check(id: string, _config: types.JsonObject): error?
    local _, err = M.load(id)
    return err
end

-- merged validates owner values over deployment configuration defaults.
function M.merged(p: types.Plugin, app: types.JsonObject, own: types.JsonObject?): (types.JsonObject?, error?)
    local config: types.JsonObject = {}
    for k, v in pairs(app) do config[k] = v end
    for k, v in pairs(own or {}) do config[k] = v end
    local err = shape.check(shape.tolerant(p.config_schema), config, p.id .. " config")
    if err then return nil, errors.new({ kind = errors.INVALID, retryable = false, message = tostring(err),
        details = { code = "plugin_config_invalid", plugin = p.id, field = "config" } }) end
    return config, nil
end

function M.effective(plugin: types.Plugin, own: types.JsonObject?): (types.JsonObject?, error?)
    local app: types.JsonObject = {}
    if plugin.settings then
        local read, err = defaults.namespace(plugin.settings :: string)
        if err or not read then return nil, err end
        app = read
    end
    return M.merged(plugin, app, own)
end

-- admit checks dependencies and ownership after compilation resolves type metadata.
function M.admit(compiled: types.Compiled, previous: types.Compiled?): error?
    local active = compiled.plugins
    local was = previous and previous.plugins or {}
    local owners: { [string]: string } = {}
    local conflicts: { [string]: string } = {}
    local installed, err = manifests()
    if err or not installed then return err end
    for _, entry in ipairs(installed) do
        local id = tostring(entry.id)
        local meta = entry.meta :: types.JsonObject
        -- Compilation has already checked active manifests. Ownership of a
        -- seam is declared independently of the worker, provider and tools.
        if meta.interface_version == nil or meta.interface_version == M.INTERFACE_VERSION then
            local seams, serr = identities(id, "seams", meta.seams)
            if serr and active[id] then return serr end
            for _, seam in ipairs(seams or {}) do
                if owners[seam] then conflicts[seam] = conflicts[seam] or id
                else owners[seam] = id end
            end
            if active[id] then
                local requires, rerr = identities(id, "requires", meta.requires)
                if rerr then return rerr end
                for _, required in ipairs(requires or {}) do
                    if not active[required] then return invalid("required plugin is inactive", { code = "plugin_required", plugin = id, required = required }) end
                end
            end
        end
    end
    local function seam(id: string): error?
        local owner = owners[id]
        if conflicts[id] then
            return invalid("schema names a seam claimed by multiple plugins",
                { code = "plugin_seam_conflict", seam = id, plugin = owner, conflicting_plugin = conflicts[id] })
        end
        if owner and not active[owner] then
            return invalid("schema names an inactive plugin's seam", { code = was[owner] and "plugin_seam_in_use" or "plugin_seam_unowned", plugin = owner, seam = id })
        end
        return nil
    end
    local function target(config: types.AttributeConfig): error?
        if config.target then
            local err = seam(config.target)
            if err then return err end
        end
        for _, member in pairs(config.members or {}) do
            local err = target(member)
            if err then return err end
        end
        return nil
    end
    for _, attribute in pairs(compiled.attributes) do
        local err = seam(attribute.type) or target(attribute.config)
        if err then return err end
    end
    for scope in pairs(compiled.scopes) do
        local err = seam(scope)
        if err then return err end
    end
    for _, family in pairs(compiled.families) do
        for _, check in ipairs(family.checks) do
            local err = seam(check.fn)
            if err then return err end
        end
    end
    return nil
end

local function digest(fragment: types.JsonObject): string
    return (tostring(hash.sha256(values.canonical(fragment))):gsub("[^a-fA-F0-9]", ""):lower())
end

-- resolve_schema answers the plugin's schema for one catalog: a template as it
-- stands, or what the provider binding answers for the context, called as the
-- caller. A plugin without a schema source resolves to nothing.
function M.resolve_schema(p: types.Plugin, ctx: types.ResolveContext): (types.PluginSchema?, error?)
    local source = p.schema
    if not source then return nil, nil end
    if source.template then
        local fragment = source.template :: types.JsonObject
        return { fragment = fragment, digest = digest(fragment) }, nil
    end
    local binding = source.provider :: string
    local def, err = contract.get(M.PROVIDER)
    if err then return nil, errors.wrap(err, "schema provider contract unavailable") end
    if not def then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "schema provider contract unavailable", details = { code = "contract_unavailable" } }) end
    local instance, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open(binding)
    if oerr then return nil, errors.wrap(oerr, p.id .. " schema provider " .. binding .. " open failed") end
    if not instance then return nil, errors.new({ kind = errors.UNAVAILABLE, message = p.id .. " schema provider " .. binding .. " open returned no client", details = { code = "contract_unavailable" } }) end
    local provider = instance :: Provider
    local answer, rerr = provider:resolve({ catalog_id = ctx.catalog_id, plugin = p.id, config = ctx.config, current = ctx.current })
    if rerr then return nil, errors.wrap(rerr, p.id .. " schema provider") end
    if type(answer) ~= "table" or type((answer :: types.ProviderResult).fragment) ~= "table" then
        return nil, errors.new({ kind = errors.INTERNAL, message = p.id .. " schema provider answered without a fragment", details = { code = "internal" } })
    end
    local result = answer :: types.ProviderResult
    if result.version ~= nil and type(result.version) ~= "string" then
        return nil, errors.new({ kind = errors.INTERNAL, message = p.id .. " schema provider version must be a string", details = { code = "internal" } })
    end
    return { fragment = result.fragment, version = result.version, digest = digest(result.fragment) }, nil
end

-- resolve answers the schema a plugin contributes to catalog_id for the entry a
-- request names, as the caller: a template as it stands, or what the provider
-- answers for the effective config and the copy the catalog holds. A plugin
-- without a schema source contributes nothing.
function M.resolve(catalog_id: string, id: string, entry: types.PluginEntry, held: types.PluginEntry?, own: types.JsonObject?): (types.PluginSchema?, error?)
    local plugin, err = M.load(id)
    if err or not plugin then return nil, err end
    local source = plugin.schema
    if not source then return nil, nil end
    local config: types.JsonObject = {}
    if source.provider then
        local effective, eerr = M.effective(plugin, own)
        if eerr then return nil, errors.wrap(eerr, "plugin " .. id .. " effective config") end
        if not effective then return nil, errors.new({ kind = errors.INTERNAL, message = "plugin has no effective config", details = { code = "internal" } }) end
        config = effective
    end
    return M.resolve_schema(plugin, { catalog_id = catalog_id, config = config, current = held and held.schema or nil })
end

return M
