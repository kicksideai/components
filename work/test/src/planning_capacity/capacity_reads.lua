-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local store = require("store")
local funcs = require("funcs")
local security = require("security")

local PLUGIN = "kickside.work.planning:plugin"
local PACK = "kickside.work.planning:pack"

local function report(caller, method, input)
    local policy = assert(security.policy("app:capacity_test_call"))
    local executor = funcs.new():with_actor(caller.actor):with_scope(caller.scope:with(policy))
    return executor:call("app:capacity_report_call", { method = method, input = input })
end

local function board(caller)
    local h = scoped.board(caller, {
        key_prefix = fixture.fresh_prefix(),
        fields = {
            { code = "title", form = "text" },
            { code = "assignee", type = "principal", index = "key" },
            { code = "estimate", form = "int", index = "number" },
            { code = "visibility_level", form = "text", index = "key" },
        },
        item_types = {
            { id = "task", process = "delivery", fields = { "title", "assignee", "estimate", "visibility_level" } },
        },
        processes = { { id = "delivery", initial = "open", states = {
            { id = "open", category = "started" }, { id = "done", category = "completed" },
            { id = "canceled", category = "canceled" },
        }, transitions = {
            { id = "finish", from = { "open" }, to = "done" }, { id = "cancel", from = { "open" }, to = "canceled" },
        } } },
        visibility = { field = "visibility_level", bypass = "admin", levels = { { id = "private", holders = {} } } },
    })
    assert(h.call("pack_apply", { pack = PACK, expected_generation = 1, key = "planning",
        plugin_configs = { [PLUGIN] = { issue_types = { "task" }, points_field = "estimate" } } }))
    return h
end

local function attachment(h)
    for _, plugin in ipairs(assert(h.call("get_schema", {})).plugins) do
        if plugin.plugin == PLUGIN then return assert(plugin.attachment_id) end
    end
    error("Planning is not active")
end

local function capacity(h, sprint, unit)
    local db = assert(store.open())
    local id = attachment(h)
    assert(db:execute([[INSERT INTO kickside_work_planning_sprint (attachment_id, board_id, sprint_id, unit, version)
        VALUES ($1,$2,$3,$4,1)]], { id, h.id, sprint, unit }))
    for _, row in ipairs({ { person = "alice", amount = 8 }, { person = "bob", amount = 0 } }) do
        assert(db:execute([[INSERT INTO kickside_work_planning_capacity (attachment_id, sprint_id, person, amount)
            VALUES ($1,$2,$3,$4)]], { id, sprint, row.person, row.amount }))
    end
    assert(db:release())
    return id
end

local function count_capacity(id)
    local db = assert(store.open())
    local rows = assert(db:query("SELECT person FROM kickside_work_planning_capacity WHERE attachment_id = $1", { id }))
    assert(db:release())
    return #rows
end

local function task(h, sprint, person, estimate, visibility)
    return steps.create(h, "task", { title = "Task", current_sprint = sprint and { board = h.id, item = sprint },
        assignee = person and { kind = "user", id = person }, estimate = estimate, visibility_level = visibility })
end

local function define()
    test.describe("Planning capacity reads", function()
        test.it("groups authorized sprint points and keeps zero, unset and unassigned capacity distinct", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local sprint = steps.create(h, "sprint", { name = "Sprint" })
            capacity(h, sprint, "points")
            task(h, sprint, "alice", 3)
            task(h, sprint, "alice")
            task(h, sprint, "alice", 99, "private")
            task(h, nil, "alice", 199)
            task(h, sprint, "charlie", 2)
            task(h, sprint, nil, 5)
            local done = task(h, sprint, "alice", 4)
            test.eq(steps.one(h, { op = "transition", item = done, transition = "finish" }).status, "applied")
            local canceled = task(h, sprint, "alice", 999)
            test.eq(steps.one(h, { op = "transition", item = canceled, transition = "cancel" }).status, "applied")

            local request = { board_id = h.id, sprint_id = sprint }
            local result, err = report(member, "check_capacity", request)
            assert(result, steps.detail(err))
            test.eq(result.unit, "points")
            test.eq(result.version, 1)
            test.is_true(result.caller_visible)
            test.is_false(result.incomplete)
            test.eq(result.total.load, 14)
            test.eq(result.total.capacity, 8)
            test.eq(result.total.missing_estimates, 1)
            test.eq(result.unassigned.load, 5)
            test.eq(result.rows[1].person, "alice")
            test.eq(result.rows[1].load, 7)
            test.eq(result.rows[1].capacity, 8)
            test.eq(result.rows[2].person, "bob")
            test.eq(result.rows[2].capacity, 0)
            test.eq(result.rows[3].person, "charlie")
            test.is_nil(result.rows[3].capacity)

            local workload = assert(report(member, "workload", request))
            test.eq(workload.total.load, 10)
            test.eq(workload.rows[1].load, 3)
            local partial = assert(report(member, "check_capacity", {
                board_id = h.id, sprint_id = sprint, budget = { rows = 1 },
            }))
            test.is_true(partial.incomplete)
        end)

        test.it("requires the sprint on the active board and hides capacity in trash", function()
            local admin = scoped.admin()
            local h, other = board(admin), board(admin)
            local sprint = steps.create(h, "sprint", { name = "Sprint" })
            capacity(h, sprint, "minutes")
            local request = { board_id = h.id, sprint_id = sprint }
            local available = assert(report(admin, "check_capacity", request))
            test.eq(available.unit, "minutes")
            test.is_false(available.estimates_available)
            test.eq(available.total.capacity, 8)
            for _, caller in ipairs({ scoped.member(), scoped.outsider() }) do
                local denied, err = report(caller, "check_capacity", request)
                test.is_nil(denied)
                test.not_nil(err)
            end
            local wrong_board, wrong_err = report(admin, "check_capacity", { board_id = other.id, sprint_id = sprint })
            test.is_nil(wrong_board)
            test.not_nil(wrong_err)
            test.eq(steps.one(h, { op = "delete", item = sprint }).status, "applied")
            local deleted, deleted_err = report(admin, "check_capacity", request)
            test.is_nil(deleted)
            test.not_nil(deleted_err)
            test.eq(steps.one(h, { op = "restore", item = sprint }).status, "applied")
            test.eq(assert(report(admin, "check_capacity", request)).total.capacity, 8)
        end)

        test.it("stores capacity outside Work fields and refuses invalid capacity rows", function()
            local admin = scoped.admin()
            local h = board(admin)
            local sprint = steps.create(h, "sprint", { name = "Sprint" })
            local id = capacity(h, sprint, "points")
            local outcome = steps.one(h, { op = "set", item = sprint, values = { planning_capacity = {
                unit = "points", rows = { { person = "alice", amount = 15 } },
            } } })
            test.eq(outcome.status, "invalid")
            local db = assert(store.open())
            local insert = [[INSERT INTO kickside_work_planning_capacity (attachment_id, sprint_id, person, amount)
                VALUES ($1,$2,$3,$4)]]
            for _, row in ipairs({ { "alice", 3 }, { "charlie", -1 } }) do
                local _, err = db:execute(insert, { id, sprint, row[1], row[2] })
                test.not_nil(err)
            end
            assert(db:release())
            test.eq(count_capacity(id), 2)

            local caller = scoped.member()
            assert(h.call("grant", { subject_id = caller.id, mask = 1 }))
            steps.wait_for("Planning attachment registration", function() return admin.call("get_meta", {}, id) ~= nil end)
            local executor = funcs.new():with_actor(caller.actor):with_scope(caller.scope):with_context({ component_id = id })
            local deleted, err = executor:call("kickside.work.planning:delete", {})
            test.is_nil(deleted)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(count_capacity(id), 2)
        end)

        test.it("retires a purged sprint before Work removes its tombstone", function()
            local admin = scoped.admin()
            local h = board(admin)
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 0, tombstone_days = 30 } } }))
            local sprint = steps.create(h, "sprint", { name = "Sprint" })
            local id = capacity(h, sprint, "points")
            test.eq(steps.one(h, { op = "delete", item = sprint }).status, "applied")
            steps.retention_sweep(function()
                assert(h.call("settle", {}))
                return steps.count_rows("kickside_work_item", h.id, " AND life = 'purged'") == 1
            end)
            steps.wait_for("Planning retires purged sprint capacity", function() return count_capacity(id) == 0 end)
            test.eq(steps.count_rows("kickside_work_item", h.id, " AND life = 'purged'"), 1)
        end)

        test.it("drains the deactivated attachment and starts a reactivation with unset capacity", function()
            local admin = scoped.admin()
            local h = scoped.board(admin, {
                key_prefix = fixture.fresh_prefix(),
                fields = { { code = "title", form = "text" } },
                item_types = { { id = "sprint", process = "period", fields = { "title" } } },
                processes = { { id = "period", initial = "planned", states = { { id = "planned", category = "unstarted" } } } },
                plugins = { { use = PLUGIN } },
            })
            local other = board(admin)
            local other_id = capacity(other, steps.create(other, "sprint", { name = "Another sprint" }), "minutes")
            local sprint = steps.create(h, "sprint", { title = "Sprint" })
            local id = capacity(h, sprint, "points")
            steps.wait_for("Planning attachment registration", function()
                local result = admin.call("get_meta", {}, id)
                return result ~= nil
            end)
            assert(h.call("apply_schema", { declaration = { plugins = {} } }))
            steps.deleted(id, "deactivated Planning attachment deletion")
            test.eq(count_capacity(id), 0)
            test.eq(count_capacity(other_id), 2)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }))
            test.is_true(attachment(h) ~= id)
            local result = assert(report(admin, "check_capacity", { board_id = h.id, sprint_id = sprint }))
            test.is_nil(result.unit)
            test.is_nil(result.version)
            test.is_nil(result.total.capacity)
        end)

        test.it("maps indexed epic dates and the authorized progress sources", function()
            local admin = scoped.admin()
            local h = scoped.board(admin, {
                key_prefix = fixture.fresh_prefix(),
                fields = {
                    { code = "title", form = "text" },
                    { code = "due_date", form = "time", index = "key" },
                    { code = "progress", type = "rollup", form = "dec", of = "children", fn = "percent_done" },
                },
                item_types = { { id = "epic", process = "delivery", fields = { "title", "due_date", "progress" } } },
                processes = { { id = "delivery", initial = "open", states = { { id = "open", category = "started" } } } },
            })
            assert(h.call("pack_apply", { pack = PACK, expected_generation = 1, key = "planning",
                plugin_configs = { [PLUGIN] = { epic_types = { "epic" }, epic_due_field = "due_date" } } }))
            local fields = assert(report(admin, "roadmap", h.id))
            test.eq(fields.epic.start, "planning_start")
            test.eq(fields.epic.finish, "due_date")
            test.eq(fields.epic.progress_field, "progress")
            test.eq(fields.milestone.finish, "planning_end")
            test.eq(fields.milestone.membership, "milestone")
            test.is_nil(fields.issue)
        end)
    end)
end

return { run = test.run_cases(define) }
