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

local function metadata(name: string): Map
    return assert(registry.get("kickside.pim.traits:" .. name)).meta :: Map
end

local function define()
    test.describe("agent tools", function()
        test.it("advertises the fixed batch and column ceilings enforced by the catalog", function()
            local h = fixture.catalog()
            for _, case in ipairs({
                { method = "apply", property = "items", value = {}, max = 500 },
                { method = "propose", property = "items", value = { product = { sku = "example" } }, max = 500 },
                { method = "release", property = "items", value = { product = { sku = "example" } }, max = 100 },
                { method = "withdraw", property = "items", value = { product = { sku = "example" } }, max = 100 },
                { method = "query", property = "columns", value = "core.size", max = 12 },
            }) do
                local entries = {}
                for i = 1, case.max do entries[i] = case.value end
                local request = { [case.property] = entries }
                local schema = assert(json.decode(metadata(case.method).input_schema :: string))
                test.is_true(json.validate(schema, request), case.method .. " ceiling")
                entries[#entries + 1] = case.value
                local _, err = h.call(case.method, request)
                test.not_nil(err, case.method)
                test.eq((err :: error):kind(), errors.INVALID, case.method)
                test.is_false(json.validate(schema, request), case.method .. " overflow")
            end
        end)
        test.it("requires both receipt key parts to be nonempty", function()
            local schema = assert(json.decode(metadata("apply").input_schema :: string))
            for _, key in ipairs({ { namespace = "", key = "key" }, { namespace = "scope", key = "" } }) do
                test.is_false(json.validate(schema, { items = { {} }, idempotency = key }))
            end
            test.is_true(json.validate(schema, { items = { {} }, idempotency = { namespace = "scope", key = "key" } }))
        end)
        test.it("advertises feed limits and immutable release snapshots", function()
            for _, name in ipairs({ "list_changes", "list_publications" }) do
                local schema = assert(json.decode(metadata(name).input_schema :: string))
                test.eq(schema.properties.limit.default, 500, name)
                test.is_true(json.validate(schema.properties.limit, 500), name)
                test.is_false(json.validate(schema.properties.limit, 501), name)
            end
            test.is_true((metadata("list_releases").llm_description :: string):find("snapshots", 1, true) ~= nil)
        end)
        test.it("describes individual refusals even when an independent call succeeds", function()
            local h = fixture.catalog()
            local result = assert(tool(h, "apply", { catalog_id = h.id, mode = "independent", items = {
                { product = { sku = "missing" }, expect_version = "any" },
            } }))
            test.is_true(result.success == true)
            test.is_true(result.applied == true)
            test.eq(result.outcomes[1].outcome, "invalid")
            test.eq(result.outcomes[1].findings[1].code, "invalid_reference")
            local meta = metadata("apply")
            local schema = assert(json.decode(meta.output_schema :: string))
            test.is_true(json.validate(schema, result))
            result.outcomes[1].outcome = "undocumented_status"
            test.is_false(json.validate(schema, result))
            test.is_true((meta.llm_description :: string):find("every outcome", 1, true) ~= nil)
            test.eq(schema.properties.outcomes.items.properties.findings.items.properties.code.type, "string")
        end)
        test.it("publishes request and job ids as fields of queued release outcomes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local model = assert(h.call("get", { product = { sku = "RDG" } })).product
            local result = assert(tool(h, "release", { catalog_id = h.id, items = {
                { product = { id = model.product_id }, expect_version = model.version, channels = { "web" } },
            } }))
            test.eq(result.outcomes[1].outcome, "queued")
            local schema = assert(json.decode(metadata("release").output_schema :: string))
            test.is_true(json.validate(schema, result))
            for _, field in ipairs({ "request_id", "job_id" }) do
                test.eq(type(result.outcomes[1][field]), "string", field)
                test.eq(schema.properties.outcomes.items.properties[field].type, "string", field)
            end
        end)
        for _, stale in ipairs({ "product", "schema" }) do
            test.it("refuses a proposal prepared against a stale " .. stale, function()
                local h = fixture.catalog()
                fixture.boot(h)
                local product = assert(tool(h, "get", { catalog_id = h.id, product = { sku = "RDG" } })).product
                local generation = assert(tool(h, "get_schema", { catalog_id = h.id })).generation
                local request = { catalog_id = h.id, expected_generation = generation,
                    idempotency = { namespace = "agent", key = "review" }, items = {
                    { product = { sku = "RDG-moss-40" }, set = { { attr = "core.gtin", value = "agent-gtin" } } },
                    { product = { id = product.product_id }, expect_version = product.version,
                        set = { { attr = "core.care", value = "Agent's edit" } } },
                } }
                if stale == "product" then
                    local edited = assert(h.call("apply", { items = { { product = { id = product.product_id },
                        expect_version = product.version, set = { { attr = "core.care", value = "Human edit" } } } } }))
                    test.eq(edited.outcomes[1].outcome, "updated")
                else
                    assert(h.call("apply_schema", { declaration = { vocabularies = { { code = "agent_review" } } } }))
                end
                local out, err = tool(h, "propose", request)
                test.is_nil(out)
                test.eq(assert(err):kind(), errors.CONFLICT)
                local details = assert(err):details()
                if stale == "product" then
                    test.eq(details.code, "version_conflict")
                    test.eq(details.product_id, product.product_id)
                    test.eq(details.expect_version, product.version)
                    test.eq(details.version, product.version + 1)
                else
                    test.eq(details.code, "schema_generation_conflict")
                    test.eq(details.expected_generation, generation)
                    test.eq(details.generation, generation + 1)
                end
                test.eq(#assert(h.call("list_proposals", {})).proposals, 0)

                request.expected_generation = assert(tool(h, "get_schema", { catalog_id = h.id })).generation
                request.items[2].expect_version = assert(tool(h, "get", { catalog_id = h.id, product = { sku = "RDG" } })).product.version
                local accepted = assert(tool(h, "propose", request))
                test.eq(accepted.status, "pending")
                test.eq(assert(tool(h, "propose", request)).proposal_id, accepted.proposal_id)
                local saved = assert(h.call("list_proposals", {})).proposals[1]
                test.eq(saved.proposal_id, accepted.proposal_id)
                test.eq(saved.generation, request.expected_generation)
                test.eq(saved.base[product.product_id], request.items[2].expect_version)
            end)
        end

        test.it("publishes optional proposal fences and an idempotency key in the tool schema", function()
            local schema = assert(json.decode(metadata("propose").input_schema :: string))
            local request = { expected_generation = 1, idempotency = { namespace = "agent", key = "enrichment" },
                items = { { product = { sku = "RDG" }, expect_version = 1, status = "draft" } } }
            local valid, err = json.validate(schema, request)
            test.is_true(valid, tostring(err))
            request.items[1].expect_version = "any"
            test.is_false(json.validate(schema, request))
        end)

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
            local ui = "app:catalog_tracker_ui"
            test.eq(call("update", { ui_app = ui }).ui_app, ui)
            test.eq(assert(tool(h, "list_catalogs", { ui_app = ui })).catalogs[1].catalog_id, h.id)
            test.is_nil(call("update", { ui_app = "" }).ui_app)
            test.eq(call("get_schema", {}).generation, 1)
            test.eq(call("policy_defaults", {}).audit_days, 365)
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
            local waited = call("wait_for_product", { product = { id = product.product_id }, predicate = { publication = { channel = "web", state = "published" } } })
            test.eq(waited.status, "matched")
            test.eq(waited.product.product_id, product.product_id)
            test.eq(call("list_releases", { product = { id = product.product_id } }).releases[1].release_id, release.release_id)
            test.eq(call("list_publications", { channel = "web" }).items[1].product_id, product.product_id)
            test.is_true(#call("list_changes", {}).items > 0, "changes are listed")
            test.is_true(#call("list_history", {}).entries > 0, "history is listed")
            local linked = call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.related", value = { { ref = { "product", product.product_id } } } } } } } })
            test.eq(linked.outcomes[1].outcome, "updated")
            test.is_true(#call("list_links", { kind = "product", target = product.product_id }).items > 0, "references are listed")
            call("withdraw", { items = { { product = { id = product.product_id }, channels = { "web" } } } })
            test.eq(assert(h.call("get", { product = { id = product.product_id } })).publications[1].state, "withdrawn")
            local model = assert(h.call("get", { product = { sku = "RDG" } })).product
            local queued = call("release", { items = { { product = { id = model.product_id }, expect_version = model.version } } }).outcomes[1]
            test.eq(queued.outcome, "queued")
            local status = call("get_model_release", { request_id = queued.request_id })
            test.eq(status.job_id, queued.job_id)
            test.eq(status.model_id, model.product_id)
        end)
        test.it("configures active plugins and resumes rebuilds as catalog ADMIN", function()
            local h = fixture.catalog()
            local executor = h.executor:with_context({ catalog_id = h.id })
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:shelf_plugin" } } },
                plugin_configs = { ["app:shelf_plugin"] = { location = "WH7" } } }))
            local before = assert(h.call("get_schema", {})).schema_generation
            local out, err = executor:call("kickside.pim.traits:configure_plugin", { plugin = "app:shelf_plugin", config = { location = "WH9" } })
            test.is_nil(err, tostring(err))
            test.is_true(out.success)
            test.eq(assert(h.call("plugin_context", { plugin = "app:shelf_plugin" })).config.location, "WH9")
            test.eq(assert(h.call("get_schema", {})).schema_generation, before)
            local rebuilt, rerr = executor:call("kickside.pim.traits:rebuild", {})
            test.is_nil(rerr, tostring(rerr))
            test.is_true(rebuilt.success)
            test.eq(type(rebuilt.rebuilding), "boolean")
            local other = fixture.catalog()
            assert(h.call("grant", { subject_id = other.actor:id(), mask = 3 }))
            for _, case in ipairs({
                { method = "configure_plugin", config = { plugin = "app:shelf_plugin", config = { location = "WH8" } } },
                { method = "rebuild", config = {} },
            }) do
                case.config.catalog_id = h.id
                local _, denied = other.executor:call("kickside.pim.traits:" .. case.method, case.config)
                test.not_nil(denied)
                test.eq(denied:kind(), errors.PERMISSION_DENIED)
            end
        end)
        test.it("publishes the same declaration grammar for creation planning and application", function()
            local previous: Map? = nil
            for _, name in ipairs({ "create_catalog", "plan_schema", "apply_schema" }) do
                local entry = assert(registry.get("kickside.pim.traits:" .. name))
                local declaration = assert(json.decode(entry.meta.input_schema)).properties.declaration
                test.not_nil(declaration.properties, name .. " declaration sections")
                for _, section in ipairs({ "dimensions", "vocabularies", "aspects", "families", "sources", "channels", "policy", "scopes", "plugins", "remove" }) do
                    test.not_nil(declaration.properties[section], section)
                end
                test.eq(declaration.properties.channels.items.required[1], "id")
                test.is_false(json.validate(declaration, { channels = { { code = "demo" } } }))
                test.is_true(json.validate(declaration, { channels = { { id = "demo" } } }))
                if previous then conformance.equal(declaration, previous, "shared declaration") end
                previous = declaration
            end
            local h = fixture.catalog()
            local _, err = h.call("plan_schema", { declaration = { channels = { { code = "demo" } } } })
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.not_nil(assert(h.call("plan_schema", { declaration = { channels = { { id = "demo" } } } })).class)
        end)
        test.it("encodes empty maps as objects in published tool answers", function()
            local h = fixture.catalog({ bare = true })
            assert(h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "name", type = "kickside.pim.types:text" },
            } } } } }))
            assert(h.call("apply", { items = { { product = { sku = "EMPTY" }, create = {} } } }))
            for _, case in ipairs({
                { name = "get_schema", request = {} },
                { name = "schema_options", request = {} },
                { name = "get", request = { product = { sku = "EMPTY" } } },
                { name = "explain", request = { product = { sku = "EMPTY" }, attr = "core.name" } },
                { name = "query", request = { columns = { "core.name" } } },
            }) do
                case.request.catalog_id = h.id
                local out = assert(tool(h, case.name, case.request))
                local entry = assert(registry.get("kickside.pim.traits:" .. case.name))
                local schema = assert(json.decode(entry.meta.output_schema))
                local encoded = assert(json.encode(out))
                local valid, err = json.validate(schema, assert(json.decode(encoded)))
                test.is_true(valid, case.name .. ": " .. tostring(err) .. " wire: " .. encoded)
            end
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
            test.is_true(seen["kickside.pim.traits:adopt_asset"])
            test.eq(n, 29)
        end)
        test.it("covers contracts with matching schemas and exact tool policies", function()
            conformance.check()
        end)
        test.it("advertises round-trippable changes continuations and requires queued release identifiers", function()
            local changes = assert(registry.get("kickside.pim.traits:list_changes"))
            local request_schema = assert(json.decode(changes.meta.input_schema))
            local result_schema = assert(json.decode(changes.meta.output_schema))
            local cursor = { seq = 7, product_id = "product", expiry_floor = 10 }
            test.is_true(json.validate(request_schema, { cursor = cursor }))
            local gap = assert(json.decode([[{"success":true,"items":[],"has_more":false,
                "next":{"seq":7,"product_id":"product","expiry_floor":10},"gap":{"floor":11}}]]))
            test.is_true(json.validate(result_schema, gap))
            test.is_false(json.validate(request_schema, { cursor = { seq = 7, product_id = "product", expiry_floor = -1 } }))

            local release = assert(registry.get("kickside.pim.traits:release"))
            local release_schema = assert(json.decode(release.meta.output_schema))
            local outcome = { outcome = "queued", request_id = "request", job_id = "job" }
            local result = { success = true, applied = false, outcomes = { outcome } }
            test.is_true(json.validate(release_schema, result))
            outcome.job_id = nil
            test.is_false(json.validate(release_schema, result))
            outcome.outcome = "unknown"
            test.is_false(json.validate(release_schema, result))
        end)
        test.it("separates read, working and administration roles", function()
            local reads = assert(registry.get("kickside.pim.traits:pim_readonly"))
            local working = assert(registry.get("kickside.pim.traits:pim_trait"))
            local admin = assert(registry.get("kickside.pim.traits:pim_admin"))
            test.eq(#reads.data.tools, 16)
            test.eq(#working.data.tools, 22)
            test.eq(#admin.data.tools, 10)
            test.eq(reads.data.build_func_id, "kickside.pim.traits:build_reads")
            test.eq(working.data.build_func_id, "kickside.pim.traits:build")
            test.is_nil(admin.data.build_func_id)
            local reads_set: Map = {}
            for _, method in ipairs({ "list_catalogs", "get_schema", "schema_options", "list_terms", "query", "get", "explain", "list_history", "list_links", "list_proposals", "list_releases", "get_release", "get_model_release", "wait_for_product", "list_publications", "list_changes" }) do
                reads_set["kickside.pim.traits:" .. method] = true
            end
            local working_set: Map = {}
            for id in pairs(reads_set) do working_set[id] = true end
            for _, method in ipairs({ "adopt_asset", "apply", "propose", "decide", "release", "withdraw" }) do working_set["kickside.pim.traits:" .. method] = true end
            local admin_set: Map = {}
            for _, method in ipairs({ "create_catalog", "update", "plan_schema", "apply_schema", "configure_plugin", "rebuild", "list_catalogs", "get_schema", "schema_options", "policy_defaults" }) do admin_set["kickside.pim.traits:" .. method] = true end
            for _, role in ipairs({ { entry = reads, expected = reads_set }, { entry = working, expected = working_set }, { entry = admin, expected = admin_set } }) do
                local actual: Map = {}
                for _, id in ipairs(role.entry.data.tools) do
                    test.is_nil(actual[id], id)
                    actual[id] = true
                    local read = reads_set[id] or id == "kickside.pim.traits:plan_schema" or id == "kickside.pim.traits:policy_defaults"
                    test.eq(assert(registry.get(id)).meta.mcp.required_scopes[1], read and "state.read" or "state.write")
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
