-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local funcs = require("funcs")

local MIGRATIONS = { "01_docscout", "02_built_outline" }

local function apply(name: string, direction: string)
    local result, err = funcs.call("kickside.docscout.migrations:" .. name, {
        database_id = "app:migration_db", id = "docscout_roundtrip_" .. name, direction = direction,
    })
    test.is_nil(err, tostring(err)); test.eq(result.failed, 0, tostring(result.error))
    test.eq(result.applied, 1)
end

-- Applies every shipped migration up in order, or down in reverse.
local function migrate(direction: string)
    local first, last, by = 1, #MIGRATIONS, 1
    if direction == "down" then first, last, by = #MIGRATIONS, 1, -1 end
    for i = first, last, by do apply(MIGRATIONS[i], direction) end
end

return { run = test.run_cases(function()
    test.describe("Shipped Docscout migrations", function()
        test.it("creates, drops and recreates all owned tables in the bound dialect", function()
            local source = assert(sql.get("app:db"))
            local dialect = assert(source:type())
            if dialect == "postgres" then assert(source:execute("CREATE SCHEMA docscout_migration_fixture")) end
            source:release()
            migrate("up")
            local db = assert(sql.get("app:migration_db"))
            local catalog = dialect == "sqlite" and "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'kickside_docscout_%'"
                or "SELECT tablename AS name FROM pg_tables WHERE schemaname='docscout_migration_fixture' AND tablename LIKE 'kickside_docscout_%'"
            local present = {}
            for _, row in ipairs(assert(db:query(catalog))) do present[row.name] = true end
            for _, name in ipairs({ "documents", "chunks", "chunk_vectors", "runs", "cases", "evals", "eval_results" }) do
                test.is_true(present["kickside_docscout_" .. name])
            end
            if dialect == "sqlite" then test.is_true(present.kickside_docscout_chunks_fts) end
            local _, column_err = db:query("SELECT built_outline, built_outline_identity FROM kickside_docscout_documents")
            test.is_nil(column_err, tostring(column_err))
            db:release()
            migrate("down")
            db = assert(sql.get("app:migration_db"))
            local rows = assert(db:query(catalog))
            db:release(); test.eq(#rows, 0)
            migrate("up"); migrate("down")
            if dialect == "postgres" then
                source = assert(sql.get("app:db"))
                assert(source:execute("DROP SCHEMA docscout_migration_fixture CASCADE")); source:release()
            end
        end)
    end)
end) }
