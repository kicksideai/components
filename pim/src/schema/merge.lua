-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Declaration merge: a schema request names what it changes. Named entries
-- replace theirs, omitted entries stay, and only remove destroys.
local failure = require("failure")
local shape = require("shape")
local declaration_shape = require("declaration_shape")
local types = require("types")
local policy = require("policy")
local values = require("values")

local M = {}

local invalid = failure.invalid

local function deep(v: unknown): unknown
    if type(v) ~= "table" then return v end
    local out: { [unknown]: unknown } = {}
    for k, x in pairs(v :: { [unknown]: unknown }) do out[k] = deep(x) end
    return out
end

-- copy returns a deep copy; a merged declaration owns its tables.
function M.copy<T>(v: T): T
    return deep(v) :: T
end

local function check_unique<T>(entries: { T }?, key: (T) -> string?): error?
    local seen: { [string]: boolean } = {}
    for _, item in ipairs(entries or {}) do
        local name = key(item)
        if name then
            if seen[name] then return invalid("duplicate declaration key: " .. name) end
            seen[name] = true
        end
    end
    return nil
end

-- merge_list keeps base entries in order, replaces those named again in
-- incoming and appends new ones. Only a section with a merge function can
-- combine repeated incoming entries.
function M.merge_list<T>(base: { T }?, incoming: { T }?, key: (T) -> string?, merge: ((T, T) -> (T?, error?))?): ({ T }?, error?)
    if not merge then
        local err = check_unique(incoming, key)
        if err then return nil, err end
    end
    local order: { string } = {}
    local by: { [string]: T } = {}
    for _, item in ipairs(base or {}) do
        local k = key(item)
        if k and by[k] == nil then order[#order + 1] = k end
        if k then by[k] = item end
    end
    for _, item in ipairs(incoming or {}) do
        local k = key(item)
        if k then
            local prev = by[k]
            if prev == nil then
                order[#order + 1] = k
                by[k] = item
            elseif merge then
                local merged, err = merge(prev, item)
                if err or merged == nil then return nil, err end
                by[k] = merged
            else
                by[k] = item
            end
        end
    end
    local list: { T } = {}
    for _, k in ipairs(order) do list[#list + 1] = by[k] end
    return list, nil
end

-- remove_from drops the entries named in names; a name that matches nothing is not_found.
function M.remove_from<T>(section: string, list: { T }?, names: { string }?, key: (T) -> string?): ({ T }?, error?)
    local out: { T } = list or {}
    for _, name in ipairs(names or {}) do
        local kept: { T } = {}
        local found = false
        for _, item in ipairs(out) do
            if key(item) == name then found = true else kept[#kept + 1] = item end
        end
        if not found then return nil, errors.new({ details = { code = "removal_target_not_found" }, kind = errors.NOT_FOUND, message = section .. " removal target not found: " .. name }) end
        out = kept
    end
    return out, nil
end

-- merge_attributes replaces attributes by code, or by id when the entry carries
-- one (which renames the attribute when the code differs).
function M.merge_attributes(prev: { types.AttributeDecl }?, incoming: { types.AttributeDecl }?): ({ types.AttributeDecl }?, error?)
    local out: { types.AttributeDecl } = {}
    local at_code: { [string]: types.AttributeDecl } = {}
    local at_id: { [integer]: types.AttributeDecl } = {}
    local used: { [types.AttributeDecl]: boolean } = {}
    for _, a in ipairs(prev or {}) do
        at_code[a.code] = a
        if a.id then at_id[a.id] = a end
    end
    -- Explicit claims vacate their old codes before any incoming code is matched.
    for _, a in ipairs(incoming or {}) do
        if a.id then
            local old = at_id[a.id]
            if not old then return nil, invalid("unknown attribute id " .. a.id .. " for " .. a.code) end
            if used[old] then return nil, invalid("attribute declared twice: " .. a.code) end
            used[old] = true
            at_code[old.code] = nil
        end
    end
    local named: { [string]: boolean } = {}
    for _, a in ipairs(incoming or {}) do
        if named[a.code] then return nil, invalid("attribute declared twice: " .. a.code) end
        local old = at_code[a.code]
        if a.id and old then return nil, invalid("attribute code already used: " .. a.code) end
        if old then
            a.id = old.id
            used[old] = true
        end
        named[a.code] = true
        out[#out + 1] = a
    end
    for _, a in ipairs(prev or {}) do
        if not used[a] then out[#out + 1] = a end
    end
    return out, nil
end

local function merge_aspect(prev: types.AspectDecl, incoming: types.AspectDecl): (types.AspectDecl?, error?)
    local attributes, err = M.merge_attributes(prev.attributes, incoming.attributes)
    if err then return nil, err end
    return { namespace = incoming.namespace, write = incoming.write or prev.write, attributes = attributes }, nil
end

-- Treat all entries for a namespace as one patch before resolving attribute IDs.
local function group_aspects(incoming: { types.AspectDecl }?): { types.AspectDecl }
    local grouped: { types.AspectDecl } = {}
    local by_namespace: { [string]: types.AspectDecl } = {}
    for _, aspect in ipairs(incoming or {}) do
        local entry = by_namespace[aspect.namespace]
        if entry then
            entry.write = aspect.write or entry.write
            if aspect.attributes then
                local attributes = entry.attributes or {}
                for _, attr in ipairs(aspect.attributes) do attributes[#attributes + 1] = attr end
                entry.attributes = attributes
            end
        else
            by_namespace[aspect.namespace] = aspect
            grouped[#grouped + 1] = aspect
        end
    end
    return grouped
end

-- merge_policy merges key by key: a named key replaces, omitted keys stay, and a
-- key set to false returns to the deployment default.
local function merge_policy(prev: types.PolicyDecl?, incoming: types.PolicyDecl?): (types.PolicyDecl?, error?)
    local out: { [string]: unknown } = {}
    for key, value in pairs(prev or {}) do out[key] = value end
    for key, value in pairs(incoming or {}) do
        if not policy.KEYS[key] then return nil, invalid("unknown policy key " .. tostring(key)) end
        if value == false then out[key] = nil else out[key] = value end
    end
    if next(out) == nil then return nil, nil end
    return out :: types.PolicyDecl, nil
end

local function name_of(d: types.DimensionDecl): string? return d.name end
local function code_of_vocabulary(v: types.VocabularyDecl): string? return v.code end
local function namespace_of(a: types.AspectDecl): string? return a.namespace end
local function code_of_family(f: types.FamilyDecl): string? return f.code end
local function id_of_source(s: types.SourceDecl): string? return s.id end
local function id_of_channel(c: types.ChannelDecl): string? return c.id end
local function id_of_scope(id: string): string? return id end
local function use_of(entry: types.PluginEntry): string? return entry.use end

-- SHAPE is the JSON schema of a declaration as callers send it. check_shape
-- refuses anything else as invalid, so merge and compile only see well-formed
-- sections and judge their meaning.
local SHAPE = declaration_shape.get()
local TOLERANT = shape.tolerant(SHAPE)

-- Plugins contribute the same aspects and vocabularies, without catalog ids.
local fragment = M.copy(SHAPE)
local properties = fragment.properties :: types.JsonObject
local aspects = properties.aspects :: types.JsonObject
local aspect = aspects.items :: types.JsonObject
local attributes = (aspect.properties :: types.JsonObject).attributes :: types.JsonObject
local attribute = attributes.items :: types.JsonObject
(attribute.properties :: types.JsonObject).id = nil
local FRAGMENT = shape.tolerant({ type = "object", additionalProperties = false,
    properties = { aspects = aspects, vocabularies = properties.vocabularies } })

-- check_shape checks a declaration against SHAPE.
function M.check_shape(declaration: unknown): error?
    return shape.check(TOLERANT, declaration, "declaration")
end

-- check_fragment checks a resolved plugin fragment against FRAGMENT.
function M.check_fragment(fragment: unknown, plugin: string): error?
    return shape.check(FRAGMENT, fragment, "plugin " .. plugin .. " schema")
end

-- Resolver answers the schema a plugin contributes to the catalog for the entry
-- a request names, given the copy the catalog holds; nothing when the plugin
-- has no schema source.
type Resolver = (string, types.PluginEntry, types.PluginEntry?) -> (types.PluginSchema?, error?)
M.Resolver = Resolver

-- resolve_plugins returns a copy of incoming in which every named plugin entry
-- carries the schema the resolver answers for it. A plugin's schema copy is
-- the catalog's own, resolved by the write path so the fold never reads a
-- plugin's source: a request may echo the copy the catalog holds, as
-- get_schema answers it, and is refused when it carries any other.
function M.resolve_plugins(incoming: types.Declaration, prev: types.Declaration?, resolver: Resolver): (types.Declaration?, error?)
    local out: types.Declaration = M.copy(incoming)
    local entries = out.plugins
    if not entries then return out, nil end
    local duplicate = check_unique(entries, use_of)
    if duplicate then return nil, duplicate end
    local previous: { [string]: types.PluginEntry } = {}
    for _, entry in ipairs(prev and prev.plugins or {}) do previous[entry.use] = entry end
    for _, entry in ipairs(entries :: {types.PluginEntry}) do
        local id: string = entry.use
        local held = previous[id]
        if entry.schema ~= nil then
            if not held or not values.equal(entry.schema, held.schema) then
                return nil, invalid("plugin " .. id .. ": a request carries no plugin schema; the catalog resolves its own copy")
            end
            entry.schema = nil
        end
        local resolved, err = resolver(id, entry, held)
        if err then return nil, err end
        if resolved then
            local ferr = M.check_fragment(resolved.fragment, id)
            if ferr then return nil, ferr end
        end
        entry.schema = resolved
    end
    return out, nil
end

-- merge(prev, incoming) returns the effective declaration: entries named in
-- incoming replace their predecessors, omitted entries are retained, and only
-- incoming.remove destroys (dimensions, vocabularies, aspects, families,
-- sources, channels, scopes and plugins by key; attributes by full code). Attribute entries carrying
-- an id replace the attribute with that id, which renames it when the code differs.
function M.merge(prev: types.Declaration?, incoming: types.Declaration): (types.Declaration?, error?)
    local base: types.Declaration = M.copy(prev or {})
    local named: types.Declaration = M.copy(incoming)
    local remove: types.RemoveDecl = named.remove or {}
    local has_removals = false
    for _ in pairs(remove) do has_removals = true end
    if not prev and has_removals then return nil, invalid("nothing to remove in a first schema") end
    local out: types.Declaration = {}
    local err: error?
    out.dimensions, err = M.merge_list(base.dimensions, named.dimensions, name_of)
    if err then return nil, err end
    out.vocabularies, err = M.merge_list(base.vocabularies, named.vocabularies, code_of_vocabulary)
    if err then return nil, err end
    out.aspects, err = M.merge_list(base.aspects, group_aspects(named.aspects), namespace_of, merge_aspect)
    if err then return nil, err end
    out.families, err = M.merge_list(base.families, named.families, code_of_family)
    if err then return nil, err end
    out.sources, err = M.merge_list(base.sources, named.sources, id_of_source)
    if err then return nil, err end
    out.channels, err = M.merge_list(base.channels, named.channels, id_of_channel)
    if err then return nil, err end
    out.scopes, err = M.merge_list(base.scopes, named.scopes, id_of_scope)
    if err then return nil, err end
    if base.plugins ~= nil or named.plugins ~= nil then
        out.plugins, err = M.merge_list(base.plugins, named.plugins, use_of)
        if err then return nil, err end
    end
    out.policy, err = merge_policy(base.policy, named.policy)
    if err then return nil, err end

    out.dimensions, err = M.remove_from("dimensions", out.dimensions, remove.dimensions, name_of)
    if err then return nil, err end
    out.vocabularies, err = M.remove_from("vocabularies", out.vocabularies, remove.vocabularies, code_of_vocabulary)
    if err then return nil, err end
    out.aspects, err = M.remove_from("aspects", out.aspects, remove.aspects, namespace_of)
    if err then return nil, err end
    out.families, err = M.remove_from("families", out.families, remove.families, code_of_family)
    if err then return nil, err end
    out.sources, err = M.remove_from("sources", out.sources, remove.sources, id_of_source)
    if err then return nil, err end
    out.channels, err = M.remove_from("channels", out.channels, remove.channels, id_of_channel)
    if err then return nil, err end
    out.scopes, err = M.remove_from("scopes", out.scopes, remove.scopes, id_of_scope)
    if err then return nil, err end
    if remove.plugins then
        out.plugins, err = M.remove_from("plugins", out.plugins, remove.plugins, use_of)
        if err then return nil, err end
    end
    for _, code in ipairs(remove.attributes or {}) do
        local ns, name = code:match("^([^.]+)%.(.+)$")
        local found = false
        for _, aspect in ipairs(out.aspects or {}) do
            if aspect.namespace == ns then
                local kept: { types.AttributeDecl } = {}
                for _, a in ipairs(aspect.attributes or {}) do
                    if a.code == name then found = true else kept[#kept + 1] = a end
                end
                aspect.attributes = kept
            end
        end
        if not found then return nil, errors.new({ details = { code = "removal_target_not_found" }, kind = errors.NOT_FOUND, message = "attribute removal target not found: " .. code }) end
    end
    return out, nil
end

-- stamp(declaration, compiled) records every attribute's id in the effective
-- declaration, so later declarations can rename by id.
function M.stamp(declaration: types.Declaration, compiled: types.Compiled)
    for _, aspect in ipairs(declaration.aspects or {}) do
        for _, a in ipairs(aspect.attributes or {}) do
            local attr = compiled.attributes[aspect.namespace .. "." .. a.code]
            if attr then a.id = attr.id end
        end
    end
end

return M
