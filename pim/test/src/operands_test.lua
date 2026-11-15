-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The operands $now and $actor in a filter tree, and time keys that order
-- fractional seconds with whole seconds.
local test = require("test")
local fixtures = require("fixtures")

type Map = { [string]: unknown }

local function define()
    test.describe("operands", function()
        test.it("resolves $actor and $now where a value is taken", function()
            local h = fixtures.db()
            local t = fixtures.table(h)
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "lt", { ["$now"] = "P0D" })), "r1,r2,r3,r4")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "gt", { ["$now"] = "P36500D" })), "")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "lt", { ["$now"] = "-P36500D" })), "")
            test.eq(fixtures.ids(h, t, fixtures.leaf("color", "neq", { ["$actor"] = "id" })), "r1,r2,r3,r4,r5,r6,r7,r8")
            test.eq(fixtures.ids(h, t, fixtures.leaf("color", "in", { "moss", { ["$actor"] = "id" } })), "r1,r2")
            h:release()
        end)

        test.it("reads $now offsets in weeks, days, hours, minutes and seconds", function()
            local h = fixtures.db()
            local t = fixtures.table(h)
            for _, offset in ipairs({ "PT0S", "-PT1H", "-P2W", "-P1DT2H3M4S", "PT90M" }) do
                local _, err = fixtures.run(h, t, fixtures.leaf("at", "lt", { ["$now"] = offset }))
                test.is_nil(err, offset)
            end
            h:release()
        end)

        test.it("refuses unknown operands, offsets and misplaced operands", function()
            local h = fixtures.db()
            local t = fixtures.table(h)
            local refused: { Map } = {
                fixtures.leaf("color", "eq", { ["$actor"] = "groups" }),
                fixtures.leaf("color", "eq", { ["$actor"] = "name" }),
                fixtures.leaf("color", "eq", { ["$thing"] = "id" }),
                fixtures.leaf("color", "eq", { ["$actor"] = "id", extra = 1 }),
                fixtures.leaf("at", "lt", { ["$now"] = "soon" }),
                fixtures.leaf("at", "lt", { ["$now"] = "P" }),
                fixtures.leaf("at", "lt", { ["$now"] = "PT" }),
                fixtures.leaf("at", "lt", { ["$now"] = "P1M" }),
                fixtures.leaf("at", "lt", { ["$now"] = "P1Y" }),
                fixtures.leaf("at", "lt", { ["$now"] = 5 }),
                fixtures.leaf("at", "lt", { ["$now"] = "P99999999999999D" }),
                fixtures.leaf("size", "lt", { ["$now"] = "P0D" }),
                fixtures.leaf("size", "eq", { ["$actor"] = "id" }),
            }
            for i, where in ipairs(refused) do
                local _, err = fixtures.run(h, t, where)
                test.not_nil(err, "case " .. i)
            end
            local anonymous, derr = fixtures.run_as(h, t, fixtures.leaf("color", "eq", { ["$actor"] = "id" }), nil)
            test.is_nil(anonymous)
            test.not_nil(derr)
            h:release()
        end)
    end)

    test.describe("time keys", function()
        test.it("orders fractional seconds with whole seconds", function()
            local h = fixtures.db()
            local t = fixtures.table(h)
            local plain = "2026-01-01T00:00:00Z"
            assert(not fixtures.reindex(h, t, "r5", "2026-01-01T00:00:00.5Z"))
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "gt", plain)), "r2,r3,r4,r5")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "eq", "2026-01-01T00:00:00.500Z")), "r5")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "lt", "2026-01-01T00:00:00.9Z")), "r1,r5")
            test.eq(fixtures.ids(h, t, fixtures.leaf("at", "eq", "2026-01-01T00:00:00.0Z")), "r1")
            h:release()
        end)
    end)
end

return { run = test.run_cases(define) }
