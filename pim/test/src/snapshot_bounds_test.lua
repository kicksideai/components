-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local values = require("values")

local function define()
    test.describe("release snapshot bounds", function()
        test.it("accepts 524288 bytes expanded over contexts and refuses the next byte without publishing", function()
            local h = fixture.catalog({ bare = true })
            local members = {}
            for i = 1, 8 do members[i] = tostring(i) end
            assert(h.call("apply_schema", { declaration = {
                dimensions = { { name = "a", members = { "1", "2", "3", "4" } }, { name = "b", members = members }, { name = "c", members = members } },
                aspects = { { namespace = "core", attributes = {
                    { code = "body", type = "kickside.pim.types:text", scope = { "a", "b", "c" } },
                    { code = "padding", type = "kickside.pim.types:text" },
                } } }, channels = { { id = "web", requirements = {} } },
            } }))
            test.eq(steps.one(h, { product = { sku = "EXPANDED" }, create = {}, set = {
                { attr = "core.body", ctx = { a = "*", b = "*", c = "*" }, value = string.rep("x", 1900) },
                { attr = "core.padding", value = "" },
            } }).outcome, "created")
            local first = assert(h.call("release", { items = { { product = { sku = "EXPANDED" }, expect_version = 1, channels = { "web" } } } })).outcomes[1]
            test.eq(first.outcome, "released")
            local baseline = assert(h.call("get_release", { release_id = first.release_id })).release.snapshot
            local contexts = 0
            for _ in pairs(baseline.values["core.body"]) do contexts = contexts + 1 end
            test.eq(contexts, 256)
            baseline.version = 2
            local room = 524288 - #values.canonical(baseline)
            test.is_true(room > 0)
            test.eq(steps.set(h, "EXPANDED", "core.padding", string.rep("p", room)).outcome, "updated")
            local exact, err = h.call("release", { items = { { product = { sku = "EXPANDED" }, expect_version = 2, channels = { "web" } } } })
            test.is_nil(err, tostring(err))
            test.eq(exact.outcomes[1].outcome, "released")
            local released = assert(h.call("get_release", { release_id = exact.outcomes[1].release_id })).release
            test.eq(#values.canonical(released.snapshot), 524288)
            test.eq(steps.set(h, "EXPANDED", "core.padding", string.rep("p", room + 1)).outcome, "updated")
            local before = assert(h.call("query", {})).as_of
            local over, oerr = h.call("release", { items = { { product = { sku = "EXPANDED" }, expect_version = 3, channels = { "web" } } } })
            test.is_nil(oerr, tostring(oerr))
            test.eq(over.outcomes[1].outcome, "invalid")
            test.is_false(over.applied)
            test.eq(assert(h.call("query", {})).as_of, before)
            local publications = assert(h.call("list_publications", { channel = "web" }))
            test.eq(#publications.items, 1)
            test.eq(publications.items[1].release_id, released.release_id)
        end)
    end)
end
return { run = test.run_cases(define) }
