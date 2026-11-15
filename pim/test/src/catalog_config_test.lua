-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component-level configuration: each catalog is a component instance with its
-- own schema, plugin choices and policy, held as its own data. Two catalogs in
-- one install differ in all three; one's configuration and writes leave the
-- other untouched, and a catalog's setting overrides the app default while
-- settings it leaves out follow that default.
local test = require("test")
local fixture = require("fixture")
local contract = require("contract")
local sql = require("sql")
local clock = require("clock")
local types = require("types")

type Map = { [string]: unknown }

local PLUGIN = "app:config_plugin"
local NAMESPACE = "app.config_plugin"

local function declared(handle: fixture.Handle, declaration: Map, plugin_configs: Map?): fixture.Handle
    local _, err = handle.call("apply_schema", { declaration = declaration, plugin_configs = plugin_configs })
    assert(not err, tostring(err))
    return handle
end

-- apparel declares a locale dimension, a wear aspect, the config plugin with
-- catalog-level values, and a policy over the app defaults.
local function apparel(): fixture.Handle
    return declared(fixture.catalog({ bare = true }), {
        dimensions = { { name = "locale", members = { "en", "fr" } } },
        aspects = { { namespace = "wear", attributes = {
            { code = "fabric", type = "kickside.pim.types:text", scope = { "locale" }, index = "key",
              index_contexts = { { locale = "en" } } },
            { code = "sku_note", type = "kickside.pim.types:text" },
        } } },
        families = { { code = "garment", aspects = { "wear", "config" } } },
        plugins = { { use = PLUGIN } },
        policy = { audit = "off", trash_days = 30 },
    }, { [PLUGIN] = { location = "EU-1" } })
end

-- tools declares a region dimension, a spec aspect, no plugin choice and no policy.
local function tools(): fixture.Handle
    return declared(fixture.catalog({ bare = true }), {
        dimensions = { { name = "region", members = { "eu", "us" } } },
        aspects = { { namespace = "spec", attributes = {
            { code = "torque", type = "kickside.pim.types:integer", scope = { "region" }, index = "number",
              index_contexts = { { region = "eu" } } },
            { code = "sku_note", type = "kickside.pim.types:text" },
        } } },
        families = { { code = "tool", aspects = { "spec" } } },
    })
end

local function schema(h: fixture.Handle): types.SchemaView
    local out, err = h.call("get_schema", {})
    assert(not err, tostring(err))
    return out :: types.SchemaView
end

local function set_default(key: string, value: unknown)
    local inst = assert(assert(contract.get("kickside.settings:settings")):open())
    local answer, err = inst:set({ namespace = NAMESPACE, key = key, value = value, actor_id = "harness" })
    assert(not err, tostring(err))
    assert(answer and answer.success == true, tostring(answer and answer.error))
end

local function apply_one(h: fixture.Handle, sku: string, family: string?, attr: string, value: unknown, ctx: Map?): types.Outcome
    local item: Map = { product = { sku = sku }, set = { { attr = attr, value = value, ctx = ctx } } }
    if family then item.create = { family = family } else item.expect_version = "any" end
    local out, err = h.call("apply", { items = { item } })
    assert(not err, tostring(err))
    return (out :: types.ApplyResult).outcomes[1]
end

-- pass runs one retention pass over every catalog and settles the addressed ones.
local function pass(handles: { fixture.Handle })
    local out, err = fixture.retain()
    assert(not err, tostring(err))
    assert(out.success == true, tostring(out.error))
    for _, h in ipairs(handles) do
        local settled, serr = h.call("settle", {})
        assert(not serr and settled.done == true, tostring(serr))
    end
end

local function exec(statement: string, params: { unknown })
    local db = assert(sql.get("app:db"))
    local _, err = db:execute(statement, params)
    db:release()
    assert(not err, tostring(err))
end

local function state(h: fixture.Handle, product_id: string): string
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT state FROM kickside_pim_product WHERE catalog_id = $1 AND product_id = $2", { h.id, product_id }))
    db:release()
    return tostring(rows[1].state)
end

local function item_table(h: fixture.Handle): string
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT item_table FROM kickside_pim_catalog WHERE catalog_id = $1", { h.id }))
    db:release()
    return tostring(rows[1].item_table)
end

local function value_rows(h: fixture.Handle, sku: string): integer
    local page = h.call("list_history", { product = { sku = sku }, limit = 50 }) :: types.HistoryResult
    local n = 0
    for _, e in ipairs(page.entries) do if e.attribute_id ~= nil then n = n + 1 end end
    return n
end

local function define()
    test.describe("catalog configuration", function()
        test.it("keeps each catalog's schema its own, down to its generated tables", function()
            local a, b = apparel(), tools()
            local sa, sb = schema(a), schema(b)
            test.not_nil(sa.attributes["wear.fabric"])
            test.eq(sa.attributes["wear.fabric"].width, "half", "the schema view resolves each attribute's width")
            test.eq(sb.attributes["spec.torque"].width, "third")
            test.not_nil(sa.attributes["config.zone"])
            test.is_nil(sa.attributes["spec.torque"])
            test.not_nil(sb.attributes["spec.torque"])
            test.is_nil(sb.attributes["wear.fabric"])
            test.is_nil(sb.attributes["config.zone"])
            test.eq(sa.dimensions[1].name, "locale")
            test.eq(sb.dimensions[1].name, "region")
            test.not_nil(sa.families.garment)
            test.is_nil(sa.families.tool)
            test.not_nil(sb.families.tool)
            test.is_false(item_table(a) == item_table(b))
        end)

        test.it("confines writes and reads to the schema of the addressed catalog", function()
            local a, b = apparel(), tools()
            test.eq(apply_one(a, "SHARED", "garment", "wear.fabric", "wool", { locale = "en" }).outcome, "created")
            test.eq(apply_one(b, "SHARED", "tool", "spec.torque", 40, { region = "eu" }).outcome, "created")
            test.eq(apply_one(a, "SHARED", nil, "spec.torque", 41, { region = "eu" }).outcome, "invalid")
            test.eq(apply_one(b, "SHARED", nil, "wear.fabric", "silk", { locale = "en" }).outcome, "invalid")
            test.eq(apply_one(a, "OTHER", "tool", "wear.sku_note", "x").outcome, "invalid")

            local found_a = a.call("query", { where = { field = "wear.fabric", ctx = { locale = "en" }, op = "eq", value = "wool" } }) :: types.QueryResult
            test.eq(#found_a.items, 1)
            test.eq(found_a.items[1].family, "garment")
            local _, foreign = b.call("query", { where = { field = "wear.fabric", ctx = { locale = "en" }, op = "eq", value = "wool" } })
            test.eq((foreign :: error):kind(), errors.INVALID)
            local found_b = b.call("query", { where = { field = "spec.torque", ctx = { region = "eu" }, op = "eq", value = 40 } }) :: types.QueryResult
            test.eq(#found_b.items, 1)
            test.eq(found_b.items[1].family, "tool")
            test.is_false(found_a.items[1].product_id == found_b.items[1].product_id)
        end)

        test.it("leaves a catalog untouched when another changes its schema, plugins or policy", function()
            local a, b = apparel(), tools()
            local before = schema(b)
            apply_one(b, "KEEP", "tool", "spec.sku_note", "n")
            declared(a, {
                aspects = { { namespace = "wear", attributes = { { code = "season", type = "kickside.pim.types:text" } } } },
                plugins = {  },
                policy = { audit = false, trash_days = 7 },
            })
            test.not_nil(schema(a).attributes["wear.season"])
            local after = schema(b)
            test.eq(after.schema_generation, before.schema_generation)
            test.is_nil(after.attributes["wear.season"])
            test.is_nil(after.declaration.policy)
            test.is_nil(after.declaration.plugins)
            test.is_false(fixture.plugins(b)[PLUGIN].active)
            test.is_nil(fixture.plugins(b)[PLUGIN].config)
        end)

        test.it("keeps validated configuration stable until the catalog configures it again", function()
            local a, b = apparel(), tools()
            local pa, pb = assert(fixture.plugins(a)[PLUGIN]), assert(fixture.plugins(b)[PLUGIN])
            test.is_true(pa.active)
            test.eq(pa.config.location, "EU-1")
            test.eq(pa.config.zone_limit, 10)
            test.is_false(pb.active)
            test.is_nil(pb.config)
            set_default("location", "HQ-2")
            set_default("zone_limit", 20)
            local stable = assert(fixture.plugins(a)[PLUGIN])
            local _, err = a.call("configure_plugin", { plugin = PLUGIN, config = { location = "EU-1" } })
            local configured = assert(fixture.plugins(a)[PLUGIN])
            set_default("location", "HQ")
            set_default("zone_limit", 10)
            test.is_nil(err, tostring(err))
            test.eq(stable.config.zone_limit, 10)
            test.eq(configured.config.location, "EU-1")
            test.eq(configured.config.zone_limit, 20)
            test.is_nil(fixture.plugins(b)[PLUGIN].config)
        end)

        test.it("applies a catalog's audit setting over the app default to that catalog alone", function()
            local a, b = apparel(), tools()
            apply_one(a, "AUDITED", "garment", "wear.sku_note", "one")
            apply_one(b, "AUDITED", "tool", "spec.sku_note", "one")
            test.eq(value_rows(a, "AUDITED"), 0)
            test.eq(value_rows(b, "AUDITED"), 1)
        end)

        test.it("applies a catalog's trash window over the app default to that catalog alone", function()
            local a, b = apparel(), tools()
            apply_one(a, "OLD", "garment", "wear.sku_note", "x")
            apply_one(b, "OLD", "tool", "spec.sku_note", "x")
            local function trash(h: fixture.Handle): string
                local got = h.call("get", { product = { sku = "OLD" } }) :: types.GetResult
                local out = h.call("apply", { items = { { product = { id = got.product.product_id }, expect_version = got.product.version, delete = true } } }) :: types.ApplyResult
                assert(out.applied == true)
                return got.product.product_id
            end
            local ia, ib = trash(a), trash(b)
            local aged = clock.ago(20)
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { aged, a.id, ia })
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { aged, b.id, ib })
            pass({ a, b })
            test.eq(state(a, ia), "trashed")
            test.eq(state(b, ib), "purged")
        end)
    end)
end

return { run = test.run_cases(define) }
