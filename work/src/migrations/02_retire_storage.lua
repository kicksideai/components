-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function execute(db, statement)
    local _, err = db:execute(statement)
    if err then error(errors.wrap(err, "work storage retirement failed")) end
end

return require("migration").define(function()
    migration("02 retire unused storage", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    for _, column in ipairs({ "item_count", "open_count", "trashed_count" }) do
                        execute(db, "ALTER TABLE kickside_work_board DROP COLUMN " .. column)
                    end
                    execute(db, "ALTER TABLE kickside_work_change DROP COLUMN ctx")
                    execute(db, "CREATE INDEX kickside_work_change_legacy ON kickside_work_change (board_id,seq,n) WHERE kind = 'query_value'")
                end)
                down(function(db)
                    execute(db, "DROP INDEX kickside_work_change_legacy")
                    for _, column in ipairs({ "item_count", "open_count", "trashed_count" }) do
                        execute(db, "ALTER TABLE kickside_work_board ADD COLUMN " .. column .. " bigint NOT NULL DEFAULT 0")
                    end
                    execute(db, "ALTER TABLE kickside_work_change ADD COLUMN ctx text NOT NULL DEFAULT ''")
                    execute(db, [[UPDATE kickside_work_board SET
                        item_count = (SELECT COUNT(*) FROM kickside_work_item i WHERE i.board_id = kickside_work_board.board_id AND i.life = 'live'),
                        open_count = (SELECT COUNT(*) FROM kickside_work_item i WHERE i.board_id = kickside_work_board.board_id AND i.life = 'live' AND i.category NOT IN ('completed','canceled')),
                        trashed_count = (SELECT COUNT(*) FROM kickside_work_item i WHERE i.board_id = kickside_work_board.board_id AND i.life = 'trashed')]])
                end)
            end)
        end
    end)
end)
