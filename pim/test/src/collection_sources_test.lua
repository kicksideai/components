-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")

type Map = { [string]: unknown }
local function define()
    test.describe("collection sources", function()
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
