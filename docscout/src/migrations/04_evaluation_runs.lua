-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("Evaluation run references", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local columns, read_err = db:query(engine == "sqlite" and "PRAGMA table_info(kickside_docscout_runs)"
                        or "SELECT column_name AS name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='kickside_docscout_runs'")
                    if read_err then error(read_err) end
                    local present = {}
                    for _, column in ipairs(columns) do present[column.name] = true end
                    for _, name in ipairs({ "evaluation_id", "case_id" }) do
                        if not present[name] then
                            local _, err = db:execute("ALTER TABLE kickside_docscout_runs ADD COLUMN " .. name .. " TEXT")
                            if err then error(err) end
                        end
                    end
                    local _, err = db:execute("CREATE INDEX IF NOT EXISTS kickside_docscout_runs_evaluation ON kickside_docscout_runs(component_id,evaluation_id,case_id)")
                    if err then error(err) end
                end)
                down(function(db)
                    local _, index_err = db:execute("DROP INDEX IF EXISTS kickside_docscout_runs_evaluation")
                    if index_err then error(index_err) end
                    for _, name in ipairs({ "case_id", "evaluation_id" }) do
                        local _, err = db:execute("ALTER TABLE kickside_docscout_runs DROP COLUMN " .. name)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)
