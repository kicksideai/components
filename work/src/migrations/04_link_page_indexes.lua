-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migration_api = require("migration")

local INDEXES = {
    { name = "kickside_work_link_outward_page", columns = "board_id, from_id, seq, type, to_board_id, to_id" },
    { name = "kickside_work_link_inward_page", columns = "to_board_id, to_id, seq, board_id, from_id, type" },
    { name = "kickside_work_link_target_page", columns = "to_board_id, to_id, board_id, seq, from_id, type" },
}

local function create_indexes(db)
    for _, index in ipairs(INDEXES) do
        local _, err = db:execute("CREATE INDEX IF NOT EXISTS " .. index.name .. " ON kickside_work_link (" .. index.columns .. ")")
        if err then error(err) end
    end
end

local function drop_indexes(db)
    for _, index in ipairs(INDEXES) do
        local _, err = db:execute("DROP INDEX IF EXISTS " .. index.name)
        if err then error(err) end
    end
end

return migration_api.define(function()
    migration("04 link page indexes", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(create_indexes)
                down(drop_indexes)
            end)
        end
    end)
end)
