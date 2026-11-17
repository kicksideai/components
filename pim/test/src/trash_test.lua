-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Trash, restore, purge and retention: a trashed product frees its keys, restore
-- revalidates at the head, and the retention owner purges past the window,
-- leaves tombstones, prunes them and the change history, and raises the floor.
local test = require("test")
local steps = require("steps")
local fixture = require("fixture")
local store = require("store")
local types = require("types")

local OLD = "2000-01-01T00:00:00Z"

local version = steps.version

local trash_fixture = require("trash_fixture")
local trash, restore, exec, product, run_owner = trash_fixture.trash, trash_fixture.restore, trash_fixture.exec, trash_fixture.product, trash_fixture.run_owner

local function define()
    test.describe("trash and restore", function()
        test.it("refuses a create that also requests trash", function()
            local h = fixture.catalog()
            local outcome = steps.one(h, { product = { sku = "CONTRADICTORY" }, create = {}, delete = true })
            test.eq(outcome.outcome, "invalid")
            test.is_nil((steps.get(h, "CONTRADICTORY")))
            local upsert = steps.one(h, { product = { sku = "CONTRADICTORY" }, create = {}, upsert = true, delete = true })
            test.eq(upsert.outcome, "invalid")
            test.is_nil((steps.get(h, "CONTRADICTORY")))
        end)

        test.it("frees the sku, unique values and axis slot of a trashed item", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local old = trash(h, "RDG-moss-40")
            local _, gerr = h.call("get", { product = { sku = "RDG-moss-40" } })
            test.not_nil(gerr)
            local out = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, create = { parent = { sku = "RDG-moss" } },
                set = { { attr = "core.size", value = 40 }, { attr = "core.gtin", value = "0400moss40" } } } } })
            test.eq(out.outcomes[1].outcome, "created")
            local again = restore(h, old)
            test.eq(again.outcome, "conflict")
        end)

        test.it("restores a trashed item with its values and records both steps", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-slate-41")
            local back = restore(h, id)
            test.eq(back.outcome, "updated")
            test.is_true(back.restored)
            local found = h.call("get", { product = { sku = "RDG-slate-41" } })
            test.eq(found.values["core.gtin"].value, "0400slate41")
            local history = h.call("list_history", { product = { id = id }, limit = 2 })
            test.eq(history.entries[1].kind, "restored")
            test.eq(history.entries[2].kind, "deleted")
            local page = h.call("query", { where = { field = "core.gtin", op = "eq", value = "0400slate41" } })
            test.eq(#page.items, 1)
        end)

        test.it("lets a term retire once its only user is trashed, then refuses that restore", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local made = h.call("apply", { items = { { product = { sku = "RDG-sand" }, create = { parent = { sku = "RDG" } },
                set = { { attr = "core.color", value = "sand" } } } } })
            test.eq(made.outcomes[1].outcome, "created")
            local refused = h.call("apply", { items = { { term = { vocabulary = "colors", code = "sand" }, retired = true } } })
            test.eq(refused.outcomes[1].outcome, "invalid")
            local id = trash(h, "RDG-sand")
            local retired = h.call("apply", { items = { { term = { vocabulary = "colors", code = "sand" }, retired = true } } })
            test.eq(retired.outcomes[1].outcome, "updated")
            local back = restore(h, id)
            test.eq(back.outcome, "invalid")
        end)

        test.it("keeps a sku freed by a trash in one command for one new holder", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local old = h.call("get", { product = { sku = "RDG-moss-40" } }).product
            local function create(size: integer): types.ApplyItem
                return { product = { sku = "RDG-moss-40" }, create = { parent = { sku = "RDG-moss" } },
                    set = { { attr = "core.size", value = size } } }
            end
            local twice = h.call("apply", { mode = "independent", items = {
                { product = { sku = "RDG-moss-40" }, expect_version = old.version, delete = true }, create(43), create(44) } })
            test.eq(twice.outcomes[1].outcome, "updated")
            test.eq(twice.outcomes[2].outcome, "created")
            test.eq(twice.outcomes[3].outcome, "conflict")
            local page = h.call("query", { family = "footwear", limit = 200 })
            local holders = 0
            for _, item in ipairs(page.items) do if item.sku == "RDG-moss-40" then holders = holders + 1 end end
            test.eq(holders, 1)
        end)

        test.it("refuses to restore a product whose sku a new holder took in the same command", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local old = h.call("get", { product = { sku = "RDG-slate-40" } }).product
            local out = h.call("apply", { mode = "independent", items = {
                { product = { sku = "RDG-slate-40" }, expect_version = old.version, delete = true },
                { product = { sku = "RDG-slate-40" }, create = { parent = { sku = "RDG-slate" } }, set = { { attr = "core.size", value = 45 } } },
                { product = { id = old.product_id }, expect_version = old.version + 1, restore = true } } })
            test.eq(out.outcomes[2].outcome, "created")
            test.eq(out.outcomes[3].outcome, "conflict")
            test.eq(h.call("get", { product = { sku = "RDG-slate-40" } }).product.product_id, out.outcomes[2].product_id)
        end)

        test.it("refuses a restore whose axis slot, unique value or parent is gone", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local axis = trash(h, "RDG-moss-40")
            local taken = h.call("apply", { items = { { product = { sku = "RDG-moss-40b" }, create = { parent = { sku = "RDG-moss" } },
                set = { { attr = "core.size", value = 40 } } } } })
            test.eq(taken.outcomes[1].outcome, "created")
            test.eq(restore(h, axis).outcome, "conflict")

            local unique = trash(h, "RDG-moss-41")
            local v = version(h, "RDG-moss-42")
            local stole = h.call("apply", { items = { { product = { sku = "RDG-moss-42" }, expect_version = v,
                set = { { attr = "core.gtin", value = "0400moss41" } } } } })
            test.eq(stole.outcomes[1].outcome, "updated")
            test.eq(restore(h, unique).outcome, "conflict")

            local made = h.call("apply", { items = {
                { product = { sku = "RDG-clay" }, create = { parent = { sku = "RDG" } }, set = { { attr = "core.color", value = "clay" } } },
                { product = { sku = "RDG-clay-40" }, create = { parent = { sku = "RDG-clay" } }, set = { { attr = "core.size", value = 40 } } } } })
            test.eq(made.outcomes[2].outcome, "created")
            local child = trash(h, "RDG-clay-40")
            trash(h, "RDG-clay")
            test.eq(restore(h, child).outcome, "invalid")
        end)

        test.it("leaves trashed items out of queries and stamps state changes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-slate-42")
            local page = h.call("query", { where = { field = "core.gtin", op = "eq", value = "0400slate42" } })
            test.eq(#page.items, 0)
            local trashed = product(h, id) :: types.Product
            test.eq(trashed.state, "trashed")
            test.not_nil(trashed.state_at)
            restore(h, id)
            local live = product(h, id) :: types.Product
            test.eq(live.state, "live")
            test.not_nil(live.state_at)
        end)

        test.it("restores only trashed products, by id", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local live = h.call("get", { product = { sku = "RDG-moss-42" } }).product
            local out = h.call("apply", { items = { { product = { id = live.product_id }, expect_version = live.version, restore = true } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            local by_sku = h.call("apply", { items = { { product = { sku = "RDG-moss-42" }, expect_version = "any", restore = true } } })
            test.eq(by_sku.outcomes[1].outcome, "invalid")
        end)

        test.it("trashes and restores a product that references itself", function()
            local h = fixture.catalog()
            local made = h.call("apply", { items = { { product = { sku = "SOLO" }, create = { family = "generic" } } } })
            local id = made.outcomes[1].product_id
            local linked = h.call("apply", { items = { { product = { id = id }, expect_version = 1,
                set = { { attr = "core.related", value = { { ref = { "product", id } } } } } } } })
            test.eq(linked.outcomes[1].outcome, "updated")
            trash(h, "SOLO")
            test.eq(restore(h, id).outcome, "updated")
            local back = h.call("get", { product = { id = id } })
            test.eq(back.values["core.related"].value[1].ref[2], id)
        end)
    end)

    test.describe("trash and restore edges", function()
        test.it("refuses to trash a trashed product by id or sku", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-40")
            local by_id = h.call("apply", { items = { { product = { id = id }, expect_version = "any", delete = true } } })
            test.eq(by_id.outcomes[1].outcome, "invalid")
            test.eq(by_id.outcomes[1].findings[1].message, "product not found")
            local by_sku = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", delete = true } } })
            test.eq(by_sku.outcomes[1].outcome, "invalid")
        end)

        test.it("checks the restore version and keeps restore a separate item", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-40")
            local stale = h.call("apply", { items = { { product = { id = id }, expect_version = 1, restore = true } } })
            test.eq(stale.outcomes[1].outcome, "conflict")
            for _, extra in ipairs({ { set = { { attr = "core.gtin", value = "Z" } } }, { status = "draft" }, { create = { family = "generic" } },
                { delete = true } }) do
                local item: { [string]: unknown } = { product = { id = id }, expect_version = "any", restore = true }
                for k, v in pairs(extra) do item[k] = v end
                local out = h.call("apply", { items = { item } })
                test.eq(out.outcomes[1].outcome, "invalid")
                test.eq(out.outcomes[1].findings[1].message, "restore is a separate item")
            end
            local any = h.call("apply", { items = { { product = { id = id }, expect_version = "any", restore = true } } })
            test.eq(any.outcomes[1].outcome, "updated")
            test.eq(any.outcomes[1].restored, true)
        end)

        test.it("refuses to restore a purged tombstone", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-41")
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { OLD, h.id, id })
            run_owner(h)
            test.eq((product(h, id) :: types.Product).state, "purged")
            local out = h.call("apply", { items = { { product = { id = id }, expect_version = "any", restore = true } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            test.eq(out.outcomes[1].findings[1].message, "only trashed products restore")
        end)

        test.it("restores a parent before its child in one command, and not the other way round", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local kids: { string } = {}
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss-41", "RDG-moss-42" }) do kids[#kids + 1] = trash(h, sku) end
            local model = trash(h, "RDG-moss")
            local wrong = h.call("apply", { items = {
                { product = { id = kids[1] }, expect_version = "any", restore = true },
                { product = { id = model }, expect_version = "any", restore = true } }, mode = "independent" })
            test.eq(wrong.outcomes[1].outcome, "invalid")
            test.eq(wrong.outcomes[2].outcome, "updated")
            local right = h.call("apply", { items = {
                { product = { id = kids[2] }, expect_version = "any", restore = true },
                { product = { id = kids[3] }, expect_version = "any", restore = true } } })
            test.eq(right.outcomes[1].outcome, "updated")
            test.eq(right.outcomes[2].outcome, "updated")
            test.eq(h.call("get", { product = { sku = "RDG-moss-41" } }).product.product_id, kids[2])
        end)

        test.it("restores a model and its child in one command when the model comes first", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local kids: { string } = {}
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss-41", "RDG-moss-42" }) do kids[#kids + 1] = trash(h, sku) end
            local model = trash(h, "RDG-moss")
            local out = h.call("apply", { items = {
                { product = { id = model }, expect_version = "any", restore = true },
                { product = { id = kids[1] }, expect_version = "any", restore = true } } })
            test.eq(out.outcomes[1].outcome, "updated")
            test.eq(out.outcomes[2].outcome, "updated")
        end)

        test.it("refuses to restore an item whose referenced product is gone", function()
            local h = fixture.catalog()
            local made = h.call("apply", { items = { { product = { sku = "TARGET" }, create = { family = "generic" } },
                { product = { sku = "HOLDER" }, create = { family = "generic" } } } })
            local target, holder = made.outcomes[1].product_id, made.outcomes[2].product_id
            h.call("apply", { items = { { product = { id = holder }, expect_version = 1,
                set = { { attr = "core.related", value = { { ref = { "product", target } } } } } } } })
            trash(h, "HOLDER")
            trash(h, "TARGET")
            local out = restore(h, holder)
            test.eq(out.outcome, "invalid")
            test.is_true(out.findings[1].message:find("unknown product", 1, true) ~= nil)
            test.eq(restore(h, target).outcome, "updated")
            test.eq(restore(h, holder).outcome, "updated")
        end)

        test.it("refuses to trash a product another product references", function()
            local h = fixture.catalog()
            local made = h.call("apply", { items = { { product = { sku = "TARGET" }, create = { family = "generic" } },
                { product = { sku = "HOLDER" }, create = { family = "generic" } } } })
            local target, holder = made.outcomes[1].product_id, made.outcomes[2].product_id
            h.call("apply", { items = { { product = { id = holder }, expect_version = 1,
                set = { { attr = "core.related", value = { { ref = { "product", target } } } } } } } })
            local out = h.call("apply", { items = { { product = { id = target }, expect_version = "any", delete = true } } })
            test.eq(out.outcomes[1].outcome, "invalid")
            test.is_true(out.outcomes[1].findings[1].message:find("referenced by 1", 1, true) ~= nil)
        end)

        test.it("withdraws a trashed item's publications and releases it again after restore", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local live = h.call("get", { product = { sku = "RDG-moss-40" } })
            local rel = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = live.product.version } } })
            test.eq(rel.outcomes[1].outcome, "released")
            local release_id = h.call("get", { product = { sku = "RDG-moss-40" } }).release_id
            test.not_nil(release_id)
            local id = trash(h, "RDG-moss-40")
            test.eq(restore(h, id).outcome, "updated")
            local back = h.call("get", { product = { id = id } })
            test.eq(back.release_id, release_id)
            test.is_true(#back.publications > 0)
            for _, pub in ipairs(back.publications) do test.eq(pub.state, "withdrawn") end
            local again = h.call("release", { items = { { product = { id = id }, expect_version = back.product.version } } })
            test.eq(again.outcomes[1].outcome, "released")
            local published = false
            for _, pub in ipairs(h.call("get", { product = { id = id } }).publications) do
                if pub.state == "published" then published = true end
            end
            test.is_true(published)
        end)

        test.it("trashes a model whose children are trashed and moves the counters", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss-41", "RDG-moss-42" }) do trash(h, sku) end
            local refused = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any", delete = true } } })
            test.eq(refused.outcomes[1].outcome, "invalid")
            trash(h, "RDG-moss")
            local db = assert(store.open())
            local c = assert(store.catalog(db, h.id))
            db:release()
            test.eq(c.product_count, 5)
            test.eq(c.item_count, 3)
            test.eq(c.trashed_count, 4)
        end)

        test.it("hides a trashed product from reads by sku and keeps its history by id", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-40")
            local _, gerr = h.call("get", { product = { sku = "RDG-moss-40" } })
            test.not_nil(gerr)
            local _, ierr = h.call("get", { product = { id = id } })
            test.not_nil(ierr)
            local _, herr = h.call("list_history", { product = { sku = "RDG-moss-40" } })
            test.not_nil(herr)
            local _, rerr = h.call("list_releases", { product = { sku = "RDG-moss-40" } })
            test.not_nil(rerr)
            local history = h.call("list_history", { product = { id = id }, limit = 5 })
            test.eq(history.entries[1].kind, "deleted")
            local releases, lerr = h.call("list_releases", { product = { id = id } })
            test.is_nil(lerr)
            test.not_nil(releases)
        end)
    end)

end
return { run = test.run_cases(define) }
