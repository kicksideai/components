-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function add(db: types.Executor)
    local _, err = db:execute("ALTER TABLE mail_library_asset ADD COLUMN used_by_json TEXT NOT NULL DEFAULT '[]'")
    if err then error(err) end
end

return require("migration").define(function()
    migration("10 mail asset usage", function()
        database("sqlite", function() up(add) end)
        database("postgres", function() up(add) end)
    end)
end)
