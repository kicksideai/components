-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
local funcs = require("funcs")
-- Plugin declarations define admission, effective configuration and declared seams.
local contract = require("contract")
local hash = require("hash")
local registry = require("registry")
local worker = require("worker")
local security = require("security")
local shape = require("shape")
local types = require("types")
local values = require("values")

local M = {}

M.TYPE = "kickside.work.plugin"
M.PROVIDER = "kickside.work:schema_provider"

local EMPTY_SCHEMA: types.JsonObject = { type = "object", additionalProperties = false }

local function invalid(message: string): error
    return errors.new({ details = { code = "plugin_invalid" }, kind = errors.INVALID, message = message })
end

-- Schema inspection follows local references and every JSON Schema container.
local function secret(schema: unknown, path: string): (string?, error?)
    local seen: { [table]: boolean } = {}
    local remaining = 4096
    local function visit(raw: unknown, at: string, depth: integer): (string?, error?)
        if type(raw) ~= "table" then return nil, nil end
        if seen[raw :: table] then return nil, nil end
        remaining = remaining - 1
        if depth > 32 or remaining < 0 then return nil, invalid("plugin schema exceeds its inspection bound") end
        seen[raw :: table] = true
        local node = raw :: { [string]: unknown }
        if node.format == "password" or node.writeOnly == true then return at, nil end
        if node["$ref"] ~= nil then
            local ref = node["$ref"]
            if type(ref) ~= "string" or ref:sub(1, 2) ~= "#/" then return nil, invalid("plugin schema references must resolve locally") end
            local resolved: unknown = schema
            for part in (ref :: string):sub(3):gmatch("[^/]+") do
                local key = part:gsub("~1", "/"):gsub("~0", "~")
                if type(resolved) ~= "table" then return nil, invalid("plugin schema reference is unresolved") end
                resolved = (resolved :: { [string]: unknown })[key]
            end
            if resolved == nil then return nil, invalid("plugin schema reference is unresolved") end
            local found, err = visit(resolved, at, depth + 1)
            if found or err then return found, err end
        end
        local properties = node.properties
        if type(properties) == "table" then
            for key, value in pairs(properties :: { [string]: unknown }) do
                local found, err = visit(value, at .. "." .. key, depth + 1)
                if found or err then return found, err end
            end
        end
        for _, key in ipairs({ "items", "additionalProperties", "anyOf", "oneOf", "allOf", "$defs", "definitions", "patternProperties", "prefixItems", "contains", "not", "if", "then", "else", "dependentSchemas", "unevaluatedProperties", "unevaluatedItems" }) do
            local child = node[key]
            if type(child) == "table" then
                if key == "anyOf" or key == "oneOf" or key == "allOf" or key == "prefixItems" or key == "$defs" or key == "definitions" or key == "patternProperties" or key == "dependentSchemas" then
                    for _, value in pairs(child :: { [unknown]: unknown }) do
                        local found, err = visit(value, at .. "." .. key, depth + 1)
                        if found or err then return found, err end
                    end
                else
                    local found, err = visit(child, at .. "[]", depth + 1)
                    if found or err then return found, err end
                end
            end
        end
        return nil, nil
    end
    return visit(schema, path, 1)
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

local function invalid_projection(code: string, plugin: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code, plugin = plugin } })
end

local function projections(plugin: string, raw: unknown): ({ types.PluginProjection }?, error?)
    if raw == nil then return {}, nil end
    if type(raw) ~= "table" then return nil, invalid_projection("plugin_projection_invalid", plugin, "projections must be a list") end
    local out: { types.PluginProjection } = {}
    local kinds: { [string]: boolean } = {}
    for key, value in pairs(raw :: { [unknown]: unknown }) do
        if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #(raw :: { unknown }) or type(value) ~= "table" then
            return nil, invalid_projection("plugin_projection_invalid", plugin, "projections must be a list of declarations")
        end
    end
    for _, value in ipairs(raw :: { unknown }) do
        local p = value :: { [string]: unknown }
        if type(p.kind) ~= "string" or p.kind == "" or kinds[p.kind :: string] then
            return nil, invalid_projection("plugin_projection_invalid", plugin, "projection kinds must be nonempty and distinct")
        end
        if p.input ~= "state" and p.input ~= "events" then
            return nil, invalid_projection("plugin_projection_invalid", plugin, "plugin projection input is state or events")
        end
        local revision = p.revision
        if revision == nil then revision = 1 end
        if type(revision) ~= "number" or revision % 1 ~= 0 or revision < 1 then
            return nil, invalid_projection("plugin_projection_invalid", plugin, "projection revision is a positive integer")
        end
        if p.input == "state" and p.events ~= nil then
            return nil, invalid_projection("plugin_projection_invalid", plugin, "state projections take no event filter")
        end
        local ref = p.worker_ref
        local id = type(ref) == "string" and (ref :: string):match("^func://(.+)$") or nil
        if not id then return nil, invalid_projection("plugin_projection_invalid", plugin, "plugin workers require a func:// reference") end
        local entry, err = registry.get(id)
        if err and err:kind() ~= errors.NOT_FOUND then return nil, errors.wrap(err, "plugin worker lookup") end
        if not entry then return nil, invalid_projection("plugin_projection_invalid", plugin, "plugin projection worker is missing") end
        if not entry.meta or entry.meta.type ~= "projection.worker" then
            return nil, invalid_projection("plugin_projection_invalid", plugin, "plugin worker must declare projection.worker")
        end
        local binding, perr = worker.parse(ref :: string, true)
        if perr or not binding then return nil, invalid_projection("plugin_projection_invalid", plugin, "plugin worker reference is invalid") end
        local _, verr = worker.validate(binding, false)
        if verr then
            if verr:kind() ~= errors.INVALID then return nil, verr end
            return nil, invalid_projection("plugin_projection_invalid", plugin, "plugin projection worker declaration is invalid")
        end
        if p.input == "events" and type(p.events) ~= "table" then return nil, invalid_projection("plugin_projection_invalid", plugin, "projection events must be a list") end
        local events: { string } = {}
        for key, event in pairs((p.events or {}) :: { [unknown]: unknown }) do
            if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #(p.events :: { unknown }) or type(event) ~= "string" or event == "" then
                return nil, invalid_projection("plugin_projection_invalid", plugin, "projection events must be a list of event types")
            end
        end
        for _, event in ipairs((p.events or {}) :: { string }) do events[#events + 1] = event end
        kinds[p.kind :: string] = true
        out[#out + 1] = { kind = p.kind :: string, worker_ref = ref :: string, input = p.input :: string, revision = math.tointeger(revision) :: integer, events = events }
    end
    return out, nil
end

local function tools(plugin: string, raw: unknown): ({ string }?, error?)
    local function invalid_tool(): error
        return errors.new({ kind = errors.INVALID, message = "plugin tools must name registered tools", details = { code = "plugin_tool_invalid", plugin = plugin } })
    end
    if raw == nil then return {}, nil end
    if type(raw) ~= "table" then return nil, invalid_tool() end
    local out: { string } = {}
    for key, id in pairs(raw :: { [unknown]: unknown }) do
        if type(key) ~= "number" or key % 1 ~= 0 or key < 1 or key > #(raw :: { unknown }) or type(id) ~= "string" or id == "" then
            return nil, invalid_tool()
        end
    end
    for _, id in ipairs(raw :: { string }) do
        local _, err = funcs.call("kickside.work.domain:validate_tool", { plugin = plugin, tool = id })
        if err then return nil, err end
        out[#out + 1] = id
    end
    return out, nil
end

-- load reads the manifest id.
function M.load(id: string): (types.Plugin?, error?)
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, err end
    if not entry or entry.kind ~= "registry.entry" or (entry.meta or {}).type ~= M.TYPE then
        return nil, errors.new({ kind = errors.INVALID, message = "unknown plugin " .. id, details = { code = "unknown_plugin", plugin = id } })
    end
    local meta = registry_values.canonical(entry.meta)
    if type(meta) ~= "table" then return nil, invalid(id .. " is not a plugin") end
    local m = meta :: { [string]: unknown }
    if m.type ~= M.TYPE then return nil, invalid(id .. " is not a plugin") end
    local schema: types.JsonObject = EMPTY_SCHEMA
    if m.config_schema ~= nil then
        if type(m.config_schema) ~= "table" or (m.config_schema :: { [string]: unknown }).type ~= "object" then
            return nil, invalid(id .. " config_schema must describe an object")
        end
        schema = m.config_schema :: types.JsonObject
        local leak, inspection_err = secret(schema, "config")
        if inspection_err then return nil, inspection_err end
        if leak then return nil, invalid(id .. " declares secret " .. leak .. "; secrets belong in its attachment or a connection") end
    end
    for _, field in ipairs({ "title", "description", "icon", "settings", "attachment" }) do
        if m[field] ~= nil and type(m[field]) ~= "string" then return nil, invalid(id .. " " .. field .. " must be a string") end
    end
    if type(m.attachment) ~= "string" or m.attachment == "" then return nil, invalid(id .. " attachment is required") end
    local attachment, aerr = registry.get(m.attachment :: string)
    if aerr and aerr:kind() ~= errors.NOT_FOUND then return nil, aerr end
    if not attachment or attachment.kind ~= "contract.binding" then return nil, invalid(id .. " attachment must name a component binding") end
    local lists: { [string]: { string } } = { requires = {}, seams = {} }
    for key, list in pairs(lists) do
        if m[key] ~= nil and type(m[key]) ~= "table" then return nil, invalid(id .. " " .. key .. " is a list of ids") end
        for index in pairs((m[key] or {}) :: { [unknown]: unknown }) do
            if type(index) ~= "number" or index % 1 ~= 0 or index < 1 or index > #(m[key] :: { unknown }) then
                return nil, invalid(id .. " " .. key .. " is a list of ids")
            end
        end
        for _, value in ipairs((m[key] or {}) :: { unknown }) do
            if type(value) ~= "string" or value == "" then return nil, invalid(id .. " " .. key .. " is a list of ids") end
            list[#list + 1] = value
        end
    end
    local declared_tools, terr = tools(id, m.tools)
    if terr then return nil, terr end
    local source, serr = schema_source(id, m.schema)
    if serr then return nil, serr end
    local declared, perr = projections(id, m.projections)
    if perr then return nil, perr end
    return { tools = declared_tools :: { string }, projections = declared :: { types.PluginProjection }, id = id, title = m.title :: string?, description = m.description :: string?, icon = m.icon :: string?, settings = m.settings :: string?,
        attachment = m.attachment :: string?, config_schema = schema, schema = source, requires = lists.requires :: { string }, seams = lists.seams :: { string } }, nil
end

local function digest(fragment: types.JsonObject): string
    return (tostring(hash.sha256(values.canonical(fragment))):gsub("[^a-fA-F0-9]", ""):lower())
end

-- resolve_schema answers the plugin's schema for one board: a template as it
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
    if not def then return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = "schema provider contract unavailable" }) end
    local instance, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open(binding)
    if oerr then return nil, errors.wrap(oerr, p.id .. " schema provider " .. binding .. " open failed") end
    if not instance then return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = p.id .. " schema provider " .. binding .. " open returned no client" }) end
    local provider = instance :: types.Provider
    local answer, rerr = provider:resolve({ board_id = ctx.board_id, plugin = p.id, config = ctx.config, current = ctx.current })
    if rerr then return nil, errors.wrap(rerr, p.id .. " schema provider") end
    if type(answer) ~= "table" or type((answer :: types.ProviderResult).fragment) ~= "table" then
        return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = p.id .. " schema provider answered without a fragment" })
    end
    local result = answer :: types.ProviderResult
    if result.version ~= nil and type(result.version) ~= "string" then
        return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = p.id .. " schema provider version must be a string" })
    end
    return { fragment = result.fragment, version = result.version, digest = digest(result.fragment) }, nil
end

-- Effective configuration overlays board values on deployment values.
function M.effective(p: types.Plugin, app: types.JsonObject, own: types.JsonObject?): (types.JsonObject?, error?)
    local config: types.JsonObject = {}
    for k, v in pairs(app) do config[k] = v end
    for k, v in pairs(own or {}) do config[k] = v end
    local err = shape.check(shape.tolerant(p.config_schema), config, p.id .. " effective config")
    if err then return nil, errors.new({ kind = errors.INVALID, message = err:message(), details = { code = "plugin_config_invalid", plugin = p.id } }) end
    return config, nil
end

return M
