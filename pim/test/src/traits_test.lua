-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Agent tools: each is one catalog contract method run as the agent, with the
-- catalog from the call or the trait context, and the contract's access.
local test = require("test")
local fixture = require("fixture")
local registry = require("registry")
local json = require("json")
local conformance = require("conformance")

type Map = { [string]: unknown }

local function tool(h: fixture.Handle, name: string, args: Map): (Map?, error?)
    local out, err = h.executor:call("kickside.pim.traits:" .. name, args)
    if err then return nil, err end
    return out :: Map, nil
end

local function define()
    test.describe("agent tools", function()
        test.it("uses context addressing, gives call ids precedence and preserves contract refusals", function()
            local h = fixture.catalog()
            local other = fixture.catalog()
            assert(other.call("apply_schema", { declaration = { vocabularies = { { code = "other_terms" } } } }))
            assert(other.call("grant", { subject_id = h.actor:id(), mask = 1 }))
            local executor = h.executor:with_context({ catalog_id = h.id })
            local own, err = executor:call("kickside.pim.traits:get_schema", {})
            test.is_nil(err, tostring(err))
            test.eq(own.generation, 1)
            local addressed, aerr = executor:call("kickside.pim.traits:get_schema", { catalog_id = other.id })
            test.is_nil(aerr, tostring(aerr))
            test.eq(addressed.generation, 2)
            local outsider = fixture.catalog()
            for _, case in ipairs({
                { actor = outsider, method = "get_schema", request = {} },
                { actor = other, method = "apply", request = { items = { { term = { vocabulary = "colors", code = "new" } } } }, mask = 1 },
                { actor = other, method = "apply_schema", request = { declaration = {} }, mask = 3 },
            }) do
                if case.mask then assert(h.call("grant", { subject_id = case.actor.actor:id(), mask = case.mask })) end
                local request: Map = { catalog_id = h.id }
                for key, value in pairs(case.request) do request[key] = value end
                local _, expected = case.actor.executor:call("app:pim_call", { op = case.method, catalog_id = h.id, request = case.request })
                local _, actual = case.actor.executor:call("kickside.pim.traits:" .. case.method, request)
                test.not_nil(expected, case.method)
                test.eq(actual:kind(), errors.PERMISSION_DENIED, case.method)
                test.eq(actual:kind(), expected:kind(), case.method)
                test.not_nil(expected:details().code, case.method)
                test.eq(actual:details().code, expected:details().code, case.method)
            end
        end)
        test.it("calls the complete tool surface and observes each contract answer or effect", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local function call(name: string, request: Map): Map
                request.catalog_id = h.id
                local out, err = tool(h, name, request)
                assert(not err, name .. ": " .. tostring(err))
                test.is_true(out.success)
                return out
            end
            local created = assert(tool(h, "create_catalog", { idempotency_key = "tool-create", title = "Agent catalog" }))
            test.not_nil(created.catalog_id)
            test.is_true(#assert(tool(h, "list_catalogs", {})).catalogs >= 2, "created catalog appears in listing")
            test.eq(call("get_schema", {}).generation, 1)
            test.is_true(#call("schema_options", {}).types > 0, "schema types are listed")
            test.eq(#call("list_terms", { vocabulary = "colors" }).terms, 4)
            test.is_true(#call("query", {}).items > 0, "products are queried")
            test.eq(call("get", { product = { sku = "RDG-moss-40" } }).product.sku, "RDG-moss-40")
            test.not_nil(call("explain", { product = { sku = "RDG-moss-40" }, attr = "core.gtin" }).resolution)
            local planned = call("plan_schema", { declaration = { vocabularies = { { code = "agent_terms" } } } })
            test.not_nil(planned.class)
            call("apply_schema", { declaration = { vocabularies = { { code = "agent_terms" } } } })
            test.eq(assert(h.call("get_schema", {})).generation, 2)
            call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", set = { { attr = "core.gtin", value = "tool-product" } } } } })
            test.eq(assert(h.call("get", { product = { sku = "RDG-moss-40" } })).values["core.gtin"].value, "tool-product")
            local proposal = call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Proposed care" } } } } })
            test.eq(call("list_proposals", {}).proposals[1].proposal_id, proposal.proposal_id)
            call("decide", { proposal_id = proposal.proposal_id, decision = "reject" })
            test.eq(assert(h.call("list_proposals", { status = "rejected" })).proposals[1].status, "rejected")
            local product = assert(h.call("get", { product = { sku = "RDG-moss-40" } })).product
            local release = call("release", { items = { { product = { id = product.product_id }, expect_version = product.version, channels = { "web" } } } }).outcomes[1]
            test.eq(release.outcome, "released")
            test.eq(call("get_release", { release_id = release.release_id }).release.release_id, release.release_id)
            test.eq(call("list_releases", { product = { id = product.product_id } }).releases[1].release_id, release.release_id)
            test.eq(call("list_publications", { channel = "web" }).items[1].product_id, product.product_id)
            test.is_true(#call("list_changes", {}).items > 0, "changes are listed")
            test.is_true(#call("list_history", {}).entries > 0, "history is listed")
            local linked = call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.related", value = { { ref = { "product", product.product_id } } } } } } } })
            test.eq(linked.outcomes[1].outcome, "updated")
            test.is_true(#call("list_links", { kind = "product", target = product.product_id }).items > 0, "references are listed")
            call("withdraw", { items = { { product = { id = product.product_id }, channels = { "web" } } } })
            test.eq(assert(h.call("get", { product = { id = product.product_id } })).publications[1].state, "withdrawn")
        end)
        test.it("refuses plugin declarations whose tool does not exist or has the wrong type", function()
            local h = fixture.catalog()
            for _, id in ipairs({ "app:unknown_tool_plugin", "app:wrong_tool_plugin" }) do
                local _, err = h.call("apply_schema", { declaration = { plugins = { { use = id } } } })
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "plugin_tool_invalid")
                test.is_false(err:retryable())
            end
        end)
        test.it("compiles working and administration tools once each", function()
            local h = fixture.catalog()
            local compiled, err = h.executor:call("app:compile_agent", { id = "app:catalog_agent", traits = {
                { id = "kickside.pim.traits:pim_trait", context = { catalog_id = h.id } },
                { id = "kickside.pim.traits:pim_admin", context = { catalog_id = h.id } },
            } })
            test.is_nil(err, tostring(err))
            local seen: Map = {}
            local n = 0
            for _, tool in pairs(compiled.tools) do
                test.is_nil(seen[tool.registry_id])
                seen[tool.registry_id] = true
                n = n + 1
            end
            test.eq(n, 22)
        end)
        test.it("covers contracts with matching schemas and exact tool policies", function()
            conformance.check()
        end)
        test.it("separates read, working and administration roles", function()
            local reads = assert(registry.get("kickside.pim.traits:pim_readonly"))
            local working = assert(registry.get("kickside.pim.traits:pim_trait"))
            local admin = assert(registry.get("kickside.pim.traits:pim_admin"))
            test.eq(#reads.data.tools, 14)
            test.eq(#working.data.tools, 19)
            test.eq(#admin.data.tools, 6)
            test.eq(reads.data.build_func_id, "kickside.pim.traits:build_reads")
            test.eq(working.data.build_func_id, "kickside.pim.traits:build")
            test.is_nil(admin.data.build_func_id)
            local reads_set: Map = {}
            for _, method in ipairs({ "list_catalogs", "get_schema", "schema_options", "list_terms", "query", "get", "explain", "list_history", "list_links", "list_proposals", "list_releases", "get_release", "list_publications", "list_changes" }) do
                reads_set["kickside.pim.traits:" .. method] = true
            end
            local working_set: Map = {}
            for id in pairs(reads_set) do working_set[id] = true end
            for _, method in ipairs({ "apply", "propose", "decide", "release", "withdraw" }) do working_set["kickside.pim.traits:" .. method] = true end
            local admin_set: Map = {}
            for _, method in ipairs({ "create_catalog", "plan_schema", "apply_schema", "list_catalogs", "get_schema", "schema_options" }) do admin_set["kickside.pim.traits:" .. method] = true end
            for _, role in ipairs({ { entry = reads, expected = reads_set }, { entry = working, expected = working_set }, { entry = admin, expected = admin_set } }) do
                local actual: Map = {}
                for _, id in ipairs(role.entry.data.tools) do
                    test.is_nil(actual[id], id)
                    actual[id] = true
                    test.eq(assert(registry.get(id)).meta.mcp.required_scopes[1], (reads_set[id] or id == "kickside.pim.traits:plan_schema") and "state.read" or "state.write")
                end
                conformance.equal(actual, role.expected, "role tools")
            end
        end)
        test.it("declares a public trait whose tools exist", function()
            local entry = assert(registry.get("kickside.pim.traits:pim_trait"))
            local meta = entry.meta :: Map
            test.eq(meta.type, "agent.trait")
            test.is_true(meta.public == true)
            local tools = (entry.data :: Map).tools :: { string }
            test.is_true(#tools >= 12)
            for _, id in ipairs(tools) do
                local t = assert(registry.get(id), id)
                test.eq((t.meta :: Map).type, "tool", id)
            end
        end)

        test.it("lists and creates with catalog context and declares unaddressed inputs", function()
            local h = fixture.catalog()
            local executor = h.executor:with_context({ catalog_id = h.id })
            local listed, lerr = executor:call("kickside.pim.traits:list_catalogs", {})
            test.is_nil(lerr, tostring(lerr))
            test.is_true(listed.success)
            local created, cerr = executor:call("kickside.pim.traits:create_catalog", { idempotency_key = "context", title = "Context catalog" })
            test.is_nil(cerr, tostring(cerr))
            test.not_nil(created.catalog_id)
            for _, name in ipairs({ "list_catalogs", "create_catalog" }) do
                local entry = assert(registry.get("kickside.pim.traits:" .. name))
                local shape = assert(json.decode(entry.meta.input_schema))
                test.is_nil(shape.properties.catalog_id)
            end
        end)

        test.it("reads and writes a catalog through the contract as the agent", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local listed = assert(tool(h, "list_catalogs", {}))
            test.is_true(listed.success == true)
            test.is_true(#(listed.catalogs :: { Map }) >= 1)
            local schema = assert(tool(h, "get_schema", { catalog_id = h.id }))
            test.not_nil((schema.attributes :: Map)["core.name"])
            local terms = assert(tool(h, "list_terms", { catalog_id = h.id, vocabulary = "colors" }))
            test.eq(#(terms.terms :: { Map }), 4)
            local found = assert(tool(h, "query", { catalog_id = h.id, text = "Ridgeline", limit = 10 }))
            test.is_true(#(found.items :: { Map }) >= 1)
            local got = assert(tool(h, "get", { catalog_id = h.id, product = { sku = "RDG-moss-40" } }))
            test.eq(((got.product :: Map).sku), "RDG-moss-40")
            local applied = assert(tool(h, "apply", { catalog_id = h.id, items = { { product = { sku = "RDG-moss-40" }, expect_version = "any",
                set = { { attr = "core.gtin", value = "agent-1" } } } } }))
            test.eq(((applied.outcomes :: { Map })[1] :: Map).outcome, "updated")
            local _, bad = tool(h, "get", { catalog_id = h.id, product = { sku = "nope" } })
            test.eq((bad :: error):kind(), errors.NOT_FOUND)
        end)

        test.it("answers the contract's refusals as typed errors and resolves a sole readable catalog without an id", function()
            local h = fixture.catalog()
            local _, missing = tool(h, "apply", { catalog_id = h.id, items = {} })
            test.eq((missing :: error):kind(), errors.INVALID)
            local _, unknown = tool(h, "apply_schema", { catalog_id = h.id, declaration = { plugins = { { use = "app:nope" } } } })
            test.eq((unknown :: error):kind(), errors.INVALID)
            local other = fixture.catalog()
            local both = assert(tool(h, "list_catalogs", {}))
            test.is_true(#(both.catalogs :: { Map }) >= 1)
            local _, ambiguous = tool(other, "get_schema", {})
            test.is_nil(ambiguous)
        end)
    end)
end

return { run = test.run_cases(define) }
