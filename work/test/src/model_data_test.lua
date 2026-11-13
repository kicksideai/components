-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")

local function define()
    test.describe("durable model data", function()
        test.it("refuses changing a field form before use and after its values disappear", function()
            local h = fixture.board()
            local change = { fields = { { code = "estimate", form = "dec", index = "number" } } }
            test.eq(assert(h.call("plan_schema", { declaration = change })).class, "refused")
            local id = steps.create(h, "task", { estimate = 4 })
            test.eq(steps.one(h, { op = "set", item = id, unset = { "estimate" } }).status, "applied")
            test.eq(assert(h.call("plan_schema", { declaration = change })).class, "refused")
            local _, err = h.call("apply_schema", { declaration = change })
            test.eq(err:details().code, "migration_required")
        end)
    end)
end
return { run = test.run_cases(define) }
