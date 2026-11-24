-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local json = require("json")
local registry = require("registry")
local scoped = require("scoped")
local fixture = require("fixture")
local steps = require("steps")
local test = require("test")

local PLUGIN = "kickside.work.planning:plugin"
local API = "kickside.work.planning.api:"

local function board(admin)
    local h = scoped.board(admin, { key_prefix = fixture.fresh_prefix() }, "kickside.work.planning:pack")
    steps.wait_for("Planning attachment ready", function()
        return steps.call(h, "plugin_context", { plugin = PLUGIN }).lifecycle.state == "ready"
    end)
    return h
end

local function sprint(h, name, first, last)
    return steps.create(h, "sprint", { name = name, planning_start = first, planning_end = last })
end

local function post(actor, path, request)
    return actor.http("POST", "/api/work/planning/" .. path, request)
end

local function capacity(h, sprint_id, person, expected_version, amount, unit)
    return { board_id = h.id, sprint_id = sprint_id, expected_version = expected_version,
        unit = unit or "points", rows = { { person = person, amount = amount } } }
end

local function complete(future)
    future:response():receive()
    local payload, err = future:result()
    if err or not payload then return nil, err end
    return payload:data()
end

local function get(h, id)
    return assert(steps.get(h, id)).item
end

local function capability(actor, method, request)
    local exec = funcs.new():with_actor(actor.actor):with_scope(actor.scope)
    local reply, err = exec:call("app:planning_capability", { method = method, request = request })
    assert(reply, steps.detail(err))
    return reply
end

local function call_capability(input)
    local definition = assert(contract.get("kickside.work.planning:sprint_reference"))
    local client = assert(definition:open("kickside.work.planning:sprint_reference_binding"))
    return client[input.method](client, input.request)
end

local function define()
    test.describe("Planning commands", function()
        test.it("uses one atomic Work Apply, replays its key, and releases a member to backlog", function()
            local admin = scoped.admin()
            local h = board(admin)
            local target = sprint(h, "Next")
            local first = steps.create(h, "issue", { title = "First" })
            local second = steps.create(h, "issue", { title = "Second" })
            local request = { board_id = h.id, sprint_id = target, key = "plan",
                changes = {
                    { item = first, expected_version = 1, sprint_id = target },
                    { item = second, expected_version = 2, sprint_id = target },
                } }
            local stale = post(admin, "plan_sprint", request)
            test.eq(stale.status, 200, stale.raw)
            test.eq(stale.body.data.applied, false)
            test.eq(stale.body.data.outcomes[1].rolled_back, true)
            test.eq(stale.body.data.outcomes[2].status, "conflict")
            test.is_nil(get(h, first).values.current_sprint)

            request.changes[2].expected_version = 1
            local applied = post(admin, "plan_sprint", request)
            test.eq(applied.status, 200, applied.raw)
            test.is_true(applied.body.data.applied)
            test.eq(get(h, first).values.current_sprint.item, target)
            test.eq(get(h, second).values.current_sprint.item, target)
            local replay = post(admin, "plan_sprint", request)
            test.eq(replay.status, 200, replay.raw)
            test.is_true(replay.body.data.replayed)
            test.eq(replay.body.data.seq, applied.body.data.seq)

            local body = json.encode({ board_id = h.id, sprint_id = target, key = "backlog" })
            local cleared = admin.http_raw("POST", "/api/work/planning/plan_sprint",
                body:sub(1, -2) .. ',"changes":[{"item":"' .. first .. '","expected_version":2,"sprint_id":null}]}')
            test.eq(cleared.status, 200, cleared.raw)
            test.is_true(cleared.body.data.applied)
            test.is_nil(get(h, first).values.current_sprint)
        end)

        test.it("requires a live local sprint and rejects capacity input on a plan", function()
            local admin = scoped.admin()
            local h = board(admin)
            local peer = board(admin)
            local target = sprint(peer, "Foreign")
            local item = steps.create(h, "issue", { title = "Issue" })
            local request = { board_id = h.id, sprint_id = target, key = "plan",
                changes = { { item = item, expected_version = 1, sprint_id = target } }, capacity = { unit = "points" } }
            local invalid = post(admin, "plan_sprint", request)
            test.eq(invalid.status, 400, invalid.raw)
            request.capacity = nil
            local missing = post(admin, "plan_sprint", request)
            test.eq(missing.status, 404, missing.raw)
            test.is_nil(get(h, item).values.current_sprint)
            test.eq(get(h, item).version, 1)
        end)

        test.it("checks date order before a versioned date edit and returns the Work receipt", function()
            local admin = scoped.admin()
            local h = board(admin)
            local target = sprint(h, "Dates", "2026-01-01", "2026-01-15")
            local request = { board_id = h.id, item = target, key = "dates", expected_version = 1,
                start = "2026-02-15", finish = "2026-02-01" }
            local invalid = post(admin, "move_dates", request)
            test.eq(invalid.status, 400, invalid.raw)
            test.eq(invalid.body.details.code, "planning_dates_out_of_order")
            request.finish = "2026-02-20"
            local applied = post(admin, "move_dates", request)
            test.eq(applied.status, 200, applied.raw)
            test.is_true(applied.body.data.applied)
            test.eq(get(h, target).values.planning_start, request.start)
            test.eq(get(h, target).values.planning_end, request.finish)
            local replay = post(admin, "move_dates", request)
            test.eq(replay.status, 200, replay.raw)
            test.is_true(replay.body.data.replayed)
            request.key = "stale"
            local stale = post(admin, "move_dates", request)
            test.eq(stale.status, 200, stale.raw)
            test.eq(stale.body.data.outcomes[1].status, "conflict")
        end)

        test.it("sets capacity independently with versions and enforces WRITE and distinct people", function()
            local admin = scoped.admin()
            local reader = scoped.member()
            local h = board(admin)
            local target = sprint(h, "Capacity")
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local request = capacity(h, target, reader.id, 0, 2.5)
            local denied = post(reader, "set_capacity", request)
            test.eq(denied.status, 403, denied.raw)
            request.rows[2] = { person = reader.id, amount = 7 }
            local duplicate = post(admin, "set_capacity", request)
            test.eq(duplicate.status, 400, duplicate.raw)
            request.rows[2] = nil
            local accepted = post(admin, "set_capacity", request)
            test.eq(accepted.status, 200, accepted.raw)
            test.eq(accepted.body.data.version, 1)
            local stale = post(admin, "set_capacity", capacity(h, target, reader.id, 0, 60, "minutes"))
            test.eq(stale.status, 409, stale.raw)
            local state = post(reader, "check_capacity", { board_id = h.id, sprint_id = target })
            test.eq(state.status, 200, state.raw)
            test.eq(state.body.data.version, 1)
            test.eq(state.body.data.unit, "points")
            test.eq(state.body.data.rows[1].capacity, 2.5)
            local updated = post(admin, "set_capacity", capacity(h, target, reader.id, 1, 60, "minutes"))
            test.eq(updated.status, 200, updated.raw)
            test.eq(updated.body.data.version, 2)
            test.eq(get(h, target).version, 1)
        end)

        test.it("preserves the captured sprint on date correction and reports current visible membership", function()
            local admin = scoped.admin()
            local h = board(admin)
            local original = sprint(h, "Original", "2026-01-01", "2026-01-15")
            local next_sprint = sprint(h, "Next", "2026-01-10", "2026-01-31")
            local issue = steps.create(h, "issue", { title = "Issue", current_sprint = { board = h.id, item = original } })
            local request = { board_id = h.id, item = issue, work_date = "2026-01-01" }
            test.eq(capability(admin, "resolve", request).sprint_id, original)
            test.eq(steps.one(h, { op = "transition", item = original, transition = "start" }).status, "applied")
            local preview = admin.http("POST", "/api/work/sprints/plan_close",
                { board_id = h.id, sprint_id = original, rollover_id = next_sprint })
            test.eq(preview.status, 200, preview.raw)
            local close = admin.http("POST", "/api/work/sprints/close",
                { snapshot = preview.body.data.snapshot, token = preview.body.data.token, key = "close" })
            test.eq(close.status, 200, close.raw)
            test.is_true(close.body.data.applied)
            request.sprint_id, request.work_date = original, "2026-01-15"
            test.eq(capability(admin, "resolve", request).sprint_id, original)
            request.work_date = "2026-01-31"
            test.eq(capability(admin, "resolve", request).sprint_id, next_sprint)
            request.work_date = "2026-02-01"
            local unallocated = capability(admin, "resolve", request)
            test.is_nil(unallocated.sprint_id)
            test.eq(json.encode(unallocated), "{}")
            request = { board_id = h.id, sprint_id = next_sprint, limit = 20 }
            local report = capability(admin, "report", request)
            test.eq(report.coverage, "complete")
            test.eq(report.items[1], issue)
            test.eq(#report.items, 1)
            test.is_true(type(report.as_of) == "number")
        end)

        test.it("applies a mapped epic due date and guards versioned writes with Work field access", function()
            local admin, writer = scoped.admin(), scoped.member()
            local h = board(admin)
            local schema = steps.call(h, "get_schema", {})
            assert(h.call("apply_schema", {
                expected_generation = schema.generation,
                declaration = {
                    fields = {
                        { code = "due_date", form = "time", index = "key",
                            access = { write = { { user = admin.id } } } },
                    },
                    item_types = {
                        { id = "epic", process = "planning_issue", fields = { "title", "due_date" } },
                    },
                },
                plugin_configs = { [PLUGIN] = { epic_types = { "epic" }, epic_due_field = "due_date" } },
            }))
            assert(h.call("grant", { subject_id = writer.id, mask = 3 }))
            local epic = steps.create(h, "epic", { title = "Epic", due_date = "2026-03-01" })
            local request = { board_id = h.id, item = epic, key = "epic", expected_version = 1,
                start = "2026-02-02", finish = "2026-03-02" }
            local refused = post(writer, "move_dates", request)
            test.eq(refused.status, 200, refused.raw)
            test.eq(refused.body.data.outcomes[1].status, "denied")
            test.is_nil(get(h, epic).values.planning_start)
            local moved = post(admin, "move_dates", request)
            test.eq(moved.status, 200, moved.raw)
            test.is_true(moved.body.data.applied)
            local dates = get(h, epic).values
            test.eq(dates.planning_start, request.start)
            test.eq(dates.due_date, request.finish)
            test.is_nil(dates.planning_end)
        end)

        test.it("allows only one concurrent capacity replacement for the same version", function()
            local admin = scoped.admin()
            local h = board(admin)
            local target = sprint(h, "Capacity")
            local exec = funcs.new():with_actor(admin.actor):with_scope(admin.scope)
            local a = assert(exec:async(API .. "set_capacity", capacity(h, target, "alice", 0, 12)))
            local b = assert(exec:async(API .. "set_capacity", capacity(h, target, "bob", 0, 20)))
            local result_a, err_a = complete(a)
            local result_b, err_b = complete(b)
            test.is_true((result_a ~= nil) ~= (result_b ~= nil), steps.detail(err_a) .. " / " .. steps.detail(err_b))
            local conflict = assert(err_a or err_b)
            test.eq(conflict:kind(), errors.CONFLICT, steps.detail(conflict))
            test.eq(conflict:details().code, "planning_capacity_version_conflict")
            local read = post(admin, "check_capacity", { board_id = h.id, sprint_id = target })
            test.eq(read.status, 200, read.raw)
            test.eq(read.body.data.version, 1)
            test.eq(#read.body.data.rows, 1)
            test.eq(read.body.data.rows[1].person, result_a and "alice" or "bob")
            test.eq(read.body.data.total.capacity, result_a and 12 or 20)
        end)

        test.it("bounds sprint reports using current membership and the caller's item visibility", function()
            local admin, reader = scoped.admin(), scoped.member()
            local h = board(admin)
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local schema = steps.call(h, "get_schema", {})
            assert(h.call("apply_schema", {
                expected_generation = schema.generation,
                declaration = { fields = {
                    { code = "visibility_level", form = "text", index = "key" },
                    { code = "story_points", form = "int", index = "number" },
                }, item_types = {
                    { id = "issue", process = "planning_issue",
                        fields = { "title", "current_sprint", "milestone", "visibility_level", "story_points" } },
                }, visibility = { field = "visibility_level", bypass = "admin", levels = { { id = "private", holders = {} } } } },
            }))
            local target = sprint(h, "Report", "2026-01-01", "2026-01-31")
            local assignment = { board = h.id, item = target }
            local visible = steps.create(h, "issue", { title = "Visible", current_sprint = assignment, story_points = 2 })
            steps.create(h, "issue", { title = "Private", current_sprint = assignment, story_points = 99, visibility_level = "private" })
            local written = post(admin, "set_capacity", capacity(h, target, "alice", 0, 6))
            test.eq(written.status, 200, written.raw)
            local input = { board_id = h.id, sprint_id = target, limit = 1 }
            local report = capability(reader, "report", input)
            test.eq(report.coverage, "complete")
            test.eq(#report.items, 1)
            test.eq(report.items[1], visible)
            test.eq(report.unit, "points")
            test.eq(report.points_field, "story_points")
            test.eq(capability(admin, "report", input).coverage, "limited")
        end)

        test.it("registers the Planning tools with their declared access scopes", function()
            local expected = {
                [API .. "plan_sprint"] = { "WorkPlanSprint", "state.write" },
                [API .. "move_dates"] = { "WorkMovePlanningDates", "state.write" },
                [API .. "check_capacity"] = { "WorkCheckSprintCapacity", "state.read" },
                [API .. "set_capacity"] = { "WorkSetSprintCapacity", "state.write" },
            }
            local manifest = assert(registry.get(PLUGIN))
            for _, id in ipairs(manifest.meta.tools) do
                local spec = expected[id]
                if spec then
                    local entry = assert(registry.get(id))
                    test.eq(entry.meta.llm_alias, spec[1])
                    test.eq(entry.meta.mcp.required_scopes[1], spec[2])
                    expected[id] = nil
                end
            end
            assert(next(expected) == nil, "Planning command tool is missing from the manifest")
        end)
    end)
end

return { run = test.run_cases(define), call_capability = call_capability }
