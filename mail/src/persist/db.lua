-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local error_envelope = require("error_envelope")
local registry = require("registry")
local sql = require("sql")
local types = require("types")

local M = {}

function M.db_id(): (string?, error?)
    local config, err = registry.get("kickside.mail:db_config")
    if err then return nil, err end
    local db_id = config and config.meta.db_id
    if type(db_id) ~= "string" or not db_id:find("%S") then
        return nil, errors.new({kind = errors.INTERNAL, message = "Mail target_db is unset",
            retryable = false, details = {code = "mail_db_unconfigured"}})
    end
    return db_id, nil
end

function M.with_db<T>(work: (sql.DB, string) -> (T?, error?)): (T?, error?)
    local db_id, config_err = M.db_id()
    if config_err then return nil, config_err end
    local db, open_err = sql.get(db_id :: string)
    if open_err then return nil, open_err end

    local dialect, dialect_err = db:type()
    local value, err
    if dialect_err then
        err = dialect_err
    else
        value, err = work(db, dialect)
    end
    local final_err = error_envelope.cleanup(function() return db:release() end, err, "Mail database release failed")
    if final_err then return nil, final_err end
    return value, nil
end

function M.with_tx<T>(work: types.TransactionWork<T>): (T?, error?)
    return M.with_db(function(db: sql.DB, dialect: string): (T?, error?)
        local tx, begin_err = db:begin()
        if begin_err then return nil, begin_err end
        local value, err = work(tx, dialect)
        if err then
            return nil, error_envelope.cleanup(function() return tx:rollback() end, err, "Mail transaction rollback failed")
        end
        local _, commit_err = tx:commit()
        if commit_err then return nil, commit_err end
        return value, nil
    end)
end

return M
