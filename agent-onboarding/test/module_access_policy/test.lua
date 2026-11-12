local test = require("test")
local registry = require("registry")
local security = require("security")
local funcs = require("funcs")
local http_client = require("http_client")
local json = require("json")
local system = require("system")
local uuid = require("uuid")
local memory_stores = require("memory_stores")
local memory_config = require("memory_config")

local function module_access_scope(member)
    local policies, seen = {}, {}
    local function include(id)
        if seen[id] then return end
        seen[id] = true
        local entry, entry_err = registry.get(id)
        test.is_nil(entry_err, id)
        test.not_nil(entry, id)
        local policy, policy_err = security.policy(id)
        test.is_nil(policy_err, id)
        policies[#policies + 1] = policy
        for _, child in ipairs(entry.meta.includes or {}) do include(child) end
    end
    if member then
        include("agent_onboarding_test:member_probe")
        for _, suffix in ipairs({"runtime_security", "runtime_context", "contract_methods", "database", "environment", "fixture_catalog"}) do
            include("agent_onboarding_test:member_" .. suffix)
        end
        local entries, err = registry.find({["meta.intent"]="module_access"})
        test.is_nil(err)
        for _, entry in ipairs(entries) do
            if entry.meta.surface ~= "kickside.knowledge" then include(tostring(entry.id)) end
        end
    else
        include("kickside.agent_onboarding.security:module_access")
    end
    local scope, scope_err = security.new_scope(policies)
    test.is_nil(scope_err)
    return scope
end

local function member_call(actor, op, input)
    local result, err = funcs.new():with_actor(security.new_actor(actor, {}))
        :with_scope(module_access_scope(true)):call("agent_onboarding_test:probe", op, input)
    test.is_nil(err, tostring(err))
    return result
end

local function define_tests()
    test.describe("Module access composition", function()
        local tokens = {}
        test.after_each(function()
            local store = assert(security.token_store("agent_onboarding_test:member_tokens"))
            for _, token in ipairs(tokens) do test.is_true((store:revoke(token))) end
            store:close()
            tokens = {}
        end)
        local function onboard(actor, input)
            local scope = module_access_scope(true)
            local identity = security.new_actor(actor, {})
            test.eq(scope:evaluate(identity, "funcs.call", "kickside.knowledge.registry:kb_create"), "undefined")
            local store = assert(security.token_store("agent_onboarding_test:member_tokens"))
            local token = assert(store:create(identity, scope, {expiration="5m"}))
            tokens[#tokens + 1] = token
            store:close()
            local gateway = assert(system.supervisor.state("app:gateway"))
            local port = assert(gateway.details:match(":(%d+)$"))
            local response, err = http_client.request("POST", "http://127.0.0.1:" .. port .. "/api/agent-onboarding/agents", {
                headers={Authorization="Bearer " .. token, ["Content-Type"]="application/json"},
                body=assert(json.encode(input)),
            })
            test.is_nil(err, tostring(err))
            test.eq(response.status_code, 200, response.body)
            local result = assert(json.decode(response.body))
            test.eq(result.success, true, response.body)
            return result
        end
        local function personal_memory(actor, agent_id)
            local rows = member_call(actor, "knowledge")
            test.eq(#rows, 1)
            local memory = rows[1]
            test.eq(memory.impl_id, "kickside.memory:memory_store")
            test.eq(memory.meta.title, "My Memory")
            test.eq(memory.meta.kb_type, "memory")
            test.eq(memory.meta.embedding_model, "class:embed")
            test.is_nil(memory.parent_id)
            test.eq(member_call(actor, "owner", memory.component_id), actor)
            local store = assert(memory_stores.get(memory.component_id))
            test.eq(store.kb_type, "memory")
            test.eq(store.embedding_model, "class:embed")
            local defaults = assert(memory_config.defaults())
            for key, value in pairs(defaults) do test.eq(store.config[key], value, key) end
            for key in pairs(store.config) do test.not_nil(defaults[key], key) end
            local agent = member_call(actor, "agent", agent_id).agent
            test.eq(#agent.traits, 1)
            test.eq(agent.traits[1], "kickside.memory:memory")
            test.eq(agent.trait_contexts["kickside.memory:memory"].memory_id, memory.component_id)
            return memory.component_id
        end
        test.it("creates caller-owned personal memory through the endpoint and reuses it per member", function()
            local first, second = "member_" .. uuid.v4(), "member_" .. uuid.v4()
            local created = onboard(first, {title="Personal agent", traits={}})
            local memory_id = personal_memory(first, created.component_id)
            local repeated = onboard(first, {title="Another agent", traits={}})
            test.eq(personal_memory(first, repeated.component_id), memory_id)
            local other = onboard(second, {title="Other member agent", traits={}})
            test.is_true(personal_memory(second, other.component_id) ~= memory_id)
            test.eq(personal_memory(first, created.component_id), memory_id)
        end)
        test.it("keeps the endpoint memory shape fixed despite Knowledge-shaped request arguments", function()
            local actor = "member_" .. uuid.v4()
            local parent = onboard(actor, {title="Parent agent", memory=false, traits={}})
            test.eq(#member_call(actor, "knowledge"), 0)
            local created = onboard(actor, {
                title="Personal agent", traits={}, name="Extra knowledge", kb_type="unavailable",
                engine="unavailable", embedding_model="unavailable", parent_id=parent.component_id,
                config={extraction_model="unavailable", capture_conversation=false, arbitrary=true},
            })
            personal_memory(actor, created.component_id)
        end)
        test.it("admits exactly the listed endpoint identities", function()
            local policy_id = "kickside.agent_onboarding.security:module_access"
            local declaration, declaration_err = registry.get(policy_id)
            test.is_nil(declaration_err)
            test.not_nil(declaration)
            local expected = {
                ["kickside.agent_onboarding:create_agent.endpoint"] = true,
            }
            local runtime, runtime_err = registry.get(declaration.meta.includes[1])
            test.is_nil(runtime_err)
            test.not_nil(runtime)
            test.is_true(#declaration.data.policy.resources > 0)
            test.eq(#declaration.data.policy.resources, #runtime.data.policy.resources)
            for index, resource in ipairs(runtime.data.policy.resources) do
                test.eq(declaration.data.policy.resources[index], resource)
            end
            test.eq(#declaration.data.policy.actions, #runtime.data.policy.actions)
            for index, action in ipairs(runtime.data.policy.actions) do
                test.eq(declaration.data.policy.actions[index], action)
                test.is_true(action ~= "access", action)
            end
            test.eq(declaration.data.policy.effect, runtime.data.policy.effect)
            local runtime_policy, runtime_policy_err = security.policy(tostring(runtime.id))
            test.is_nil(runtime_policy_err)
            local entries, entries_err = registry.find({})
            test.is_nil(entries_err)
            local actor = security.new_actor("runtime-grant-member", {})
            local member_policy, member_policy_err = security.policy(policy_id)
            test.is_nil(member_policy_err)
            for _, entry in ipairs(entries) do
                for _, action in ipairs(runtime.data.policy.actions) do
                    test.eq(member_policy:evaluate(actor, action, tostring(entry.id)),
                        runtime_policy:evaluate(actor, action, tostring(entry.id)), tostring(entry.id))
                end
            end
            local policy, policy_err = security.policy("kickside.agent_onboarding.security:member_endpoints")
            test.is_nil(policy_err)
            local actor = security.new_actor("listed-endpoint-member", {})
            local endpoints, find_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(find_err)
            for _, entry in ipairs(endpoints) do
                local id = tostring(entry.id)
                test.eq(policy:evaluate(actor, "access", id), expected[id] and "allow" or "undefined", id)
            end
            for id in pairs(expected) do
                test.eq(policy:evaluate(actor, "access", id .. ".unlisted"), "undefined", id)
            end
        end)
        test.it("admits owned member endpoints and rejects other modules", function()
            local policy, err = security.policy("kickside.agent_onboarding.security:member_endpoints")
            test.is_nil(err)
            test.not_nil(policy)
            local actor = security.new_actor("module-member", {})
            for _, id in ipairs({
                "kickside.agent_onboarding:create_agent.endpoint",
            }) do
                test.not_nil(registry.get(id), id)
                test.eq(policy:evaluate(actor, "access", id), "allow", id)
                test.eq(policy:evaluate(actor, "access", (id .. ".unlisted")), "undefined", id)
                test.eq(policy:evaluate(actor, "funcs.call", id), "undefined", id)
            end
            for _, id in ipairs({ "unrelated.module:list.endpoint", "kickside.agent_onboarding_extension:list.endpoint" }) do
                test.eq(policy:evaluate(actor, "access", id), "undefined", id)
            end
        end)
        test.it("keeps knowledge creation capabilities on the onboarding function", function()
            local scope = module_access_scope()
            local actor = security.new_actor("personal-memory-member", {})
            local expected = {
                { "contract.get", "kickside.knowledge:knowledge_bases" },
                { "contract.open", "kickside.knowledge.registry:knowledge_bases_registry" },
                { "contract.call", "create" },
                { "funcs.call", "kickside.knowledge.registry:kb_create" },
                { "contract.get", "kickside.knowledge:kb_store_lifecycle" },
            }
            local entry, entry_err = registry.get("kickside.agent_onboarding:create_agent")
            test.is_nil(entry_err)
            local attached = entry.data.security and entry.data.security.policies or {}
            test.eq(#attached, #expected)
            test.is_nil(entry.data.security.actor)
            local policies = {}
            local grants = {}
            for _, id in ipairs(attached) do
                local declaration = assert(registry.get(id))
                local rule = declaration.data.policy
                test.eq(#rule.resources, 1)
                local key = rule.actions .. "|" .. rule.resources[1]
                test.is_nil(grants[key], key)
                grants[key] = true
                policies[#policies + 1] = assert(security.policy(id))
            end
            local function_scope = assert(security.new_scope(policies))
            for _, pair in ipairs(expected) do
                local label = pair[1] .. ": " .. pair[2]
                test.is_true(grants[pair[1] .. "|" .. pair[2]] == true, label)
                test.eq(scope:evaluate(actor, pair[1], pair[2]), "undefined", label)
                test.eq(function_scope:evaluate(actor, pair[1], pair[2]), "allow", label)
            end
            for _, id in ipairs({
                "kickside.knowledge.api:create_kb.endpoint",
                "kickside.knowledge.api:list_kb.endpoint",
                "kickside.knowledge.registry:kb_delete",
                "kickside.knowledge.retrieval:kb_search",
            }) do
                test.eq(scope:evaluate(actor, "access", id), "undefined", id)
                test.eq(scope:evaluate(actor, "funcs.call", id), "undefined", id)
                test.eq(function_scope:evaluate(actor, "funcs.call", id), "undefined", id)
            end
        end)
        test.it("refuses direct Knowledge creation by an onboarding member", function()
            local actor = security.new_actor("personal-memory-member", {})
            local result, err = funcs.new():with_actor(actor):with_scope(module_access_scope(true))
                :call("agent_onboarding_test:probe", "knowledge_create", {
                    name="Additional memory", kb_type="memory", embedding_model="class:embed",
                })
            test.is_nil(err, tostring(err))
            test.is_nil(result.result)
            test.not_nil(result.error)
            test.eq(result.kind, errors.PERMISSION_DENIED, result.error)
        end)
        test.it("refuses direct Knowledge contract creation by an onboarding member", function()
            local result = member_call("member_" .. uuid.v4(), "knowledge_contract_create", {
                name="Additional memory", kb_type="memory", embedding_model="class:embed",
            })
            test.is_nil(result.result)
            test.not_nil(result.error)
            test.eq(result.stage, "get", result.error)
            test.eq(result.kind, errors.PERMISSION_DENIED, result.error)
        end)
        test.it("includes module discovery without an application blanket grant", function()
            local scope = module_access_scope()
            local declaration = registry.get("kickside.agent_onboarding.security:module_access")
            test.is_true(type(declaration.meta.title) == "string" and declaration.meta.title ~= "")
            test.eq(declaration.meta.intent, "module_access")
            test.eq(declaration.meta.surface, "kickside.agent_onboarding")
            test.is_true(declaration.meta.private ~= true)
            local actor = security.new_actor("module-member", {})
            test.eq(scope:evaluate(actor, "registry.get", "kickside.agent_onboarding:eligibility"), "allow")
            for _, action in ipairs({ "access", "registry.get", "funcs.call" }) do
                test.eq(scope:evaluate(actor, action, "unrelated.module:list.endpoint"), "undefined", action)
            end
        end)
    end)
end
local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
