-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local ADD = "ALTER TABLE kickside_work_board_meta ADD COLUMN "

local function add(db, column)
    local _, err = db:execute(ADD .. column .. " TEXT NOT NULL DEFAULT ''")
    if err then error(err) end
end

return require("migration").define(function()
    migration("02 board UI app", function()
        database("postgres", function()
            up(function(db)
                add(db, "IF NOT EXISTS ui_app")
            end)
            -- Leave stored bindings available when older Work code runs.
            down(function(_db) end)
        end)
        database("sqlite", function()
            up(function(db)
                local columns, err = db:query("PRAGMA table_info(kickside_work_board_meta)")
                if err then error(err) end
                for _, column in ipairs(columns or {}) do
                    if column.name == "ui_app" then return end
                end
                add(db, "ui_app")
            end)
            down(function(_db) end)
        end)
    end)
end)
