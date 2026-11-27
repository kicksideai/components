-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    database("sqlite", function()
        up(function(db) return db:execute("CREATE TABLE acme_good_item (id TEXT PRIMARY KEY)") end)
        down(function(db) return db:execute("DROP TABLE acme_good_item") end)
    end)
end)
