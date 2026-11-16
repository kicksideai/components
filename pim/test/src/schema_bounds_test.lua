-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")

local function record(depth: integer): types.AttributeConfig
    local config: types.AttributeConfig = { members = { value = { form = "text" } } }
    for _ = 2, depth do config = { members = { child = { form = "record", members = config.members } } } end
    return config
end

local function define()
    test.describe("schema bounds and defaults", function()
        test.it("admits three record levels and refuses four before changing the schema", function()
            local h = fixture.catalog()
            assert(h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "three", type = "kickside.pim.types:record", config = record(3) },
            } } } } }))
            local before = assert(h.call("get_schema", {})).schema_generation
            local out, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "four", type = "kickside.pim.types:record", config = record(4) },
            } } } } })
            test.is_nil(out)
            test.not_nil(err)
            if err then
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "invalid_schema")
            end
            test.eq(assert(h.call("get_schema", {})).schema_generation, before)
        end)

        test.it("normalizes scoped defaults and resolves them after candidates while clears stop resolution", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "label", type = "kickside.pim.types:text", scope = { "locale" }, default = "Default", index = "text", index_contexts = { { locale = "en" } } },
                { code = "rank", type = "kickside.pim.types:integer", scope = { "locale" }, default = "0042", index = "number", index_contexts = { { locale = "en" } } },
            } } } } })
            test.is_nil(err)
            test.not_nil(out)
            if err then return end
            local got = assert(steps.get(h, "RDG-moss-40", { locale = "de-AT" }))
            test.eq(got.values["core.label"].value, "Default")
            test.eq(got.values["core.label"].state, "default")
            test.eq(got.values["core.rank"].value, 42)
            steps.rebuilt(h)
            test.eq(#assert(h.call("query", { where = { field = "core.rank", ctx = { locale = "en" }, op = "eq", value = 42 } })).items, 6)
            test.eq(#assert(h.call("query", { text = "Default" })).items, 6)
            steps.set(h, "RDG", "core.label", "Hallo", { locale = "de" })
            test.eq(assert(steps.get(h, "RDG-moss-40", { locale = "de-AT" })).values["core.label"].value, "Hallo")
            steps.one(h, { product = { sku = "RDG" }, expect_version = "any", clear = { { attr = "core.label", ctx = { locale = "de" } } } })
            test.eq(assert(steps.get(h, "RDG-moss-40", { locale = "de-AT" })).values["core.label"].state, "cleared")
            steps.one(h, { product = { sku = "RDG" }, expect_version = "any", unset = { { attr = "core.label", ctx = { locale = "de" } } } })
            test.eq(assert(steps.get(h, "RDG-moss-40", { locale = "de-AT" })).values["core.label"].state, "default")
            local released = assert(h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), channels = { "web" } } } }))
            local snap = assert(h.call("get_release", { release_id = released.outcomes[1].release_id })).release.snapshot
            test.eq(snap.values["core.label"]["locale=de-AT"], "Default")
            test.eq(snap.values["core.rank"]["locale=de-AT"], 42)
        end)
    end)
end

return { run = test.run_cases(define) }
