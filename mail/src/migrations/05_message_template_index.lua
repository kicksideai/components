-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function add(db: types.Executor)
    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS mail_message_template_page
        ON mail_message(template, created_at DESC, id DESC) WHERE template IS NOT NULL]])
    if err then error(err) end
end

return require("migration").define(function()
    migration("05 mail message template index", function()
        database("sqlite", function() up(add) end)
        database("postgres", function() up(add) end)
    end)
end)
