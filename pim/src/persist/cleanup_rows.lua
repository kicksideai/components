-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Bounded deletion of catalog-owned rows, including generated tables.
local store = require("store")
local layout = require("layout")
local types = require("types")
local sql = require("sql")
local M = {}

type Table = { name: string, keys: string }
local TABLES: { Table } = {
    {name="kickside_pim_import_map",keys="old_id"},
    {name="kickside_pim_import_work",keys="catalog_id"},
    {name="kickside_pim_receipt",keys="marker"},
    {name="kickside_pim_creation",keys="component_id"},
    { name = "kickside_pim_schema_work", keys = "seq" },
    { name = "kickside_pim_release_job", keys = "request_id" },
    { name = "kickside_pim_change", keys = "seq, n" },
    { name = "kickside_pim_proposal", keys = "proposal_id" },
    { name = "kickside_pim_publication", keys = "channel, product_id" },
    { name = "kickside_pim_publication_floor", keys = "channel" },
    { name = "kickside_pim_release", keys = "release_id" },
    { name = "kickside_pim_attribute_usage", keys = "attribute_id" },
    { name = "kickside_pim_unique_value", keys = "attribute_id, value_key" },
    { name = "kickside_pim_ref", keys = "product_id, attribute_id, ctx, path" },
    { name = "kickside_pim_product", keys = "product_id" },
    { name = "kickside_pim_term", keys = "vocabulary, code" },
    { name = "kickside_pim_generation", keys = "generation" },
    { name = "kickside_pim_merge", keys = "vocabulary, from_code" },
}

-- page deletes at most limit matching rows and reports the remaining work.
function M.page(tx: types.Executor, name: string, keys: string, where: string, params: types.SqlParams, limit: integer): (integer?, boolean?, error?)
    local bound: types.SqlParams = {}
    for i, value in ipairs(params) do bound[i] = value end
    bound[#bound + 1] = math.max(1, limit)
    local selection = "SELECT " .. keys .. " FROM " .. name .. " WHERE " .. where .. " ORDER BY " .. keys .. " LIMIT $" .. #bound
    local rows, err = tx:query(selection, bound)
    if err then return nil, nil, errors.wrap(err, "cleanup page scan " .. name) end
    local n = #(rows or {})
    if limit == 0 then return 0, n > 0, nil end
    if n > 0 then
        local _, derr = tx:execute("DELETE FROM " .. name .. " WHERE " .. where .. " AND (" .. keys .. ") IN (" .. selection .. ")", bound)
        if derr then return nil, nil, errors.wrap(derr, "cleanup page delete " .. name) end
    end
    return n, n == limit, nil
end

local function generated_page(tx: types.Executor, dialect: string, t: types.Table, limit: integer): (boolean?, error?, integer?)
    local names = t.names
    local remaining = limit
    local generated: { Table } = { { name = names.set, keys = "product_id, col, value_key" }, { name = names.item, keys = "product_id" } }
    if dialect ~= sql.type.POSTGRES and #t.layout.search > 0 then
        generated[#generated + 1] = { name = names.fts, keys = "rowid" }
    end
    for _, table in ipairs(generated) do
        local n, more, err = M.page(tx, table.name, table.keys, "1 = 1", {}, remaining)
        if err or not n then return nil, err end
        remaining = remaining - n
        if more then return false, nil, limit - remaining end
    end
    return true, nil, limit - remaining
end

function M.catalog(tx: types.Executor, dialect: string, catalog_id: string, limit: integer): (boolean?, error?, integer?)
    local current, cerr = store.catalog(tx, catalog_id, dialect)
    if cerr then return nil, cerr end
    local remaining = limit
    if current then
        local generated = { layout.active(current) }
        local other = current.rebuild_storage and current.rebuild_storage.other
        if other then generated[#generated + 1] = layout.of(other.base, other.layout) end
        for _, t in ipairs(generated) do
            local done, err, n = generated_page(tx, dialect, t, remaining)
            if err or not n then return nil, err end
            remaining = remaining - n
            if not done then return false, nil, limit - remaining end
        end
    end
    for _, t in ipairs(TABLES) do
        local n, more, err = M.page(tx, t.name, t.keys, "catalog_id = $1", { catalog_id }, remaining)
        if err or not n then return nil, err end
        remaining = remaining - n
        if more then return false, nil, limit - remaining end
    end
    if current then
        if remaining == 0 then return false, nil, limit - remaining end
        local derr = layout.drop(tx, layout.from_base(current.item_table))
        if derr then return nil, derr end
        local other = current.rebuild_storage and current.rebuild_storage.other
        if other then
            local oerr = layout.drop(tx, layout.from_base(other.base))
            if oerr then return nil, oerr end
        end
        local _, err = tx:execute("DELETE FROM kickside_pim_catalog WHERE catalog_id = $1", { catalog_id })
        if err then return nil, err end
    end
    return true, nil, limit - remaining + (current and 1 or 0)
end
return M
