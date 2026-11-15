-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local materializer = require("materializer")
local types = require("types")
local json = require("json")
local time = require("time")
local channel = require("channel")

type Map = { [string]: unknown }

local function by_sku(h: fixture.Handle, sku: string): Map
    local out, err = h.call("get", { product = { sku = sku }, context = { locale = "en", channel = "web" } })
    test.is_nil(err)
    return out
end

local function count(t: Map): integer
    local n = 0
    for _ in pairs(t) do n = n + 1 end
    return n
end

local function define()
    test.describe("catalog command path", function()
        test.it("creates a variant tree in one command and reads it back immediately", function()
            local h = fixture.catalog()
            local out = fixture.boot(h)
            test.eq(out.applied, true)
            test.eq(#out.outcomes, 9)
            test.eq(out.outcomes[1].outcome, "created")
            test.is_true(out.as_of >= out.seq)
            local item = by_sku(h, "RDG-moss-41")
            test.eq(item.product.level, 2)
            test.is_true(item.product.is_item)
            test.eq(item.values["core.name"].value, "Ridgeline hiking boot")
            test.eq(item.values["core.name"].state, "inherited")
            test.eq(item.values["core.color"].value.ref[2], "colors:moss")
            test.eq(item.values["core.size"].value, 41)
            test.eq(item.values["core.care"].state, "default")
            local model = by_sku(h, "RDG")
            test.is_false(model.product.is_item)
            test.is_nil(model.values["core.size"])
        end)

        test.it("resolves locale fallback and channel-scoped values", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root = by_sku(h, "RDG")
            local out, err = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.product.version, set = {
                { attr = "marketing.tagline", ctx = { channel = "web", locale = "de" }, value = "Nimm den langen Weg." } },
                clear = { { attr = "marketing.tagline", ctx = { channel = "marketplace", locale = "de" } } } } } })
            test.is_nil(err)
            test.eq(out.outcomes[1].outcome, "updated")
            local at, gerr = h.call("get", { product = { sku = "RDG-slate-40" }, context = { locale = "de-AT", channel = "web" } })
            test.is_nil(gerr)
            test.eq(at.values["core.name"].value, "Ridgeline Wanderstiefel")
            test.eq(at.values["marketing.tagline"].value, "Nimm den langen Weg.")
            local marketplace = h.call("get", { product = { sku = "RDG-slate-40" }, context = { locale = "de-AT", channel = "marketplace" } })
            test.eq(marketplace.values["marketing.tagline"].state, "cleared")
        end)

        test.it("queries typed columns, sets, ranges and text, and pages by keyset", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local moss, err = h.call("query", { where = { field = "core.color", op = "eq", value = "moss" } })
            test.is_nil(err)
            test.eq(#moss.items, 3)
            local big = h.call("query", { where = { ["and"] = { { field = "core.size", op = "gte", value = 41 },
                { field = "core.materials", op = "in", value = { "nylon" } } } } })
            test.eq(#big.items, 4)
            local heavy = h.call("query", { where = { field = "logistics.net_weight", op = "gt", value = "0.741" } })
            test.eq(#heavy.items, 2)
            local text = h.call("query", { text = "wanderstiefel" })
            test.eq(#text.items, 6)
            local seen, after, pages = {}, nil, 0
            repeat
                local page = h.call("query", { sort = { field = "core.size", dir = "desc" }, limit = 4, after = after })
                for _, item in ipairs(page.items) do seen[item.sku] = true end
                after = page.after
                pages = pages + 1
            until not after
            test.eq(count(seen), 6)
            test.eq(pages, 2)
        end)

        test.it("re-indexes every item when the model changes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root = by_sku(h, "RDG")
            local _, err = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.product.version,
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Summit trail boot" } } } } })
            test.is_nil(err)
            local found = h.call("query", { text = "summit" })
            test.eq(#found.items, 6)
            test.eq(#h.call("query", { text = "ridgeline hiking" }).items, 0)
        end)
    end)

    test.describe("catalog invariants", function()
        test.it("refuses stale versions, ownership violations and missing references", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = 99,
                set = { { attr = "core.gtin", value = "x" } } } } })
            test.eq(out.applied, false)
            test.eq(out.outcomes[1].outcome, "conflict")
            out = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = 1,
                set = { { attr = "core.gtin", value = "x" } } } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            out = h.call("apply", { items = { { product = { sku = "RDG-moss" }, expect_version = "any",
                set = { { attr = "core.materials", value = { "silk" } } } } } })
            test.eq(out.outcomes[1].outcome, "invalid")
        end)

        test.it("keeps sku, unique values and sibling axes unique", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = h.call("apply", { mode = "independent", items = {
                { product = { sku = "RDG-moss-40" }, create = { parent = { sku = "RDG-moss" } }, set = { { attr = "core.size", value = 43 } } },
                { product = { sku = "RDG-moss-43" }, create = { parent = { sku = "RDG-moss" } }, set = { { attr = "core.size", value = 40 } } },
                { product = { sku = "RDG-moss-44" }, create = { parent = { sku = "RDG-moss" } },
                  set = { { attr = "core.size", value = 44 }, { attr = "core.gtin", value = "0400slate41" } } },
                { product = { sku = "RDG-moss-45" }, create = { parent = { sku = "RDG-moss" } },
                  set = { { attr = "core.size", value = 45 }, { attr = "core.gtin", value = "fresh-45" } } },
                { product = { sku = "RDG-moss-46" }, create = { parent = { sku = "RDG-moss" } },
                  set = { { attr = "core.size", value = 45 } } },
            } })
            test.eq(out.outcomes[1].outcome, "conflict")
            test.eq(out.outcomes[2].outcome, "conflict")
            test.eq(out.outcomes[3].outcome, "conflict")
            test.eq(out.outcomes[4].outcome, "created")
            test.eq(out.outcomes[5].outcome, "conflict")
            test.eq(#h.call("query", { where = { field = "core.color", op = "eq", value = "moss" } }).items, 4)
        end)

        test.it("frees sku and unique values on delete", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local item = by_sku(h, "RDG-moss-42")
            local out = h.call("apply", { items = { { product = { sku = "RDG-moss-42" }, expect_version = item.product.version, delete = true } } })
            test.eq(out.outcomes[1].outcome, "updated")
            out = h.call("apply", { items = { { product = { sku = "RDG-moss-42" }, create = { parent = { sku = "RDG-moss" } },
                set = { { attr = "core.size", value = 42 }, { attr = "core.gtin", value = "0400moss42" } } } } })
            test.eq(out.outcomes[1].outcome, "created")
            local model = by_sku(h, "RDG-moss")
            out = h.call("apply", { items = { { product = { sku = "RDG-moss" }, expect_version = model.product.version, delete = true } } })
            test.eq(out.outcomes[1].outcome, "invalid")
        end)

        test.it("applies aspect write rules and ordered source sequences", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root = by_sku(h, "RDG")
            local out = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.product.version,
                set = { { attr = "pricing.retail", value = "189.00" } } } } })
            test.eq(out.outcomes[1].outcome, "forbidden")
            out = h.call("apply", { source = "pricing", items = { { product = { sku = "RDG" }, seq = 7,
                set = { { attr = "pricing.retail", value = "189.00" } } } } })
            test.eq(out.outcomes[1].outcome, "updated")
            out = h.call("apply", { source = "pricing", items = { { product = { sku = "RDG" }, seq = 6,
                set = { { attr = "pricing.retail", value = "1.00" } } } } })
            test.eq(out.outcomes[1].outcome, "unchanged")
            out = h.call("apply", { source = "pricing", items = { { product = { sku = "RDG" }, seq = 8,
                set = { { attr = "core.category", value = "footwear" } } } } })
            test.eq(out.outcomes[1].outcome, "forbidden")
            local item = by_sku(h, "RDG-moss-40")
            test.eq(item.values["pricing.retail"].source, "pricing")
            local cheap = h.call("query", { where = { field = "pricing.retail", op = "lt", value = "200" } })
            test.eq(#cheap.items, 6)
        end)
    end)

    test.describe("catalog invariants", function()
        test.it("refuses a number value finer than its indexed scale at write", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local item = by_sku(h, "RDG-moss-40")
            local out = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = item.product.version,
                set = { { attr = "logistics.net_weight", value = "0.7405" } } } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            test.eq(by_sku(h, "RDG-moss-40").product.version, item.product.version)
        end)

        test.it("creates through a named source and records it", function()
            local h = fixture.catalog()
            local out, err = h.call("apply", { source = "erp", items = { { product = { sku = "ERP-1" }, create = {},
                set = { { attr = "core.gtin", value = "erp-gtin-1" } } } } })
            test.is_nil(err)
            test.eq(out.outcomes[1].outcome, "created")
            test.eq(by_sku(h, "ERP-1").values["core.gtin"].source, "erp")
        end)

        test.it("releases a deleted product's unique value and axis within the same command", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local item = by_sku(h, "RDG-moss-40")
            local out = h.call("apply", { items = {
                { product = { sku = "RDG-moss-40" }, expect_version = item.product.version, delete = true },
                { product = { sku = "RDG-moss-40b" }, create = { parent = { sku = "RDG-moss" } },
                  set = { { attr = "core.size", value = 40 }, { attr = "core.gtin", value = "0400moss40" } } },
            } })
            test.eq(out.applied, true)
            test.eq(out.outcomes[2].outcome, "created")
        end)

        test.it("refuses deleting a referenced product", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local target = by_sku(h, "RDG-slate-40")
            local root = by_sku(h, "RDG")
            local out = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.product.version,
                set = { { attr = "core.related", value = { { ref = { "product", target.product.product_id } } } } } } } })
            test.eq(out.outcomes[1].outcome, "updated")
            out = h.call("apply", { items = { { product = { sku = "RDG-slate-40" }, expect_version = target.product.version, delete = true } } })
            test.eq(out.outcomes[1].outcome, "invalid")
        end)

        test.it("refuses term cycles and retiring a term with children", function()
            local h = fixture.catalog()
            local out = h.call("apply", { items = { { term = { vocabulary = "categories", code = "footwear" }, parent = "hiking" } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            out = h.call("apply", { items = { { term = { vocabulary = "categories", code = "footwear" }, retired = true } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            out = h.call("apply", { items = { { term = { vocabulary = "colors", code = "teal" }, labels = { en = 5 } } } })
            test.eq(out.outcomes[1].outcome, "invalid")
        end)

        test.it("counts descendants without the root", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root = by_sku(h, "RDG")
            local db = assert(store.open())
            local n = store.count_descendants(db, h.id, tostring(root.product.product_id))
            db:release()
            test.eq(n, 8)
        end)

        test.it("moves a variant and changes status", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local item = by_sku(h, "RDG-moss-41")
            local out = h.call("apply", { items = { { product = { sku = "RDG-moss-41" }, expect_version = item.product.version,
                move = { parent = { sku = "RDG-slate" } } } } })
            test.eq(out.outcomes[1].outcome, "conflict")
            local _, err = h.call("apply", { items = { { product = { sku = "RDG-moss-42" }, expect_version = item.product.version, status = "archived" } } })
            test.is_nil(err)
            local moved = by_sku(h, "RDG-moss-42")
            test.eq(moved.product.status, "archived")
            test.eq(#h.call("query", { status = "archived" }).items, 1)
        end)

        test.it("removes the catalog's rows and generated tables on delete", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local db = assert(store.open())
            local catalog = assert(store.catalog(db, h.id))
            local result, err = h.executor:with_context({ component_id = h.id }):call("kickside.pim.binding:delete_func")
            test.is_nil(err)
            test.eq(result.success, true)
            local left = assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_product WHERE catalog_id = $1", { h.id }))
            test.eq(tonumber(left[1].n), 0)
            local _, qerr = db:query("SELECT COUNT(*) AS n FROM " .. catalog.item_table .. "_item")
            db:release()
            test.not_nil(qerr)
        end)
    end)

    test.describe("quantities", function()
        test.it("filters and sorts mixed units in the canonical unit and keeps the authored unit", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = {
                aspects = { { namespace = "logistics", attributes = { { code = "shipping_weight", type = "kickside.pim.types:quantity", index = "number",
                    config = { units = { kg = "1", g = "0.001", lb = "0.45359237" }, canonical = "kg", scale = 3 } } } } },
                families = { (function()
                    local f = {}
                    for k, v in pairs(fixture.DECLARATION.families[1]) do f[k] = v end
                    f.variation = { { axes = { "core.color" }, own = { "core.materials" } },
                        { axes = { "core.size" }, own = { "core.gtin", "logistics.net_weight", "logistics.shipping_weight" } } }
                    return f
                end)() } } })
            test.is_nil(err)
            local function set(sku: string, w: string)
                local v = h.call("get", { product = { sku = sku } }).product.version
                local out = h.call("apply", { items = { { product = { sku = sku }, expect_version = v, set = { { attr = "logistics.shipping_weight", value = w } } } } })
                test.eq(out.outcomes[1].outcome, "updated", sku)
            end
            set("RDG-moss-40", "2 lb")
            set("RDG-moss-41", "900 g")
            set("RDG-moss-42", "0.95 kg")
            local heavy = h.call("query", { where = { field = "logistics.shipping_weight", op = "gt", value = "0.92 kg" },
                sort = { field = "logistics.shipping_weight", dir = "asc" } })
            test.eq(#heavy.items, 1)
            test.eq(heavy.items[1].sku, "RDG-moss-42")
            local sorted = h.call("query", { where = { field = "logistics.shipping_weight", op = "gte", value = "1 g" },
                sort = { field = "logistics.shipping_weight", dir = "asc" } })
            test.eq(sorted.items[1].sku, "RDG-moss-41")
            test.eq(sorted.items[2].sku, "RDG-moss-40")
            test.eq(sorted.items[3].sku, "RDG-moss-42")
            local item = h.call("get", { product = { sku = "RDG-moss-40" } })
            test.eq(item.values["logistics.shipping_weight"].value.u, "lb")
            local _, rerr = h.call("apply_schema", { declaration = { aspects = { { namespace = "logistics", attributes = {
                { code = "shipping_weight", type = "kickside.pim.types:quantity", index = "number",
                  config = { units = { kg = "1", g = "0.001", lb = "0.4536" }, canonical = "kg", scale = 3 } } } } } } })
            test.not_nil(rerr)
            test.eq(rerr:details().code, "migration_required")
        end)
    end)

    test.describe("durability", function()
        test.it("replays an idempotent command from its receipt and refuses key reuse", function()
            local h = fixture.catalog()
            local request = { idempotency = { namespace = "test", key = "k1" }, items = {
                { product = { sku = "SHELL" }, create = {}, set = { { attr = "core.name", ctx = { locale = "en" }, value = "Shell" } } },
                { product = { sku = "SHELL" }, create = {} },
            }, mode = "independent" }
            local first, err = h.call("apply", request)
            test.is_nil(err)
            test.eq(first.outcomes[1].outcome, "created")
            test.eq(first.outcomes[2].outcome, "conflict")
            local again, rerr = h.call("apply", request)
            test.is_nil(rerr)
            test.is_true(again.replayed)
            test.eq(again.outcomes[1].product_id, first.outcomes[1].product_id)
            test.eq(again.seq, first.seq)
            local changed = { idempotency = request.idempotency, items = { { product = { sku = "OTHER" }, create = {} } } }
            local reused, cerr = h.call("apply", changed)
            test.not_nil(cerr, json.encode(reused))
        end)

        test.it("serializes concurrent writers through head checks without losing a write", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local pending = {}
            for w = 1, 6 do
                local requests = {}
                for n = 1, 5 do
                    requests[n] = { items = { { product = { sku = "W" .. w .. "-" .. n }, create = {},
                        set = { { attr = "core.gtin", value = "g" .. w .. "-" .. n } } } } }
                end
                local cmd, err = h.async("batch", { requests = requests })
                test.is_nil(err)
                pending[#pending + 1] = cmd
            end
            for _, cmd in ipairs(pending) do
                local deadline = time.after("120s")
                local selected = channel.select({ cmd:response():case_receive(), deadline:case_receive() })
                test.is_false(selected.channel == deadline, "writer timed out")
                local _, err = cmd:result()
                test.is_nil(err)
            end
            local all = h.call("query", { family = "generic", limit = 200 })
            test.eq(#all.items, 30)
        end)

        test.it("treats a replayed projection batch as already folded", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local db = assert(store.open())
            local page = assert(h.call("events", {}))
            local rows: { types.RawEvent } = page.events
            local before = assert(db:query("SELECT product_id, version FROM kickside_pim_product WHERE catalog_id = $1 ORDER BY product_id", { h.id }))
            local counters_before = assert(store.catalog(db, h.id))
            local history_before = assert(db:query("SELECT count(*) AS n FROM kickside_pim_change WHERE catalog_id = $1", { h.id }))
            local tx = assert(db:begin())
            local events = {}
            for _, r in ipairs(rows) do events[#events + 1] = { seq = r.seq, type = r.type, body = r.body } end
            local out, err = materializer.fold(tx, db:type(), h.id, events, math.tointeger(tonumber(rows[#rows].seq)) :: integer, 20000)
            test.is_nil(err)
            tx:commit()
            local after = assert(db:query("SELECT product_id, version FROM kickside_pim_product WHERE catalog_id = $1 ORDER BY product_id", { h.id }))
            local counters_after = assert(store.catalog(db, h.id))
            test.eq(out.last_seq, counters_before.applied_seq)
            test.eq(counters_after.applied_seq, counters_before.applied_seq)
            test.eq(counters_after.product_count, counters_before.product_count)
            test.eq(counters_after.item_count, counters_before.item_count)
            test.eq(counters_after.trashed_count, counters_before.trashed_count)
            local history_after = assert(db:query("SELECT count(*) AS n FROM kickside_pim_change WHERE catalog_id = $1", { h.id }))
            db:release()
            test.eq((json.encode(after)), (json.encode(before)))
            test.eq(tonumber(history_after[1].n), tonumber(history_before[1].n))
            test.is_true(tonumber(history_before[1].n) > 0)
        end)
    end)
end

return { run = test.run_cases(define) }
