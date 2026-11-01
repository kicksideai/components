-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local store = require("store")
local repository = require("repository")
local data = require("data")
local uuid = require("uuid")
local sql = require("sql")

local function corrupt(value: any, err: error?, field: string)
    test.is_nil(value); test.not_nil(err)
    test.is_true(errors.is(err, errors.INTERNAL)); test.is_false(err:retryable())
    test.eq(err:details().code, "persisted_data"); test.eq(err:details().field, field)
end

local function evaluation(component_id: string): string
    return assert(repository.add_eval(component_id, { actor_id = uuid.v4(), actor_context = "{}", config_revision = 0,
        fields = '[{"name":"total","type":"number"}]', config_snapshot = '{"fields":[]}' },
        { { id = "case", upload_id = "upload", upload_name = "invoice.pdf", expected = { total = 1250 } } },
        function(tx: any, dialect: string, id: string): (error?, {[string]: string}?)
            local receipts, err = data.admit_eval_jobs(tx, dialect, component_id, id,
                {{id = "case", upload_id = "upload", upload_name = "invoice.pdf", expected = {total = 1250}}})
            return err, receipts
        end))
end

return { run = test.run_cases(function()
    test.describe("Real persistence boundaries", function()
        test.it("rejects late document and evaluation writes after extractor deletion", function()
            local owner = uuid.v4(); local id = data.extractor(owner)
            local doc = { component_id = id, owner_id = owner, upload_id = "upload", checksum = "checksum",
                processing_key = "key", outline = {}, page_count = 0, tokens = 0, expires_at = "2999-01-01T00:00:00Z" }
            test.not_nil((store.save(doc, {})))
            local eval_id = evaluation(id)
            test.not_nil((repository.mark_eval(id, eval_id, "running")))
            test.not_nil((data.caller(owner):call("app:probe", { op = "delete", id = id })))

            local document, document_err = store.save(doc, {})
            test.is_nil(document); test.not_nil(document_err)
            local completed, completion_err = repository.finish_case(id, eval_id, "case", { status = "completed" },
                function() error("a deleted evaluation must not be summarized") end)
            test.is_nil(completed); test.not_nil(completion_err)
            local remaining, read_err = store.find(id, owner, "upload", "checksum", "key")
            test.is_nil(read_err, tostring(read_err)); test.is_nil(remaining)
            local removed, removed_err = repository.get_eval(eval_id, true)
            test.is_nil(removed); test.is_true(errors.is(removed_err, errors.NOT_FOUND), tostring(removed_err))
        end)
        test.it("rolls back a document and its chunks when the vector insert fails", function()
            local owner = uuid.v4(); local component_id = data.extractor(owner)
            local value, err = store.save({ component_id = component_id, owner_id = owner, upload_id = "upload", checksum = "checksum",
                processing_key = "key", outline = {}, page_count = 0, tokens = 0, expires_at = "2999-01-01T00:00:00Z" },
                { { ordinal = 1, section_id = "section", heading_path = "Terms", content = "Terms", vector = { 1 } } })
            test.is_nil(value); test.not_nil(err); test.eq(type(err), "userdata")
            local found, find_err = store.find(component_id, owner, "upload", "checksum", "key")
            test.is_nil(found); test.is_nil(find_err, tostring(find_err))
            local db = assert(sql.get("app:db"))
            local chunks = assert(db:query("SELECT count(*) AS n FROM kickside_docscout_chunks WHERE document_id IN (SELECT id FROM kickside_docscout_documents WHERE component_id=$1)", { component_id }))
            db:release(); test.eq(tonumber(chunks[1].n), 0)
        end)
        test.it("decodes saved run results and returns corrupt JSON errors", function()
            local owner = uuid.v4(); local id = data.extractor(owner)
            local run = assert(repository.add_run(id, { user_id = owner, upload_id = "upload", caller = "ui", status = "completed", config_revision = 0,
                result = { values = { parties = { borrower = { amount = 12 } } }, fields = {} }, trace = {}, duration_ms = 0, tokens = 0, expires_at = "2999-01-01T00:00:00Z" }))
            test.eq(assert(repository.snapshot(id, owner)).runs[1].result.values.parties.borrower.amount, 12)
            test.eq(#assert(repository.snapshot(id, "another-owner")).runs, 0)
            data.execute("UPDATE kickside_docscout_runs SET result=$1 WHERE id=$2", { "{", run })
            local value, err = repository.snapshot(id, owner)
            corrupt(value, err, "run result")
        end)
        test.it("rejects corrupt persisted expected values", function()
            local owner = uuid.v4(); local component_id = data.extractor(owner)
            local case = assert(repository.add_case(component_id, { upload_id = "upload", upload_name = "invoice.pdf", expected = {} }))
            for _, raw in ipairs({ "{", "null", "1", "true", '"text"' }) do
                data.execute("UPDATE kickside_docscout_cases SET expected_values=$1 WHERE id=$2", { raw, case.id })
                local value, err = repository.get_case(component_id, case.id)
                corrupt(value, err, "expected values")
                value, err = repository.snapshot(component_id, owner)
                corrupt(value, err, "expected values")
            end
            data.execute("UPDATE kickside_docscout_cases SET expected_values='{}' WHERE id=$1", { case.id })
            local db = assert(sql.get("app:db"))
            local _, missing_err = db:execute("UPDATE kickside_docscout_cases SET expected_values=NULL WHERE id=$1", { case.id })
            db:release(); test.not_nil(missing_err)
            test.eq(type(assert(repository.get_case(component_id, case.id)).expected), "table")
        end)
        test.it("rejects corrupt evaluation JSON at every read boundary", function()
            local component_id = data.extractor(uuid.v4()); local eval_id = evaluation(component_id)
            for _, column in ipairs({
                { key = "fields", field = "evaluated fields" },
                { key = "metrics", field = "evaluation metrics" },
                { key = "config_snapshot", field = "admitted configuration" },
                { key = "scores", field = "case scores", result = true },
                { key = "expected_values", field = "admitted expected values", result = true },
                { key = "error", field = "case error", result = true },
            }) do
                for _, raw in ipairs({ "{", "null", "1", "true", '"text"' }) do
                    data.execute("UPDATE kickside_docscout_evals SET fields='[]', metrics=NULL, config_snapshot='{}' WHERE id=$1", { eval_id })
                    data.execute("UPDATE kickside_docscout_eval_results SET scores=NULL, expected_values='{}', error=NULL WHERE eval_id=$1", { eval_id })
                    local target = column.result and "kickside_docscout_eval_results" or "kickside_docscout_evals"
                    local key = column.result and "eval_id" or "id"
                    data.execute("UPDATE " .. target .. " SET " .. column.key .. "=$1 WHERE " .. key .. "=$2", { raw, eval_id })
                    local value, err = repository.get_eval(eval_id, true)
                    corrupt(value, err, column.field)
                end
            end
        end)
        test.it("loads valid tables and SQL NULL evaluation metrics, scores and errors", function()
            local component_id = data.extractor(uuid.v4()); local eval_id = evaluation(component_id)
            local value, err = repository.get_eval(eval_id, true)
            test.is_nil(err, tostring(err)); test.eq(value.fields[1].name, "total")
            test.eq(value.results[1].expected.total, 1250); test.is_nil(value.results[1].error)
            test.eq(next(value.results[1].scores), nil); test.eq(next(value.metrics), nil)
            test.eq(type(value.config_snapshot.fields), "table")
        end)
        test.it("rejects corrupt persisted document outlines", function()
            local owner = uuid.v4(); local component_id = data.extractor(owner)
            local id = assert(store.save({ component_id = component_id, owner_id = owner, upload_id = "upload", checksum = "checksum",
                processing_key = "key", outline = {}, page_count = 0, tokens = 0, expires_at = "2999-01-01T00:00:00Z" }, {}))
            for _, raw in ipairs({ "{", "null", "1", "true", '"text"' }) do
                data.execute("UPDATE kickside_docscout_documents SET outline=$1 WHERE id=$2", { raw, id })
                local value, err = store.find(component_id, owner, "upload", "checksum", "key")
                corrupt(value, err, "document outline")
            end
        end)
    end)
end) }
