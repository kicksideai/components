-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A processed copy keeps the outline the map model built for it, with the
-- identity of the model card, prompt version and outline window that built it.
local COLUMNS = { "built_outline", "built_outline_identity" }

return require("migration").define(function()
    migration("Keep the built outline on the processed document", function()
        local function up_columns(db)
            for _, column in ipairs(COLUMNS) do
                local _, err = db:execute("ALTER TABLE kickside_docscout_documents ADD COLUMN " .. column .. " TEXT")
                if err then error(err) end
            end
        end
        local function down_columns(db)
            for _, column in ipairs(COLUMNS) do
                local _, err = db:execute("ALTER TABLE kickside_docscout_documents DROP COLUMN " .. column)
                if err then error(err) end
            end
        end
        database("postgres", function()
            up(up_columns)
            down(down_columns)
        end)
        database("sqlite", function()
            up(up_columns)
            down(down_columns)
        end)
    end)
end)
