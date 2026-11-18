-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The generated item table: each live item's row, computed from its lineage.
local resolve = require("resolve")
local values = require("values")
local evaluate = require("evaluate")
local checks = require("checks")
local layout = require("layout")
local store = require("store")
local types = require("types")
local search = require("search")

local M = {}

type IdSet = { [string]: boolean }

-- item_row computes the generated row of one item from its lineage.
local function item_row(compiled: types.Compiled, item: types.Product, lineage: types.Lineage): (types.ItemRow?, error?)
    local columns = compiled.layout
    local by_id = compiled.by_id or {}
    local row: types.ItemRow = { id = item.product_id, system = {}, values = {}, sets = {}, flags = {} }
    local open: { [string]: { types.Finding } } = {}
    local readiness = evaluate.item(compiled, item, lineage, checks.run, "interactive")
    for _, c in ipairs(columns.flags) do
        local findings = readiness[c.ctx]
        if findings then
            row.flags[c.column] = #findings == 0 and 1 or 0
            if #findings > 0 then open[c.ctx] = findings end
        end
    end
    row.system = { root_id = item.root_id, family = item.family, status = item.status, version = item.version,
        updated_seq = item.updated_seq or 0, findings = values.canonical(open), sku_fold = search.fold(item.sku) }
    for _, c in ipairs(columns.columns) do
        local attr = by_id[c.attribute_id]
        local r = resolve.resolve(compiled, item, lineage, attr, resolve.parse_ctx(c.ctx))
        if r.value ~= nil then
            local v: types.ColumnValue?
            local verr: error?
            if c.kind == "number" then
                v, verr = values.order(attr.form, values.scalar(r.value), attr.config)
            else
                v, verr = values.key(attr.form, values.scalar(r.value), attr.config)
            end
            if verr then return nil, errors.wrap(verr, attr.code .. " of " .. item.product_id .. " does not fit its index") end
            row.values[c.column] = v
        end
    end
    for _, c in ipairs(columns.sets) do
        local attr = by_id[c.attribute_id]
        local r = resolve.resolve(compiled, item, lineage, attr, resolve.parse_ctx(c.ctx))
        if r.value ~= nil then
            local keys = {}
            for _, member in ipairs(values.members(attr, r.value)) do
                local k, kerr = values.key(attr.form, member, attr.config)
                if kerr then return nil, errors.wrap(kerr, attr.code .. " of " .. item.product_id .. " does not fit its index") end
                if k then keys[#keys + 1] = k end
            end
            row.sets[c.column] = keys
        end
    end
    local text = {}
    for _, c in ipairs(columns.search) do
        local attr = by_id[c.attribute_id]
        local r = resolve.resolve(compiled, item, lineage, attr, resolve.parse_ctx(c.ctx))
        if r.value ~= nil then
            for _, member in ipairs(values.members(attr, r.value)) do
                if type(member) == "string" then text[#text + 1] = member end
            end
        end
    end
    row.text = table.concat(text, " ")
    return row, nil
end

-- recompute rewrites the generated rows of the given items in bulk: live items
-- get fresh rows, all others lose theirs. cache holds products the caller
-- already loaded or changed; the rest are read in bulk.
function M.recompute(tx: types.Executor, dialect: string, catalog: types.Catalog, ids: IdSet, cache: { [string]: types.Product }?): error?
    local compiled = catalog.compiled
    local known: { [string]: types.Product } = cache or {}
    local missing: { string } = {}
    for id in pairs(ids) do if not known[id] then missing[#missing + 1] = id end end
    local loaded, lerr = store.products(tx, catalog.catalog_id, missing)
    if lerr or not loaded then return lerr end
    for _, p in ipairs(loaded) do known[p.product_id] = p end
    local rows: { types.ItemRow } = {}
    local gone: { string } = {}
    local order: { string } = {}
    for id in pairs(ids) do order[#order + 1] = id end
    table.sort(order)
    for _, id in ipairs(order) do
        local item = known[id]
        if item and item.is_item == 1 and item.state == "live" then
            local path, perr = store.lineage(tx, catalog.catalog_id, item, known)
            if perr or not path then return perr end
            local row, rerr = item_row(compiled, item, path)
            if rerr or not row then return rerr end
            rows[#rows + 1] = row
        else
            gone[#gone + 1] = id
        end
    end
    local function write(t: types.Table): error?
        local err = layout.delete_rows(tx, dialect, t, gone)
        if not err then err = layout.write_rows(tx, dialect, t, rows, compiled.layout) end
        return err
    end
    local err = write(layout.active(catalog))
    local other = catalog.rebuild_storage and catalog.rebuild_storage.other
    if not err and other and not other.retired then err = write(layout.of(other.base, other.layout)) end
    return err
end

return M
