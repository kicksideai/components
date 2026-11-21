-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plugins and extension seams under hostile conditions: only an admin changes
-- plugin choices, a plugin that disappears or misconfigures fails closed with an
-- exit left open, plugin code that misbehaves becomes a finding and never stops
-- the projection, and malformed declarations are refused when they are adopted.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local types = require("types")
local json = require("json")
local base64 = require("base64")

type Map = { [string]: unknown }

local READ, WRITE, ADMIN = 1, 2, 8
local SHELF = "app:shelf_plugin"
local STRICT = "app:strict_plugin"
local BARE = "app:bare_plugin"

local plugins = fixture.plugins

local function exec(statement: string, params: { unknown })
    local db = assert(store.open())
    local _, err = db:execute(statement, params)
    db:release()
    assert(not err, tostring(err))
end

local function kind(err: unknown): string?
    if err == nil then return nil end
    return (err :: error):kind()
end

local function family_with(checks: { Map }): Map
    local source = fixture.DECLARATION.families[1]
    local out: Map = {}
    for k, v in pairs(source) do out[k] = v end
    out.checks = checks
    return out
end

local function define()
    test.describe("plugin choices are the catalog admin's", function()
        for _, level in ipairs({ { "READ", READ }, { "WRITE", READ + WRITE } } :: { { unknown } }) do
            test.it("refuses a plugin change under " .. tostring(level[1]), function()
                local h = fixture.catalog()
                local call, id = fixture.user(h)
                h.call("grant", { subject_id = id, mask = level[2] })
                local _, err = call("apply_schema", { declaration = { plugins = { { use = SHELF } } } })
                test.eq(kind(err), errors.PERMISSION_DENIED)
                test.is_false(plugins(h)[SHELF].active)
            end)
        end

        test.it("accepts a plugin change from a granted admin", function()
            local h = fixture.catalog()
            local call, id = fixture.user(h)
            h.call("grant", { subject_id = id, mask = READ + WRITE + ADMIN })
            local _, err = call("apply_schema", { declaration = { plugins = { { use = SHELF } } } })
            test.is_nil(err)
            test.is_true(plugins(h)[SHELF].active)
        end)

        test.it("previews a plugin change without applying it", function()
            local h = fixture.catalog()
            local plan, err = h.call("plan_schema", { declaration = { plugins = { { use = SHELF } } } })
            test.is_nil(err)
            test.eq(plan.class, "additive")
            test.eq(plan.changes[1].code, "plugin " .. SHELF)
            test.eq(plan.changes[2].code, "shelf.bin")
            test.is_false(plugins(h)[SHELF].active)
            test.eq(h.call("get_schema", {}).schema_generation, 1)
        end)

        test.it("reports an unchanged declaration without a new generation", function()
            local h = fixture.catalog()
            local d = { plugins = { { use = SHELF } } }
            test.eq(h.call("apply_schema", { declaration = d }).class, "additive")
            test.eq(h.call("apply_schema", { declaration = d }).class, "unchanged")
            test.eq(h.call("get_schema", {}).schema_generation, 2)
        end)

        test.it("keeps other plugins when one is replaced or removed", function()
            local h = fixture.catalog()
            h.call("apply_schema", { declaration = { plugins = { { use = SHELF }, { use = BARE } } } })
            h.call("apply_schema", { declaration = { plugins = { { use = SHELF } } } })
            test.is_true(plugins(h)[BARE].active)
            h.call("apply_schema", { declaration = { remove = { plugins = { SHELF } } } })
            test.is_true(plugins(h)[BARE].active)
            test.is_false(plugins(h)[SHELF].active)
        end)

        test.it("isolates plugin choices between catalogs", function()
            local a, b = fixture.catalog(), fixture.catalog()
            a.call("apply_schema", { declaration = { plugins = { { use = SHELF } } } , plugin_configs = { [SHELF] = { location = "AA" } } })
            test.is_true(plugins(a)[SHELF].active)
            test.eq(plugins(a)[SHELF].config.location, "AA")
            test.is_false(plugins(b)[SHELF].active)
            test.is_nil(plugins(b)[SHELF].config)
        end)

        test.it("keeps a false config value and an empty list", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = { plugins = { { use = STRICT } } } , plugin_configs = { [STRICT] = { endpoint = "e", live = false, flags = {} } } })
            test.is_nil(err)
            local cfg = plugins(h)[STRICT].config
            test.eq(cfg.live, false)
            test.eq(#(cfg.flags :: { unknown }), 0)
        end)

        test.it("names the config failure of a wrongly typed key", function()
            local h = fixture.catalog()
            for _, config in ipairs({ { live = "yes" }, { flags = "a" }, { flags = { 1 } } } :: { Map }) do
                local _, err = h.call("apply_schema", { declaration = { plugins = { { use = STRICT } } }, plugin_configs = { [STRICT] = config } })
                test.eq(kind(err), errors.INVALID)
            end
        end)
    end)

    test.describe("plugins fail closed", function()
        test.it("refuses a manifest that declares a secret in its config", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = { plugins = { { use = "app:leaky_plugin" } } } })
            test.eq(kind(err), errors.INVALID)
            test.is_true(plugins(h)["app:leaky_plugin"].problem ~= nil)
            test.is_nil(plugins(h)["app:leaky_plugin"].config)
        end)

        test.it("reports a plugin whose required config has no value anywhere", function()
            local h = fixture.catalog()
            local view = plugins(h)[STRICT]
            test.is_false(view.active)
            test.is_nil(view.config)
            local _, missing = h.call("apply_schema", { declaration = { plugins = { { use = STRICT } } } })
            test.eq(missing:details().code, "plugin_config_invalid")
            h.call("apply_schema", { declaration = { plugins = { { use = STRICT } } } , plugin_configs = { [STRICT] = { endpoint = "e" } } })
            test.is_nil(plugins(h)[STRICT].problem)
        end)

        test.it("runs a plugin without settings or config", function()
            local h = fixture.catalog()
            local view = plugins(h)[BARE]
            test.is_false(view.active)
            h.call("apply_schema", { declaration = { plugins = { { use = BARE } } } })
            test.is_true(plugins(h)[BARE].active)
        end)

        local function orphan(h: fixture.Handle)
            local db = assert(store.open())
            local catalog = assert(store.catalog(db, h.id))
            local declaration = assert(store.declaration(db, h.id, catalog.generation))
            db:release()
            declaration.plugins = { { use = "app:uninstalled" } }
            local compiled = catalog.compiled
            compiled.plugins["app:uninstalled"] = { use = "app:uninstalled" }
            compiled.by_id = nil
            exec("UPDATE kickside_pim_generation SET declaration = $1, compiled = $2 WHERE catalog_id = $3 AND generation = $4",
                { json.encode(declaration), json.encode(compiled), h.id, catalog.generation })
            exec("UPDATE kickside_pim_catalog SET compiled = $1 WHERE catalog_id = $2", { json.encode(compiled), h.id })
        end

        test.it("reports an uninstalled plugin and refuses to keep it", function()
            local h = fixture.catalog()
            orphan(h)
            local view = plugins(h)["app:uninstalled"]
            test.not_nil(view)
            test.not_nil(view.problem)
            test.is_nil(view.config)
            local _, err = h.call("apply_schema", { declaration = { vocabularies = { { code = "more" } } } })
            test.eq(kind(err), errors.INVALID)
        end)

        test.it("always lets an admin remove an uninstalled plugin", function()
            local h = fixture.catalog()
            orphan(h)
            local _, err = h.call("apply_schema", { declaration = { remove = { plugins = { "app:uninstalled" } } } })
            test.is_nil(err)
            test.is_nil(plugins(h)["app:uninstalled"])
        end)
    end)

    test.describe("misbehaving checks", function()
        for _, case in ipairs({ { "app:raising_check", "a raise" }, { "app:silent_check", "no findings field" }, { "app:scalar_check", "a scalar" },
            { "app:wordless_check", "a finding without a message" } } :: { { string } }) do
            test.it("keeps items unready and the projection moving after " .. case[2], function()
                local h = fixture.catalog()
                fixture.boot(h)
                local _, err = h.call("apply_schema", { declaration = { families = { family_with({ { check = case[1] } }) } } })
                test.is_nil(err)
                steps.rebuilt(h)
                test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 0)
                local web = assert(steps.get(h, "RDG-moss-40")).readiness.web
                test.eq(web[1].code, "check_unavailable")
                test.eq(web[1].check, case[1])
                test.eq(steps.set(h, "RDG-moss-40", "core.gtin", "after-" .. case[1]).outcome, "updated")
                local out = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40") } } })
                test.eq(out.outcomes[1].outcome, "not_ready")
            end)
        end

        test.it("passes a check its config and only the attributes it reads", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply_schema", { declaration = { families = { family_with({ { check = "app:config_check", reads = { "core.gtin", "core.size" }, config = { mark = "m1" } } }) } } })
            steps.rebuilt(h)
            local web = assert(steps.get(h, "RDG-moss-40")).readiness.web
            test.eq(web[1].message, "m1|core.gtin,core.size")
        end)

        test.it("refuses a family check that is not declared as a check", function()
            local h = fixture.catalog()
            for _, id in ipairs({ "app:plain_function", "app:nope", "app:stock_scope" }) do
                local _, err = h.call("apply_schema", { declaration = { families = { family_with({ { check = id } }) } } })
                test.eq(kind(err), errors.INVALID, id)
            end
        end)

        test.it("clears findings after a check is removed", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply_schema", { declaration = { families = { family_with({ { check = "app:raising_check" } }) } } })
            steps.rebuilt(h)
            test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 0)
            h.call("apply_schema", { declaration = { families = { family_with({}) } } })
            steps.rebuilt(h)
            test.eq(#h.call("query", { ready = { set = "web", value = true } }).items, 6)
        end)
    end)

    test.describe("type declarations", function()
        for _, case in ipairs({
            { "app:banana_type", "an unknown form" }, { "app:counter_type", "a fold-assigned form" }, { "app:formless_type", "no form" }, { "app:unaimed_type", "a reference without a target" },
            { "app:shelf_plugin", "an entry that is not a type" }, { "app:nope", "a missing entry" },
        } :: { { string } }) do
            test.it("refuses an attribute of a type with " .. case[2], function()
                local h = fixture.catalog()
                local _, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = { { code = "probe", type = case[1] } } } } } })
                test.eq(kind(err), errors.INVALID, tostring(err))
            end)
        end
    end)

    test.describe("hostile queries", function()
        local function stocked(): fixture.Handle
            local h = fixture.catalog()
            fixture.boot(h)
            exec([[CREATE TABLE IF NOT EXISTS pim_test_stock (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, location_id TEXT NOT NULL,
                available INTEGER NOT NULL)]], {})
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            local other = assert(steps.get(h, "RDG-moss-41")).product.product_id
            exec("INSERT INTO pim_test_stock (catalog_id, product_id, location_id, available) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)",
                { h.id, id, "WH1", 5, h.id, other, "WH2", 0 })
            local _, err = h.call("apply_schema", { declaration = { scopes = { "app:stock_scope", "app:cost_scope", "app:wrong_column_scope" } } })
            assert(not err, tostring(err))
            return h
        end
        local INJECTION = "x' OR '1'='1"
        local DROP = "'; DROP TABLE kickside_pim_product; --"

        test.it("binds hostile scope values", function()
            local h = stocked()
            for _, v in ipairs({ INJECTION, DROP }) do
                local out, err = h.call("query", { scopes = { { id = "app:stock_scope", where = { location = { eq = v } } } } })
                test.is_nil(err)
                test.eq(#out.items, 0)
            end
            test.eq(#h.call("query", {}).items, 6)
        end)

        test.it("binds hostile filter values, families and text and rejects undeclared statuses and channels", function()
            local h = stocked()
            for _, v in ipairs({ INJECTION, DROP }) do
                test.eq(#h.call("query", { where = { field = "core.gtin", op = "eq", value = v } }).items, 0)
                test.eq(#h.call("query", { family = v }).items, 0)
                local out, malformed = h.call("query", { status = v })
                test.is_nil(out)
                test.eq((malformed :: error):kind(), errors.INVALID)
                test.eq((malformed :: error):details().code, "invalid_request")
                test.eq(#h.call("query", { text = v }).items, 0)
                local page, channel_err = h.call("query", { published = { channel = v } })
                test.is_nil(page)
                test.eq(assert(channel_err):kind(), errors.INVALID)
                test.eq(assert(channel_err):details().code, "unknown_channel")
            end
            test.eq(#h.call("query", {}).items, 6)
        end)

        test.it("refuses hostile names where identifiers are expected", function()
            local h = stocked()
            for _, request in ipairs({
                { where = { field = "core.gtin; DROP TABLE x", op = "eq", value = "v" } },
                { where = { field = "core.gtin", op = "= 1 OR 1", value = "v" } },
                { sort = { field = "core.gtin; DROP TABLE x" } },
                { sort = { field = "core.size", dir = "desc; DROP TABLE x" } },
                { ready = { set = "web; DROP TABLE x", value = true } },
                { scopes = { { id = "app:stock_scope", where = { ["location) OR (1=1"] = { eq = "x" } } } } },
                { scopes = { { id = "app:stock_scope", where = { location = { ["= 1 OR 1"] = "x" } } } } },
            } :: { Map }) do
                local _, err = h.call("query", request)
                test.eq(kind(err), errors.INVALID, tostring(err))
            end
        end)

        -- A hostile cursor is bound as a keyset value: the page holds only catalog
        -- products (which ones follow the value is the database collation's order)
        -- and the product table survives.
        test.it("binds a hostile cursor", function()
            local h = stocked()
            local expected = {}
            for _, item in ipairs(assert(h.call("query", {})).items) do expected[item.product_id] = true end
            for _, request in ipairs({
                { after = base64.encode(assert(json.encode({ id = DROP }))) },
                { sort = { field = "core.gtin" }, after = base64.encode(assert(json.encode({ id = DROP, key = DROP }))) },
            } :: { Map }) do
                local out, err = h.call("query", request)
                test.is_nil(err)
                for _, item in ipairs(out.items) do test.is_true(expected[item.product_id], item.product_id) end
            end
            test.eq(#h.call("query", {}).items, 6)
        end)

        test.it("preserves the native SQL classification when a scope's column is missing", function()
            local h = stocked()
            local db = assert(store.open())
            local _, native_err = db:query("SELECT shelf_number FROM pim_test_stock")
            assert(db:release())
            test.not_nil(native_err)
            local out, err = h.call("query", { scopes = { { id = "app:wrong_column_scope", where = { shelf = { gt = 1 } } } } })
            test.is_nil(out)
            test.not_nil(err)
            test.eq(kind(err), native_err:kind())
            test.eq(err:retryable(), native_err:retryable())
        end)

        test.it("ands several scopes and treats an empty where as membership", function()
            local h = stocked()
            test.eq(#h.call("query", { scopes = { { id = "app:stock_scope", where = {} } } }).items, 2)
            test.eq(#h.call("query", { scopes = {
                { id = "app:stock_scope", where = { location = { eq = "WH1" } } },
                { id = "app:stock_scope", where = { available = { gt = 0 } } } } }).items, 1)
            test.eq(#h.call("query", { scopes = {
                { id = "app:stock_scope", where = { location = { eq = "WH2" } } },
                { id = "app:stock_scope", where = { available = { gt = 0 } } } } }).items, 0)
        end)

        test.it("refuses a scope when its access is lost and keeps refusing unadopted ones", function()
            local h = stocked()
            local call, id = fixture.user(h)
            h.call("grant", { subject_id = id, mask = READ + WRITE + ADMIN })
            local out, err = call("query", { scopes = { { id = "app:cost_scope", where = {} } } })
            test.is_nil(err)
            test.eq(#out.items, 2)
            h.call("grant", { subject_id = id, mask = READ })
            local _, lost = call("query", { scopes = { { id = "app:cost_scope", where = {} } } })
            test.eq(kind(lost), errors.PERMISSION_DENIED)
            local _, unknown = h.call("query", { scopes = { { id = "app:ghost_scope", where = {} } } })
            test.eq(kind(unknown), errors.INVALID)
        end)
    end)

    test.describe("hostile scope declarations", function()
        for _, id in ipairs({ "app:bad_access_scope", "app:bad_type_scope", "app:bad_op_scope", "app:hostile_column_scope", "app:hostile_scope", "app:nope", SHELF }) do
            test.it("refuses to adopt " .. id, function()
                local h = fixture.catalog()
                local _, err = h.call("apply_schema", { declaration = { scopes = { id } } })
                test.eq(kind(err), errors.INVALID, tostring(err))
                test.is_nil(h.call("get_schema", {}).scopes[id])
            end)
        end
    end)
end

return { run = test.run_cases(define) }
