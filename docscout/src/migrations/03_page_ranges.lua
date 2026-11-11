-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local TABLES = { "kickside_docscout_cases", "kickside_docscout_eval_results" }

return require("migration").define(function()
    migration("Evaluation page ranges", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    for _, name in ipairs(TABLES) do
                        local columns, read_err = db:query(engine == "sqlite" and ("PRAGMA table_info(" .. name .. ")")
                            or ("SELECT column_name AS name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='" .. name .. "'"))
                        if read_err then error(read_err) end
                        local present = false
                        for _, column in ipairs(columns) do if column.name == "pages" then present = true end end
                        if not present then
                            local _, err = db:execute("ALTER TABLE " .. name .. " ADD COLUMN pages TEXT")
                            if err then error(err) end
                        end
                    end
                end)
                down(function(db)
                    for _, name in ipairs(TABLES) do
                        local _, err = db:execute("ALTER TABLE " .. name .. " DROP COLUMN pages")
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)
