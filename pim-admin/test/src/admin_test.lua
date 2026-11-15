-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")
local fs = require("fs")
local http_client = require("http_client")

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
                local response, err = http_client.request("GET", "http://127.0.0.1:19242/kickside-pim-admin/" .. entry.meta.entry_point)
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
            test.eq(owner.post(path(id, "/schema"), request).status, 409)
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
            for _, mask in ipairs({ 1, 3, 9 }) do
                local user = session.member()
                assert(owner.call("grant", { subject_id = user.id, mask = mask }, id))
                test.eq(user.get("/pim-admin/catalogs/" .. id .. "/policy_defaults").status, mask == 9 and 200 or 403)
            end
        end)
        test.it("writes vocabulary terms without a product editor", function()
            local owner = session.admin()
            local id = catalog(owner)
            local response = owner.post(path(id, "/apply"), { items = { { term = { vocabulary = "colors", code = "red" }, labels = { en = "Red" } } } })
            test.eq(response.status, 200, json.encode(response.body))
            test.eq(response.body.data.outcomes[1].outcome, "created")
            local terms = owner.get(path(id, "/terms?vocabulary=colors&limit=50"))
            test.eq(terms.status, 200, json.encode(terms.body)); test.eq(terms.body.data.terms[1].code, "red")
        end)
        test.it("resolves display names only for an authenticated catalog administrator", function()
            local owner, reader, writer, stranger, outsider = session.admin(), session.member(), session.member(), session.member(), session.outsider()
            local id = catalog(owner)
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            assert(owner.call("grant", { subject_id = writer.id, mask = 3 }, id))
            local request = { refs = { { type = "user", id = owner.id } } }
            local anonymous, anonymous_err = http_client.request("POST", session.API .. names(id), {
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
