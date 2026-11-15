-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local component = require("component")
local sql = require("sql")
local M = {}
type Result = { success: boolean }
function M.delete(): (Result?, error?)
    local context, err = component.get_private_context(ctx.get("component_id") :: string)
    if err or not context then return nil, err end
    local db, derr = sql.get("app:db")
    if derr or not db then return nil, derr end
    local _, werr = db:execute("DELETE FROM pim_test_plugin_fold WHERE catalog_id = $1", { context.catalog_id })
    local _, rerr = db:release()
    if werr or rerr then return nil, werr or rerr end
    return { success = true }, nil
end
return M
