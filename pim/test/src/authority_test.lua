-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local funcs = require("funcs")
local store = require("store")
local security = require("security")
local registry = require("registry")
local values = require("values")
local M = {}
local callbacks = {
    "kickside.pim.persist:projection", "kickside.pim.persist:projection_committed",
    "kickside.pim.extensions:plugin_batch","kickside.pim.jobs:import","kickside.pim.jobs:import_batch",
    "kickside.pim.jobs:rebuild",
    "kickside.pim.jobs:term_merge", "kickside.pim.jobs:release_model",
    "kickside.pim.retention:owner", "kickside.pim.binding:delete_func", "kickside.pim.migrations:01_catalog", "kickside.pim.jobs:rebuild_batch", "kickside.pim.jobs:term_merge_batch", "kickside.pim.jobs:release_model_batch",
}
local function call(member: scoped.Session, scope: security.Scope, id: string, input: unknown, action: string?): (unknown, error?)
    local caller = assert(security.policy("app:caller_only"))
    return funcs.new():with_actor(member.actor):with_scope(scope:with(caller)):call("app:direct_call", { id = id, input = input, action = action })
end
local function define()
    test.describe("platform callback authority", function()
        test.it("grants catalog metadata authority through an exact platform entry", function()
            local entry = assert(registry.get("kickside.pim.security:catalog_public_meta"))
            test.is_true(entry.meta.service_only)
            test.eq(entry.data.policy.actions, "component.runtime_meta.write")
            test.eq(#entry.data.policy.conditions, 1)
            local condition = entry.data.policy.conditions[1]
            test.eq(condition.field, "meta.impl_id")
            test.eq(condition.operator, "eq")
            test.eq(condition.value, "kickside.pim.binding:catalog")
        end)
        for _, id in ipairs(callbacks) do
            test.it("reserves " .. id .. " for platform dispatch", function()
                local member = scoped.member()
                test.is_true(member.scope:evaluate(member.actor, "funcs.call", id) ~= "allow")
                local _, err = call(member, member.scope, id, {})
                test.not_nil(err)
                test.eq(err:kind(), errors.PERMISSION_DENIED)
            end)
        end
        for _, helper in ipairs({
            { id = "kickside.pim.persist:publish_meta", input_key = "thread_id" },
            { id = "kickside.pim.extensions:plugin_projections", input_key = "catalog_id" },
        }) do
            test.it("refuses " .. helper.id .. " without catalog access and preserves stored state", function()
                local owner, stranger = scoped.member(), scoped.member()
                local h = scoped.catalog(owner)
                assert(call(owner, owner.scope, "kickside.pim.persist:publish_meta", { thread_id = h.id }))
                local db = assert(store.open())
                local before = assert(store.catalog(db, h.id))
                db:release()
                local meta = assert(h.call("component_meta", {}))
                local projections = assert(h.call("plugin_projections", {}))
                local out, err = call(stranger, stranger.scope, helper.id, { [helper.input_key] = h.id })
                test.is_nil(out)
                test.not_nil(err)
                test.eq(err:kind(), errors.PERMISSION_DENIED)
                db = assert(store.open())
                test.eq(values.canonical(assert(store.catalog(db, h.id))), values.canonical(before))
                db:release()
                test.eq(values.canonical(assert(h.call("component_meta", {}))), values.canonical(meta))
                test.eq(values.canonical(assert(h.call("plugin_projections", {}))), values.canonical(projections))
            end)
            test.it("converges " .. helper.id .. " only to the stored catalog state", function()
                local member = scoped.member()
                local h = scoped.catalog(member)
                assert(h.call("apply", { items = { { product = { sku = "COUNTS" }, create = { family = "footwear" } } } }))
                assert(h.call("settle", {}))
                assert(call(member, member.scope, "kickside.pim.persist:publish_meta", { thread_id = h.id }))
                local db = assert(store.open())
                local before = assert(store.catalog(db, h.id))
                db:release()
                local meta = assert(h.call("component_meta", {}))
                test.eq(tonumber(meta.product_count), before.product_count)
                test.eq(tonumber(meta.item_count), before.item_count)
                test.eq(tonumber(meta.generation), before.generation)
                local projections = assert(h.call("plugin_projections", {}))
                for _, projection in ipairs(projections.projections) do
                    test.is_true(projection.projection_key:sub(1, #"kickside.pim.plugin:") ~= "kickside.pim.plugin:")
                end
                test.eq(next(before.compiled.plugins), nil)
                local out, err = call(member, member.scope, helper.id, { [helper.input_key] = h.id,
                    product_count = 999, plugins = { fabricated = { enabled = true } } })
                test.is_nil(err, tostring(err))
                test.not_nil(out)
                db = assert(store.open())
                test.eq(values.canonical(assert(store.catalog(db, h.id))), values.canonical(before))
                db:release()
                local after = assert(h.call("component_meta", {}))
                test.eq(tonumber(after.product_count), before.product_count)
                test.eq(tonumber(after.item_count), before.item_count)
                test.eq(tonumber(after.generation), before.generation)
                test.eq(values.canonical(after), values.canonical(meta))
                test.eq(values.canonical(assert(h.call("plugin_projections", {}))), values.canonical(projections))
            end)
        end
        test.it("requires tool access to discover traits and invoke their builders", function()
            local member = scoped.member()
            local enabled = member.scope:with(assert(security.policy("kickside.pim.security:tool_access")))
            for _, id in ipairs({ "kickside.pim.traits:pim_readonly", "kickside.pim.traits:pim_trait", "kickside.pim.traits:pim_admin", "kickside.pim.traits:build", "kickside.pim.traits:build_reads" }) do
                for _, action in ipairs({ "registry.get", "registry.find", "funcs.call" }) do
                    test.is_true(member.scope:evaluate(member.actor, action, id) ~= "allow", id .. " " .. action)
                    test.eq(enabled:evaluate(member.actor, action, id), "allow")
                end
                local hidden, denied = call(member, member.scope, id, {}, "registry.get")
                test.is_nil(hidden)
                test.eq(denied:kind(), errors.PERMISSION_DENIED)
                local entry, err = call(member, enabled, id, {}, "registry.get")
                test.is_nil(err, tostring(err))
                test.eq(tostring(entry.id), id)
            end
            local hidden, denied = call(member, member.scope, "", {}, "registry.find")
            test.is_nil(denied, tostring(denied))
            for _, entry in ipairs(hidden) do
                test.is_nil(tostring(entry.id):match("^kickside%.pim%.traits:"))
            end
            local visible, err = call(member, enabled, "", {}, "registry.find")
            test.is_nil(err, tostring(err))
            local count = 0
            for _, entry in ipairs(visible) do
                if tostring(entry.id):match("^kickside%.pim%.traits:") then count = count + 1 end
            end
            test.eq(count, 3)
        end)
        test.it("grants tools independently of member contract access", function()
            local member = scoped.member()
            for _, action in ipairs({ "registry.get", "registry.find", "funcs.call" }) do
                test.is_true(member.scope:evaluate(member.actor, action, "kickside.pim.traits:get_schema") ~= "allow")
            end
            local h = scoped.catalog(member)
            local view, verr = h.call("get_schema", {})
            test.is_nil(verr, tostring(verr))
            test.eq(view.generation, 1)
            local out, err = call(member, member.scope, "kickside.pim.traits:get_schema", { catalog_id = h.id })
            test.is_nil(out)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            local enabled = member.scope:with(assert(security.policy("kickside.pim.security:tool_access")))
            for _, action in ipairs({ "registry.get", "registry.find", "funcs.call" }) do
                test.eq(enabled:evaluate(member.actor, action, "kickside.pim.traits:get_schema"), "allow")
            end
            local allowed, aerr = call(member, enabled, "kickside.pim.traits:get_schema", { catalog_id = h.id })
            test.is_nil(aerr, tostring(aerr))
            test.eq(allowed.generation, 1)
        end)
        test.it("refuses a fabricated projection before changing the catalog position", function()
            local victim = fixture.catalog()
            local member = scoped.member()
            local db = assert(store.open())
            local before = assert(store.catalog(db, victim.id)).applied_seq
            db:release()
            local _, err = call(member, member.scope, "kickside.pim.persist:projection",
                { thread_id = victim.id, range = { to_seq = before + 1000000 }, events = {} })
            db = assert(store.open())
            local after = assert(store.catalog(db, victim.id)).applied_seq
            db:release()
            test.eq(after, before)
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
        end)
    end)
end
M.run = test.run_cases(define)
return M
