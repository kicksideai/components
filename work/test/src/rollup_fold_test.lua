-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local time = require("time")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local materializer = require("materializer")
local domain = require("domain")

type Map = { [string]: unknown }

local function board(): fixture.Handle
    return fixture.board({ declaration = {
        key_prefix = fixture.fresh_prefix(),
        fields = { { code = "points", form = "int", track = true },
            { code = "count", type = "rollup", of = "children", fn = "count", form = "int" },
            { code = "total", type = "rollup", of = "children", fn = "sum", field = "points", form = "int" } },
        item_types = { { id = "parent", process = "work", fields = { "count", "total" } },
            { id = "child", process = "work", parent_types = { "parent" }, fields = { "points" } } },
        processes = { { id = "work", initial = "todo", states = { { id = "todo", category = "started" } } } },
    } })
end

local function define()
    test.describe("rollup fold", function()
        test.it("counts recomputed parents toward the row budget and replays without usage or history changes", function()
            local h = board()
            local p, q = steps.create(h, "parent"), steps.create(h, "parent")
            local a, b = steps.create(h, "child", { points = 1 }, p), steps.create(h, "child", { points = 1 }, q)
            local db = assert(store.open())
            local board_row = assert(store.board(db, h.id))
            local field = board_row.model.fields.points.id
            local seq = board_row.applied_seq
            local events: { domain.RawEvent } = {
                { seq = seq + 1, type = "kickside.work.events:item.changed", body = { item = a, patch = { { f = field, v = 9 } } } },
                { seq = seq + 2, type = "kickside.work.events:item.changed", body = { item = b, patch = { { f = field, v = 7 } } } },
            }
            local tx = assert(db:begin())
            local out = assert(materializer.fold(tx, db:type(), h.id, events, seq + 2, 2))
            test.eq(out.last_seq, seq + 1)
            test.eq(assert(store.item(tx, h.id, p)).document["3"].p, 9)
            test.eq(assert(store.item(tx, h.id, q)).document["3"].p, 1)
            assert(tx:commit())
            tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, events, seq + 2, 2))
            assert(tx:commit())
            local usage = assert(store.usage(db, h.id))
            local n = assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1", { h.id }))
            tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, events, seq + 2, 2))
            assert(tx:commit())
            test.eq(assert(store.usage(db, h.id)).fields[3], usage.fields[3])
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1", { h.id })), n)
            test.eq(assert(store.item(db, h.id, p)).version, 1)
            db:release()
            local changes = assert(h.call("list_changes", { cursor = { seq = seq, item_id = "" } }))
            local found = false
            for _, entry in ipairs(changes.items) do if entry.item_id == p then found = true end end
            test.is_true(found)
        end)

        test.it("benchmarks a 2000-child recompute and source edits and enforces create and move bounds", function()
            local h = board()
            local p = steps.create(h, "parent")
            local ids: { string } = {}
            for first = 1, 1999, 50 do
                local ops: { Map } = {}
                for _ = 1, math.min(50, 2000 - first) do ops[#ops + 1] = { op = "create", type = "child", parent = p, values = { points = 1 } } end
                local result = assert(steps.apply(h, ops))
                for _, o in ipairs(result.outcomes :: { Map }) do
                    test.eq(o.status, "applied"); ids[#ids + 1] = o.item :: string
                end
            end
            test.eq(((assert(steps.get(h, p)).item :: Map).values :: Map).total, 1999)
            local concurrent = steps.parallel(h, {
                { ops = { { op = "create", type = "child", parent = p, values = { points = 1 } } } },
                { ops = { { op = "create", type = "child", parent = p, values = { points = 1 } } } },
            })
            local accepted = 0
            for _, result in ipairs(concurrent) do
                local o = (result.outcomes :: { Map })[1]
                if o.status == "applied" then accepted = accepted + 1; ids[#ids + 1] = o.item :: string
                else test.eq(o.status, "invalid"); test.eq((o.findings :: { Map })[1].code, "children_limit") end
            end
            test.eq(accepted, 1)
            test.eq(((assert(steps.get(h, p)).item :: Map).values :: Map).total, 2000)
            local q = steps.create(h, "parent")
            local moved = assert(steps.apply(h, { { op = "parent", item = ids[1], parent = q }, { op = "parent", item = ids[2], parent = q } }))
            test.is_true(moved.applied)
            moved = assert(steps.apply(h, { { op = "parent", item = ids[1], parent = p }, { op = "parent", item = ids[2], parent = p } }))
            test.is_true(moved.applied)
            local extra = steps.one(h, { op = "create", type = "child", parent = p })
            test.eq(extra.status, "invalid"); test.eq((extra.findings :: { Map })[1].code, "children_limit")
            local root = steps.create(h, "child")
            extra = steps.one(h, { op = "parent", item = root, parent = p })
            test.eq(extra.status, "invalid"); test.eq((extra.findings :: { Map })[1].code, "children_limit")
            local db = assert(store.open())
            local current = assert(store.board(db, h.id))
            local first = current.applied_seq + 1
            local tx = assert(db:begin())
            local start = time.now():unix_nano()
            assert(materializer.fold(tx, db:type(), h.id, {
                { seq = first, type = "kickside.work.events:item.changed", body = { item = ids[1], patch = { { f = 1, v = 2 } } } },
            }, first, 5000))
            assert(tx:commit())
            local recompute_ns = time.now():unix_nano() - start
            test.eq(assert(store.item(db, h.id, p)).document["3"].p, 2001)
            local events: { domain.RawEvent } = {}
            for i = 1, 1000 do
                events[i] = { seq = first + i, type = "kickside.work.events:item.changed",
                    body = { item = ids[i], patch = { { f = 1, v = 3 } }, actor = h.actor:id(), at = "2026-11-04T00:00:00Z" } }
            end
            tx = assert(db:begin())
            start = time.now():unix_nano()
            assert(materializer.fold(tx, db:type(), h.id, events, first + 1000, 5000))
            assert(tx:commit())
            local edit_ns = time.now():unix_nano() - start
            test.eq(assert(store.item(db, h.id, p)).document["3"].p, 4000)
            test.eq(assert(store.item(db, h.id, p)).version, 1)
            assert(db:execute([[CREATE TABLE IF NOT EXISTS app_work_rollup_benchmark
                (board_id TEXT PRIMARY KEY, engine TEXT, children INTEGER, recompute_ns BIGINT, edits INTEGER, edit_ns BIGINT)]]))
            assert(db:execute("INSERT INTO app_work_rollup_benchmark VALUES ($1,$2,$3,$4,$5,$6)", { h.id, db:type(), 2000, recompute_ns, 1000, edit_ns }))
            db:release()
        end)
    end)
end
return { run = test.run_cases(define) }
