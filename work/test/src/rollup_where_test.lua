-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local materializer = require("materializer")
local domain = require("domain")

local function declaration()
    return { key_prefix = fixture.fresh_prefix(), fields = {
        { code = "points", form = "int", index = "number" },
        { code = "total", type = "rollup", form = "int", of = "children", fn = "sum", field = "points", where = { field = "category", op = "eq", value = "completed" } },
        { code = "some", type = "rollup", form = "bool", of = "children", fn = "any", where = { field = "points", op = "gt", value = 5 } },
        { code = "every", type = "rollup", form = "bool", of = "children", fn = "all", where = { field = "points", op = "gt", value = 5 } },
        { code = "related", type = "rollup", form = "int", of = "blocks", fn = "count", where = { field = "points", op = "gt", value = 5 } },
    }, item_types = {
        { id = "parent", process = "work", fields = { "total", "some", "every", "related" } },
        { id = "child", process = "work", parent_types = { "parent" }, fields = { "points" } },
    }, relation_types = { { id = "blocks" } }, processes = { { id = "work", initial = "todo",
        states = { { id = "todo", category = "started" }, { id = "done", category = "completed" } },
        transitions = { { id = "finish", from = { "todo" }, to = "done" } } } } }
end

local function values(h, id)
    return assert(steps.get(h, id)).item.values
end

local function define()
    test.describe("rollup predicates", function()
        test.it("folds predicates after index writes for creates edits transitions relations and trash", function()
            local h = fixture.board({ declaration = declaration() })
            local p = steps.create(h, "parent")
            test.eq(values(h, p).total, 0); test.is_false(values(h, p).some); test.is_true(values(h, p).every)
            local a = steps.create(h, "child", { points = 8 }, p)
            local b = steps.create(h, "child", { points = 2 }, p)
            test.is_true(values(h, p).some); test.is_false(values(h, p).every)
            steps.one(h, { op = "transition", item = a, transition = "finish" })
            test.eq(values(h, p).total, 8)
            steps.one(h, { op = "link", item = p, type = "blocks", target = { item = b } })
            test.eq(values(h, p).related, 0)
            assert(steps.apply(h, { { op = "set", item = a, values = { points = 9 } }, { op = "set", item = b, values = { points = 7 } } }))
            test.eq(values(h, p).total, 9); test.is_true(values(h, p).every); test.eq(values(h, p).related, 1)
            steps.one(h, { op = "delete", item = a })
            test.eq(values(h, p).total, 0)
            steps.one(h, { op = "restore", item = a })
            test.eq(values(h, p).total, 9)
            steps.one(h, { op = "parent", item = b, parent = false })
            test.is_true(values(h, p).every)
        end)

        test.it("updates holders when a predicate reads a linked peer and current history", function()
            local d = declaration()
            d.fields[#d.fields + 1] = { code = "peers", type = "rollup", form = "int", of = "children", fn = "count",
                where = { rel = "blocks", q = "some", where = { field = "points", op = "gt", value = 5 } } }
            d.fields[#d.fields + 1] = { code = "history", type = "rollup", form = "int", of = "children", fn = "count",
                where = { history = { field = "state", was = "done" } } }
            d.item_types[1].fields[#d.item_types[1].fields + 1] = "peers"
            d.item_types[1].fields[#d.item_types[1].fields + 1] = "history"
            local h = fixture.board({ declaration = d })
            local p = steps.create(h, "parent")
            local source = steps.create(h, "child", { points = 2 }, p)
            local peer = steps.create(h, "child", { points = 3 })
            steps.one(h, { op = "link", item = source, type = "blocks", target = { item = peer } })
            test.eq(values(h, p).peers, 0, "peer predicate result after relation change")
            steps.one(h, { op = "set", item = peer, values = { points = 8 } })
            test.eq(values(h, p).peers, 1, "peer predicate result after target edit")
            steps.one(h, { op = "transition", item = source, transition = "finish" })
            test.eq(values(h, p).history, 1, "current history participates in the predicate")
            steps.one(h, { op = "unlink", item = source, type = "blocks", target = { item = peer } })
            test.eq(values(h, p).peers, 0, "peer predicate result after relation change")
        end)

        test.it("backfills a predicate over a newly indexed field and recomputes a changed predicate", function()
            local d = declaration()
            d.fields[1].index = "none"
            d.fields[3].where = { field = "category", op = "eq", value = "completed" }
            d.fields[4].where = d.fields[3].where
            d.fields[5].where = d.fields[3].where
            local h = fixture.board({ declaration = d })
            local p = steps.create(h, "parent")
            steps.create(h, "child", { points = 8 }, p)
            assert(h.call("apply_schema", { declaration = { fields = {
                { code = "points", form = "int", index = "number" },
                { code = "total", type = "rollup", form = "int", of = "children", fn = "sum", field = "points", where = { field = "points", op = "gt", value = 5 } },
            } } }))
            steps.rebuilt(h.id, "reindex")
            steps.rebuilt(h.id, "recompute")
            test.eq(values(h, p).total, 8)
            assert(h.call("apply_schema", { declaration = { fields = {
                { code = "total", type = "rollup", form = "int", of = "children", fn = "sum", field = "points", where = { field = "points", op = "gt", value = 9 } },
            } } }))
            steps.rebuilt(h.id, "recompute")
            test.eq(values(h, p).total, 0)
        end)

        test.it("keeps predicate evaluation atomic with generated rows and idempotent on replay", function()
            local d = declaration()
            d.fields[1].track = true
            local h = fixture.board({ declaration = d })
            local p = steps.create(h, "parent")
            local child = steps.create(h, "child", { points = 2 }, p)
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            local field = board.model.fields.points.id
            local seq = board.applied_seq + 1
            local events: { domain.RawEvent } = { { seq = seq, type = "kickside.work.events:item.changed", body = {
                item = child, patch = { { f = field, v = 8, before = 2 } }, actor = h.actor:id(), at = "2026-11-04T00:00:00Z",
            } } }
            local history = assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1", { h.id }))
            local tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, events, seq, 5000))
            local parent = assert(store.item(tx, h.id, p))
            test.is_true(parent.document[tostring(board.model.fields.some.id)].p)
            test.is_true(parent.document[tostring(board.model.fields.every.id)].p)
            test.eq(parent.version, 1)
            tx:rollback()
            test.is_false(values(h, p).some)
            tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, events, seq, 5000)); assert(tx:commit())
            test.is_true(values(h, p).some)
            local usage = assert(store.usage(db, h.id))
            tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, events, seq, 5000)); assert(tx:commit())
            test.eq(assert(store.usage(db, h.id)).fields[board.model.fields.some.id], usage.fields[board.model.fields.some.id])
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1", { h.id })), history + 1)
            db:release()
        end)

        test.it("evaluates relation predicates across a legal cascaded subtree larger than 500 rows", function()
            local d = declaration()
            d.fields[2] = { code = "total", type = "rollup", form = "int", of = "children", fn = "count", where = { rel = "blocks", q = "some" } }
            local h = fixture.board({ declaration = d })
            local p = steps.create(h, "parent")
            for first = 1, 501, 50 do
                local ops = {}
                for i = 1, math.min(50, 502 - first) do ops[i] = { op = "create", type = "child", parent = p } end
                test.is_true(assert(steps.apply(h, ops)).applied)
            end
            test.eq(assert(h.call("count", {})).total, 502)
            test.eq(values(h, p).total, 0)
            for _, operation in ipairs({ "delete", "restore" }) do
                local result, err = steps.apply(h, { { op = operation, item = p } })
                assert(result, operation .. " cascade: " .. steps.detail(err))
                test.eq(result.outcomes[1].status, "applied")
                if operation == "delete" then test.eq(assert(h.call("count", {})).total, 0) end
            end
            test.eq(assert(h.call("count", {})).total, 502)
            test.eq(values(h, p).total, 0)
        end)

        test.it("refuses unknown unindexed computed and caller-dependent rollup predicates at schema apply", function()
            local h = fixture.board({ bare = true })
            local trees = { { field = "missing", op = "eq", value = 1 }, { field = "points", op = "eq", value = { ["$actor"] = "id" } },
                { field = "created_at", op = "lt", value = { ["$now"] = "P0D" } }, { field = "total", op = "eq", value = 1 } }
            for _, tree in ipairs(trees) do
                local d = declaration()
                d.fields[2].where = tree
                local _, err = h.call("apply_schema", { declaration = d })
                test.eq(err:kind(), errors.INVALID)
            end
            local d = declaration()
            d.fields[1].index = "none"
            local _, err = h.call("apply_schema", { declaration = d })
            test.eq(err:kind(), errors.INVALID)
        end)
    end)
end
return { run = test.run_cases(define) }
