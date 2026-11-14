-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local security = require("security")
local funcs = require("funcs")
local uuid = require("uuid")
local clock = require("clock")
local scoped = require("scoped")
local steps = require("steps")
local component = require("component")

local function define()
    test.describe("module declarations", function()
        test.it("preserves process refusal kinds so temporary failures remain resumable", function()
            local kinds = { unavailable = errors.UNAVAILABLE, conflict = errors.CONFLICT, denied = errors.PERMISSION_DENIED, invalid = errors.INVALID }
            for status, kind in pairs(kinds) do
                local result, err = funcs.call("app:process_deadline_batch", { board_id = status, item = "item", deadline = clock.deadline(1000).at })
                test.is_nil(result)
                test.not_nil(err)
                test.eq(err:kind(), kind, status)
                test.eq(err:details().code, "dependency_offline")
            end
        end)
        test.it("ends each worker batch at the enclosing job deadline", function()
            local session = scoped.admin()
            local h = scoped.board(session)
            for _, name in ipairs({ "migrate", "rebalance", "recompute", "reindex", "process", "advance", "operation" }) do
                local result, err = funcs.new():with_actor(session.actor):with_scope(session.scope):call("kickside.work.jobs:" .. name .. "_batch",
                    { board_id = h.id, deadline = "2000-01-01T00:00:00Z" })
                test.is_nil(result, name)
                test.not_nil(err, name)
                test.eq(err:kind(), errors.TIMEOUT, steps.detail(err))
                test.eq(err:details().code, "job_deadline", name)
            end
        end)

        test.it("passes a future process deadline into the command", function()
            local deadline = clock.deadline(1000)
            local result, err = funcs.call("app:process_deadline_batch", { board_id = "deadline", item = "item", deadline = deadline.at })
            test.is_nil(result)
            test.not_nil(err)
            test.eq(err:kind(), errors.TIMEOUT)
            test.eq(err:details().code, "deadline_probe")
            test.eq(err:details().deadline, deadline.at)
            test.eq(err:details().deadline_ns, tostring(deadline.ns))
        end)

        test.it("reads committed snapshots without projection dispatch authority", function()
            local h = scoped.board(scoped.admin())
            local id = steps.create(h, "task", { title = "Committed" })
            local member = scoped.member()
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local page = assert(member.call("query", {}, h.id))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, id)
            test.eq(page.items[1].values.title, "Committed")
        end)

        test.it("returns native errors from failed worker identity reads", function()
            for _, name in ipairs({ "migrate", "rebalance", "recompute", "reindex", "process", "advance" }) do
                local board_id = uuid.v4()
                local _, source_err = component.get_private_context(board_id)
                local result, err = funcs.call("kickside.work.jobs:" .. name, {
                    job = { id = (uuid.v4()), lease_token = "missing", execution_seq = 1 },
                    payload = { board_id = board_id },
                })
                test.is_nil(result, name)
                test.not_nil(err, name)
                test.eq(err:kind(), errors.NOT_FOUND, name)
                test.eq(err:retryable(), source_err:retryable(), name)
            end
        end)

        test.it("uses the bootloader startup barrier before cases execute", function()
            local service = assert(registry.get("wippy.bootloader:bootloader.service"))
            test.eq(service.data.lifecycle.startup, "complete")
            local waiters = assert(registry.find({ [".id"] = "app:wait_for_boot", ["meta.type"] = "test" }))
            test.eq(#waiters, 0)
        end)

        test.it("publishes verb methods with one handler source and exact router target per endpoint", function()
            local expected = { "list_packs", "pack_plan", "pack_apply", "create", "update", "list", "get_schema", "plan_schema", "apply_schema", "resume_migration",
                "apply", "approve", "report", "get", "query", "count", "list_changes", "list_history", "get_time_in_state", "list_links", "list_comments", "list_stage_runs", "explain", "configure_plugin", "bulk", "bulk_status", "cancel_bulk", "plan_move", "move", "move_status" }
            local definition = assert(registry.get("kickside.work:board"))
            local methods = {}
            for _, method in ipairs(definition.data.methods) do methods[method.name] = true end
            local router = assert(registry.get("kickside.work:api_router"))
            local targets = {}
            for _, target in ipairs(router.data.targets) do targets[target.entry] = target.path end
            local sources = {}
            for _, method in ipairs(expected) do
                test.is_true(methods[method] == true, method)
                local id = "kickside.work.api:" .. method
                local handler = assert(registry.get(id))
                local endpoint = assert(registry.get(id .. ".endpoint"))
                test.eq(handler.kind, "function.lua", id)
                test.eq(handler.data.method, "handler", id)
                test.is_nil(sources[handler.data.source], id)
                sources[handler.data.source] = true
                test.eq(endpoint.kind, "http.endpoint", id)
                test.eq(endpoint.data.func, method, id)
                test.eq(targets[id .. ".endpoint"], ".meta.router", id)
            end
            for _, method in ipairs({ "plugin_context", "plugin_feed", "schema_options" }) do
                test.is_true(methods[method] == true, method)
                test.eq(#assert(registry.find({ [".id"] = "kickside.work.traits:" .. method })), 0, "host admission adds no tool")
            end
            test.eq(#definition.data.methods, #expected + 3)
            test.eq(assert(registry.get("kickside.work:types")).kind, "library.lua")
            test.eq(assert(registry.get("kickside.work.api:access")).kind, "library.lua")
        end)

        test.it("grants deferred identity resolution to each exact worker", function()
            local actor = security.new_actor("worker-probe", {})
            for _, name in ipairs({ "migrate", "rebalance", "recompute", "reindex", "process", "advance" }) do
                local id = "kickside.work.jobs:" .. name
                local worker = assert(registry.get(id))
                local allowed = false
                for _, policy_id in ipairs(worker.data.security and worker.data.security.policies or {}) do
                    local policy = assert(security.policy(policy_id))
                    if policy:evaluate(actor, "kickside.execution.defer", id) == "allow" then allowed = true end
                    test.eq(policy:evaluate(actor, "kickside.execution.defer", id .. "_batch"), "undefined", id)
                end
                test.is_true(allowed, id)
            end
        end)

        test.it("keeps product configuration in component declarations", function()
            local requirements = assert(registry.find({ [".kind"] = "ns.requirement" }))
            local expected = { ["kickside.work:target_db"] = true, ["kickside.work:api_router"] = true,
                ["kickside.work:registry_admin_grant"] = true, ["kickside.work:board_event_retention_days"] = true, ["kickside.work.security:user_security_scope"] = true }
            for _, entry in ipairs(requirements) do
                if tostring(entry.id):match("^kickside%.work[.:]") then
                    test.is_true(expected[tostring(entry.id)] == true, tostring(entry.id))
                end
            end
            local binding = assert(registry.get("kickside.work.binding:board"))
            test.is_nil(binding.meta.component)
            test.eq(binding.meta.retention.event_days, 17)
            local requirement = assert(registry.get("kickside.work:board_event_retention_days"))
            test.eq(requirement.data.default, 90)
            test.eq(assert(registry.get("kickside.work:registry_admin_grant")).meta.value_kind, "object")
            test.eq(assert(registry.get("kickside.work.binding:delete_func")).data.method, "handle")
        end)
    end)
end
return { run = test.run_cases(define) }
