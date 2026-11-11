-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local contract = require("contract")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local time = require("time")
local sql = require("sql")
local http_client = require("http_client")
local users = require("users")
local groups = require("groups")
local artifacts = require("artifacts")
local data = require("data")
local sessions = require("sessions")
local reconcile = require("reconcile")
local function member(enabled: boolean, identifier: string?): (string, any, string, any)
    local id = identifier or uuid.v4()
    assert(users.create({user_id = id, email = id .. "@example.test", password = "fixture-password", status = "active"}))
    assert(groups.assign_user_to_group(id, "app:runtime_members"))
    if enabled then
        assert(groups.assign_user_to_group(id, "app:docscout_members"))
        assert(groups.assign_user_to_group(id, "app:docscout_tools"))
    end
    local user = assert(groups.get_user_with_groups(id))
    local minted = assert(sessions.mint(user))
    local scope = minted.scope
    return id, funcs.new():with_actor(security.new_actor(id, { security_groups = user.security_groups })):with_scope(scope), minted.token, scope
end
local function request(method: string, path: string, token: string, payload: any?): any
    local address = tostring(assert(registry.get("app:gateway")).data.addr)
    local response, err = http_client.request(method, "http://" .. address .. path, {
        headers = { Authorization = "Bearer " .. token, ["Content-Type"] = "application/json" },
        body = payload and assert(json.encode(payload)) or nil,
    })
    test.is_nil(err, tostring(err))
    return response
end
local function configuration(): any
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local config = schema.default
    local field = schema.properties.fields.items.default
    field.name, field.type, field.description = "total", "number", "Total amount"
    config.fields = { field }
    config.retrieval.embedding_model, config.retrieval.context, config.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    config.stages.map.enabled, config.stages.scout.enabled, config.stages.deep.enabled = false, false, false
    config.stages.verify.check_support = false
    config.stages.extract.model = "class:docscout-success"
    return config
end
return { run = test.run_cases(function()
    test.describe("Successful public callers", function()
        test.before_all(function()
            local projected, err = reconcile.trigger()
            test.is_nil(err, tostring(err)); test.not_nil(projected)
        end)
        test.it("uses real endpoints to admit members and deny outside-group users", function()
            local allowed_id, _, allowed, allowed_scope = member(true)
            local outside_id, _, outside, outside_scope = member(false)
            local actor = security.new_actor(allowed_id, {})
            test.eq(allowed_scope:evaluate(actor, "access", "kickside.docscout.api:list.endpoint"), "allow")
            test.eq(allowed_scope:evaluate(actor, "contract.security", "security"), "allow")
            test.eq(allowed_scope:evaluate(actor, "contract.context", "context"), "allow")
            test.eq(allowed_scope:evaluate(actor, "funcs.security", "security"), "allow")
            test.eq(allowed_scope:evaluate(actor, "contract.call", "register"), "allow")
            test.eq(allowed_scope:evaluate(actor, "registry.get", "app:fixture_success_model"), "allow")
            test.eq(allowed_scope:evaluate(actor, "registry.get", "kickside.docscout.evals:case_worker"), "allow")
            test.eq(allowed_scope:evaluate(actor, "funcs.call", "kickside.docscout.evals:case_worker"), "undefined")
            test.eq(allowed_scope:evaluate(actor, "contract.get", "kickside.component:component_service"), "allow")
            test.eq(allowed_scope:evaluate(actor, "funcs.call", "kickside.component.binding:register_component_func"), "allow")
            test.eq(outside_scope:evaluate(security.new_actor(outside_id, {}), "contract.get", "kickside.component:component_service"), "allow")
            test.eq(outside_scope:evaluate(security.new_actor(outside_id, {}), "access", "kickside.docscout.api:list.endpoint"), "undefined")
            test.eq(outside_scope:evaluate(security.new_actor(outside_id, {}), "registry.get", "kickside.docscout.evals:case_worker"), "undefined")
            local admitted = request("GET", "/api/docscout", allowed)
            test.eq(admitted.status_code, 200, admitted.body)
            test.eq(request("GET", "/api/docscout", outside).status_code, 403)
        end)
        test.it("lets READ grantees run their own uploads and denies another user's upload", function()
            local owner, _, owner_token, owner_scope = member(true)
            local reader, reader_calls, _, reader_scope = member(true)
            local response = request("POST", "/api/docscout", owner_token, { title = "Shared", config = configuration() })
            test.eq(response.status_code, 201, response.body)
            local id = assert(json.decode(response.body)).component_id
            local service = assert(assert(contract.get("kickside.component:component_service")):with_actor(security.new_actor(owner, {})):with_scope(owner_scope):open())
            local grant, grant_err = service:grant_subtree({ root_component_id = id, subject = { subject_type = "user", subject_id = reader }, access_mask = 1 })
            test.is_nil(grant_err, tostring(grant_err)); test.is_true(grant.success)
            local upload_id = data.upload_record(reader, "application/pdf", "owned.pdf", 20)
            assert(artifacts.create_artifact({ upload_id = upload_id, kind = "markdown", role = "primary", mime_type = "text/markdown",
                content = "<!-- page 1 -->\n# Invoice\nThe total amount is 1250.", storage_id = "app:uploads" }))
            local value, err = reader_calls:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload_id, caller = "agent" })
            test.is_nil(err, tostring(err)); test.eq(value.fields[1].value, 1250)
            local foreign_id = data.upload_record(owner, "application/pdf", "private.pdf", 20)
            local denied, denied_err = reader_calls:call("kickside.docscout:invoke", { extractor_id = id, upload_id = foreign_id, caller = "agent" })
            test.is_nil(denied); test.not_nil(denied_err); test.is_true(errors.is(denied_err, errors.PERMISSION_DENIED))
            local deletable = assert(contract.get("kickside.contract:deletable"))
            local cleanup, cleanup_open_err = deletable:with_actor(security.new_actor(reader, {})):with_scope(reader_scope)
                :open("kickside.docscout:extractor", { component_id = id })
            local removed, cleanup_err = nil, cleanup_open_err
            if cleanup then removed, cleanup_err = cleanup:delete({}) end
            test.is_nil(removed); test.not_nil(cleanup_err)
            test.is_true(errors.is(cleanup_err, errors.PERMISSION_DENIED), tostring(cleanup_err))
            local deleted = request("DELETE", "/api/docscout/" .. id, owner_token)
            test.eq(deleted.status_code, 200, deleted.body)
            data.await_delete(id)
        end)
        test.it("returns nested typed fields through the contract, HTTP, Block, tool and stored runs", function()
            local owner, caller, token = member(true)
            local cfg = configuration()
            local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
            local amount = cfg.fields[1]
            amount.group = "parties.borrower"
            local terms = schema.properties.fields.items.default
            terms.name, terms.group, terms.type = "total", "parties.agent", "list"
            terms.item = { type = "object", properties = {
                { name = "amount", type = "number", description = "Amount", enum_values = {}, expected_format = "", required = true },
                { name = "paid", type = "boolean", description = "Paid", enum_values = {}, expected_format = "", required = true },
            } }
            cfg.fields[2] = terms
            cfg.stages.verify.enabled = true
            local response = request("POST", "/api/docscout", token, { title = "Nested reader", config = cfg })
            test.eq(response.status_code, 201, response.body)
            local id = assert(json.decode(response.body)).component_id
            local upload_id = data.upload_record(owner, "application/pdf", "nested.pdf", 20)
            assert(artifacts.create_artifact({ upload_id = upload_id, kind = "markdown", role = "primary", mime_type = "text/markdown",
                content = "# Terms\nThe total amount is 1250.", storage_id = "app:uploads" }))
            local direct, err = caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload_id, caller = "agent" })
            test.is_nil(err, tostring(err))
            local http_result = request("POST", "/api/docscout/" .. id .. "/run", token, { upload_id = upload_id })
            test.eq(http_result.status_code, 200, http_result.body)
            local tool = assert(caller:call("kickside.docscout.traits:run_tool", { extractor_id = id, upload_id = upload_id }))
            local block = assert(caller:call("kickside.docscout.blocks:extract_run", { config = { extractor_id = id }, input = { upload_id = upload_id } }))
            for _, result in ipairs({ direct, assert(json.decode(http_result.body)), tool, block }) do
                test.eq(result.values.parties.borrower.total, 1250)
                test.eq(result.values.parties.agent.total[1].amount, 1250)
                test.is_false(result.values.parties.agent.total[1].paid)
                test.eq(result.fields[1].path, "parties.borrower.total")
                test.eq(result.fields[2].path, "parties.agent.total")
                test.is_true(result.fields[1].verified); test.is_true(result.fields[2].verified)
            end
            local stored = request("GET", "/api/docscout/" .. id, token)
            test.eq(stored.status_code, 200, stored.body)
            local saved = assert(json.decode(stored.body))
            test.eq(saved.runs[1].result.values.parties.agent.total[1].amount, 1250)
            local expected = { parties = { borrower = { total = 1250 }, agent = { total = { { amount = 1250, paid = false } } } } }
            local case_response = request("POST", "/api/docscout/" .. id .. "/cases", token, { upload_id = upload_id, expected = expected })
            test.eq(case_response.status_code, 201, case_response.body)
            local start = request("POST", "/api/docscout/" .. id .. "/evaluations", token)
            test.eq(start.status_code, 202, start.body)
            local eval_id = assert(json.decode(start.body)).eval_id
            local evaluation
            for _ = 1, 100 do
                local result = request("GET", "/api/docscout/" .. id .. "/evaluations/" .. eval_id, token)
                evaluation = assert(json.decode(result.body)).evaluation
                if evaluation.status == "completed" or evaluation.status == "failed" then break end
                time.sleep("100ms")
            end
            test.eq(evaluation.status, "completed"); test.eq(evaluation.metrics[1].field, "parties.borrower.total")
            test.eq(evaluation.metrics[1].accuracy, 1); test.eq(evaluation.metrics[2].accuracy, 1)
        end)
        test.it("preserves whole-document outcomes, request fingerprints, call counts and stored results", function()
            local owner, caller = member(true, "11111111-1111-4111-8111-111111111111")
            local cfg = configuration()
            cfg.retrieval.embedding_model, cfg.stages.extract.model = "class:docscout-identity", "class:docscout-identity"
            cfg.stages.verify.enabled = true
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Whole document reader", config = cfg } })).component_id
            local upload_id = data.upload(owner, "application/pdf", "Original bytes", "<!-- page 1 -->\n# Invoice\nThe total amount is 1250.")
            local result = assert(caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload_id }))
            test.eq(#result.trace, 4)
            test.eq(json.encode({ result.trace[1].input_tokens, result.trace[3].input_tokens }), "[69255531042642,144586558987078]", "request fingerprints")
            test.eq(result.trace[1].output_tokens, 0);test.eq(result.trace[3].output_tokens, 8)
            test.eq(result.fields[1].value, 1250);test.eq(result.values.total, 1250)
            test.eq(result.fields[1].evidence[1].quote, "The total amount is 1250.")
            test.eq(result.fields[1].evidence[1].page, 1);test.is_true(result.fields[1].verified)
            test.is_nil(result.page_range);test.eq(result.pages, 1)
            local snapshot = assert(caller:call("app:probe", { op = "get", id = id }))
            test.eq(json.encode(snapshot.runs[1].result.fields), json.encode(result.fields))
            test.eq(snapshot.runs[1].result.values.total, 1250);test.is_nil(snapshot.runs[1].result.page_range)
            test.is_nil(snapshot.runs[1].result.error)
        end)
        test.it("keeps one identical extraction request and results when multiple fields fit the reply estimate", function()
            local owner, caller = member(true, "22222222-2222-4222-8222-222222222222")
            local cfg = configuration()
            local other = assert(json.decode(assert(json.encode(cfg.fields[1]))))
            other.name, other.description = "subtotal", "Subtotal amount"
            cfg.fields[2] = other
            cfg.retrieval.embedding_model, cfg.stages.extract.model = "class:docscout-identity", "class:docscout-identity"
            cfg.stages.extract.max_fields_per_call, cfg.stages.extract.max_output_tokens = 20, 1024
            cfg.stages.verify.enabled = true
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Multiple field reader", config = cfg } })).component_id
            local upload_id = data.upload(owner, "application/pdf", "Original bytes", "<!-- page 1 -->\n# Invoice\nThe total amount is 1250.")
            local result = assert(caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload_id }))
            test.eq(#result.trace, 4)
            local extract = result.trace[3]
            test.eq(#extract.calls, 1)
            test.eq(json.encode(extract.calls[1].fields), '["total","subtotal"]')
            test.eq(extract.input_tokens, 72087653205976, "pre-batching request fingerprint")
            test.eq(extract.output_tokens, 8)
            test.eq(json.encode(result.values), '{"subtotal":1250,"total":1250}')
            test.eq(#result.fields, 2)
            for index, name in ipairs({ "total", "subtotal" }) do
                local value = result.fields[index]
                test.eq(value.name, name); test.eq(value.value, 1250)
                test.is_false(value.missing); test.is_false(value.failed); test.is_true(value.verified)
                test.eq(#value.evidence, 1)
                test.eq(value.evidence[1].quote, "The total amount is 1250.")
                test.eq(value.evidence[1].page, 1); test.is_true(value.evidence[1].found)
            end
            local snapshot = assert(caller:call("app:probe", { op = "get", id = id }))
            test.eq(json.encode(snapshot.runs[1].result.fields), json.encode(result.fields))
            test.eq(json.encode(snapshot.runs[1].result.values), json.encode(result.values))
            test.is_nil(snapshot.runs[1].result.error)
        end)
        test.it("admits and runs the immutable page range after the source case is removed", function()
            local owner, caller = member(true)
            local cfg = configuration()
            cfg.retrieval.embedding_model = "class:docscout-range"
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Evaluation reader", config = cfg } })).component_id
            local upload_id = data.upload(owner, "application/pdf", "Original bytes",
                "<!-- page 1 -->\nExcluded before\n<!-- page 2 -->\n# Invoice\nThe total amount is 1250.\n<!-- page 3 -->\nExcluded after")
            local pages = { first = 2, last = 2 }
            local added = assert(caller:call("app:probe", { op = "add_case", id = id,
                input = { upload_id = upload_id, expected = { total = 1250 }, pages = pages } }))
            local snapshot = assert(caller:call("app:probe", { op = "get", id = id }))
            test.eq(json.encode(snapshot.cases[1].pages), json.encode(pages))
            local admitted = assert(caller:call("app:probe", { op = "queue_eval", id = id, cases = snapshot.cases }))
            assert(caller:call("app:probe", { op = "delete_case", id = id, case_id = added.id }))
            local saved = assert(caller:call("app:probe", { op = "raw_eval", eval_id = admitted }))
            test.eq(json.encode(saved.results[1].pages), json.encode(pages))
            local _, mismatch = caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload_id,
                caller = "eval", evaluation_id = admitted, case_id = added.id, pages = { first = 1, last = 1 } })
            test.not_nil(mismatch);test.is_true(errors.is(mismatch, errors.INVALID), tostring(mismatch))
            local result, err = funcs.call("kickside.docscout.evals:case_worker", {
                payload = { component_id = id, eval_id = admitted, case_id = added.id } })
            test.is_nil(err, tostring(err));test.not_nil(result)
            saved = assert(caller:call("app:probe", { op = "get_eval", id = id, eval_id = admitted })).evaluation
            test.eq(saved.status, "completed", assert(json.encode(saved.results)));test.eq(saved.results[1].scores[1].score, 1)
            local history = assert(caller:call("app:probe", { op = "get", id = id })).runs
            test.eq(history[1].result.page_range.first, 2);test.eq(history[1].result.page_range.last, 2)
            test.eq(history[1].result.fields[1].evidence[1].page, 2)
        end)
        test.it("validates evaluation ranges against the document before storing a case", function()
            local owner, caller = member(true)
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Case reader", config = configuration() } })).component_id
            local upload_id = data.upload(owner, "application/pdf", "Original bytes", "<!-- page 1 -->\nOne\n<!-- page 2 -->\nTwo")
            for _, pages in ipairs({ { first = 0, last = 1 }, { first = 1.5, last = 2 }, { first = 2, last = 1 }, { first = 1, last = 3 } }) do
                local result, err = caller:call("app:probe", { op = "add_case", id = id,
                    input = { upload_id = upload_id, expected = { total = 1250 }, pages = pages } })
                test.is_nil(result);test.not_nil(err);test.is_true(errors.is(err, errors.INVALID), tostring(err))
            end
            local plain = data.upload(owner, "text/plain", "No page information", "No page information")
            local result, err = caller:call("app:probe", { op = "add_case", id = id,
                input = { upload_id = plain, expected = { total = 1250 }, pages = { first = 1, last = 1 } } })
            test.is_nil(result);test.not_nil(err);test.is_true(errors.is(err, errors.INVALID), tostring(err))
            test.is_true(tostring(err):find("no page information", 1, true) ~= nil, tostring(err))
            test.eq(#assert(caller:call("app:probe", { op = "get", id = id })).cases, 0)
        end)
        test.it("applies the range through the contract, HTTP, tool and Block with stored real-page evidence", function()
            local owner, caller, token = member(true)
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Page reader", config = configuration() } })).component_id
            local upload_id = data.upload(owner, "application/pdf", "Original bytes",
                "<!-- page 1 -->\n# Other document\nExcluded first\n<!-- page 2 -->\n# Invoice\nThe total amount is 1250.\n<!-- page 3 -->\n# Other document\nExcluded last")
            local pages = { first = 2, last = 2 }
            local direct = assert(caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload_id, pages = pages }))
            local response = request("POST", "/api/docscout/" .. id .. "/run", token, { upload_id = upload_id, pages = pages })
            test.eq(response.status_code, 200, response.body)
            local tool = assert(caller:call("kickside.docscout.traits:run_tool", { extractor_id = id, upload_id = upload_id, pages = pages }))
            local block = assert(caller:call("kickside.docscout.blocks:extract_run", { config = { extractor_id = id, pages = pages }, input = { upload_id = upload_id } }))
            for _, result in ipairs({ direct, assert(json.decode(response.body)), tool, block }) do
                test.eq(result.page_range.first, 2); test.eq(result.page_range.last, 2)
                test.eq(result.fields[1].value, 1250)
                test.eq(result.fields[1].evidence[1].page, 2)
                test.eq(result.trace[1].pages.first, 2); test.eq(result.trace[1].pages.last, 2)
            end
            local snapshot = assert(caller:call("app:probe", { op = "get", id = id }))
            test.eq(snapshot.runs[1].result.page_range.first, 2)
            local bad = request("POST", "/api/docscout/" .. id .. "/run", token, { upload_id = upload_id, pages = { first = 2, last = 4 } })
            test.eq(bad.status_code, 400, bad.body)
        end)
        test.it("returns saved verification reasons through the HTTP API without losing values", function()
            local owner, _, token = member(true)
            for _, case in ipairs({
                { kind = "missing support", model = "class:docscout-support-empty", status = 500, reason = "does not match its schema" },
                { kind = "negative support", model = "class:docscout-support-mixed", status = 200, reason = "Quote does not support the terms" },
                { kind = "quote", status = 200, reason = "A quote is not in the document" },
            }) do
                local cfg = configuration()
                cfg.stages.verify.enabled, cfg.stages.verify.check_quotes = true, case.kind == "quote"
                cfg.stages.verify.check_support = case.model ~= nil
                if case.model then cfg.stages.verify.model = case.model end
                local target = 1
                if case.kind == "negative support" then
                    cfg.fields[1].name = "amount"
                    local second = configuration().fields[1]
                    second.name = "terms"; cfg.fields[2] = second; target = 2
                end
                local created = request("POST", "/api/docscout", token, { title = "Verification reader", config = cfg })
                test.eq(created.status_code, 201, created.body)
                local id = assert(json.decode(created.body)).component_id
                local upload_id = data.upload_record(owner, "application/pdf", "invoice.pdf", 20)
                assert(artifacts.create_artifact({ upload_id = upload_id, kind = "markdown", role = "primary", mime_type = "text/markdown",
                    content = case.kind == "quote" and "# Invoice\nThe total amount equals 1250." or "# Invoice\nThe total amount is 1250.", storage_id = "app:uploads" }))
                local response = request("POST", "/api/docscout/" .. id .. "/run", token, { upload_id = upload_id })
                test.eq(response.status_code, case.status, response.body)
                local loaded = request("GET", "/api/docscout/" .. id, token)
                test.eq(loaded.status_code, 200, loaded.body)
                local saved = assert(json.decode(loaded.body)).runs[1].result.fields[target]
                test.eq(saved.value, 1250, case.kind .. ": " .. tostring(json.encode(saved))); test.is_false(saved.verified)
                test.is_true(saved.reason:find(case.reason, 1, true) ~= nil, tostring(saved.reason))
                if case.status == 200 then
                    local returned = assert(json.decode(response.body)).fields[target]
                    test.eq(returned.value, saved.value); test.eq(returned.reason, saved.reason)
                end
            end
        end)
        test.it("runs the real contract from UI, tool, Block and evaluation with persisted evidence and trace", function()
            local owner, caller, token = member(true)
            local created_response = request("POST", "/api/docscout", token, { title = "Invoice", config = configuration() })
            test.eq(created_response.status_code, 201, created_response.body)
            local id = assert(json.decode(created_response.body)).component_id
            local upload_id = data.upload_record(owner, "application/pdf", "invoice.pdf", 20)
            assert(artifacts.create_artifact({upload_id = upload_id, kind = "markdown", role = "primary", mime_type = "text/markdown",
                content = "<!-- page 1 -->\n# Invoice\nThe total amount is 1250.", storage_id = "app:uploads"}))
            local http_result = request("POST", "/api/docscout/" .. id .. "/run", token, { upload_id = upload_id })
            test.eq(http_result.status_code, 200, http_result.body)
            local ui = assert(json.decode(http_result.body))
            local tool, tool_err = caller:call("kickside.docscout.traits:run_tool", { extractor_id = id, upload_id = upload_id })
            test.is_nil(tool_err, tostring(tool_err)); test.not_nil(tool)
            local block, block_err = caller:call("kickside.docscout.blocks:extract_run", { config = { extractor_id = id }, input = { upload_id = upload_id } })
            test.is_nil(block_err, tostring(block_err)); test.eq(block.values.total, 1250)
            local case_response = request("POST", "/api/docscout/" .. id .. "/cases", token, { upload_id = upload_id, expected = { total = 1250 } })
            test.eq(case_response.status_code, 201, case_response.body)
            local start = request("POST", "/api/docscout/" .. id .. "/evaluations", token)
            test.eq(start.status_code, 202, start.body)
            local eval_id = assert(json.decode(start.body)).eval_id
            local evaluation
            for _ = 1, 100 do
                local response = request("GET", "/api/docscout/" .. id .. "/evaluations/" .. eval_id, token)
                evaluation = assert(json.decode(response.body)).evaluation
                if evaluation.status == "completed" or evaluation.status == "failed" then break end
                time.sleep("100ms")
            end
            test.eq(evaluation.status, "completed"); test.eq(evaluation.metrics[1].accuracy, 1)
            test.is_nil(evaluation.results[1].pages)
            local cases = assert(caller:call("app:probe", { op = "get", id = id })).cases
            test.is_nil(cases[1].pages)
            for _, result in ipairs({ ui, tool, block }) do
                test.eq(result.fields[1].value, 1250); test.eq(result.fields[1].evidence[1].page, 1)
                test.eq(result.fields[1].evidence[1].quote, "The total amount is 1250.")
                test.is_true(#result.trace >= 3); test.not_nil(result.run_id)
                test.is_nil(result.page_range)
                for _, step in ipairs(result.trace) do test.is_nil(step.pages) end
            end
            local db = assert(sql.get("app:db"))
            local runs = assert(db:query("SELECT caller, status FROM kickside_docscout_runs WHERE component_id=$1 ORDER BY caller", { id }))
            db:release(); test.eq(#runs, 4)
            for _, run in ipairs(runs) do test.eq(run.status, "completed") end
        end)
    end)
end) }
