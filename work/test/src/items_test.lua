-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Item commands: create, set, parent, link, comment, delete and restore, and the reads over them.
local test = require("test")
local sql = require("sql")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local json = require("json")

local function board_row(h: fixture.Handle): { [string]: unknown }
    for _, board in ipairs(assert(h.call("list", {})).boards) do
        if board.board_id == h.id then return board end
    end
    error("board is absent from discovery")
end

local function user(id: string): { kind: string, id: string }
    return { kind = "user", id = id }
end

local function define()
    test.describe("index acceptance", function()
        test.it("returns malformed compiled snapshots as native row errors", function()
            local h = fixture.board()
            local db = assert(store.open())
            local rows = assert(db:query("SELECT * FROM kickside_work_board WHERE board_id = $1", { h.id }))
            db:release()
            local row = rows[1]
            for _, raw in ipairs({ "42", "{}", '{"fields":false,"item_types":[],"relation_types":[],"processes":[]}' }) do
                row.compiled = raw
                local fake: unknown = { query = function(_self: unknown, _statement: string, _args: unknown): (unknown, error?)
                    return { row }, nil
                end }
                local board, err = store.board(fake :: sql.DB, h.id)
                test.is_nil(board)
                test.not_nil(err)
                test.eq(err:kind(), errors.INTERNAL)
                test.eq(err:details().code, "row_corrupt")
            end
        end)
        test.it("returns JSON decode errors and releases the read connection", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET document = '{broken' WHERE board_id = $1 AND item_id = $2", { h.id, id }))
            db:release()
            local _, source = json.decode("{broken")
            local out, err = steps.get(h, id)
            test.is_nil(out)
            test.not_nil(err)
            test.eq(err:kind(), source:kind())
            test.eq(err:details().code, "row_corrupt")
            db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET document = '{}' WHERE board_id = $1 AND item_id = $2", { h.id, id }))
            db:release()
            assert(steps.get(h, id))
        end)
        test.it("refuses unrepresentable keys before appending and leaves the board writable", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[1].index = "key"
            local h = fixture.board({ declaration = d })
            local out = steps.one(h, { op = "create", type = "task", values = { title = string.rep("x", 257) } })
            test.eq(out.status, "invalid")
            test.eq(out.findings[1].code, "invalid_value")
            test.eq(#steps.events(h), 1)
            test.not_nil(steps.create(h, "task", { title = "valid" }))
        end)
    end)

    test.describe("create", function()
        test.it("assigns keys and counter values in the fold and starts the item in its initial state", function()
            local h = fixture.board()
            local out = assert(steps.apply(h, {
                { op = "create", type = "epic", values = { title = "Platform" } },
                { op = "create", type = "epic", values = { title = "Growth" } },
            }))
            test.is_true(out.applied)
            test.eq(out.outcomes[1].status, "applied")
            test.eq(out.outcomes[1].version, 1)
            test.eq(out.outcomes[1].key, h.prefix .. "-1")
            test.eq(out.outcomes[2].key, h.prefix .. "-2")
            test.not_nil(out.seq)
            test.is_true(out.as_of >= out.seq)
            local item = assert(steps.get(h, out.outcomes[2].item)).item
            test.eq(item.key, h.prefix .. "-2")
            test.eq(item.type, "epic")
            test.eq(item.state, "open")
            test.eq(item.category, "started")
            test.eq(item.life, "live")
            test.eq(item.values.title, "Growth")
            test.eq(item.values.number, 2)
            local by_key = assert(h.call("get", { item = { key = h.prefix .. "-1" } }))
            test.eq(by_key.item.id, out.outcomes[1].item)
        end)

        test.it("normalizes values through the declared forms", function()
            local h = fixture.board()
            local id = steps.create(h, "story", { title = "Billing", estimate = "5", assignee = user("u1"),
                labels = { "b", "a", "b" }, priority = "p0" })
            local item = assert(steps.get(h, id)).item
            test.eq(item.values.estimate, 5)
            test.eq(item.values.assignee.kind, "user")
            test.eq(item.values.assignee.id, "u1")
            test.eq(#item.values.labels, 2)
            test.eq(item.values.labels[1], "a")
            test.eq(item.values.priority, "p0")
        end)

        test.it("refuses values the schema does not allow and creates nothing", function()
            local h = fixture.board()
            local cases = {
                { { op = "create", type = "ghost" }, "unknown_type" },
                { { op = "create", type = "epic", values = { estimate = 3 } }, "unknown_field" },
                { { op = "create", type = "story", values = { estimate = "many" } }, "invalid_value" },
                { { op = "create", type = "story", values = { priority = "p9" } }, "invalid_value" },
                { { op = "create", type = "story", values = { number = 5 } }, "invalid_value" },
                { { op = "create", type = "story", values = { assignee = { kind = "robot", id = "x" } } }, "invalid_value" },
                { { op = "create", type = "epic", state = "done" }, "unknown_state" },
                { { op = "create", type = "epic", parent = "00000000-0000-0000-0000-000000000000" }, "unknown_item" },
            }
            for _, c in ipairs(cases) do
                local out = assert(steps.apply(h, { c[1] }))
                test.eq(out.outcomes[1].status, "invalid", c[2])
                test.eq(out.outcomes[1].findings[1].code, c[2], c[2])
                test.is_false(out.applied)
            end
            test.eq(board_row(h).item_count, 0)
        end)

        test.it("places an item under a parent of an allowed type and inherits declared values", function()
            local h = fixture.board()
            local epic = steps.create(h, "epic", { title = "E", priority = "p0" })
            local story = steps.create(h, "story", { title = "S" }, epic)
            local item = assert(steps.get(h, story)).item
            test.eq(item.parent, epic)
            test.eq(item.values.priority, "p0")
            local own = steps.create(h, "story", { title = "T", priority = "p4" }, epic)
            test.eq(assert(steps.get(h, own)).item.values.priority, "p4")
            local children = assert(steps.get(h, epic, { "children" })).children
            test.eq(#children, 2)
            local bad = assert(steps.apply(h, { { op = "create", type = "epic", parent = epic } }))
            test.eq(bad.outcomes[1].findings[1].code, "parent_type")
        end)

        test.it("limits the hierarchy depth", function()
            local h = fixture.board()
            local epic = steps.create(h, "epic", { title = "E" })
            local story = steps.create(h, "story", { title = "S" }, epic)
            local a = steps.create(h, "task", { title = "1" }, story)
            local b = steps.create(h, "task", { title = "2" }, a)
            local c = steps.create(h, "task", { title = "3" }, b)
            local out = assert(steps.apply(h, { { op = "create", type = "task", parent = c } }))
            test.eq(out.outcomes[1].status, "invalid")
            test.eq(out.outcomes[1].findings[1].code, "depth")
        end)
    end)

    test.describe("set", function()
        test.it("changes, clears and unsets values and counts versions", function()
            local h = fixture.board()
            local id = steps.create(h, "story", { title = "A", estimate = 2, labels = { "x" } })
            local o = steps.one(h, { op = "set", item = id, values = { title = "B", estimate = 3 } })
            test.eq(o.status, "applied")
            test.eq(o.version, 2)
            local item = assert(steps.get(h, id)).item
            test.eq(item.values.title, "B")
            test.eq(item.values.estimate, 3)
            local c = steps.one(h, { op = "set", item = id, clear = { "estimate" }, unset = { "labels" } })
            test.eq(c.version, 3)
            item = assert(steps.get(h, id)).item
            test.is_nil(item.values.estimate)
            test.is_nil(item.values.labels)
            test.eq(item.values.title, "B")
            test.eq(item.version, 3)
        end)

        test.it("reports unchanged for values the item already holds", function()
            local h = fixture.board()
            local id = steps.create(h, "story", { title = "A" })
            local out = assert(steps.apply(h, { { op = "set", item = id, values = { title = "A" } } }))
            test.eq(out.outcomes[1].status, "unchanged")
            test.eq(out.outcomes[1].version, 1)
            test.is_nil(out.seq)
            test.eq(steps.version(h, id), 1)
        end)

        test.it("refuses fields outside the item type, trashed items and unknown items", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local a = steps.one(h, { op = "set", item = id, values = { assignee = user("u") } })
            test.eq(a.findings[1].code, "unknown_field")
            local b = steps.one(h, { op = "set", item = "00000000-0000-0000-0000-000000000000", values = { title = "x" } })
            test.eq(b.findings[1].code, "unknown_item")
            steps.one(h, { op = "delete", item = id })
            local c = steps.one(h, { op = "set", item = id, values = { title = "x" } })
            test.eq(c.findings[1].code, "item_trashed")
            local d = steps.one(h, { op = "set", item = id, values = { title = "x" }, clear = { "title" } })
            test.eq(d.status, "invalid")
        end)

        test.it("refuses a field written twice in one op", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local o = steps.one(h, { op = "set", item = id, values = { title = "B" }, clear = { "title" } })
            test.eq(o.findings[1].code, "duplicate_field")
        end)
    end)

    test.describe("parent", function()
        test.it("moves an item with its subtree, detaches it and keeps paths consistent", function()
            local h = fixture.board()
            local e1 = steps.create(h, "epic", { title = "E1" })
            local e2 = steps.create(h, "epic", { title = "E2" })
            local story = steps.create(h, "story", { title = "S" }, e1)
            local task = steps.create(h, "task", { title = "T" }, story)
            local moved = steps.one(h, { op = "parent", item = story, parent = e2 })
            test.eq(moved.status, "applied")
            test.eq(moved.version, 2)
            test.eq(assert(steps.get(h, story)).item.parent, e2)
            test.eq(#assert(steps.get(h, e1, { "children" })).children, 0)
            test.eq(#assert(steps.get(h, e2, { "children" })).children, 1)
            local db = assert(store.open())
            local t = assert(store.item(db, h.id, task))
            db:release()
            test.eq(t.path, "/" .. e2 .. "/" .. story .. "/" .. task .. "/")
            local detached = steps.one(h, { op = "parent", item = story, parent = false })
            test.eq(detached.status, "applied")
            test.is_nil(assert(steps.get(h, story)).item.parent)
            local again = steps.one(h, { op = "parent", item = story, parent = false })
            test.eq(again.status, "unchanged")
        end)

        test.it("refuses cycles, wrong parent types and subtrees that would pass the depth limit", function()
            local h = fixture.board()
            local epic = steps.create(h, "epic", { title = "E" })
            local story = steps.create(h, "story", { title = "S" }, epic)
            local t1 = steps.create(h, "task", { title = "1" }, story)
            local t2 = steps.create(h, "task", { title = "2" }, t1)
            test.eq(steps.one(h, { op = "parent", item = t1, parent = t2 }).findings[1].code, "cycle")
            test.eq(steps.one(h, { op = "parent", item = epic, parent = story }).findings[1].code, "cycle")
            test.eq(steps.one(h, { op = "parent", item = story, parent = t1 }).findings[1].code, "cycle")
            local other = steps.create(h, "epic", { title = "O" })
            test.eq(steps.one(h, { op = "parent", item = other, parent = epic }).findings[1].code, "parent_type")
            local deep_epic = steps.create(h, "epic", { title = "D" })
            local deep_story = steps.create(h, "story", { title = "DS" }, deep_epic)
            local a = steps.create(h, "task", { title = "a" }, deep_story)
            local b = steps.create(h, "task", { title = "b" }, a)
            local c = steps.create(h, "task", { title = "c" }, b)
            local branch = steps.create(h, "task", { title = "branch" }, story)
            steps.create(h, "task", { title = "leaf" }, branch)
            test.eq(steps.one(h, { op = "parent", item = branch, parent = c }).findings[1].code, "depth")
        end)
    end)

    test.describe("concurrent moves", function()
        test.it("folds trusted concurrent parent facts and refuses the later cycle", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A" })
            local b = steps.create(h, "task", { title = "B" })
            local function move(item: string, parent: string)
                local _, err = h.call("trusted_append", { thread_id = h.id, events = { { type = "kickside.work.events:item.parented",
                    subject = "i:" .. item, body = { item = item, parent = parent } } } })
                assert(not err, steps.detail(err))
            end
            move(a, b)
            move(b, a)
            assert(h.call("settle", {}))
            local first = assert(steps.get(h, a)).item
            local second = assert(steps.get(h, b)).item
            test.eq(first.parent, b)
            test.is_nil(second.parent)
            test.eq(second.version, 2)
            local db = assert(store.open())
            local row = assert(store.item(db, h.id, b))
            db:release()
            test.eq(row.path, "/" .. b .. "/")
            local history = assert(h.call("list_history", { item = { id = b }, limit = 1 }))
            test.eq(history.entries[1].kind, "parent_refused")
            test.eq(history.entries[1].after.reason, "cycle")
        end)
    end)

end

return { run = test.run_cases(define) }
