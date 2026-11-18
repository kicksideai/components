-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema sections that compile on their own: sources, channels, the generated
-- layout, adopted scopes and chosen plugins.
local hash = require("hash")
local consts = require("consts")
local values = require("values")
local failure = require("failure")
local types = require("types")

local M = {}

type ScopeLookup = (string) -> (boolean, error?)
type PluginCheck = (string, types.JsonObject) -> error?

local L = consts.LIMITS
local CODE = "^[a-z][a-z0-9_]*$"
local invalid = failure.invalid

local function digest(value: unknown): string
    return tostring(hash.sha256(values.canonical(value))):gsub("[^a-fA-F0-9]", ""):lower()
end

function M.sources(declaration: types.Declaration, aspects: { [string]: types.Aspect }): ({ [string]: types.Source }?, error?)
    local sources: { [string]: types.Source } = {}
    for _, s in ipairs(declaration.sources or {}) do
        if type(s.id) ~= "string" or s.id == "" or sources[s.id] then return nil, invalid("invalid source") end
        if s.ordering ~= nil and s.ordering ~= "sequence" and s.ordering ~= "none" then return nil, invalid("invalid source ordering") end
        local writes: { [string]: boolean } = {}
        for _, ns in ipairs(s.writes or {}) do
            if not aspects[ns] then return nil, invalid("source " .. s.id .. " writes unknown aspect " .. tostring(ns)) end
            writes[ns] = true
        end
        local principals: { [string]: boolean } = {}
        for _, p in ipairs(s.principals or {}) do principals[p] = true end
        if s.audit ~= nil and type(s.audit) ~= "boolean" then return nil, invalid("source " .. s.id .. " audit must be true or false") end
        sources[s.id] = { id = s.id, ordering = s.ordering or "none", writes = writes, principals = principals, audit = s.audit ~= false }
    end
    for ns, aspect in pairs(aspects) do
        for _, s in ipairs(aspect.write_sources) do
            if not sources[s] then return nil, invalid("aspect " .. ns .. " names unknown source " .. s) end
        end
    end

    return sources, nil
end

-- requirement_sets lists every requirement set the families declare.
function M.requirement_sets(families: { [string]: types.Family }): { [string]: boolean }
    local set_ids: { [string]: boolean } = {}
    for _, family in pairs(families) do
        for _, r in ipairs(family.requirements) do set_ids[r.id] = true end
    end
    return set_ids
end

function M.channels(declaration: types.Declaration, families: { [string]: types.Family }, set_ids: { [string]: boolean }): ({ [string]: types.Channel }?, error?)
    local channels: { [string]: types.Channel } = {}
    for _, c in ipairs(declaration.channels or {}) do
        if type(c.id) ~= "string" or not c.id:match(CODE) or channels[c.id] then return nil, invalid("invalid channel") end
        local reqs: { string } = {}
        for _, id in ipairs(c.requirements or {}) do
            if not set_ids[id] then return nil, invalid("channel " .. c.id .. " names unknown requirement set " .. tostring(id)) end
            reqs[#reqs + 1] = id
        end
        local fams: { string }? = nil
        if c.families then
            fams = {}
            for _, code in ipairs(c.families) do
                if not families[code] then return nil, invalid("channel " .. c.id .. " names unknown family " .. tostring(code)) end
                table.insert(fams :: { string }, code)
            end
        end
        channels[c.id] = { id = c.id, requirements = reqs, families = fams }
    end

    return channels, nil
end

function M.layout(attributes: { [string]: types.Attribute }, set_ids: { [string]: boolean }): (types.Layout?, error?)
    local columns: { types.Column } = {}
    local sets: { types.Column } = {}
    local search: { types.Column } = {}
    local codes: { string } = {}
    for code in pairs(attributes) do codes[#codes + 1] = code end
    table.sort(codes, function(a, b) return attributes[a].id < attributes[b].id end)
    for _, code in ipairs(codes) do
        local attr = attributes[code] :: types.Attribute
        for _, ctx in ipairs(attr.index_contexts) do
            local entry: types.Column = { attribute_id = attr.id, ctx = ctx, kind = attr.index,
                column = "a" .. attr.id .. "_" .. digest(ctx):sub(1, 8) }
            if attr.index == "text" then
                search[#search + 1] = entry
            elseif attr.cardinality == "one" then
                columns[#columns + 1] = entry
            else
                sets[#sets + 1] = entry
            end
        end
    end
    if #columns + #sets + #search > L.indexed_columns then return nil, invalid("too many indexed columns") end
    local flags: { types.Column } = {}
    local set_list: { string } = {}
    for id in pairs(set_ids) do set_list[#set_list + 1] = id end
    if #set_list > L.requirement_sets then return nil, invalid("at most " .. L.requirement_sets .. " requirement sets") end
    table.sort(set_list)
    for _, id in ipairs(set_list) do
        flags[#flags + 1] = { attribute_id = 0, ctx = id, kind = "flag", column = "r_" .. digest(id):sub(1, 10) }
    end

    return { columns = columns, sets = sets, search = search, flags = flags }, nil
end

function M.scopes(declaration: types.Declaration, scope_lookup: ScopeLookup?): ({ [string]: boolean }?, error?)
    local scopes: { [string]: boolean } = {}
    for _, id in ipairs(declaration.scopes or {}) do
        if type(id) ~= "string" or scopes[id] then return nil, invalid("scope " .. tostring(id) .. " adopted twice or malformed") end
        if not scope_lookup then return nil, invalid("scope " .. id .. " cannot be checked here") end
        local ok, serr = scope_lookup(id)
        if serr then return nil, errors.wrap(serr, "scope " .. id) end
        if not ok then return nil, invalid("unknown scope " .. id, { code = "unknown_scope", entry = id }) end
        scopes[id] = true
    end
    return scopes, nil
end

function M.plugins(declaration: types.Declaration, plugin_check: PluginCheck?): ({ [string]: types.PluginEntry }?, error?)
    local plugins: { [string]: types.PluginEntry } = {}
    for _, entry in ipairs(declaration.plugins or {}) do
        local id = entry.use
        if type(id) ~= "string" or id == "" or plugins[id] then return nil, invalid("plugin membership requires distinct nonempty ids") end
        if not plugin_check then return nil, invalid("plugin " .. id .. " cannot be checked here") end
        local perr = plugin_check(id, {})
        if perr then return nil, errors.wrap(perr, "plugin " .. id) end
        plugins[id] = { use = id, schema = entry.schema }
    end
    return plugins, nil
end

function M.attribute_ids(attributes: { [string]: types.Attribute }, codes: { string }): { integer }
    local out: { integer } = {}
    for i, code in ipairs(codes) do out[i] = attributes[code].id end
    return out
end

type RequirementRule = { id: string, contexts: { types.Ctx }, require: { integer }, authored: { integer } }
type CheckRule = { fn: string, digest: string?, reads: { integer }, cost: string, config: types.JsonObject }

function M.requirement_meaning(f: types.Family, attributes: { [string]: types.Attribute }): { RequirementRule }
    local reqs: { RequirementRule } = {}
    for i, r in ipairs(f.requirements) do
        reqs[i] = { id = r.id, contexts = r.contexts, require = M.attribute_ids(attributes, r.require),
            authored = M.attribute_ids(attributes, r.authored) }
    end
    return reqs
end

function M.check_meaning(f: types.Family, attributes: { [string]: types.Attribute }, include_digest: boolean): { CheckRule }
    local checks: { CheckRule } = {}
    for i, k in ipairs(f.checks) do
        checks[i] = { fn = k.fn, digest = include_digest and k.digest or nil,
            reads = M.attribute_ids(attributes, k.reads), cost = k.cost, config = k.config }
    end
    return checks
end

-- A flag aggregates the same set across families. Each family's interactive
-- checks apply to every one of its sets. Include the inputs to resolution for
-- the attributes the set or its checks actually read.
function M.readiness(c: types.Compiled): { [string]: { [string]: unknown } }
    local result: { [string]: { [string]: unknown } } = {}
    local attrs: { [integer]: types.Attribute } = {}
    local dimensions: { [string]: types.Dimension } = {}
    for _, attr in pairs(c.attributes) do attrs[attr.id] = attr end
    for _, dim in ipairs(c.dimensions) do dimensions[dim.name] = dim end
    for code, f in pairs(c.families) do
        local requirements = M.requirement_meaning(f, c.attributes)
        local checks = M.check_meaning(f, c.attributes, true)
        local interactive: { CheckRule } = {}
        for _, check in ipairs(checks) do
            if check.cost == "interactive" then interactive[#interactive + 1] = check end
        end
        for _, req in ipairs(requirements) do
            local inputs: { [string]: unknown } = {}
            local function add(dependencies: { integer })
                for _, id in ipairs(dependencies) do
                    local attr = attrs[id]
                    local scope: { types.Dimension } = {}
                    for i, name in ipairs(attr.scope) do scope[i] = dimensions[name] end
                    inputs[tostring(id)] = { owner = f.owner[attr.code], scope = scope, default = attr.default }
                end
            end
            add(req.require)
            add(req.authored)
            for _, check in ipairs(interactive) do add(check.reads) end
            local by_family = result[req.id] or {}
            by_family[code] = { requirement = req, checks = interactive, inputs = inputs }
            result[req.id] = by_family
        end
    end
    return result
end

-- meaning is the compiled model with attribute codes replaced by ids: what
-- stored rows depend on. Its digest changes when resolved values, readiness
-- or the layout can change, and stays put for a rename.
function M.meaning(c: types.Compiled): unknown
    local attrs: { [string]: unknown } = {}
    for _, a in pairs(c.attributes) do
        attrs[tostring(a.id)] = { form = a.form, type = a.type, scope = a.scope, cardinality = a.cardinality, index = a.index,
            unique = a.unique, config = a.config, default = a.default, vocabulary = a.vocabulary, index_contexts = a.index_contexts }
    end
    local fams: { [string]: unknown } = {}
    for code, f in pairs(c.families) do
        local owner: { [string]: integer } = {}
        for attr_code, level in pairs(f.owner) do owner[tostring(c.attributes[attr_code].id)] = level end
        local levels: { unknown } = {}
        for i, l in ipairs(f.levels) do levels[i] = M.attribute_ids(c.attributes, l.axes) end
        fams[code] = { owner = owner, levels = levels, item_level = f.item_level,
            requirements = M.requirement_meaning(f, c.attributes), checks = M.check_meaning(f, c.attributes, true) }
    end
    return { c.layout, attrs, fams, c.dimensions }
end
return M
