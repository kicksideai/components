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
local function member(enabled: boolean): (string, any, string, any)
    local id = uuid.v4()
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
            test.eq(allowed_scope:evaluate(actor, "contract.get", "kickside.component:component_service"), "allow")
            test.eq(allowed_scope:evaluate(actor, "funcs.call", "kickside.component.binding:register_component_func"), "allow")
            test.eq(outside_scope:evaluate(security.new_actor(outside_id, {}), "contract.get", "kickside.component:component_service"), "allow")
            test.eq(outside_scope:evaluate(security.new_actor(outside_id, {}), "access", "kickside.docscout.api:list.endpoint"), "undefined")
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
            for _, result in ipairs({ ui, tool, block }) do
                test.eq(result.fields[1].value, 1250); test.eq(result.fields[1].evidence[1].page, 1)
                test.eq(result.fields[1].evidence[1].quote, "The total amount is 1250.")
                test.is_true(#result.trace >= 3); test.not_nil(result.run_id)
            end
            local db = assert(sql.get("app:db"))
            local runs = assert(db:query("SELECT caller, status FROM kickside_docscout_runs WHERE component_id=$1 ORDER BY caller", { id }))
            db:release(); test.eq(#runs, 4)
            for _, run in ipairs(runs) do test.eq(run.status, "completed") end
        end)
    end)
end) }
