-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local time = require("time")

local catalog_fixture = require("catalog_fixture")
local catalog = catalog_fixture.catalog
local kind = catalog_fixture.kind
local count_rows = catalog_fixture.count_rows

local function define()
    test.describe("catalog lifecycle", function()
        test.it("creates an own catalog for any authenticated caller", function()
            local h = fixture.catalog({ bare = true })
            local outsider = fixture.user(h)
            local out, err = outsider("create", { idempotency_key = "mine", title = "Mine" })
            test.is_nil(err)
            test.is_false(out.catalog_id == h.id)
        end)

        test.it("refuses empty and oversized idempotency keys", function()
            local h = fixture.catalog({ bare = true })
            for _, key in ipairs({ "", string.rep("k", 257) }) do
                local _, err = h.call("create", { idempotency_key = key, title = "T" })
                test.eq(kind(err), errors.INVALID)
            end
        end)

        test.it("gives two callers two catalogs for one key", function()
            local a = fixture.catalog({ bare = true })
            local other = fixture.user(a)
            local first = assert(other("create", { idempotency_key = "same", title = "A" }))
            local third = fixture.user(a)
            local second = assert(third("create", { idempotency_key = "same", title = "A" }))
            test.is_false(first.catalog_id == second.catalog_id)
        end)

        test.it("reports a failed first schema and accepts a valid retry", function()
            local h = fixture.catalog({ bare = true })
            local _, bad = h.call("create", { idempotency_key = "retry", title = "R", declaration = { families = { { code = "Bad Code" } } } })
            test.not_nil(bad)
            local out, err = h.call("create", { idempotency_key = "retry", title = "R", declaration = fixture.DECLARATION })
            test.is_nil(err)
            test.eq(out.generation, 1)
        end)

        test.it("lists nothing for a new caller", function()
            local h = fixture.catalog({ bare = true })
            local fresh = fixture.user(h)
            test.eq(#fresh("list", {}).catalogs, 0)
        end)

        test.it("deletes twice without complaint", function()
            local h = fixture.catalog()
            local ctx = h.executor:with_context({ component_id = h.id })
            test.eq(ctx:call("kickside.pim.binding:delete_func").success, true)
            test.eq(ctx:call("kickside.pim.binding:delete_func").success, true)
        end)

        test.it("deletes a catalog that never had a schema", function()
            local h = fixture.catalog({ bare = true })
            test.eq(h.executor:with_context({ component_id = h.id }):call("kickside.pim.binding:delete_func").success, true)
        end)

        test.it("leaves other catalogs alone on delete", function()
            local a, b = fixture.catalog(), fixture.catalog()
            fixture.boot(a)
            fixture.boot(b)
            a.executor:with_context({ component_id = a.id }):call("kickside.pim.binding:delete_func")
            test.eq(#b.call("query", {}).items, 6)
            test.eq(count_rows("SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id = $1", { a.id }), 0)
            test.is_true(count_rows("SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id = $1", { b.id }) > 0)
        end)
    end)

    test.describe("projection counters", function()
        test.it("counts only the created products of a partly failed command", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = assert(steps.apply(h, {
                { product = { sku = "N1" }, create = {} }, { product = { sku = "RDG" }, create = {} }, { product = { sku = "N2" }, create = {} } }, "independent"))
            test.eq(out.outcomes[2].outcome, "conflict")
            local c = catalog(h)
            test.eq(c.product_count, 11)
            test.eq(c.item_count, 8)
        end)

        test.it("leaves counters alone for status changes and moves", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = "any", status = "draft" })
            steps.one(h, { product = { sku = "RDG-slate-42" }, expect_version = "any", set = { { attr = "core.size", value = 49 } } })
            steps.one(h, { product = { sku = "RDG-slate-42" }, expect_version = "any", move = { parent = { sku = "RDG-moss" } } })
            local c = catalog(h)
            test.eq(c.product_count, 9)
            test.eq(c.item_count, 6)
            test.eq(c.trashed_count, 0)
        end)

        test.it("counts a model without item effect", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.one(h, { product = { sku = "RDG-clay" }, create = { parent = { sku = "RDG" } }, set = { { attr = "core.color", value = "clay" } } })
            local c = catalog(h)
            test.eq(c.product_count, 10)
            test.eq(c.item_count, 6)
        end)

        test.it("publishes catalog counters, generation and status after a fold", function()
            local h = fixture.catalog()
            local out = fixture.boot(h)
            local meta: { [string]: string } = {}
            for _ = 1, 100 do
                local db = assert(store.open())
                local rows = assert(db:query("SELECT key, value FROM kickside_component_meta WHERE component_id = $1", { h.id }))
                assert(db:release())
                meta = {}
                for _, row in ipairs(rows) do meta[row.key] = row.value end
                if tonumber(meta.last_event_seq) == out.as_of then break end
                time.after("50ms"):receive()
            end
            test.eq(tonumber(meta.last_event_seq), out.as_of)
            test.eq(tonumber(meta.product_count), 9)
            test.eq(tonumber(meta.item_count), 6)
            test.eq(tonumber(meta.trashed_count), 0)
            test.eq(tonumber(meta.generation), 1)
            test.eq(meta.status, "ready")
        end)
    end)

    test.describe("retention across catalogs", function()
        local OLD = "2000-01-01T00:00:00Z"

        local function run_owner()
            local out = fixture.retain()
            assert(out.success == true, tostring(out.error))
        end

        test.it("purges only products past their own catalog's window", function()
            local a, b = fixture.catalog(), fixture.catalog()
            fixture.boot(a)
            fixture.boot(b)
            a.call("apply_schema", { declaration = { policy = { trash_days = 100000 } } })
            local keep = assert(steps.get(a, "RDG-moss-40")).product.product_id
            local gone = assert(steps.get(b, "RDG-moss-40")).product.product_id
            steps.one(a, { product = { id = keep }, expect_version = "any", delete = true })
            steps.one(b, { product = { id = gone }, expect_version = "any", delete = true })
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_product SET state_at = $1 WHERE product_id IN ($2, $3)", { "2020-01-01T00:00:00Z", keep, gone }))
            db:release()
            run_owner()
            assert(b.call("settle", {}))
            local dbb = assert(store.open())
            local kept = assert(store.product(dbb, a.id, keep))
            local purged = assert(store.product(dbb, b.id, gone))
            dbb:release()
            test.eq(kept.state, "trashed")
            test.eq(purged.state, "purged")
        end)

        test.it("leaves live products alone however old they are", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2", { OLD, h.id }))
            db:release()
            run_owner()
            assert(h.call("settle", {}))
            test.eq(catalog(h).product_count, 9)
            test.eq(#h.call("query", {}).items, 6)
        end)

    end)
end

return { run = test.run_cases(define) }
