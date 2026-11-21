-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migration_api = require("migration")

local function replace(db, method: string)
    local _, drop_err = db:execute("DROP INDEX kickside_work_search_fts")
    if drop_err then error(drop_err) end
    local _, create_err = db:execute("CREATE INDEX kickside_work_search_fts ON kickside_work_search_row USING "
        .. method .. " (search_vector)")
    if create_err then error(create_err) end
end

return migration_api.define(function()
    migration("02 stream Work Search matches", function()
        database("postgres", function()
            up(function(db) replace(db, "gist") end)
            down(function(db) replace(db, "gin") end)
        end)
    end)
end)
