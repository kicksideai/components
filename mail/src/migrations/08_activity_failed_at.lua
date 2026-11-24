-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function add(db: types.Executor)
    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS mail_message_failed_at
        ON mail_message(finished_at, sender) WHERE status='failed']])
    if err then error(err) end
end

return require("migration").define(function()
    migration("08 mail activity failure index", function()
        database("sqlite", function() up(add) end)
        database("postgres", function() up(add) end)
    end)
end)
