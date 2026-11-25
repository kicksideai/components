-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local sql = require("sql")
local M = {}

function M.open(): (sql.DB?, error?)
    local entry, err = registry.get("kickside.work.time:storage_config")
    if err then return nil, err end
    local id = entry and entry.meta.db_id
    if type(id) ~= "string" then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "Work Time database is not configured",
            details = { code = "time_database_unavailable" } })
    end
    return sql.get(id)
end

return M
