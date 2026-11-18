-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema declaration compiler: validates a declaration and produces the compiled
-- catalog model (stable attribute ids, ownership levels, item layout). Pure: the
-- caller supplies type metadata and the previous compiled model.
local failure = require("failure")
local hash = require("hash")
local consts = require("consts")
local values = require("values")
local shape = require("shape")
local types = require("types")
local policy = require("policy")
local sections = require("sections")

local contexts = require("contexts")
local M = { ctx_key = contexts.ctx_key, chain = contexts.chain, check_context = contexts.check_context }

type TypeLookup = (string) -> (types.TypeMeta?, error?)
type CheckLookup = (string) -> (string?, error?)
-- ScopeLookup answers whether a registry id is a well-formed scope declaration.
type ScopeLookup = (string) -> (boolean, error?)
-- LinkLookup answers whether a link kind is bound.
type LinkLookup = (string) -> (boolean, error?)
-- PluginCheck checks a plugin id names a plugin for PIM and its config fits the
-- manifest.
type PluginCheck = (string, types.JsonObject) -> error?
-- Lookups are the registry answers compile needs: the type of an attribute,
-- whether an id is a check, a scope or a plugin accepting its config, and
-- whether a link kind is bound. Compile itself reads no registry.
type Lookups = { type_of: TypeLookup, check_digest: CheckLookup?, scope: ScopeLookup?, plugin: PluginCheck?, link_kind: LinkLookup? }
M.Lookups = Lookups
M.CheckLookup = CheckLookup

local L = consts.LIMITS

local function invalid(message: string, details: types.JsonObject?): error
    local d = details or {}
    d.code = d.code or "invalid_schema"
    return failure.invalid(message, d)
end

local function digest(value: unknown): string
    return tostring(hash.sha256(values.canonical(value))):gsub("[^a-fA-F0-9]", ""):lower():sub(1, 16)
end

local CODE = "^[a-z][a-z0-9_]*$"

-- shape_problem validates a field's value shape and recursively checks its
-- record members against the same effective vocabulary map.
local function shape_problem(form: string, config: types.AttributeConfig, path: string, depth: integer,
    vocabularies: { [string]: types.Vocabulary }): string?
    if form == "record" then depth = depth + 1 end
    if depth > 3 then return path .. ": record depth exceeds three" end
    if not values.FORMS[form] then return path .. ": unknown form " .. tostring(form) end
    if form == "ref" and not config.target then return path .. ": references need a target" end
    local members = config.members
    if members == nil then return nil end
    if type(members) ~= "table" then return path .. ": members must be an object" end
    local names: { string } = {}
    for name in pairs(members) do
        if type(name) ~= "string" then return path .. ": members must map names to value shapes" end
        names[#names + 1] = name
    end
    table.sort(names)
    for _, name in ipairs(names) do
        local member = members[name]
        local member_path = path .. "." .. name
        if type(member) ~= "table" then return member_path .. ": member must be an object" end
        if member.target ~= nil and type(member.target) ~= "string" then return member_path .. ": target must be a string" end
        if member.form == "ref" and member.target == "term" then
            local vocabulary = member.vocabulary
            if type(vocabulary) ~= "string" then return member_path .. ": term references need a vocabulary" end
            if not vocabularies[vocabulary] then return member_path .. ": unknown vocabulary " .. vocabulary end
        end
        local problem = shape_problem(member.form, member, member_path, depth, vocabularies)
        if problem then return problem end
    end
    return nil
end

local WIDTHS: { [string]: boolean } = { full = true, half = true, third = true, quarter = true }

-- default_width is the row share an attribute takes when the declaration names
-- none: records, long text and repeated values take the row; one-control
-- scalars (bool, int, dec, time) a third; everything else, including a
-- quantity with its amount and unit, a half. Text is long when its type
-- cannot be key-indexed, the way the built-in rich text type is declared.
local function default_width(form: string, cardinality: string, long_text: boolean): string
    if form == "record" or long_text or cardinality ~= "one" then return "full" end
    if form == "bool" or form == "int" or form == "dec" or form == "time" then return "third" end
    return "half"
end

local function key_indexable(meta: types.TypeMeta): boolean
    for _, k in ipairs(meta.indexes or { "none" }) do if k == "key" then return true end end
    return false
end

-- width_of answers an attribute's row share: the compiled width, or the form
-- default for a generation compiled before widths were part of the model;
-- that fallback has no type metadata, so long text there reads as half.
function M.width_of(a: types.Attribute): string
    return a.width or default_width(a.form, a.cardinality, false)
end

local function compile_attribute(ns: string, raw: types.AttributeDecl, dims: { types.Dimension },
    dimset: { [string]: types.Dimension }, vocabularies: { [string]: types.Vocabulary }, lookups: Lookups,
    prev: types.Attribute?): (types.Attribute?, error?)
    local type_of = lookups.type_of
    if type(raw.code) ~= "string" or not raw.code:match(CODE) then return nil, invalid("invalid attribute code in " .. ns) end
    local code = ns .. "." .. raw.code
    if type(raw.type) ~= "string" then return nil, invalid(code .. ": type required") end
    local meta, terr = type_of(raw.type)
    if terr then return nil, errors.wrap(terr, code .. ": type lookup failed") end
    if not meta then return nil, invalid(code .. ": unknown type " .. raw.type, { code = "unknown_type", entry = raw.type }) end
    local cardinality = raw.cardinality or "one"
    if cardinality ~= "one" and cardinality ~= "list" and cardinality ~= "set" then return nil, invalid(code .. ": invalid cardinality") end
    local scope: { string } = {}
    if #(raw.scope or {}) > 3 then return nil, invalid(code .. ": at most three scope dimensions") end
    local scoped: { [string]: boolean } = {}
    for _, d in ipairs(raw.scope or {}) do
        if scoped[d] then return nil, invalid(code .. ": duplicate scope dimension " .. d) end
        scoped[d] = true
        if not dimset[d] then return nil, invalid(code .. ": unknown scope dimension " .. tostring(d)) end
        scope[#scope + 1] = d
    end
    local ordered: { string } = {}
    for _, dim in ipairs(dims) do
        for _, d in ipairs(scope) do if d == dim.name then ordered[#ordered + 1] = d end end
    end
    local served, candidates = 1, 1
    for _, name in ipairs(ordered) do
        local dim = dimset[name]
        served = served * #dim.members
        local longest = 1
        for _, member in ipairs(dim.members) do longest = math.max(longest, #contexts.chain(dim, member)) end
        candidates = candidates * longest
        if served > 256 then return nil, invalid(code .. ": served contexts exceed 256") end
        if candidates > 64 then return nil, invalid(code .. ": resolution candidates exceed 64") end
    end
    local index = raw.index or "none"
    local allowed = false
    for _, k in ipairs(meta.indexes or { "none" }) do if k == index then allowed = true end end
    if index ~= "none" and not allowed then return nil, invalid(code .. ": type " .. raw.type .. " cannot be indexed as " .. index) end
    if raw.config ~= nil and type(raw.config) ~= "table" then return nil, invalid(code .. ": config must be an object") end
    if meta.config_schema then
        local cerr = shape.check(shape.tolerant(meta.config_schema :: types.JsonObject), raw.config or {}, code .. " config")
        if cerr then return nil, cerr end
    end
    local config: types.AttributeConfig = {}
    for k, v in pairs(raw.config or {}) do config[k] = v end
    if config.target ~= nil and type(config.target) ~= "string" then return nil, invalid(code .. ": target must be a string") end
    if meta.target then config.target = meta.target end
    if meta.form == "ref" and not meta.target then
        local target = config.target
        if type(target) ~= "string" or target == "" then return nil, invalid(code .. ": a link declares its target kind") end
        if target == "product" or target == "term" then return nil, invalid(code .. ": a link targets a bound kind; products and terms have their own types") end
        if not lookups.link_kind then return nil, invalid(code .. ": link kinds cannot be checked here") end
        local bound, lerr = lookups.link_kind(target :: string)
        if lerr then return nil, errors.wrap(lerr, code .. ": link lookup failed") end
        if not bound then return nil, invalid(code .. ": unknown link kind " .. target, { code = "unknown_link_kind", kind = target }) end
    end
    local width = raw.width or default_width(meta.form, cardinality, meta.form == "text" and not key_indexable(meta))
    if not WIDTHS[width] then return nil, invalid(code .. ": width is full, half, third or quarter") end
    local attr: types.Attribute = {
        code = code, aspect = ns, type = raw.type, form = meta.form, scope = ordered,
        cardinality = cardinality, index = index, unique = raw.unique == true,
        config = config, status = "served",
        vocabulary = raw.vocabulary, index_contexts = {}, id = 0, functions = meta.functions, width = width,
    }
    if meta.target == "term" and type(raw.vocabulary) ~= "string" then return nil, invalid(code .. ": vocabulary required") end
    local problem = shape_problem(meta.form, config, code, 0, vocabularies)
    if problem then return nil, invalid(problem) end
    if attr.unique and (#ordered > 0 or cardinality ~= "one") then
        return nil, invalid(code .. ": unique attributes need empty scope and cardinality one")
    end
    if index == "number" and meta.form ~= "int" and meta.form ~= "dec" and meta.form ~= "quantity" then
        return nil, invalid(code .. ": number index needs int, dec or quantity")
    end
    if meta.form == "quantity" then
        if type(config.units) ~= "table" or next(config.units) == nil then return nil, invalid(code .. ": quantity declares units") end
        if type(config.canonical) ~= "string" then return nil, invalid(code .. ": quantity declares its canonical unit") end
        for unit, factor in pairs(config.units) do
            if type(unit) ~= "string" or unit == "" or unit:find("%s") then return nil, invalid(code .. ": invalid unit name") end
            local f, ferr = values.normalize({ form = "dec", cardinality = "one", config = {} }, factor)
            if ferr or f.m <= 0 then return nil, invalid(code .. ": unit " .. unit .. " needs a positive decimal factor") end
        end
        local base = values.normalize({ form = "dec", cardinality = "one", config = {} }, config.units[config.canonical] or "0")
        if not base or base.m ~= 1 or base.e ~= 0 then return nil, invalid(code .. ": the canonical unit's factor is 1") end
    end
    local contexts: { string } = {}
    if index ~= "none" then
        local list = raw.index_contexts
        if #ordered == 0 then list = { {} } end
        if type(list) ~= "table" or #list == 0 then return nil, invalid(code .. ": scoped indexed attributes need index_contexts") end
        for _, tuple in ipairs(list) do
            local key, kerr = M.ctx_key(dims, ordered, tuple)
            if kerr then return nil, invalid(code .. ": " .. tostring(kerr)) end
            for _, existing in ipairs(contexts) do
                if existing == key then return nil, invalid(code .. ": index context listed twice: " .. tostring(key)) end
            end
            contexts[#contexts + 1] = key :: string
        end
    end
    attr.index_contexts = contexts
    if raw.default ~= nil then
        local default, verr = values.normalize(attr, raw.default)
        if verr then return nil, invalid(code .. ": default " .. tostring(verr)) end
        local ierr = values.index_error(attr, default :: types.Value, false)
        if ierr then return nil, errors.wrap(ierr, code .. ": default cannot be indexed") end
        attr.default = default
    end
    if prev then attr.id = prev.id end
    return attr, nil
end

-- OwnedAspect is a declared aspect with the plugin whose resolved schema
-- contributes it, when one does.
type OwnedAspect = { decl: types.AspectDecl, plugin: string? }
-- Contributed is what the catalog declares followed by what its chosen plugins
-- contribute, in plugin id order.
type Contributed = { aspects: { OwnedAspect }, vocabularies: { types.VocabularyDecl } }

-- contributed lists the catalog's own aspects and vocabularies, then those of
-- each chosen plugin's resolved schema. A namespace or vocabulary two parties
-- declare is refused by name, and a plugin attribute carries no id.
local function contributed(declaration: types.Declaration): (Contributed?, error?)
    local out: Contributed = { aspects = {}, vocabularies = {} }
    local aspect_owner: { [string]: string } = {}
    local vocabulary_owner: { [string]: string } = {}
    local function add(owner: string, plugin: string?, fragment: types.Fragment): error?
        for _, v in ipairs(fragment.vocabularies or {}) do
            local code = tostring(v.code)
            if vocabulary_owner[code] then return invalid(owner .. ": vocabulary " .. code .. " is declared by " .. vocabulary_owner[code]) end
            vocabulary_owner[code] = owner
            out.vocabularies[#out.vocabularies + 1] = v
        end
        for _, a in ipairs(fragment.aspects or {}) do
            local ns = tostring(a.namespace)
            if aspect_owner[ns] then return invalid(owner .. ": aspect " .. ns .. " is declared by " .. aspect_owner[ns]) end
            aspect_owner[ns] = owner
            if plugin then
                for _, attr in ipairs(a.attributes or {}) do
                    if attr.id ~= nil then return invalid(owner .. ": attribute " .. ns .. "." .. tostring(attr.code) .. " carries an id") end
                end
            end
            out.aspects[#out.aspects + 1] = { decl = a, plugin = plugin }
        end
        return nil
    end
    local own_err = add("the catalog", nil, { aspects = declaration.aspects, vocabularies = declaration.vocabularies })
    if own_err then return nil, own_err end
    local entries: { types.PluginEntry } = {}
    for _, entry in ipairs(declaration.plugins or {}) do entries[#entries + 1] = entry end
    table.sort(entries, function(a: types.PluginEntry, b: types.PluginEntry): boolean return a.use < b.use end)
    for _, entry in ipairs(entries) do
        local id, copy = entry.use, entry.schema
        if copy then
            local perr = add("plugin " .. id, id, copy.fragment :: types.Fragment)
            if perr then return nil, perr end
        end
    end
    return out, nil
end

local function compile_vocabularies(declared: { types.VocabularyDecl }): ({ [string]: types.Vocabulary }?, error?)
    local vocabularies: { [string]: types.Vocabulary } = {}
    for _, v in ipairs(declared) do
        if type(v.code) ~= "string" or not v.code:match(CODE) or vocabularies[v.code] then return nil, invalid("invalid vocabulary") end
        if v.semantic == true then return nil, invalid("semantic vocabularies are not supported; declare the vocabulary as data") end
        vocabularies[v.code] = { code = v.code, semantic = false, hierarchical = v.hierarchical == true }
    end

    return vocabularies, nil
end

-- AspectSet is what compiling the aspects yields: attributes by code, aspects, the
-- attribute codes of each aspect and the next free attribute id.
type AspectSet = { attributes: { [string]: types.Attribute }, aspects: { [string]: types.Aspect }, by_aspect: { [string]: { string } }, next_id: integer }

local function compile_aspects(declared: { OwnedAspect }, prev: types.Compiled?, dimlist: { types.Dimension }, dimset: { [string]: types.Dimension },
    vocabularies: { [string]: types.Vocabulary }, lookups: Lookups): (AspectSet?, error?)
    local prev_attrs: { [string]: types.Attribute } = (prev and prev.attributes) or {}
    local prev_by_id: { [integer]: types.Attribute } = {}
    for _, a in pairs(prev_attrs) do prev_by_id[a.id] = a end
    local next_id: integer = (prev and prev.next_attribute_id) or 1
    local attributes: { [string]: types.Attribute } = {}
    local aspects: { [string]: types.Aspect } = {}
    local by_aspect: { [string]: { string } } = {}
    local claimed: { [integer]: boolean } = {}
    local reserved: { [integer]: boolean } = {}
    for _, owned in ipairs(declared) do
        for _, raw in ipairs(owned.decl.attributes or {}) do
            local id = math.tointeger(raw.id)
            if id then reserved[id] = true end
        end
    end
    for _, owned in ipairs(declared) do
        local a = owned.decl
        local ns = a.namespace
        if type(ns) ~= "string" or not ns:match(CODE) or aspects[ns] then return nil, invalid("invalid aspect namespace") end
        local sources: { string } = {}
        for _, s in ipairs(((a.write or {}).sources) or {}) do sources[#sources + 1] = s end
        aspects[ns] = { namespace = ns, write_sources = sources, plugin = owned.plugin }
        by_aspect[ns] = {}
        for _, raw in ipairs(a.attributes or {}) do
            local code = ns .. "." .. tostring(raw.code)
            if attributes[code] then return nil, invalid("duplicate attribute " .. code) end
            local raw_id = math.tointeger(raw.id)
            local before = prev_attrs[code]
            if raw_id then
                before = prev_by_id[raw_id]
                if not before then return nil, invalid(code .. ": unknown attribute id " .. raw_id) end
            elseif before and reserved[before.id] then
                before = nil
            end
            if before and before.aspect ~= ns then return nil, invalid(code .. ": an attribute stays in its aspect") end
            if before and claimed[before.id] then return nil, invalid(code .. ": attribute id is declared twice") end
            local compiled_attr, aerr = compile_attribute(ns, raw, dimlist, dimset, vocabularies, lookups, before)
            if aerr or not compiled_attr then return nil, aerr end
            local attr: types.Attribute = compiled_attr
            if attr.vocabulary and not vocabularies[attr.vocabulary] then return nil, invalid(code .. ": unknown vocabulary") end
            if attr.id == 0 then
                attr.id = next_id
                next_id = next_id + 1
            end
            claimed[attr.id] = true
            attributes[code] = attr
            table.insert(by_aspect[ns], code)
        end
    end

    return { attributes = attributes, aspects = aspects, by_aspect = by_aspect, next_id = next_id }, nil
end

local function compile_family(f: types.FamilyDecl, set: AspectSet, dimlist: { types.Dimension }, check_lookup: CheckLookup?, families: { [string]: types.Family }): error?
    local aspects, by_aspect, attributes = set.aspects, set.by_aspect, set.attributes
    if type(f.code) ~= "string" or not f.code:match(CODE) or families[f.code] then return invalid("invalid family") end
    local members: { [string]: integer } = {}
    for _, ns in ipairs(f.aspects or {}) do
        if not aspects[ns] then return invalid(f.code .. ": unknown aspect " .. tostring(ns)) end
        for _, code in ipairs(by_aspect[ns]) do members[code] = 0 end
    end
    local count = 0
    local scope: { [string]: boolean } = {}
    for code in pairs(members) do
        count = count + 1
        if count > 1000 then return invalid(f.code .. ": attributes exceed 1000") end
        for _, name in ipairs(attributes[code].scope) do scope[name] = true end
    end
    local served = 1
    for _, dim in ipairs(dimlist) do
        if scope[dim.name] then served = served * #dim.members end
        if served > 256 then return invalid(f.code .. ": served contexts exceed 256") end
    end
    if #(f.checks or {}) > 100 then return invalid(f.code .. ": checks exceed 100") end
    local levels: { types.Level } = { { axes = {} } }
    local variation = f.variation or {}
    if #variation > L.depth then return invalid(f.code .. ": at most " .. L.depth .. " variation levels") end
    for i, level in ipairs(variation) do
        local axes: { string } = {}
        for _, code in ipairs(level.axes or {}) do
            local attr = attributes[code]
            if not attr or members[code] == nil then return invalid(f.code .. ": axis " .. tostring(code) .. " is not a family attribute") end
            if #attr.scope > 0 or attr.cardinality ~= "one" or attr.form == "record" or attr.form == "text" then
                return invalid(f.code .. ": " .. code .. " cannot be an axis")
            end
            if members[code] ~= 0 then return invalid(f.code .. ": " .. code .. " owned twice") end
            if attr.default ~= nil then
                local err = values.index_error(attr, attr.default, true)
                if err then return errors.wrap(err, code .. ": axis default cannot be indexed") end
            end
            members[code] = i
            axes[#axes + 1] = code
        end
        if #axes == 0 then return invalid(f.code .. ": every variation level needs axes") end
        for _, code in ipairs(level.own or {}) do
            if members[code] == nil then return invalid(f.code .. ": " .. tostring(code) .. " is not a family attribute") end
            if members[code] ~= 0 then return invalid(f.code .. ": " .. code .. " owned twice") end
            members[code] = i
        end
        levels[#levels + 1] = { axes = axes }
    end
    local requirements: { types.Requirement } = {}
    local seen_sets: { [string]: boolean } = {}
    for _, r in ipairs(f.requirements or {}) do
        if type(r.id) ~= "string" or not r.id:match(CODE) or seen_sets[r.id] then return invalid(f.code .. ": invalid requirement id") end
        seen_sets[r.id] = true
        local contexts, cerr = contexts.expand_context(dimlist, r.context or {})
        if cerr then return invalid(f.code .. "." .. r.id .. ": " .. tostring(cerr)) end
        local require_list: { string } = {}
        local authored: { string } = {}
        for _, code in ipairs(r.require or {}) do
            if members[code] == nil then return invalid(f.code .. "." .. r.id .. ": " .. tostring(code) .. " is not a family attribute") end
            require_list[#require_list + 1] = code
        end
        for _, code in ipairs(r.authored or {}) do
            if members[code] == nil then return invalid(f.code .. "." .. r.id .. ": " .. tostring(code) .. " is not a family attribute") end
            authored[#authored + 1] = code
        end
        requirements[#requirements + 1] = { id = r.id, contexts = contexts :: { types.Ctx }, require = require_list, authored = authored }
    end
    local checks: { types.Check } = {}
    for _, c in ipairs(f.checks or {}) do
        if type(c.check) ~= "string" then return invalid(f.code .. ": a check names its function") end
        if not check_lookup then return invalid(f.code .. ": checks need a function registry") end
        local digest, kerr = check_lookup(c.check)
        if kerr then return errors.wrap(kerr, f.code .. ": check lookup failed") end
        if not digest then return invalid(f.code .. ": " .. c.check .. " is not a kickside.pim.check entry") end
        local cost = c.cost or "interactive"
        if cost ~= "interactive" and cost ~= "release" then return invalid(f.code .. ": check cost is interactive or release") end
        local reads: { string } = {}
        for _, code in ipairs(c.reads or {}) do
            if members[code] == nil then return invalid(f.code .. ": check reads " .. tostring(code) .. ", not a family attribute") end
            reads[#reads + 1] = code
        end
        local enforce = c.enforce or "none"
        if enforce ~= "none" and enforce ~= "write" then return invalid(f.code .. ": check enforce is none or write") end
        local level: integer? = nil
        if enforce == "write" then
            if cost ~= "interactive" then return invalid(f.code .. ": " .. c.check .. " enforces writes, so it is an interactive check") end
            if #reads == 0 then return invalid(f.code .. ": " .. c.check .. " enforces writes, so it reads attributes owned at one level") end
            for _, code in ipairs(reads) do
                local owner = members[code]
                if level ~= nil and owner ~= level then return invalid(f.code .. ": " .. c.check .. " enforces writes, so its reads share one owning level") end
                level = owner
            end
        end
        checks[#checks + 1] = { fn = c.check, digest = digest, reads = reads, cost = cost, config = c.config or {}, enforce = enforce == "write", level = level }
    end
    families[f.code] = { code = f.code, owner = members, levels = levels, item_level = #levels - 1, requirements = requirements,
        checks = checks }
    return nil
end

local function compile_families(declaration: types.Declaration, set: AspectSet, dimlist: { types.Dimension },
    check_lookup: CheckLookup?): ({ [string]: types.Family }?, error?)
    local families: { [string]: types.Family } = {}
    local all: { string } = {}
    for ns in pairs(set.aspects) do all[#all + 1] = ns end
    table.sort(all)
    local generic_err = compile_family({ code = "generic", aspects = all }, set, dimlist, check_lookup, families)
    if generic_err then return nil, generic_err end
    for _, f in ipairs(declaration.families or {}) do
        if f.code == "generic" then return nil, invalid("family generic is built in") end
        local ferr = compile_family(f, set, dimlist, check_lookup, families)
        if ferr then return nil, ferr end
    end

    return families, nil
end

-- compile(prev, declaration, lookups) returns the compiled model or an error.
function M.compile(prev: types.Compiled?, declaration: types.Declaration, lookups: Lookups): (types.Compiled?, error?)
    if type(declaration) ~= "table" then return nil, invalid("declaration required") end
    local dims, derr = contexts.compile_dimensions(declaration.dimensions)
    if derr then return nil, derr end
    local dimlist: { types.Dimension } = dims :: { types.Dimension }
    local dimset: { [string]: types.Dimension } = {}
    for _, d in ipairs(dimlist) do dimset[d.name] = d end

    local declared, cerr = contributed(declaration)
    if cerr or not declared then return nil, cerr end
    local vocabularies, verr = compile_vocabularies(declared.vocabularies)
    if verr or not vocabularies then return nil, verr end
    local set, aerr = compile_aspects(declared.aspects, prev, dimlist, dimset, vocabularies, lookups)
    if aerr or not set then return nil, aerr end
    local families, ferr = compile_families(declaration, set, dimlist, lookups.check_digest)
    if ferr or not families then return nil, ferr end
    local sources, serr = sections.sources(declaration, set.aspects)
    if serr or not sources then return nil, serr end
    local set_ids = sections.requirement_sets(families)
    local channels, cerr = sections.channels(declaration, families, set_ids)
    if cerr or not channels then return nil, cerr end
    local columns_of, lerr = sections.layout(set.attributes, set_ids)
    if lerr or not columns_of then return nil, lerr end
    local public_dims: { types.Dimension } = {}
    for _, d in ipairs(dimlist) do
        public_dims[#public_dims + 1] = { name = d.name, members = d.members, fallback = d.fallback }
    end
    local scopes, scope_err = sections.scopes(declaration, lookups.scope)
    if scope_err or not scopes then return nil, scope_err end
    local plugins, plugin_err = sections.plugins(declaration, lookups.plugin)
    if plugin_err or not plugins then return nil, plugin_err end
    local overrides, bad_policy = policy.overrides(declaration.policy)
    if bad_policy or not overrides then return nil, invalid("policy: " .. tostring(bad_policy)) end
    local compiled: types.Compiled = {
        policy = overrides,
        dimensions = public_dims, vocabularies = vocabularies, aspects = set.aspects,
        attributes = set.attributes, families = families, sources = sources, channels = channels, scopes = scopes, plugins = plugins,
        layout = columns_of,
        next_attribute_id = set.next_id, layout_digest = "", digest = "",
    }
    compiled.layout_digest = digest(compiled.layout)
    compiled.digest = digest(sections.meaning(compiled))
    return compiled, nil
end

-- with_index(compiled) restores runtime lookup sets dropped by JSON storage.
function M.with_index(compiled: types.Compiled): types.Compiled
    for _, d in ipairs(compiled.dimensions) do
        local set: { [string]: boolean } = {}
        for _, m in ipairs(d.members) do set[m] = true end
        d.member_set = set
        d.fallback = d.fallback or {}
    end
    local by_id: { [integer]: types.Attribute } = {}
    for _, attr in pairs(compiled.attributes) do by_id[attr.id] = attr end
    compiled.by_id = by_id
    return compiled
end

return M
