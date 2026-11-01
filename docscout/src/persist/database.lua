-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local registry = require("registry")
local time = require("time")
local component = require("component")
local error_envelope = require("error_envelope")
local M = {}
function M.now(): string return time.now():utc():format(time.RFC3339) end
function M.failed(message: string, cause: error): error return errors.wrap(cause, message) end
function M.with_db(fn: (any, string) -> (any?, error?)): (any?, error?)
    local entry, config_err = registry.get("kickside.docscout:db_config")
    if config_err then return nil, errors.wrap(config_err, "database configuration unavailable") end
    local id = entry.meta.db_id
    local db, open_err = sql.get(id)
    if open_err then return nil, errors.wrap(open_err, "database unavailable") end
    local value, err = fn(db, id)
    local final_err = error_envelope.cleanup(function(): (any, error?) return db:release() end, err, "database release failed")
    if final_err then return nil, final_err end
    return value, nil
end
function M.rollback(tx: any, primary: error): error
    return error_envelope.cleanup(function(): (any, error?) return tx:rollback() end, primary, "transaction rollback failed") :: error
end
function M.transaction(component_id: string?, fn: (any, any) -> (any?, error?)): (any?, error?)
    return M.with_db(function(db: any, id: string): (any?, error?)
        local tx, begin_err = db:begin()
        if begin_err then return nil, errors.wrap(begin_err, "transaction could not begin") end
        if component_id then
            local fence_err = component.fence(tx, component_id, id)
            if fence_err then return nil, M.rollback(tx, fence_err) end
        end
        local value, err = fn(tx, db)
        if err then return nil, M.rollback(tx, err) end
        local _, commit_err = tx:commit()
        if commit_err then return nil, errors.wrap(commit_err, "transaction could not commit") end
        return value, nil
    end)
end
return M
