-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local funcs = require("funcs")
local json = require("json")
local BASE = { "01_docscout", "02_built_outline", "03_page_ranges", "04_evaluation_runs" }
local NEXT = "05_chunk_offsets"
local function apply(name: string, direction: string, expected: integer?): error?
    local result, err = funcs.call("kickside.docscout.migrations:" .. name,
        { database_id = "app:migration_db", id = "offsets_" .. name, direction = direction })
    if err then return err end
    test.eq(result.failed, 0, tostring(result.error)); test.eq(result.applied, expected or 1)
    return nil
end
return { run = test.run_cases(function()
    test.describe("Chunk offset migration", function()
        test.it("preserves earlier populated rows through idempotent, resumable application and rollback", function()
            local db = assert(sql.get("app:db")); local dialect = assert(db:type())
            if dialect == "postgres" then assert(db:execute("CREATE SCHEMA docscout_migration_fixture")) end
            db:release()
            local applied = false
            local ok, failure = pcall(function()
                for _, name in ipairs(BASE) do test.is_nil(apply(name, "up")) end
                db = assert(sql.get("app:migration_db"))
                assert(db:execute([[INSERT INTO kickside_docscout_documents
                    (id,component_id,owner_id,upload_id,content_checksum,processing_key,outline,page_count,chunk_count,tokens,created_at,expires_at)
                    VALUES ('document','extractor','user','upload','checksum','processing','[]',1,1,42,'2025-01-01','2999-01-01')]]))
                assert(db:execute([[INSERT INTO kickside_docscout_chunks
                    (id,document_id,ordinal,section_id,heading_path,page_start,page_end,content,context,page_spans)
                    VALUES ('chunk','document',1,'s1','Terms',1,1,'Existing text','Terms','[]')]]))
                assert(db:execute([[INSERT INTO kickside_docscout_runs
                    (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                    VALUES ('run','extractor','user','upload','ui','completed',3,'{"values":{"total":42}}','[]',20,42,'2025-01-01','2999-01-01')]]))
                db:release()
                local function snapshot(): string
                    local current = assert(sql.get("app:migration_db"))
                    local result = { chunks = assert(current:query([[SELECT id,document_id,ordinal,section_id,heading_path,page_start,page_end,content,context,page_spans FROM kickside_docscout_chunks]])),
                        documents = assert(current:query("SELECT * FROM kickside_docscout_documents")), runs = assert(current:query("SELECT * FROM kickside_docscout_runs")) }
                    current:release(); return assert(json.encode(result))
                end
                local before = snapshot()
                test.is_nil(apply(NEXT, "up")); applied = true
                test.eq(snapshot(), before); test.is_nil(apply(NEXT, "up", 0))
                db = assert(sql.get("app:migration_db"))
                local row = assert(db:query("SELECT source_start,source_end FROM kickside_docscout_chunks"))[1]
                db:release(); test.is_nil(row.source_start); test.is_nil(row.source_end)
                test.is_nil(apply(NEXT, "down")); applied = false; test.eq(snapshot(), before)
                db = assert(sql.get("app:migration_db"))
                assert(db:execute("ALTER TABLE kickside_docscout_chunks ADD COLUMN source_start BIGINT"))
                assert(db:execute("UPDATE kickside_docscout_chunks SET source_start=17")); db:release()
                test.is_nil(apply(NEXT, "up")); applied = true
                db = assert(sql.get("app:migration_db"))
                row = assert(db:query("SELECT source_start,source_end FROM kickside_docscout_chunks"))[1]
                db:release(); test.eq(tonumber(row.source_start), 17); test.is_nil(row.source_end)
                test.is_nil(apply(NEXT, "up", 0)); test.eq(snapshot(), before)
                test.is_nil(apply(NEXT, "down")); applied = false; test.eq(snapshot(), before)
            end)
            if applied then test.is_nil(apply(NEXT, "down")) end
            for i = #BASE, 1, -1 do test.is_nil(apply(BASE[i], "down")) end
            if dialect == "postgres" then
                db = assert(sql.get("app:db")); assert(db:execute("DROP SCHEMA docscout_migration_fixture CASCADE")); db:release()
            end
            if not ok then error(failure) end
        end)
    end)
end) }
