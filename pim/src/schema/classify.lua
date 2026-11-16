-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema change classification against the catalog's current state. Each
-- attribute change gets a class judged against usage: a change that would
-- reinterpret stored values is refused while values exist; it is made by adding
-- a new attribute, copying values with commands and removing the old one.
local values = require("values")
local types = require("types")

local M = {}

-- REPRESENTATION lists the attribute properties that define a stored value, its
-- key or its order; INDEX those that shape its index.
local REPRESENTATION = { "type", "form", "cardinality", "vocabulary", "scope" }
local REPRESENTATION_CONFIG = { "scale", "range", "case", "members", "target", "units", "canonical", "currency" }
local INDEX = { "index_contexts" }
local RANK: { [string]: integer } = { cosmetic = 1, additive = 2, semantic = 3, refused = 4 }

-- Facts are the catalog state a change is judged against.
type Facts = { usage: { [integer]: integer }, family_products: { [string]: integer }, populated: boolean }
M.Facts = Facts

local function add(out: { types.SchemaChange }, code: string, class: string, what: string)
    out[#out + 1] = { code = code, class = class, what = what }
end

-- attribute_changes lists the classified changes between two compiled attribute
-- sets. usage counts the products holding each attribute id.
function M.attribute_changes(prev: { [string]: types.Attribute }, next: { [string]: types.Attribute }, usage: { [integer]: integer }): { types.SchemaChange }
    local out: { types.SchemaChange } = {}
    local next_by_id: { [integer]: types.Attribute } = {}
    for _, a in pairs(next) do next_by_id[a.id] = a end
    for code, before in pairs(prev) do
        local attr = next_by_id[before.id]
        local used = (usage[before.id] or 0) > 0
        if not attr then
            add(out, code, used and "semantic" or "additive", "removed")
        else
            local was = before :: { [string]: unknown }
            local now = attr :: { [string]: unknown }
            if attr.code ~= before.code then add(out, attr.code, "cosmetic", "renamed from " .. before.code) end
            if before.width ~= attr.width then add(out, attr.code, "cosmetic", "width") end
            if before.unique ~= attr.unique then add(out, attr.code, (attr.unique and used) and "refused" or "semantic", "unique") end
            for _, f in ipairs(REPRESENTATION) do
                if not values.equal(was[f], now[f]) then add(out, attr.code, used and "refused" or "additive", f) end
            end
            for _, f in ipairs(REPRESENTATION_CONFIG) do
                local a = (before.config :: { [string]: unknown })[f]
                local b = (attr.config :: { [string]: unknown })[f]
                if not values.equal(a, b) then add(out, attr.code, used and "refused" or "additive", "config." .. f) end
            end
            if not values.equal(before.default, attr.default) then add(out, attr.code, "semantic", "default") end
            local reindexed = before.index ~= attr.index
            for _, f in ipairs(INDEX) do
                if not values.equal(was[f], now[f]) then reindexed = true end
            end
            if reindexed then add(out, attr.code, "semantic", "index") end
        end
    end
    for code, attr in pairs(next) do
        local known = false
        for _, before in pairs(prev) do if before.id == attr.id then known = true end end
        if not known then add(out, code, "additive", "added") end
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

-- changes(prev, next, facts) lists every change with its class: attribute
-- changes, then the catalog's own sections.
function M.changes(prev: types.Compiled?, next: types.Compiled, facts: Facts): { types.SchemaChange }
    local out: { types.SchemaChange } = {}
    if not prev then return out end
    for _, c in ipairs(M.attribute_changes(prev.attributes, next.attributes, facts.usage)) do
        out[#out + 1] = c
    end
    for code, family in pairs(prev.families) do
        local after = next.families[code]
        local products = facts.family_products[code] or 0
        if not after then
            add(out, "family " .. code, products > 0 and "refused" or "additive", "removed")
        elseif products > 0 then
            if not values.equal(family.levels, after.levels) then add(out, "family " .. code, "refused", "variation axes") end
            for attr_code, level in pairs(after.owner) do
                local attr = next.attributes[attr_code]
                local before = family.owner[attr_code]
                if before ~= nil and before ~= level and attr and (facts.usage[attr.id] or 0) > 0 then
                    add(out, "family " .. code, "refused", attr_code .. " owning level")
                end
            end
        end
    end
    local next_dims: { [string]: types.Dimension } = {}
    for _, d in ipairs(next.dimensions) do next_dims[d.name] = d end
    for _, d in ipairs(prev.dimensions) do
        local after = next_dims[d.name]
        if not after then
            add(out, "dimension " .. d.name, facts.populated and "refused" or "additive", "removed")
        else
            local kept: { [string]: boolean } = {}
            for _, m in ipairs(after.members) do kept[m] = true end
            for _, m in ipairs(d.members) do
                if not kept[m] then add(out, "dimension " .. d.name, facts.populated and "refused" or "additive", "member " .. m .. " removed") end
            end
            if not values.equal(d.fallback, after.fallback) then add(out, "dimension " .. d.name, "semantic", "fallback") end
        end
    end
    if not values.equal(prev.policy or {}, next.policy or {}) then add(out, "policy", "cosmetic", "catalog policy") end
    for id in pairs(next.scopes or {}) do
        if not (prev.scopes or {})[id] then add(out, "scope " .. id, "cosmetic", "adopted") end
    end
    for id in pairs(prev.scopes or {}) do
        if not (next.scopes or {})[id] then add(out, "scope " .. id, "cosmetic", "dropped") end
    end
    for id, entry in pairs(next.plugins or {}) do
        local before = (prev.plugins or {})[id]
        if before == nil then add(out, "plugin " .. id, "cosmetic", "chosen")
        elseif not values.equal(before, entry) then add(out, "plugin " .. id, "cosmetic", "changed") end
    end
    for id in pairs(prev.plugins or {}) do
        if not (next.plugins or {})[id] then add(out, "plugin " .. id, "cosmetic", "removed") end
    end
    for code in pairs(next.vocabularies) do
        if not prev.vocabularies[code] then add(out, "vocabulary " .. code, "additive", "added") end
    end
    for id, s in pairs(next.sources) do
        local before = prev.sources[id]
        if before and before.audit ~= s.audit then add(out, "source " .. id, "cosmetic", "audit") end
    end
    table.sort(out, function(a, b) return a.code .. a.what < b.code .. b.what end)
    return out
end

-- classify returns the class of a change set: initial, cosmetic, additive,
-- semantic or refused.
function M.classify(prev: types.Compiled?, next: types.Compiled, changes: { types.SchemaChange }): string
    if not prev then return "initial" end
    local class = M.highest(changes)
    if class == "cosmetic" and (prev.digest ~= next.digest or prev.layout_digest ~= next.layout_digest) then class = "semantic" end
    return class
end

return M
