-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Release snapshot: every applicable attribute resolved in every served context
-- (each member combination of its scope), plus identity. Self-contained: a
-- channel needs nothing else to read it.
local resolve = require("resolve")
local types = require("types")
local references = require("references")

local M = {}


local function served(compiled: types.Compiled, scope: { string }): { types.Ctx }
    local out: { types.Ctx } = { {} }
    for _, name in ipairs(scope) do
        local members: { string } = {}
        for _, d in ipairs(compiled.dimensions) do
            if d.name == name then members = d.members end
        end
        local next_out: { types.Ctx } = {}
        for _, base in ipairs(out) do
            for _, m in ipairs(members) do
                local t: types.Ctx = {}
                for k, v in pairs(base) do t[k] = v end
                t[name] = m
                next_out[#next_out + 1] = t
            end
        end
        out = next_out
    end
    return out
end

local function key(ctx: types.Ctx, scope: { string }): string
    local parts: { string } = {}
    for _, name in ipairs(scope) do parts[#parts + 1] = name .. "=" .. ctx[name] end
    return table.concat(parts, ";")
end

-- values_for resolves the given attributes in every served context.
function M.values_for(compiled: types.Compiled, item: types.Product, lineage: types.Lineage, codes: { string }): { [string]: types.ContextValues }
    local out: { [string]: types.ContextValues } = {}
    for _, code in ipairs(codes) do
        local attr = compiled.attributes[code]
        if attr and resolve.owner(compiled, item, lineage, attr) then
            local by_ctx: types.ContextValues = {}
            for _, ctx in ipairs(served(compiled, attr.scope)) do
                local r = resolve.resolve(compiled, item, lineage, attr, ctx)
                if r.value ~= nil then by_ctx[key(ctx, attr.scope)] = r.value end
            end
            out[code] = by_ctx
        end
    end
    return out
end

-- build returns the snapshot with the term refs (vocabulary:code) and the link
-- refs per kind it carries, for the release to label.
function M.build(compiled: types.Compiled, item: types.Product, lineage: types.Lineage): (types.Snapshot, { [string]: boolean }, { [string]: { [string]: boolean } })
    local snap: types.Snapshot = { product_id = item.product_id, sku = item.sku, family = item.family, parent_id = item.parent_id,
        root_id = item.root_id, level = item.level, version = item.version, status = item.status, values = {}, terms = {} }
    local refs: { [string]: boolean } = {}
    local linked: { [string]: { [string]: boolean } } = {}
    for code, attr in pairs(compiled.attributes) do
        if resolve.owner(compiled, item, lineage, attr) then
            local by_ctx: types.ContextValues = {}
            local provided = false
            for _, ctx in ipairs(served(compiled, attr.scope)) do
                local r = resolve.resolve(compiled, item, lineage, attr, ctx)
                if r.value ~= nil then
                    by_ctx[key(ctx, attr.scope)] = r.value
                    provided = true
                    for _, occurrence in ipairs(references.collect(attr, r.value)) do
                        local ref = occurrence.value.ref
                        if ref[1] == "term" then refs[ref[2]] = true
                        elseif ref[1] ~= "product" then
                            linked[ref[1]] = linked[ref[1]] or {}
                            linked[ref[1]][ref[2]] = true
                        end
                    end
                end
            end
            if provided then snap.values[code] = by_ctx end
        end
    end
    return snap, refs, linked
end

return M
