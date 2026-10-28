-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Docscout's own policies, evaluated without the harness's broad test scope:
-- what a member of the selected group may reach, what stays private to the
-- evaluation worker, and what a user outside the group gets.
local test = require("test")
local registry = require("registry")
local security = require("security")

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
                test.eq(#groups, 1, id); test.eq(groups[1], "app:user", id)
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
            for _, id in ipairs({ "kickside.docscout.traits:run_tool", "kickside.docscout.blocks:extract_run", "kickside.docscout:extraction_run" }) do
                test.eq(scope:evaluate(actor, "funcs.call", id, {}), "allow", id)
            end
            test.eq(scope:evaluate(actor, "registry.get", "kickside.docscout:config_schema", {}), "allow")
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
