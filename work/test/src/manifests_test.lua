-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugin manifests: a registry entry declares what a plugin is (its settings namespace,
-- config schema, template); per-board config is data, and effective config is the
-- board's value over the app's.
local test = require("test")
local manifests = require("manifests")
local plugins = require("plugins")
local types = require("types")
local sql = require("sql")
local security = require("security")
local funcs = require("funcs")

-- as_actor runs the resolve probe under a fresh harness actor.
local function as_actor(id: string, request: { [string]: unknown }): (types.PluginSchema?, error?)
    local actor = security.new_actor(id, { user_id = id })
    local scope = assert(security.new_scope({ assert(security.policy("app:user")) }))
    local out, err = funcs.new():with_actor(actor):with_scope(scope):call("app:resolve_probe", request)
    if err then return nil, err end
    return out :: types.PluginSchema, nil
end

type Aspect = { namespace: string, attributes: { { code: string } } }

-- aspects reads the aspect list of a resolved fragment.
local function aspects(resolved: types.PluginSchema): { Aspect }
    return (resolved.fragment :: { [string]: unknown }).aspects :: { Aspect }
end

local function seed(board_id: string, fields: { { string } })
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_plugin_fields (board_id TEXT NOT NULL, code TEXT NOT NULL, form TEXT NOT NULL)", {}))
    assert(db:execute("DELETE FROM app_plugin_fields WHERE board_id = $1", { board_id }))
    for _, f in ipairs(fields) do
        assert(db:execute("INSERT INTO app_plugin_fields (board_id, code, form) VALUES ($1, $2, $3)", { board_id, f[1], f[2] }))
    end
    db:release()
end

local function define()
    test.describe("plugin manifests", function()
        test.it("refuses secret annotations through schema applicators references and containers", function()
            for _, name in ipairs({ "anyOf", "oneOf", "allOf", "items", "additionalProperties", "ref", "recursive" }) do
                local _, err = manifests.load("app:secret_" .. name)
                test.not_nil(err, name)
                test.eq(err:kind(), errors.INVALID, name)
            end
        end)
        test.it("refuses mapped id lists and an explicit noninteger revision", function()
            for id, code in pairs({ ["app:mapped_requires_plugin"] = "plugin_invalid", ["app:mapped_seams_plugin"] = "plugin_invalid", ["app:false_revision_plugin"] = "plugin_projection_invalid" }) do
                local value, err = manifests.load(id)
                test.is_nil(value, id); test.not_nil(err, id)
                test.eq(err:kind(), errors.INVALID); test.eq(err:details().code, code)
            end
        end)
        test.it("uses unified declaration codes and preserves display metadata", function()
            local p = assert(manifests.load("app:contract_plugin"))
            test.eq(p.description, "Contract fixture")
            test.eq(p.icon, "puzzle")
            test.eq(p.projections[1].input, "state")
            test.eq(p.projections[1].revision, 2)
            test.eq(p.projections[2].input, "events")
            test.eq(p.projections[2].revision, 1)
            for id, code in pairs({ ["app:absent_plugin"] = "unknown_plugin", ["app:leaky_plugin"] = "plugin_invalid", ["app:missing_worker_plugin"] = "plugin_projection_invalid" }) do
                local _, err = manifests.load(id)
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, code)
            end
        end)
        test.it("validates only effective config and accepts unannotated property names", function()
            local p = assert(manifests.load("app:contract_plugin"))
            local config = assert(manifests.effective(p, { nested = { token = "label", count = 3 } }, { nested = { token = "board", count = 2 } }))
            test.eq(config.nested.token, "board")
            local _, err = manifests.effective(p, {}, { nested = { count = "wrong" } })
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "plugin_config_invalid")
            test.not_nil(err:details().plugin)
        end)
        test.it("loads a manifest and refuses what is not one", function()
            local p = assert(manifests.load("app:shelf_plugin"))
            test.eq(p.id, "app:shelf_plugin")
            test.eq(p.settings, "app.shelf")
            test.eq(p.attachment, "app:work_attachment")
            test.not_nil(assert(p.schema).template)
            test.is_nil(assert(p.schema).provider)
            test.not_nil((manifests.load("app:bare_plugin")))
            for _, bad in ipairs({ "app:nope", "app:plugins_test", "app:leaky_plugin" }) do
                local _, err = manifests.load(bad)
                test.not_nil(err, bad)
            end
        end)

        test.it("loads a schema source as a template or a provider and refuses other shapes", function()
            local provided = assert(manifests.load("app:fields_plugin"))
            test.eq(assert(provided.schema).provider, "app:fields_provider")
            test.is_nil(assert(manifests.load("app:bare_plugin")).schema)
            for _, bad in ipairs({ "app:two_sources_plugin", "app:string_template_plugin" }) do
                local _, err = manifests.load(bad)
                test.not_nil(err, bad)
            end
        end)

        test.it("resolves a template as its own fragment with a stable digest and no version", function()
            local p = assert(manifests.load("app:shelf_plugin"))
            local resolved = assert(manifests.resolve_schema(p, { board_id = "o1", config = {} }))
            test.eq(aspects(resolved)[1].namespace, "shelf")
            test.is_nil(resolved.version)
            test.is_true(resolved.digest:match("^%x+$") ~= nil and #resolved.digest >= 32, resolved.digest)
            test.eq(assert(manifests.resolve_schema(p, { board_id = "o2", config = { location = "x" } })).digest, resolved.digest)
            test.is_nil((manifests.resolve_schema(assert(manifests.load("app:bare_plugin")), { board_id = "o1", config = {} })))
        end)

        test.it("digests a fragment by content, not by key order", function()
            local function manifest(fragment: types.JsonObject): types.Plugin
                return { id = "app:inline", config_schema = { type = "object" }, schema = { template = fragment }, requires = {}, seams = {}, projections = {}, tools = {} }
            end
            local a = assert(manifests.resolve_schema(manifest({ aspects = { { namespace = "z", attributes = { { code = "k", type = "text", index = "key" } } } }, vocabularies = {} }),
                { board_id = "o", config = {} }))
            local b = assert(manifests.resolve_schema(manifest({ vocabularies = {}, aspects = { { attributes = { { index = "key", type = "text", code = "k" } }, namespace = "z" } } }),
                { board_id = "o", config = {} }))
            local c = assert(manifests.resolve_schema(manifest({ aspects = { { namespace = "z", attributes = { { code = "k", type = "text", index = "none" } } } }, vocabularies = {} }),
                { board_id = "o", config = {} }))
            test.eq(a.digest, b.digest)
            test.is_true(a.digest ~= c.digest)
        end)

        test.it("resolves a provider under the caller with board, config and current", function()
            seed("board-a", { { "weight", "dec" }, { "colour", "text" } })
            seed("board-b", { { "size", "int" } })
            local a = assert(as_actor("admin-a", { plugin = "app:fields_plugin", board_id = "board-a", config = { prefix = "dyn" } }))
            local aspect = aspects(a)[1]
            test.eq(aspect.namespace, "dyn")
            test.eq(#aspect.attributes, 2)
            test.eq(aspect.attributes[1].code, "colour")
            test.eq(a.version, "2:admin-a:app:fields_plugin:none")
            test.is_true(#a.digest >= 32)
            local b = assert(as_actor("admin-b", { plugin = "app:fields_plugin", board_id = "board-b", config = {} }))
            test.eq(aspects(b)[1].namespace, "fields")
            test.eq(#aspects(b)[1].attributes, 1)
            test.is_true(b.digest ~= a.digest)
            local again = assert(as_actor("admin-a", { plugin = "app:fields_plugin", board_id = "board-a", config = { prefix = "dyn" }, current = a }))
            test.eq(again.version, "2:admin-a:app:fields_plugin:" .. tostring(a.version))
            test.eq(again.digest, a.digest)
        end)

        test.it("reports a failing or malformed provider as an error", function()
            local _, failed = as_actor("admin-c", { plugin = "app:failing_plugin", board_id = "board-c", config = {} })
            test.is_true(tostring(failed):find("field store is offline", 1, true) ~= nil, tostring(failed))
            local _, malformed = as_actor("admin-c", { plugin = "app:malformed_plugin", board_id = "board-c", config = {} })
            test.is_true(tostring(malformed):find("fragment", 1, true) ~= nil, tostring(malformed))
        end)

        test.it("checks effective configuration with deployment values for required keys", function()
            local p = assert(manifests.load("app:shelf_plugin"))
            test.not_nil((manifests.effective(p, { location = "WH1" }, {})))
            test.not_nil((manifests.effective(p, { location = "WH1" }, { reorder_days = 3, auto_reorder = false })))
            for _, bad in ipairs({ { reorder_days = 0 }, { reorder_days = "3" }, { shelf = "x" }, { auto_reorder = "no" } } :: { types.JsonObject }) do
                local _, err = manifests.effective(p, { location = "WH1" }, bad)
                test.not_nil(err)
            end
            local bare = assert(manifests.load("app:bare_plugin"))
            test.not_nil((manifests.effective(bare, {}, {})))
            local _, err = manifests.effective(bare, {}, { extra = 1 })
            test.not_nil(err)
        end)

        test.it("refuses secret-shaped config at any depth", function()
            local _, err = manifests.load("app:leaky_plugin")
            test.is_true(tostring(err):find("config.auth.token", 1, true) ~= nil, tostring(err))
        end)

        test.it("preserves deployment configuration names declared by the schema", function()
            local p = assert(manifests.load("app:bare_plugin"))
            p.config_schema = { type = "object", properties = { enabled = { type = "boolean" } }, additionalProperties = false }
            test.eq(assert(manifests.effective(p, { enabled = true }, nil)).enabled, true)
        end)

        test.it("accepts empty lists in config and effective config", function()
            local p = assert(manifests.load("app:listed_plugin"))
            test.not_nil((manifests.effective(p, {}, { tags = {} })))
            local e = assert(manifests.effective(p, { tags = { "a" } }, { tags = {} }))
            test.eq(#(e.tags :: { unknown }), 0)
        end)

        test.it("refuses undeclared deployment properties in effective config", function()
            local p = assert(manifests.load("app:bare_plugin"))
            local _, err = manifests.effective(p, { enabled = true }, nil)
            test.not_nil(err); test.eq(err:details().code, "plugin_config_invalid")
        end)

        test.it("takes the board's values over the app's and keeps false as a value", function()
            local p = assert(manifests.load("app:shelf_plugin"))
            local app: types.JsonObject = { location = "WH1", reorder_days = 7, auto_reorder = true }
            local on = assert(manifests.effective(p, app, { auto_reorder = false }))
            test.eq(on.location, "WH1")
            test.eq(on.reorder_days, 7)
            test.eq(on.auto_reorder, false)
            test.is_nil(on.enabled)
            local _, missing = manifests.effective(p, { reorder_days = 3 }, nil)
            test.not_nil(missing)
            local _, invalid = manifests.effective(p, { location = "WH1", reorder_days = -1 }, nil)
            test.not_nil(invalid)
        end)
    end)

    test.describe("field type seams", function()
        test.it("classifies unknown seam entries before testing ownership", function()
            local _, err = plugins.field({ code = "missing", type = "app:absent_type" }, {})
            test.not_nil(err); test.eq(err:details().code, "unknown_type")
            local scope = plugins.seam("app:absent_scope", {}, false, "scope")
            test.not_nil(scope); test.eq(scope:details().code, "unknown_scope")
        end)
        test.it("reads a declared type", function()
            local t = assert((plugins.load_type("app:text_type")))
            test.eq(t.form, "text")
            test.eq(#(t.indexes :: { string }), 2)
            test.is_nil(t.config_schema)
            test.eq(assert(assert((plugins.load_type("app:configured_type"))).config_schema).type, "object")
        end)

        test.it("refuses what is not a declared type", function()
            for _, id in ipairs({ "app:nope", "app:formless_type", "app:undeclared_type", "app:listed_config_type" }) do
                local _, err = plugins.load_type(id)
                test.not_nil(err, id)
                test.eq((err :: error):kind(), errors.INVALID, id)
                test.eq((err :: error):details().code, "unknown_type", id)
            end
        end)

        test.it("refuses a type that names callbacks", function()
            local _, err = plugins.load_type("app:callback_type")
            test.eq((err :: error):details().code, "plugin_type_callbacks_unsupported")
        end)
    end)
end

return { run = test.run_cases(define) }
