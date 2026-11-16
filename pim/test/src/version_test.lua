-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Optimistic versions, ordered sources, source rules, statuses and command modes.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")

local function events(h: fixture.Handle): integer
    local page = h.call("events", {}) :: { events: { unknown } }
    return #page.events
end

local function define()
    test.describe("expect_version", function()
        test.it("requires a matching integer version or any", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local base: types.ProductRef = { sku = "RDG-moss-40" }
            test.eq(steps.one(h, { product = base, set = { { attr = "core.gtin", value = "a" } } }).outcome, "invalid")
            local stale = steps.one(h, { product = base, expect_version = 0, set = { { attr = "core.gtin", value = "a" } } })
            test.eq(stale.outcome, "conflict")
            test.eq((stale.findings :: { types.Finding })[1].version, steps.version(h, "RDG-moss-40"))
            local before = events(h)
            test.eq(steps.one(h, { product = base, expect_version = "1", set = { { attr = "core.gtin", value = "a" } } }).outcome, "invalid")
            test.eq(events(h), before)
            test.eq(steps.one(h, { product = base, expect_version = "any", set = { { attr = "core.gtin", value = "b" } } }).outcome, "updated")
            test.eq(steps.one(h, { product = { sku = "RDG-moss-41" }, expect_version = "any", delete = true }).outcome, "updated")
        end)

        test.it("counts one version per product event", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.version(h, "RDG-moss-40"), 1)
            steps.set(h, "RDG-moss-40", "core.size", 43)
            test.eq(steps.version(h, "RDG-moss-40"), 2)
            steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = 2, status = "draft" })
            test.eq(steps.version(h, "RDG-moss-40"), 3)
            steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = 3, move = { parent = { sku = "RDG-slate" } } })
            test.eq(steps.version(h, "RDG-moss-40"), 4)
        end)
    end)

    test.describe("ordered sources", function()
        test.it("orders by source seq instead of expect_version", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = assert(steps.apply(h, { { product = { sku = "RDG" }, seq = 0, set = { { attr = "pricing.retail", value = "1" } } } }))
            test.eq(out.outcomes[1].outcome, "invalid")
            local src = function(seq: unknown, value: string): string
                local o, err = h.call("apply", { source = "pricing", items = { { product = { sku = "RDG" }, expect_version = 99, seq = seq,
                    set = { { attr = "pricing.retail", value = value } } } } })
                if err then return (err :: error):kind() == errors.INVALID and "refused" or tostring(err) end
                return (o :: types.ApplyResult).outcomes[1].outcome
            end
            test.eq(src(nil, "1"), "invalid")
            test.eq(src(7.5, "1"), "invalid")
            test.eq(src(0, "1"), "unchanged")
            test.eq(src(1, "10.00"), "updated")
            test.eq(src(2, "10.00"), "updated")
            test.eq(src(2, "11.00"), "unchanged")
            test.eq(src(1, "12.00"), "unchanged")
        end)

        test.it("records the seq of a product created by an ordered source", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = { sources = { { id = "pricing", ordering = "sequence", writes = { "pricing", "core" } } } } })
            test.is_nil(err)
            local made = h.call("apply", { source = "pricing", items = { { product = { sku = "P" }, create = { family = "generic" }, seq = 7,
                set = { { attr = "pricing.retail", value = "1" } } } } }) :: types.ApplyResult
            test.eq(made.outcomes[1].outcome, "created")
            local older = h.call("apply", { source = "pricing", items = { { product = { sku = "P" }, seq = 5,
                set = { { attr = "pricing.retail", value = "2" } } } } }) :: types.ApplyResult
            test.eq(older.outcomes[1].outcome, "unchanged")
        end)

        test.it("ignores seq for unordered sources and enforces source rules", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local erp = function(item: types.ApplyItem): (types.ApplyResult?, error?)
                local o, err = h.call("apply", { source = "erp", items = { item } })
                return o :: types.ApplyResult?, err
            end
            local no_version = assert(erp({ product = { sku = "RDG-moss-40" }, seq = 5, set = { { attr = "core.gtin", value = "e1" } } }))
            test.eq(no_version.outcomes[1].outcome, "invalid")
            local tagline = assert(erp({ product = { sku = "RDG" }, expect_version = steps.version(h, "RDG"),
                set = { { attr = "marketing.tagline", ctx = { channel = "web", locale = "en" }, value = "x" } } }))
            test.eq(tagline.outcomes[1].outcome, "forbidden")
            local price = assert(erp({ product = { sku = "RDG" }, expect_version = steps.version(h, "RDG"),
                set = { { attr = "pricing.retail", value = "1" } } }))
            test.eq(price.outcomes[1].outcome, "forbidden")
            local _, unknown = h.call("apply", { source = "nope", items = { { product = { sku = "RDG" }, expect_version = "any" } } })
            test.not_nil(unknown)
            local _, serr = h.call("apply_schema", { declaration = { sources = { { id = "erp", writes = { "core", "logistics" }, principals = { "someone-else" } } } } })
            test.is_nil(serr)
            local _, denied = erp({ product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.gtin", value = "x" } } })
            test.not_nil(denied)
            test.eq((denied :: error):kind(), errors.PERMISSION_DENIED)
        end)
    end)

    test.describe("statuses", function()
        test.it("changes status only when it differs and records it with values", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local base: types.ProductRef = { sku = "RDG-moss-40" }
            test.eq(steps.one(h, { product = base, expect_version = 1, status = "active" }).outcome, "unchanged")
            local before = events(h)
            test.eq(steps.one(h, { product = base, expect_version = 1, status = "paused" }).outcome, "invalid")
            test.eq(events(h), before)
            local both = steps.one(h, { product = base, expect_version = 1, status = "draft", set = { { attr = "core.gtin", value = "s1" } } })
            test.eq(both.outcome, "updated")
            test.eq(both.version, 2)
            local page = h.call("list_history", { product = base, limit = 2 }) :: types.HistoryResult
            local kinds = { page.entries[1].kind, page.entries[2].kind }
            table.sort(kinds)
            test.eq(table.concat(kinds, ","), "set,status")
        end)
    end)

    test.describe("command modes", function()
        test.it("persists nothing from an atomic command with a failed item", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local before = events(h)
            local out = assert(steps.apply(h, {
                { product = { sku = "NEW" }, create = { family = "generic" } },
                { product = { sku = "RDG" }, expect_version = 0, status = "draft" },
                { product = { sku = "NEW2" }, create = { family = "generic" } } }))
            test.is_false(out.applied)
            test.is_nil(out.seq)
            test.eq(#out.outcomes, 3)
            test.eq(out.outcomes[1].outcome, "created")
            test.not_nil(select(2, steps.get(h, "NEW")))
            test.eq(events(h), before)
        end)

        test.it("creates parent and child in one command and drops a child of a failed parent", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local both = assert(steps.apply(h, {
                { product = { sku = "R2" }, create = { family = "footwear" } },
                { product = { sku = "R2-moss" }, create = { parent = { sku = "R2" } }, set = { { attr = "core.color", value = "moss" } } } }))
            test.is_true(both.applied)
            local some = assert(steps.apply(h, {
                { product = { sku = "R3" }, create = { family = "nope" } },
                { product = { sku = "R3-moss" }, create = { parent = { sku = "R3" } }, set = { { attr = "core.color", value = "moss" } } },
                { product = { sku = "R4" }, create = { family = "footwear" } } }, "independent"))
            test.eq(some.outcomes[2].outcome, "invalid")
            test.eq(some.outcomes[3].outcome, "created")
        end)

        test.it("appends nothing when every item is unchanged", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local before = events(h)
            local out = assert(steps.apply(h, { { product = { sku = "RDG-moss-40" }, expect_version = 1, set = { { attr = "core.gtin", value = "0400moss40" } } } }))
            test.is_true(out.applied)
            test.is_nil(out.seq)
            test.eq(events(h), before)
        end)

        test.it("bounds the request shape", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, mode = h.call("apply", { mode = "batch", items = { { product = { sku = "RDG" }, expect_version = "any" } } })
            test.eq(mode:kind(), errors.INVALID)
            local many: { types.ApplyItem } = {}
            for i = 1, 501 do many[i] = { product = { sku = "M" .. i }, create = { family = "generic" } } end
            local _, big = h.call("apply", { items = many })
            test.eq(big:kind(), errors.INVALID)
            local _, empty = h.call("apply", { items = {} })
            test.eq(empty:kind(), errors.INVALID)
            local _, import = h.call("apply", { import = true, items = { { product = { sku = "RDG" }, expect_version = "any" } } })
            test.not_nil(import)
            local huge = steps.set(h, "RDG", "core.name", string.rep("x", 300 * 1024), { locale = "en" })
            test.eq(huge.outcome, "invalid")
        end)

        test.it("treats an upsert of an absent sku as a create and of a present one as any-version update", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.one(h, { product = { sku = "U1" }, upsert = true, set = { { attr = "core.gtin", value = "u" } } }).outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "U1" }, upsert = true, create = { family = "generic" } }).outcome, "created")
            test.eq(steps.one(h, { product = { sku = "U1" }, upsert = true, create = { family = "generic" },
                set = { { attr = "core.gtin", value = "u2" } } }).outcome, "updated")
        end)
    end)
end

return { run = test.run_cases(define) }
