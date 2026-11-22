-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")
local fs = require("fs")
local contract = require("contract")
local http_client = require("http_client")
local gateway = require("gateway")

local function catalog(owner: session.Session): string
    local response = owner.post("/pim/catalogs", { title = "Administration", idempotency_key = uuid.v4(),
        declaration = { aspects = { { namespace = "core", attributes = { { code = "name", type = "kickside.pim.types:text" } } } },
            families = { { code = "apparel", aspects = { "core" } } }, vocabularies = { { code = "colors" } } } })
    test.eq(response.status, 200, json.encode(response.body))
    return response.body.data.catalog_id :: string
end
local function path(id: string, suffix: string): string return "/pim/catalogs/" .. id .. suffix end
local function names(id: string): string return "/pim-admin/catalogs/" .. id .. "/principal_labels" end

local function cases()
    test.describe("PIM administration module", function()
        test.it("announces and serves only System administration and catalog settings", function()
            local member, outsider = session.member(), session.outsider()
            local bundle = assert(fs.get("kickside.pim.admin:ui_fs"))
            for _, name in ipairs({ "admin", "catalog_settings" }) do
                local id = "kickside.pim.admin:" .. name
                local entry = assert(registry.get(id))
                test.eq(entry.meta.type, "view.component")
                test.is_true(entry.meta.announced); test.is_true(entry.meta.auto_register)
                test.is_true(member.allows("access", id)); test.is_false(outsider.allows("access", id))
                test.is_true(bundle:exists(entry.meta.entry_point :: string))
                local response, err = http_client.request("GET", gateway.url("/kickside-pim-admin/" .. entry.meta.entry_point))
                test.is_nil(err, tostring(err)); test.eq(response.status_code, 200)
                test.is_true(#response.body > 100)
            end
            local tab = assert(registry.get("kickside.pim.admin:settings_tab"))
            test.eq(tab.data.component_tag, "kickside-pim-admin")
            test.eq(tab.data.access, "kickside.pim.api:apply_schema.endpoint")
            for _, name in ipairs({ "index.js", "product.js", "layout.js", "history.js" }) do
                test.is_false(bundle:exists(name), "consumer bundle must not ship: " .. name)
            end
            test.is_true(member.allows("access", "kickside.pim.admin.api:principals.endpoint"))
            test.is_true(member.allows("access", "kickside.pim.admin.api:defaults.endpoint"))
            test.is_false(member.allows("access", "kickside.pim.admin.api:unlisted.endpoint"))
            test.is_false(member.allows("funcs.call", "kickside.pim.admin.api:unlisted"))
            test.is_false(outsider.allows("access", "kickside.pim.admin.api:principals.endpoint"))
        end)
        test.it("opens a newly created catalog with an empty schema and applies its first definitions", function()
            local owner = session.admin()
            local created = owner.post("/pim/catalogs", { title = "New catalog", idempotency_key = uuid.v4() })
            test.eq(created.status, 200, json.encode(created.body))
            local id = created.body.data.catalog_id :: string
            local schema = owner.get(path(id, "/schema"))
            test.eq(schema.status, 200, json.encode(schema.body))
            test.eq(schema.body.data.schema_generation, 1, "schema: " .. json.encode(schema.body))
            test.eq(created.body.data.generation, 1, "create: " .. json.encode(created.body))
            test.is_true(schema.body.data.access.admin)
            local summary = owner.get(path(id, "/summary"))
            test.eq(summary.status, 200, json.encode(summary.body))
            test.eq(summary.body.data.generation, 1, "summary: " .. json.encode(summary.body))
            local query = owner.post(path(id, "/query"), { count = true })
            test.eq(query.status, 200, json.encode(query.body))
            test.eq(#query.body.data.items, 0)
            test.eq(query.body.data.total, 0)
            local applied = owner.post(path(id, "/schema"), { expected_generation = 1,
                declaration = { aspects = { { namespace = "core", attributes = { { code = "name", type = "kickside.pim.types:text" } } } } } })
            test.eq(applied.status, 200, json.encode(applied.body))
            test.eq(applied.body.data.generation, 2)
            test.not_nil(owner.get(path(id, "/schema")).body.data.attributes["core.name"])
        end)
        test.it("requires sessions and independent catalog access for schema reads", function()
            local owner, stranger, outsider = session.admin(), session.member(), session.outsider()
            local id = catalog(owner)
            test.eq(session.get(path(id, "/schema")).status, 401)
            test.eq(stranger.get(path(id, "/schema")).status, 403)
            test.eq(outsider.get(path(id, "/schema")).status, 403)
            for _, mask in ipairs({ 1, 3, 9 }) do
                local user = session.member()
                assert(owner.call("grant", { subject_id = user.id, mask = mask }, id))
                local response = user.get(path(id, "/schema"))
                test.eq(response.status, 200, json.encode(response.body))
                test.is_true(response.body.data.access.read)
                test.eq(response.body.data.access.write, mask == 3)
                test.eq(response.body.data.access.admin, mask == 9)
            end
        end)
        test.it("reviews and applies the schema through PIM with an expected generation", function()
            local owner = session.admin()
            local id = catalog(owner)
            local before = owner.get(path(id, "/schema"))
            local request = { expected_generation = before.body.data.schema_generation,
                declaration = { aspects = { { namespace = "core", attributes = { { code = "season", type = "kickside.pim.types:text" } } } } } }
            local plan = owner.post(path(id, "/schema/plan"), request)
            test.eq(plan.status, 200, json.encode(plan.body)); test.eq(plan.body.data.class, "additive")
            local applied = owner.post(path(id, "/schema"), request)
            test.eq(applied.status, 200, json.encode(applied.body))
            local after = owner.get(path(id, "/schema"))
            test.not_nil(after.body.data.attributes["core.season"])
            test.is_true(after.body.data.schema_generation > before.body.data.schema_generation)
            local stale = owner.post(path(id, "/schema/plan"), request)
            test.eq(stale.status, 409)
            test.eq(stale.body.details.code, "schema_generation_conflict")
            test.eq(stale.body.details.generation, after.body.data.schema_generation)
            test.eq(owner.get(path(id, "/schema")).body.data.as_of, after.body.data.as_of)
            test.eq(owner.post(path(id, "/schema"), request).status, 409)
        end)
        test.it("a readiness change remains semantic when the same draft adds a vocabulary", function()
            local owner = session.admin()
            local id = catalog(owner)
            local product = owner.post(path(id, "/apply"), { items = { { product = { sku = "SHIRT" }, create = { family = "apparel" } } } })
            test.eq(product.status, 200, json.encode(product.body))
            test.eq(product.body.data.outcomes[1].outcome, "created")
            local requirements = { { code = "apparel", aspects = { "core" }, requirements = { { id = "web", require = { "core.name" } } } } }
            local control = owner.post(path(id, "/schema/plan"), { expected_generation = 1, declaration = { families = requirements } })
            test.eq(control.status, 200, json.encode(control.body))
            test.eq(control.body.data.class, "semantic", json.encode(control.body))
            local request = { expected_generation = 1, declaration = { families = requirements, vocabularies = { { code = "seasons" } } } }
            local plan = owner.post(path(id, "/schema/plan"), request)
            local applied = owner.post(path(id, "/schema"), request)
            test.eq(plan.status, 200, json.encode(plan.body))
            test.eq(applied.status, 200, json.encode(applied.body))
            test.eq(plan.body.data.class .. "/" .. applied.body.data.class, "semantic/semantic",
                json.encode({ plan = plan.body.data, applied = applied.body.data }))
            for _, result in ipairs({ plan.body.data, applied.body.data }) do
                test.eq(#result.changes, 2)
                test.eq(result.changes[1].code, "family apparel")
                test.eq(result.changes[1].what, "requirements")
                test.eq(result.changes[1].class, "semantic")
                test.eq(result.changes[2].code, "vocabulary seasons")
                test.eq(result.changes[2].class, "additive")
            end
        end)
        test.it("a layout reorder alone appears in the schema review findings", function()
            local owner = session.admin()
            local id = catalog(owner)
            local added = owner.post(path(id, "/schema"), { expected_generation = 1,
                declaration = { aspects = { { namespace = "core", attributes = {
                    { code = "name", type = "kickside.pim.types:text" },
                    { code = "color", type = "kickside.pim.types:text" },
                } } } } })
            test.eq(added.status, 200, json.encode(added.body))
            local before = owner.get(path(id, "/schema")).body.data
            local attributes = before.declaration.aspects[1].attributes
            before.declaration.aspects[1].attributes = { attributes[2], attributes[1] }
            local request = { expected_generation = before.schema_generation, declaration = before.declaration }
            local plan = owner.post(path(id, "/schema/plan"), request)
            test.eq(plan.status, 200, json.encode(plan.body))
            test.eq(plan.body.data.class, "cosmetic")
            test.eq(plan.body.data.generation, before.schema_generation + 1)
            test.eq(#plan.body.data.changes, 1, json.encode(plan.body))
            test.eq(plan.body.data.changes[1].code, "aspect core")
            test.eq(plan.body.data.changes[1].what, "attribute order")
            test.eq(plan.body.data.changes[1].class, "cosmetic")
        end)
        test.it("persists layout widths and order and pages the schema history through existing PIM endpoints", function()
            local owner, stranger = session.admin(), session.member()
            local id = catalog(owner)
            local initial = owner.get(path(id, "/schema"))
            local added = owner.post(path(id, "/schema"), { expected_generation = initial.body.data.schema_generation,
                declaration = { aspects = { { namespace = "core", attributes = { { code = "name", type = "kickside.pim.types:text" }, { code = "color", type = "kickside.pim.types:text" } } } } } })
            test.eq(added.status, 200, json.encode(added.body))
            local product = owner.post(path(id, "/apply"), { items = {
                { product = { sku = "SHIRT" }, create = { family = "apparel" } },
            } })
            test.eq(product.status, 200, json.encode(product.body))
            test.eq(product.body.data.outcomes[1].outcome, "created")
            local view = owner.get(path(id, "/schema")).body.data
            local by_code = {}
            for _, attribute in ipairs(view.declaration.aspects[1].attributes) do by_code[attribute.code] = attribute end
            view.declaration.aspects[1].attributes = { by_code.color, by_code.name }
            by_code.color.width = "quarter"
            by_code.name.width = "full"
            local request = { expected_generation = view.schema_generation, declaration = view.declaration }
            local plan = owner.post(path(id, "/schema/plan"), request)
            test.eq(plan.status, 200, json.encode(plan.body))
            test.eq(plan.body.data.class, "cosmetic")
            local applied = owner.post(path(id, "/schema"), request)
            test.eq(applied.status, 200, json.encode(applied.body))
            test.eq(applied.body.data.class, "cosmetic")
            local after = owner.get(path(id, "/schema")).body.data
            test.eq(after.declaration.aspects[1].attributes[1].code, "color")
            test.eq(after.declaration.aspects[1].attributes[1].width, "quarter")
            test.eq(after.attributes["core.name"].width, "full")
            test.eq(after.attributes["core.name"].id, view.attributes["core.name"].id)
            test.eq(after.attributes["core.color"].id, view.attributes["core.color"].id)
            local queried = owner.post(path(id, "/query"), {})
            test.eq(queried.status, 200, json.encode(queried.body))
            test.is_false(queried.body.data.rebuilding == true)
            local previous = owner.get(path(id, "/schema?generation=" .. view.schema_generation))
            test.eq(previous.status, 200, json.encode(previous.body))
            test.eq(previous.body.data.declaration.aspects[1].attributes[1].code, "name")
            test.eq(previous.body.data.declaration.aspects[1].attributes[2].code, "color")
            test.eq(previous.body.data.attributes["core.name"].width, view.attributes["core.name"].width)
            test.eq(previous.body.data.attributes["core.color"].width, view.attributes["core.color"].width)
            local history = owner.get(path(id, "/history?limit=1"))
            test.eq(history.status, 200, json.encode(history.body))
            test.eq(#history.body.data.entries, 1)
            test.eq(history.body.data.entries[1].kind, "schema")
            test.eq(history.body.data.entries[1].after.generation, applied.body.data.generation)
            test.not_nil(history.body.data.next)
            local older = owner.get(path(id, "/history?limit=1&before=" .. history.body.data.next))
            test.eq(older.status, 200, json.encode(older.body))
            test.eq(#older.body.data.entries, 1)
            test.is_true(older.body.data.entries[1].seq < history.body.data.entries[1].seq)
            test.eq(stranger.get(path(id, "/history")).status, 403)
            test.eq(session.get(path(id, "/history")).status, 401)
        end)
        test.it("denies schema and plugin changes to readers and writers", function()
            local owner = session.admin()
            local id = catalog(owner)
            for _, mask in ipairs({ 1, 3 }) do
                local user = session.member()
                assert(owner.call("grant", { subject_id = user.id, mask = mask }, id))
                local request = { declaration = { aspects = { { namespace = "new" } } } }
                test.eq(user.post(path(id, "/schema/plan"), request).status, 403)
                test.eq(user.post(path(id, "/schema"), request).status, 403)
                test.eq(user.post(path(id, "/plugins/configure"), { plugin = "app:uninstalled", config = {} }).status, 403)
            end
        end)
        test.it("lists configuration options and deployment policy defaults", function()
            local owner = session.admin()
            local id = catalog(owner)
            local response = owner.get(path(id, "/schema/options"))
            test.eq(response.status, 200, json.encode(response.body))
            test.is_true(#response.body.data.types > 0)
            test.not_nil(response.body.data.plugins); test.not_nil(response.body.data.scopes)
            local settings = owner.get("/pim-admin/catalogs/" .. id .. "/policy_defaults")
            test.eq(settings.status, 200, json.encode(settings.body))
            test.eq(settings.body.data.audit_days, 365)
            test.eq(settings.body.data.pending_creation_days, 90)
            test.eq(owner.get("/settings?namespace=kickside.pim").status, 403, "catalog administration grants no global settings listing")
            test.eq(session.get("/pim-admin/catalogs/" .. id .. "/policy_defaults").status, 401)
            test.eq(session.outsider().get("/pim-admin/catalogs/" .. id .. "/policy_defaults").status, 403)
            local other = session.member()
            local other_id = catalog(owner)
            assert(owner.call("grant", { subject_id = other.id, mask = 9 }, other_id))
            assert(owner.call("grant", { subject_id = other.id, mask = 1 }, id))
            test.eq(other.get("/pim-admin/catalogs/" .. other_id .. "/policy_defaults").status, 200)
            test.eq(other.get("/pim-admin/catalogs/" .. id .. "/policy_defaults").status, 403)
            for _, mask in ipairs({ 1, 3, 9 }) do
                local user = session.member()
                assert(owner.call("grant", { subject_id = user.id, mask = mask }, id))
                test.eq(user.get("/pim-admin/catalogs/" .. id .. "/policy_defaults").status, mask == 9 and 200 or 403)
            end
        end)
        test.it("returns the same deployment defaults through the administration contract and HTTP", function()
            local owner = session.admin()
            local id = catalog(owner)
            local endpoint = "/pim-admin/catalogs/" .. id .. "/policy_defaults"
            local defaults, err = owner.call("policy_defaults", {}, id)
            test.is_nil(err, tostring(err))
            local http = owner.get(endpoint)
            test.eq(http.status, 200)
            local function same_defaults(actual: { [string]: unknown }, expected: { [string]: unknown })
                for key, value in pairs(expected) do test.eq(actual[key], value, key) end
                for key, value in pairs(actual) do test.eq(expected[key], value, key) end
            end
            same_defaults(defaults, http.body.data)
            for _, mask in ipairs({ 1, 3, 8, 9 }) do
                local user = session.member()
                assert(owner.call("grant", { subject_id = user.id, mask = mask }, id))
                local result, denied = user.call("policy_defaults", {}, id)
                if mask == 9 then
                    test.is_nil(denied, tostring(denied))
                    same_defaults(result, defaults)
                else
                    test.is_nil(result)
                    test.eq(assert(denied):kind(), errors.PERMISSION_DENIED)
                end
            end
        end)
        test.it("policy defaults resolve the deployment audit retention sentinel", function()
            local owner = session.admin()
            local id = catalog(owner)
            local settings = assert(assert(contract.get("kickside.settings:settings")):open())
            local function set_audit_days(value: number)
                local result, err = settings:set({ namespace = "kickside.pim", key = "audit_days", value = value })
                assert(not err and result and result.success, tostring(err or (result and result.error)))
            end
            local original = assert(settings:get({ namespace = "kickside.pim", key = "audit_days" })).value
            local applied = owner.post(path(id, "/schema"), { expected_generation = 1, declaration = { policy = { audit_days = 7 } } })
            test.eq(applied.status, 200, json.encode(applied.body))
            local endpoint = "/pim-admin/catalogs/" .. id .. "/policy_defaults"
            set_audit_days(42)
            local changed = owner.get(endpoint)
            set_audit_days(0)
            local inherited = owner.get(endpoint)
            set_audit_days(original)
            test.eq(changed.status, 200, json.encode(changed.body))
            test.eq(changed.body.data.audit_days, 42, "deployment defaults are independent of the catalog override")
            test.eq(inherited.status, 200, json.encode(inherited.body))
            test.eq(inherited.body.data.audit_days, 365, "zero resolves to the effective 365-day default")
        end)
        test.it("returns an HTTP error envelope when deployment policy defaults are unavailable", function()
            local owner = session.admin()
            local id = catalog(owner)
            local revision = assert(registry.current_version())
            local entry = assert(registry.get("kickside.settings:get_namespace"))
            local data = {}
            for key, value in pairs(entry.data) do data[key] = value end
            data.source = "return { get_namespace = function() return { success = false } end }"
            local changes = assert(registry.snapshot()):changes()
            changes:update({ id = entry.id, kind = entry.kind, meta = entry.meta, data = data })
            test.is_nil(select(2, changes:apply()))
            local ok, reply = pcall(owner.get, "/pim-admin/catalogs/" .. id .. "/policy_defaults")
            test.is_nil(select(2, registry.apply_version(revision)))
            assert(ok, tostring(reply))
            test.eq(reply.status, 503)
            test.is_false(reply.body.success)
            test.not_nil(reply.body.error)
        end)

        test.it("does not read a Settings key hidden from a catalog administrator", function()
            local owner = session.admin()
            local id = catalog(owner)
            local revision = assert(registry.current_version())
            local entry = assert(registry.get("kickside.pim.settings:audit_days"))
            local data: { [string]: unknown } = {}
            for key, value in pairs(entry.data) do data[key] = value end
            data.read_access = "admin"
            local changes = assert(registry.snapshot()):changes()
            changes:update({ id = entry.id, kind = entry.kind, meta = entry.meta, data = data })
            test.is_nil(select(2, changes:apply()))
            local ok, result, err = pcall(owner.call, "policy_defaults", {}, id)
            test.is_nil(select(2, registry.apply_version(revision)))
            assert(ok, tostring(result))
            test.is_nil(result)
            test.eq(assert(err):kind(), errors.UNAVAILABLE)
            test.eq(assert(err):details().code, "settings_unavailable")
        end)

        test.it("exposes built-in configuration and reviews a configured Quantity", function()
            local owner = session.admin()
            local id = catalog(owner)
            local options = owner.get(path(id, "/schema/options"))
            test.eq(options.status, 200, json.encode(options.body))
            local found = false
            for _, option in ipairs(options.body.data.types) do
                if option.id == "kickside.pim.types:quantity" then
                    test.not_nil(option.config_schema)
                    test.eq(option.config_schema.required[1], "units")
                    test.eq(option.config_schema.required[2], "canonical")
                    test.eq(option.config_schema.properties.units.type, "object")
                    found = true
                end
            end
            test.is_true(found)
            local response = owner.post(path(id, "/schema/plan"), { declaration = {
                aspects = { { namespace = "measurements", attributes = {
                    { code = "weight", type = "kickside.pim.types:quantity", index = "number",
                        config = { units = { kg = "1", g = "0.001" }, canonical = "kg", scale = 3 } },
                    { code = "price", type = "kickside.pim.types:money", config = { scale = 2, currency = "USD" } },
                    { code = "count", type = "kickside.pim.types:integer", config = { range = { 0, 100 }, scale = 0 } },
                    { code = "record", type = "kickside.pim.types:record", config = { members = { label = { form = "text" } } } },
                } } },
            } })
            test.eq(response.status, 200, json.encode(response.body))
            test.eq(response.body.data.class, "additive", json.encode(response.body))
        end)
        test.it("writes vocabulary terms without a product editor", function()
            local owner = session.admin()
            local id = catalog(owner)
            for _, code in ipairs({ "XL", "42", "blue-green", "A.b_9-", string.rep("x", 128) }) do
                local response = owner.post(path(id, "/apply"), { items = { { term = { vocabulary = "colors", code = code }, labels = { en = code } } } })
                test.eq(response.status, 200, json.encode(response.body))
                test.eq(response.body.data.outcomes[1].outcome, "created")
            end
            local terms = owner.get(path(id, "/terms?vocabulary=colors&limit=50"))
            test.eq(terms.status, 200, json.encode(terms.body)); test.eq(#terms.body.data.terms, 5)
        end)
        test.it("requires WRITE for term mutations independently of ADMIN", function()
            local owner, administrator = session.admin(), session.member()
            local id = catalog(owner)
            assert(owner.call("grant", { subject_id = administrator.id, mask = 9 }, id))
            local view = administrator.get(path(id, "/schema"))
            test.eq(view.status, 200, json.encode(view.body))
            test.is_true(view.body.data.access.admin); test.is_false(view.body.data.access.write)
            for _, item in ipairs({
                { term = { vocabulary = "colors", code = "XL" }, labels = { en = "Extra large" } },
                { term = { vocabulary = "colors", code = "XL" }, retired = true },
                { term = { vocabulary = "colors", code = "XL" }, retired = false },
            }) do
                test.eq(administrator.post(path(id, "/apply"), { items = { item } }).status, 403)
            end
        end)
        test.it("resolves display names only for an authenticated catalog administrator", function()
            local owner, reader, writer, stranger, outsider = session.admin(), session.member(), session.member(), session.member(), session.outsider()
            local id = catalog(owner)
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            assert(owner.call("grant", { subject_id = writer.id, mask = 3 }, id))
            local request = { refs = { { type = "user", id = owner.id } } }
            local anonymous, anonymous_err = http_client.request("POST", gateway.url("/api/v1" .. names(id)), {
                headers = { ["Content-Type"] = "application/json" }, body = json.encode(request) })
            test.is_nil(anonymous_err, tostring(anonymous_err)); test.eq(anonymous.status_code, 401)
            for _, denied in ipairs({ reader, writer, stranger, outsider }) do test.eq(denied.post(names(id), request).status, 403) end
            local response = owner.post(names(id), request)
            test.eq(response.status, 200, json.encode(response.body)); test.eq(response.body.data.principals[1].label, "PIM test user")
            assert(owner.call("grant", { subject_id = reader.id, mask = 9 }, id))
            test.eq(reader.post(names(id), request).status, 200)
        end)
        test.it("validates principal references and the bounded batch size", function()
            local owner = session.admin()
            local id = catalog(owner)
            for _, request in ipairs({ {}, { refs = { false } }, { refs = { named = { type = "user", id = owner.id } } }, { refs = { { type = "service", id = "unknown" } } }, { refs = { { type = "user", id = "" } } } }) do
                test.eq(owner.post(names(id), request).status, 400)
            end
            local refs = {}
            for _ = 1, 201 do refs[#refs + 1] = { type = "user", id = owner.id } end
            test.eq(owner.post(names(id), { refs = refs }).status, 400)
            test.eq(owner.post(names(id), { refs = {} }).status, 200)
        end)
    end)
end
return { run = test.run_cases(cases) }
