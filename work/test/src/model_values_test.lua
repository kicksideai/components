-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")

local function define()
    test.describe("durable field meaning", function()
        test.it("keeps absent cleared and provided states across point page and feed reads", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local function check(expected: string)
                local point = steps.get(h, id).item
                test.eq(point.value_states.estimate, expected)
                test.eq(point.value_states.labels, "absent")
                local page = assert(h.call("query", {}))
                test.eq(page.items[1].value_states.estimate, expected)
                local feed = assert(h.call("list_changes", {}))
                test.eq(feed.items[1].value_states.estimate, expected)
                if expected ~= "provided" then test.is_nil(point.values.estimate) end
                test.eq(#assert(h.call("query", { where = { field = "estimate", op = "is_state", value = expected } })).items, 1)
                for _, other in ipairs({ "absent", "cleared", "provided" }) do
                    if other ~= expected then
                        test.eq(#assert(h.call("query", { where = { field = "estimate", op = "is_state", value = other } })).items, 0)
                    end
                end
            end
            check("absent")
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 3 } }).status, "applied")
            check("provided")
            test.eq(steps.one(h, { op = "set", item = id, clear = { "estimate" } }).status, "applied")
            check("cleared")
            test.eq(steps.one(h, { op = "set", item = id, clear = { "estimate" } }).status, "unchanged")
            test.eq(steps.one(h, { op = "set", item = id, unset = { "estimate" } }).status, "applied")
            check("absent")
            test.eq(steps.one(h, { op = "set", item = id, clear = { "estimate" } }).status, "applied")
            check("cleared")
            local db = assert(store.open())
            local held = assert(store.item(db, h.id, id))
            db:release()
            test.eq(held.document["2"].c, 1)
            test.eq(#assert(h.call("query", { where = { field = "estimate", op = "is_null", value = true } })).items, 1)
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 0 } }).status, "applied")
            check("provided")
            test.eq(steps.get(h, id).item.values.estimate, 0)
        end)

        test.it("retains cleared cells after their source events expire", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { estimate = 2 })
            test.eq(steps.one(h, { op = "set", item = id, clear = { "estimate" } }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_event WHERE thread_id = $1", { h.id }))
            db:release()
            test.eq(steps.get(h, id).item.value_states.estimate, "cleared")
            test.eq(#assert(h.call("query", { where = { field = "estimate", op = "is_state", value = "cleared" } })).items, 1)
            test.eq(assert(h.call("list_changes", {})).items[1].value_states.estimate, "cleared")
        end)

        test.it("keeps interval authors after the audit retention window expires", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2].intervals = true
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { estimate = 2 })
            local db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_work_change WHERE board_id = $1", { h.id }))
            db:release()
            local page = assert(h.call("query", { where = { history = { field = "estimate", was = 2, by = h.actor:id(),
                during = { "2020-01-01T00:00:00Z", "2100-01-01T00:00:00Z" } } } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, id)
        end)

        test.it("keeps option identity separate from tied display orders and retains history ids", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[5].options = { { id = "a", order = 1 }, { id = "b", order = 1 }, { id = "c", order = 2 } }
            d.fields[5].intervals = true
            local h = fixture.board({ declaration = d })
            local a = steps.create(h, "story", { priority = "a" })
            local b = steps.create(h, "story", { priority = "b" })
            local c = steps.create(h, "story", { priority = "c" })
            for _, op in ipairs({ "eq", "in" }) do
                local page = assert(h.call("query", { where = { field = "priority", op = op, value = op == "in" and { "a" } or "a" } }))
                test.eq(#page.items, 1)
                test.eq(page.items[1].id, a)
            end
            local page = assert(h.call("query", { where = { field = "priority", op = "gt", value = "b" } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, c)
            test.eq(#assert(h.call("query", { where = { field = "priority", op = "in", value = { "b" } } })).items, 1)
            test.eq(#assert(h.call("query", { where = { field = "priority", op = "lte", value = "a" } })).items, 2)
            local history = assert(h.call("query", { where = { history = { field = "priority", was = "a" } } }))
            test.eq(#history.items, 1)
            test.eq(history.items[1].id, a)
            test.eq(steps.one(h, { op = "set", item = b, values = { priority = "c" } }).status, "applied")
            page = assert(h.call("query", { where = { history = { field = "priority", was = "b" } } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, b)
            page = assert(h.call("query", { group_by = "priority" }))
            test.eq(#page.groups, 2)
        end)

        test.it("merges numeric option orders across boards", function()
            local function declaration()
                local d = fixture.declaration(fixture.fresh_prefix())
                d.fields[5].options = { { id = "a", order = 2 }, { id = "b", order = 10 } }
                return d
            end
            local a = fixture.board({ declaration = declaration() })
            local b = fixture.board({ declaration = declaration() })
            assert(b.call("grant", { subject_id = a.actor:id(), mask = 1 }))
            local first = steps.create(a, "story", { priority = "a" })
            local second = steps.create(b, "story", { priority = "b" })
            local page = assert(a.call("query", { boards = { a.id, b.id }, order = { field = "priority" } }))
            test.eq(page.items[1].id, first)
            test.eq(page.items[2].id, second)
        end)

        test.it("answers changed from and to on retained field changes", function()
            for _, intervals in ipairs({ false, true }) do
                local d = fixture.declaration(fixture.fresh_prefix())
                d.fields[2].intervals = intervals
                local h = fixture.board({ declaration = d })
                local id = steps.create(h, "task", { estimate = 3 })
                test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 6 } }).status, "applied")
                for _, predicate in ipairs({ { changed = true, from = 3, to = 6 }, { changed = true, to = 6 } }) do
                    predicate.field = "estimate"
                    local page = assert(h.call("query", { where = { history = predicate } }))
                    test.eq(#page.items, 1)
                    test.eq(page.items[1].id, id)
                end
                test.eq(#assert(h.call("query", { where = { history = { field = "estimate", changed = true, from = 6, to = 3 } } })).items, 0)
                if intervals then
                    local db = assert(store.open())
                    local times = assert(db:query("SELECT started_at FROM kickside_work_interval WHERE board_id = $1 AND item_id = $2 AND field_id = '2' ORDER BY start_seq", { h.id, id }))
                    db:release()
                    test.eq(#times, 2)
                    test.eq(#times[2].started_at, 30)
                    local at = times[2].started_at
                    local current = assert(h.call("query", { where = { history = { field = "estimate", was = 6, during = { at, at } } } }))
                    test.eq(#current.items, 1)
                    test.eq(current.items[1].id, id)
                    test.eq(#assert(h.call("query", { where = { history = { field = "estimate", was = 3, during = { at, at } } } })).items, 0)
                end
            end
        end)

        test.it("answers changed from and to from intervals after audit changes expire", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2].intervals = true
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { estimate = 3 })
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 6 } }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_work_change WHERE board_id = $1", { h.id }))
            db:release()
            local function count(before: integer, after: integer): integer
                return #assert(h.call("query", { where = { history = { field = "estimate", changed = true, from = before, to = after,
                    by = h.actor:id(), during = { "2020-01-01T00:00:00Z", "2100-01-01T00:00:00Z" } } } })).items
            end
            test.eq(count(3, 6), 1)
            test.eq(count(6, 3), 0)
            test.eq(steps.get(h, id).item.values.estimate, 6)
        end)
        test.it("keeps the actor and boundary of a cleared interval after audit changes expire", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2].intervals = true
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { estimate = 3 })
            test.eq(steps.one(h, { op = "set", item = id, clear = { "estimate" } }).status, "applied")
            local db = assert(store.open())
            local periods = assert(db:query("SELECT ended_at FROM kickside_work_interval WHERE board_id=$1 AND item_id=$2 AND field_id='2'", { h.id, id }))
            assert(db:execute("DELETE FROM kickside_work_change WHERE board_id=$1", { h.id }))
            db:release()
            local at = periods[1].ended_at
            local page = assert(h.call("query", { where = { history = { field = "estimate", changed = true, from = 3,
                by = h.actor:id(), during = { at, at } } } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, id)
            test.eq(#assert(h.call("query", { where = { history = { field = "estimate", was = 3, during = { at, at } } } })).items, 0)
        end)

        test.it("answers was during from intervals after audit changes expire", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2].intervals = true
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { estimate = 3 })
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 6 } }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_work_change WHERE board_id = $1", { h.id }))
            db:release()
            local page = assert(h.call("query", { where = { history = { field = "estimate", was = 3,
                during = { "2020-01-01T00:00:00Z", "2100-01-01T00:00:00Z" } } } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, id)
        end)
    end)
end

return { run = test.run_cases(define) }
