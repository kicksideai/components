local splash = require("splash")
local funcs = require("funcs")
local registry = require("registry")
local agents = require("agents")
local component = require("component")
local security = require("security")
local onboarding = require("onboarding")
local component_types = require("component_types")
local function run(op: string, input: any): any
    if op == "onboard_memory_failure" then
        local failing=onboarding.new({contract={get=function()
            return {open=function()
                return {create=function()
                    return nil, errors.new({kind=errors.INTERNAL, message="memory service unavailable"})
                end}
            end}
        end}})
        local result, err=failing.create(input)
        return {result=result, error=err and tostring(err), kind=err and err:kind()}
    end
    if op == "onboard" then
        local result, err = onboarding.create(input)
        return { result = result, error = err and tostring(err), kind = err and err:kind() }
    end
    if op == "memories" then
        local rows, err = component.query({impl_ids={"kickside.memory:memory_store"}, meta={[component_types.OWNER_META_KEY]=security.actor():id()}, include={meta=true}, limit=100})
        if err then error(tostring(err)) end
        return rows
    end
    if op == "resolve" then return { splash = splash.resolve() } end
    if op == "dismiss" then local ok, err = splash.mark_seen("first_agent"); return { ok = ok, error = err } end
    if op == "reopen" then local ok, err = splash.mark_unseen("first_agent"); return { ok = ok, error = err } end
    if op == "catalog" then
        local entries, err = registry.find({[".kind"]="registry.entry", ["meta.type"]="agent.trait"})
        if err then error(tostring(err)) end
        local out = {}
        for _, entry in ipairs(entries) do
            if entry.meta.public and not entry.meta.private then out[#out+1] = entry.id end
        end
        return out
    end
    if op == "create_rejected" then
        local result, err = agents.create(input)
        return { result = result, error = err and tostring(err), kind = err and err:kind() }
    end
    if op == "create" then return agents.create(input) end
    if op == "canonical_create" then
        local result, err = funcs.call("kickside.agents.registry:a_create", {name=input.title})
        if err then error(tostring(err)) end
        return result
    end
    if op == "create_foreign" then return agents.create(input) end
    if op == "agent" then return agents.get(input) end
    if op == "owner" then local owner, err = component.component_owner(input); if err then error(tostring(err)) end; return owner end
    if op == "share" then
        local svc, err = component.get_service(); if err then error(tostring(err)) end
        if not svc then error("component service unavailable") end
        return svc:grant_subtree({root_component_id=input.id, subject={subject_id=input.user, subject_type="user"}, access_mask=component.ACCESS.READ})
    end
    error("unknown probe operation")
end
return { run = run }
