-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local funcs = require("funcs")
local json = require("json")
local registry = require("registry")
local ai = require("ai")
local stages = require("stages")
local store = require("store")

local MIGRATIONS = { "01_docscout", "02_built_outline", "03_page_ranges", "04_evaluation_runs" }

local function apply(name: string, direction: string, expected: integer?)
    local result, err = funcs.call("kickside.docscout.migrations:" .. name, {
        database_id = "app:migration_db", id = "docscout_roundtrip_" .. name, direction = direction,
    })
    test.is_nil(err, tostring(err)); test.eq(result.failed, 0, tostring(result.error))
    test.eq(result.applied, expected or 1)
end

-- Applies every shipped migration up in order, or down in reverse.
local function migrate(direction: string)
    local first, last, by = 1, #MIGRATIONS, 1
    if direction == "down" then first, last, by = #MIGRATIONS, 1, -1 end
    for i = first, last, by do apply(MIGRATIONS[i], direction) end
end

return { run = test.run_cases(function()
    test.describe("Shipped Docscout migrations", function()
        test.it("upgrades populated migration-01 data, caches on first use, and rolls back migration 02", function()
            local source=assert(sql.get("app:db"))
            local dialect=assert(source:type())
            if dialect=="postgres" then assert(source:execute("CREATE SCHEMA docscout_migration_fixture")) end
            source:release()
            apply("01_docscout","up")
            local db=assert(sql.get("app:migration_db"))
            local created,expiry="2025-01-01T00:00:00Z","2999-01-01T00:00:00Z"
            local outline='[{"id":"s1","title":"Terms","path":"Terms","level":1,"chunk_start":1,"chunk_end":1,"tokens":10}]'
            assert(db:execute([[INSERT INTO kickside_docscout_documents
                (id,component_id,owner_id,upload_id,content_checksum,processing_key,outline,page_count,chunk_count,tokens,created_at,expires_at)
                VALUES ('document','extractor','user','upload','checksum','processing',$1,1,1,42,$2,$3)]],{outline,created,expiry}))
            assert(db:execute([[INSERT INTO kickside_docscout_chunks
                (id,document_id,ordinal,section_id,heading_path,page_start,page_end,content,context,page_spans)
                VALUES ('chunk','document',1,'s1','Terms',1,1,'The total amount is 1250.','Terms','[]')]]))
            local vector={}
            for i=1,512 do vector[i]=i==1 and 1.0 or 0.0 end
            assert(db:execute("INSERT INTO kickside_docscout_chunk_vectors (chunk_id,document_id,embedding) VALUES ('chunk','document',$1)",{assert(json.encode(vector))}))
            if dialect=="sqlite" then assert(db:execute("INSERT INTO kickside_docscout_chunks_fts (chunk_id,content) VALUES ('chunk','The total amount is 1250.')")) end
            assert(db:execute([[INSERT INTO kickside_docscout_runs
                (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                VALUES ('run','extractor','user','upload','ui','completed',3,'{"values":{"total":1250}}','[]',20,42,$1,$2)]],{created,expiry}))
            assert(db:execute([[INSERT INTO kickside_docscout_cases (id,component_id,upload_id,upload_name,expected_values,created_at)
                VALUES ('case','extractor','upload','document.pdf','{"total":1250}',$1)]],{created}))
            assert(db:execute([[INSERT INTO kickside_docscout_evals
                (id,component_id,config_revision,fields,config_snapshot,status,actor_id,actor_context,case_count,created_at)
                VALUES ('evaluation','extractor',3,'[]','{}','completed','user','{}',1,$1)]],{created}))
            assert(db:execute([[INSERT INTO kickside_docscout_eval_results
                (eval_id,case_id,upload_name,upload_id,expected_values,status,run_id,scores,tokens,duration_ms,job_id,next_check_at)
                VALUES ('evaluation','case','document.pdf','upload','{"total":1250}','completed','run','[]',42,20,'job',$1)]],{expiry}))
            db:release()
            local function snapshot(): string
                local current=assert(sql.get("app:migration_db"))
                local rows={}
                rows.documents=assert(current:query([[SELECT id,component_id,owner_id,upload_id,content_checksum,processing_key,outline,page_count,chunk_count,tokens,created_at,expires_at FROM kickside_docscout_documents ORDER BY id]]))
                rows.chunks=assert(current:query([[SELECT id,document_id,ordinal,section_id,heading_path,page_start,page_end,content,context,page_spans FROM kickside_docscout_chunks ORDER BY id]]))
                local embedding=dialect=="sqlite" and "vec_to_json(embedding)" or "CAST(embedding AS TEXT)"
                rows.vectors=assert(current:query("SELECT chunk_id,document_id," .. embedding .. " AS embedding FROM kickside_docscout_chunk_vectors ORDER BY chunk_id"))
                for _,name in ipairs({"runs","cases","evals","eval_results"}) do rows[name]=assert(current:query("SELECT * FROM kickside_docscout_" .. name)) end
                current:release();return assert(json.encode(rows))
            end
            local before=snapshot()
            apply("02_built_outline","up")
            test.eq(snapshot(),before)
            apply("02_built_outline","up",0)
            test.eq(snapshot(),before)
            local overlay=assert(registry.overlay("app:migration_test"))
            local entry=assert(registry.get("kickside.docscout:db_config"))
            entry.meta.db_id="app:migration_db"
            local changes=overlay:changes();changes:update(entry)
            local _,apply_err=changes:apply();test.is_nil(apply_err,tostring(apply_err))
            local ok,failure=pcall(function()
                local function mapped(): any
                    local run={document={id="document",outline=assert(json.decode(outline))},regions={},config={fields={},stages={map={
                        model="class:docscout-sampling",outline="find_or_build",section_summaries=false,temperature=0,max_tokens=128}}}}
                    local step={meter=ai.meter()}
                    test.is_nil(stages.map(run,step));return step
                end
                test.is_nil((store.built_outline("document","unused")))
                test.contains(mapped().message,"Built")
                local reused=mapped();test.contains(reused.message,"Reused")
                test.eq(reused.meter.input_tokens,0);test.eq(reused.meter.output_tokens,0)
                test.eq(snapshot(),before)
                apply("02_built_outline","down")
                test.eq(snapshot(),before)
                apply("02_built_outline","up")
                test.contains(mapped().message,"Built")
                test.contains(mapped().message,"Reused")
            end)
            local restore=assert(registry.overlay("app:migration_test")):changes();restore:delete(entry.id)
            local _,restore_err=restore:apply();test.is_nil(restore_err,tostring(restore_err))
            apply("03_page_ranges", "up"); apply("04_evaluation_runs", "up")
            migrate("down")
            if dialect=="postgres" then
                source=assert(sql.get("app:db"));assert(source:execute("DROP SCHEMA docscout_migration_fixture CASCADE"));source:release()
            end
            if not ok then error(failure) end
        end)
        test.it("preserves populated runs, cases and snapshots through the range migration and rollback", function()
            local source = assert(sql.get("app:db"))
            local dialect = assert(source:type())
            if dialect == "postgres" then assert(source:execute("CREATE SCHEMA docscout_migration_fixture")) end
            source:release()
            apply("01_docscout", "up");apply("02_built_outline", "up")
            local db
            db = assert(sql.get("app:migration_db"))
            assert(db:execute([[INSERT INTO kickside_docscout_runs
                (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                VALUES ('run','extractor','user','upload','ui','completed',1,'{"values":{"total":42}}','[]',1,2,'2026-01-01','2026-01-02')]]))
            assert(db:execute([[INSERT INTO kickside_docscout_cases (id,component_id,upload_id,upload_name,expected_values,created_at)
                VALUES ('case','extractor','upload','invoice.pdf','{"total":42}','2026-01-01')]]))
            assert(db:execute([[INSERT INTO kickside_docscout_eval_results
                (eval_id,case_id,upload_name,upload_id,expected_values,status,job_id,next_check_at)
                VALUES ('evaluation','case','invoice.pdf','upload','{"total":42}','queued','job','2026-01-01')]]))
            db:release()
            for _ = 1, 2 do
                apply("03_page_ranges", "up")
                apply("03_page_ranges", "up", 0)
                db = assert(sql.get("app:migration_db"))
                for _, name in ipairs({"cases", "eval_results"}) do
                    local rows = assert(db:query("SELECT expected_values,pages FROM kickside_docscout_" .. name))
                    test.eq(#rows, 1);test.eq(rows[1].expected_values, '{"total":42}');test.is_nil(rows[1].pages)
                    assert(db:execute("UPDATE kickside_docscout_" .. name .. [[ SET pages='{"first":2,"last":3}']]))
                    test.eq(assert(db:query("SELECT pages FROM kickside_docscout_" .. name))[1].pages, '{"first":2,"last":3}')
                end
                test.eq(assert(db:query("SELECT result FROM kickside_docscout_runs"))[1].result, '{"values":{"total":42}}')
                db:release()
                apply("03_page_ranges", "down")
                db = assert(sql.get("app:migration_db"))
                for _, name in ipairs({"cases", "eval_results"}) do
                    test.eq(assert(db:query("SELECT expected_values FROM kickside_docscout_" .. name))[1].expected_values, '{"total":42}')
                end
                db:release()
            end
            apply("03_page_ranges", "up"); apply("04_evaluation_runs", "up")
            migrate("down")
            if dialect == "postgres" then
                source = assert(sql.get("app:db"))
                assert(source:execute("DROP SCHEMA docscout_migration_fixture CASCADE")); source:release()
            end
        end)
        test.it("adds nullable evaluation run references without changing earlier data", function()
            local source = assert(sql.get("app:db"))
            local dialect = assert(source:type())
            if dialect == "postgres" then assert(source:execute("CREATE SCHEMA docscout_migration_fixture")) end
            source:release()
            for _, name in ipairs({ "01_docscout", "02_built_outline", "03_page_ranges" }) do apply(name, "up") end
            local db = assert(sql.get("app:migration_db"))
            assert(db:execute([[INSERT INTO kickside_docscout_runs
                (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                VALUES ('earlier','extractor','user','upload','eval','failed',1,'{}','[]',20,17,'2026-01-01','2999-01-01')]]))
            db:release()
            for _ = 1, 2 do
                apply("04_evaluation_runs", "up"); apply("04_evaluation_runs", "up", 0)
                db = assert(sql.get("app:migration_db"))
                local row = assert(db:query("SELECT * FROM kickside_docscout_runs WHERE id='earlier'"))[1]
                test.eq(row.tokens, 17); test.eq(row.duration_ms, 20); test.eq(row.result, "{}")
                test.is_nil(row.evaluation_id); test.is_nil(row.case_id)
                assert(db:execute("UPDATE kickside_docscout_runs SET evaluation_id='evaluation',case_id='case' WHERE id='earlier'"))
                db:release()
                apply("04_evaluation_runs", "down")
                db = assert(sql.get("app:migration_db"))
                test.eq(assert(db:query("SELECT tokens FROM kickside_docscout_runs WHERE id='earlier'"))[1].tokens, 17)
                db:release()
            end
            for _, name in ipairs({ "03_page_ranges", "02_built_outline", "01_docscout" }) do apply(name, "down") end
            if dialect == "postgres" then
                source = assert(sql.get("app:db")); assert(source:execute("DROP SCHEMA docscout_migration_fixture CASCADE")); source:release()
            end
        end)
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
