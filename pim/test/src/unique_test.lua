-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- SKU and unique attribute values: case, length, in-command claims and keys.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")

local function create(h: fixture.Handle, sku: string, set: { types.ValueEntry }?): types.Outcome
    return steps.one(h, { product = { sku = sku }, create = { family = "generic" }, set = set })
end

local function define()
    test.describe("sku", function()
        test.it("is case and space sensitive and 1..128 bytes", function()
            local h = fixture.catalog()
            test.eq(create(h, "rdg").outcome, "created")
            test.eq(create(h, "RDG").outcome, "created")
            test.eq(create(h, " RDG").outcome, "created")
            test.eq(create(h, string.rep("s", 128)).outcome, "created")
            test.eq(create(h, string.rep("s", 129)).outcome, "invalid")
            test.eq(create(h, "").outcome, "invalid")
            test.eq(steps.one(h, { create = { family = "generic" } }).outcome, "invalid")
        end)
    end)

    test.describe("unique values", function()
        test.it("compares identifiers exactly and reports the holder", function()
            local h = fixture.catalog()
            test.eq(create(h, "A", { { attr = "core.gtin", value = "ABC" } }).outcome, "created")
            test.eq(create(h, "B", { { attr = "core.gtin", value = "abc" } }).outcome, "created")
            local clash = create(h, "C", { { attr = "core.gtin", value = "ABC" } })
            test.eq(clash.outcome, "conflict")
            local f = (clash.findings :: { types.Finding })[1]
            test.eq(f.attribute, "core.gtin")
            test.eq(f.holder, assert(steps.get(h, "A")).product.product_id)
            test.eq(steps.set(h, "A", "core.gtin", "ABC").outcome, "unchanged")
        end)

        test.it("refuses a duplicate created twice in one atomic command", function()
            local h = fixture.catalog()
            local out = assert(steps.apply(h, {
                { product = { sku = "A" }, create = { family = "generic" }, set = { { attr = "core.gtin", value = "X" } } },
                { product = { sku = "B" }, create = { family = "generic" }, set = { { attr = "core.gtin", value = "X" } } } }))
            test.is_false(out.applied)
            test.eq(out.outcomes[2].outcome, "conflict")
            test.not_nil(select(2, steps.get(h, "A")))
        end)

        test.it("hands a value released earlier in the command to a later item", function()
            local h = fixture.catalog()
            create(h, "A", { { attr = "core.gtin", value = "X" } })
            create(h, "B")
            local unset = assert(steps.apply(h, {
                { product = { sku = "A" }, expect_version = steps.version(h, "A"), unset = { { attr = "core.gtin" } } },
                { product = { sku = "B" }, expect_version = steps.version(h, "B"), set = { { attr = "core.gtin", value = "X" } } } }))
            test.eq(unset.outcomes[2].outcome, "updated")
            local swap = assert(steps.apply(h, {
                { product = { sku = "B" }, expect_version = steps.version(h, "B"), set = { { attr = "core.gtin", value = "Y" } } },
                { product = { sku = "A" }, expect_version = steps.version(h, "A"), set = { { attr = "core.gtin", value = "X" } } } }))
            test.eq(swap.outcomes[2].outcome, "updated")
            test.eq(assert(steps.get(h, "A")).values["core.gtin"].value, "X")
        end)

        test.it("refuses values whose key exceeds 256 bytes", function()
            local h = fixture.catalog()
            local long = string.rep("g", 300)
            test.eq(create(h, "A", { { attr = "core.gtin", value = long } }).outcome, "invalid")
            test.eq(create(h, "B", { { attr = "core.size", value = 1 }, { attr = "core.name", ctx = { locale = "en" }, value = long } }).outcome, "created")
        end)

        test.it("compares numbers and quantities by key", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "logistics", attributes = {
                { code = "code", type = "kickside.pim.types:number", unique = true },
                { code = "mass", type = "kickside.pim.types:quantity", unique = true,
                    config = { units = { kg = "1", g = "0.001", lb = "0.45359237" }, canonical = "kg" } } } } } } })
            test.is_nil(err)
            test.eq(create(h, "A", { { attr = "logistics.code", value = "1.50" } }).outcome, "created")
            test.eq(create(h, "B", { { attr = "logistics.code", value = "1.5" } }).outcome, "conflict")
            test.eq(create(h, "C", { { attr = "logistics.mass", value = "1 lb" } }).outcome, "created")
            test.eq(create(h, "D", { { attr = "logistics.mass", value = "453.59237 g" } }).outcome, "conflict")
        end)

        test.it("refuses unique on a populated attribute and enforces it on an unused one", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, used = h.call("apply_schema", { declaration = { aspects = { { namespace = "logistics", attributes = {
                { code = "net_weight", type = "kickside.pim.types:number", index = "number", config = { scale = 3 }, unique = true } } } } } })
            test.not_nil(used)
            local _, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "logistics", attributes = {
                { code = "net_weight", type = "kickside.pim.types:number", index = "number", config = { scale = 3 } },
                { code = "batch", type = "kickside.pim.types:identifier", unique = true } } } } } })
            test.is_nil(err)
            test.eq(steps.set(h, "RDG", "logistics.batch", "B1").outcome, "updated")
            test.eq(create(h, "OTHER", { { attr = "logistics.batch", value = "B1" } }).outcome, "conflict")
        end)

        test.it("frees sku and unique values of a purged product for reuse", function()
            local h = fixture.catalog()
            create(h, "A", { { attr = "core.gtin", value = "X" } })
            steps.one(h, { product = { sku = "A" }, expect_version = steps.version(h, "A"), delete = true })
            test.eq(create(h, "A", { { attr = "core.gtin", value = "X" } }).outcome, "created")
        end)
    end)
end

return { run = test.run_cases(define) }
