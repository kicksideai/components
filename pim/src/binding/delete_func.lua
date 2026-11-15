-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Catalog teardown commits one page and transfers remaining work to retention.
local ctx = require("ctx")
local access = require("access")
local store = require("store")
local cleanup_rows = require("cleanup_rows")
local retention_rows = require("retention_rows")
local cleanup = require("cleanup")
local types = require("types")
local M = {}
type Result = { success: boolean, error: error? }
function M.delete(): Result
    local catalog_id = ctx.get("component_id")
    if type(catalog_id) ~= "string" or catalog_id == "" then
        return { success = false, error = errors.new({ kind = errors.INVALID, message = "component_id required", details = { code = "component_id_required" } }) }
    end
    local aerr = access.delete(catalog_id)
    if aerr then return { success = false, error = aerr } end
    local done, err = store.transaction("catalog delete", function(tx: types.Executor, dialect: string): (boolean?, error?)
        local complete, cerr = cleanup_rows.catalog(tx, dialect, catalog_id, 500)
        if cerr then return nil, cerr end
        local qerr = retention_rows.enqueue_cleanup(tx, catalog_id, complete == true)
        if qerr then return nil, qerr end
        return complete, nil
    end)
    if err then return { success = false, error = errors.wrap(err, "catalog delete") } end
    if done then
        local rerr = cleanup.report(catalog_id)
        if rerr then return { success = false, error = rerr } end
    end
    return { success = true }
end
return M
