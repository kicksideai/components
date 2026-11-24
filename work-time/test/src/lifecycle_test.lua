-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local scoped = require("scoped")
local steps = require("steps")
local fixture = require("fixture")
local test = require("test")
local time = require("time")
local sql = require("sql")
local json = require("json")

type Map = { [string]: any }
local PLUGIN = "kickside.work.time:plugin"
local PROJECTION = "kickside.work.time:items"
local ORIGINAL = "time_original_minutes"
local SCOPE = "app:time_test_scope"

local function date(offset: integer): string
    return time.now():utc():add(offset * 24 * time.HOUR):format("2006-01-02")
end

local function query(statement: string, args: { unknown }): { Map }
    local db = assert(sql.get("app:db"))
    local result, err = db:query(statement, args)
    db:release()
    assert(result and not err, steps.detail(err))
    return result
end

local function execute(statement: string, args: { unknown })
    local db = assert(sql.get("app:db"))
    local _, err = db:execute(statement, args)
    db:release()
    assert(not err, steps.detail(err))
end

local function activate(board: fixture.Handle, rounding: integer?): string
    steps.call(board, "apply_schema", {
        declaration = { plugins = { { use = PLUGIN }, { use = "app:time_test_scope_plugin" } } },
        plugin_configs = { [PLUGIN] = { item_types = { "task" }, rounding_minutes = rounding or 1 } },
    })
    local attachment: string?
    steps.wait_for("Time attachment readiness", function()
        local schema = steps.call(board, "get_schema", {})
        for _, plugin in ipairs(schema.plugins) do
            if plugin.plugin == PLUGIN and plugin.lifecycle.state == "ready" then
                test.not_nil(plugin.projections[PROJECTION], "Time must register its state projection")
                attachment = plugin.attachment_id
            end
        end
        return attachment ~= nil
    end)
    return assert(attachment)
end

local function setup(admin: scoped.Session, holder: scoped.Session?): (fixture.Handle, string)
    local declaration = fixture.declaration(fixture.fresh_prefix()) :: Map
    if holder then
        declaration.fields[#declaration.fields + 1] = { code = "level", form = "text", index = "key" }
        declaration.item_types[3].fields[#declaration.item_types[3].fields + 1] = "level"
        declaration.visibility = { field = "level", levels = {
            { id = "private", holders = { { user = holder.id } } },
        } }
    end
    local board = scoped.board(admin, declaration)
    if holder then assert(board.call("grant", { subject_id = holder.id, mask = 3 })) end
    return board, activate(board)
end

local function mutation(actor: scoped.Session, board: fixture.Handle, method: string, args: Map): (Map?, error?)
    args.board_id = board.id
    local out, err = funcs.new():with_actor(actor.actor):with_scope(actor.scope)
        :call("kickside.work.time.worklogs:" .. method, args)
    return out :: Map?, err
end

local function log(actor: scoped.Session, board: fixture.Handle, item: string, key: string, minutes: integer?, offset: integer?): Map
    local out, err = mutation(actor, board, "create", {
        item = item, key = key, minutes = minutes or 80, work_date = date(offset or 0),
    })
    assert(out and not err, steps.detail(err))
    return out
end

local function caught_up(board: fixture.Handle, min_seq: integer)
    steps.wait_for("Time projection to reach " .. min_seq, function()
        local state = steps.call(board, "plugin_context", { plugin = PLUGIN }).projections[PROJECTION]
        assert(state and not state.parked, tostring(state and state.error))
        return state.last_seq >= min_seq and not state.bootstrapping
    end)
end

local function estimate_events(attachment: string): { Map }
    return query([[SELECT body, external_id FROM kickside_event WHERE thread_id = $1
        AND type = 'kickside.work.time.events:time.over_estimate' ORDER BY seq]], { attachment })
end

local function over_at(actor: scoped.Session, board: fixture.Handle, seq: integer): { Map }
    caught_up(board, seq)
    local result, err = actor.call("query", { min_seq = seq,
        scopes = { { id = SCOPE, where = { over_estimate = { eq = 1 } } } } }, board.id)
    assert(result and not err, steps.detail(err))
    return result.items
end

local function count(kind: string, attachment: string, item: string?): integer
    local args = { attachment }
    if item then args[2] = item end
    local statement = "SELECT COUNT(*) AS n FROM kickside_work_time_" .. kind .. " WHERE attachment_id = $1"
    return assert(tonumber(query(statement .. (item and " AND item_id = $2" or ""), args)[1].n))
end

local function assert_empty(attachment: string, item: string?)
    for _, kind in ipairs({ "worklog", "receipt", "total", "daily" }) do
        test.eq(count(kind, attachment, item), 0, kind)
    end
end

local function sweep(): Map
    local result, err = funcs.call("kickside.work.time.retention:owner", {})
    assert(result and not err, steps.detail(err))
    local report = result :: Map
    assert(report.success, steps.detail(report.error))
    return report
end

local function estimate(board: fixture.Handle, item: string, minutes: integer): integer
    local change = steps.one(board, { op = "set", item = item, values = { [ORIGINAL] = minutes } })
    test.eq(change.status, "applied")
    return (assert(steps.get(board, item))).as_of
end

local function define()
    test.describe("Work Time projection and retention", function()
        test.it("signals observed estimate transitions and coalesces a crossing reversed in one apply", function()
            local admin = scoped.admin()
            local board, attachment = setup(admin)
            local item = steps.create(board, "task", { [ORIGINAL] = 100 })
            log(admin, board, item, "crossing")
            local seq = (assert(steps.get(board, item))).as_of
            test.eq(#over_at(admin, board, seq), 0)
            local result = assert(steps.apply(board, {
                { op = "set", item = item, values = { [ORIGINAL] = 50 } },
                { op = "set", item = item, values = { [ORIGINAL] = 100 } },
            }))
            for _, outcome in ipairs(result.outcomes) do test.eq(outcome.status, "applied") end
            seq = (assert(steps.get(board, item))).as_of
            test.eq(#over_at(admin, board, seq), 0)
            test.eq(#estimate_events(attachment), 0)
            test.eq(over_at(admin, board, estimate(board, item, 50))[1].id, item)
            test.eq(#estimate_events(attachment), 1)
            test.eq(#over_at(admin, board, estimate(board, item, 60)), 1)
            test.eq(#estimate_events(attachment), 1)
            test.eq(#over_at(admin, board, estimate(board, item, 100)), 0)
            local events = estimate_events(attachment)
            test.eq(#events, 2)
            test.is_true(events[1].external_id ~= events[2].external_id)
            for _, event in ipairs(events) do
                local body = assert(json.decode(event.body)) :: Map
                test.eq(body.board_id, board.id)
                test.eq(body.change_kind, "estimate")
                test.is_nil(body.item_id)
            end
        end)

        test.it("keeps the filter current for a restricted item without publishing its transition", function()
            local admin, holder = scoped.admin(), scoped.member()
            local board, attachment = setup(admin, holder)
            local created = assert(holder.call("apply", { ops = { { op = "create", type = "task",
                values = { title = "Private", level = "private", [ORIGINAL] = 100 } } } }, board.id)).outcomes[1]
            test.eq(created.status, "applied")
            local item = created.item
            test.eq(admin.http("POST", "/" .. board.id .. "/get", { item = { id = item } }).status, 404)
            log(holder, board, item, "restricted")
            local edited = assert(holder.call("apply", { ops = { { op = "set", item = item,
                values = { [ORIGINAL] = 50 } } } }, board.id)).outcomes[1]
            test.eq(edited.status, "applied")
            local visible = assert(holder.call("get", { item = { id = item } }, board.id))
            test.eq(visible.item.values[ORIGINAL], 50)
            local matches = over_at(holder, board, visible.as_of)
            test.eq(#matches, 1)
            test.eq(matches[1].id, item)
            test.eq(#over_at(admin, board, visible.as_of), 0)
            test.eq(#estimate_events(attachment), 0)
        end)

        test.it("hides worklogs on trash, restores retained time and drains moved-out scopes", function()
            local admin = scoped.admin()
            local board, attachment = setup(admin)
            local destination, other = setup(admin)
            local item = steps.create(board, "task", { [ORIGINAL] = 50 })
            local first = log(admin, board, item, "keep")
            local second = log(admin, board, item, "deleted")
            assert(mutation(admin, board, "delete", { id = second.id, expected_version = second.version }))
            test.eq(steps.one(board, { op = "delete", item = item }).status, "applied")
            test.eq(#over_at(admin, board, steps.call(board, "query", {}).as_of), 0)
            test.eq(count("worklog", attachment, item), 1)
            test.eq(steps.one(board, { op = "restore", item = item }).status, "applied")
            test.eq(log(admin, board, item, "keep").id, first.id)
            test.eq(#over_at(admin, board, (assert(steps.get(board, item))).as_of), 1)
            local moved = steps.call(board, "move", {
                item = item, to_board = destination.id, key = "retire",
                map = { type = {}, state = {}, fields = {}, relations = {} },
            })
            steps.wait_for("move to finish", function()
                local status = steps.call(board, "move_status", { move_id = moved.move_id })
                assert(status.status ~= "failed", json.encode(status))
                return status.status == "done"
            end)
            caught_up(board, steps.call(board, "query", {}).as_of)
            test.eq(count("worklog", attachment, item), 1)
            sweep()
            assert_empty(attachment, item)
            assert_empty(other)
        end)

        test.it("retires rows missed by the feed when a projection is rebuilt", function()
            local admin = scoped.admin()
            local board, attachment = setup(admin)
            local item = steps.create(board, "task", { [ORIGINAL] = 100 })
            log(admin, board, item, "gone")
            -- Model a Work tombstone already collected before the feed resets.
            execute("DELETE FROM kickside_work_item WHERE board_id = $1 AND item_id = $2", { board.id, item })
            for i = 1, 50 do
                execute("INSERT INTO kickside_work_time_item (attachment_id, item_id) VALUES ($1, $2)",
                    { attachment, "!retired-" .. i })
            end
            test.eq(activate(board, 5), attachment)
            caught_up(board, steps.call(board, "query", {}).as_of)
            local report = sweep()
            for _ = 1, 50 do
                if not report.needs_continue then break end
                report = sweep()
            end
            test.is_false(report.needs_continue)
            assert_empty(attachment, item)
        end)

        test.it("retires a purged item's rows and receipts while keeping a live peer", function()
            local admin = scoped.admin()
            local board, attachment = setup(admin)
            local purged = steps.create(board, "task")
            local live = steps.create(board, "task")
            log(admin, board, purged, "purged")
            log(admin, board, live, "live")
            test.eq(steps.one(board, { op = "delete", item = purged }).status, "applied")
            execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2 AND item_id = $3",
                { "2000-01-01T00:00:00.000000000Z", board.id, purged })
            steps.retention_sweep(function()
                assert(board.call("settle", {}))
                local life = query("SELECT life FROM kickside_work_item WHERE board_id = $1 AND item_id = $2",
                    { board.id, purged })[1]
                return not life or life.life == "purged"
            end)
            caught_up(board, steps.call(board, "query", {}).as_of)
            sweep()
            assert_empty(attachment, purged)
            test.eq(count("worklog", attachment, live), 1)
            test.eq(count("receipt", attachment, live), 1)
        end)

        test.it("drains an exact attachment on deactivation and board deletion", function()
            local admin = scoped.admin()
            local board, retired = setup(admin)
            local item = steps.create(board, "task")
            log(admin, board, item, "old")
            steps.call(board, "apply_schema", { declaration = { plugins = {} } })
            steps.deleted(retired)
            local active = activate(board)
            test.is_true(retired ~= active)
            log(admin, board, item, "new")
            sweep()
            assert_empty(retired)
            test.eq(count("worklog", active), 1)
            assert(board.call("delete", {}))
            steps.reaped(board, active)
            sweep()
            assert_empty(active)
        end)

        test.it("drains expired rows in bounded batches and returns the next UTC deadline", function()
            local admin = scoped.admin()
            local board, attachment = setup(admin)
            local item = steps.create(board, "task", { [ORIGINAL] = 200 })
            log(admin, board, item, "retained", 60, -364)
            for i = 1, 51 do log(admin, board, item, "expired-" .. i, 5, -363) end
            local deleted = log(admin, board, item, "explicit")
            assert(mutation(admin, board, "delete", { id = deleted.id, expected_version = deleted.version }))
            execute("UPDATE kickside_work_time_receipt SET expires_on = $1 WHERE attachment_id = $2 AND entry_id = $3",
                { date(-1), attachment, deleted.id })
            execute("UPDATE kickside_work_time_worklog SET work_date = $1 WHERE attachment_id = $2 AND work_date = $3",
                { date(-365), attachment, date(-363) })
            execute("UPDATE kickside_work_time_daily SET work_date = $1 WHERE attachment_id = $2 AND work_date = $3",
                { date(-365), attachment, date(-363) })
            local report = sweep()
            test.is_true(report.needs_continue)
            test.is_true(count("worklog", attachment) > 1)
            repeat report = sweep() until not report.needs_continue
            test.eq(count("worklog", attachment), 1)
            test.eq(count("receipt", attachment), 1)
            test.eq(count("daily", attachment), 1)
            local total = query("SELECT minutes, entry_count, over_estimate FROM kickside_work_time_total WHERE attachment_id = $1",
                { attachment })[1]
            test.eq(tonumber(total.minutes), 60)
            test.eq(tonumber(total.entry_count), 1)
            test.eq(tonumber(total.over_estimate), 0)
            test.eq(report.deadline_ms, assert(time.parse("2006-01-02", date(1))):unix_nano() // 1000000)
        end)
    end)
end

return { run = test.run_cases(define) }
