-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Eligibility indexes and completion state for bounded retained-row cleanup.
local clock = require("clock")
local INDEXES = {
    { "purge_pending", "item (board_id, life_at, item_id) WHERE purge_pending=1 AND life='purged'" },
    { "approval_age", "approval (board_id, at, item_id, visit, actor)" },
    { "stage_run_age", "stage_run (board_id, COALESCE(finished, started), item_id, visit, attempt)" },
    { "job_failed", "job (board_id, failed_at, job_id) WHERE status='failed'" },
    { "job_done", "job (board_id, job_id) WHERE status='done'" },
    { "job_active", "job (board_id, status) WHERE status NOT IN ('done','failed')" },
    { "item_generation", "item (board_id, process_generation) WHERE life<>'purged'" },
    { "operation_lookup", "operation (operation_id)" },
    { "item_move", "item (board_id, move_id) WHERE move_id IS NOT NULL" },
    { "field_unused", "field_usage (board_id, field_id) WHERE items=0" },
    { "plugin_converged", "plugin (board_id, plugin) WHERE active=0 AND revision=applied_revision" },
    { "visibility_floor", "visibility (board_id, seq, item_id)" },
}
local function execute(db, statement, params)
    local _, err = db:execute(statement, params or {})
    if err then error(errors.wrap(err, "Work bounded retention upgrade failed")) end
end
return require("migration").define(function()
    migration("04 bounded retention", function()
        for _, dialect in ipairs({"sqlite", "postgres"}) do
            database(dialect, function()
                up(function(db)
                    execute(db, "ALTER TABLE kickside_work_item ADD COLUMN purge_pending integer NOT NULL DEFAULT 0")
                    execute(db, "ALTER TABLE kickside_work_job ADD COLUMN failed_at text")
                    execute(db, "UPDATE kickside_work_item SET purge_pending=1 WHERE life='purged'")
                    -- Predecessor failures have no recorded time; their bounded window starts at upgrade.
                    execute(db, "UPDATE kickside_work_job SET failed_at=$1 WHERE status='failed'", {clock.now()})
                    execute(db, "DROP INDEX kickside_work_item_expiry")
                    execute(db, "CREATE INDEX kickside_work_item_expiry ON kickside_work_item (board_id, life, life_at, item_id) WHERE life<>'live'")
                    for _, index in ipairs(INDEXES) do
                        execute(db, "CREATE INDEX kickside_work_" .. index[1] .. " ON kickside_work_" .. index[2])
                    end
                end)
                down(function(db)
                    for _, index in ipairs(INDEXES) do execute(db, "DROP INDEX kickside_work_" .. index[1]) end
                    execute(db, "ALTER TABLE kickside_work_job DROP COLUMN failed_at")
                    execute(db, "ALTER TABLE kickside_work_item DROP COLUMN purge_pending")
                    execute(db, "DROP INDEX kickside_work_item_expiry")
                    execute(db, "CREATE INDEX kickside_work_item_expiry ON kickside_work_item (board_id, life, life_at) WHERE life<>'live'")
                end)
            end)
        end
    end)
end)
