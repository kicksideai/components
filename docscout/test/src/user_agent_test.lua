-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local users = require("users")
local groups = require("groups")
local flow_repo = require("flow_repo")
local function member(): string
    local id = uuid.v4()
    assert(users.create({ user_id = id, email = id .. "@example.test", password = "fixture-password", status = "active" }))
    assert(groups.assign_user_to_group(id, "app:user"))
    return id
end
local function config(agent_id: string): any
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg, f = schema.default, schema.properties.fields.items.default
    f.name, f.type, f.description = "total", "number", "Total amount"
    cfg.fields = { f }
    cfg.stages.scout.mode, cfg.stages.scout.agent_id = "agent", agent_id
    cfg.stages.scout.max_rounds, cfg.stages.scout.max_extra_queries = 1, 1
    cfg.stages.map.enabled, cfg.stages.deep.enabled, cfg.stages.prefetch.enabled = false, false, false
    cfg.stages.scout.tools = { "keyword_search", "read_outline", "read_section", "semantic_search" }
    cfg.stages.extract.model = "class:docscout-success"
    cfg.stages.verify.check_support = false
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    return cfg
end
local function create(caller: any): string
    return assert(caller:call("kickside.agents.registry:a_create", {
        name = "Document researcher", model = "class:docscout-success", prompt = "Find the total amount using keyword_search, then report the supporting passage.",
    })).component_id
end
return { run = test.run_cases(function()
    test.describe("User-selected scouting agents", function()
        test.it("validates READ access and agent type when saving", function()
            local owner, stranger = uuid.v4(), uuid.v4()
            local caller = data.caller(owner)
            local agent_id = create(caller)
            local saved, err = caller:call("app:probe", { op = "create", input = { title = "Custom scout", config = config(agent_id) } })
            test.is_nil(err, tostring(err)); test.not_nil(saved)
            local denied, denied_err = data.caller(stranger):call("app:probe", { op = "create", input = { title = "Private agent", config = config(agent_id) } })
            test.is_nil(denied); test.is_true(errors.is(denied_err, errors.PERMISSION_DENIED), tostring(denied_err))
            assert(caller:call("app:agent_share_probe", { component_id = agent_id, reader = stranger }))
            local shared, shared_err = data.caller(stranger):call("app:probe", { op = "create", input = { title = "Readable agent", config = config(agent_id) } })
            test.is_nil(shared_err, tostring(shared_err)); test.not_nil(shared)
            local wrong, wrong_err = caller:call("app:probe", { op = "create", input = { title = "Wrong kind", config = config(saved.component_id) } })
            test.is_nil(wrong); test.is_true(errors.is(wrong_err, errors.INVALID), tostring(wrong_err))
            local missing, missing_err = caller:call("app:probe", { op = "create", input = { title = "Missing agent", config = config(uuid.v4()) } })
            test.is_nil(missing); test.not_nil(missing_err)
            test.is_true(errors.is(missing_err, errors.NOT_FOUND) or errors.is(missing_err, errors.PERMISSION_DENIED))
        end)
        test.it("runs through the platform resolver and native agent with document tools, tokens and trace", function()
            local owner = member()
            local caller = data.caller(owner)
            local agent_id = create(caller)
            local cfg = config(agent_id)
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Agent reader", config = cfg } })).component_id
            local upload = data.upload(owner, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
            local result, err = caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload })
            test.is_nil(err, tostring(err)); test.eq(result.status, "completed", tostring(json.encode(result.trace))); test.eq(result.values.total, 1250)
            local scout
            for _, step in ipairs(result.trace) do if step.kind == "scout" then scout = step end end
            test.not_nil(scout); test.eq(scout.agent_id, agent_id); test.not_nil(scout.dataflow_id)
            local native = assert(flow_repo.get_by_user(scout.dataflow_id, owner))
            test.eq(native.actor_id, owner); test.eq(scout.model, "class:docscout-success")
            test.is_true(scout.input_tokens > 0); test.is_true(scout.output_tokens > 0)
            test.eq(scout.tool_calls[1].name, "keyword_search"); test.eq(scout.tool_calls[1].arguments.query, "total amount")
            local chunk = scout.tool_calls[1].result.chunks[1]
            test.eq(chunk.content, "# Invoice\nThe total amount is 1250."); test.eq(chunk.heading_path, "Invoice")
            local field = result.fields[1]
            test.eq(field.value, 1250); test.eq(#field.evidence, 1)
            test.eq(field.evidence[1].quote, "The total amount is 1250.")
            test.eq(field.evidence[1].section, "Invoice"); test.eq(field.evidence[1].chunk_id, chunk.id)
        end)
        test.it("returns a typed error when a saved agent becomes unreadable at run time", function()
            local owner, reader = uuid.v4(), uuid.v4()
            local caller = data.caller(owner)
            local agent_id = create(caller)
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Private scout", config = config(agent_id) } })).component_id
            assert(caller:call("app:agent_share_probe", { component_id = id, reader = reader }))
            local upload = data.upload(reader, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
            local result, err = data.caller(reader):call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload })
            test.is_nil(result); test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            test.eq(err:details().cause.details.code, "docscout_agent_access")
        end)
        test.it("rejects an unreadable replacement agent on update", function()
            local caller, other = data.caller(uuid.v4()), data.caller(uuid.v4())
            local cfg = config(create(caller))
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Saved scout", config = cfg } })).component_id
            local before = assert(caller:call("app:probe", { op = "get", id = id }))
            cfg.stages.scout.agent_id = create(other)
            local updated, err = caller:call("app:probe", { op = "update", id = id,
                input = { title = "Saved scout", config = cfg, expected_revision = before.expected_revision } })
            test.is_nil(updated); test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            local after = assert(caller:call("app:probe", { op = "get", id = id }))
            test.eq(after.expected_revision, before.expected_revision)
            test.eq(after.config.stages.scout.agent_id, before.config.stages.scout.agent_id)
        end)
        test.it("returns a typed error after a selected agent is deleted", function()
            local owner = uuid.v4()
            local caller = data.caller(owner)
            local agent_id = create(caller)
            local id = assert(caller:call("app:probe", { op = "create", input = { title = "Deleted scout", config = config(agent_id) } })).component_id
            assert(caller:call("kickside.agents.registry:a_delete", { component_id = agent_id }))
            local upload = data.upload(owner, "application/pdf", "Original bytes", "# Invoice\nThe total amount is 1250.")
            local result, err = caller:call("kickside.docscout:invoke", { extractor_id = id, upload_id = upload })
            test.is_nil(result); test.not_nil(err)
            test.is_true(errors.is(err, errors.NOT_FOUND) or errors.is(err, errors.PERMISSION_DENIED))
            test.eq(err:details().cause.details.code, "docscout_agent_access")
        end)
        for _, budget in ipairs({ "max_rounds", "max_extra_queries" }) do
            test.it("requires a positive " .. budget .. " for a selected agent", function()
                local caller = data.caller(uuid.v4())
                local cfg = config(create(caller))
                cfg.stages.scout[budget] = 0
                local saved, err = caller:call("app:probe", { op = "create", input = { title = "Zero scout budget", config = cfg } })
                test.is_nil(saved); test.not_nil(err); test.is_true(errors.is(err, errors.INVALID), tostring(err))
            end)
        end
        test.it("rejects agent references outside the agent loop option", function()
            local caller = data.caller(uuid.v4())
            local cfg = config(create(caller)); cfg.stages.scout.mode = "loop"
            local saved, err = caller:call("app:probe", { op = "create", input = { title = "Inactive reference", config = cfg } })
            test.is_nil(saved); test.is_true(errors.is(err, errors.INVALID))
        end)
    end)
end) }
