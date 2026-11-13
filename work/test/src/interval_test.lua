-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local row_checks = require("row_checks")
-- Value intervals: state and category always, declared fields on request; closed on change and delete, reopened on restore.
local test = require("test")
local json = require("json")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local materializer = require("materializer")

type Map = { [string]: unknown }

local function board(): fixture.Handle
    return fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
end

local function person(id: string): Map
    return { kind = "user", id = id }
end

local function task(h: fixture.Handle): string
    return steps.create(h, "task", { title = "T", estimate = 3, assignee = person("u1") })
end

local function move(h: fixture.Handle, id: string, transition: string): Map
    local o = steps.one(h, { op = "transition", item = id, transition = transition })
    assert(o.status == "applied", json.encode(o))
    return o
end

-- periods lists the intervals of one field of an item as "value:open" or "value:closed".
local function periods(h: fixture.Handle, id: string, field: string): { string }
    local out = assert(h.call("list_history", { item = { id = id }, include = { "intervals" } }))
    local list: { string } = {}
    for _, p in ipairs(out.intervals) do
        if p.field == field then
            local value = type(p.value) == "string" and p.value or json.encode(p.value)
            list[#list + 1] = value .. ":" .. (p.ended_at and "closed" or "open")
        end
    end
    return list
end

local function define()
    test.describe("intervals", function()
        test.it("totals every retained period and pages the detail separately", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            local db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_work_interval WHERE board_id = $1 AND item_id = $2 AND field_id = 'state'", { h.id, id }))
            for i = 1, 205 do
                assert(db:execute("INSERT INTO kickside_work_interval (board_id, item_id, field_id, start_seq, value_key, started_at, ended_at) VALUES ($1,$2,'state',$3,'open','2026-01-01T00:00:00.000000000Z','2026-01-01T00:00:01.000000000Z')", { h.id, id, 1000 + i }))
            end
            db:release()
            local result = assert(h.call("get_time_in_state", { item = { id = id } }))
            test.eq(result.totals.open, 205000)
            test.eq(#result.periods, 200)
            test.not_nil(result.after)
            local next_page = assert(h.call("get_time_in_state", { item = { id = id }, after = result.after }))
            test.eq(#next_page.periods, 5)
            test.eq(next_page.totals.open, 205000)
            test.is_nil(next_page.after)
        end)
        test.it("opens a state and a category interval when an item is created", function()
            local h = board()
            local id = task(h)
            test.eq(table.concat(periods(h, id, "state"), ","), "todo:open")
            test.eq(table.concat(periods(h, id, "category"), ","), "unstarted:open")
            test.eq(row_checks.scalar("SELECT COUNT(*) AS n FROM kickside_work_interval WHERE board_id = $1", { h.id }), 2)
        end)

        test.it("closes the open interval and opens the next on a transition", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            move(h, id, "finish")
            test.eq(table.concat(periods(h, id, "state"), ","), "todo:closed,doing:closed,done:open")
            test.eq(table.concat(periods(h, id, "category"), ","), "unstarted:closed,started:closed,completed:open")
        end)

        test.it("keeps one category interval across states of the same category", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            steps.one(h, { op = "transition", item = id, transition = "to_review", values = { estimate = 5 } })
            test.eq(table.concat(periods(h, id, "state"), ","), "todo:closed,doing:closed,review:open")
            test.eq(table.concat(periods(h, id, "category"), ","), "unstarted:closed,started:open")
        end)

        test.it("records the values of fields declared intervals", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            test.eq(#periods(h, id, "finished"), 0)
            move(h, id, "finish")
            test.eq(#periods(h, id, "finished"), 1)
            test.eq(periods(h, id, "finished")[1]:sub(-5), ":open")
            move(h, id, "reopen")
            test.eq(periods(h, id, "finished")[1]:sub(-7), ":closed")
            test.eq(#periods(h, id, "finished"), 1)
        end)

        test.it("closes every open interval on delete and reopens them on restore", function()
            local h = board()
            local epic = steps.create(h, "epic", { title = "E" })
            local story = steps.create(h, "story", { title = "S", estimate = 2, assignee = person("u1") }, epic)
            move(h, story, "start")
            steps.one(h, { op = "delete", item = epic })
            for _, id in ipairs({ epic, story }) do
                for _, p in ipairs({ "state", "category" }) do
                    for _, period in ipairs(periods(h, id, p)) do test.is_true(period:sub(-7) == ":closed", id .. " " .. p .. " " .. period) end
                end
            end
            steps.one(h, { op = "restore", item = epic })
            test.eq(table.concat(periods(h, epic, "state"), ","), "open:closed,open:open")
            test.eq(table.concat(periods(h, story, "state"), ","), "todo:closed,doing:closed,doing:open")
            test.eq(table.concat(periods(h, story, "category"), ","), "unstarted:closed,started:closed,started:open")
        end)

        test.it("reopens the interval of a declared field on restore", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            move(h, id, "finish")
            steps.one(h, { op = "delete", item = id })
            test.eq(periods(h, id, "finished")[1]:sub(-7), ":closed")
            steps.one(h, { op = "restore", item = id })
            local list = periods(h, id, "finished")
            test.eq(#list, 2)
            test.eq(list[2]:sub(-5), ":open")
        end)

        test.it("writes change rows and intervals once when a projection batch is delivered again", function()
            local h = board()
            local epic = steps.create(h, "epic", { title = "E" })
            local story = steps.create(h, "story", { title = "S", estimate = 2, assignee = person("u1") }, epic)
            move(h, story, "start")
            move(h, story, "finish")
            steps.one(h, { op = "delete", item = epic })
            steps.one(h, { op = "restore", item = epic })
            local rows = assert(h.call("events", {})).events
            local changes, spans = row_checks.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1", { h.id }), row_checks.scalar("SELECT COUNT(*) AS n FROM kickside_work_interval WHERE board_id = $1", { h.id })
            test.is_true(changes > 0 and spans > 0)
            local db = assert(store.open())
            local tx = assert(db:begin())
            local events = {}
            for _, r in ipairs(rows) do events[#events + 1] = { seq = r.seq, type = r.type, body = r.body } end
            local _, err = materializer.fold(tx, db:type(), h.id, events, math.tointeger(tonumber(rows[#rows].seq)) :: integer, 5000)
            test.is_nil(err)
            tx:commit()
            db:release()
            test.eq(row_checks.scalar("SELECT COUNT(*) AS n FROM kickside_work_change WHERE board_id = $1", { h.id }), changes)
            test.eq(row_checks.scalar("SELECT COUNT(*) AS n FROM kickside_work_interval WHERE board_id = $1", { h.id }), spans)
        end)
    end)

    test.describe("time in state", function()
        test.it("totals the time an item held each state", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            local out = assert(h.call("get_time_in_state", { item = { id = id } }))
            test.eq(out.field, "state")
            test.eq(#out.periods, 2)
            test.eq(out.periods[1].value, "todo")
            test.not_nil(out.periods[1].ended_at)
            test.eq(out.periods[2].value, "doing")
            test.is_nil(out.periods[2].ended_at)
            test.is_true(out.periods[1].duration_ms >= 0)
            test.is_true(out.totals.todo >= 0)
            test.not_nil(out.totals.doing)
        end)

        test.it("reads categories and declared fields and refuses fields that record nothing", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            move(h, id, "finish")
            local category = assert(h.call("get_time_in_state", { item = { id = id }, field = "category" }))
            test.eq(#category.periods, 3)
            local finished = assert(h.call("get_time_in_state", { item = { id = id }, field = "finished" }))
            test.eq(#finished.periods, 1)
            local _, err = h.call("get_time_in_state", { item = { id = id }, field = "title" })
            test.eq(err:kind(), errors.INVALID)
            local _, missing = h.call("get_time_in_state", { item = { id = "nope" } })
            test.eq(missing:kind(), errors.NOT_FOUND)
        end)

        test.it("needs read access", function()
            local h = board()
            local id = task(h)
            local outsider = fixture.user(h)
            local _, err = outsider("get_time_in_state", { item = { id = id } })
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
        end)
    end)
end

return { run = test.run_cases(define) }
