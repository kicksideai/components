-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Rank through apply, ordered children and the projection transaction.
local test = require("test")
local time = require("time")
local json = require("json")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local rows = require("rows")
local store = require("store")
local materializer = require("materializer")
local domain = require("domain")

type Map = { [string]: unknown }

local function item(h: fixture.Handle, id: string): Map
    return assert(steps.get(h, id)).item :: Map
end

local function define()
    test.describe("rank", function()
        test.it("assigns board-end keys and orders a parent's children by rank", function()
            local h = scoped.board(scoped.admin())
            local p = steps.create(h, "story", { title = "P" })
            local a = steps.create(h, "task", { title = "A" }, p)
            local b = steps.create(h, "task", { title = "B" }, p)
            local c = steps.create(h, "task", { title = "C" }, p)
            test.is_true((item(h, p).rank :: string) < (item(h, a).rank :: string))
            test.is_true((item(h, a).rank :: string) < (item(h, b).rank :: string))
            test.eq(steps.one(h, { op = "rank", item = c, after = a, before = b }).status, "applied")
            local children = assert(steps.get(h, p, { "children" })).children :: { Map }
            test.eq(children[1].id, a)
            test.eq(children[2].id, c)
            test.eq(children[3].id, b)
            test.eq(steps.one(h, { op = "rank", item = b, before = a }).status, "applied")
            test.eq((assert(steps.get(h, p, { "children" })).children :: { Map })[1].id, b)
            test.eq(steps.one(h, { op = "rank", item = b }).status, "applied")
            test.eq((assert(steps.get(h, p, { "children" })).children :: { Map })[3].id, b)
        end)

        test.it("places an item directly beside a single named neighbor", function()
            local h = scoped.board(scoped.admin())
            local p = steps.create(h, "story", { title = "P" })
            local a = steps.create(h, "task", { title = "A" }, p)
            local b = steps.create(h, "task", { title = "B" }, p)
            local c = steps.create(h, "task", { title = "C" }, p)
            local d = steps.create(h, "task", { title = "D" }, p)
            local function order(): { unknown }
                local out = {}
                for i, child in ipairs(assert(steps.get(h, p, { "children" })).children :: { Map }) do out[i] = child.id end
                return out
            end
            test.eq(steps.one(h, { op = "rank", item = d, after = a }).status, "applied")
            local first = order()
            test.eq(first[1], a)
            test.eq(first[2], d)
            test.eq(first[3], b)
            test.eq(first[4], c)
            test.eq(steps.one(h, { op = "rank", item = a, before = c }).status, "applied")
            local second = order()
            test.eq(second[1], d)
            test.eq(second[2], b)
            test.eq(second[3], a)
            test.eq(second[4], c)
        end)

        test.it("generates keys of digits and lowercase letters, which sort alike in every collation", function()
            local h = fixture.board()
            local a, b, c = steps.create(h, "task"), steps.create(h, "task"), steps.create(h, "task")
            test.eq(steps.one(h, { op = "rank", item = c, after = a, before = b }).status, "applied")
            test.eq(steps.one(h, { op = "rank", item = b, before = c }).status, "applied")
            for _, id in ipairs({ a, b, c }) do
                test.not_nil((item(h, id).rank :: string):match("^[0-9a-z]+$"))
            end
        end)

        test.it("keeps generated keys open to insertion at a prefix boundary", function()
            local h = fixture.board()
            local boundary, a, b, c, d = steps.create(h, "task"), steps.create(h, "task"), steps.create(h, "task"), steps.create(h, "task"), steps.create(h, "task")
            local edge = item(h, boundary).rank :: string
            test.is_false(edge:sub(-1) == "0")
            local prefix = edge:sub(1, 2)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET rank = $1 WHERE board_id = $2 AND item_id = $3", { prefix, h.id, a }))
            db:release()
            test.eq(steps.one(h, { op = "rank", item = b, after = a, before = boundary }).status, "applied")
            local inserted = item(h, b).rank :: string
            test.is_true(prefix < inserted and inserted < edge)
            test.eq(steps.one(h, { op = "rank", item = c, after = b, before = boundary }).status, "applied")
            test.eq(steps.one(h, { op = "rank", item = d, after = a, before = b }).status, "applied")
            test.is_true((item(h, d).rank :: string) < inserted)
        end)

        test.it("keeps a crowded midpoint strict while the rebalance demand waits", function()
            local h = fixture.board()
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            local tx = assert(db:begin())
            local bound = string.rep("z", 65)
            assert(tx:execute("UPDATE kickside_work_item SET rank = $1 WHERE board_id = $2 AND item_id = $3", { bound, h.id, b }))
            local seq = board.applied_seq + 1
            local folded = assert(materializer.fold(tx, db:type(), h.id, {
                { seq = seq, type = "kickside.work.events:item.ranked", body = { item = a, after = b } },
            }, seq, 5000))
            local key = assert(store.item(tx, h.id, a)).rank :: string
            tx:rollback()
            db:release()
            test.is_true(key > bound)
            test.not_nil(folded.rebalance_job)
        end)

        test.it("keeps edit CAS and version independent and writes rank history once", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A" })
            local b = steps.create(h, "task", { title = "B" })
            local v = steps.version(h, a)
            local out = steps.parallel(h, {
                { ops = { { op = "rank", item = a, after = b, expect_version = 0 } } },
                { ops = { { op = "set", item = a, expect_version = v, values = { title = "edited" } } } },
            })
            for _, result in ipairs(out) do test.eq((result.outcomes :: { Map })[1].status, "applied") end
            test.eq(steps.version(h, a), v + 1)
            test.eq(steps.one(h, { op = "rank", item = a, before = b }).status, "applied")
            local ranked = 0
            for _, e in ipairs(assert(h.call("list_history", { item = { id = a } })).entries) do
                if e.kind == "rank" then ranked = ranked + 1 end
            end
            test.eq(ranked, 2)
            test.eq(steps.one(h, { op = "set", item = a, expect_version = v + 1, values = { title = "again" } }).status, "applied")
        end)

        test.it("refuses unavailable neighbors and malformed bounds in prepare", function()
            local h = fixture.board()
            local a = steps.create(h, "task")
            local b = steps.create(h, "task")
            local foreign = steps.create(fixture.board(), "task")
            local gone = "00000000-0000-0000-0000-000000000000"
            assert(steps.one(h, { op = "delete", item = b }).status == "applied")
            for _, neighbor in ipairs({ b, foreign, gone, a }) do
                test.eq(steps.one(h, { op = "rank", item = a, after = neighbor }).status, "invalid")
            end
            test.eq(steps.one(h, { op = "rank", item = a, before = 3 }).status, "invalid")
            test.eq(steps.one(h, { op = "rank", item = b }).status, "invalid")
        end)

        test.it("resolves concurrent moves and keyed retries without edit conflicts", function()
            local h = fixture.board()
            local a, b, c = steps.create(h, "task"), steps.create(h, "task"), steps.create(h, "task")
            local out = steps.parallel(h, {
                { key = "move", ops = { { op = "rank", item = a, after = b, before = c } } },
                { ops = { { op = "rank", item = c, before = b } } },
            })
            for _, result in ipairs(out) do test.eq((result.outcomes :: { Map })[1].status, "applied") end
            local before = item(h, a).rank
            local retry = assert(steps.apply(h, { { op = "rank", item = a, after = b, before = c } }, { key = "move" }))
            test.is_true(retry.replayed)
            test.eq(item(h, a).rank, before)
            test.eq(steps.version(h, a), 1)
        end)

        test.it("uses member scope and board WRITE access for rank commands", function()
            local admin, member, reader = scoped.admin(), scoped.member(), scoped.member()
            local h = scoped.board(admin)
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local allowed = member.http("POST", member.route(h.id, "apply"), { ops = { { op = "rank", item = a, after = b } } })
            test.eq(allowed.status, 200)
            test.eq(allowed.body.data.outcomes[1].status, "applied")
            local denied = reader.http("POST", reader.route(h.id, "apply"), { ops = { { op = "rank", item = a, before = b } } })
            test.eq(denied.status, 403)
            local read = reader.http("POST", reader.route(h.id, "get"), { item = { id = a } })
            test.eq(read.status, 200)
            test.not_nil(read.body.data.item.rank)
        end)

        test.it("folds stale neighbor bounds deterministically across replay", function()
            local h = fixture.board()
            local a, b, c = steps.create(h, "task"), steps.create(h, "task"), steps.create(h, "task")
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            local first = board.applied_seq + 1
            local events: { domain.RawEvent } = {
                { seq = first, type = "kickside.work.events:item.deleted", body = { item = b, at = "2026-11-04T00:00:00Z" } },
                { seq = first + 1, type = "kickside.work.events:item.ranked", body = { item = a, after = b, before = c } },
                { seq = first + 2, type = "kickside.work.events:item.ranked", body = { item = c, after = a, before = b } },
            }
            local keys: { string } = {}
            for i = 1, 2 do
                local tx = assert(db:begin())
                assert(materializer.fold(tx, db:type(), h.id, events, first + 2, 5000))
                keys[i] = assert(store.item(tx, h.id, a)).rank :: string
                tx:rollback()
            end
            db:release()
            test.eq(keys[1], keys[2])
            test.is_true(keys[1] < (item(h, c).rank :: string))
        end)

        test.it("rebalances more than 500 rows through identity-free slot demand", function()
            local h = scoped.board(scoped.admin())
            local ids: { string } = {}
            for _ = 1, 3 do
                local ops: { Map } = {}
                for _ = 1, 200 do ops[#ops + 1] = { op = "create", type = "task" } end
                for _, o in ipairs((assert(steps.apply(h, ops)).outcomes :: { Map })) do ids[#ids + 1] = o.item :: string end
            end
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET rank = $1 WHERE board_id = $2 AND item_id = $3",
                { string.rep("z", 64) .. "i", h.id, ids[#ids] }))
            db:release()
            assert(steps.one(h, { op = "rank", item = ids[1], after = ids[#ids] }).status == "applied")
            steps.wait_for("rank rebalance", function()
                return rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_job WHERE board_id = $1 AND job_type = 'rebalance' AND status = 'done'", { h.id }) == 1
            end)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND length(rank) > 64", { h.id }), 0)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND version <> 1", { h.id }), 0)
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1 AND kind = 'rank'", { h.id }), 1)
            local events = steps.events(h)
            local batches = 0
            for _, e in ipairs(events) do
                if e.type == "kickside.work.events:rank.rebalanced" then
                    batches = batches + 1
                    test.is_true((e.body :: Map).count <= 500)
                    test.is_false(json.encode(e):find("actor_context", 1, true) ~= nil)
                end
            end
            test.is_true(batches >= 2)
            test.is_true((item(h, ids[600]).rank :: string) < (item(h, ids[1]).rank :: string))
        end)

        test.it("benchmarks rank fold throughput with durable history and replay", function()
            local h = fixture.board()
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            local events: { domain.RawEvent } = {}
            for i = 1, 1000 do
                events[i] = { seq = board.applied_seq + i, type = "kickside.work.events:item.ranked",
                    body = { item = a, after = i % 2 == 0 and b or nil, before = i % 2 == 1 and b or nil, actor = h.actor:id(), at = "2026-11-04T00:00:00Z" } }
            end
            local tx = assert(db:begin())
            local start = time.now():unix_nano()
            assert(materializer.fold(tx, db:type(), h.id, events, events[#events].seq :: integer, 5000))
            assert(tx:commit())
            local elapsed = (time.now():unix_nano() - start) / 1e9
            assert(db:execute([[CREATE TABLE IF NOT EXISTS app_work_rank_benchmark
                (board_id TEXT PRIMARY KEY, engine TEXT, moves INTEGER, seconds DOUBLE PRECISION, moves_per_second DOUBLE PRECISION)]]))
            assert(db:execute("INSERT INTO app_work_rank_benchmark VALUES ($1, $2, $3, $4, $5)",
                { h.id, db:type(), 1000, elapsed, 1000 / elapsed }))
            local replay = assert(db:begin())
            assert(materializer.fold(replay, db:type(), h.id, events, events[#events].seq :: integer, 5000))
            assert(replay:commit())
            db:release()
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1 AND kind = 'rank'", { h.id }), 1000)
            test.eq(steps.version(h, a), 1)
        end)
    end)
end

return { run = test.run_cases(define) }
