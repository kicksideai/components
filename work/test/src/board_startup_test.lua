-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")

local function define()
    test.describe("board startup", function()
        test.it("claims a prefix on the first Create Board after startup", function()
            local admin = scoped.admin()
            local prefix = fixture.fresh_prefix()
            local declaration = { key_prefix = prefix }
            local board, err = admin.call("create", { idempotency_key = "first", declaration = declaration })
            assert(board and not err, steps.detail(err))
            test.eq(board.generation, 1)

            local duplicate, duplicate_err = admin.call("create", { idempotency_key = "duplicate", declaration = declaration })
            test.is_nil(duplicate)
            test.not_nil(duplicate_err)
            test.eq(duplicate_err:details().code, "key_prefix_taken")
            test.eq(#assert(admin.call("list", {})).boards, 1)
        end)
    end)
end

return { run = test.run_cases(define) }
