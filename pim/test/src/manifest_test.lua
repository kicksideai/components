-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugin manifests: a registry entry declares what a plugin is (its settings
-- namespace, config schema, template); per-catalog enablement and config are
-- data, and effective config is the catalog's value over the app's.
local test = require("test")
local plugins = require("plugins")
local types = require("types")
local sql = require("sql")
local security = require("security")
local funcs = require("funcs")

-- as_actor runs the resolve probe under a fresh harness actor.
local function as_actor(id: string, request: { [string]: unknown }): (types.PluginSchema?, error?)
    local actor = security.new_actor(id, { user_id = id })
    local scope = assert(security.new_scope({ assert(security.policy("app:user")) }))
    local out, err = funcs.new():with_actor(actor):with_scope(scope):call("app:probe_resolve", request)
    if err then return nil, err end
    return out :: types.PluginSchema, nil
end

type Aspect = { namespace: string, attributes: { { code: string } } }

-- aspects reads the aspect list of a resolved fragment.
local function aspects(resolved: types.PluginSchema): { Aspect }
    return (resolved.fragment :: { [string]: unknown }).aspects :: { Aspect }
end

local function seed(catalog_id: string, fields: { { string } })
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_probe_fields (catalog_id TEXT NOT NULL, code TEXT NOT NULL, form TEXT NOT NULL)", {}))
    assert(db:execute("DELETE FROM pim_test_probe_fields WHERE catalog_id = $1", { catalog_id }))
    for _, f in ipairs(fields) do
        assert(db:execute("INSERT INTO pim_test_probe_fields (catalog_id, code, form) VALUES ($1, $2, $3)", { catalog_id, f[1], f[2] }))
    end
    db:release()
end

local function define()
    test.describe("plugin manifests", function()
        test.it("loads explicit and implicit interface version one", function()
            test.eq(assert(plugins.load("app:probe_bare_plugin")).interface_version, 1)
            test.eq(assert(plugins.load("app:probe_version_one_plugin")).interface_version, 1)
        end)

        test.it("rejects unsupported interface versions before validating the rest of the manifest", function()
            for _, suffix in ipairs({ "future", "string", "false" }) do
                local id = "app:probe_version_" .. suffix .. "_plugin"
                local plugin, err = plugins.load(id)
                test.is_nil(plugin, id)
                test.not_nil(err, id)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "plugin_interface_version_unsupported")
                test.eq(err:details().plugin, id)
            end
        end)

        test.it("loads declared state input and positive projection revisions", function()
            local p, err = plugins.load("app:state_plugin")
            test.is_nil(err, tostring(err))
            test.eq(p.projections[1].input, "state")
            test.eq(p.projections[1].revision, 2)
        end)

        test.it("validates configuration without deployment activation", function()
            local plugin = assert(plugins.load("app:probe_shelf_plugin"))
            local value, err = plugins.merged(plugin, { location = "WH0", reorder_days = 14 }, { location = "WH7" })
            test.is_nil(err)
            test.eq(value.location, "WH7")
            test.eq(value.reorder_days, 14)
            test.is_nil(value.enabled)
            local refused, invalid = plugins.merged(plugin, { location = "WH0", reorder_days = 14 }, { location = 4 })
            test.is_nil(refused)
            test.eq(invalid:kind(), errors.INVALID)
            test.eq(invalid:details().code, "plugin_config_invalid")
        end)

        test.it("requires an attachment declaration with a structured field error", function()
            local value, err = plugins.load("app:probe_unattached_plugin")
            test.is_nil(value)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "plugin_invalid")
            test.eq(err:details().field, "attachment")
        end)

        test.it("rejects secret annotations in composition and definition schemas", function()
            for _, suffix in ipairs({ "allof", "anyof", "oneof", "defs", "definitions", "ref", "tuple", "additional" }) do
                local value, err = plugins.load("app:probe_secret_" .. suffix)
                test.is_nil(value, suffix)
                test.not_nil(err, suffix)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "plugin_invalid")
                test.eq(err:details().field, "config_schema")
            end
        end)

        for _, suffix in ipairs({ "uri_ref", "array_ref", "dependencies", "content" }) do
            test.it("rejects secret annotations through " .. suffix .. " schemas", function()
                local value, err = plugins.load("app:probe_secret_" .. suffix)
                test.is_nil(value)
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "plugin_invalid")
                test.eq(err:details().field, "config_schema")
            end)
        end

        test.it("accepts recursive public schemas and names without secret annotations", function()
            local value, err = plugins.load("app:probe_public_recursive")
            test.is_nil(err)
            test.not_nil(value)
        end)

        test.it("loads distinct dependency and seam identities and rejects malformed lists", function()
            local plugin = assert(plugins.load("app:probe_owned_plugin"))
            test.eq(plugin.requires[1], "app:probe_bare_plugin")
            test.eq(plugin.seams[1], "app:probe_type")
            for _, suffix in ipairs({ "requires", "seams" }) do
                local value, err = plugins.load("app:probe_bad_" .. suffix)
                test.is_nil(value)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "plugin_invalid")
                test.eq(err:details().field, suffix)
            end
        end)

        test.it("uses the common projection declaration code for invalid workers", function()
            for _, id in ipairs({ "app:missing_worker_plugin", "app:wrong_worker_plugin", "app:scoped_worker_plugin" }) do
                local value, err = plugins.load(id)
                test.is_nil(value)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "plugin_projection_invalid")
                test.eq(err:details().field, "projections")
                test.is_false(err:retryable())
            end
        end)

        test.it("reports an active stored configuration that the current declaration refuses", function()
            local id="app:probe_shelf_plugin"
            local views,err=plugins.list({[id]={active=true,generation=1,seq=1,config={location=17},lifecycle={state="ready"}}},{[id]={use=id}})
            test.is_nil(err,tostring(err))
            local current=nil
            for _,view in ipairs(views) do if view.plugin==id then current=view end end
            test.not_nil(current.problem)
            test.eq(current.problem.code,"plugin_config_invalid")
        end)

        test.it("loads a manifest and refuses what is not one", function()
            local p = assert(plugins.load("app:probe_shelf_plugin"))
            test.eq(p.id, "app:probe_shelf_plugin")
            test.eq(p.settings, "app.probe_shelf")
            test.eq(p.attachment, "app:probe_shelf_attachment")
            test.not_nil(assert(p.schema).template)
            test.is_nil(assert(p.schema).provider)
            test.not_nil((plugins.load("app:probe_bare_plugin")))
            for _, bad in ipairs({ "app:nope", "app:manifest_test", "app:probe_leaky_plugin" }) do
                local _, err = plugins.load(bad)
                test.not_nil(err, bad)
            end
        end)

        test.it("loads a schema source as a template or a provider and refuses other shapes", function()
            local provided = assert(plugins.load("app:probe_fields_plugin"))
            test.eq(assert(provided.schema).provider, "app:probe_fields_provider")
            test.is_nil(assert(plugins.load("app:probe_bare_plugin")).schema)
            for _, bad in ipairs({ "app:probe_two_sources_plugin", "app:probe_string_template_plugin" }) do
                local _, err = plugins.load(bad)
                test.not_nil(err, bad)
            end
        end)

        test.it("resolves a template as its own fragment with a stable digest and no version", function()
            local p = assert(plugins.load("app:probe_shelf_plugin"))
            local resolved = assert(plugins.resolve_schema(p, { catalog_id = "o1", config = {} }))
            test.eq(aspects(resolved)[1].namespace, "shelf")
            test.is_nil(resolved.version)
            test.is_true(resolved.digest:match("^%x+$") ~= nil and #resolved.digest >= 32, resolved.digest)
            test.eq(assert(plugins.resolve_schema(p, { catalog_id = "o2", config = { location = "x" } })).digest, resolved.digest)
            test.is_nil((plugins.resolve_schema(assert(plugins.load("app:probe_bare_plugin")), { catalog_id = "o1", config = {} })))
        end)

        test.it("digests a fragment by content, not by key order", function()
            local function manifest(fragment: types.JsonObject): types.Plugin
                return { id = "app:inline", interface_version = 1, config_schema = { type = "object" }, schema = { template = fragment } }
            end
            local a = assert(plugins.resolve_schema(manifest({ aspects = { { namespace = "z", attributes = { { code = "k", type = "text", index = "key" } } } }, vocabularies = {} }),
                { catalog_id = "o", config = {} }))
            local b = assert(plugins.resolve_schema(manifest({ vocabularies = {}, aspects = { { attributes = { { index = "key", type = "text", code = "k" } }, namespace = "z" } } }),
                { catalog_id = "o", config = {} }))
            local c = assert(plugins.resolve_schema(manifest({ aspects = { { namespace = "z", attributes = { { code = "k", type = "text", index = "none" } } } }, vocabularies = {} }),
                { catalog_id = "o", config = {} }))
            test.eq(a.digest, b.digest)
            test.is_true(a.digest ~= c.digest)
        end)

        test.it("resolves a provider under the caller with catalog, config and current", function()
            seed("owner-a", { { "weight", "dec" }, { "colour", "text" } })
            seed("owner-b", { { "size", "int" } })
            local a = assert(as_actor("admin-a", { plugin = "app:probe_fields_plugin", catalog_id = "owner-a", config = { prefix = "dyn" } }))
            local aspect = aspects(a)[1]
            test.eq(aspect.namespace, "dyn")
            test.eq(#aspect.attributes, 2)
            test.eq(aspect.attributes[1].code, "colour")
            test.eq(a.version, "2:admin-a:app:probe_fields_plugin:none")
            test.is_true(#a.digest >= 32)
            local b = assert(as_actor("admin-b", { plugin = "app:probe_fields_plugin", catalog_id = "owner-b", config = {} }))
            test.eq(aspects(b)[1].namespace, "fields")
            test.eq(#aspects(b)[1].attributes, 1)
            test.is_true(b.digest ~= a.digest)
            local again = assert(as_actor("admin-a", { plugin = "app:probe_fields_plugin", catalog_id = "owner-a", config = { prefix = "dyn" }, current = a }))
            test.eq(again.version, "2:admin-a:app:probe_fields_plugin:" .. tostring(a.version))
            test.eq(again.digest, a.digest)
        end)

        test.it("reports a failing or malformed provider as an error", function()
            local failed_value, failed = as_actor("admin-c", { plugin = "app:probe_failing_plugin", catalog_id = "owner-c", config = {} })
            test.is_nil(failed_value)
            test.not_nil(failed)
            test.eq(failed:kind(), errors.UNAVAILABLE)
            test.eq(failed:details().code, "field_store_unavailable")
            test.is_true(failed:retryable())
            local malformed_value, malformed = as_actor("admin-c", { plugin = "app:probe_malformed_plugin", catalog_id = "owner-c", config = {} })
            test.is_nil(malformed_value)
            test.not_nil(malformed)
            test.eq(malformed:kind(), errors.INTERNAL)
            test.eq(malformed:details().code, "internal")
            test.is_nil(malformed:retryable())
            test.is_true(tostring(malformed):find("fragment", 1, true) ~= nil, tostring(malformed))
        end)

        test.it("checks effective configuration including required keys", function()
            local p = assert(plugins.load("app:probe_shelf_plugin"))
            test.not_nil(plugins.merged(p, { location = "WH1" }, {}))
            test.not_nil(plugins.merged(p, { location = "WH1" }, { reorder_days = 3, auto_reorder = false }))
            for _, bad in ipairs({ { reorder_days = 0 }, { reorder_days = "3" }, { shelf = "x" }, { auto_reorder = "no" } } :: { types.JsonObject }) do
                local value, err = plugins.merged(p, { location = "WH1" }, bad)
                test.is_nil(value)
                test.eq(err:details().code, "plugin_config_invalid")
            end
            local bare = assert(plugins.load("app:probe_bare_plugin"))
            test.not_nil(plugins.merged(bare, {}, {}))
            local value, err = plugins.merged(bare, {}, { unexpected = 1 })
            test.is_nil(value)
            test.eq(err:details().code, "plugin_config_invalid")
        end)

        test.it("lists the installed manifests", function()
            local ids = assert(plugins.find())
            test.is_true(#ids >= 3)
            local installed_consumer = false
            for _, id in ipairs(ids) do
                test.is_true(id:find("^app:") ~= nil or id == "app.compliance:plugin")
                if id == "app.compliance:plugin" then installed_consumer = true end
            end
            test.is_true(installed_consumer)
        end)

        test.it("refuses secret-shaped config at any depth", function()
            local value, err = plugins.load("app:probe_leaky_plugin")
            test.is_nil(value)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "plugin_invalid")
            test.is_false(err:retryable())
            test.is_true(tostring(err):find("config.auth.token", 1, true) ~= nil, tostring(err))
        end)

        test.it("accepts empty lists in config and effective config", function()
            local p = assert(plugins.load("app:probe_listed_plugin"))
            test.is_nil(plugins.check("app:probe_listed_plugin", {}))
            local e = assert(plugins.merged(p, { tags = { "a" } }, { tags = {} }))
            test.eq(#(e.tags :: { unknown }), 0)
        end)

        test.it("rejects deployment values outside the declared configuration", function()
            local p = assert(plugins.load("app:probe_bare_plugin"))
            local e, err = plugins.merged(p, { enabled = true }, nil)
            test.is_nil(e)
            test.eq(err:details().code, "plugin_config_invalid")
        end)

        test.it("takes the catalog's values over the app's and keeps false as a value", function()
            local p = assert(plugins.load("app:probe_shelf_plugin"))
            local app: types.JsonObject = { location = "WH1", reorder_days = 7, auto_reorder = true }
            local config = assert(plugins.merged(p, app, { auto_reorder = false }))
            test.eq(config.location, "WH1")
            test.eq(config.reorder_days, 7)
            test.eq(config.auto_reorder, false)
            local _, missing = plugins.merged(p, { reorder_days = 3 }, {})
            test.not_nil(missing)
            local _, invalid = plugins.merged(p, { location = "WH1", reorder_days = -1 }, {})
            test.not_nil(invalid)
        end)

    end)
end

return { run = test.run_cases(define) }
