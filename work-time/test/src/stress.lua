-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local logger = require("logger"):named("work_time.stress")
local sql = require("sql")
local time = require("time")
local layout = require("layout")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")

local TIME = "kickside.work.time:plugin"
local SCOPE = "kickside.work.time.reads:logged_time"
local TOTAL = 100000
local SMALL_TOTALS = 1000
local LARGE_TOTALS = 100000
local TOTAL_FIXTURE_PREFIX = "00000000-0000-4000-8000-"
local BOARD_COUNT = 4
local ITEMS = 24
local EXPIRED_PER_BOARD = 250
local BATCH = 50

type Subject = { board: fixture.Handle, attachment: string, items: { string }, sprint: string? }

local function ok(reply)
    test.eq(reply.status, 200, reply.raw)
    return reply.body.data
end

local function date(now, offset)
    return now:add(offset * 24 * time.HOUR):format("2006-01-02")
end

local function endpoint(board, suffix)
    return "/" .. board.id .. "/time/" .. suffix
end

local function activate(board, type_id, combined)
    local plugins = { { use = TIME } }
    if combined then plugins[#plugins + 1] = { use = "kickside.work.planning:plugin" } end
    steps.call(board, "apply_schema", { declaration = { plugins = plugins },
        plugin_configs = { [TIME] = { item_types = { type_id } } } })
    local attachment
    steps.wait_for("Time attachment readiness", function()
        local plugin = steps.call(board, "plugin_context", { plugin = TIME })
        attachment = plugin.attachment_id
        return plugin.lifecycle.state == "ready"
    end)
    return attachment
end

local function sample(fn)
    fn()
    local samples = {}
    for i = 1, 21 do
        local start = time.now():unix_nano()
        fn()
        samples[i] = (time.now():unix_nano() - start) / 1e6
    end
    table.sort(samples)
    return string.format("median %.2f ms, p95 %.2f ms (n=%d)", samples[11], samples[20], #samples)
end

local function read_page(board)
    local result = steps.call(board, "query", { limit = ITEMS })
    test.eq(#result.items, ITEMS, "unfiltered Work page")
end

-- Seed complete mutation state in one transaction per board. Real HTTP writes
-- create the attachment and one worklog per board before the bulk insert.
local function seed(db, board, attachment, items, sprint, now)
    local tx = assert(db:begin())
    assert(tx:execute([[CREATE TEMP TABLE work_time_stress_seed (
        entry_id TEXT, item_id TEXT, person_id TEXT, work_date TEXT, sprint_id TEXT)]], {}))
    local args = { TOTAL // BOARD_COUNT - 1, EXPIRED_PER_BOARD, date(now, -365), sprint or "" }
    local dates, slots = {}, {}
    for i = 1, ITEMS do
        args[#args + 1] = items[i]
        slots[i] = "(" .. i .. ", CAST($" .. #args .. " AS TEXT))"
    end
    for i = 1, 31 do
        args[#args + 1] = date(now, 1 - i)
        dates[i] = "(" .. (i - 1) .. ", CAST($" .. #args .. " AS TEXT))"
    end
    assert(tx:execute([[WITH RECURSIVE input(entry_count, expired_count, expiry_day, sprint_id) AS (
            VALUES (CAST($1 AS INTEGER), CAST($2 AS INTEGER), CAST($3 AS TEXT), CAST($4 AS TEXT))),
        numbers(n) AS (VALUES (1) UNION ALL SELECT n + 1 FROM numbers, input WHERE n < input.entry_count),
        items(slot, id) AS (VALUES ]] .. table.concat(slots, ",") .. [[),
        dates(slot, day) AS (VALUES ]] .. table.concat(dates, ",") .. [[)
        INSERT INTO work_time_stress_seed (entry_id, item_id, person_id, work_date, sprint_id)
        SELECT 'stress-' || n, items.id, 'stress-person-' || (n % 40),
            CASE WHEN n <= input.expired_count THEN input.expiry_day ELSE dates.day END,
            CASE WHEN items.slot = 1 THEN input.sprint_id ELSE '' END
        FROM numbers JOIN items ON items.slot = CASE WHEN n % 3 = 0 THEN 1 ELSE 2 + ((n / 1000) % 23) END
        JOIN dates ON dates.slot = (n / 40) % 31 CROSS JOIN input]], args))
    assert(tx:execute([[INSERT INTO kickside_work_time_item (attachment_id, item_id)
        SELECT DISTINCT $1, item_id FROM work_time_stress_seed WHERE TRUE ON CONFLICT DO NOTHING]], { attachment }))
    assert(tx:execute([[INSERT INTO kickside_work_time_worklog
        (attachment_id, board_id, item_id, person_id, entry_id, version, minutes, work_date, sprint_id)
        SELECT $1, $2, item_id, person_id, entry_id, 1, 5, work_date, NULLIF(sprint_id, '') FROM work_time_stress_seed]],
        { attachment, board.id }))
    assert(tx:execute([[INSERT INTO kickside_work_time_receipt
        (attachment_id, person_id, request_key, request_hash, item_id, entry_id, creation_version, created_on)
        SELECT $1, person_id, entry_id, 'fixture', item_id, entry_id, 1, $2 FROM work_time_stress_seed]],
        { attachment, date(now, 0) }))
    assert(tx:execute([[INSERT INTO kickside_work_time_total (attachment_id, board_id, item_id, minutes, entry_count)
        SELECT $1, $2, item_id, COUNT(*) * 5, COUNT(*) FROM work_time_stress_seed GROUP BY item_id
        ON CONFLICT (attachment_id, item_id) DO UPDATE SET
            minutes = kickside_work_time_total.minutes + excluded.minutes,
            entry_count = kickside_work_time_total.entry_count + excluded.entry_count]], { attachment, board.id }))
    assert(tx:execute([[INSERT INTO kickside_work_time_daily
        (attachment_id, item_id, person_id, sprint_id, work_date, minutes, entry_count)
        SELECT $1, item_id, person_id, sprint_id, work_date, COUNT(*) * 5, COUNT(*)
        FROM work_time_stress_seed GROUP BY item_id, person_id, sprint_id, work_date]], { attachment }))
    assert(tx:execute("DROP TABLE work_time_stress_seed", {}))
    assert(tx:commit())
end

local function plan(db, label, statement, params, index)
    local postgres = db:type() == sql.type.POSTGRES
    local explain = postgres and "EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) " or "EXPLAIN QUERY PLAN "
    local lines = {}
    for _, row in ipairs(assert(db:query(explain .. statement, params))) do
        lines[#lines + 1] = postgres and row["QUERY PLAN"] or row.detail
    end
    local output = table.concat(lines, "\n")
    logger:info("V1 plan " .. label .. "\n" .. output)
    test.not_nil(output:find(index, 1, true), label .. "\n" .. output)
    return output
end

local function scope_plan(db, board, cardinality)
    assert(db:execute("ANALYZE kickside_work_time_total", {}))
    assert(db:execute("ANALYZE " .. layout.names(board.id).item, {}))
    local predicate = { limit = ITEMS, scopes = { { id = SCOPE, where = { minutes = { gt = 0 } } } } }
    test.eq(#steps.call(board, "query", predicate).items, ITEMS, "Time-filtered Work page")
    local work = steps.call(board, "explain", predicate).plan
    local pg = db:type() == sql.type.POSTGRES
    local output = plan(db, "Work has-time filter at " .. cardinality .. " totals", work.statement, work.args,
        pg and "kickside_work_time_total_pkey" or "attachment_id=? AND item_id=?")
    if not pg then return end

    local probe, condition = output:match("(Scan using kickside_work_time_total_pkey[^\n]*)\n%s+Index Cond: ([^\n]+)")
    test.not_nil(probe, output)
    test.eq(tonumber(probe:match("loops=(%d+)")), ITEMS, output)
    test.not_nil(condition:match("attachment_id = [%w_]+%.attachment_id"), output)
    test.not_nil(condition:find("item_id = i.item_id", 1, true), output)
    local total_cost = output:match("^Limit%s+%(cost=[%d%.]+%.%.([%d%.]+)")
    return assert(tonumber(total_cost), output)
end

local function plans(db, subject, today, cutoff)
    local attachment = subject.attachment
    for _, table_name in ipairs({ "kickside_work_time_worklog", "kickside_work_time_daily",
        "kickside_work_time_receipt" }) do
        assert(db:execute("ANALYZE " .. table_name, {}))
    end
    plan(db, "hot item cursor", [[SELECT work_date, entry_id FROM kickside_work_time_worklog
        WHERE attachment_id = $1 AND item_id = $2 AND (work_date, entry_id) < ($3, $4)
        ORDER BY work_date DESC, entry_id DESC LIMIT 26]],
        { attachment, subject.items[1], today, "stress-20000" }, "kickside_work_time_worklog_item_date")
    plan(db, "person cursor", [[SELECT work_date, entry_id FROM kickside_work_time_worklog
        WHERE attachment_id = $1 AND person_id = $2 AND work_date >= $3 AND work_date <= $4
        ORDER BY work_date, entry_id LIMIT 26]],
        { attachment, "stress-person-1", cutoff, today }, "kickside_work_time_worklog_person_date")
    plan(db, "board date buckets", [[SELECT work_date, item_id, person_id, sprint_id, minutes, entry_count
        FROM kickside_work_time_daily WHERE attachment_id = $1 AND work_date >= $2 AND work_date <= $3
        ORDER BY work_date, item_id, person_id, sprint_id LIMIT 4097]],
        { attachment, today, today }, "kickside_work_time_daily_board_date")
    plan(db, "sprint date buckets", [[SELECT work_date, item_id, person_id, sprint_id, minutes, entry_count
        FROM kickside_work_time_daily WHERE attachment_id = $1 AND sprint_id = $2 AND work_date >= $3 AND work_date <= $4
        ORDER BY work_date, item_id, person_id, sprint_id LIMIT 4097]],
        { attachment, subject.sprint, cutoff, today }, "kickside_work_time_daily_sprint_date")
    plan(db, "expiry head", [[SELECT attachment_id, entry_id FROM kickside_work_time_worklog
        WHERE work_date < $1 ORDER BY work_date, attachment_id, entry_id LIMIT $2]],
        { cutoff, BATCH }, "kickside_work_time_worklog_expiry")
end

local function count(db, table_name, where, params)
    return tonumber(assert(db:query("SELECT COUNT(*) AS count FROM " .. table_name .. " WHERE " .. where, params))[1].count)
end

-- Hold the Work page and its real 100k worklogs fixed while growing the totals
-- index on all four active attachments, including the attachment under test.
local function grow_totals(db, subjects, cardinality)
    local per_attachment = cardinality // #subjects
    for _, subject in ipairs(subjects) do
        local args = { subject.attachment }
        local existing = count(db, "kickside_work_time_total", "attachment_id = $1", args)
        test.is_true(existing < per_attachment)
        assert(db:execute([[WITH RECURSIVE input(first_id, last_id, attachment, board, prefix) AS (
                VALUES (CAST($1 AS INTEGER), CAST($2 AS INTEGER), CAST($3 AS TEXT), CAST($4 AS TEXT), CAST($5 AS TEXT))),
            numbers(n) AS (SELECT first_id FROM input UNION ALL SELECT n + 1 FROM numbers, input WHERE n < last_id)
            INSERT INTO kickside_work_time_total (attachment_id, board_id, item_id, minutes, entry_count)
            SELECT attachment, board, prefix || SUBSTR('000000000000' || n, LENGTH(CAST(n AS TEXT)) + 1, 12), 5, 1
            FROM numbers CROSS JOIN input]],
            { existing + 1, per_attachment, subject.attachment, subject.board.id, TOTAL_FIXTURE_PREFIX }))
        test.eq(count(db, "kickside_work_time_total", "attachment_id = $1", args), per_attachment)
    end
end

local function drain(admin, db, subjects, now)
    local today, cutoff = date(now, 0), date(now, -364)
    local expected = BOARD_COUNT * EXPIRED_PER_BOARD
    local actor = funcs.new():with_actor(admin.actor):with_scope(admin.scope)
    local start = time.now():unix_nano()
    local removed, writes = 0, 0
    for i = 1, expected // BATCH do
        local subject = subjects[(i - 1) % #subjects + 1]
        local pending = assert(actor:async("kickside.work.time.worklogs:create", {
            board_id = subject.board.id, item = subject.items[1], key = "concurrent-" .. i,
            minutes = 5, work_date = today,
        }))
        local result, err = funcs.call("kickside.work.time.retention:owner", {})
        assert(result and result.success, steps.detail(err or (result and result.error)))
        test.eq(result.deleted, 2 * BATCH, "one batch of logs and their receipts")
        test.eq(result.needs_continue, i < expected // BATCH)
        pending:response():receive()
        local response, write_err = pending:result()
        assert(response and response:data(), steps.detail(write_err))
        writes = writes + 1
        removed = removed + result.deleted // 2
    end
    local seconds = (time.now():unix_nano() - start) / 1e9
    logger:info(string.format("V1 retention %d entries and receipts in %.2fs, %.1f entries/s, %d concurrent writes",
        removed, seconds, removed / seconds, writes))
    test.eq(removed, expected)
    for _, subject in ipairs(subjects) do
        local args = { subject.attachment }
        local expected_count = TOTAL // BOARD_COUNT - EXPIRED_PER_BOARD + writes // #subjects
        test.eq(count(db, "kickside_work_time_worklog", "attachment_id = $1 AND work_date < $2",
            { subject.attachment, cutoff }), 0)
        test.eq(count(db, "kickside_work_time_receipt", "attachment_id = $1", args), expected_count)
        for _, aggregate in ipairs({ "daily", "total" }) do
            local row = assert(db:query("SELECT SUM(entry_count) AS n, SUM(minutes) AS minutes FROM kickside_work_time_"
                .. aggregate .. " WHERE attachment_id = $1", args))[1]
            test.eq(tonumber(row.n), expected_count)
            test.eq(tonumber(row.minutes), expected_count * 5)
        end
    end
end

return { run = test.run_cases(function()
    test.describe("100,000 Time worklogs", function()
        test.it("keeps hot reads bounded and expiry moving while real writes continue", function()
            local db = assert(sql.get("app:db"))
            local admin = scoped.admin()
            local now = time.now():utc()
            local today, cutoff = date(now, 0), date(now, -364)
            local subjects: { Subject } = {}
            local baseline
            for i = 1, BOARD_COUNT do
                local combined = i == 1
                local board = combined and scoped.board(admin, { key_prefix = fixture.fresh_prefix() },
                    "kickside.work.planning:pack") or scoped.board(admin)
                local type_id = combined and "issue" or "task"
                local sprint = combined and steps.create(board, "sprint", { name = "Hot sprint",
                    planning_start = date(now, -31), planning_end = date(now, 1) }) or nil
                local items = {}
                for j = 1, ITEMS do
                    items[j] = steps.create(board, type_id, sprint and j == 1 and {
                        current_sprint = { board = board.id, item = sprint },
                    } or {})
                end
                if i == 2 then baseline = sample(function() read_page(board) end) end
                local attachment = activate(board, type_id, combined)
                ok(admin.http("POST", endpoint(board, "worklogs"), {
                    item = items[1], minutes = 5, key = "live", work_date = today,
                }))
                seed(db, board, attachment, items, sprint, now)
                test.eq(count(db, "kickside_work_time_worklog", "attachment_id = $1", { attachment }), TOTAL // BOARD_COUNT)
                test.eq(count(db, "kickside_work_time_worklog w", [[attachment_id = $1 AND NOT EXISTS (
                    SELECT 1 FROM kickside_work_item i WHERE i.board_id = w.board_id AND i.item_id = w.item_id)]],
                    { attachment }), 0, "every seeded worklog references a real item on its board")
                subjects[i] = { board = board, attachment = attachment, items = items, sprint = sprint }
            end

            local hot, enabled = subjects[1], subjects[2]
            assert(db:execute("ANALYZE kickside_work_item", {}))
            assert(db:execute("ANALYZE kickside_work_plugin", {}))
            grow_totals(db, subjects, SMALL_TOTALS)
            local small_cost = scope_plan(db, enabled.board, SMALL_TOTALS)
            grow_totals(db, subjects, LARGE_TOTALS)
            local large_cost = scope_plan(db, enabled.board, LARGE_TOTALS)
            if db:type() == sql.type.POSTGRES then
                test.is_true(large_cost <= small_cost * 1.10,
                    string.format("one Work page cost rose from %.2f to %.2f", small_cost, large_cost))
            end
            logger:info("V1 Work-only page " .. baseline)
            logger:info("V1 Time-enabled Work page " .. sample(function() read_page(enabled.board) end))
            logger:info("V1 Time-filtered Work page " .. sample(function()
                local result = steps.call(enabled.board, "query", { limit = ITEMS,
                    scopes = { { id = SCOPE, where = { minutes = { gt = 0 } } } } })
                test.eq(#result.items, ITEMS, "Time-filtered Work page")
            end))
            local summary_requests = 0
            local summary = sample(function()
                summary_requests = summary_requests + 1
                local result = ok(admin.http("POST", endpoint(enabled.board, "summary"), { items = enabled.items }))
                test.eq(#result.items, ITEMS, "Time card summary")
            end)
            test.eq(summary_requests, 22)
            logger:info(string.format("V1 card summary %s, %d requests for %d windows of %d cards", summary,
                summary_requests, 22, ITEMS))

            plans(db, hot, today, cutoff)
            local entries = ok(admin.http("GET", endpoint(hot.board,
                "worklogs?sort=newest&limit=25&item=" .. hot.items[1])))
            test.eq(#entries.entries, 25)
            test.not_nil(entries.cursor)
            local over_budget = admin.http("POST", endpoint(hot.board, "totals"), {
                from = cutoff, to = today, group_by = "board",
            })
            test.eq(over_budget.status, 400, over_budget.raw)
            test.eq(over_budget.body.details.code, "time_read_limit")
            local sprint = ok(admin.http("POST", endpoint(hot.board, "totals"), {
                from = cutoff, to = today, group_by = "sprint", sprint = hot.sprint,
            })).groups[1]
            local sprint_total = count(db, "kickside_work_time_worklog",
                "attachment_id = $1 AND sprint_id = $2 AND work_date >= $3", { hot.attachment, hot.sprint, cutoff })
            test.is_true(sprint_total > 8000)
            test.eq(sprint.entry_count, sprint_total)
            test.eq(sprint.minutes, sprint_total * 5)
            local board = ok(admin.http("POST", endpoint(hot.board, "totals"), {
                from = today, to = today, group_by = "board",
            })).groups[1]
            test.eq(board.entry_count, count(db, "kickside_work_time_worklog", "attachment_id = $1 AND work_date = $2",
                { hot.attachment, today }))
            -- These rows only model index cardinality. Reconcile real mutation state below.
            for _, subject in ipairs(subjects) do
                assert(db:execute([[DELETE FROM kickside_work_time_total WHERE attachment_id = $1 AND item_id LIKE $2]],
                    { subject.attachment, TOTAL_FIXTURE_PREFIX .. "%" }))
            end
            drain(admin, db, subjects, now)
            assert(db:release())
        end)
    end)
end) }
