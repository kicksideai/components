-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migration_api = require("migration")
local operation_expiry = require("operation_expiry")

local function execute(db, statement)
    local _, err = db:execute(statement)
    if err then error(err) end
end

local function sqlite_up(db)
    -- SQLite must rebuild this table to relax the published NOT NULL constraint.
    -- The migration runner commits the rows and both secondary indexes together.
    execute(db, [[CREATE TABLE kickside_work_operation_new (
        board_id TEXT NOT NULL, operation_id TEXT NOT NULL, kind TEXT NOT NULL, key TEXT, request_hash TEXT NOT NULL,
        actor_id TEXT NOT NULL, actor_context TEXT NOT NULL, data TEXT NOT NULL, status TEXT NOT NULL,
        processed INTEGER NOT NULL DEFAULT 0, counts TEXT NOT NULL DEFAULT '{"applied":0,"unchanged":0,"invalid":0,"denied":0,"conflict":0,"unavailable":0}',
        error_code TEXT, job_id TEXT NOT NULL, PRIMARY KEY (board_id, operation_id), UNIQUE (board_id, kind, key)) STRICT]])
    execute(db, [[INSERT INTO kickside_work_operation_new
        (board_id, operation_id, kind, key, request_hash, actor_id, actor_context, data, status, processed, counts, error_code, job_id)
        SELECT board_id, operation_id, kind, key, request_hash, actor_id, actor_context, data, status, processed, counts, error_code, job_id
        FROM kickside_work_operation]])
    execute(db, "DROP TABLE kickside_work_operation")
    execute(db, "ALTER TABLE kickside_work_operation_new RENAME TO kickside_work_operation")
    execute(db, "CREATE INDEX kickside_work_operation_lookup ON kickside_work_operation (operation_id)")
    execute(db, "CREATE INDEX kickside_work_operation_expiry ON kickside_work_operation (board_id, " ..
        operation_expiry.at("sqlite") .. ", operation_id) WHERE " .. operation_expiry.TERMINAL)
end

return migration_api.define(function()
    migration("03 release rejected move operation keys", function()
        database("postgres", function()
            up(function(db) execute(db, "ALTER TABLE kickside_work_operation ALTER COLUMN key DROP NOT NULL") end)
            -- Previous versions can read released attempts by ID. Restoring NOT NULL
            -- would require deleting history or rebinding keys that may have been reused.
            down(function() end)
        end)
        database("sqlite", function()
            up(sqlite_up)
            down(function() end)
        end)
    end)
end)
