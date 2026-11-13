-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Queries run through authenticated endpoints and the board ACL.
local test = require("test")
local scoped = require("scoped")
local fixture = require("fixture")
local steps = require("steps")

local function define()
    test.describe("declared query grouping and order", function()
        test.it("returns subgroup counts and each group's first page", function()
            local h = fixture.board()
            for _, amount in ipairs({ 1, 1, 2 }) do steps.create(h, "task", { estimate = amount }) end
            local out = assert(h.call("query", { group_by = "state", sub_group_by = "estimate", limit = 1 }))
            test.eq(#out.groups, 1)
            test.eq(out.groups[1].count, 3)
            test.eq(#out.groups[1].items, 1)
            test.eq(#out.groups[1].groups, 2)
            test.eq(out.groups[1].groups[1].count, 2)
            test.eq(out.groups[1].groups[2].count, 1)
        end)
        test.it("pages three order keys with ties nulls and mixed directions", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { estimate = 1 })
            local b = steps.create(h, "task", { estimate = 2 })
            local c = steps.create(h, "task")
            local order = { { field = "state" }, { field = "estimate", dir = "desc" }, { field = "number" } }
            local out = assert(h.call("query", { order = order, limit = 1 }))
            test.eq(out.items[1].id, b)
            out = assert(h.call("query", { order = order, limit = 1, after = out.after }))
            test.eq(out.items[1].id, a)
            out = assert(h.call("query", { order = order, limit = 1, after = out.after }))
            test.eq(out.items[1].id, c)
            test.is_nil(out.after)
        end)
        test.it("returns complete group counts and a bounded first page", function()
            local h = fixture.board()
            for _ = 1, 3 do steps.create(h, "task", { estimate = 1 }) end
            steps.create(h, "task", { estimate = 2 })
            local out = assert(h.call("query", { group_by = "estimate", order = { field = "number" }, limit = 2 }))
            test.eq(#out.groups, 2)
            test.eq(out.groups[1].count, 3)
            test.eq(#out.groups[1].items, 2)
            test.not_nil(out.groups[1].after)
            test.eq(out.groups[2].count, 1)
        end)
    end)

    test.describe("board queries", function()
        test.it("admits a member reader, binds values and refuses outsiders", function()
            local admin, member, outsider = scoped.admin(), scoped.member(), scoped.outsider()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[1].index = "key"
            local h = scoped.board(admin, d)
            local id = steps.create(h, "task", { title = "x' OR 1=1 --" })
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local page = member.http("POST", member.route(h.id, "query"), { where = { field = "title", op = "eq", value = "x' OR 1=1 --" } })
            test.eq(page.status, 200)
            local data = page.body.data
            test.eq(#data.items, 1)
            test.eq(data.items[1].id, id)
            test.is_true(data.as_of > 0)
            local counted = member.http("POST", member.route(h.id, "count"), {})
            test.eq(counted.status, 200)
            test.eq(counted.body.data.total, 1)
            counted = member.http("POST", member.route(h.id, "count"), { where = { field = "title", op = "eq", value = "x' OR 1=1 --" } })
            test.eq(counted.status, 200); test.eq(counted.body.data.total, 1)
            for _, method in ipairs({ "get", "list_history", "list_changes", "get_time_in_state", "get_schema" }) do
                test.eq(member.http("POST", member.route(h.id, method), { item = { id = id }, conditions = {} }).status, 400)
            end
            for _, method in ipairs({ "query", "count" }) do
                test.eq(outsider.http("POST", outsider.route(h.id, method), {}).status, 403)
                test.eq(scoped.member().http("POST", member.route(h.id, method), {}).status, 403)
                local bad = member.http("POST", member.route(h.id, method), { where = { field = "title); DROP TABLE x; --", op = "eq", value = "a" } })
                test.eq(bad.status, 400)
            end
        end)

        test.it("pages indexed values with empty-value complements and the existing item view", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A", estimate = 4 })
            local b = steps.create(h, "task", { title = "B" })
            local c = steps.create(h, "task", { title = "C", estimate = 4 })
            for _, op in ipairs({ "neq", "nin" }) do
                local page = assert(h.call("query", { where = { field = "estimate", op = op, value = op == "nin" and { 4 } or 4 } }))
                test.eq(#page.items, 1); test.eq(page.items[1].id, b)
            end
            local page = assert(h.call("query", { order = { field = "estimate", dir = "desc" }, limit = 1 }))
            local seen = {}
            while true do
                test.eq(#page.items, 1)
                test.is_nil(seen[page.items[1].id]); seen[page.items[1].id] = true
                test.eq(page.items[1].values.title, page.items[1].id == a and "A" or page.items[1].id == b and "B" or "C")
                if not page.after then break end
                page = assert(h.call("query", { order = { field = "estimate", dir = "desc" }, limit = 1, after = page.after }))
            end
            test.is_true(seen[a] and seen[b] and seen[c])
            page = assert(h.call("query", {})); test.eq(page.items[1].id, a); test.eq(page.items[2].id, b)
            local changed = assert(steps.apply(h, { { op = "delete", item = b } }))
            page = assert(h.call("query", { min_seq = changed.as_of }))
            test.eq(#page.items, 2)
            test.eq(#assert(h.call("query", { include_trashed = true })).items, 3)
            test.eq(assert(h.call("count", {})).total, 2)
            steps.one(h, { op = "restore", item = b })
            test.eq(assert(h.call("count", {})).total, 3)
        end)

        test.it("uses the compiler for trees, sets, actor and time operands and history", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[4].index = "key"
            local h = fixture.board({ declaration = d })
            local actor = h.actor:id()
            local id = steps.create(h, "story", { title = "A", estimate = 3, labels = { "red", "blue" }, assignee = { kind = "user", id = actor } })
            local page = assert(h.call("query", { where = { ["and"] = {
                { field = "labels", op = "has", value = "red" }, { field = "assignee", op = "eq", value = { ["$actor"] = "id" } },
                { ["or"] = { { field = "estimate", op = "eq", value = 3 }, { ["not"] = { field = "state", op = "eq", value = "open" } } } },
                { field = "created_at", op = "lte", value = { ["$now"] = "P1D" } },
            } } }))
            test.eq(#page.items, 1); test.eq(page.items[1].id, id)
            steps.one(h, { op = "set", item = id, values = { estimate = 6 } })
            page = assert(h.call("query", { where = { history = { field = "estimate", was = 3, by = { ["$actor"] = "id" },
                during = { "2020-01-01T00:00:00Z", { ["$now"] = "P1D" } } } } }))
            test.eq(#page.items, 1); test.eq(page.items[1].id, id)
            local _, err = h.call("query", { where = { field = "title", op = "eq", value = "A" } })
            test.eq(err:kind(), errors.INVALID); test.eq(err:details().field, "title"); test.eq(err:details().code, "field_unindexed")
        end)

        test.it("resolves retained prefixes and refuses unclaimed keys", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local prefix = fixture.fresh_prefix()
            assert(h.call("apply_schema", { declaration = { key_prefix = prefix } }))
            for _, key in ipairs({ h.prefix .. "-1", prefix .. "-1" }) do
                local page = assert(h.call("query", { where = { field = "key", op = "eq", value = key } }))
                test.eq(#page.items, 1); test.eq(page.items[1].id, id); test.eq(page.items[1].key, prefix .. "-1")
            end
            local unknown = fixture.fresh_prefix() .. "-91"
            test.eq(#assert(h.call("query", { where = { field = "key", op = "eq", value = unknown } })).items, 0)

        end)

        test.it("asks state and category history including the initial state", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.processes[1].states = { { id = "open", category = "started" }, { id = "done", category = "completed" } }
            d.processes[1].transitions = { { id = "finish", from = { "open" }, to = "done" } }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            test.eq(#assert(h.call("query", { where = { history = { field = "state", was = "open" } } })).items, 1)
            steps.one(h, { op = "transition", item = id, transition = "finish" })
            for _, check in ipairs({ { "state", "open" }, { "state", "done" }, { "category", "started" }, { "category", "completed" } }) do
                test.eq(#assert(h.call("query", { where = { history = { field = check[1], was = check[2], by = { ["$actor"] = "id" } } } })).items, 1)
            end
        end)

        test.it("enforces tree limits and read-your-writes on both reads", function()
            local h = fixture.board()
            local result = assert(steps.apply(h, { { op = "create", type = "task", values = { estimate = 11 } } }))
            for _, method in ipairs({ "query", "count" }) do
                local out = assert(h.call(method, { min_seq = result.seq, where = { field = "estimate", op = "eq", value = 11 } }))
                test.is_true(out.as_of >= result.seq)
                if method == "count" then test.eq(out.total, 1) else test.eq(#out.items, 1) end
                local _, err = h.call(method, { min_seq = out.as_of + 1000000 })
                test.eq(err:kind(), errors.UNAVAILABLE)
                test.eq(err:details().code, "projection_pending")
                local leaves = {}
                for j = 1, 65 do leaves[j] = { field = "state", op = "eq", value = "open" } end
                _, err = h.call(method, { where = { ["and"] = leaves } })
                test.eq(err:kind(), errors.INVALID)
                local deep = { field = "state", op = "eq", value = "open" }
                for _ = 1, 6 do deep = { ["not"] = deep } end
                _, err = h.call(method, { where = deep })
                test.eq(err:kind(), errors.INVALID)
            end
        end)

        test.it("executes children predicates and refuses malformed queries and bounds through the endpoint", function()
            local session = scoped.admin()
            local h = scoped.board(session)
            local parent = steps.create(h, "task")
            steps.create(h, "task", nil, parent)
            local children = session.http("POST", session.route(h.id, "query"), { where = { children = true, q = "some" } })
            test.eq(children.status, 200)
            test.eq(#children.body.data.items, 1)
            test.eq(children.body.data.items[1].id, parent)
            local bad = {
                { where = { rel = "missing", q = "some", where = { field = "state", op = "eq", value = "open" } } },
                { where = { field = "key", op = "gt", value = "UNKNOWN-99" } },
                { where = { children = true, q = "missing" } }, { where = { match = "text" } },
                { order = { { field = "rank" }, { field = "state" }, { field = "number" }, { field = "estimate" } } }, { group_by = "title" }, { boards = { h.id, h.id } },
                { conditions = {} }, { limit = 201 }, { limit = 0 }, { after = "bad" }, { order = { field = "title" } },
            }
            for _, request in ipairs(bad) do
                test.eq(session.http("POST", session.route(h.id, "query"), request).status, 400, tostring(request.group_by or request.limit or request.after or request.where or request.order or request.boards or request.conditions))
            end
            test.eq(session.http("POST", session.route(h.id, "count"), { boards = { h.id } }).status, 400)
        end)
    end)
end

return { run = test.run_cases(define) }
