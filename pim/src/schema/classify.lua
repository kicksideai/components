-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema change classification against the catalog's current state. Each
-- attribute change gets a class judged against usage: a change that would
-- reinterpret stored values is refused while values exist; it is made by adding
-- a new attribute, copying values with commands and removing the old one.
local values = require("values")
local types = require("types")
local sections = require("sections")

local M = {}

-- REPRESENTATION lists the attribute properties that define a stored value, its
-- key or its order; INDEX those that shape its index.
local REPRESENTATION = { "type", "form", "cardinality", "vocabulary", "scope" }
local REPRESENTATION_CONFIG = { "scale", "range", "case", "members", "target", "units", "canonical", "currency" }
local INDEX = { "index_contexts" }
local RANK: { [string]: integer } = { cosmetic = 1, additive = 2, semantic = 3, refused = 4 }

-- Facts are the catalog state a change is judged against.
type Facts = { usage: { [integer]: integer }, family_occupied: { [string]: boolean }, populated: boolean }
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
        next_by_id[before.id] = nil
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
    for _, attr in pairs(next_by_id) do
        add(out, attr.code, "additive", "added")
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

local function axis_ids(family: types.Family, attributes: { [string]: types.Attribute }): { { integer } }
    local out: { { integer } } = {}
    for i, level in ipairs(family.levels) do out[i] = sections.attribute_ids(attributes, level.axes) end
    return out
end

local function family_refusals(out: { types.SchemaChange }, prev: types.Compiled, next: types.Compiled, code: string,
    usage: { [integer]: integer })
    local family, after = prev.families[code], next.families[code]
    local label = "family " .. code
    if not after then
        add(out, label, "refused", "removed")
        return
    end
    if not values.equal(axis_ids(family, prev.attributes), axis_ids(after, next.attributes)) then
        add(out, label, "refused", "variation axes")
    end
    local previous_owners: { [integer]: integer } = {}
    for attr_code, level in pairs(family.owner) do previous_owners[prev.attributes[attr_code].id] = level end
    for attr_code, level in pairs(after.owner) do
        local id = next.attributes[attr_code].id
        local before = previous_owners[id]
        if before ~= nil and before ~= level and (usage[id] or 0) > 0 then
            add(out, label, "refused", attr_code .. " owning level")
        end
    end
end

function M.family_needs_occupancy(prev: types.Compiled, next: types.Compiled, code: string, usage: { [integer]: integer }): boolean
    local refusals: { types.SchemaChange } = {}
    family_refusals(refusals, prev, next, code, usage)
    return #refusals > 0
end

local function family_changes(out: { types.SchemaChange }, prev: types.Compiled, next: types.Compiled, facts: Facts)
    for code, family in pairs(prev.families) do
        local after = next.families[code]
        local label = "family " .. code
        if facts.family_occupied[code] then
            family_refusals(out, prev, next, code, facts.usage)
        elseif not after then
            add(out, label, "additive", "removed")
        end
        if after then
            if not values.equal(sections.requirement_meaning(family, prev.attributes), sections.requirement_meaning(after, next.attributes)) then
                add(out, label, "semantic", "requirements")
            end
            if not values.equal(sections.check_meaning(family, prev.attributes, false), sections.check_meaning(after, next.attributes, false)) then
                add(out, label, "semantic", "checks")
            end
            local revisions: { [string]: string } = {}
            for _, check in ipairs(family.checks) do revisions[check.fn] = check.digest end
            for _, check in ipairs(after.checks) do
                local revision = revisions[check.fn]
                if revision and revision ~= check.digest then
                    add(out, label, "semantic", "check implementation revised")
                    break
                end
            end
        end
    end
    for code in pairs(next.families) do
        if not prev.families[code] then add(out, "family " .. code, "additive", "added") end
    end
end

-- A retained attribute's position must increase as we walk the previous order.
-- Insertions, removals and renames leave this relative order intact.
local function reordered(before: types.AspectDecl, after: types.AspectDecl): boolean
    local positions: { [integer]: integer } = {}
    for i, attr in ipairs(after.attributes or {}) do
        if attr.id then positions[attr.id] = i end
    end
    local last = 0
    for _, attr in ipairs(before.attributes or {}) do
        local position = attr.id and positions[attr.id]
        if position then
            if position < last then return true end
            last = position
        end
    end
    return false
end

local function order_changes(out: { types.SchemaChange }, before: types.Declaration, after: types.Declaration)
    local previous: { [string]: types.AspectDecl } = {}
    for _, aspect in ipairs(before.aspects or {}) do previous[aspect.namespace] = aspect end
    for _, aspect in ipairs(after.aspects or {}) do
        local old = previous[aspect.namespace]
        if old and reordered(old, aspect) then add(out, "aspect " .. aspect.namespace, "cosmetic", "attribute order") end
    end
end

-- changes(prev, next, facts) lists every change with its class: attribute
-- changes, then the catalog's own sections. The stamped declarations carry form order.
function M.changes(prev: types.Compiled?, next: types.Compiled, facts: Facts,
    previous_declaration: types.Declaration?, next_declaration: types.Declaration?): { types.SchemaChange }
    local out: { types.SchemaChange } = {}
    if not prev then return out end
    for _, c in ipairs(M.attribute_changes(prev.attributes, next.attributes, facts.usage)) do
        out[#out + 1] = c
    end
    family_changes(out, prev, next, facts)
    local next_dims: { [string]: types.Dimension } = {}
    for _, d in ipairs(next.dimensions) do next_dims[d.name] = d end
    for _, d in ipairs(prev.dimensions) do
        local after = next_dims[d.name]
        next_dims[d.name] = nil
        if not after then
            add(out, "dimension " .. d.name, facts.populated and "refused" or "additive", "removed")
        else
            local added: { [string]: boolean } = {}
            for _, m in ipairs(after.members) do added[m] = true end
            for _, m in ipairs(d.members) do
                if not added[m] then add(out, "dimension " .. d.name, facts.populated and "refused" or "additive", "member " .. m .. " removed") end
                added[m] = nil
            end
            for m in pairs(added) do add(out, "dimension " .. d.name, "additive", "member " .. m .. " added") end
            if not values.equal(d.fallback, after.fallback) then add(out, "dimension " .. d.name, "semantic", "fallback") end
        end
    end
    for name in pairs(next_dims) do add(out, "dimension " .. name, "additive", "added") end
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
    for id, channel in pairs(next.channels) do
        local before = prev.channels[id]
        if not before then add(out, "channel " .. id, "additive", "added")
        elseif not values.equal(before, channel) then add(out, "channel " .. id, "semantic", "changed") end
    end
    for id in pairs(prev.channels) do
        if not next.channels[id] then add(out, "channel " .. id, "semantic", "removed") end
    end
    for id, s in pairs(next.sources) do
        local before = prev.sources[id]
        if not before then add(out, "source " .. id, "additive", "added")
        elseif before.audit ~= s.audit then add(out, "source " .. id, "cosmetic", "audit") end
    end
    table.sort(out, function(a, b) return a.code .. a.what < b.code .. b.what end)
    if previous_declaration and next_declaration then
        order_changes(out, previous_declaration, next_declaration)
    end
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
