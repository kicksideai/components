-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Rebuild statements: the next page of products and the rebuild cursor.
local types = require("types")
local layout = require("layout")
local json = require("json")
local sql = require("sql")

local M = {}

-- Page across every key, including tombstones, so a run of purged keys cannot
-- turn one batch into an unbounded scan.
function M.page(tx: types.Executor, catalog_id: string, after: string, limit: integer): ({ types.Row }?, error?)
    local rows, err = tx:query([[SELECT * FROM kickside_pim_product WHERE catalog_id = $1 AND product_id > $2
        ORDER BY product_id LIMIT $3]], { catalog_id, after, limit })
    if err then return nil, errors.wrap(err, "rebuild page read failed") end
    return rows or {}, nil
end

local function save_storage(tx: types.Executor, catalog_id: string, storage: types.RebuildStorage?): error?
    local _, err = tx:execute("UPDATE kickside_pim_catalog SET rebuild_storage = $1 WHERE catalog_id = $2",
        { storage and json.encode(storage) or sql.NULL, catalog_id })
    return err
end

-- Retired storage receives no more writes. Seek past deleted keys so a batch
-- can reach its page without walking dead entries still in the index.
local function retire(tx: types.Executor, dialect: string, t: types.Table, after: string, limit: integer): (string?, error?)
    local rows, err = tx:query("SELECT product_id FROM " .. t.names.item .. " WHERE product_id > $1 ORDER BY product_id LIMIT $2",
        { after, limit })
    if err or not rows then return nil, err end
    if #rows == 0 then return nil, layout.drop(tx, t.names) end
    local ids: { string } = {}
    for i, row in ipairs(rows) do ids[i] = row.product_id :: string end
    return ids[#ids], layout.delete_rows(tx, dialect, t, ids)
end

-- Prepare the empty target before its first page. If a schema superseded a
-- target, drain that storage first so only two table sets can exist at once.
function M.prepare(tx: types.Executor, dialect: string, catalog: types.Catalog, limit: integer): (boolean?, error?)
    local storage = catalog.rebuild_storage
    if not storage then return true, nil end
    local other = storage.other
    if other and other.retired_after ~= nil then
        local last, err = retire(tx, dialect, layout.of(other.base, other.layout), other.retired_after, limit)
        if err then return nil, err end
        if last then
            other.retired_after = last
            return false, save_storage(tx, catalog.catalog_id, storage)
        end
        storage.other = nil
        local keep = not layout.same(storage.active, catalog.compiled.layout)
        return false, save_storage(tx, catalog.catalog_id, keep and storage or nil)
    end
    if not other and not layout.same(storage.active, catalog.compiled.layout) then
        local names = layout.names(catalog.catalog_id, catalog.generation)
        local desired = catalog.compiled.layout
        local err = layout.create(tx, dialect, layout.of(names.base, desired))
        if err then return nil, err end
        storage.other = { base = names.base, layout = desired }
        local write_err = save_storage(tx, catalog.catalog_id, storage)
        if write_err then return nil, write_err end
    end
    return true, nil
end

function M.advance(tx: types.Executor, catalog_id: string, last: string): error?
    local _, err = tx:execute("UPDATE kickside_pim_catalog SET rebuild_after = $1 WHERE catalog_id = $2", { last, catalog_id })
    return err
end

-- Publish the built table set and all pending indexes in the same commit.
function M.finish(tx: types.Executor, catalog: types.Catalog): (boolean, error?)
    local storage = catalog.rebuild_storage
    local other = storage and storage.other
    local base = catalog.item_table
    local retired = sql.NULL
    if storage and other then
        base = other.base
        retired = json.encode({ active = other.layout,
            other = { base = catalog.item_table, layout = storage.active, retired_after = "" } })
    end
    local _, err = tx:execute([[UPDATE kickside_pim_catalog SET rebuild_after = NULL, rebuild_seq = NULL, pending_columns = NULL,
        item_table = $1, rebuild_storage = $2 WHERE catalog_id = $3]], { base, retired, catalog.catalog_id })
    return other == nil, err
end

return M
