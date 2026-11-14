-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Module access: exact endpoint identities, the requirement contract and unauthenticated HTTP.
local test = require("test")
local scoped = require("scoped")
local rows = require("rows")
local steps = require("steps")
local registry = require("registry")
local security = require("security")
local http_client = require("http_client")
local composition = require("composition")
local funcs = require("funcs")

local MEMBER_ENDPOINTS = {
    ["kickside.work.api:list_packs.endpoint"] = true,
    ["kickside.work.api:pack_fleet.endpoint"] = true,
    ["kickside.work.api:bulk.endpoint"] = true,
    ["kickside.work.api:bulk_status.endpoint"] = true,
    ["kickside.work.api:cancel_bulk.endpoint"] = true,
    ["kickside.work.api:plan_move.endpoint"] = true,
    ["kickside.work.api:move.endpoint"] = true,
    ["kickside.work.api:move_status.endpoint"] = true,

    ["kickside.work.api:approve.endpoint"] = true,
    ["kickside.work.api:report.endpoint"] = true,
    ["kickside.work.api:list.endpoint"] = true,
    ["kickside.work.api:get_schema.endpoint"] = true,
    ["kickside.work.api:apply.endpoint"] = true,
    ["kickside.work.api:query.endpoint"] = true,
    ["kickside.work.api:count.endpoint"] = true,
    ["kickside.work.api:get.endpoint"] = true,
    ["kickside.work.api:list_changes.endpoint"] = true,
    ["kickside.work.api:list_history.endpoint"] = true,
    ["kickside.work.api:get_time_in_state.endpoint"] = true,
    ["kickside.work.api:list_links.endpoint"] = true,
    ["kickside.work.api:list_comments.endpoint"] = true,
    ["kickside.work.api:list_stage_runs.endpoint"] = true,
    ["kickside.work.api:explain.endpoint"] = true,
    ["kickside.work.api:create_view.endpoint"] = true,
    ["kickside.work.api:save_view.endpoint"] = true,
    ["kickside.work.api:rename_view.endpoint"] = true,
    ["kickside.work.api:delete_view.endpoint"] = true,
    ["kickside.work.api:run_view.endpoint"] = true,
    ["kickside.work.api:get_view.endpoint"] = true,
    ["kickside.work.api:list_views.endpoint"] = true,
}
local ADMIN_ENDPOINTS = {
    ["kickside.work.api:pack_plan.endpoint"] = true,
    ["kickside.work.api:pack_apply.endpoint"] = true,
    ["kickside.work.api:update.endpoint"] = true,
    ["kickside.work.api:create.endpoint"] = true,
    ["kickside.work.api:plan_schema.endpoint"] = true,
    ["kickside.work.api:apply_schema.endpoint"] = true,
    ["kickside.work.api:resume_migration.endpoint"] = true,
    ["kickside.work.api:configure_plugin.endpoint"] = true,
}

-- exact checks that a policy lists exactly the expected endpoint ids and admits no other endpoint of the module.
local function exact(policy_id: string, expected: { [string]: boolean })
    local declaration = assert(registry.get(policy_id))
    local listed = {}
    for _, id in ipairs(declaration.data.policy.resources) do
        listed[id] = true
        test.eq(assert(registry.get(id)).kind, "http.endpoint", id)
        test.is_true(expected[id] == true, id)
    end
    for id in pairs(expected) do test.is_true(listed[id] == true, id) end
    local policy = assert(security.policy(policy_id))
    local actor = security.new_actor("work-member", {})
    local endpoints = assert(registry.find({ [".kind"] = "http.endpoint" }))
    local seen = 0
    for _, entry in ipairs(endpoints) do
        local id = tostring(entry.id)
        if id:find("^kickside%.work") then
            seen = seen + 1
            test.eq(policy:evaluate(actor, "access", id), expected[id] and "allow" or "undefined", id)
        end
    end
    test.eq(seen, 38)
    test.eq(policy:evaluate(actor, "access", "kickside.work.api:get.endpoint.unlisted"), "undefined")
end

local FRAMEWORK_CALLBACKS = { "kickside.work.persist:projection", "kickside.work.persist:projection_committed", "kickside.work.service:sync", "kickside.work.service:sync_position",
                "kickside.work.retention:owner", "kickside.work.binding:delete_func",
                "kickside.work.jobs:migrate", "kickside.work.jobs:migrate_batch", "kickside.work.jobs:bulk",
                "kickside.work.jobs:move", "kickside.work.jobs:pack", "kickside.work.jobs:operation_batch",
                "kickside.work.jobs:reindex", "kickside.work.jobs:reindex_batch", "kickside.work.jobs:recompute",
                "kickside.work.jobs:recompute_batch", "kickside.work.jobs:rebalance", "kickside.work.jobs:rebalance_batch",
                "kickside.work.jobs:process", "kickside.work.jobs:advance", "kickside.work.jobs:process_batch", "kickside.work.jobs:advance_batch" }

local function define()
    test.describe("module access", function()
        test.it("does not grant runtime authority to undeclared future resources", function()
            local policy = assert(security.policy("kickside.work.security:module_runtime"))
            local actor = security.new_actor("work-member", {})
            for _, action in ipairs({ "registry.get", "registry.find", "funcs.call", "funcs.security", "contract.call" }) do
                test.eq(policy:evaluate(actor, action, "kickside.work.service:undeclared_future_resource"), "undefined", action)
            end
        end)
        test.it("refuses direct member callback and barrier invocation before changing the board", function()
            local h = scoped.board(scoped.admin())
            local member = scoped.member()
            local before = rows.scalar("SELECT applied_seq AS n FROM kickside_work_board WHERE board_id = $1", { h.id })
            for _, target in ipairs(FRAMEWORK_CALLBACKS) do
                local _, err = member.call("direct", { target = target, input = {
                    board_id = h.id, thread_id = h.id, range = { to_seq = before + 1000000 }, events = {},
                } }, h.id)
                test.not_nil(err, target)
                test.eq(err:kind(), errors.PERMISSION_DENIED, target .. " " .. steps.detail(err))
                test.eq(rows.scalar("SELECT applied_seq AS n FROM kickside_work_board WHERE board_id = $1", { h.id }), before, target)
            end
        end)

        test.it("reserves framework callbacks for the framework invocation frame", function()
            local policy = assert(security.policy("kickside.work.security:module_runtime"))
            local actor = security.new_actor("work-member", {})
            for _, id in ipairs(FRAMEWORK_CALLBACKS) do
                test.eq(policy:evaluate(actor, "funcs.call", id), "undefined", id)
            end
        end)
        test.it("requires the independent tool capability for discovery and invocation", function()
            local actor = security.new_actor("work-member", {})
            local member = assert(security.policy("kickside.work.security:module_runtime"))
            local discovery = assert(security.policy("kickside.work.security:module_access"))
            local tools = assert(security.policy("kickside.work.security:work_tools"))
            for _, id in ipairs(assert(registry.get("kickside.work.security:work_tools")).data.policy.resources) do
                for _, action in ipairs({ "registry.get", "registry.find", "funcs.call", "funcs.security" }) do
                    test.eq(member:evaluate(actor, action, id), "undefined", id .. " " .. action)
                    test.eq(discovery:evaluate(actor, action, id), "undefined", id .. " " .. action)
                    test.eq(tools:evaluate(actor, action, id), "allow", id .. " " .. action)
                end
            end
            local session = scoped.member()
            local id = "kickside.work.traits:list_boards"
            test.eq(#assert(session.call("discover", { kind = "function.lua", id = id })), 0)
            local _, err = session.call("direct", { target = id, input = {} })
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            local executor = funcs.new():with_actor(session.actor):with_scope(session.scope:with(tools):with(assert(security.policy("app:caller_only"))))
            local found, ferr = executor:call("app:work_call", { op = "discover", request = { kind = "function.lua", id = id } })
            test.is_nil(ferr, steps.detail(ferr))
            test.eq(#found, 1)
            local result, rerr = executor:call("app:work_call", { op = "direct", request = { target = id, input = {} } })
            test.is_nil(rerr, steps.detail(rerr))
            test.not_nil(result.boards)
        end)
        test.it("requires the tool capability for trait manifests and their builders", function()
            local actor = security.new_actor("work-member", {})
            local member = assert(security.policy("kickside.work.security:module_access"))
            local tools = assert(security.policy("kickside.work.security:work_tools"))
            local session = scoped.member()
            local executor = funcs.new():with_actor(session.actor):with_scope(session.scope:with(tools):with(assert(security.policy("app:caller_only"))))
            for _, name in ipairs({ "work", "work_readonly", "work_admin", "build_work", "build_readonly" }) do
                local id = "kickside.work.traits:" .. name
                for _, action in ipairs({ "registry.get", "registry.find" }) do
                    test.eq(member:evaluate(actor, action, id), "undefined", id .. " " .. action)
                    test.eq(tools:evaluate(actor, action, id), "allow", id .. " " .. action)
                end
                local builder = name == "build_work" or name == "build_readonly"
                local kind = builder and "function.lua" or "registry.entry"
                test.eq(#assert(session.call("discover", { kind = kind, id = id })), 0)
                local found = assert(executor:call("app:work_call", { op = "discover", request = { kind = kind, id = id } }))
                test.eq(#found, 1)
                if builder then
                    local _, err = session.call("direct", { target = id, input = {} })
                    test.not_nil(err)
                    test.eq(err:kind(), errors.PERMISSION_DENIED)
                end
            end
        end)
        test.it("reserves every output for its service-only producer frame", function()
            local holders: { [string]: integer } = {}
            local members = assert(security.named_scope("kickside.security.groups:members"))
            local names = { "schema", "apply", "migration", "rebalance", "recompute", "reindex", "retention", "plugin", "operations", "board", "plugin_rebuild" }
            for _, name in ipairs(names) do
                local id = "kickside.work.security:" .. name .. "_output_publish"
                local entry = assert(registry.get(id))
                test.is_true(entry.meta.private == true, id)
                test.is_true(entry.meta.service_only == true, id)
                test.is_nil(entry.data.groups, id)
                test.is_false(members:contains(id), id)
                local expanded, err = composition.expand({ id })
                test.is_nil(expanded, id)
                test.eq((err :: error):kind(), errors.PERMISSION_DENIED, id)
                test.eq(entry.data.policy.actions, "threads.output.publish", id)
                test.eq(entry.data.policy.effect, "allow", id)
                for _, producer in ipairs(entry.meta.producers) do
                    local frame = assert(registry.get(producer))
                    test.eq(frame.kind, "function.lua", producer)
                    local attached = frame.data.security.policies
                    local carries = false
                    for _, policy in ipairs(attached) do if policy == id then carries = true end end
                    test.is_true(carries, producer)
                end
                for _, event in ipairs(entry.data.policy.resources) do
                    if event ~= "kickside.work.command:command.recorded" then test.is_nil(holders[event], event) end
                    holders[event] = (holders[event] or 0) + 1
                end
            end
            local count = 0
            for _, name in ipairs({ "board", "registry" }) do
                local binding = assert(registry.get("kickside.work.binding:" .. name))
                test.eq(#binding.meta.events.input, 0, name)
                for _, event in ipairs(binding.meta.events.output) do
                    count = count + 1
                    test.is_true(event.system_only == true, event.type)
                    test.eq(holders[event.type], event.type == "kickside.work.command:command.recorded" and 3 or 1, event.type)
                    holders[event.type] = nil
                end
            end
            test.eq(count, 32)
            test.is_nil(next(holders))
        end)

        test.it("admits members to exactly the member endpoints and administrators to board creation", function()
            exact("kickside.work.security:member_endpoints", MEMBER_ENDPOINTS)
            exact("kickside.work.security:admin_endpoints", ADMIN_ENDPOINTS)
        end)

        test.it("publishes a member policy and an administration policy that include private ones", function()
            local cases = { { "module_access", "module_access" }, { "work_admin", "module_management" } }
            for _, c in ipairs(cases) do
                local public = assert(registry.get("kickside.work.security:" .. c[1]))
                test.eq(public.meta.intent, c[2])
                test.eq(public.meta.surface, "kickside.work")
                test.is_nil(public.meta.private)
                test.eq(#public.meta.includes, c[1] == "work_admin" and 3 or 2)
                for _, id in ipairs(public.meta.includes) do
                    test.is_true(assert(registry.get(id)).meta.private == true, id)
                end
            end
        end)

        test.it("defaults the scope to platform Members and binds every host resource without defaults", function()
            local scope = assert(registry.get("kickside.work.security:user_security_scope"))
            test.eq(scope.meta.value_kind, "security.scope")
            test.eq(scope.data.default, "kickside.security.groups:members")
            local targets = {}
            for _, t in ipairs(scope.data.targets) do targets[t.entry] = t.path end
            for _, id in ipairs({ "module_access", "module_runtime", "member_endpoints" }) do
                test.eq(targets["kickside.work.security:" .. id], ".groups +=", id)
            end
            local expected = { ["kickside.work:api_router"] = "http.router", ["kickside.work:target_db"] = "db.sql" }
            for id, kind in pairs(expected) do
                local requirement = assert(registry.get(id))
                test.eq(requirement.meta.value_kind, kind, id)
                test.is_nil(requirement.data.default, id)
            end
        end)

        test.it("declares the board retention, projection and cleanup", function()
            local binding = assert(registry.get("kickside.work.binding:board"))
            test.eq(binding.meta.retention.event_days, 17)
            test.eq(binding.meta.thread_class, "work.board")
            test.eq(binding.meta.projections[1].kind, "kickside.work:board_model")
            test.eq(binding.meta.projections[1].input_mode, "prefetch_events")
            local deletable, component_contract = false, false
            for _, c in ipairs(binding.data.contracts) do
                if c.contract == "kickside.contract:deletable" then deletable = true end
                if c.contract == "kickside.contract:component" then component_contract = true end
            end
            test.is_true(deletable)
            test.is_true(component_contract)
        end)

        test.it("refuses unauthenticated HTTP calls on every endpoint", function()
            local base = "http://127.0.0.1:19239/api/work/boards"
            local cases = { { "GET", base }, { "POST", base } }
            local endpoints = assert(registry.find({ [".kind"] = "http.endpoint" }))
            for _, endpoint in ipairs(endpoints) do
                if tostring(endpoint.id):match("^kickside%.work%.api:") then
                    local path = endpoint.data.path:gsub("{id}", "00000000-0000-0000-0000-000000000000")
                    if path ~= "/work/boards" then cases[#cases + 1] = { endpoint.data.method, "http://127.0.0.1:19239/api" .. path } end
                end
            end
            for _, c in ipairs(cases) do
                local res, err = http_client.request(c[1], c[2], { body = "{}", headers = { ["Content-Type"] = "application/json" } })
                test.is_nil(err, c[2])
                test.eq(res.status_code, 401, c[1] .. " " .. c[2])
            end
        end)
    end)
end

return { run = test.run_cases(define) }
