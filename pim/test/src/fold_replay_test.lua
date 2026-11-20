-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local resolve = require("resolve")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local materializer = require("materializer")
local types = require("types")

local catalog_fixture = require("catalog_fixture")
local catalog = catalog_fixture.catalog
local fold = catalog_fixture.fold
local count_rows = catalog_fixture.count_rows

local function define()
    test.describe("fold replay", function()
        test.it("folds whole an event that exceeds the budget by itself", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local current = catalog(h)
            local root = assert(steps.get(h, "RDG")).product.product_id
            local seq = current.applied_seq + 1
            local batch: { types.RawEvent } = {
                { seq = seq, type = "kickside.pim.events:product.changed", body = { product_id = root, generation = current.generation,
                    patch = { { a = current.compiled.attributes["core.name"].id, c = "locale=en", v = "All descendants" } },
                    actor = h.actor:id(), at = "2026-01-01T00:00:00Z" } },
                { seq = seq + 1, type = "kickside.pim.events:product.changed", body = { product_id = root, generation = current.generation,
                    patch = { { a = current.compiled.attributes["core.care"].id, c = "", v = "Following event" } },
                    actor = h.actor:id(), at = "2026-01-01T00:00:00Z" } },
            }
            local db = assert(store.open())
            local tx = assert(db:begin())
            local out, err = materializer.fold(tx, db:type(), h.id, batch, seq + 1, 1)
            local stopped = assert(store.catalog(tx, h.id)).applied_seq
            local descendants = assert(tx:query("SELECT product_id, updated_seq FROM kickside_pim_product WHERE catalog_id = $1 AND root_id = $2", { h.id, root }))
            local parent = assert(store.product(tx, h.id, root))
            local resolved_names = {}
            for _, row in ipairs(descendants) do
                local product = assert(store.product(tx, h.id, row.product_id))
                local lineage = assert(store.lineage(tx, h.id, product))
                resolved_names[#resolved_names + 1] = resolve.resolve(current.compiled, product, lineage, current.compiled.attributes["core.name"], { locale = "en" }).value
            end
            local continued, cerr = materializer.fold(tx, db:type(), h.id, batch, seq + 1, 1)
            local final_seq = assert(store.catalog(tx, h.id)).applied_seq
            local after = assert(store.product(tx, h.id, root))
            local final_rows = assert(tx:query("SELECT updated_seq FROM kickside_pim_product WHERE catalog_id = $1 AND root_id = $2", { h.id, root }))
            assert(tx:rollback())
            assert(db:release())
            test.is_nil(err, tostring(err))
            test.eq(out.last_seq, seq)
            test.eq(stopped, seq)
            test.eq(#descendants, 9)
            for _, value in ipairs(resolved_names) do test.eq(value, "All descendants") end
            for _, row in ipairs(descendants) do test.eq(tonumber(row.updated_seq), seq) end
            test.eq(assert(parent.document[tostring(current.compiled.attributes["core.name"].id)]["locale=en"]).p, "All descendants")
            test.is_nil(parent.document[tostring(current.compiled.attributes["core.care"].id)])
            test.is_nil(cerr, tostring(cerr))
            test.eq(continued.last_seq, seq + 1)
            test.eq(final_seq, seq + 1)
            test.eq(assert(after.document[tostring(current.compiled.attributes["core.care"].id)][""]).p, "Following event")
            for _, row in ipairs(final_rows) do test.eq(tonumber(row.updated_seq), seq + 1) end
        end)

        test.it("refuses a product event before any schema", function()
            local db = assert(store.open())
            local tx = assert(db:begin())
            local _, err = materializer.fold(tx, db:type(), "unprojected", { { seq = 1, type = "kickside.pim.events:product.deleted",
                body = { product_id = "p", actor = "a", at = "2026-01-01T00:00:00Z" } } }, 1, 100)
            tx:rollback()
            db:release()
            test.not_nil(err)
        end)

        test.it("ignores event types the catalog does not fold", function()
            local h = fixture.catalog()
            local all = fixture.events(h)
            local next_seq = (math.tointeger(tonumber(all[#all].seq)) :: integer) + 1
            local out, err = fold(h, { { seq = next_seq, type = "kickside.core.threads:note", body = { any = "thing" } } }, next_seq, 100)
            test.is_nil(err)
            test.eq((out :: materializer.FoldResult).last_seq, next_seq)
        end)

        test.it("removes unique rows on trash and restores them", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            local unique = "SELECT COUNT(*) AS n FROM kickside_pim_unique_value WHERE catalog_id = $1 AND product_id = $2"
            test.eq(count_rows(unique, { h.id, id }), 1)
            steps.one(h, { product = { id = id }, expect_version = "any", delete = true })
            test.eq(count_rows(unique, { h.id, id }), 0)
            steps.one(h, { product = { id = id }, expect_version = "any", restore = true })
            test.eq(count_rows(unique, { h.id, id }), 1)
        end)

        test.it("removes reference rows with the value and with the holder", function()
            local h = fixture.catalog()
            local made = assert(steps.apply(h, { { product = { sku = "T" }, create = { family = "generic" } }, { product = { sku = "H" }, create = { family = "generic" } } }))
            local target, holder = made.outcomes[1].product_id, made.outcomes[2].product_id
            local refs = "SELECT COUNT(*) AS n FROM kickside_pim_ref WHERE catalog_id = $1 AND product_id = $2"
            steps.one(h, { product = { id = holder }, expect_version = "any", set = { { attr = "core.related", value = { { ref = { "product", target } } } } } })
            test.eq(count_rows(refs, { h.id, holder }), 1)
            steps.one(h, { product = { id = holder }, expect_version = "any", unset = { { attr = "core.related" } } })
            test.eq(count_rows(refs, { h.id, holder }), 0)
            steps.one(h, { product = { id = holder }, expect_version = "any", set = { { attr = "core.related", value = { { ref = { "product", target } } } } } })
            test.eq(count_rows(refs, { h.id, holder }), 1)
            steps.one(h, { product = { id = holder }, expect_version = "any", delete = true })
            test.eq(count_rows(refs, { h.id, holder }), 0)
        end)

        test.it("answers a wake with nothing parked as not rebuilding", function()
            local h = fixture.catalog()
            local out, err = h.call("rebuild", {})
            test.is_nil(err)
            test.is_false(out.rebuilding)
        end)

        test.it("serves a write made while a rebuild runs", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Wipe.", index = "key" } } } } } })
            test.eq(steps.set(h, "RDG-moss-40", "core.gtin", "during").outcome, "updated")
            steps.rebuilt(h)
            test.eq(#h.call("query", { where = { field = "core.gtin", op = "eq", value = "during" } }).items, 1)
        end)

        test.it("compacts a removed attribute out of live documents", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = catalog(h).compiled.attributes["core.care"].id
            steps.set(h, "RDG", "core.care", "Brush.")
            h.call("apply_schema", { declaration = { remove = { attributes = { "core.care" } } } })
            steps.rebuilt(h)
            local db = assert(store.open())
            local p = assert(store.product_by_sku(db, h.id, "RDG"))
            db:release()
            test.is_nil(p.document[tostring(id)])
        end)
    end)


end

return { run = test.run_cases(define) }
