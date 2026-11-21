-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Rows derived from product documents: the ref and unique rows of each product
-- and the per-attribute usage counters.
local values = require("values")
local bulk = require("bulk")
local types = require("types")
local references = require("references")
local asset_rows = require("asset_rows")

local M = {}

type RefRow = { attribute_id: integer, ctx: string, path: string, kind: string, target: string }
type UniqueRow = { attribute_id: integer, key: string }
-- Touched names the products whose derived rows change, in their final state.
type Touched = { derived: { [string]: boolean }, cache: { [string]: types.Product } }

type Usage = { [integer]: types.AttributeUsage }
M.Usage = Usage

-- usage_delta adds a product's change of held and incompatible attributes to the batch.
function M.usage_delta(usage: Usage, before: Usage, after: Usage)
    local zero: types.AttributeUsage = { products = 0, key_violations = 0, order_violations = 0 }
    local function add(id: integer, previous: types.AttributeUsage, current: types.AttributeUsage)
        local products = current.products - previous.products
        local keys = current.key_violations - previous.key_violations
        local orders = current.order_violations - previous.order_violations
        if products == 0 and keys == 0 and orders == 0 then return end
        local delta = usage[id] or { products = 0, key_violations = 0, order_violations = 0 }
        delta.products = delta.products + products
        delta.key_violations = delta.key_violations + keys
        delta.order_violations = delta.order_violations + orders
        usage[id] = delta
    end
    for id, previous in pairs(before) do add(id, previous, after[id] or zero) end
    for id, current in pairs(after) do if not before[id] then add(id, zero, current) end end
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
    local removed: { [string]: boolean } = {}
    local used: { [string]: boolean } = {}
    local has_assets = compiled.has_assets == true
    if has_assets and #ids > 0 then
        local old, err = asset_rows.products(tx, catalog_id, ids)
        if err or not old then return err end
        removed = old
    end
    local err = bulk.delete_in(tx, "kickside_pim_ref", scope, { catalog_id }, "product_id", ids)
    if not err then err = bulk.delete_in(tx, "kickside_pim_unique_value", scope, { catalog_id }, "product_id", ids) end
    if err then return err end
    local ref_rows: { types.SqlParams } = {}
    local unique_rows: { types.SqlParams } = {}
    for _, id in ipairs(ids) do
        local product = batch.cache[id]
        if product and (product.state == "live" or (has_assets and product.state == "trashed")) then
            local refs, uniques, derr = M.derived_rows(compiled, product)
            if derr or not refs or not uniques then return derr end
            for _, r in ipairs(refs) do
                if product.state == "live" or r.kind == "asset" then
                    ref_rows[#ref_rows + 1] = { catalog_id, id, r.attribute_id, r.ctx, r.path, r.kind, r.target }
                    if r.kind == "asset" then used[r.target] = true end
                end
            end
            if product.state == "live" then
                for _, u in ipairs(uniques) do unique_rows[#unique_rows + 1] = { catalog_id, u.attribute_id, u.key, id } end
            end
        end
    end
    err = bulk.insert(tx, "kickside_pim_ref", { { name = "catalog_id" }, { name = "product_id" }, { name = "attribute_id" },
        { name = "ctx" }, { name = "path" }, { name = "kind" }, { name = "target" } }, ref_rows)
    if not err then
        err = bulk.insert(tx, "kickside_pim_unique_value", { { name = "catalog_id" }, { name = "attribute_id" }, { name = "value_key" },
            { name = "product_id" } }, unique_rows)
    end
    for id in pairs(used) do
        if removed[id] then
            removed[id] = nil
            used[id] = nil
        end
    end
    if not err and next(used) then err = asset_rows.protect(tx, catalog_id, used) end
    if not err and next(removed) then err = asset_rows.schedule(tx, catalog_id, removed) end
    return err
end

-- flush_usage applies the batch's usage deltas, one upsert per chunk.
function M.flush_usage(tx: types.Executor, catalog_id: string, usage: Usage): error?
    local rows: { types.SqlParams } = {}
    for id, delta in pairs(usage) do
        if delta.products ~= 0 or delta.key_violations ~= 0 or delta.order_violations ~= 0 then
            rows[#rows + 1] = { catalog_id, id, delta.products, delta.key_violations, delta.order_violations }
        end
    end
    return bulk.insert(tx, "kickside_pim_attribute_usage", { { name = "catalog_id" }, { name = "attribute_id" },
        { name = "products" }, { name = "key_violations" }, { name = "order_violations" } },
        rows, [[ ON CONFLICT (catalog_id, attribute_id) DO UPDATE SET
            products = kickside_pim_attribute_usage.products + excluded.products,
            key_violations = kickside_pim_attribute_usage.key_violations + excluded.key_violations,
            order_violations = kickside_pim_attribute_usage.order_violations + excluded.order_violations]])
end

return M
