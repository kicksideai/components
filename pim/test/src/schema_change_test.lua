-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local json = require("json")

type Map = { [string]: unknown }

local catalog_fixture = require("catalog_fixture")
local kind = catalog_fixture.kind

local function define()
    test.describe("schema changes", function()
        test.it("renames two attributes in a chain within one apply", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local related, care = catalog_fixture.catalog(h).compiled.attributes["core.related"].id, catalog_fixture.catalog(h).compiled.attributes["core.care"].id
            for _ = 1, 3 do
                local _, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                    { id = related, code = "links", type = "kickside.pim.types:reference", cardinality = "set" },
                    { id = care, code = "related", type = "kickside.pim.types:text", default = "Clean with a damp cloth." } } } } } })
                test.is_nil(err)
                local _, back = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                    { id = care, code = "care", type = "kickside.pim.types:text", default = "Clean with a damp cloth." },
                    { id = related, code = "related", type = "kickside.pim.types:reference", cardinality = "set" } } } } } })
                test.is_nil(back)
            end
            local item = h.call("get", { product = { sku = "RDG-moss-40" } })
            test.eq(item.values["core.care"].value, "Clean with a damp cloth.")
        end)

        test.it("accepts empty lists in a declaration", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = { channels = { { id = "plain", requirements = {}, families = {} } }, scopes = {} } })
            test.is_nil(err)
        end)

        test.it("refuses a malformed declaration as invalid", function()
            local h = fixture.catalog()
            for _, declaration in ipairs({
                { families = { { code = "x", variation = 5 } } },
                { dimensions = { { name = "market", members = "eu" } } },
                { aspects = { { namespace = "core", attributes = { { code = "x", type = "kickside.pim.types:text", scope = "locale" } } } } },
                { plugins = { ["app:shelf_plugin"] = "on" } },
                { scopes = "app:stock_scope" },
            } :: { { [string]: unknown } }) do
                local _, err = h.call("apply_schema", { declaration = declaration })
                test.not_nil(err)
                test.eq((err :: error):kind(), errors.INVALID)
            end
        end)

        test.it("keeps omitted entries, persists incoming order and appends nothing for an identical declaration", function()
            local h = fixture.catalog()
            local request = { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Clean with a damp cloth." } } } } } }
            local out, err = h.call("apply_schema", request)
            test.is_nil(err)
            test.eq(out.class, "cosmetic")
            test.eq(out.generation, 2)
            local current = h.call("get_schema", {})
            test.eq(current.declaration.aspects[1].attributes[1].code, "care")
            test.eq(#current.declaration.aspects[1].attributes, #fixture.DECLARATION.aspects[1].attributes)
            out = h.call("apply_schema", request)
            test.eq(out.class, "unchanged")
            test.eq(out.generation, 2)
            out = h.call("apply_schema", { declaration = fixture.DECLARATION })
            test.eq(out.class, "cosmetic")
            test.eq(out.generation, 3)
            out = h.call("apply_schema", { declaration = fixture.DECLARATION })
            test.eq(out.class, "unchanged")
            test.eq(out.generation, 3)
        end)

        test.it("indexes populated values and re-resolves them after a default change", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Clean with a damp cloth.", index = "key" },
                { code = "season", type = "kickside.pim.types:text", index = "key" } } } } } })
            test.is_nil(err)
            test.eq(out.class, "semantic")
            steps.rebuilt(h)
            local care = h.call("query", { where = { field = "core.care", op = "eq", value = "Clean with a damp cloth." } })
            test.eq(#care.items, 6)
            h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Hand wash only.", index = "key" } } } } } })
            steps.rebuilt(h)
            test.eq(#h.call("query", { where = { field = "core.care", op = "eq", value = "Hand wash only." } }).items, 6)
            test.eq(#h.call("query", { where = { field = "core.care", op = "eq", value = "Clean with a damp cloth." } }).items, 0)
        end)

        test.it("renames an attribute by id and keeps its values and index", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = catalog_fixture.catalog(h).compiled.attributes["core.gtin"].id
            local out, err = h.call("apply_schema", { declaration = {
                aspects = { { namespace = "core", attributes = { { id = id, code = "ean", type = "kickside.pim.types:identifier", unique = true, index = "key" } } } },
                families = { catalog_fixture.footwear_own({ "core.ean", "logistics.net_weight" }, "core.ean") } } })
            test.is_nil(err)
            test.eq(out.changes[1].what, "renamed from core.gtin")
            local item = h.call("get", { product = { sku = "RDG-moss-40" } })
            test.eq(item.values["core.ean"].value, "0400moss40")
            test.is_nil(item.values["core.gtin"])
            local history = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 50 })
            local named = false
            for _, e in ipairs(history.entries) do
                if e.attribute_id == id then
                    test.eq(e.attribute, "core.ean")
                    named = true
                end
            end
            test.is_true(named)
            test.eq(#h.call("query", { where = { field = "core.ean", op = "eq", value = "0400moss40" } }).items, 1)
        end)

        test.it("removes an attribute explicitly and compacts its values away", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = catalog_fixture.catalog(h).compiled.attributes["core.category"].id
            local out, err = h.call("apply_schema", { declaration = { remove = { attributes = { "core.category" } } } })
            test.is_nil(err)
            test.not_nil(out.changes[1], json.encode(out))
            test.eq(out.changes[1].what, "removed")
            steps.rebuilt(h)
            local root = h.call("get", { product = { sku = "RDG" } })
            test.is_nil(root.values["core.category"])
            local _, qerr = h.call("query", { where = { field = "core.category", op = "eq", value = "hiking" } })
            test.not_nil(qerr)
            local db = assert(store.open())
            local p = assert(store.product_by_sku(db, h.id, "RDG"))
            local usage = assert(store.usage(db, h.id))
            db:release()
            test.is_nil(p.document[tostring(id)])
            test.is_nil(usage[id])
            local _, rerr = h.call("apply_schema", { declaration = { remove = { attributes = { "core.category" } } } })
            test.not_nil(rerr)
        end)

        test.it("refuses reinterpreting populated values and allows it for unused attributes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "logistics", attributes = {
                { code = "net_weight", type = "kickside.pim.types:number", index = "number", config = { scale = 2 } } } } } } })
            test.not_nil(err)
            test.eq(err:details().code, "migration_required")
            local out, uerr = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "related", type = "kickside.pim.types:text" } } } } } })
            test.is_nil(uerr)
            test.eq(out.class, "additive")
        end)

        test.it("refuses changes that populated families and dimensions cannot absorb", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, ferr = h.call("apply_schema", { declaration = { remove = { families = { "footwear" } } } })
            test.not_nil(ferr)
            local _, aerr = h.call("apply_schema", { declaration = { families = { { code = "footwear",
                aspects = { "core", "marketing", "logistics", "pricing" }, variation = { { axes = { "core.color" } } } } } } })
            test.not_nil(aerr)
            local _, derr = h.call("apply_schema", { declaration = { dimensions = { { name = "channel", members = { "web" } } } } })
            test.not_nil(derr)
            local out, merr = h.call("apply_schema", { declaration = { dimensions = { { name = "channel", members = { "web", "marketplace", "b2b" } } } } })
            test.is_nil(merr)
            test.eq(out.class, "semantic")
        end)

        test.it("migrates an attribute to a new representation through explicit steps", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out, err = h.call("apply_schema", { declaration = {
                aspects = { { namespace = "logistics", attributes = { { code = "weight_g", type = "kickside.pim.types:integer", index = "number" } } } },
                families = { catalog_fixture.footwear_own({ "core.gtin", "logistics.net_weight", "logistics.weight_g" }) } } })
            test.is_nil(err)
            local page = h.call("query", { family = "footwear", limit = 50 })
            local items = {}
            for _, row in ipairs(page.items) do
                local item = h.call("get", { product = { id = row.product_id } })
                local w = item.values["logistics.net_weight"].value
                local grams = math.tointeger(w.m * (10 ^ (w.e + 3)) + 0.0)
                items[#items + 1] = { product = { id = row.product_id }, expect_version = row.version,
                    set = { { attr = "logistics.weight_g", value = grams } } }
            end
            local copied = h.call("apply", { items = items })
            test.eq(copied.applied, true)
            local id = catalog_fixture.catalog(h).compiled.attributes["logistics.weight_g"].id
            out, err = h.call("apply_schema", { declaration = {
                remove = { attributes = { "logistics.net_weight" } },
                families = { catalog_fixture.footwear_own({ "core.gtin", "logistics.weight_g" }, nil, "logistics.weight_g") } } })
            test.is_nil(err)
            out, err = h.call("apply_schema", { declaration = {
                aspects = { { namespace = "logistics", attributes = { { id = id, code = "net_weight", type = "kickside.pim.types:integer", index = "number" } } } },
                families = { catalog_fixture.footwear_own({ "core.gtin", "logistics.net_weight" }) } } })
            test.is_nil(err)
            steps.rebuilt(h)
            local heavy = h.call("query", { where = { field = "logistics.net_weight", op = "gt", value = 741 } })
            test.eq(#heavy.items, 2)
            test.eq(h.call("get", { product = { sku = "RDG-moss-40" } }).values["logistics.net_weight"].value, 740)
        end)

        test.it("refuses a malformed remove section", function()
            local h = fixture.catalog()
            for _, remove in ipairs({ { attributes = "core.care" }, { plugins = { 5 } }, { nothing = { "x" } } } :: { Map }) do
                local _, err = h.call("apply_schema", { declaration = { remove = remove } })
                test.eq(kind(err), errors.INVALID)
            end
            test.eq(h.call("get_schema", {}).schema_generation, 1)
        end)

        test.it("refuses a schema that sets a retention window out of bounds", function()
            local h = fixture.catalog()
            for _, policy in ipairs({ { trash_days = 0 }, { tombstone_days = -1 }, { audit_days = -1 }, { audit = "maybe" }, { trash_days = "30" } } :: { Map }) do
                local _, err = h.call("apply_schema", { declaration = { policy = policy } })
                test.eq(kind(err), errors.INVALID)
            end
        end)
    end)
end

return { run = test.run_cases(define) }
