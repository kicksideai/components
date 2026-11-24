-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local time = require("time")
local registry = require("registry")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")

local PLUGIN = "kickside.work.time:plugin"
local SCOPE = "kickside.work.time.reads:logged_time"
local ORIGINAL = "time_original_minutes"
local REMAINING = "time_remaining_minutes"

local function ok(reply)
    test.eq(reply.status, 200, reply.raw)
    return reply.body.data
end

local function setup(restricted, entry_visibility)
    local admin = scoped.admin()
    local board = scoped.board(admin)
    local declaration = { plugins = { { use = PLUGIN } } }
    if restricted then
        declaration.fields = { { code = "level", form = "text", index = "key" } }
        declaration.item_types = { { id = "task", process = "delivery", parent_types = { false, "story", "task" },
            fields = { "title", "estimate", "labels", "level" } } }
        declaration.visibility = { field = "level", bypass = "admin", levels = {
            { id = "private", holders = { { user = admin.id } } },
        } }
    end
    ok(admin.http("POST", "/" .. board.id .. "/apply_schema", {
        declaration = declaration,
        plugin_configs = { [PLUGIN] = { item_types = { "task" }, entry_visibility = entry_visibility or "all" } },
    }))
    local attachment
    steps.wait_for("Time attachment ready", function()
        local plugin = steps.call(board, "get_schema", {}).plugins[1]
        attachment = plugin.attachment_id
        return plugin.lifecycle.state == "ready"
    end)
    return admin, board, attachment
end

local function path(board, suffix)
    return "/" .. board.id .. "/time/" .. suffix
end

local function date(offset)
    return time.now():utc():add((offset or 0) * 24 * time.HOUR):format("2006-01-02")
end

local function create(actor, board, item, key, minutes)
    return ok(actor.http("POST", path(board, "worklogs"), {
        item = item, key = key, minutes = minutes, work_date = date(), note = "quoted,\"note\"",
    }))
end

return { run = test.run_cases(function()
    test.describe("Work Time reports", function()
        test.it("filters by the active attachment even while retired totals still exist", function()
            local admin, board, attachment = setup()
            local old = steps.create(board, "task")
            local live = steps.create(board, "task")
            local db = assert(sql.get("app:db"))
            assert(db:execute([[INSERT INTO kickside_work_time_total
                (attachment_id, board_id, item_id, minutes, entry_count, over_estimate)
                VALUES ($1, $2, $3, 80, 1, 1), ($4, $2, $5, 10, 1, 1)]],
                { "retired-time-attachment", board.id, old, attachment, live }))
            db:release()

            for _, predicate in ipairs({ { minutes = { gt = 0 } }, { over_estimate = { eq = 1 } } }) do
                local request = { scopes = { { id = SCOPE, where = predicate } } }
                local result = steps.call(board, "query", request)
                test.eq(#result.items, 1)
                test.eq(result.items[1].id, live)
                test.eq(steps.call(board, "count", request).total, 1)
            end
        end)

        if assert(registry.get("app:work_time_scope_plan_gate")).meta.enabled then
            test.it("uses an indexed Time membership probe for a one-item Work page", function()
                local _, board, attachment = setup()
                local item = steps.create(board, "task")
                local db = assert(sql.get("app:db"))
                assert(db:execute([[WITH RECURSIVE numbers(n) AS (VALUES (1) UNION ALL SELECT n+1 FROM numbers WHERE n < 10000),
                    seed(attachment, board, live_item) AS (VALUES ($1, $2, $3))
                    INSERT INTO kickside_work_time_total (attachment_id, board_id, item_id, minutes, entry_count, over_estimate)
                    SELECT attachment, board, 'scope-plan-' || n, 10, 1, 1 FROM numbers CROSS JOIN seed
                    UNION ALL SELECT attachment, board, live_item, 10, 1, 1 FROM seed]], { attachment, board.id, item }))
                assert(db:execute("ANALYZE kickside_work_time_total", {}))
                local postgres = db:type() == sql.type.POSTGRES
                local explain = postgres and "EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF) " or "EXPLAIN QUERY PLAN "
                for _, predicate in ipairs({ { minutes = { gt = 0 } }, { over_estimate = { eq = 1 } } }) do
                    local plan = steps.call(board, "explain", { limit = 1, scopes = { { id = SCOPE, where = predicate } } }).plan
                    local rows = assert(db:query(explain .. plan.statement, plan.args))
                    local details = {}
                    for _, row in ipairs(rows) do details[#details + 1] = postgres and row["QUERY PLAN"] or row.detail end
                    local output = table.concat(details, "\n")
                    if postgres then
                        test.not_nil(output:find("kickside_work_time_total_pkey", 1, true), output)
                        test.not_nil(output:match("Index Cond: [^\n]+attachment_id = [^\n]+item_id = "), output)
                    else
                        test.is_nil(output:find("LIST SUBQUERY", 1, true), output)
                        test.not_nil(output:match("SEARCH t .-attachment_id=%? AND item_id=%?"), output)
                    end
                end
                db:release()
            end)
        end

        test.it("returns direct and subtree minutes and current estimate fields through the router", function()
            local admin, board = setup()
            local root = steps.create(board, "task", { [ORIGINAL] = 20, [REMAINING] = 0 })
            local child = steps.create(board, "task", nil, root)
            local leaf = steps.create(board, "task", nil, child)
            local elsewhere = steps.create(board, "task")
            create(admin, board, root, "root", 10)
            create(admin, board, leaf, "leaf", 30)
            create(admin, board, elsewhere, "elsewhere", 90)

            local summary = ok(admin.http("POST", path(board, "summary"), { items = { root, leaf, root } }))
            test.eq(#summary.items, 2)
            test.eq(summary.items[1].item, root)
            test.eq(summary.items[1].minutes, 10)
            test.eq(summary.items[1].original_minutes, 20)
            test.eq(summary.items[1].remaining_minutes, 0)
            test.is_false(summary.items[1].over_estimate)

            local totals = ok(admin.http("POST", path(board, "totals"), { item = root }))
            test.eq(totals.direct_minutes, 10)
            test.eq(totals.subtree_minutes, 40)
            test.eq(totals.coverage, "complete")
            test.eq(steps.one(board, { op = "parent", item = child, parent = elsewhere }).status, "applied")
            test.eq(ok(admin.http("POST", path(board, "totals"), { item = root })).subtree_minutes, 10)
            test.eq(ok(admin.http("POST", path(board, "totals"), { item = elsewhere })).subtree_minutes, 120)
            test.eq(steps.one(board, { op = "delete", item = leaf }).status, "applied")
            test.eq(ok(admin.http("POST", path(board, "totals"), { item = elsewhere })).subtree_minutes, 90)
            test.eq(steps.one(board, { op = "restore", item = leaf }).status, "applied")
            test.eq(ok(admin.http("POST", path(board, "totals"), { item = elsewhere })).subtree_minutes, 120)
        end)

        test.it("pages complete person-week groups when their combined week exceeds the read budget", function()
            local admin, board, attachment = setup()
            local member = scoped.member()
            assert(board.call("grant", { subject_id = member.id, mask = 3 }))
            local item = steps.create(board, "task")
            create(admin, board, item, "one", 10)
            create(member, board, item, "two", 20)
            local db = assert(sql.get("app:db"))
            assert(db:execute([[WITH RECURSIVE numbers(n) AS (VALUES (1) UNION ALL SELECT n+1 FROM numbers WHERE n < 2050),
                seed(attachment, first_person, second_person, day) AS (VALUES ($1, $2, $3, $4))
                INSERT INTO kickside_work_time_daily
                (attachment_id, item_id, person_id, work_date, minutes, entry_count)
                SELECT attachment, 'no-live-item-' || n, first_person, day, 1, 1 FROM numbers CROSS JOIN seed
                UNION ALL SELECT attachment, 'no-live-item-' || n, second_person, day, 1, 1 FROM numbers CROSS JOIN seed]],
                { attachment, admin.id, member.id, date() }))
            db:release()
            local request = { from = date(), to = date(), group_by = "person_week", limit = 1 }
            local first = ok(admin.http("POST", path(board, "totals"), request))
            test.eq(#first.groups, 1)
            request.cursor = assert(first.cursor)
            local second = ok(admin.http("POST", path(board, "totals"), request))
            test.eq(#second.groups, 1)
            test.is_nil(second.cursor)
            test.is_true(first.groups[1].person < second.groups[1].person)
            test.eq(first.groups[1].minutes + second.groups[1].minutes, 30)
        end)

        test.it("returns the same grouped rows in the report and CSV and binds list cursors to selectors", function()
            local admin, board = setup()
            local item = steps.create(board, "task")
            local first = create(admin, board, item, "first", 5)
            local second = create(admin, board, item, "second", 10)
            local reports = ok(admin.http("POST", path(board, "totals"), {
                from = date(), to = date(), group_by = "board",
            }))
            test.eq(reports.groups[1].entry_count, 2)
            test.eq(reports.groups[1].minutes, 15)
            local csv = admin.http("GET", path(board, "export.csv?group_by=board&from=" .. date() .. "&to=" .. date()))
            test.eq(csv.status, 200, csv.raw)
            test.not_nil(csv.raw:find('"2","15"', 1, true))

            local prefix = path(board, "worklogs?item=" .. item .. "&limit=1")
            local list = ok(admin.http("GET", prefix))
            test.eq(list.entries[1].id, first.id)
            test.eq(list.entries[1].person_name, "Work test user")
            local after = list.cursor:gsub("([^%w])", function(ch) return string.format("%%%02X", string.byte(ch)) end)
            local page = ok(admin.http("GET", prefix .. "&cursor=" .. after))
            test.eq(page.entries[1].id, second.id)
            local refused = admin.http("GET", prefix .. "&person=unknown&cursor=" .. after)
            test.eq(refused.status, 400, refused.raw)
        end)
        test.it("keeps item totals shared and enforces item and person access across lists, groups, CSV and scopes", function()
            local admin, board = setup(true, "self")
            local member = scoped.member()
            assert(board.call("grant", { subject_id = member.id, mask = 3 }))
            local root = steps.create(board, "task", { [ORIGINAL] = 10 })
            local hidden = steps.create(board, "task", { level = "private" }, root)
            create(admin, board, root, "admin", 8)
            create(member, board, root, "member", 12)
            create(admin, board, hidden, "hidden", 60)

            local direct = ok(member.http("POST", path(board, "totals"), { item = root }))
            test.eq(direct.direct_minutes, 20)
            test.eq(direct.subtree_minutes, 20)
            local summary = ok(member.http("POST", path(board, "summary"), { items = { root, hidden } }))
            test.eq(#summary.items, 1)
            test.eq(summary.items[1].item, root)
            test.is_true(summary.items[1].over_estimate)

            local list = ok(member.http("GET", path(board, "worklogs?item=" .. root)))
            test.eq(#list.entries, 1)
            test.eq(list.entries[1].person, member.id)
            test.eq(#ok(admin.http("GET", path(board, "worklogs?item=" .. root))).entries, 2)
            local denied = member.http("GET", path(board, "worklogs?item=" .. root .. "&person=" .. admin.id))
            test.eq(denied.status, 403, denied.raw)
            local hidden_log = member.http("GET", path(board, "worklogs?item=" .. hidden))
            test.eq(hidden_log.status, 404, hidden_log.raw)

            local report = ok(member.http("POST", path(board, "totals"), { from = date(-7), to = date(), group_by = "person_week" }))
            test.eq(#report.groups, 1)
            test.eq(report.groups[1].minutes, 12)
            test.eq(report.groups[1].person, member.id)
            test.eq(assert(time.parse("2006-01-02", report.groups[1].week)):format("Mon"), "Mon")
            local csv = member.http("GET", path(board, "export.csv?group_by=person_week&from=" .. date(-7) .. "&to=" .. date()))
            test.eq(csv.status, 200, csv.raw)
            test.not_nil(csv.raw:find('"1","12"', 1, true))
            test.is_nil(csv.raw:find(admin.id, 1, true))

            local scoped_rows = assert(member.call("query", {
                scopes = { { id = SCOPE, where = { minutes = { gt = 0 } } } },
            }, board.id))
            test.eq(#scoped_rows.items, 1)
            test.eq(scoped_rows.items[1].id, root)
        end)
    end)
end) }
