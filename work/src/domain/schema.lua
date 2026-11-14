-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local formula = require("formula")
local seams = require("seams")
-- Schema declarations compile into the Work model and its indexes.
local hash = require("hash")
local consts = require("consts")
local values = require("values")
local process = require("process")
local types = require("types")
local rollup = require("rollup")

local predicates = require("predicates")
local plugins = require("plugins")
local policy = require("policy")
local access_rules = require("access_rules")

local fields_validator = require("fields")
local M = {}

local function invalid(message: string, details: types.JsonObject?): error
    local d: types.JsonObject = details or {}
    d.code = d.code or "invalid_schema"
    return errors.new({ kind = errors.INVALID, message = message, details = d })
end

local function valid_id(id: unknown): boolean
    return type(id) == "string" and id:match(consts.ID_PATTERN) ~= nil and #id <= 40
end

-- model indexes a compiled schema.
function M.model(compiled: types.Compiled): types.Model
    policy.upgrade(compiled)
    local m: types.Model = { compiled = compiled, fields = {}, by_id = {}, item_types = {}, relations = {}, processes = {} }
    for _, f in ipairs(compiled.fields) do
        m.fields[f.code] = f
        m.by_id[f.id] = f
    end
    for _, t in ipairs(compiled.item_types) do m.item_types[t.id] = t end
    for _, r in ipairs(compiled.relation_types) do m.relations[r.id] = r end
    for _, p in ipairs(compiled.processes) do m.processes[p.id] = p end
    return m
end

local function form_of(decl: types.FieldDecl, entries: { types.PluginDecl }?, in_use: boolean?): (string?, string?, error?)
    local kind = decl.type
    if kind ~= nil then
        if not consts.KINDS[kind] then
            if not kind:find(":", 1, true) then return nil, nil, invalid("unknown field type " .. kind, { field = decl.code }) end
            local form, err = plugins.field(decl, entries, in_use)
            if err or not form then return nil, nil, err end
            if not consts.FORMS[form] then return nil, nil, invalid("plugin field declares an unknown form") end
            return kind, form, nil
        end
        if kind == "rollup" or kind == "formula" then
            if not decl.form or not consts.FORMS[decl.form] then return nil, nil, invalid(kind .. " needs a result form") end
            return kind, decl.form, nil
        end
        local form = (kind == "option" or kind == "rank" or kind == "rich_text") and "text" or (kind == "principal" or kind == "item") and "ref" or "int"
        if decl.form ~= nil and decl.form ~= form then return nil, nil, invalid("field " .. decl.code .. " of type " .. kind .. " has form " .. form) end
        return kind, form, nil
    end
    if decl.form == nil or not consts.FORMS[decl.form] then
        return nil, nil, invalid("field " .. decl.code .. " needs a type or a form", { field = decl.code })
    end
    return "value", decl.form, nil
end

local function compile_options(decl: types.FieldDecl): ({ types.Option }?, error?)
    local out: { types.Option } = {}
    local seen: { [string]: boolean } = {}
    local source = (decl.options or {})
    if #source == 0 then return nil, invalid("option field " .. decl.code .. " declares no options", { field = decl.code }) end
    for i, o in ipairs(source) do
        if type(o.id) ~= "string" or o.id == "" then return nil, invalid("option of " .. decl.code .. " needs an id", { field = decl.code }) end
        if seen[o.id] then return nil, invalid("duplicate option " .. o.id .. " on " .. decl.code, { field = decl.code }) end
        if o.category ~= nil and not consts.CATEGORIES[o.category] then
            return nil, invalid("option " .. o.id .. " has unknown category " .. tostring(o.category), { field = decl.code })
        end
        seen[o.id] = true
        out[#out + 1] = { id = o.id, label = o.label or o.id, color = o.color, order = o.order or i, category = o.category }
    end
    return out, nil
end

local NUMBER_FORMS = { int = true, dec = true, quantity = true }

local function compile_field(decl: types.FieldDecl, id: integer, entries: { types.PluginDecl }?, in_use: boolean?): (types.Field?, error?)
    if type(decl.code) ~= "string" or not valid_id(decl.code) then return nil, invalid("field code must match " .. consts.ID_PATTERN) end
    if decl.title ~= nil then
        if not decl.title:find("%S") then return nil, invalid("field title must be nonblank", { code = "field_title_blank", field = decl.code }) end
        if #decl.title > 255 then return nil, invalid("field title exceeds 255 bytes", { code = "field_title_too_long", field = decl.code }) end
    end
    local kind, form, kerr = form_of(decl, entries, in_use)
    if kerr or not kind or not form then return nil, kerr end
    local cardinality = decl.cardinality or "one"
    if not consts.CARDINALITIES[cardinality] then return nil, invalid("field " .. decl.code .. " has unknown cardinality " .. tostring(cardinality), { field = decl.code }) end
    local index = decl.index or "none"
    if not consts.INDEXES[index] then return nil, invalid("field " .. decl.code .. " has unknown index " .. tostring(index), { field = decl.code }) end
    if index == "number" and not NUMBER_FORMS[form] and kind ~= "option" then
        return nil, invalid("field " .. decl.code .. " cannot index by number", { field = decl.code })
    end
    if form == "record" and index ~= "none" then return nil, invalid("field " .. decl.code .. " has no record equality index", { field = decl.code }) end
    local config: types.FieldConfig = decl.config or {}
    if kind == "principal" then config = { target = consts.PRINCIPAL_TARGET } end
    if kind == "item" then config = { target = consts.ITEM_TARGET } end
    if kind == "formula" and type(decl.expression) ~= "string" then return nil, invalid("formula requires an expression", { code = "formula_invalid", field = decl.code }) end
    if kind == "rich_text" and config.format ~= "json" then return nil, invalid("rich_text declares config.format json", { code = "rich_text_format", field = decl.code }) end
    if (kind == "rank" or kind == "rich_text") and cardinality ~= "one" then return nil, invalid(kind .. " is a single field value") end
    local config_err = fields_validator.config(form, config)
    if config_err then return nil, config_err end
    local options: { types.Option }? = nil
    if kind == "option" then
        local oerr: error?
        options, oerr = compile_options(decl)
        if oerr then return nil, oerr end
    elseif decl.options ~= nil then
        return nil, invalid("field " .. decl.code .. " declares options but is not an option field", { field = decl.code })
    end
    if kind == "counter" and cardinality ~= "one" then return nil, invalid("counter field " .. decl.code .. " is a single value", { field = decl.code }) end
    local computed: { expression: string, depends: { integer } }? = nil
    if kind == "formula" then computed = { expression = decl.expression :: string, depends = {} } end
    return { formula = computed, access = decl.access, id = id, code = decl.code, title = decl.title, type = kind, form = form, cardinality = cardinality, config = config, options = options,
        index = index, track = decl.track == true, intervals = decl.intervals == true }, nil
end

local function compile_fields(prev: types.Compiled?, decl: types.Declaration): ({ types.Field }?, integer?, integer?, error?)
    local sources = (decl.fields or {})
    if #sources > consts.LIMITS.fields then return nil, nil, nil, invalid("a board declares at most " .. consts.LIMITS.fields .. " fields") end
    local prev_by_id: { [integer]: types.Field } = {}
    local prev_by_key: { [string]: types.Field } = {}
    for _, f in ipairs(prev and prev.fields or {}) do
        prev_by_id[f.id] = f
        prev_by_key[f.code] = f
    end
    local next_id = prev and prev.next_field_id or 1
    local out: { types.Field } = {}
    local ids: { [integer]: boolean } = {}
    local counter: integer? = nil
    local indexed = 0
    for _, fd in ipairs(sources) do
        local id: integer
        if fd.id ~= nil then
            if not prev_by_id[fd.id] then return nil, nil, nil, invalid("field id " .. tostring(fd.id) .. " is not declared on this board") end
            id = fd.id
        elseif type(fd.code) == "string" and prev_by_key[fd.code] ~= nil then
            id = (prev_by_key[fd.code] :: types.Field).id
        else
            id = next_id
            next_id = next_id + 1
        end
        local field, ferr = compile_field(fd, id, decl.plugins, prev_by_id[id] ~= nil)
        if ferr or not field then return nil, nil, nil, ferr end
        if ids[field.id] then return nil, nil, nil, invalid("field id " .. field.id .. " is declared twice") end
        ids[field.id] = true
        if field.index ~= "none" then indexed = indexed + 1 end
        if indexed > 60 then return nil, nil, nil, invalid("a board declares at most 60 indexed fields", { code = "index_limit", limit = 60 }) end
        if field.type == "counter" then
            if counter then return nil, nil, nil, invalid("a board declares at most one counter field") end
            counter = field.id
        end
        out[#out + 1] = field
    end
    table.sort(out, function(a: types.Field, b: types.Field): boolean return a.id < b.id end)
    return out, next_id, counter, nil
end

local function compile_processes(prev: types.Compiled?, decl: types.Declaration, by_key: { [string]: types.Field }, generation: integer): ({ types.Process }?, error?)
    local held: { [string]: types.Process } = {}
    for _, p in ipairs(prev and prev.processes or {}) do held[p.id] = p end
    local out: { types.Process } = {}
    for _, d in ipairs((decl.processes or {})) do
        local p, perr = process.compile(d, by_key, held[d.id], generation)
        if perr or not p then return nil, perr end
        out[#out + 1] = p
    end
    return out, nil
end

local function compile_item_types(decl: types.Declaration, fields: { [string]: types.Field }, processes: { [string]: boolean }): ({ types.ItemType }?, error?)
    local sources = (decl.item_types or {})
    if #sources > consts.LIMITS.item_types then return nil, invalid("a board declares at most " .. consts.LIMITS.item_types .. " item types") end
    local declared: { [string]: boolean } = {}
    for _, t in ipairs(sources) do declared[tostring(t.id)] = true end
    local out: { types.ItemType } = {}
    for _, t in ipairs(sources) do
        if not valid_id(t.id) then return nil, invalid("item type id must match " .. consts.ID_PATTERN) end
        if not processes[t.process] then return nil, invalid("item type " .. t.id .. " names unknown process " .. tostring(t.process), { item_type = t.id }) end
        local listed_fields = (t.fields or {})
        local in_type: { [string]: boolean } = {}
        for _, key in ipairs(listed_fields) do
            if not fields[key] then return nil, invalid("item type " .. t.id .. " lists unknown field " .. tostring(key), { item_type = t.id }) end
            in_type[key] = true
        end
        for _, key in ipairs((t.inherit or {})) do
            if not in_type[key] then return nil, invalid("item type " .. t.id .. " inherits " .. tostring(key) .. " which it does not carry", { item_type = t.id }) end
            if fields[key].type == "counter" or fields[key].type == "rollup" or fields[key].type == "rank" or fields[key].type == "formula" then return nil, invalid("a counter field cannot be inherited", { item_type = t.id }) end
        end
        for _, parent in ipairs((t.parent_types or {})) do
            if not declared[parent] then return nil, invalid("item type " .. t.id .. " names unknown parent type " .. tostring(parent), { item_type = t.id }) end
        end
        if t.move_children ~= nil and t.move_children ~= "move" and t.move_children ~= "refuse" then
            return nil, invalid("move_children takes move or refuse", { code = "move_children_invalid", item_type = t.id })
        end
        out[#out + 1] = { id = t.id, title = t.title or t.id, process = t.process, parent_types = (t.parent_types or {}),
            fields = listed_fields, inherit = (t.inherit or {}), move_children = t.move_children or "move" }
    end
    return out, nil
end

local function compile_relations(decl: types.Declaration): ({ types.Relation }?, error?)
    local out: { types.Relation } = {}
    for _, r in ipairs((decl.relation_types or {})) do
        if not valid_id(r.id) then return nil, invalid("relation type id must match " .. consts.ID_PATTERN) end
        local cardinality = r.cardinality or "many"
        if cardinality ~= "one" and cardinality ~= "many" then return nil, invalid("relation " .. r.id .. " has unknown cardinality " .. tostring(cardinality)) end
        out[#out + 1] = { id = r.id, outward = r.outward or r.id, inward = r.inward or r.id, cardinality = cardinality,
            symmetric = r.symmetric == true }
    end
    return out, nil
end

-- process_fields_carried refuses an item type that runs a process over fields it does not carry.
local function process_fields_carried(processes: { types.Process }, item_types: { types.ItemType }): error?
    local used: { [string]: { string } } = {}
    for _, p in ipairs(processes) do used[p.id] = process.fields_used(p) end
    for _, t in ipairs(item_types) do
        local carries: { [string]: boolean } = {}
        for _, key in ipairs(t.fields) do carries[key] = true end
        for _, key in ipairs(used[t.process] or {}) do
            if not carries[key] then
                return invalid("item type " .. t.id .. " runs process " .. t.process .. ", which uses field " .. key .. " the type does not carry",
                    { item_type = t.id, field = key })
            end
        end
    end
    return nil
end

-- valid_prefix reports whether text is an item key prefix.
function M.valid_prefix(text: unknown): boolean
    return type(text) == "string" and #text >= consts.KEY_PREFIX_MIN and #text <= consts.KEY_PREFIX_MAX
        and text:match(consts.KEY_PREFIX_PATTERN) ~= nil
end

-- compile turns a declaration into the model of the given generation, keeping the ids of the fields prev
-- already holds. It checks meaning; the contract checked shape.
function M.compile(prev: types.Compiled?, decl: types.Declaration, generation: integer, configs: { [string]: types.JsonObject }?, defaults: types.JsonObject?): (types.Compiled?, error?)
    if not M.valid_prefix(decl.key_prefix) then
        return nil, invalid("key_prefix must be " .. consts.KEY_PREFIX_MIN .. " to " .. consts.KEY_PREFIX_MAX .. " characters of A-Z and 0-9, starting with a letter")
    end
    local fields, next_id, counter, ferr = compile_fields(prev, decl)
    if ferr or not fields or not next_id then return nil, ferr end
    local by_key: { [string]: types.Field } = {}
    for _, f in ipairs(fields) do by_key[f.code] = f end
    local processes, perr = compile_processes(prev, decl, by_key, generation)
    if perr or not processes then return nil, perr end
    local process_ids: { [string]: boolean } = {}
    for _, p in ipairs(processes) do process_ids[p.id] = true end
    local item_types, terr = compile_item_types(decl, by_key, process_ids)
    if terr or not item_types then return nil, terr end
    local carried = process_fields_carried(processes, item_types)
    if carried then return nil, carried end
    local relations, rerr = compile_relations(decl)
    if rerr or not relations then return nil, rerr end
    local formula_err = formula.compile(fields)
    if formula_err then return nil, formula_err end
    local rollup_err = rollup.compile(fields, decl, relations)
    if rollup_err then return nil, rollup_err end
    local chosen, activation_err = plugins.compile(decl.plugins, configs)
    if activation_err then return nil, activation_err end
    for _, id in ipairs(decl.scopes or {}) do
        local err = plugins.seam(id, chosen, true, "scope")
        if err then return nil, err end
    end
    local effective_policy, policy_err = policy.effective(defaults or policy.DEFAULTS, decl.policy)
    if policy_err or not effective_policy then return nil, policy_err end
    local compiled: types.Compiled = { visibility = decl.visibility, key_prefix = decl.key_prefix :: string, fields = fields, item_types = item_types, relation_types = relations,
        processes = processes, plugins = chosen, scopes = decl.scopes or {}, policy = effective_policy, policy_overrides = decl.policy or {}, next_field_id = next_id, counter_field = counter }
    local seam_err = seams.validate(compiled)
    if seam_err then return nil, seam_err end
    local access_err = access_rules.validate(compiled)
    if access_err then return nil, access_err end
    local predicate_err = predicates.validate(compiled)
    if predicate_err then return nil, predicate_err end
    return compiled, nil
end

-- digest identifies a compiled schema.
function M.digest(compiled: types.Compiled): string
    return tostring(hash.sha256(values.canonical(compiled)))
end

return M
