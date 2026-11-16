-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Link kinds (spec 3.3): a plugin binds kickside.pim:link_target for the
-- entities products point at; link attributes resolve their targets through
-- the binding once per kind per command, index like any attribute, embed
-- labels into release snapshots and degrade when a target disappears.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")
local sql = require("sql")
local json = require("json")

type Map = { [string]: unknown }

local LINK = "kickside.pim.types:link"

local function exec(statement: string, params: { unknown })
    local db = assert(sql.get("app:db"))
    local _, err = db:execute(statement, params)
    db:release()
    assert(not err, tostring(err))
end

local function reset_locations(rows: { { string } })
    exec("CREATE TABLE IF NOT EXISTS pim_test_locations (id TEXT PRIMARY KEY, label TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)", {})
    exec("CREATE TABLE IF NOT EXISTS pim_test_link_calls (method TEXT NOT NULL, catalog_id TEXT NOT NULL, ids INTEGER NOT NULL)", {})
    exec("DELETE FROM pim_test_locations", {})
    for _, r in ipairs(rows) do exec("INSERT INTO pim_test_locations (id, label, hidden) VALUES ($1, $2, $3)", { r[1], r[2], r[3] == "hidden" and 1 or 0 }) end
end

local function calls(catalog_id: string, method: string): { { ids: integer } }
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT ids FROM pim_test_link_calls WHERE catalog_id = $1 AND method = $2", { catalog_id, method })
    db:release()
    assert(not err, tostring(err))
    return rows :: { { ids: integer } }
end

local SUPPLY = { aspects = { { namespace = "supply", attributes = {
    { code = "warehouse", type = LINK, index = "key", config = { target = "app.location" } },
    { code = "stops", type = LINK, cardinality = "set", config = { target = "app.location" } },
} } }, families = { { code = "site", aspects = { "supply" }, requirements = {
    { id = "web", require = { "supply.warehouse" } }, { id = "marketplace_de", require = { "supply.warehouse" } } } } } }

local function linked(): fixture.Handle
    local h = fixture.catalog()
    local _, err = h.call("apply_schema", { declaration = SUPPLY })
    assert(not err, tostring(err))
    return h
end

local function loc(id: string): Map return { ref = { "app.location", id } } end

local function define()
    test.describe("link kinds", function()
        test.it("compiles a link attribute only for a bound kind with a declared target", function()
            local h = fixture.catalog()
            for _, bad in ipairs({
                { code = "w", type = LINK, index = "key" },
                { code = "w", type = LINK, config = { target = "app.nowhere" } },
                { code = "w", type = LINK, config = { target = "product" } },
                { code = "w", type = LINK, config = { target = "term" } },
            } :: { Map }) do
                local _, err = h.call("plan_schema", { declaration = { aspects = { { namespace = "supply", attributes = { bad } } } } })
                test.not_nil(err, json.encode(bad))
            end
            local _, ok = h.call("apply_schema", { declaration = SUPPLY })
            test.is_nil(ok)
            local view = h.call("get_schema", {}) :: types.SchemaView
            test.eq(assert(view.attributes["supply.warehouse"]).form, "ref")
            test.eq(assert(view.attributes["supply.warehouse"]).index, "key")
        end)

        test.it("accepts ids the binding resolves and rejects the rest with invalid_reference, one resolve per kind per command", function()
            reset_locations({ { "wh1", "Warehouse 1" }, { "wh2", "Warehouse 2" }, { "ghost", "Hidden", "hidden" } })
            local h = linked()
            local out = h.call("apply", { mode = "independent", items = {
                { product = { sku = "L-1" }, create = { family = "site" }, set = { { attr = "supply.warehouse", value = loc("wh1") }, { attr = "supply.stops", value = { loc("wh1"), loc("wh2") } } } },
                { product = { sku = "L-2" }, create = { family = "site" }, set = { { attr = "supply.warehouse", value = loc("nope") } } },
                { product = { sku = "L-3" }, create = { family = "site" }, set = { { attr = "supply.stops", value = { loc("wh2"), loc("ghost") } } } },
            } }) :: types.ApplyResult
            test.eq(out.outcomes[1].outcome, "created", json.encode(out))
            test.eq(out.outcomes[2].outcome, "invalid")
            test.eq(assert(out.outcomes[2].findings)[1].code, "invalid_reference")
            test.eq(assert(out.outcomes[2].findings)[1].attribute, "supply.warehouse")
            test.eq(out.outcomes[3].outcome, "invalid")
            local resolves = calls(h.id, "resolve")
            test.eq(#resolves, 1, json.encode(resolves))
            test.eq(resolves[1].ids, 4)
            local got = assert(steps.get(h, "L-1"))
            test.eq((got.values["supply.warehouse"].value :: Map).ref[2], "wh1")
        end)

        test.it("filters by a key-indexed link and lists links by kind and target", function()
            reset_locations({ { "wh1", "Warehouse 1" }, { "wh2", "Warehouse 2" } })
            local h = linked()
            h.call("apply", { items = {
                { product = { sku = "L-1" }, create = { family = "site" }, set = { { attr = "supply.warehouse", value = loc("wh1") }, { attr = "supply.stops", value = { loc("wh2") } } } },
                { product = { sku = "L-2" }, create = { family = "site" }, set = { { attr = "supply.warehouse", value = loc("wh2") } } },
            } })
            local found = h.call("query", { where = { field = "supply.warehouse", op = "eq", value = loc("wh1") } }) :: { items: { Map } }
            test.eq(#found.items, 1)
            test.eq(found.items[1].sku, "L-1")
            local links = h.call("list_links", { kind = "app.location", target = "wh2" }) :: types.LinksResult
            local skus: { string } = {}
            for _, row in ipairs(links.items) do skus[#skus + 1] = row.sku .. "/" .. tostring(row.attribute) end
            table.sort(skus)
            test.eq(table.concat(skus, ","), "L-1/supply.stops,L-2/supply.warehouse")
        end)

        test.it("answers unavailable and applies nothing when the binding fails", function()
            local h = fixture.catalog()
            test.is_nil((select(2, h.call("apply_schema", { declaration = { aspects = { { namespace = "supply", attributes = {
                { code = "site", type = LINK, config = { target = "app.offline" } } } } } } }))))
            local _, err = h.call("apply", { items = { { product = { sku = "L-1" }, create = {}, set = { { attr = "supply.site", value = { ref = { "app.offline", "x" } } } } } } })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.UNAVAILABLE)
            test.is_true((err :: error):retryable())
            test.eq(err:details().code, "location_offline")
            test.is_nil((steps.get(h, "L-1")))
        end)

        test.it("embeds described targets into release snapshots and fails the release when describe is unavailable", function()
            reset_locations({ { "wh1", "Warehouse 1" }, { "wh2", "Warehouse 2" } })
            local h = linked()
            h.call("apply", { items = { { product = { sku = "L-1" }, create = { family = "site" }, set = { { attr = "supply.warehouse", value = loc("wh1") }, { attr = "supply.stops", value = { loc("wh2") } } } } } })
            exec("DELETE FROM pim_test_locations WHERE id = 'wh2'", {})
            local released = h.call("release", { items = { { product = { sku = "L-1" }, expect_version = 1 } } }) :: types.ApplyResult
            test.eq(released.outcomes[1].outcome, "released", json.encode(released))
            local release = h.call("get_release", { release_id = released.outcomes[1].release_id }) :: types.GetReleaseResult
            local links = assert((release.release.snapshot :: Map).links) :: { [string]: Map }
            test.eq(assert(links["app.location:wh1"]).label, "Warehouse 1")
            test.eq((assert(links["app.location:wh1"]).data :: Map).code, "WH1")
            test.is_nil(links["app.location:wh2"])
            test.eq(#calls(h.id, "describe"), 1)

            reset_locations({ { "boom", "Describe outage" } })
            h.call("apply", { items = { { product = { sku = "L-2" }, create = { family = "site" }, set = { { attr = "supply.warehouse", value = loc("boom") } } } } })
            local _, err = h.call("release", { items = { { product = { sku = "L-2" }, expect_version = 1 } } })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.UNAVAILABLE)
            test.is_nil((h.call("get_release", { release_id = released.outcomes[1].release_id }) :: types.GetReleaseResult).release.snapshot.links["app.location:boom"])
        end)

        test.it("keeps a link whose target disappeared and restores the product that holds it", function()
            reset_locations({ { "wh1", "Warehouse 1" } })
            local h = linked()
            h.call("apply", { items = { { product = { sku = "L-1" }, create = { family = "site" }, set = { { attr = "supply.warehouse", value = loc("wh1") } } } } })
            exec("DELETE FROM pim_test_locations WHERE id = 'wh1'", {})
            local trashed = h.call("apply", { items = { { product = { sku = "L-1" }, expect_version = 1, delete = true } } }) :: types.ApplyResult
            test.is_true(trashed.outcomes[1].trashed == true, json.encode(trashed))
            local restored = h.call("apply", { items = { { product = { id = trashed.outcomes[1].product_id }, expect_version = "any", restore = true } } }) :: types.ApplyResult
            test.is_true(restored.outcomes[1].restored == true, json.encode(restored))
            test.eq((assert(steps.get(h, "L-1")).values["supply.warehouse"].value :: Map).ref[2], "wh1")
            local links = h.call("list_links", { kind = "app.location", target = "wh1" }) :: types.LinksResult
            test.eq(links.items[1].sku, "L-1")
        end)
    end)
end

return { run = test.run_cases(define) }
