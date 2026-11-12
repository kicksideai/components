-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("Chunk source offsets", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local columns, read_err = db:query(engine == "sqlite" and "PRAGMA table_info(kickside_docscout_chunks)"
                        or "SELECT column_name AS name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='kickside_docscout_chunks'")
                    if read_err then error(read_err) end
                    local present = {}
                    for _, column in ipairs(columns) do present[column.name] = true end
                    for _, name in ipairs({ "source_start", "source_end" }) do
                        if not present[name] then
                            local _, err = db:execute("ALTER TABLE kickside_docscout_chunks ADD COLUMN " .. name .. " BIGINT")
                            if err then error(err) end
                        end
                    end
                end)
                down(function(db)
                    for _, name in ipairs({ "source_end", "source_start" }) do
                        local _, err = db:execute("ALTER TABLE kickside_docscout_chunks DROP COLUMN " .. name)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)
