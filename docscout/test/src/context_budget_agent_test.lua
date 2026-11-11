-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local fs = require("fs")
local users = require("users")
local groups = require("groups")
local store = require("store")
local shapes = require("shapes")
local ai = require("ai")
local user_agent = require("user_agent")

local function scout(input: any): (any?, error?)
    local step = { meter = ai.meter() }
    local answer, calls, err = user_agent.run(input.run, step, input.system, input.user)
    if err then return nil, err end
    return { answer = answer, calls = calls, step = step, budget_dropped = input.run.budget_dropped }, nil
end

local function config(agent: string): any
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local cfg, field = schema.default, schema.properties.fields.items.default
    field.name, field.type, field.description = "total", "number", "Total amount"
    cfg.fields = { field }
    cfg.stages.scout.mode, cfg.stages.scout.agent_id = "agent", agent
    cfg.stages.scout.max_rounds, cfg.stages.scout.max_extra_queries = 1, 1
    cfg.stages.scout.tools = { "keyword_search" }
    cfg.stages.map.enabled, cfg.stages.prefetch.enabled, cfg.stages.deep.enabled = false, false, false
    cfg.stages.extract.model = "class:docscout-success"
    cfg.stages.verify.check_support = false
    cfg.retrieval.embedding_model, cfg.retrieval.context, cfg.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    cfg.retrieval.chunk_size, cfg.retrieval.overlap = 16000, 0
    return cfg
end

local function document(owner: string, component_id: string): any
    local chunks = {
        { ordinal = 1, section_id = "s1", heading_path = "Background", content = string.rep("total amount oversized-background-passage. ", 1800) },
        { ordinal = 2, section_id = "s2", heading_path = "Invoice", content = "The total amount is 1250." },
    }
    for _, chunk in ipairs(chunks) do
        chunk.vector = {}
        for n = 1, 512 do chunk.vector[n] = n == 1 and 1.0 or 0.0 end
    end
    local value = { owner_id = owner, component_id = component_id, upload_id = "upload-" .. uuid.v4(), checksum = "budget", processing_key = "budget",
        outline = { { id = "s1", title = "Background", chunk_start = 1, chunk_end = 1 }, { id = "s2", title = "Invoice", chunk_start = 2, chunk_end = 2 } },
        page_count = 0, tokens = 15000, expires_at = "2999-01-01T00:00:00Z" }
    value.id = assert(store.save(value, chunks))
    return value
end

local function run(agent_prompt: string, system: string, user: string, deep: boolean?): (any?, error?)
    local owner = uuid.v4()
    assert(users.create({ user_id = owner, email = owner .. "@example.test", password = "fixture-password", status = "active" }))
    assert(groups.assign_user_to_group(owner, "app:user"))
    local caller = data.caller(owner)
    local agent = assert(caller:call("kickside.agents.registry:a_create", {
        name = "Document researcher", model = "class:docscout-budget-agent", max_tokens = 256, traits = {}, tools = {}, delegates = {}, prompt = agent_prompt,
    })).component_id
    local cfg = config(agent)
    if deep then
        cfg.fields[1].strategy = "deep"
        cfg.stages.deep.enabled = true
    end
    local component_id = assert(caller:call("app:probe", { op = "create", input = { title = "Budget reader", config = cfg } })).component_id
    local doc = document(owner, component_id)
    return caller:call("app:context_budget_agent_probe", { run = { component_id = component_id, document = doc, config = cfg, pool = shapes.pool() }, system = system, user = user })
end

return { scout = scout, run = test.run_cases(function()
    test.describe("Selected agent context budget", function()
        test.it("bounds the initial handoff and retains a smaller tool passage after an oversized one", function()
            local storage = assert(fs.get("app:uploads"))
            local _, write_err = storage:writefile("budget-agent-requests.json", "[]")
            test.is_nil(write_err)
            local initial = string.rep("oversized-initial-handoff. ", 1800)
            local result, err = run("Find the total amount using keyword_search and report the supporting passage.", initial, "Find evidence in the document.")
            test.is_nil(err, tostring(err)); test.not_nil(result.answer)
            local requests = assert(json.decode(assert(storage:readfile("budget-agent-requests.json"))))
            test.eq(#requests, 2)
            local first, second = assert(json.encode(requests[1])), assert(json.encode(requests[2]))
            test.contains(first, "Docscout context truncated to fit the model's context budget.")
            test.is_nil(first:find(initial, 1, true))
            test.contains(second, "Docscout context truncated to fit the model's context budget.")
            test.contains(second, "The total amount is 1250.")
            test.is_nil(second:find(string.rep("total amount oversized-background-passage. ", 1800), 1, true))
        end)
        test.it("maps a selected agent provider length rejection to the context budget error", function()
            local result, err = run("provider_context_rejection", "Find evidence.", "Find the total amount.")
            test.is_nil(result); test.not_nil(err)
            test.eq(err:details().code, "context_budget_exceeded")
            test.is_false(err:retryable())
        end)
        test.it("measures partial metadata when selecting a bounded tool result", function()
            local owner = uuid.v4()
            assert(users.create({ user_id = owner, email = owner .. "@example.test", password = "fixture-password", status = "active" }))
            assert(groups.assign_user_to_group(owner, "app:user"))
            local caller = data.caller(owner)
            local agent = assert(caller:call("kickside.agents.registry:a_create", {
                name = "Document researcher", model = "class:docscout-budget-agent", max_tokens = 256, traits = {}, tools = {}, delegates = {},
            })).component_id
            local cfg = config(agent)
            local component_id = assert(caller:call("app:probe", { op = "create", input = { title = "Budget reader", config = cfg } })).component_id
            local doc = document(owner, component_id)
            local context = { component_id = component_id, document_id = doc.id, outline = doc.outline,
                embedding_model = doc.embedding_model, tool = "keyword_search" }
            local full = assert(caller:with_context({ docscout = context }):call("kickside.docscout.engine:document_tool", { query = "total amount", limit = 20 }))
            local marker = "[Docscout context truncated to fit the model's context budget.]"
            local candidate = { text = marker, chunks = { full.chunks[2] }, docscout = full.docscout }
            context.context_budget = { model = "class:docscout-budget-agent", share = ai.estimate_value(candidate) }
            local bounded = assert(caller:with_context({ docscout = context }):call("kickside.docscout.engine:document_tool", { query = "total amount", limit = 20 }))
            test.is_true(ai.estimate_value(bounded) <= context.context_budget.share)
            test.eq(json.encode(bounded.docscout.codes), '["context_budget_partial"]')
        end)
        test.it("does not mark a deep field partial when only the selected scout handoff is truncated", function()
            local result, err = run("Find the total amount using keyword_search and report the supporting passage.",
                string.rep("oversized-initial-handoff. ", 1800), "Find evidence in the document.", true)
            test.is_nil(err, tostring(err))
            test.is_true(result.budget_dropped == nil or result.budget_dropped.total == nil)
        end)
    end)
end) }
