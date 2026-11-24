-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local function add(db: types.Executor)
    for _, column in ipairs({"failed_html", "failed_text", "resend_of"}) do
        local _, err = db:execute("ALTER TABLE mail_message ADD COLUMN " .. column .. " TEXT")
        if err then error(err) end
    end
end

return require("migration").define(function()
    migration("06 mail failed content", function()
        database("sqlite", function() up(add) end)
        database("postgres", function() up(add) end)
    end)
end)
