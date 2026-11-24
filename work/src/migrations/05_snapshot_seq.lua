-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Older Work installations have already run 01_work, so this column must be
-- introduced by an additive migration as well as appearing in the base table.
-- Their retained materialization is a valid initial snapshot.
local function execute(db, statement)
    local _, err = db:execute(statement)
    if err then error(err) end
end

local function fill_checkpoint(db)
    execute(db, "UPDATE kickside_work_board SET snapshot_seq = applied_seq WHERE snapshot_seq = 0")
end

local function add_postgres(db)
    execute(db, "ALTER TABLE kickside_work_board ADD COLUMN IF NOT EXISTS snapshot_seq bigint NOT NULL DEFAULT 0")
    fill_checkpoint(db)
end

local function add_sqlite(db)
    local columns, err = db:query("PRAGMA table_info(kickside_work_board)")
    if err then error(err) end
    for _, column in ipairs(columns or {}) do
        if column.name == "snapshot_seq" then return end
    end
    execute(db, "ALTER TABLE kickside_work_board ADD COLUMN snapshot_seq INTEGER NOT NULL DEFAULT 0")
    fill_checkpoint(db)
end

return require("migration").define(function()
    migration("05 retain board snapshot checkpoint", function()
        database("sqlite", function() up(add_sqlite); down(function(_db) end) end)
        database("postgres", function() up(add_postgres); down(function(_db) end) end)
    end)
end)
