-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("Create extractor-owned document, run, and evaluation tables", function()
        for _,dialect in ipairs({"sqlite","postgres"}) do
            database(dialect,function()
                up(function(db)
                    for _,statement in ipairs({
                        [[CREATE TABLE IF NOT EXISTS kickside_docscout_documents (
                            id TEXT PRIMARY KEY, component_id TEXT NOT NULL, user_id TEXT NOT NULL,
                            upload_id TEXT NOT NULL, markdown TEXT NOT NULL, chunks TEXT NOT NULL,
                            outline TEXT NOT NULL, vectors TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL)]],
                        [[CREATE INDEX IF NOT EXISTS kickside_docscout_documents_owner ON kickside_docscout_documents(component_id,user_id,upload_id)]],
                        [[CREATE INDEX IF NOT EXISTS kickside_docscout_documents_expiry ON kickside_docscout_documents(expires_at)]],
                        [[CREATE TABLE IF NOT EXISTS kickside_docscout_runs (
                            id TEXT PRIMARY KEY, component_id TEXT NOT NULL, user_id TEXT NOT NULL,
                            upload_id TEXT NOT NULL, caller TEXT NOT NULL, status TEXT NOT NULL,
                            config_revision BIGINT NOT NULL, result TEXT, trace TEXT,
                            duration_ms BIGINT NOT NULL, tokens BIGINT NOT NULL, cost DOUBLE PRECISION,
                            created_at TEXT NOT NULL, expires_at TEXT NOT NULL)]],
                        [[CREATE INDEX IF NOT EXISTS kickside_docscout_runs_owner ON kickside_docscout_runs(component_id,created_at)]],
                        [[CREATE INDEX IF NOT EXISTS kickside_docscout_runs_expiry ON kickside_docscout_runs(expires_at)]],
                        [[CREATE TABLE IF NOT EXISTS kickside_docscout_cases (
                            id TEXT PRIMARY KEY, component_id TEXT NOT NULL, upload_id TEXT NOT NULL,
                            upload_name TEXT NOT NULL DEFAULT '', expected_values TEXT NOT NULL, created_at TEXT NOT NULL)]],
                        [[CREATE INDEX IF NOT EXISTS kickside_docscout_cases_owner ON kickside_docscout_cases(component_id)]]
                    }) do
                        local _,err=db:execute(statement)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)
