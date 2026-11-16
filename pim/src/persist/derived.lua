-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Rows derived from product documents: the ref and unique rows of each product
-- and the per-attribute usage counters.
local values = require("values")
local bulk = require("bulk")
local types = require("types")
local references = require("references")

local M = {}

type RefRow = { attribute_id: integer, ctx: string, path: string, kind: string, target: string }
type UniqueRow = { attribute_id: integer, key: string }
-- Touched names the products whose derived rows change, in their final state.
type Touched = { derived: { [string]: boolean }, cache: { [string]: types.Product } }

-- usage_delta adds a product's change of held attributes to the batch.
function M.usage_delta(usage: { [integer]: integer }, before: { [integer]: boolean }, after: { [integer]: boolean })
    for id in pairs(before) do if not after[id] then usage[id] = (usage[id] or 0) - 1 end end
    for id in pairs(after) do if not before[id] then usage[id] = (usage[id] or 0) + 1 end end
end

function M.derived_rows(compiled: types.Compiled, product: types.Product): ({ RefRow }?, { UniqueRow }?, error?)
    local refs: { RefRow } = {}
    local uniques: { UniqueRow } = {}
    local by_id = compiled.by_id or {}
    for key, coords in pairs(product.document) do
        local attr = by_id[math.tointeger(tonumber(key)) or 0]
        if attr then
            for ctx, cell in pairs(coords) do
                if cell.p ~= nil then
                    for _, occurrence in ipairs(references.collect(attr, cell.p)) do
                        local ref = occurrence.value.ref
                        refs[#refs + 1] = { attribute_id = attr.id, ctx = ctx, path = occurrence.path,
                            kind = ref[1], target = ref[2] }
                    end
                    if attr.unique then
                        local k, kerr = values.key(attr.form, values.scalar(cell.p), attr.config)
                        if kerr then return nil, nil, errors.wrap(kerr, attr.code .. " of " .. product.product_id .. " has no unique key") end
                        if k then uniques[#uniques + 1] = { attribute_id = attr.id, key = k } end
                    end
                end
            end
        end
    end
    return refs, uniques, nil
end

-- flush_derived replaces the ref and unique rows of every product the batch
-- touched with rows from its final state.
function M.flush_derived(tx: types.Executor, catalog_id: string, compiled: types.Compiled, batch: Touched): error?
    local ids: { string } = {}
    for id in pairs(batch.derived) do ids[#ids + 1] = id end
    table.sort(ids)
    local scope = "catalog_id = $1"
    local err = bulk.delete_in(tx, "kickside_pim_ref", scope, { catalog_id }, "product_id", ids)
    if not err then err = bulk.delete_in(tx, "kickside_pim_unique_value", scope, { catalog_id }, "product_id", ids) end
    if err then return err end
    local ref_rows: { types.SqlParams } = {}
    local unique_rows: { types.SqlParams } = {}
    for _, id in ipairs(ids) do
        local product = batch.cache[id]
        if product and product.state == "live" then
            local refs, uniques, derr = M.derived_rows(compiled, product)
            if derr or not refs or not uniques then return derr end
            for _, r in ipairs(refs) do ref_rows[#ref_rows + 1] = { catalog_id, id, r.attribute_id, r.ctx, r.path, r.kind, r.target } end
            for _, u in ipairs(uniques) do unique_rows[#unique_rows + 1] = { catalog_id, u.attribute_id, u.key, id } end
        end
    end
    err = bulk.insert(tx, "kickside_pim_ref", { { name = "catalog_id" }, { name = "product_id" }, { name = "attribute_id" },
        { name = "ctx" }, { name = "path" }, { name = "kind" }, { name = "target" } }, ref_rows)
    if not err then
        err = bulk.insert(tx, "kickside_pim_unique_value", { { name = "catalog_id" }, { name = "attribute_id" }, { name = "value_key" },
            { name = "product_id" } }, unique_rows)
    end
    return err
end

-- flush_usage applies the batch's usage deltas, one upsert per chunk.
function M.flush_usage(tx: types.Executor, catalog_id: string, usage: { [integer]: integer }): error?
    local rows: { types.SqlParams } = {}
    for id, delta in pairs(usage) do
        if delta ~= 0 then rows[#rows + 1] = { catalog_id, id, delta } end
    end
    return bulk.insert(tx, "kickside_pim_attribute_usage", { { name = "catalog_id" }, { name = "attribute_id" }, { name = "products" } },
        rows, " ON CONFLICT (catalog_id, attribute_id) DO UPDATE SET products = kickside_pim_attribute_usage.products + excluded.products")
end

return M
