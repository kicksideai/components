-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local steps = require("steps")

local function define()
    test.describe("fleet retention", function()
        test.it("closes a discovery lap while larger board IDs are still being inserted", function()
            local sample = fixture.board()
            steps.retention_sweep()
            local db = assert(store.open())
            local prefix = "ffffffff-ffff-4fff-8fff-"
            local first = prefix .. "000000000001"
            local function insert(n: integer)
                local id = prefix .. string.format("%012d", n)
                assert(db:execute("INSERT INTO kickside_thread (id, thread_class) VALUES ($1, 'work.board')", { id }))
                assert(db:execute([[INSERT INTO kickside_work_board
                    (board_id,key_prefix,generation,schema_version,compiled,digest,applied_seq,counter,tombstone_floor_seq,created_at,updated_at)
                    SELECT $1,key_prefix,generation,schema_version,compiled,digest,0,0,0,created_at,updated_at
                    FROM kickside_work_board WHERE board_id=$2]], { id, sample.id }))
            end
            insert(1)
            insert(2)
            assert(db:execute([[UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,
                inclusive=1,board_scan='all',pending_page_budget=0 WHERE owner_id='work']], { first }))
            assert(sample.call("set_setting", { namespace = "kickside.work", key = "cleanup_batch", value = 1 }))
            local ok, err = pcall(function()
                test.is_true(steps.retention_run().needs_continue)
                insert(3)
                test.is_false(steps.retention_run().needs_continue, "new keys belong to the next lap")
            end)
            assert(sample.call("unset_setting", { namespace = "kickside.work", key = "cleanup_batch" }))
            for n = 1, 3 do
                local id = prefix .. string.format("%012d", n)
                assert(db:execute("DELETE FROM kickside_work_board WHERE board_id=$1", { id }))
                assert(db:execute("DELETE FROM kickside_thread WHERE id=$1", { id }))
            end
            db:release()
            assert(ok, tostring(err))
        end)

        test.it("reopens discovery after inspection-only pending pages use its allowance", function()
            local hot, target = fixture.board(), fixture.board()
            if hot.id < target.id then hot, target = target, hot end
            steps.retention_sweep()
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE ids(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM ids WHERE n<1000)
                INSERT INTO kickside_work_visibility (board_id,item_id,seq,document,at)
                SELECT $1,'inspect-' || CAST(n AS text),n,'{}','2099-01-01T00:00:00.000000000Z' FROM ids]], { hot.id }))
            assert(db:execute("UPDATE kickside_work_board SET retention_after='',retention_due_ms=0 WHERE board_id=$1", { hot.id }))
            assert(db:execute([[INSERT INTO kickside_work_receipt (board_id,command_key,request_hash,principal,at,result,seq)
                VALUES ($1,'rediscover','hash','fixture','2000-01-01T00:00:00.000000000Z','{}',1)]], { target.id }))
            assert(db:execute([[UPDATE kickside_work_retention SET orphan_after='~',board_after=$1,
                inclusive=1,board_scan='pending',pending_page_budget=1 WHERE owner_id='work']], { target.id }))
            db:release()
            assert(hot.call("set_setting", { namespace = "kickside.work", key = "retention_batch", value = 205 }))
            local ok, err = pcall(function()
                local first = steps.retention_run()
                test.is_true(first.needs_continue)
                test.eq(first.deleted, 0, "the pending page only inspected future candidates")
                steps.retention_run()
                steps.retention_run()
                test.eq(steps.count_rows("kickside_work_receipt", target.id, " AND command_key='rediscover'"), 0)
            end)
            assert(hot.call("unset_setting", { namespace = "kickside.work", key = "retention_batch" }))
            db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_work_visibility WHERE board_id=$1 AND item_id LIKE 'inspect-%'", { hot.id }))
            assert(db:execute("DELETE FROM kickside_work_receipt WHERE board_id=$1 AND command_key='rediscover'", { target.id }))
            db:release()
            assert(ok, tostring(err))
        end)

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
                board_scan='all',pending_page_budget=0,board_through=NULL,discovery_turn=0 WHERE owner_id='work']], {}))
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
