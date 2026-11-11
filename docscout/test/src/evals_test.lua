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
local data = require("data")
local security = require("security")
local repository = require("repository")
local database = require("database")

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
    return data.upload_record(who, "application/pdf", filename, 10)
end

local function extractor(who: string): string
    local config = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
    local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
    field.name = "total"; field.type = "number"
    config.fields = { field }
    return assert(call(who, { op = "create", input = { title = "Invoice reader", description = "", config = config } })).component_id
end

-- A queued single-case evaluation over a one-sentence upload whose fields are
-- read by the success fixture; a field's name selects the fixture's reply.
local function field_eval(who: string, names: { string }, expected: any, mutate: ((any) -> ())?, text: string?): (string, string, string)
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg = schema.default
    cfg.fields = {}
    for _, name in ipairs(names) do
        local field = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
        field.name, field.type, field.description = name, "number", "Total amount"
        cfg.fields[#cfg.fields + 1] = field
    end
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    cfg.stages.map.enabled, cfg.stages.scout.enabled, cfg.stages.deep.enabled = false, false, false
    cfg.stages.verify.check_support = false
    cfg.stages.extract.model, cfg.stages.extract.max_fields_per_call = "class:docscout-success", 1
    if mutate then mutate(cfg) end
    local id = assert(call(who, { op = "create", input = { title = "Evaluated reader", config = cfg } })).component_id
    local upload_id = data.upload(who, "application/pdf", "Original bytes", text or "# Invoice\nThe total amount is 1250.")
    assert(call(who, { op = "add_case", id = id, input = { upload_id = upload_id, expected = expected } }))
    local snapshot = assert(call(who, { op = "get", id = id }))
    local eval_id = assert(call(who, { op = "queue_eval", id = id, cases = snapshot.cases }))
    return id, eval_id, snapshot.cases[1].id
end

-- Recorded runs of an extractor and their summed tokens.
local function run_tokens(id: string): (integer, number)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT tokens FROM kickside_docscout_runs WHERE component_id=$1", { id })
    db:release()
    assert(err == nil, tostring(err))
    local total = 0
    for _, r in ipairs(rows) do total = total + (tonumber(r.tokens) or 0) end
    return #rows, total
end

-- Runs the case worker as Jobs runs attempt n of 3.
local function attempt(id: string, eval_id: string, case_id: string, n: integer): (any?, error?)
    return funcs.call("kickside.docscout.evals:case_worker", {
        payload = { component_id = id, eval_id = eval_id, case_id = case_id },
        job = { attempt_no = n, max_attempts = 3, is_final_attempt = n == 3 } })
end

return { run = test.run_cases(function()
    test.describe("Evaluations", function()
        for _, status in ipairs({ "partial", "failed" }) do
            test.it("persists failed-field scores and causes for " .. status .. " extraction", function()
                local who = member()
                local id, eval_id, case_id = field_eval(who, status == "partial" and { "provider_failure", "total" } or { "provider_failure" },
                    status == "partial" and { total = 1250 } or {})
                local result, err = attempt(id, eval_id, case_id, 3)
                test.is_nil(err, tostring(err)); test.not_nil(result)
                local evaluation = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
                test.eq(evaluation.results[1].status, status)
                test.eq(evaluation.results[1].scores[1].score, 0)
                test.eq(evaluation.results[1].scores[1].error.details.code, "fixture_provider_failure")
                test.eq(evaluation.metrics[1].accuracy, 0)
                if status == "partial" then test.eq(evaluation.metrics[2].accuracy, 1) end
            end)
        end
        test.it("deletes an extractor while expired attempt usage is swept without a lock cycle", function()
            local who = member()
            local id, eval_id, case_id = field_eval(who, { "total" }, { total = 1250 })
            assert(call(who, { op = "record_run", id = id, row = {
                user_id = who, upload_id = "usage-upload", caller = "eval", status = "failed", config_revision = 1,
                evaluation_id = eval_id, case_id = case_id, result = {}, trace = {}, tokens = 17,
                duration_ms = 34, expires_at = "2020-01-01T00:00:00Z" } }))
            local ready, resume, done = channel.new(1), channel.new(1), channel.new(2)
            local original = database.transaction
            database.transaction = function(owner: string?, fn: any): (any?, error?)
                return original(owner, function(tx: any, db: any): (any?, error?)
                    local wrapped = setmetatable({ execute = function(_self: any, statement: string, args: any): (any?, error?)
                        local result, err = tx:execute(statement, args)
                        if not err and statement:find("DELETE FROM kickside_docscout_eval_results", 1, true) then
                            ready:send(true); resume:receive()
                        end
                        return result, err
                    end }, { __index = function(_self: any, key: string): any
                        return function(_inner: any, ...): any return tx[key](tx, ...) end
                    end })
                    return fn(wrapped, db)
                end)
            end
            coroutine.spawn(function()
                local _, err = repository.delete(id)
                done:send(err and tostring(err) or "")
            end)
            ready:receive()
            coroutine.spawn(function()
                local _, err = repository.expire_runs(200)
                done:send(err and tostring(err) or "")
            end)
            local observer = assert(sql.get("app:db"))
            local waiting = true
            if observer:type() == "postgres" then
                waiting = false
                for _ = 1, 500 do
                    local rows = assert(observer:query([[SELECT COUNT(*) AS n FROM pg_stat_activity
                        WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%kickside_docscout%']]))
                    if tonumber(rows[1].n) > 0 then waiting = true; break end
                    time.sleep("10ms")
                end
            end
            observer:release(); resume:send(true)
            local first, second = done:receive(), done:receive()
            database.transaction = original
            test.is_true(waiting, "the sweep does not overlap deletion")
            test.eq(first, ""); test.eq(second, "")
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_docscout_runs WHERE component_id=$1", { id }))
            db:release(); test.eq(tonumber(rows[1].n), 0)
        end)
        test.it("keeps attempt usage when settlement fails and run retention removes an earlier attempt", function()
            local who = member()
            local id, eval_id, case_id = field_eval(who, { "total" }, { total = 1250 })
            local function record(tokens: number, expires: string, caller: string?): string
                return assert(call(who, { op = "record_run", id = id, row = {
                    user_id = who, upload_id = "usage-upload", caller = caller or "eval", status = "failed", config_revision = 1,
                    evaluation_id = eval_id, case_id = case_id, result = {}, trace = {}, tokens = tokens,
                    duration_ms = tokens * 2, expires_at = expires } }))
            end
            record(17, "2020-01-01T00:00:00Z")
            record(1000, "2999-01-01T00:00:00Z", "ui")
            local db = assert(sql.get("app:db"))
            assert(db:execute("ALTER TABLE kickside_docscout_eval_results RENAME TO withheld_eval_results"))
            local _, failed = call(who, { op = "finish_case", id = id, eval_id = eval_id, case_id = case_id,
                outcome = { status = "failed", tokens = 17, duration_ms = 34 } })
            assert(db:execute("ALTER TABLE withheld_eval_results RENAME TO kickside_docscout_eval_results"))
            db:release()
            test.not_nil(failed)
            local pending = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(pending.results[1].tokens, 17)
            assert(call(who, { op = "expire_runs" }))
            pending = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(pending.results[1].tokens, 17)
            local last = record(23, "2999-01-01T00:00:00Z")
            assert(call(who, { op = "finish_case", id = id, eval_id = eval_id, case_id = case_id,
                outcome = { status = "completed", run_id = last,
                    scores = { { field = "total", score = 1, verified = true, expected = 1250, value = 1250 } }, tokens = 23, duration_ms = 46 } }))
            local settled = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(settled.results[1].tokens, 40); test.eq(settled.tokens, 40)
            test.eq(settled.results[1].duration_ms, 80); test.eq(settled.duration_ms, 80)
            db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_docscout_runs SET expires_at='2020-01-01T00:00:00Z' WHERE component_id=$1", { id }))
            db:release()
            assert(call(who, { op = "expire_runs" }))
            local after = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(after.results[1].tokens, 40); test.eq(after.tokens, 40)
        end)
        for _, names in ipairs({ { "terminal_failure" }, { "provider_failure", "terminal_failure" }, { "deterministic_failure" } }) do
            test.it("settles a case containing " .. table.concat(names, " and ") .. " without replaying it", function()
                local who = member()
                local id, eval_id, case_id = field_eval(who, names, {})
                local value, err = attempt(id, eval_id, case_id, 1)
                test.is_nil(err, tostring(err)); test.not_nil(value)
                local saved = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
                test.eq(saved.results[1].status, "failed")
                test.eq((run_tokens(id)), 1)
            end)
        end
        test.it("returns a transient field failure to Jobs before the final attempt and records each attempt's tokens", function()
            local who = member()
            local id, eval_id, case_id = field_eval(who, { "provider_failure", "total" }, { total = 1250 })
            local value, err = attempt(id, eval_id, case_id, 1)
            test.is_nil(value); test.not_nil(err); test.is_true(err:retryable())
            test.eq(err:details().code, "fixture_provider_failure")
            local first = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(first.results[1].status, "queued"); test.is_nil(first.finished_at)
            local spent = first.results[1].tokens
            test.is_true(spent > 0, "the first attempt's tokens are recorded")
            local result, final_err = attempt(id, eval_id, case_id, 3)
            test.is_nil(final_err, tostring(final_err)); test.not_nil(result)
            local settled = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(settled.results[1].status, "partial")
            local runs, total = run_tokens(id)
            test.eq(runs, 2); test.is_true(total > spent)
            test.eq(settled.results[1].tokens, total)
            test.eq(settled.tokens, total)
        end)
        for _, name in ipairs({ "truncated_reply", "invalid_reply" }) do
            test.it("keeps structured reply retry semantics for " .. name, function()
                local who = member()
                local id, eval_id, case_id = field_eval(who, { name, "total" }, { total = 1250 })
                local value, err = attempt(id, eval_id, case_id, 1)
                test.is_nil(value); test.not_nil(err); test.is_true(err:retryable())
                local pending = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
                test.eq(pending.results[1].status, "queued")
                local result, final_err = attempt(id, eval_id, case_id, 3)
                test.is_nil(final_err, tostring(final_err)); test.not_nil(result)
                local settled = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
                test.eq(settled.results[1].status, "partial")
                test.is_true(settled.results[1].scores[1].error.retryable)
            end)
        end
        test.it("returns a transient run failure to Jobs before the final attempt and settles it on the final one", function()
            local who = member()
            local id, eval_id, case_id = field_eval(who, { "provider_failure" }, {}, function(cfg: any)
                cfg.stages.map.enabled, cfg.stages.map.model, cfg.stages.map.section_summaries = true, "class:docscout-success", false
                cfg.fields[1].search_within = "sections"
            end, "# Parties\nA buyer.\n# Terms\nThe total amount is 1250.\n# Schedule\nMonthly.")
            local value, err = attempt(id, eval_id, case_id, 1)
            test.is_nil(value); test.not_nil(err); test.is_true(err:retryable())
            local first = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(first.results[1].status, "queued")
            local spent = first.results[1].tokens
            local result, final_err = attempt(id, eval_id, case_id, 3)
            test.is_nil(final_err, tostring(final_err)); test.not_nil(result)
            local settled = assert(call(who, { op = "get_eval", id = id, eval_id = eval_id })).evaluation
            test.eq(settled.results[1].status, "failed"); test.not_nil(settled.finished_at)
            test.is_true(settled.results[1].error.retryable)
            local runs, total = run_tokens(id)
            test.eq(runs, 2); test.is_true(spent > 0, "the first attempt embeds the upload")
            test.eq(settled.results[1].tokens, total)
        end)
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
        test.it("replays committed admission after a notification failure without duplicating jobs", function()
            local who = member(); local id = extractor(who)
            assert(call(who, {op = "add_case", id = id,
                input = {upload_id = upload(who, "replay.pdf"), expected = {total = 1}}}))
            local denied = data.caller(who):with_scope(security.new_scope({assert(security.policy("app:user")),
                assert(security.policy("app:deny_eval_notifications"))}))
            local value, err = denied:call("app:probe", {op = "start_eval", id = id})
            test.is_nil(value); test.not_nil(err); test.is_false(err:retryable())
            test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            local evaluations = assert(call(who, {op = "list_evals", id = id})).items
            test.eq(#evaluations, 1)
            local resumed = assert(call(who, {op = "start_eval", id = id}))
            test.is_true(resumed.existing); test.eq(resumed.eval_id, evaluations[1].id)
            local db = assert(sql.get("app:db"))
            local counts, read_err = db:query("SELECT count(*) AS n FROM kickside_job WHERE owner_id=$1", {id})
            db:release()
            test.is_nil(read_err, tostring(read_err)); test.eq(tonumber(counts[1].n), 1)
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
            data.await_delete(id)
            local _, gone = call(who, { op = "get_eval", id = id, eval_id = eval_id })
            test.not_nil(gone)
        end)
    end)
end) }
