-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function create(db)
    local _, err = db:execute([[CREATE INDEX kickside_work_plugin_active ON kickside_work_plugin (plugin, board_id) WHERE active = 1]])
    if err then error(err) end
end

local function drop(db)
    local _, err = db:execute("DROP INDEX kickside_work_plugin_active")
    if err then error(err) end
end

return require("migration").define(function()
    migration("04 index active plugin attachments", function()
        database("sqlite", function() up(create); down(drop) end)
        database("postgres", function() up(create); down(drop) end)
    end)
end)
