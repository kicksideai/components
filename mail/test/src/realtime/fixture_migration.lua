-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function create(db)
    local _, err = db:execute([[CREATE TABLE mail_realtime_fixture (
        topic TEXT NOT NULL, subject TEXT NOT NULL, data TEXT NOT NULL, observed TEXT NOT NULL
    )]])
    if err then error(err) end
end

return require("migration").define(function()
    migration("mail realtime fixture", function()
        database("sqlite", function() up(create) end)
        database("postgres", function() up(create) end)
    end)
end)
