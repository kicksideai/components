-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local blocks = require("blocks")
local function define()
    test.describe("Work Blocks", function()
        test.it("offers public tools as virtual Blocks", function()
            local catalog = assert(blocks.catalog())
            for _, name in ipairs({"find_items","get_item","apply","transition","comment","report",
                "bulk","bulk_status","cancel_bulk","plan_move","move","move_status"}) do
                local id = "kickside.work.traits:" .. name
                local current = catalog[id]
                test.not_nil(current); test.eq(current.source_kind, "tool"); test.is_true(current.public)
                local plan, err = blocks.plan({block_id=id,config={}})
                test.is_nil(err,tostring(err)); test.not_nil(plan)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
