-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Docscout's own policies, evaluated without the harness's broad test scope:
-- what a member of the selected group may reach, what stays private to the
-- evaluation worker, and what a user outside the group gets.
local test = require("test")
local registry = require("registry")
local security = require("security")
local contract = require("contract")
local funcs = require("funcs")
local uuid = require("uuid")
local json = require("json")

local MEMBER = { "kickside.docscout.security:module_access", "kickside.docscout.security:module_runtime", "kickside.docscout.security:member_endpoints" }
local WORKER = { "kickside.docscout.security:system_db_access", "kickside.docscout.security:eval_defer", "kickside.docscout.security:eval_actor" }
local VIEWS = { "kickside.docscout:create_view", "kickside.docscout:manage_view", "kickside.docscout:page_view", "kickside.docscout:ui_static" }

local function scope_of(ids: { string }): any
    local policies = {}
    for _, id in ipairs(ids) do policies[#policies + 1] = assert(security.policy(id)) end
    return security.new_scope(policies)
end

local function endpoints(): { string }
    local found = assert(registry.find({ [".kind"] = "http.endpoint" }))
    local ids = {}
    for _, e in ipairs(found) do
        local id = tostring(e.id)
        if id:find("^kickside%.docscout%.api:") then ids[#ids + 1] = id end
    end
    table.sort(ids)
    return ids
end

return { run = test.run_cases(function()
    test.describe("Docscout access", function()
        test.it("attaches member policies to the selected group and keeps worker policies off every group", function()
            for _, id in ipairs(MEMBER) do
                local groups = assert(registry.get(id)).data.groups or {}
                test.eq(#groups, 1, id); test.eq(groups[1], "app:docscout_members", id)
            end
            for _, id in ipairs(WORKER) do
                test.eq(#(assert(registry.get(id)).data.groups or {}), 0, id)
            end
        end)

        test.it("lets a member reach every Docscout endpoint, view and caller", function()
            local scope, actor = scope_of(MEMBER), security.new_actor("member", {})
            local listed = endpoints()
            test.eq(#listed, 11)
            for _, id in ipairs(listed) do test.eq(scope:evaluate(actor, "access", id, {}), "allow", id) end
            for _, id in ipairs(VIEWS) do test.eq(scope:evaluate(actor, "access", id, {}), "allow", id) end
            for _, id in ipairs({ "kickside.docscout.blocks:extract_run", "kickside.docscout:extraction_run" }) do
                test.eq(scope:evaluate(actor, "funcs.call", id, {}), "allow", id)
            end
            test.eq(scope:evaluate(actor, "registry.get", "kickside.docscout:config_schema", {}), "allow")
        end)

        test.it("assigns tool access independently from member access", function()
            local actor = security.new_actor("member", {})
            local members = scope_of(MEMBER)
            test.eq(members:evaluate(actor, "funcs.call", "kickside.docscout.traits:run_tool", {}), "undefined")
            local tools = scope_of({ "kickside.docscout.security:tool_access" })
            test.eq(tools:evaluate(actor, "funcs.call", "kickside.docscout.traits:run_tool", {}), "allow")
            test.eq(assert(registry.get("kickside.docscout.security:tool_access")).meta.intent, "tool_access")
            test.is_true(assert(registry.get("kickside.docscout.traits:run_tool")).meta.private)
            test.eq(assert(registry.get("kickside.docscout:nav_item")).meta.access, "kickside.docscout.api:list.endpoint")
        end)
        test.it("refuses a restricted member's direct cleanup of another owner's component", function()
            local owner = "owner-" .. uuid.v4()
            local caller = funcs.new():with_actor(security.new_actor(owner, {})):with_scope(scope_of({ "app:user" }))
            local config = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
            local created = assert(caller:call("app:probe", { op = "create", input = { title = "Private", config = config } }))
            local definition = assert(contract.get("kickside.contract:deletable"))
            local binding, open_err = definition:with_actor(security.new_actor("other-" .. uuid.v4(), {})):with_scope(scope_of(MEMBER))
                :open("kickside.docscout:extractor", { component_id = created.component_id })
            local result, err = nil, open_err
            if binding then result, err = binding:delete({}) end
            test.is_nil(result); test.not_nil(err); test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            test.not_nil((caller:call("app:probe", { op = "get", id = created.component_id })))
        end)
        test.it("keeps the evaluation worker and its identity capabilities from members", function()
            local scope, actor = scope_of(MEMBER), security.new_actor("member", {})
            test.eq(scope:evaluate(actor, "funcs.call", "kickside.docscout.evals:case_worker", {}), "undefined")
            test.eq(scope:evaluate(actor, "kickside.execution.defer", "kickside.docscout.evals:case_worker", {}), "undefined")
            test.eq(scope:evaluate(actor, "security.actor.create", "*", {}), "undefined")
            test.eq(scope:evaluate(actor, "db.get", "app:db", {}), "undefined")
            local worker = scope_of(WORKER)
            test.eq(worker:evaluate(actor, "kickside.execution.defer", "kickside.docscout.evals:case_worker", {}), "allow")
            test.eq(worker:evaluate(actor, "kickside.execution.defer", "kickside.docscout.traits:run_tool", {}), "undefined")
            test.eq(worker:evaluate(actor, "db.get", "app:db", {}), "allow")
        end)

        test.it("gives a user outside the group no Docscout endpoint, view or caller", function()
            local scope, actor = security.new_scope({}), security.new_actor("outsider", {})
            for _, id in ipairs(endpoints()) do test.eq(scope:evaluate(actor, "access", id, {}), "undefined", id) end
            for _, id in ipairs(VIEWS) do test.eq(scope:evaluate(actor, "access", id, {}), "undefined", id) end
            test.eq(scope:evaluate(actor, "funcs.call", "kickside.docscout.traits:run_tool", {}), "undefined")
        end)
    end)
end) }
