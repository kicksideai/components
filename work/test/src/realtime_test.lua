-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")
local store = require("store")
local json = require("json")
local failures = require("failures")
local function define()
    test.describe("board realtime", function()
        test.it("publishes committed public meta to a READ member and refetches changes", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local before = tonumber(assert(member.call("get_meta", {}, h.id)).meta.last_event_seq) or 0
            local response = admin.http("POST", "/" .. h.id .. "/apply", { ops = { { op = "create", type = "task", values = { title = "Realtime" } } } })
            test.eq(response.status, 200)
            steps.wait_for("member public snapshot", function(): boolean
                local meta = assert(member.call("get_meta", {}, h.id)).meta
                return (tonumber(meta.last_event_seq) or 0) > before
            end)
            local meta = assert(member.call("get_meta", {}, h.id)).meta
            test.is_nil(meta.item_count)
            test.is_nil(meta.category_counts)
            local summary=assert(member.call("list",{})).boards[1]
            test.eq(summary.board_id,h.id)
            test.eq(summary.item_count,1)
            test.eq(summary.open_count,1)
            test.eq(meta.reindexing, "false")
            local db = assert(store.open())
            local deliveries = assert(db:query("SELECT data FROM work_test_delivery WHERE user_id = $1 AND topic = $2", { member.id, "component." .. h.id }))
            db:release()
            local seen = false
            for _, row in ipairs(deliveries) do
                local data = json.decode(row.data)
                if data.meta and tonumber(data.meta.last_event_seq) == tonumber(meta.last_event_seq) then seen = true end
            end
            test.is_true(seen)
            local feed = assert(member.call("list_changes", { cursor = { seq = before, item_id = "" } }, h.id))
            test.eq(#feed.items, 1)
            local result, err = member.call("set_runtime_meta", { item_count = 999 }, h.id)
            test.is_nil(result)
            test.not_nil(err)
            test.is_nil(assert(member.call("get_meta", {}, h.id)).meta.item_count)
            test.eq(assert(member.call("list",{})).boards[1].item_count,1)
        end)
        test.it("publishes pending and failed rebuilds and keeps built queries available", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            steps.create(h, "task", { estimate = 5 })
            for _, kind in ipairs({ "reindex", "recompute" }) do
                local db = assert(store.open())
                assert(db:execute([[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status)
                    VALUES ($1, $2, $3, $4, 'pending')]], { h.id, "failed-" .. kind, kind,
                    json.encode({ generation = 1, after = "", fields = { "estimate" } }) }))
                db:release()
                local failure = errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "rebuild test failure", details = { code = "rebuild_test" } })
                local recorded = failures.record(h.id, "failed-" .. kind, failure)
                test.eq(recorded:kind(), errors.UNAVAILABLE)
                test.eq(recorded:details().code, "rebuild_test")
                local meta = assert(member.call("get_meta", {}, h.id)).meta
                test.eq(meta.reindexing, "false")
                test.eq(meta.status, "error")
                test.is_true(meta.rebuild_error:find("rebuild test failure", 1, true) ~= nil)
                test.eq(#assert(member.call("query", {}, h.id)).items, 1)
                if kind == "reindex" then
                    local _, err = member.call("query", { where = { field = "estimate", op = "eq", value = 5 } }, h.id)
                    test.not_nil(err)
                    test.eq(err:details().code, "rebuild_failed")
                end
                db = assert(store.open())
                assert(db:execute("DELETE FROM kickside_work_job WHERE board_id = $1 AND job_id = $2", { h.id, "failed-" .. kind }))
                db:release()
            end
        end)
    end)
end
return { run = test.run_cases(define) }
