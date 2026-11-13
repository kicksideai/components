-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local operations = require("operation_steps")
local sql = require("sql")

local function define()
    test.describe("deferred page boundary", function()
        test.it("pauses after a committed page when an earlier attempt is interrupted", function()
            local h = fixture.board()
            operations.gate(h, true)
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE work_deferred_gate SET stop_after = 1 WHERE board_id = $1", { h.id }))
            db:release()
            operations.page_gate(h, true)
            for first = 1, 201, 200 do
                local ops: { { [string]: unknown } } = {}
                for i = first, math.min(first + 199, 201) do
                    ops[#ops + 1] = { op = "create", type = "task", values = { estimate = 1 } }
                end
                operations.call(h, "apply", { ops = ops })
            end
            local started = operations.bulk(h, "interrupted-page-boundary")
            steps.wait_for("committed page after an interrupted attempt", function(): boolean
                return operations.call(h, "bulk_status", { bulk_id = started.bulk_id }).processed == 200
            end)
            local cancelled = operations.call(h, "cancel_bulk", { bulk_id = started.bulk_id })
            test.eq(cancelled.status, "cancelled")
            test.eq(cancelled.processed, 200)
            operations.gate(h, true)
            test.eq(operations.call(h, "count", { where = { field = "estimate", op = "eq", value = 2 } }).total, 200)
            test.eq(operations.call(h, "count", { where = { field = "estimate", op = "eq", value = 1 } }).total, 1)
        end)
    end)
end

return { run = test.run_cases(define) }
