-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")

local OLD = "2000-01-01T00:00:00.000000000Z"
local count = steps.count_rows

-- The callback bound below measures one board's backlog. Run before the
-- larger fleet fixtures add separate board-discovery pages.
local function define()
    test.describe("board retention backlog", function()
        test.it("drains an age backlog larger than the owner budget without waiting for another sweep", function()
            local board = fixture.board()
            local item = steps.create(board, "task")
            local db = assert(store.open())
            local tx = assert(db:begin())
            for i = 1, 1005 do
                assert(tx:execute([[INSERT INTO kickside_work_approval (board_id,item_id,visit,actor,decision,at)
                    VALUES ($1,$2,0,$3,'approve',$4)]], { board.id, item, tostring(i), OLD }))
            end
            assert(tx:commit())
            assert(db:execute("UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,inclusive=1,board_scan='all',deadline_ms=NULL WHERE owner_id='work'",
                { board.id }))
            db:release()
            local runs = 0
            while count("kickside_work_approval", board.id) > 0 do
                local before = count("kickside_work_approval", board.id)
                local result = steps.retention_run()
                local remaining = count("kickside_work_approval", board.id)
                test.is_true(before - remaining <= 500)
                if remaining > 0 then test.is_true(result.needs_continue) end
                runs = runs + 1
                assert(runs < 10, "owner backlog must drain")
            end
            test.is_true(runs >= 3)
            steps.retention_sweep()
        end)
    end)
end

return { run = test.run_cases(define) }
