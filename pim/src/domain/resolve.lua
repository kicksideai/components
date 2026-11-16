-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The single resolver (spec 2.6): owning level, fallback candidates, cleared stops.
local schema = require("schema")
local types = require("types")

local M = {}

local function dim_named(compiled: types.Compiled, name: string): types.Dimension
    for _, d in ipairs(compiled.dimensions) do
        if d.name == name then return d end
    end
    error(errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "unknown dimension " .. name }))
end

-- candidates(compiled, attr, ctx) lists context keys in resolution order. ctx maps a
-- dimension to a requested member, or "*"; a missing dimension requests "*".
function M.candidates(compiled: types.Compiled, attr: types.Attribute, ctx: types.Ctx?): { string }
    local scope = attr.scope
    if #scope == 0 then return { "" } end
    local requested: types.Ctx = ctx or {}
    local chains: { { string } } = {}
    for i, name in ipairs(scope) do
        chains[i] = schema.chain(dim_named(compiled, name), requested[name] or "*")
    end
    local out: { string } = {}
    local function expand(i: integer, parts: { string })
        if i > #scope then
            out[#out + 1] = table.concat(parts, ";")
            return
        end
        for _, member in ipairs(chains[i]) do
            parts[i] = scope[i] .. "=" .. member
            expand(i + 1, parts)
        end
        parts[i] = nil
    end
    expand(1, {})
    return out
end

-- parse_ctx turns a stored context key back into a tuple.
function M.parse_ctx(key: string): types.Ctx
    local out: types.Ctx = {}
    for part in key:gmatch("[^;]+") do
        local name, member = part:match("^([^=]+)=(.*)$")
        if name and member then out[name] = member end
    end
    return out
end

-- owner returns the product owning attr for this product, and nil for an
-- attribute that applies at another level.
function M.owner(compiled: types.Compiled, product: types.Product, lineage: types.Lineage, attr: types.Attribute): types.Product?
    local family = compiled.families[product.family]
    local level = family and family.owner[attr.code]
    if level == nil or level > product.level then return nil end
    return lineage[level]
end

function M.resolve(compiled: types.Compiled, product: types.Product, lineage: types.Lineage, attr: types.Attribute, ctx: types.Ctx?): types.Resolution
    local owner = M.owner(compiled, product, lineage, attr)
    if not owner then return { state = "not_applicable" } end
    local inherited = owner.product_id ~= product.product_id
    local coords: types.Coordinates = owner.document[tostring(attr.id)] or {}
    for i, key in ipairs(M.candidates(compiled, attr, ctx)) do
        local cell = coords[key]
        if cell ~= nil then
            if cell.c then return { state = "cleared", owner = owner, ctx = key, inherited = inherited } end
            return { state = inherited and "inherited" or (i > 1 and "fallback" or "own"), value = cell.p,
                owner = owner, ctx = key, source = cell.s, inherited = inherited, fallback = i > 1 }
        end
    end
    if attr.default ~= nil then return { state = "default", value = attr.default, owner = owner, inherited = inherited } end
    return { state = "absent", owner = owner, inherited = inherited }
end

return M
