-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema changes preserve field forms and classify other representation changes against usage.
local rollup = require("rollup")
local values = require("values")
local process_changes = require("process_changes")
local types = require("types")

local M = {}

-- These field properties define a stored value, its key or its order.
local REPRESENTATION = { "type", "form", "cardinality" }
local REPRESENTATION_CONFIG = { "scale", "range", "case", "members", "target", "units", "canonical", "currency" }
-- These field properties shape the generated index.
local INDEX_SHAPE = { "track", "intervals", "access" }
local RANK: { [string]: integer } = { cosmetic = 1, additive = 2, semantic = 3, refused = 4 }

local function change(out: { types.SchemaChange }, kind: string, what: string, id: string?, class: string, detail: string?)
    out[#out + 1] = { code = kind == "field" and (id or "") or kind .. (id and (" " .. id) or ""), what = what, class = class, detail = detail }
end

local function same(a: unknown, b: unknown): boolean
    return values.equal(a, b)
end

local function diff_options(out: { types.SchemaChange }, old: types.Field, new: types.Field, usage: types.Usage)
    local new_by: { [string]: types.Option } = {}
    for _, o in ipairs(new.options or {}) do new_by[o.id] = o end
    local old_by: { [string]: types.Option } = {}
    for _, o in ipairs(old.options or {}) do
        old_by[o.id] = o
        local n = new_by[o.id]
        if not n then
            change(out, "field", "options.remove", old.code, (usage.fields[old.id] or 0) > 0 and "refused" or "semantic", o.id)
        elseif not same(o, n) then
            change(out, "field", "options.change", old.code, o.category ~= n.category and "semantic" or "cosmetic", o.id)
        end
    end
    for _, o in ipairs(new.options or {}) do
        if not old_by[o.id] then change(out, "field", "options.add", new.code, "additive", o.id) end
    end
end

-- field_ids maps field codes to the stable ids an item type carries.
local function field_ids(compiled: types.Compiled, keys: { string }): { integer }
    local by_key: { [string]: integer } = {}
    for _, f in ipairs(compiled.fields) do by_key[f.code] = f.id end
    local out: { integer } = {}
    for i, key in ipairs(keys) do out[i] = by_key[key] or 0 end
    return out
end

local function diff_item_types(out: { types.SchemaChange }, prev: types.Compiled, next: types.Compiled, usage: types.Usage)
    local old_by: { [string]: types.ItemType } = {}
    local new_by: { [string]: types.ItemType } = {}
    for _, t in ipairs(next.item_types) do new_by[t.id] = t end
    for _, old in ipairs(prev.item_types) do
        old_by[old.id] = old
        local new = new_by[old.id]
        if not new then
            change(out, "item_type", "remove", old.id, (usage.types[old.id] or 0) > 0 and "refused" or "semantic")
        else
            if old.process ~= new.process then change(out, "item_type", "process", old.id, "refused") end
            if not same(old.parent_types, new.parent_types) or not same(field_ids(prev, old.fields), field_ids(next, new.fields))
                or not same(field_ids(prev, old.inherit), field_ids(next, new.inherit)) then
                local additive = same(old.parent_types, new.parent_types) and same(field_ids(prev, old.inherit), field_ids(next, new.inherit))
                local before, after = field_ids(prev, old.fields), field_ids(next, new.fields)
                additive = additive and #after > #before
                for i, id in ipairs(before) do if after[i] ~= id then additive = false end end
                change(out, "item_type", "shape", old.id, additive and "additive" or "semantic")
            end
            if old.title ~= new.title then change(out, "item_type", "title", old.id, "cosmetic") end
        end
    end
    for _, t in ipairs(next.item_types) do
        if not old_by[t.id] then change(out, "item_type", "add", t.id, "additive") end
    end
end

local function diff_relations(out: { types.SchemaChange }, prev: types.Compiled, next: types.Compiled, usage: types.Usage)
    local old_by: { [string]: types.Relation } = {}
    local new_by: { [string]: types.Relation } = {}
    for _, r in ipairs(next.relation_types) do new_by[r.id] = r end
    for _, old in ipairs(prev.relation_types) do
        old_by[old.id] = old
        local new = new_by[old.id]
        local used = (usage.links[old.id] or 0) > 0
        if not new then
            change(out, "relation", "remove", old.id, used and "refused" or "semantic")
        elseif old.symmetric ~= new.symmetric or old.cardinality ~= new.cardinality then
            change(out, "relation", "shape", old.id, used and "refused" or "semantic")
        elseif old.outward ~= new.outward or old.inward ~= new.inward then
            change(out, "relation", "label", old.id, "cosmetic")
        end
    end
    for _, r in ipairs(next.relation_types) do
        if not old_by[r.id] then change(out, "relation", "add", r.id, "additive") end
    end
end

-- field_changes lists the classified changes between two field sets; usage counts the
-- items holding each field id.
function M.field_changes(prev: { [string]: types.Field }, next: { [string]: types.Field }, usage: { [integer]: integer }): { types.SchemaChange }
    local out: { types.SchemaChange } = {}
    local function add(code: string, class: string, what: string)
        out[#out + 1] = { code = code, class = class, what = what }
    end
    local next_by_id: { [integer]: types.Field } = {}
    for _, a in pairs(next) do next_by_id[a.id] = a end
    for code, before in pairs(prev) do
        local attr = next_by_id[before.id]
        local used = (usage[before.id] or 0) > 0
        if not attr then
            add(code, used and "semantic" or "additive", "removed")
        else
            local was = before :: { [string]: unknown }
            local now = attr :: { [string]: unknown }
            if attr.title ~= before.title then add(attr.code, "cosmetic", "title") end
            if attr.code ~= before.code then add(attr.code, "cosmetic", "renamed from " .. before.code) end
            for _, f in ipairs(REPRESENTATION) do
                if not same(was[f], now[f]) then add(attr.code, (f == "form" or used) and "refused" or "additive", f) end
            end
            for _, f in ipairs(REPRESENTATION_CONFIG) do
                local a = (before.config :: { [string]: unknown })[f]
                local b = (attr.config :: { [string]: unknown })[f]
                if not same(a, b) then add(attr.code, used and "refused" or "additive", "config." .. f) end
            end
            local reindexed = before.index ~= attr.index
            for _, f in ipairs(INDEX_SHAPE) do
                if not same(was[f], now[f]) then reindexed = true end
            end
            if reindexed then add(attr.code, "semantic", "index") end
        end
    end
    for code, attr in pairs(next) do
        local known = false
        for _, before in pairs(prev) do if before.id == attr.id then known = true end end
        if not known then add(code, "additive", "added") end
    end
    return out
end

-- highest returns the highest class in a change list; an empty list is cosmetic.
function M.highest(changes: { types.SchemaChange }): string
    local class = "cosmetic"
    for _, c in ipairs(changes) do
        if RANK[c.class] > RANK[class] then class = c.class end
    end
    return class
end

-- changes lists how next differs from prev, each classified against usage:
-- cosmetic, additive, semantic, or refused when stored values would change meaning.
function M.changes(prev: types.Compiled?, next: types.Compiled, usage: types.Usage, maps: { [string]: { [string]: string } }): { types.SchemaChange }
    local out: { types.SchemaChange } = {}
    if not prev then return out end
    if not same(prev.visibility, next.visibility) then change(out, "schema", "visibility", nil, "semantic") end
    if prev.key_prefix ~= next.key_prefix then change(out, "schema", "key_prefix", nil, "semantic", prev.key_prefix) end
    if not same(prev.policy, next.policy) then change(out, "schema", "policy", nil, "cosmetic") end
    if not same(prev.plugins or {}, next.plugins or {}) then change(out, "schema", "plugins", nil, "cosmetic") end
    if not same(prev.scopes or {}, next.scopes or {}) then change(out, "schema", "scopes", nil, "cosmetic") end
    local before: { [string]: types.Field } = {}
    local after: { [string]: types.Field } = {}
    for _, f in ipairs(prev.fields) do before[f.code] = f end
    for _, f in ipairs(next.fields) do after[f.code] = f end
    local stored_usage: { [integer]: integer } = {}
    for id, count in pairs(usage.fields) do stored_usage[id] = count end
    for _, old in ipairs(prev.fields) do
        for _, new in ipairs(next.fields) do
            if old.id == new.id and old.rollup and new.rollup then stored_usage[old.id] = 0 end
        end
    end
    for _, c in ipairs(M.field_changes(before, after, stored_usage)) do out[#out + 1] = c end
    for _, old in ipairs(prev.fields) do
        for _, new in ipairs(next.fields) do
            if old.id == new.id and old.type == "option" and new.type == "option" then diff_options(out, old, new, usage) end
        end
    end
    if usage.items > 0 and rollup.changed(prev, next) then
        change(out, "schema", "rollup.recompute", nil, "semantic")
    end
    diff_item_types(out, prev, next, usage)
    process_changes.changes(out, prev, next, usage, maps)
    diff_relations(out, prev, next, usage)
    table.sort(out, function(a, b) return a.code .. a.what < b.code .. b.what end)
    return out
end

-- classify returns the strongest class among changes. A compiled difference no change names is semantic.
function M.classify(prev: types.Compiled?, changes: { types.SchemaChange }): string
    if not prev then return "initial" end
    if #changes == 0 then return "semantic" end
    return M.highest(changes)
end

return M
