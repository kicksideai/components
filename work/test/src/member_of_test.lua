-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local sql = require("sql")
local tables = require("tables")

type Map = { [string]: unknown }
local GROUP = "app.security:work_admin"
local function declaration(): Map
    return { key_prefix = fixture.fresh_prefix(), fields = {
        { code = "author", type = "principal", index = "key" }, { code = "title", form = "text", index = "key" },
    }, item_types = { { id = "task", process = "flow", fields = { "author", "title" } } }, processes = {
        { id = "flow", initial = "todo", states = { { id = "todo", category = "unstarted" }, { id = "review", category = "started" }, { id = "done", category = "completed" } },
          transitions = { { id = "fast", from = { "todo" }, to = "done", when = { field = "author", op = "member_of", value = GROUP } },
            { id = "review", from = { "todo" }, to = "review" } } },
    } }
end
local function define()
    test.describe("principal group conditions", function()
        test.it("bounds membership expansion by the enclosing read allowance", function()
            local h = fixture.board({ declaration = declaration() })
            local db = assert(sql.get("app:db"))
            local names = tables.names(h.id)
            local id = steps.create(h, "task")
            assert(db:execute("INSERT INTO " .. names.item .. " (item_id,type,state,category,path,rank,number,life,version,created_seq,updated_seq,created_at,updated_at,f1_key) " ..
                "SELECT 'budget-' || n, type,state,category,path,rank,number,life,version,created_seq,updated_seq,created_at,updated_at,'principal:user:' || n FROM " .. names.item ..
                " CROSS JOIN (SELECT 1 AS n UNION ALL SELECT 2 AS n) numbers WHERE item_id=$1", { id }))
            db:release()
            local result, err = h.call("query", { where = { field = "author", op = "member_of", value = GROUP }, budget = { rows = 1 } })
            test.is_nil(result)
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "membership_budget_exceeded")
        end)
        test.it("uses live author memberships in queries views and point transition reads", function()
            local h = fixture.board({ declaration = declaration() })
            local _, other_id = fixture.user(h, nil, true)
            local own = steps.create(h, "task", { author = { kind = "user", id = h.actor:id() } })
            local other = steps.create(h, "task", { author = { kind = "user", id = other_id } })
            local empty = steps.create(h, "task")
            local where = { field = "author", op = "member_of", value = { GROUP } }
            local page = assert(h.call("query", { where = where, include = { "transitions" } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, own)
            test.eq(#page.items[1].transitions, 2)
            test.eq(#assert(h.call("get", { item = { id = other }, include = { "transitions" } })).transitions, 1)
            local saved = assert(h.call("create_view", { board_id = h.id, title = "Our authors", view = { type = "list", where = where } }))
            test.eq(#assert(h.call("run_view", { view_id = saved.view_id })).items, 1)
            test.eq(#assert(h.call("query", { where = { ["not"] = where } })).items, 2)
            test.eq(steps.one(h, { op = "transition", item = other, transition = "fast" }).status, "denied")
            test.eq(steps.one(h, { op = "transition", item = empty, transition = "fast" }).status, "denied")
            local feed = assert(h.call("list_changes", { selection = where }))
            local db = assert(sql.get("app:db"))
            assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", { other_id, GROUP }))
            db:release()
            local resumed = assert(h.call("list_changes", { selection = where, cursor = feed.next }))
            test.not_nil(resumed.gap)
            test.eq(resumed.next.seq, 0)
            test.eq(#assert(h.call("query", { where = where })).items, 2)
            test.eq(steps.one(h, { op = "transition", item = other, transition = "fast" }).status, "applied")
            test.eq(steps.one(h, { op = "transition", item = own, transition = "fast" }).status, "applied")
        end)

        test.it("uses query-only membership conditions for sets counts groups and plans", function()
            local d = declaration()
            d.processes[1].transitions[1].when = nil
            d.fields[3] = { code = "watchers", type = "principal", cardinality = "set", index = "key" }
            d.item_types[1].fields[3] = "watchers"
            local h = fixture.board({ declaration = d })
            local _, other_id = fixture.user(h, nil, true)
            local id = steps.create(h, "task", { author = { kind = "user", id = other_id }, watchers = { { kind = "user", id = other_id }, { kind = "user", id = h.actor:id() } } })
            local where = { field = "watchers", op = "member_of", value = { GROUP, "app.security:work_test" } }
            test.eq(#assert(h.call("query", { where = where })).items, 1, "set members")
            test.eq(assert(h.call("count", { where = where })).total, 1, "membership count")
            test.eq(assert(h.call("query", { where = where, group_by = "state" })).groups[1].count, 1)
            test.not_nil(assert(h.call("explain", { where = where })).plan.statement)
            test.eq(#assert(h.call("query", { where = { field = "author", op = "member_of", value = "app.security:work_test" } })).items, 1, "baseline group")
            steps.one(h, { op = "set", item = id, values = { author = { kind = "group", id = GROUP } } })
            test.eq(#assert(h.call("query", { where = { field = "author", op = "member_of", value = GROUP } })).items, 1, "group principal")
        end)

        test.it("evaluates a fast lane against the command's new principal value", function()
            local d = declaration()
            d.processes[1].transitions[1].auto = true
            local h = fixture.board({ declaration = d })
            local own = steps.create(h, "task", { author = { kind = "user", id = h.actor:id() } })
            test.eq(assert(steps.get(h, own)).item.state, "done")
            local id = steps.create(h, "task")
            test.eq(assert(steps.get(h, id)).item.state, "todo")
            steps.one(h, { op = "set", item = id, values = { author = { kind = "user", id = h.actor:id() } } })
            test.eq(assert(steps.get(h, id)).item.state, "done")
        end)

        test.it("uses membership in gate release conditions and validates principal operands", function()
            local d = declaration()
            d.processes[1].states[2] = { id = "review", category = "started", kind = "gate", release_when = { when = { field = "author", op = "member_of", value = GROUP } } }
            d.processes[1].transitions[3] = { id = "release", from = { "review" }, to = "done", auto = true, default = true }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { author = { kind = "user", id = h.actor:id() } })
            steps.one(h, { op = "transition", item = id, transition = "review" })
            test.eq(assert(steps.get(h, id)).item.state, "done")
            for _, leaf in ipairs({ { field = "title", op = "member_of", value = GROUP }, { field = "author", op = "member_of", value = {} }, { field = "author", op = "member_of", value = { 1 } } }) do
                local _, err = h.call("query", { where = leaf })
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "invalid_filter")
            end
        end)
    end)
end
return { run = test.run_cases(define) }
