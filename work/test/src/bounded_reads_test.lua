-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")

local function define()
    test.describe("Work bounded reads", function()
        test.it("orders the cross-board results across a bounded continuation", function()
            local left, right = fixture.board(), fixture.board()
            assert(right.call("grant", { subject_id = left.actor:id(), mask = 1 }))
            local first, second = left, right
            if first.id > second.id then first, second = second, first end
            steps.create(first, "task", { estimate = 10 })
            steps.create(second, "task", { estimate = 1 })
            local cursor, found = nil, {}
            for _ = 1, 4 do
                local page = assert(left.call("query", {
                    boards = { left.id, right.id }, order = { field = "estimate" },
                    budget = { rows = 1 }, limit = 1, cross_after = cursor,
                }))
                for _, item in ipairs(page.items) do found[#found + 1] = item.values.estimate end
                cursor = page.cross_after
                if not cursor then break end
            end
            test.eq(#found, 2)
            test.eq(found[1], 1, "the lower sort key must lead the cross-board result")
            test.eq(found[2], 10)
        end)

        test.it("preserves descending ties and nulls when each call can read only one row", function()
            local a, b, c = fixture.board(), fixture.board(), fixture.board()
            for _, board in ipairs({ b, c }) do assert(board.call("grant", { subject_id = a.actor:id(), mask = 1 })) end
            steps.create(a, "task", { estimate = 5 })
            steps.create(a, "task")
            steps.create(b, "task", { estimate = 9 })
            steps.create(b, "task", { estimate = 5 })
            steps.create(c, "task")
            local request = { boards = { a.id, b.id, c.id }, order = { field = "estimate", dir = "desc" } }
            local expected = assert(a.call("query", request)).items
            test.eq(#expected, 5)
            request.budget = { rows = 1 }
            request.limit = 1
            local actual = {}
            for _ = 1, 15 do
                local page = assert(a.call("query", request))
                test.is_true(#page.items <= 1)
                for _, item in ipairs(page.items) do actual[#actual + 1] = item.id end
                request.cross_after = page.cross_after
                if not request.cross_after then break end
            end
            test.is_nil(request.cross_after)
            test.eq(#actual, #expected)
            for i, item in ipairs(expected) do test.eq(actual[i], item.id) end
        end)

        test.it("admits every selected schema before spending the item budget", function()
            local left = fixture.board()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.fields[2] = { code = "estimate", form = "text", index = "key" }
            local right = fixture.board({ declaration = declaration })
            assert(right.call("grant", { subject_id = left.actor:id(), mask = 1 }))
            steps.create(left, "task", { estimate = 2 })
            steps.create(right, "task", { estimate = "one" })
            for _, rows in ipairs({ 1, 10 }) do
                local page, err = left.call("query", {
                    boards = { left.id, right.id }, order = { field = "estimate" }, budget = { rows = rows },
                })
                test.is_nil(page)
                test.eq(err:details().code, "invalid_query")
            end
        end)

        test.it("binds cross-board continuations to the admitted query", function()
            local board = fixture.board()
            for i = 1, 2 do steps.create(board, "task", { estimate = i }) end
            local request = { boards = { board.id }, order = { field = "estimate" }, limit = 1 }
            request.cross_after = assert(board.call("query", request)).cross_after
            test.not_nil(request.cross_after)
            request.order = { field = "rank" }
            local page, err = board.call("query", request)
            test.is_nil(page)
            test.eq(err:details().code, "invalid_query")
            request.order = { field = "estimate" }
            assert(board.call("apply_schema", { declaration = { fields = { { code = "bonus", form = "int" } } } }))
            page, err = board.call("query", request)
            test.is_nil(page)
            test.eq(err:details().code, "invalid_query")
        end)

        test.it("orders unavailable references with nulls without publishing target keys", function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.fields[#declaration.fields + 1] = { code = "peer", type = "item", index = "key" }
            local fields = declaration.item_types[3].fields
            fields[#fields + 1] = "peer"
            local board, target = fixture.board({ declaration = declaration }), fixture.board()
            declaration.key_prefix = fixture.fresh_prefix()
            local other = fixture.board({ declaration = declaration })
            assert(other.call("grant", { subject_id = board.actor:id(), mask = 1 }))
            assert(target.call("grant", { subject_id = board.actor:id(), mask = 1 }))
            local visible = steps.create(board, "task")
            local hidden = steps.create(target, "task")
            local marked = steps.create(board, "task", { peer = { board = board.id, item = visible } })
            local unavailable = steps.create(board, "task", { peer = { board = target.id, item = hidden } })
            local neighbor = steps.create(other, "task")
            assert(target.call("revoke", { subject_id = board.actor:id() }))
            local suffix = { { id = visible, board = board.id }, { id = unavailable, board = board.id }, { id = neighbor, board = other.id } }
            table.sort(suffix, function(a, b) return a.board == b.board and a.id < b.id or a.board < b.board end)
            local sealed = false
            for _, direction in ipairs({ "asc", "desc" }) do
                local request = { boards = { board.id, other.id }, order = { field = "peer", dir = direction },
                    budget = { rows = 1 }, limit = 1 }
                local found = {}
                for _ = 1, 18 do
                    local page = assert(board.call("query", request))
                    for _, item in ipairs(page.items) do found[#found + 1] = item end
                    request.cross_after = page.cross_after
                    if not request.cross_after then break end
                    for _, positions in ipairs({ request.cross_after.frontiers, request.cross_after.boards }) do
                        for _, position in pairs(positions) do
                            if type(position) == "table" then
                                if type(position.v) == "string" then
                                    test.is_nil(position.v:find(hidden, 1, true), "hidden target appears in the continuation")
                                end
                                sealed = sealed or position.position ~= nil
                            end
                        end
                    end
                end
                test.is_nil(request.cross_after)
                test.eq(#found, 4)
                test.eq(found[1].id, marked)
                for i, expected in ipairs(suffix) do
                    local item = found[i + 1]
                    test.eq(item.id, expected.id)
                    if item.id == unavailable then test.is_true(item.values.peer.unavailable) end
                end
            end
            test.is_true(sealed, "the hidden raw index position is sealed when it ends a scan")
        end)

        test.it("uses case-insensitive search for non-ASCII plugin scope text", function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.plugins = { { use = "app:query_text_search_plugin" } }
            declaration.scopes = { "app:query_text_search_scope" }
            local board = fixture.board({ declaration = declaration })
            local item = steps.create(board, "task")
            assert(board.call("direct", { target = "app:query_text_search_write",
                input = { board = board.id, item = item, text = "Needle École Straße ΟΣ" } }))
            test.eq(#assert(board.call("query", { where = { match = "nEEDLE" } })).items, 1)
            test.eq(#assert(board.call("query", { where = { match = "École" } })).items, 1)
            test.eq(#assert(board.call("query", { where = { match = "école" } })).items, 1)
            test.eq(#assert(board.call("query", { where = { match = "STRASSE ος" } })).items, 1)
            test.eq(#assert(board.call("query", { where = { match = "écoles" } })).items, 0)
        end)

        test.it("returns group detail pages when the population fits the row allowance", function()
            local board = fixture.board()
            for i = 1, 3 do steps.create(board, "task", { estimate = i }) end
            local page = assert(board.call("query", { group_by = "estimate", budget = { rows = 4 } }))
            test.eq(#page.groups, 3)
            for _, group in ipairs(page.groups) do
                test.eq(group.count, 1)
                test.is_true(#group.items == 1 or group.after ~= nil,
                    "return each admitted singleton group's detail or a cursor for it")
            end
        end)

        test.it("groups missing numeric values last at both levels", function()
            local board = fixture.board()
            local present = steps.create(board, "task", { estimate = 1 })
            local missing = steps.create(board, "task")
            local page = assert(board.call("query", { group_by = "estimate", sub_group_by = "estimate", budget = { rows = 2 } }))
            test.eq(#page.groups, 2)
            test.eq(page.groups[1].value, 1)
            test.eq(page.groups[1].groups[1].items[1].id, present)
            test.is_nil(page.groups[2].value)
            test.is_nil(page.groups[2].groups[1].value)
            test.eq(page.groups[2].groups[1].items[1].id, missing)
        end)

        test.it("honors the declared row allowance in the change feed", function()
            local board = fixture.board()
            for _ = 1, 3 do steps.create(board, "task") end
            local page = assert(board.call("list_changes", { limit = 3, budget = { rows = 1 } }))
            test.eq(#page.items, 1)
            test.is_true(page.has_more)
            local next_page = assert(board.call("list_changes", { cursor = page.next, budget = { rows = 2 } }))
            test.eq(#next_page.items, 2)
            test.is_false(next_page.has_more)
        end)

        test.it("resumes same-sequence changes and bootstraps after the floor advances", function()
            local board = fixture.board()
            local a = steps.create(board, "task")
            local b = steps.create(board, "task")
            steps.create(board, "task")
            local db = assert(store.open())
            local row = assert(store.item(db, board.id, a))
            assert(db:execute("UPDATE kickside_work_item SET updated_seq = $1 WHERE board_id = $2 AND item_id = $3",
                { row.updated_seq, board.id, b }))
            local page = assert(board.call("list_changes", { budget = { rows = 1 } }))
            local first = a < b and a or b
            local second = a < b and b or a
            test.eq(page.items[1].item_id, first)
            local resumed = assert(board.call("list_changes", { cursor = page.next, budget = { rows = 1 } }))
            test.eq(resumed.items[1].item_id, second)
            test.eq(resumed.items[1].updated_seq, page.items[1].updated_seq)

            local floor = row.updated_seq + 1
            assert(db:execute("UPDATE kickside_work_board SET tombstone_floor_seq = $1 WHERE board_id = $2", { floor, board.id }))
            db:release()
            local stale = assert(board.call("list_changes", { cursor = page.next, budget = { rows = 1 } }))
            test.eq(stale.gap.floor, floor)
            local cursor, found = nil, {}
            for _ = 1, 3 do
                local next_page = assert(board.call("list_changes", { cursor = cursor, budget = { rows = 1 } }))
                test.is_nil(next_page.gap)
                test.eq(#next_page.items, 1)
                local id = next_page.items[1].item_id
                test.is_nil(found[id])
                found[id] = true
                cursor = next_page.has_more and next_page.next or nil
            end
            test.is_nil(cursor)
            test.is_true(found[first] and found[second])
        end)
    end)
end

return { run = test.run_cases(define) }
