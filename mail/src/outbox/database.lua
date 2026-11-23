-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local sql = require("sql")
local types = require("types")
local error_envelope = require("error_envelope")

local M = {}

function M.read<T>(read: (sql.DB) -> (T?, error?)): (T?, error?)
    local config, config_err = registry.get("kickside.mail:db_config")
    if config_err then return nil, config_err end
    local jobs_config, jobs_err = registry.get("kickside.core.jobs:db_config")
    if jobs_err then return nil, jobs_err end
    local db_id = config.meta.db_id
    if type(db_id) ~= "string" or db_id == "" or db_id ~= jobs_config.meta.db_id then
        return nil, errors.new({kind = errors.INVALID, message = "Mail target_db must be the Jobs database",
            retryable = false, details = {code = "invalid_config"}})
    end

    local db, open_err = sql.get(db_id)
    if open_err then return nil, open_err end
    local value, err = read(db)
    local final_err = error_envelope.cleanup(function() return db:release() end, err, "Mail database release failed")
    if final_err then return nil, final_err end
    return value, nil
end

function M.transaction<T>(write: types.TransactionWork<T>): (T?, error?)
    return M.read(function(db: sql.DB): (T?, error?)
        local dialect, dialect_err = db:type()
        if dialect_err then return nil, dialect_err end
        local tx, begin_err = db:begin()
        if begin_err then return nil, begin_err end
        local value, err = write(tx, dialect)
        if err then
            return nil, error_envelope.cleanup(function() return tx:rollback() end, err, "Mail transaction rollback failed")
        end
        local _, commit_err = tx:commit()
        if commit_err then return nil, commit_err end
        return value, nil
    end)
end

return M
