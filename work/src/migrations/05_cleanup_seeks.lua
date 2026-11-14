-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Ordered seeks for purged-item comments and complete incoming relation keys.
local INDEXES = {
    { "comment_purge", "comment (board_id, item_id, comment_id)" },
    { "comment_deleted", "comment (board_id, edited_at, comment_id) WHERE deleted=1" },
    { "link_target", "link (to_board_id, to_id, board_id, from_id, type)" },
}
local function execute(db, statement)
    local _, err = db:execute(statement, {})
    if err then error(errors.wrap(err, "Work cleanup seek upgrade failed")) end
end
return require("migration").define(function()
    migration("05 cleanup seeks", function()
        for _, dialect in ipairs({"sqlite", "postgres"}) do
            database(dialect, function()
                up(function(db)
                    execute(db, "DROP INDEX kickside_work_link_target")
                    execute(db, "DROP INDEX kickside_work_comment_deleted")
                    for _, index in ipairs(INDEXES) do
                        execute(db, "CREATE INDEX kickside_work_" .. index[1] .. " ON kickside_work_" .. index[2])
                    end
                end)
                down(function(db)
                    for _, index in ipairs(INDEXES) do execute(db, "DROP INDEX kickside_work_" .. index[1]) end
                    execute(db, "CREATE INDEX kickside_work_link_target ON kickside_work_link (to_board_id, to_id)")
                    execute(db, "CREATE INDEX kickside_work_comment_deleted ON kickside_work_comment (board_id, edited_at) WHERE deleted=1")
                end)
            end)
        end
    end)
end)
