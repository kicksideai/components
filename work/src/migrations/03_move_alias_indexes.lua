-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function execute(db, statement)
    local _, err = db:execute(statement)
    if err then error(err) end
end

local function create(db)
    execute(db, "CREATE INDEX kickside_work_key_alias_endpoint ON kickside_work_key_alias (board_id, item_id, key)")
    execute(db, "CREATE INDEX kickside_work_key_alias_destination ON kickside_work_key_alias (to_board_id, to_item_id)")
end

local function drop(db)
    execute(db, "DROP INDEX kickside_work_key_alias_destination")
    execute(db, "DROP INDEX kickside_work_key_alias_endpoint")
end

return require("migration").define(function()
    migration("03 index move aliases by item", function()
        database("sqlite", function() up(create); down(drop) end)
        database("postgres", function() up(create); down(drop) end)
    end)
end)
