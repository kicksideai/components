-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local security = require("security")
local http_client = require("http_client")

local ENDPOINTS = {
    ["kickside.pim.api:configure_plugin.endpoint"] = true,
    ["kickside.pim.api:list.endpoint"] = true,
    ["kickside.pim.api:get_catalog.endpoint"] = true,
    ["kickside.pim.api:create.endpoint"] = true,
    ["kickside.pim.api:get_schema.endpoint"] = true,
    ["kickside.pim.api:plan_schema.endpoint"] = true,
    ["kickside.pim.api:apply_schema.endpoint"] = true,
    ["kickside.pim.api:get.endpoint"] = true,
    ["kickside.pim.api:query.endpoint"] = true,
    ["kickside.pim.api:list_history.endpoint"] = true,
    ["kickside.pim.api:apply.endpoint"] = true,
    ["kickside.pim.api:propose.endpoint"] = true,
    ["kickside.pim.api:decide.endpoint"] = true,
    ["kickside.pim.api:list_proposals.endpoint"] = true,
    ["kickside.pim.api:release.endpoint"] = true,
    ["kickside.pim.api:withdraw.endpoint"] = true,
    ["kickside.pim.api:rebuild.endpoint"] = true,
    ["kickside.pim.api:list_links.endpoint"] = true,
    ["kickside.pim.api:explain.endpoint"] = true,
    ["kickside.pim.api:list_changes.endpoint"] = true,
    ["kickside.pim.api:list_publications.endpoint"] = true,
    ["kickside.pim.api:get_release.endpoint"] = true,
    ["kickside.pim.api:list_releases.endpoint"] = true,
    ["kickside.pim.api:list_terms.endpoint"] = true,
    ["kickside.pim.api:schema_options.endpoint"] = true,
}

local function define()
    test.describe("module access", function()
        test.it("admits exactly the listed endpoint identities", function()
            local policy_id = "kickside.pim.security:pim_endpoint_access"
            local declaration = assert(registry.get(policy_id))
            local listed = {}
            for _, id in ipairs(declaration.data.policy.resources) do
                listed[id] = true
                local entry = assert(registry.get(id))
                test.is_true(entry.kind == "http.endpoint" or ENDPOINTS[id] == nil, id)
            end
            for id in pairs(ENDPOINTS) do test.is_true(listed[id] == true, id) end
            local policy = assert(security.policy(policy_id))
            local actor = security.new_actor("pim-member", {})
            local endpoints = assert(registry.find({ [".kind"] = "http.endpoint" }))
            for _, entry in ipairs(endpoints) do
                local id = tostring(entry.id)
                if id:find("^kickside%.pim") then test.eq(policy:evaluate(actor, "access", id), ENDPOINTS[id] and "allow" or "undefined", id) end
            end
            test.eq(policy:evaluate(actor, "access", "kickside.pim.api:call.endpoint.unlisted"), "undefined")
        end)

        test.it("defaults the scope to platform Members and binds every host resource without defaults", function()
            local scope = assert(registry.get("kickside.pim.security:user_security_scope"))
            test.eq(scope.meta.value_kind, "security.scope")
            test.eq(scope.data.default, "kickside.security.groups:members")
            local expected = { ["kickside.pim:api_router"] = "http.router", ["kickside.pim:target_db"] = "db.sql" }
            for id, kind in pairs(expected) do
                local requirement = assert(registry.get(id))
                test.eq(requirement.meta.value_kind, kind, id)
                test.is_nil(requirement.data.default, id)
            end
        end)

        test.it("binds retention database access to the exact configured database", function()
            local policy = assert(security.policy("kickside.pim.security:retention_db_access"))
            local actor = security.new_actor("retention-probe", {})
            test.eq(policy:evaluate(actor, "db.get", "app:db"), "allow")
            test.eq(policy:evaluate(actor, "db.get", "app:other_database"), "undefined")
        end)

        test.it("reserves every catalog event for the producer that appends it", function()
            local binding = assert(registry.get("kickside.pim.binding:catalog"))
            local holders: { [string]: integer } = {}
            local members = assert(security.named_scope("kickside.security.groups:members"))
            for _, name in ipairs({ "schema", "item", "release", "withdraw", "purge" }) do
                local id = "kickside.pim.security:" .. name .. "_output_publish"
                local entry = assert(registry.get(id))
                test.is_true(entry.meta.private == true, name)
                test.is_true(entry.meta.service_only == true, name)
                test.is_nil(entry.data.groups, name)
                test.is_false(members:contains(id), name)
                test.eq(entry.data.policy.actions, "threads.output.publish", name)
                local resources = entry.data.policy.resources
                if type(resources) == "string" then resources = { resources } end
                for _, event in ipairs(resources) do holders[event] = (holders[event] or 0) + 1 end
            end
            local declared = binding.meta.events.output
            test.eq(#declared, 13)
            test.eq(#binding.meta.events.input, 0)
            local member = security.new_actor("pim-member", {})
            for _, shape in ipairs(declared) do
                test.is_true(shape.system_only == true, shape.type)
                test.eq(holders[shape.type], 1, shape.type)
                test.is_false(members:evaluate(member, "threads.output.publish", shape.type) == "allow", shape.type)
            end
        end)

        test.it("refuses unauthenticated HTTP calls on every endpoint", function()
            local base = "http://127.0.0.1" .. assert(registry.get("app:gateway")).data.addr .. "/api/pim/catalogs"
            local cases = { { "GET", base }, { "POST", base }, { "POST", base .. "/00000000-0000-0000-0000-000000000000/query" } }
            for _, c in ipairs(cases) do
                local res, err = http_client.request(c[1], c[2], { body = "{}", headers = { ["Content-Type"] = "application/json" } })
                test.is_nil(err, c[2])
                test.eq(res.status_code, 401, c[1] .. " " .. c[2])
            end
        end)
    end)
end

return { run = test.run_cases(define) }
