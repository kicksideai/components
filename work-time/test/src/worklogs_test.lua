-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local sql = require("sql")
local time = require("time")
local json = require("json")
local scoped = require("scoped")
local steps = require("steps")
local fixture = require("fixture")
local test = require("test")

type Map = { [string]: any }
local PLUGIN = "kickside.work.time:plugin"
local ORIGINAL = "time_original_minutes"

local function today(offset: integer?): string
    return time.now():utc():add((offset or 0) * 24 * time.HOUR):format("2006-01-02")
end

local function setup(rounding: integer?, restricted: boolean?): (scoped.Session, fixture.Handle, string)
    local admin = scoped.admin()
    local board = scoped.board(admin)
    local declaration: Map = { plugins = { { use = PLUGIN } } }
    if restricted then
        declaration.fields = { { code = "level", form = "text", index = "key" } }
        declaration.item_types = { { id = "task", process = "delivery", parent_types = { false, "story", "task" },
            fields = { "title", "estimate", "labels", "level" } } }
        declaration.visibility = { field = "level", bypass = "admin", levels = {
            { id = "private", holders = { { user = admin.id } } },
        } }
    end
    local activated = admin.http("POST", "/" .. board.id .. "/apply_schema", {
        declaration = declaration,
        plugin_configs = { [PLUGIN] = { item_types = { "task" }, rounding_minutes = rounding or 1 } },
    })
    test.eq(activated.status, 200, activated.raw)
    local attachment: string? = nil
    steps.wait_for("Time attachment ready", function()
        local schema = steps.call(board, "get_schema", {})
        local plugin = schema.plugins[1]
        attachment = plugin.attachment_id
        return plugin.lifecycle.state == "ready"
    end)
    return admin, board, assert(attachment)
end

local function request(board: fixture.Handle, item: string, key: string, minutes: number): Map
    return { board_id = board.id, item = item, key = key, minutes = minutes, work_date = today() }
end

local function executor(session: scoped.Session): funcs.Executor
    return funcs.new():with_actor(session.actor):with_scope(session.scope)
end

local function invoke(actor: scoped.Session, op: string, input: Map): (Map?, error?)
    local result, err = executor(actor):call("kickside.work.time.worklogs:" .. op, input)
    return result :: Map?, err
end

local function run(actor: scoped.Session, op: string, input: Map): Map
    local result, err = invoke(actor, op, input)
    assert(not err and result, steps.detail(err))
    return result
end

local function refused(actor: scoped.Session, op: string, input: Map, kind: string, code: string?)
    local result, err = invoke(actor, op, input)
    test.is_nil(result)
    test.not_nil(err)
    local failure = err :: error
    test.eq(failure:kind(), kind, steps.detail(failure))
    if code then test.eq(failure:details().code, code) end
end

local function query(statement: string, args: { string }): { Map }
    local db = assert(sql.get("app:db"))
    local rows, err = db:query(statement, args)
    db:release()
    assert(not err and rows, tostring(err))
    return rows :: { Map }
end

local function execute(statement: string, args: { string })
    local db = assert(sql.get("app:db"))
    local _, err = db:execute(statement, args)
    db:release()
    assert(not err, tostring(err))
end

local function totals(attachment: string): { Map }
    return query("SELECT * FROM kickside_work_time_total WHERE attachment_id = $1", { attachment })
end

local function daily(attachment: string): { Map }
    return query("SELECT * FROM kickside_work_time_daily WHERE attachment_id = $1 ORDER BY work_date", { attachment })
end

local function facts(attachment: string): { Map }
    return query([[SELECT type, body, external_id FROM kickside_event WHERE thread_id = $1
        AND type IN ('kickside.work.time.events:worklog.changed', 'kickside.work.time.events:time.over_estimate') ORDER BY seq]], { attachment })
end

local function complete(future: funcs.Future): (Map?, error?)
    future:response():receive()
    local payload, err = future:result()
    if err or not payload then return nil, err end
    local result, result_err = payload:data()
    return result :: Map?, result_err
end

local function define()
    test.describe("Work Time worklog transactions", function()
        test.it("commits rounded direct and daily totals with redacted facts and a stable creation receipt", function()
            local admin, board, attachment = setup(30)
            local item = steps.create(board, "task", { title = "Crossing", [ORIGINAL] = 20 })
            local input = request(board, item, "create", 15)
            input.note = "plain author note"
            local log = run(admin, "create", input)
            test.eq(log.version, 1)
            test.is_false(log.replayed)
            test.eq(tonumber(totals(attachment)[1].minutes), 30)
            test.eq(tonumber(daily(attachment)[1].entry_count), 1)
            test.eq(tonumber(totals(attachment)[1].over_estimate), 1)
            local events = facts(attachment)
            test.eq(#events, 2)
            test.eq(events[1].type, "kickside.work.time.events:worklog.changed")
            test.eq(events[2].type, "kickside.work.time.events:time.over_estimate")
            for _, event in ipairs(events) do
                local payload = assert(json.decode(event.body))
                test.eq(payload.board_id, board.id)
                test.not_nil(payload.change_kind)
                local fields = 0
                for _ in pairs(payload) do fields = fields + 1 end
                test.eq(fields, 2)
                test.not_nil(event.external_id)
            end

            local edited = run(admin, "edit", { board_id = board.id, id = log.id, expected_version = 1, work_date = today(-1) })
            test.eq(edited.version, 2)
            test.eq(#daily(attachment), 1)
            test.eq(daily(attachment)[1].work_date, today(-1))
            test.eq(tonumber(daily(attachment)[1].minutes), 30)
            local update = admin.http("POST", "/" .. board.id .. "/configure_plugin", {
                plugin = PLUGIN, config = { item_types = { "task" }, rounding_minutes = 1 },
            })
            test.eq(update.status, 200, update.raw)
            local replay = run(admin, "create", input)
            test.is_true(replay.replayed)
            test.eq(replay.id, log.id)
            test.eq(replay.version, 1)
            input.minutes = 16
            refused(admin, "create", input, errors.CONFLICT, "worklog_key_conflict")
            input.minutes = 15
            refused(admin, "delete", { board_id = board.id, id = log.id, expected_version = 1 }, errors.CONFLICT, "worklog_version_conflict")
            test.eq(run(admin, "delete", { board_id = board.id, id = log.id, expected_version = 2 }).version, 3)
            test.eq(#daily(attachment), 0)
            test.eq(#totals(attachment), 0)
            test.eq(run(admin, "create", input).id, log.id)
            local receipt = query("SELECT created_on, expires_on FROM kickside_work_time_receipt WHERE attachment_id = $1", { attachment })[1]
            test.eq(receipt.created_on, today())
            test.eq(receipt.expires_on, today(30))
            test.eq(#facts(attachment), 4)
        end)

        test.it("keeps the other entries in a shared daily bucket when one entry changes", function()
            local admin, board, attachment = setup()
            local item = steps.create(board, "task")
            local entry = run(admin, "create", request(board, item, "first", 15))
            run(admin, "create", request(board, item, "second", 5))
            test.eq(tonumber(daily(attachment)[1].entry_count), 2)
            run(admin, "edit", { board_id = board.id, id = entry.id, expected_version = 1, minutes = 10 })
            test.eq(tonumber(daily(attachment)[1].minutes), 15)
            run(admin, "delete", { board_id = board.id, id = entry.id, expected_version = 2 })
            local bucket = daily(attachment)[1]
            test.eq(tonumber(bucket.minutes), 5)
            test.eq(tonumber(bucket.entry_count), 1)
            test.eq(tonumber(totals(attachment)[1].minutes), 5)
        end)

        test.it("rolls back the entry, receipt and aggregates when the attachment refuses an append", function()
            local admin, board, attachment = setup()
            local item = steps.create(board, "task")
            local input = request(board, item, "blocked", 15)
            execute("UPDATE kickside_thread SET deleting_at = CURRENT_TIMESTAMP WHERE id = $1", { attachment })
            refused(admin, "create", input, errors.CONFLICT)
            test.eq(#query("SELECT entry_id FROM kickside_work_time_worklog WHERE attachment_id = $1", { attachment }), 0)
            test.eq(#query("SELECT entry_id FROM kickside_work_time_receipt WHERE attachment_id = $1", { attachment }), 0)
            test.eq(#daily(attachment), 0)
            test.eq(#totals(attachment), 0)
            test.eq(#facts(attachment), 0)
            execute("UPDATE kickside_thread SET deleting_at = NULL WHERE id = $1", { attachment })
            test.is_false(run(admin, "create", input).replayed)
        end)

        test.it("lets only an attachment administrator read raw events and reserves publication", function()
            local admin, board, attachment = setup()
            local writer = scoped.member()
            assert(admin.call("grant", { subject_id = writer.id, mask = 3 }, attachment))
            local item = steps.create(board, "task")
            run(admin, "create", request(board, item, "event", 15))
            local page, err = admin.call("events", {}, attachment)
            assert(not err and page, steps.detail(err))
            test.eq(page.events[1].type, "kickside.work.time.events:worklog.changed")
            local denied, read_err = writer.call("events", {}, attachment)
            test.is_nil(denied)
            test.eq(assert(read_err):kind(), errors.PERMISSION_DENIED)
            local forged, append_err = admin.call("append", { writes = { { thread_id = attachment, events = { {
                type = "kickside.work.time.events:worklog.changed", body = { board_id = board.id, change_kind = "create" },
            } } } } }, attachment)
            test.is_nil(forged)
            test.eq(assert(append_err):kind(), errors.PERMISSION_DENIED)
            test.eq(#facts(attachment), 1)
        end)

        test.it("derives the person from the caller and enforces board and live item access on mutations and replay", function()
            local admin, board, attachment = setup(nil, true)
            local author, writer, reader = scoped.member(), scoped.member(), scoped.member()
            for _, session in ipairs({ author, writer }) do
                assert(board.call("grant", { subject_id = session.id, mask = 3 }))
            end
            assert(board.call("grant", { subject_id = reader.id, mask = 1 }))
            local item = steps.create(board, "task", { title = "Visible" })
            local hidden = steps.create(board, "task", { title = "Hidden", level = "private", [ORIGINAL] = 1 })
            local other = steps.create(board, "epic", { title = "Time disabled" })
            local input = request(board, item, "same-key", 8)
            refused(reader, "create", input, errors.PERMISSION_DENIED)
            refused(writer, "create", request(board, hidden, "hidden", 10), errors.NOT_FOUND)
            refused(writer, "create", request(board, other, "epic", 10), errors.INVALID, "worklog_type_disabled")
            local log = run(author, "create", input)
            local rows = query("SELECT person_id FROM kickside_work_time_worklog WHERE attachment_id = $1", { attachment })
            test.eq(rows[1].person_id, author.id)
            local edit = { board_id = board.id, id = log.id, expected_version = 1, minutes = 10 }
            refused(writer, "edit", edit, errors.PERMISSION_DENIED)
            test.eq(run(admin, "edit", edit).version, 2)
            test.eq(run(author, "edit", { board_id = board.id, id = log.id, expected_version = 2, note = "corrected" }).version, 3)
            assert(board.call("revoke", { subject_id = author.id }))
            refused(author, "create", input, errors.PERMISSION_DENIED)
            local other_log = run(writer, "create", input)
            test.is_true(other_log.id ~= log.id)
            local _, source = setup()
            assert(source.call("grant", { subject_id = admin.id, mask = 3 }))
            refused(admin, "edit", { board_id = source.id, id = log.id, expected_version = 2, minutes = 12 }, errors.NOT_FOUND)
            local hidden_log = run(admin, "create", request(board, hidden, "admin", 10))
            test.not_nil(hidden_log.id)
            test.eq(#facts(attachment), 5, "boards with an item visibility rule suppress the over-estimate signal")
            test.eq(steps.one(board, { op = "delete", item = item }).status, "applied")
            refused(writer, "create", input, errors.NOT_FOUND)
        end)

        test.it("rejects invalid work dates, minutes and keys without leaving writes", function()
            local admin, board, attachment = setup()
            local item = steps.create(board, "task")
            local input = request(board, item, "input", 10)
            for _, date in ipairs({ today(-365), today(1), "2026-02-30", "2026-1-01" }) do
                input.work_date = date
                refused(admin, "create", input, errors.INVALID, "worklog_date_invalid")
            end
            input.work_date = today()
            for _, minutes in ipairs({ 0, -1, 1.5 }) do
                input.minutes = minutes
                refused(admin, "create", input, errors.INVALID, "worklog_minutes_invalid")
            end
            input.minutes = 10
            input.key = ""
            refused(admin, "create", input, errors.INVALID, "worklog_key_invalid")
            test.eq(#totals(attachment), 0)
            test.eq(#facts(attachment), 0)
        end)

        test.it("serializes concurrent create replay and competing entry version writes", function()
            local admin, board, attachment = setup()
            local item = steps.create(board, "task")
            local client = executor(admin)
            local input = request(board, item, "race", 10)
            local first = assert(client:async("kickside.work.time.worklogs:create", input))
            local second = assert(client:async("kickside.work.time.worklogs:create", input))
            local one, two = assert(complete(first)), assert(complete(second))
            test.eq(one.id, two.id)
            test.is_true(one.replayed ~= two.replayed)
            test.eq(tonumber(totals(attachment)[1].minutes), 10)
            local function edit(minutes: integer): funcs.Future
                return assert(client:async("kickside.work.time.worklogs:edit", {
                    board_id = board.id, id = one.id, expected_version = 1, minutes = minutes,
                }))
            end
            first, second = edit(15), edit(20)
            local updated, uerr = complete(first)
            local competing, cerr = complete(second)
            test.is_true((updated == nil) ~= (competing == nil))
            local err = assert(uerr or cerr)
            test.eq(err:kind(), errors.CONFLICT)
            test.eq(err:details().code, "worklog_version_conflict")
            local expected = updated and 15 or 20
            test.eq(tonumber(totals(attachment)[1].minutes), expected)
            test.eq(tonumber(daily(attachment)[1].minutes), expected)
            test.eq(#facts(attachment), 2)
        end)
    end)
end

return { run = test.run_cases(define) }
