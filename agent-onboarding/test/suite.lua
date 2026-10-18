local test = require("test")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
local registry = require("registry")
local function call(actor, op, input, restriction)
    local allow, aerr = security.policy("agent_onboarding_test:scope")
    local deny, derr = security.policy("agent_onboarding_test:no_instance")
    if aerr or derr then error(tostring(aerr or derr)) end
    local policies = {allow, deny}
    if restriction then policies[#policies + 1] = assert(security.policy(restriction)) end
    local result, err = funcs.new():with_actor(security.new_actor(actor, {}))
        :with_scope(security.new_scope(policies)):call("agent_onboarding_test:probe", op, input)
    if err then error(tostring(err)) end
    return result
end
local function fresh() return "onboarding_" .. uuid.v4() end
local function id(actor) local r=call(actor,"resolve"); return r.splash and r.splash.id end
local function define_tests()
    test.describe("first-agent onboarding", function()
        test.it("requires access to agent creation and every model input", function()
            for _, restriction in ipairs({"agent_onboarding_test:no_agent_creation", "agent_onboarding_test:no_model_list", "agent_onboarding_test:no_model_classes"}) do
                local result = call(fresh(), "resolve", nil, restriction)
                test.is_nil(result.splash, restriction)
            end
        end)
        test.it("shows for a user with no owned agent", function() test.eq(id(fresh()), "first_agent") end)
        test.it("stays dismissed and reopens through the UI owner", function()
            local a=fresh(); test.eq(call(a,"dismiss").ok,true); test.is_nil(id(a))
            test.eq(call(a,"reopen").ok,true); test.eq(id(a),"first_agent")
        end)
        test.it("isolates completion between users", function()
            local a,b=fresh(),fresh(); test.eq(call(a,"dismiss").ok,true)
            test.is_nil(id(a)); test.eq(id(b),"first_agent")
        end)
        test.it("discovers installed capabilities through the live agents catalog", function()
            local catalog=call(fresh(),"catalog")
            local installed=false
            for _,trait in ipairs(catalog) do
                if trait=="kickside.onboarding_fixture:installed" then installed=true end
                test.is_false(trait=="kickside.onboarding_fixture:private")
            end
            test.is_true(installed)
            local entries,err=registry.find({["meta.type"]="kickside.agent_onboarding.preset"})
            test.is_nil(err); test.eq(#entries,0)
        end)
        test.it("exposes the component props schema through the component registry", function()
            local entry, err = registry.get("kickside.agent_onboarding:onboarding_view")
            test.is_nil(err)
            test.not_nil(entry.data.props)
            test.eq(entry.data.props.type, "object")
        end)
        test.it("declares the UI server value kind and default binding", function()
            local requirement, err = registry.get("kickside.agent_onboarding:ui_server")
            test.is_nil(err)
            test.not_nil(requirement)
            test.eq(requirement.meta.value_kind, "http.service")
            test.eq(requirement.data.default, "app:gateway")
        end)
        test.it("rejects capabilities absent from the installed catalog",function()
            local actor=fresh()
            local result=call(actor,"create_rejected",{title="Unknown capability",model="class:fast",traits={"kickside.onboarding_fixture:missing"}})
            test.is_nil(result.result); test.not_nil(result.error)
            test.eq(result.kind,"Invalid")
            test.contains(result.error,"trait not found: kickside.onboarding_fixture:missing")
            test.eq(id(actor),"first_agent")
        end)
        test.it("default creation matches the agents owner's default creation",function()
            local a,b=fresh(),fresh()
            local canonical=call(a,"canonical_create",{title="Canonical "..a})
            local expected=call(a,"agent",canonical.component_id).agent
            local created=call(b,"create",{title="First "..b})
            test.eq(created.success,true,tostring(created.error))
            local actual=call(b,"agent",created.component_id).agent
            for _,field in ipairs({"model","prompt","max_tokens","memory_target_id","memory_provider_id"}) do test.eq(actual[field],expected[field],field) end
            test.eq(#actual.traits,#expected.traits)
            for i,trait in ipairs(expected.traits) do test.eq(actual.traits[i],trait) end
            test.eq(call(b,"owner",created.component_id),b)
            test.is_nil(id(b)); test.eq(call(b,"reopen").ok,true); test.is_nil(id(b))
            test.eq(call(a,"agent",created.component_id).success,false)
        end)
        test.it("applies exactly the selected capabilities and caller ownership",function()
            local a,b=fresh(),fresh(); test.eq(id(a),"first_agent")
            local chosen={"kickside.onboarding_fixture:installed","kickside.onboarding_fixture:second"}
            local contexts={["kickside.onboarding_fixture:installed"]={focus="Planning"}}
            local created=call(a,"create",{title="Chosen "..a,model="class:fast",traits=chosen,trait_contexts=contexts})
            test.eq(created.success,true,tostring(created.error)); test.not_nil(created.component_id)
            local result=call(a,"agent",created.component_id); test.eq(result.success,true)
            test.eq(#result.agent.traits,#chosen)
            for i,trait in ipairs(chosen) do test.eq(result.agent.traits[i],trait) end
            test.eq(result.agent.trait_contexts[chosen[1]].focus,"Planning")
            test.is_nil(result.agent.trait_contexts[chosen[2]])
            test.eq(call(a,"owner",created.component_id),a)
            test.is_nil(id(a)); test.eq(id(b),"first_agent")
            test.eq(call(a,"dismiss").ok,true); test.is_nil(id(a))
            test.eq(call(b,"agent",created.component_id).success,false)
        end)
        test.it("cannot assign creation to a different user", function()
            local a,b=fresh(),fresh()
            local created=call(a,"create_foreign",{title="Owner boundary",model="class:fast",traits={},owner_id=b,user_id=b})
            test.eq(created.success,true,tostring(created.error))
            test.eq(call(a,"owner",created.component_id),a)
            test.eq(call(b,"agent",created.component_id).success,false)
            test.eq(id(b),"first_agent")
        end)
        test.it("shared agents do not suppress the recipient's first-agent prompt",function()
            local a,b=fresh(),fresh()
            local created=call(a,"create",{title="Shared "..a,model="class:fast"})
            test.eq(created.success,true,tostring(created.error))
            local shared=call(a,"share",{id=created.component_id,user=b}); test.eq(shared.success,true,tostring(shared.error))
            test.eq(call(b,"agent",created.component_id).success,true)
            test.eq(id(b),"first_agent")
        end)
    end)
end
return { run = test.run_cases(define_tests) }
