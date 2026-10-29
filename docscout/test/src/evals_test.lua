-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local time = require("time")
local sql = require("sql")
local process = require("process")
local channel = require("channel")
local user_repo = require("user_repo")
local user_groups_repo = require("user_groups_repo")
local upload_records = require("upload_records")
local data = require("data")
local security = require("security")

local function call(who: string, dto: any): (any?, error?)
    return data.caller(who):call("app:probe", dto)
end
-- An active user in the member group, so a recorded identity resolves.
local function member(): string
    local id = uuid.v4()
    assert(user_repo.create({ user_id = id, email = id .. "@docscout.test", password = "docscout-eval-test", status = "active" }))
    assert(user_groups_repo.assign_user_to_group(id, "app:user"))
    return id
end

-- An upload record owned by who whose stored file does not exist, so reading it fails.
local function upload(who: string, filename: string): string
    local id = uuid.v4()
    assert(upload_records.create(id, who, 10, "application/pdf", "app:uploads", id .. ".pdf", "generic", { filename = filename }, "completed"))
    return id
end

local function extractor(who: string): string
    local config = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
    local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
    field.name = "total"; field.type = "number"
    config.fields = { field }
    return assert(call(who, { op = "create", input = { title = "Invoice reader", description = "", config = config } })).component_id
end

return { run = test.run_cases(function()
    test.describe("Evaluations", function()
        for _, status in ipairs({ "partial", "failed" }) do
            test.it("persists failed-field scores and causes for " .. status .. " extraction", function()
                local who = member()
                local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
                local cfg = schema.default
                local failed = schema.properties.fields.items.default
                failed.name, failed.type, failed.description = "provider_failure", "number", "Total amount"
                cfg.fields = { failed }
                if status == "partial" then
                    local good = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
                    good.name, good.type, good.description = "total", "number", "Total amount"
                    cfg.fields[2] = good
                end
                cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-success", "none", "keyword"
                cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
                cfg.stages.verify.check_support = false
                cfg.stages.extract.model, cfg.stages.extract.max_fields_per_call = "class:docscout-success", 1
                local id = assert(call(who, { op = "create", input = { title = "Evaluated partial reader", config = cfg } })).component_id
                local upload_id = data.upload(who, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
                assert(call(who, { op = "add_case", id = id, input = { upload_id = upload_id, expected = status == "partial" and { total = 1250 } or {} } }))
                local snapshot = assert(call(who, { op = "get", id = id }))
                local eval_id = assert(call(who, { op = "queue_eval", id = id, cases = snapshot.cases }))
                local result, err = funcs.call("kickside.docscout.evals:case_worker", {
                    payload = { component_id = id, eval_id = eval_id, case_id = snapshot.cases[1].id },
                })
                test.is_nil(err, tostring(err)); test.not_nil(result)
                local evaluation = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
                test.eq(evaluation.results[1].status, status)
                test.eq(evaluation.results[1].scores[1].score, 0)
                test.eq(evaluation.results[1].scores[1].error.details.code, "fixture_provider_failure")
                test.eq(evaluation.metrics[1].accuracy, 0)
                if status == "partial" then test.eq(evaluation.metrics[2].accuracy, 1) end
            end)
        end
        test.it("refuses to start without cases or edit access", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            local _, no_cases = call(who, { op = "start_eval", id = id })
            test.not_nil(no_cases); test.is_true(errors.is(no_cases, errors.INVALID), tostring(no_cases))
            local _, stranger = call("stranger-" .. uuid.v4(), { op = "start_eval", id = id })
            test.not_nil(stranger)
            local _, listing = call("stranger-" .. uuid.v4(), { op = "list_evals", id = id })
            test.not_nil(listing)
        end)

        test.it("allows one evaluation at a time per extractor", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            local cases = { { id = "c1", upload_id = "u", upload_name = "a.pdf", expected = {} } }
            assert(call(who, { op = "queue_eval", id = id, cases = cases }))
            local _, conflict = call(who, { op = "queue_eval", id = id, cases = cases })
            test.not_nil(conflict); test.is_true(errors.is(conflict, errors.CONFLICT), tostring(conflict))
        end)

        test.it("runs each case as a job under the starter's resolved identity and records a failed case with its reason", function()
            local who = member()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = upload(who, "missing.pdf"), expected = { total = 10 } } }))
            local started, err = call(who, { op = "start_eval", id = id })
            test.is_nil(err, tostring(err)); test.not_nil(started.eval_id)
            local found
            for _ = 1, 100 do
                found = assert(call(who, { op = "get_eval", id = id, eval_id = started.eval_id }))
                if found.evaluation.status == "completed" or found.evaluation.status == "failed" then break end
                time.sleep("100ms")
            end
            local e = found.evaluation
            test.eq(e.status, "failed"); test.eq(e.error, "Every case failed")
            test.eq(#e.results, 1); test.eq(e.results[1].status, "failed")
            test.eq(type(e.results[1].error), "table")
            test.not_nil(e.results[1].error.kind); test.is_nil(e.results[1].error.retryable)
            test.eq(e.results[1].error.details.trace[1].kind, "read")
            test.eq(e.results[1].error.details.run_id, e.results[1].run_id)
            test.not_nil(e.results[1].run_id)
            test.is_nil(e.identity)
            test.eq(found.history[1].id, started.eval_id)
        end)

        test.it("records a case as failed when the starter's identity no longer resolves", function()
            local who = "eval-ghost-" .. uuid.v4()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = upload(who, "a.pdf"), expected = { total = 1 } } }))
            local started = assert(call(who, { op = "start_eval", id = id }))
            local e
            for _ = 1, 100 do
                e = assert(call(who, { op = "get_eval", id = id, eval_id = started.eval_id })).evaluation
                if e.status == "completed" or e.status == "failed" then break end
                time.sleep("100ms")
            end
            test.eq(e.status, "failed")
            test.eq(type(e.results[1].error), "table"); test.eq(e.results[1].error.kind, errors.PERMISSION_DENIED)
        end)

        test.it("returns the active evaluation when started again", function()
            local who = member()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = upload(who, "a.pdf"), expected = { total = 1 } } }))
            local view = assert(call(who, { op = "get", id = id }))
            local first = assert(call(who, { op = "queue_eval", id = id, cases = view.cases }))
            local second = assert(call(who, { op = "start_eval", id = id }))
            test.is_true(second.existing); test.eq(second.eval_id, first)
        end)

        test.it("wakes readers after committed case and evaluation writes", function()
            local who = member(); local id = extractor(who)
            local mailbox = process.listen("component." .. id)
            assert(process.registry.register("user." .. who))
            local added = assert(call(who, { op = "add_case", id = id, input = { upload_id = upload(who, "wake.pdf"), expected = { total = 1 } } }))
            local selected = channel.select({ mailbox:case_receive(), time.after("2s"):case_receive() })
            process.registry.unregister("user." .. who); process.unlisten(mailbox)
            test.eq(selected.channel, mailbox)
            test.eq(selected.value.component_id, id)
            test.eq(next(selected.value, "component_id"), nil)
            test.eq(assert(call(who, { op = "get", id = id })).cases[1].id, added.id)
        end)
        test.it("runs admitted inputs and config after their source case and config change", function()
            local who = member(); local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = upload(who, "snapshot.pdf"), expected = { total = 10 } } }))
            local before = assert(call(who, { op = "get", id = id }))
            local eval_id = assert(call(who, { op = "queue_eval", id = id, cases = before.cases }))
            assert(call(who, { op = "delete_case", id = id, case_id = before.cases[1].id }))
            before.config.fields[1].name = "changed"
            assert(call(who, { op = "update", id = id, input = { title = before.title, config = before.config, expected_revision = before.expected_revision } }))
            local result, err = funcs.new():call("kickside.docscout.evals:case_worker", { payload = { component_id = id, eval_id = eval_id, case_id = before.cases[1].id } })
            test.is_nil(err, tostring(err)); test.not_nil(result)
            local admitted = assert(call(who, { op = "raw_eval", eval_id = eval_id }))
            test.eq(admitted.config_snapshot.fields[1].name, "total")
            test.eq(admitted.results[1].expected.total, 10)
            test.not_nil(admitted.results[1].run_id)
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT config_revision FROM kickside_docscout_runs WHERE id=$1", { admitted.results[1].run_id }))
            db:release(); test.eq(tonumber(rows[1].config_revision), before.expected_revision)
        end)
        test.it("rolls back evaluation rows and jobs when admission fails", function()
            local who = member(); local id = extractor(who)
            local value, err = call(who, { op = "queue_eval", id = id, refuse = true,
                cases = { { id = "case", upload_id = "upload", upload_name = "a.pdf", expected = {} } } })
            test.is_nil(value); test.not_nil(err); test.eq(err:details().code, "admission_refused")
            test.eq(#assert(call(who, { op = "list_evals", id = id })).items, 0)
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT count(*) AS n FROM kickside_job WHERE owner_id=$1", { id }))
            db:release(); test.eq(tonumber(rows[1].n), 0)
        end)

        test.it("settles a returned final-attempt snapshot-read failure with its case result", function()
            local who = member(); local id = extractor(who)
            local eval_id = assert(call(who, { op = "queue_eval", id = id,
                cases = { { id = "case", upload_id = "upload", upload_name = "invoice.pdf", expected = { total = 10 } } } }))
            data.execute("UPDATE kickside_docscout_evals SET config_snapshot='null' WHERE id=$1", { eval_id })
            local value, err = funcs.call("kickside.docscout.evals:case_worker", {
                payload = { component_id = id, eval_id = eval_id, case_id = "case" },
                job = { attempt_no = 3, max_attempts = 3, is_final_attempt = true } })
            test.is_nil(value); test.not_nil(err); test.eq(err:details().code, "persisted_data")
            test.eq(err:details().field, "admitted configuration"); test.is_false(err:retryable())
            local saved = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(saved.status, "failed"); test.eq(saved.error, "Every case failed")
            test.eq(saved.results[1].status, "failed")
            test.eq(saved.results[1].error.kind, errors.INTERNAL); test.is_false(saved.results[1].error.retryable)
            test.eq(saved.results[1].error.details.field, "admitted configuration")
            test.not_nil(saved.finished_at); test.not_nil(saved.results[1].finished_at)
        end)

        test.it("leaves a first-attempt failure of a kind Jobs retries for the next attempt", function()
            local who = member(); local id = extractor(who)
            local eval_id = assert(call(who, { op = "queue_eval", id = id,
                cases = { { id = "case", upload_id = "upload", upload_name = "invoice.pdf", expected = {} } } }))
            data.execute("UPDATE kickside_docscout_evals SET config_snapshot='null' WHERE id=$1", { eval_id })
            local value, err = funcs.call("kickside.docscout.evals:case_worker", {
                payload = { component_id = id, eval_id = eval_id, case_id = "case" },
                job = { attempt_no = 1, max_attempts = 3, is_final_attempt = false } })
            test.is_nil(value); test.eq(err:kind(), errors.INTERNAL); test.eq(err:details().field, "admitted configuration")
            local saved = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(saved.results[1].status, "queued"); test.is_nil(saved.finished_at)
        end)

        test.it("settles a deterministic notification failure on the first attempt", function()
            local who = member(); local id = extractor(who)
            local eval_id = assert(call(who, { op = "queue_eval", id = id,
                cases = { { id = "case", upload_id = "upload", upload_name = "invoice.pdf", expected = {} } } }))
            local scope = security.new_scope({ assert(security.policy("app:user")),
                assert(security.policy("app:deny_eval_notifications")) })
            local value, err = data.caller(who):with_scope(scope):call("kickside.docscout.evals:case_worker", {
                payload = { component_id = id, eval_id = eval_id, case_id = "case" },
                job = { attempt_no = 1, max_attempts = 3, is_final_attempt = false } })
            test.is_nil(value); test.not_nil(err); test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            test.eq(err:details().operation_error.kind, errors.PERMISSION_DENIED)
            local saved = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(saved.status, "failed"); test.eq(saved.error, "Every case failed")
            test.eq(saved.results[1].status, "failed"); test.not_nil(saved.finished_at)
            test.eq(saved.results[1].error.kind, errors.PERMISSION_DENIED)
        end)

        test.it("preserves the worker failure when final settlement also fails", function()
            local who = member(); local id = extractor(who)
            local eval_id = assert(call(who, { op = "queue_eval", id = id,
                cases = { { id = "case", upload_id = "upload", upload_name = "invoice.pdf", expected = {} } } }))
            data.execute("UPDATE kickside_docscout_evals SET metrics='null', fields='null' WHERE id=$1", { eval_id })
            local value, err = funcs.call("kickside.docscout.evals:case_worker", {
                payload = { component_id = id, eval_id = eval_id, case_id = "case" },
                job = { attempt_no = 3, max_attempts = 3, is_final_attempt = true } })
            test.is_nil(value); test.eq(err:details().field, "evaluated fields")
            local primary = err:details().operation_error
            test.eq(primary.kind, errors.INTERNAL); test.is_false(primary.retryable)
            test.eq(primary.details.code, "persisted_data"); test.eq(primary.details.field, "evaluation metrics")
            data.execute("UPDATE kickside_docscout_evals SET metrics=NULL, fields='[]' WHERE id=$1", { eval_id })
            local saved = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(saved.status, "queued"); test.eq(saved.results[1].status, "queued")
        end)

        test.it("refuses to evaluate cases that no longer match the fields", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            assert(call(who, { op = "add_case", id = id, input = { upload_id = upload(who, "old.pdf"), expected = { total = 1 } } }))
            local view = assert(call(who, { op = "get", id = id }))
            local cfg = view.config
            cfg.fields[1].name = "amount"
            assert(call(who, { op = "update", id = id, input = { title = view.title, description = "", config = cfg, expected_revision = view.expected_revision } }))
            local _, stale = call(who, { op = "start_eval", id = id })
            test.not_nil(stale); test.is_true(errors.is(stale, errors.INVALID), tostring(stale))
            test.is_true(tostring(stale):find("old.pdf", 1, true) ~= nil, tostring(stale))
        end)

        test.it("removes evaluations with the extractor", function()
            local who = "eval-owner-" .. uuid.v4()
            local id = extractor(who)
            local eval_id = assert(call(who, { op = "queue_eval", id = id, cases = { { id = "c1", upload_id = "u", upload_name = "a.pdf", expected = {} } } }))
            assert(call(who, { op = "delete", id = id }))
            local _, gone = call(who, { op = "get_eval", id = id, eval_id = eval_id })
            test.not_nil(gone)
        end)
    end)
end) }
