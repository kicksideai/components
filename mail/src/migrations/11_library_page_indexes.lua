-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function add(db: types.Executor)
    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS mail_library_page
        ON mail_library(kind COLLATE "C",name COLLATE "C")]])
    if err then error(err) end
    local _, asset_err = db:execute([[CREATE INDEX IF NOT EXISTS mail_library_asset_page
        ON mail_library_asset(name COLLATE "C") WHERE upload_id IS NOT NULL]])
    if asset_err then error(asset_err) end
end

return require("migration").define(function()
    migration("11 mail library page indexes", function()
        database("postgres", function() up(add) end)
        database("sqlite", function()
            -- The library's existing keys use SQLite's binary order.
            up(function() end)
        end)
    end)
end)
