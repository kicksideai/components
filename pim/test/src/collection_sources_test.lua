-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")

type Map = { [string]: unknown }
local function define()
    test.describe("collection sources", function()
        test.it("requires expired withdrawals to invalidate stale publication continuations", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local sku = "RDG-moss-40"
            local released = assert(h.call("release", { items = { { product = { sku = sku }, expect_version = 1, channels = { "web" } } } }))
            test.eq(released.outcomes[1].outcome, "released")
            local before = assert(h.call("pull", { config = { channel = "web" } }))
            test.eq(before.items[1].op, "upsert")
            local id = before.items[1].item_key
            assert(h.call("withdraw", { items = { { product = { sku = sku }, channels = { "web" } } } }))
            local withdrawal = assert(h.call("pull", { config = { channel = "web" }, cursor = before.next_cursor }))
            test.eq(withdrawal.items[1].op, "delete")
            local db = assert(store.open())
            assert(db:execute( "UPDATE kickside_pim_publication SET updated_at=$1 WHERE catalog_id=$2 AND channel='web' AND product_id=$3",
                { "2000-01-01T00:00:00Z", h.id, id }))
            assert(db:release())
            local retained = assert(fixture.retain())
            test.is_true(retained.success)
            local read = assert(store.open())
            local remaining = tonumber(assert(read:query( "SELECT COUNT(*) AS n FROM kickside_pim_publication WHERE catalog_id=$1 AND channel='web' AND product_id=$2", { h.id, id }))[1].n)
            assert(read:release())
            test.eq(remaining, 0, "withdrawal passed its retention window")
            local resumed = assert(h.call("pull", { config = { channel = "web" }, cursor = before.next_cursor }))
            test.is_false(resumed.success, "stale replica received a successful page after its withdrawal expired")
            test.eq(resumed.error.code, "cursor_expired")
            test.is_false(resumed.error.retriable)
            test.eq(resumed.error.details.kind, errors.CONFLICT)
            local caught_up = assert(h.call("pull", { config = { channel = "web" }, cursor = withdrawal.next_cursor }))
            test.is_true(caught_up.success, "the exact withdrawal key remains a valid cursor")
            local restarted = assert(h.call("pull", { config = { channel = "web" } }))
            test.is_true(restarted.success)
            test.eq(#restarted.items, 0)
        end)

        test.it("rebuilds older live publications across pages and detects a later expiry", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local skus = { "RDG-moss-40", "RDG-moss-41", "RDG-moss-42" }
            for _, sku in ipairs(skus) do
                local out = assert(h.call("release", { items = {
                    { product = { sku = sku }, expect_version = 1, channels = { "web" } },
                } }))
                test.eq(out.outcomes[1].outcome, "released")
            end
            local function expire(sku: string)
                assert(h.call("withdraw", { items = { { product = { sku = sku }, channels = { "web" } } } }))
                local db = assert(store.open())
                assert(db:execute([[UPDATE kickside_pim_publication SET updated_at='2000-01-01T00:00:00Z'
                    WHERE catalog_id=$1 AND channel='web' AND state='withdrawn']], { h.id }))
                assert(db:release())
                test.is_true(assert(fixture.retain()).success)
            end
            expire(skus[3])
            local config = { channel = "web" }
            local first = assert(h.call("pull", { config = config, limit = 1 }))
            test.is_true(first.success)
            test.is_true(first.has_more)
            test.eq(first.items[1].op, "upsert")
            local second = assert(h.call("pull", { config = config, cursor = first.next_cursor, limit = 1 }))
            test.is_true(second.success, "a fresh consumer can page through publications older than the expiry boundary")
            test.eq(second.items[1].op, "upsert")
            test.is_false(second.has_more)
            test.not_nil(first.next_cursor.expiry_floor)
            expire(skus[1])
            local stale = assert(h.call("pull", { config = config, cursor = second.next_cursor, limit = 1 }))
            test.is_false(stale.success)
            test.eq(stale.error.code, "cursor_expired")
        end)

        test.it("reports source_gap when a product cursor precedes retained tombstones", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_catalog SET tombstone_floor_seq = applied_seq WHERE catalog_id = $1", { h.id }))
            assert(db:release())
            local page, err = h.call("pull_products", { cursor = { seq = 1, product_id = "" } })
            test.is_nil(err, tostring(err))
            test.is_false(page.success)
            test.eq(page.error.details.kind, errors.CONFLICT)
            test.eq(page.error.code, "cursor_expired")
            test.is_false(page.error.retriable)
        end)

        test.it("passes the observed tombstone floor through product pull continuations", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_catalog SET tombstone_floor_seq = applied_seq WHERE catalog_id = $1", { h.id }))
            assert(db:release())
            local first = assert(h.call("pull_products", { limit = 1 }))
            test.is_true(first.success)
            test.is_true(first.has_more)
            local second = assert(h.call("pull_products", { cursor = first.next_cursor, limit = 1 }))
            test.is_true(second.success)
            test.is_true(first.items[1].item_key ~= second.items[1].item_key)
        end)

        test.it("resumes product pages across tied updates and emits deletes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local ids: { [string]: boolean } = {}
            local cursor: unknown = nil
            for _ = 1, 20 do
                local page, err = h.call("pull_products", { cursor = cursor, limit = 1 })
                test.is_nil(err, tostring(err))
                test.is_true(page.success)
                for _, item in ipairs(page.items) do
                    test.is_false(ids[item.item_key] == true)
                    ids[item.item_key] = true
                    test.eq(item.op, "upsert")
                    test.not_nil(item.payload.values)
                    test.eq(item.item_key, item.payload.product_id)
                    test.eq(item.dedup_key, item.item_key .. ":" .. item.payload.updated_seq)
                    test.eq(item.source_version, string.format("%020d", item.payload.updated_seq))
                end
                cursor = page.next_cursor
                if not page.has_more then break end
            end
            local count = 0
            for _ in pairs(ids) do count = count + 1 end
            test.eq(count, 9)
            local applied = assert(h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", delete = true } } }))
            local page = assert(h.call("pull_products", { cursor = cursor }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].item_key, applied.outcomes[1].product_id)
            test.eq(page.items[1].op, "delete")
        end)
        test.it("pages contextual product values by family and aspect, then emits matching deletes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local excluded = assert(h.call("apply", { items = { { product = { sku = "GENERIC" }, create = {} } } }))
            test.eq(excluded.outcomes[1].outcome, "created")
            local config = { families = { "footwear" }, aspects = { "core" } }
            local cursor: unknown = nil
            local seen: { [string]: boolean } = {}
            local count = 0
            repeat
                local page = assert(h.call("pull_products", { config = config, cursor = cursor, limit = 1 }))
                test.is_true(page.success)
                test.eq(#page.items, 1)
                local item = page.items[1]
                test.is_nil(seen[item.item_key])
                seen[item.item_key] = true
                count = count + 1
                test.eq(item.op, "upsert")
                test.eq(item.payload.family, "footwear")
                test.eq(item.payload.values["core.name"]["locale=en"], "Ridgeline hiking boot")
                for code in pairs(item.payload.values) do test.eq(code:sub(1, 5), "core.") end
                cursor = page.next_cursor
            until not page.has_more or count == 10
            test.eq(count, 9)
            local deleted = assert(h.call("apply", { items = {
                { product = { sku = "GENERIC" }, expect_version = 1, delete = true },
                { product = { sku = "RDG-moss-40" }, expect_version = 1, delete = true },
            } }))
            local page = assert(h.call("pull_products", { config = config, cursor = cursor, limit = 1 }))
            test.is_true(page.success)
            test.eq(#page.items, 1)
            test.eq(page.items[1].item_key, deleted.outcomes[2].product_id)
            test.eq(page.items[1].op, "delete")
            test.is_nil(page.items[1].payload)
            test.eq(#assert(h.call("pull_products", { config = config, cursor = page.next_cursor, limit = 1 })).items, 0)
        end)

        test.it("resumes pending proposals in creation order without losing timestamp ties", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for i = 1, 3 do
                local out, err = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "Proposal " .. i } } } } })
                test.is_nil(err, tostring(err))
                test.not_nil(out.proposal_id)
            end
            local cursor: unknown = nil
            local seen: { [string]: boolean } = {}
            for i = 1, 3 do
                local page, err = h.call("pull_proposals", { cursor = cursor, limit = 1 })
                test.is_nil(err, tostring(err))
                test.is_true(page.success)
                test.eq(#page.items, 1)
                local item = page.items[1]
                test.is_false(seen[item.item_key] == true)
                seen[item.item_key] = true
                test.eq(item.op, "upsert")
                test.eq(item.dedup_key, item.item_key)
                test.eq(item.source_version, item.item_key)
                test.eq(item.occurred_at, item.payload.created_at)
                test.eq(item.payload.status, "pending")
                test.eq(page.has_more, i < 3)
                cursor = page.next_cursor
            end
            test.eq(#assert(h.call("pull_proposals", { cursor = cursor, limit = 1 })).items, 0)
        end)
    end)
end
return { run = test.run_cases(define) }
