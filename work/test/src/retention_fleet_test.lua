-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local steps = require("steps")

local function define()
    test.describe("fleet retention", function()
        test.it("bounds directory passes while one board drains many pages", function()
            local boards: { fixture.Handle } = {}
            for i = 1, 12 do boards[i] = fixture.board() end
            table.sort(boards, function(a, b) return a.id < b.id end)
            local hot, sentinel = boards[1], boards[#boards - 1]
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE ids(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM ids WHERE n<901)
                INSERT INTO kickside_work_receipt (board_id,command_key,request_hash,principal,at,result,seq)
                SELECT $1,'fleet-' || CAST(n AS text),'hash','fixture','2000-01-01T00:00:00.000000000Z','{}',n FROM ids]], { hot.id }))
            assert(db:execute([[UPDATE kickside_work_retention SET orphan_after='~',board_after='',inclusive=0,
                board_scan='all',deadline_ms=NULL WHERE owner_id='work']], {}))
            db:release()

            for _, setting in ipairs({ { key = "cleanup_batch", value = 1 }, { key = "retention_batch", value = 205 } }) do
                assert(hot.call("set_setting", { namespace = "kickside.work", key = setting.key, value = setting.value }))
            end
            local ok, err = pcall(function()
                local visits, removed, settled = 0, 0, false
                for _ = 1, 100 do
                    local result = steps.retention_run()
                    removed = removed + (tonumber(result.deleted) or 0)
                    local connection = assert(store.open())
                    local position = assert(connection:query("SELECT board_after FROM kickside_work_retention WHERE owner_id='work'", {}))
                    connection:release()
                    if position[1].board_after == sentinel.id then visits = visits + 1 end
                    if result.needs_continue ~= true then
                        settled = true
                        break
                    end
                end
                test.is_true(settled, "fleet sweep did not reach quiescence")
                test.eq(removed, 901)
                test.eq(steps.count_rows("kickside_work_receipt", hot.id, " AND command_key LIKE 'fleet-%'"), 0)
                test.is_true(visits <= 2, "an idle board was visited " .. visits .. " times while one board drained")
            end)
            for _, key in ipairs({ "cleanup_batch", "retention_batch" }) do
                assert(hot.call("unset_setting", { namespace = "kickside.work", key = key }))
            end
            assert(ok, tostring(err))
        end)
    end)
end

return { run = test.run_cases(define) }
