-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Rebuild statements: the next page of products and the rebuild cursor.
local types = require("types")

local M = {}

-- page reads the products after a cursor in key order, live and trashed.
function M.page(tx: types.Executor, catalog_id: string, after: string, limit: integer): ({ types.Row }?, error?)
    local rows, err = tx:query([[SELECT * FROM kickside_pim_product WHERE catalog_id = $1 AND product_id > $2
        AND state <> 'purged' ORDER BY product_id LIMIT $3]], { catalog_id, after, limit })
    if err then return nil, errors.wrap(err, "rebuild page read failed") end
    return rows or {}, nil
end

-- advance moves the cursor to last, and ends the rebuild when last is nil.
function M.advance(tx: types.Executor, catalog_id: string, last: string?, rebuild_seq: integer): error?
    local statement = "UPDATE kickside_pim_catalog SET rebuild_after = NULL, rebuild_seq = NULL, pending_columns = NULL WHERE catalog_id = $1"
    local params: types.SqlParams = { catalog_id }
    if last then
        statement = "UPDATE kickside_pim_catalog SET rebuild_after = $1, rebuild_seq = $2 WHERE catalog_id = $3"
        params = { last, rebuild_seq, catalog_id }
    end
    local _, err = tx:execute(statement, params)
    if err then return errors.wrap(err, "rebuild cursor write failed") end
    return nil
end

return M
