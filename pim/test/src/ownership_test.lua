-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Ownership levels, variation axes, hierarchy and moves.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")
local time = require("time")

local function create(h: fixture.Handle, sku: string, parent: string?, set: { types.ValueEntry }?, family: string?): types.Outcome
    return steps.one(h, { product = { sku = sku }, create = { family = family, parent = parent and { sku = parent } or nil }, set = set })
end

local function trash(h: fixture.Handle, sku: string): types.Outcome
    return steps.one(h, { product = { sku = sku }, expect_version = steps.version(h, sku), delete = true })
end

local function define()
    test.describe("ownership levels", function()
        test.it("writes values only at the owning level", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.set(h, "RDG-moss-40", "core.materials", { "nylon" }).outcome, "invalid")
            test.eq(steps.set(h, "RDG-moss", "core.gtin", "x").outcome, "invalid")
            test.eq(steps.set(h, "RDG", "core.color", "moss").outcome, "invalid")
            test.eq(steps.set(h, "RDG-moss", "marketing.description", "x", { locale = "en" }).outcome, "invalid")
        end)

        test.it("inherits root values and defaults on items", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local item = assert(steps.get(h, "RDG-moss-40", { locale = "en" }))
            test.eq(item.values["core.care"].state, "default")
            test.eq(item.values["marketing.description"].state, "inherited")
            local model = assert(steps.get(h, "RDG-moss"))
            test.is_nil(model.values["core.size"])
        end)
    end)

    test.describe("variation axes", function()
        test.it("requires axis values on create and keeps them provided", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(create(h, "RDG-x", "RDG").outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"),
                unset = { { attr = "core.size" } } }).outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"),
                clear = { { attr = "core.size" } } }).outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "RDG-moss" }, expect_version = steps.version(h, "RDG-moss"),
                unset = { { attr = "core.color" } } }).outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "RDG-moss" }, expect_version = steps.version(h, "RDG-moss"),
                unset = { { attr = "core.materials" } } }).outcome, "updated")
        end)

        test.it("keeps sibling axis values unique and frees a slot when an axis changes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local clash = steps.set(h, "RDG-moss-40", "core.size", 41)
            test.eq(clash.outcome, "conflict")
            test.eq((clash.findings :: { types.Finding })[1].holder, assert(steps.get(h, "RDG-moss-41")).product.product_id)
            test.eq(steps.set(h, "RDG-moss-40", "core.size", 43).outcome, "updated")
            test.eq(create(h, "RDG-moss-40b", "RDG-moss", { { attr = "core.size", value = 40 } }).outcome, "created")
            local out = assert(steps.apply(h, {
                { product = { sku = "RDG-slate-x1" }, create = { parent = { sku = "RDG-slate" } }, set = { { attr = "core.size", value = 44 } } },
                { product = { sku = "RDG-slate-x2" }, create = { parent = { sku = "RDG-slate" } }, set = { { attr = "core.size", value = 44 } } } },
                "independent"))
            test.eq(out.outcomes[1].outcome, "created")
            test.eq(out.outcomes[2].outcome, "conflict")
        end)

        test.it("lets a later item take a slot an earlier item of the command frees", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = assert(steps.apply(h, {
                { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), set = { { attr = "core.size", value = 43 } } },
                { product = { sku = "RDG-moss-40b" }, create = { parent = { sku = "RDG-moss" } }, set = { { attr = "core.size", value = 40 } } } },
                "independent"))
            test.eq(out.outcomes[1].outcome, "updated")
            test.eq(out.outcomes[2].outcome, "created")
            local moved = assert(steps.apply(h, {
                { product = { sku = "RDG-slate-42" }, expect_version = "any", set = { { attr = "core.size", value = 48 } } },
                { product = { sku = "RDG-moss-42" }, expect_version = "any", move = { parent = { sku = "RDG-slate" } } },
                { product = { sku = "RDG-moss-42b" }, create = { parent = { sku = "RDG-moss" } }, set = { { attr = "core.size", value = 42 } } } },
                "independent"))
            test.eq(moved.outcomes[1].outcome, "updated")
            test.eq(moved.outcomes[2].outcome, "updated")
            test.eq(moved.outcomes[3].outcome, "created")
        end)
    end)

    test.describe("hierarchy rules", function()
        test.it("creates children only under models of the same family", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(create(h, "X", "RDG-moss-40", { { attr = "core.size", value = 1 } }).outcome, "invalid")
            test.eq(create(h, "X", "RDG", { { attr = "core.color", value = "clay" } }, "generic").outcome, "invalid")
            test.eq(create(h, "RDG-clay", "RDG", { { attr = "core.color", value = "clay" } }).outcome, "created")
            test.eq(assert(steps.get(h, "RDG-clay")).product.family, "footwear")
            local shell = create(h, "SHELL", nil, nil, "generic")
            test.eq(shell.outcome, "created")
            local got = assert(steps.get(h, "SHELL"))
            test.eq(got.product.level, 0)
            test.is_true(got.product.is_item)
            test.eq(create(h, "SHELL-1", "SHELL").outcome, "invalid")
        end)

        test.it("refuses unknown parents, families and statuses", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(create(h, "X", "nope").outcome, "invalid")
            trash(h, "RDG-slate-42")
            test.eq(create(h, "X", "RDG-slate-42").outcome, "invalid")
            test.eq(create(h, "X", nil, nil, "nope").outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "X" }, create = { family = "generic" }, status = "paused" }).outcome, "invalid")
            local missing, absent = steps.get(h, "X")
            test.is_nil(missing)
            test.eq((absent :: error):kind(), errors.NOT_FOUND)
            test.eq(steps.one(h, { product = { sku = "D" }, create = { family = "generic" }, status = "draft" }).outcome, "created")
            test.eq(steps.count(h, { status = "draft" }), 1)
        end)

        test.it("keeps each command item to one kind of change", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local v = steps.version(h, "RDG-moss-40")
            local base: types.ProductRef = { sku = "RDG-moss-40" }
            local mixes: { types.ApplyItem } = {
                { product = base, expect_version = v, move = { parent = { sku = "RDG-slate" } }, set = { { attr = "core.gtin", value = "y" } } },
                { product = base, expect_version = v, move = { parent = { sku = "RDG-slate" } }, delete = true },
                { product = base, expect_version = v, delete = true, status = "draft" },
                { product = base, expect_version = v, move = { parent = { sku = "RDG-slate" } }, status = "draft" },
            }
            for i, item in ipairs(mixes) do test.eq(steps.one(h, item).outcome, "invalid", "mix " .. i) end
        end)
    end)

    test.describe("moves", function()
        test.it("moves a variant under a sibling model and re-inherits its values", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.set(h, "RDG-moss-40", "core.size", 43)
            local moved = steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"),
                move = { parent = { sku = "RDG-slate" } } })
            test.eq(moved.outcome, "updated")
            local item = assert(steps.get(h, "RDG-moss-40"))
            test.eq(item.product.parent_id, assert(steps.get(h, "RDG-slate")).product.product_id)
            test.eq((item.values["core.color"].value :: types.Ref).ref[2], "colors:slate")
            test.eq(steps.count(h, { parent = { sku = "RDG-slate" } }), 4)
            local hist = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 1 }) :: types.HistoryResult
            test.eq(hist.entries[1].kind, "moved")
        end)

        test.it("refuses moves that leave the root, the level or a live parent", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local function move(sku: string, parent: types.ProductRef): string
                return steps.one(h, { product = { sku = sku }, expect_version = steps.version(h, sku), move = { parent = parent } }).outcome
            end
            test.eq(move("RDG-moss-40", { sku = "RDG-moss" }), "unchanged")
            test.eq(move("RDG-moss-40", { sku = "RDG" }), "invalid")
            test.eq(move("RDG-moss", { sku = "RDG" }), "invalid")
            test.eq(move("RDG", { sku = "RDG" }), "invalid")
            create(h, "RDX", nil, nil, "footwear")
            create(h, "RDX-moss", "RDX", { { attr = "core.color", value = "moss" } })
            test.eq(move("RDG-moss-41", { sku = "RDX-moss" }), "invalid")
            create(h, "RDG-clay", "RDG", { { attr = "core.color", value = "clay" } })
            trash(h, "RDG-clay")
            test.eq(move("RDG-moss-41", { sku = "RDG-clay" }), "invalid")
            test.eq(move("RDG-moss-41", { id = assert(steps.get(h, "RDG-slate")).product.product_id }), "conflict")
        end)
    end)

    test.describe("descendant limit", function()
        test.it("counts in-command creates and restores toward the root limit", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local made = 8
            local n = 0
            while made < 2000 do
                local items: { types.ApplyItem } = {}
                -- This test exercises the descendant cap; request throughput is bounded separately.
                while #items < 100 and made < 2000 do
                    n = n + 1
                    items[#items + 1] = { product = { sku = "RDG-moss-g" .. n }, create = { parent = { sku = "RDG-moss" } },
                        set = { { attr = "core.size", value = 1000 + n } } }
                    made = made + 1
                end
                local began = time.now():unix_nano()
                local result, apply_err = steps.apply(h, items)
                local elapsed = (time.now():unix_nano() - began) / time.SECOND
                local out = assert(result, string.format("%d-item apply elapsed %.3fs: %s", #items, elapsed, tostring(apply_err)))
                assert(out.applied, "batch applied")
            end
            local over = create(h, "RDG-moss-over", "RDG-moss", { { attr = "core.size", value = 99999 } })
            test.eq(over.outcome, "invalid")
            local id = assert(steps.get(h, "RDG-moss-g1")).product.product_id
            trash(h, "RDG-moss-g1")
            local freed = assert(steps.apply(h, {
                { product = { sku = "RDG-moss-g1a" }, create = { parent = { sku = "RDG-moss" } }, set = { { attr = "core.size", value = 77777 } },
                    status = "bogus" },
                { product = { sku = "RDG-moss-g1b" }, create = { parent = { sku = "RDG-moss" } }, set = { { attr = "core.size", value = 88888 } } } },
                "independent"))
            test.eq(freed.outcomes[1].outcome, "invalid")
            test.eq(freed.outcomes[2].outcome, "created")
            local db_version = steps.one(h, { product = { id = id }, expect_version = "any", restore = true })
            test.eq(db_version.outcome, "invalid")
        end)
    end)
end

return { run = test.run_cases(define) }
