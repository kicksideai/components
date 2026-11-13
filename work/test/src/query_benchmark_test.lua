-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Postgres exercises query pages and indexed folds over a 100000-item board.
local test = require("test")
local time = require("time")
local uuid = require("uuid")
local fixture = require("fixture")
local scoped = require("scoped")
local store = require("store")
local materializer = require("materializer")
local domain = require("domain")

local function elapsed(start: integer): number
    return (time.now():unix_nano() - start) / 1000000
end

local function define()
    test.describe("query scale", function()
        test.it("benchmarks filtered page, sorted page, count and indexed fold at 100000 items", function()
            local db = assert(store.open())
            if db:type() ~= "postgres" then db:release(); return end
            local session = scoped.admin()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields = {}
            local codes = { "f_one", "f_two", "f_three", "f_four", "f_five" }
            for i, code in ipairs(codes) do d.fields[i] = { code = code, form = "int", index = "number" } end
            d.item_types = { { id = "task", process = "delivery", fields = codes } }
            local h = scoped.board(session, d)
            local board = assert(store.board(db, h.id))
            local seq = board.applied_seq
            local ids: { string } = {}
            local start = time.now():unix_nano()
            for batch = 1, 40 do
                local events: { domain.RawEvent } = {}
                for i = 1, 2500 do
                    local n = (batch - 1) * 2500 + i
                    local id = (uuid.v4())
                    if n <= 1000 then ids[n] = id end
                    local patch: { domain.PatchStep } = {}
                    for f = 1, 5 do patch[f] = { f = f, v = n % (f * 100) } end
                    seq = seq + 1
                    events[i] = { seq = seq, type = "kickside.work.events:item.created", body = {
                        item = id, type = "task", state = "open", patch = patch, actor = session.id, at = "2026-11-04T00:00:00Z",
                    } }
                end
                local tx = assert(db:begin())
                local folded = assert(materializer.fold(tx, db:type(), h.id, events, seq, 5000))
                test.eq(folded.last_seq, seq)
                assert(tx:commit())
            end
            local create_ms = elapsed(start)
            local page = session.http("POST", session.route(h.id, "query"), { where = { field = "f_one", op = "eq", value = 7 }, limit = 200 })
            test.eq(page.status, 200); test.eq(#page.body.data.items, 200)
            local filtered, sorted, count_ms = 0, 0, 0
            for _ = 1, 5 do
                start = time.now():unix_nano()
                page = session.http("POST", session.route(h.id, "query"), { where = { field = "f_one", op = "eq", value = 7 }, limit = 200 })
                filtered = filtered + elapsed(start)
                test.eq(page.status, 200); test.eq(#page.body.data.items, 200)
                start = time.now():unix_nano()
                page = session.http("POST", session.route(h.id, "query"), { order = { field = "f_two", dir = "desc" }, limit = 200 })
                sorted = sorted + elapsed(start)
                test.eq(page.status, 200); test.eq(#page.body.data.items, 200)
                test.eq(page.body.data.items[1].values.f_two, 199)
                start = time.now():unix_nano()
                page = session.http("POST", session.route(h.id, "count"), { where = { field = "f_one", op = "eq", value = 7 } })
                count_ms = count_ms + elapsed(start)
                test.eq(page.status, 200); test.eq(page.body.data.total, 1000); test.eq(page.body.data.estimated, false)
            end
            page = session.http("POST", session.route(h.id, "count"), {})
            test.eq(page.status, 200); test.eq(page.body.data.total, 10000); test.eq(page.body.data.estimated, true)
            local events: { domain.RawEvent } = {}
            for i, id in ipairs(ids) do
                local patch: { domain.PatchStep } = {}
                for f = 1, 5 do patch[f] = { f = f, v = 777 } end
                seq = seq + 1
                events[i] = { seq = seq, type = "kickside.work.events:item.changed", body = {
                    item = id, patch = patch, actor = session.id, at = "2026-11-04T01:00:00Z",
                } }
            end
            local tx = assert(db:begin())
            start = time.now():unix_nano()
            assert(materializer.fold(tx, db:type(), h.id, events, seq, 5000))
            assert(tx:commit())
            local fold_ms = elapsed(start)
            test.eq(assert(h.call("count", { where = { field = "f_one", op = "eq", value = 777 } })).total, 1000)
            assert(db:execute([[CREATE TABLE IF NOT EXISTS app_work_query_benchmark
                (board_id TEXT PRIMARY KEY, items INTEGER, indexed_fields INTEGER, filtered_ms DOUBLE PRECISION,
                 sorted_ms DOUBLE PRECISION, count_ms DOUBLE PRECISION, create_ms DOUBLE PRECISION, edits INTEGER, fold_ms DOUBLE PRECISION)]]))
            assert(db:execute("INSERT INTO app_work_query_benchmark VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
                { h.id, 100000, 5, filtered / 5, sorted / 5, count_ms / 5, create_ms, 1000, fold_ms }))
            db:release()
        end)
    end)
end
return { run = test.run_cases(define) }
