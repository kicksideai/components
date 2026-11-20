-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local scoped = require("scoped")
local fixture = require("fixture")
local operations = require("operations")
local steps = require("steps")

local PACK = "kickside.work.planning:pack"
local PLUGIN = "kickside.work.planning:plugin"
local SPRINTS = "kickside.work.planning:sprints"

local function create_board(admin: scoped.Session): fixture.Handle
    local created, err = admin.call("create", { idempotency_key = uuid.v4(), pack = PACK })
    assert(created, steps.detail(err))
    local id = created.board_id :: string
    return { id = id, prefix = assert(admin.call("get_schema", {}, id)).key_prefix :: string, actor = admin.actor, executor = admin,
        call = function(method: string, request: unknown): (unknown, error?) return admin.call(method, request, id) end }
end

local function custom_board(admin, extra_fields)
    return scoped.board(admin, {
        key_prefix = fixture.fresh_prefix(),
        fields = extra_fields or { { code = "title", form = "text" } },
        item_types = { { id = "bug", process = "triage", fields = { "title" } } },
        processes = { { id = "triage", initial = "inbox", states = { { id = "inbox", category = "triage" } } } },
    })
end

local function install_request(board)
    return { board_id = board.id, pack = PACK, expected_generation = 1, key = "planning",
        plugin_configs = { [PLUGIN] = { issue_types = { "bug" } } } }
end

local function find(entries, name, key)
    for _, entry in ipairs(entries) do if entry[key] == name then return entry end end
end

local function planning(caller, method, input)
    return caller.call("contract_request", { contract = SPRINTS, method = method, value = input })
end

local function sprint(board, type_id, active)
    local id = steps.create(board, type_id or "sprint", {
        name = "Period", planning_start = "2026-11-01", planning_end = "2026-11-14",
    })
    if active then test.eq(steps.one(board, { op = "transition", item = id, transition = "start" }).status, "applied") end
    return id
end

local function issue(board, sprint_id)
    return steps.create(board, "issue", { current_sprint = { board = board.id, item = sprint_id } })
end

local function define()
    test.describe("Work Planning HTTP", function()
        local preview_path = "/api/work/sprints/plan_close"
        local close_path = "/api/work/sprints/close"

        test.it("previews and commits rollover as a board writer", function()
            local owner, member = scoped.admin(), scoped.member()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local target = sprint(board, "sprint", false)
            local unfinished = issue(board, source)
            local request = { board_id = board.id, sprint_id = source, rollover_id = target }

            assert(board.call("grant", { subject_id = member.id, mask = 1 }))
            local denied = member.http("POST", preview_path, request)
            test.eq(denied.status, 403, denied.raw)
            test.eq(denied.body.details.code, "planning_write_required")
            assert(board.call("grant", { subject_id = member.id, mask = 3 }))
            local planned = member.http("POST", preview_path, request)
            test.eq(planned.status, 200, planned.raw)
            test.is_true(planned.body.success)
            local preview = planned.body.data
            test.eq(preview.snapshot.rollover_id, target)
            test.eq(#preview.snapshot.members, 1)
            test.eq(preview.snapshot.members[1].item_id, unfinished)
            test.eq(assert(steps.get(board, source)).item.state, "active")

            local commit = { key = "http-close", snapshot = preview.snapshot, token = preview.token }
            assert(board.call("grant", { subject_id = member.id, mask = 1 }))
            local denied_commit = member.http("POST", close_path, commit)
            test.eq(denied_commit.status, 403, denied_commit.raw)
            assert(board.call("grant", { subject_id = member.id, mask = 3 }))
            local closed = member.http("POST", close_path, commit)
            test.eq(closed.status, 200, closed.raw)
            test.is_true(closed.body.success)
            test.is_true(closed.body.data.applied)
            test.eq(assert(steps.get(board, source)).item.state, "closed")
            test.eq(assert(steps.get(board, unfinished)).item.values.current_sprint.item, target)
        end)

        test.it("returns typed failures for an ineligible destination and a stale preview", function()
            local owner = scoped.admin()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local request = { board_id = board.id, sprint_id = source, rollover_id = source }
            local invalid = owner.http("POST", preview_path, request)
            test.eq(invalid.status, 400, invalid.raw)
            test.eq(invalid.body.kind, errors.INVALID)
            test.eq(invalid.body.details.code, "planning_rollover_ineligible")

            request.rollover_id = nil
            local planned = owner.http("POST", preview_path, request)
            test.eq(planned.status, 200, planned.raw)
            local preview = planned.body.data
            issue(board, source)
            local stale = owner.http("POST", close_path, { key = "http-stale", snapshot = preview.snapshot, token = preview.token })
            test.eq(stale.status, 409, stale.raw)
            test.eq(stale.body.kind, errors.CONFLICT)
            test.eq(stale.body.details.code, "planning_snapshot_stale")
            test.eq(assert(steps.get(board, source)).item.state, "active")
        end)
    end)

    test.describe("planning pack", function()
        test.it("discovers and installs sprint, milestone, and tracked issue references", function()
            local admin = scoped.admin()
            local packs = assert(admin.call("list_packs", {})).packs
            test.is_nil(assert(find(packs, PACK, "id"), "planning pack is discoverable").problem)
            local board = create_board(admin)
            local schema = assert(board.call("get_schema", {}))
            test.eq(schema.pack.id, PACK)
            local sprint = steps.create(board, "sprint", { name = "Sprint 1", planning_start = "2026-11-01", planning_end = "2026-11-14" })
            local milestone = steps.create(board, "milestone", { name = "Release", planning_start = "2026-11-01", planning_end = "2026-12-01", planning_goal = "Ship" })
            test.eq(assert(steps.get(board, sprint)).item.state, "planned")
            test.eq(assert(steps.get(board, milestone)).item.values.planning_goal, "Ship")
            local issue = steps.create(board, "issue", { title = "Instrument jobs", current_sprint = { board = board.id, item = sprint },
                milestone = { board = board.id, item = milestone } })
            test.eq(assert(steps.get(board, issue)).item.values.milestone.item, milestone)
            for _, code in ipairs({ "current_sprint", "milestone" }) do
                local field = assert(find(schema.compiled.fields, code, "code"))
                test.eq(field.type, "item")
                test.eq(field.cardinality, "one")
                test.eq(field.index, "key")
                test.is_true(field.track)
            end
        end)

        test.it("validates start and end dates on the Work transition", function()
            local board = create_board(scoped.admin())
            for _, type_id in ipairs({ "sprint", "milestone" }) do
                local item = steps.create(board, type_id, { name = "Bad dates", planning_start = "2026-11-14", planning_end = "2026-11-01" })
                local refused = steps.one(board, { op = "transition", item = item, transition = "start" })
                test.eq(refused.findings[1].code, "planning_dates_out_of_order")
                local changed = steps.one(board, { op = "transition", item = item, transition = "start", values = { planning_end = "2026-11-14" } })
                test.eq(changed.status, "applied")
                test.eq(assert(steps.get(board, item)).item.state, "active")
                local ordered = steps.create(board, type_id, { name = "Good dates", planning_start = "2026-11-01", planning_end = "2026-11-14" })
                local reversed = steps.one(board, { op = "transition", item = ordered, transition = "start", values = { planning_end = "2026-10-31" } })
                test.eq(reversed.findings[1].code, "planning_dates_out_of_order")
            end
        end)

        test.it("only accepts the matching period type for each planning reference", function()
            local board = create_board(scoped.admin())
            local sprint_id, milestone_id = sprint(board), sprint(board, "milestone")
            local item = issue(board, sprint_id)
            local cases = { current_sprint = milestone_id, milestone = sprint_id }
            for field, target in pairs(cases) do
                local refused = steps.one(board, { op = "set", item = item, values = { [field] = { board = board.id, item = target } } })
                test.eq(refused.status, "invalid")
                test.eq(refused.findings[1].code, "invalid_reference")
                test.eq(refused.findings[1].field, field)
            end
        end)

        test.it("plans field adoption on populated custom types and requires board administration", function()
            local admin = scoped.admin()
            local board = custom_board(admin)
            local bug = steps.create(board, "bug", { title = "Keep me" })
            local request = install_request(board)
            local writer = scoped.member()
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))
            local denied, denial = writer.call("pack_plan", request)
            test.is_nil(denied)
            test.not_nil(denial)
            local plan, err = admin.call("pack_plan", request)
            assert(plan, steps.detail(err))
            test.eq(#plan.conflicts, 0)
            test.eq(plan.generation, 2)
            test.eq(assert(admin.call("pack_apply", request)).status, "done")
            local schema = assert(board.call("get_schema", {}))
            local fields = assert(find(schema.compiled.item_types, "bug", "id")).fields
            test.eq(table.concat(fields, ","), "title,current_sprint,milestone")
            test.eq(assert(steps.get(board, bug)).item.values.title, "Keep me")
        end)

        test.it("reports schema collisions for the administrator to resolve", function()
            local admin = scoped.admin()
            local board = custom_board(admin, { { code = "title", form = "text" }, { code = "current_sprint", form = "text" } })
            local request = install_request(board)
            local plan, err = admin.call("pack_plan", request)
            assert(plan, steps.detail(err))
            test.not_nil(find(plan.conflicts, "fields.current_sprint", "path"))
            local result, conflict = admin.call("pack_apply", request)
            test.is_nil(result)
            test.eq(conflict:details().code, "pack_conflicts")
        end)
    end)
    test.describe("close sprint preview", function()
        test.it("previews only unfinished live members at one head and binds the rollover", function()
            local owner = scoped.admin()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local next_sprint = sprint(board, "sprint", false)
            local open = issue(board, source)
            local done = issue(board, source)
            local canceled = issue(board, source)
            local trashed = issue(board, source)
            issue(board, next_sprint)
            test.eq(steps.one(board, { op = "transition", item = done, transition = "complete" }).status, "applied")
            test.eq(steps.one(board, { op = "transition", item = canceled, transition = "cancel" }).status, "applied")
            test.eq(steps.one(board, { op = "delete", item = trashed }).status, "applied")
            local ready, err = planning(owner, "plan_close", { board_id = board.id, sprint_id = source, rollover_id = next_sprint })
            assert(ready, steps.detail(err))
            local live = assert(steps.get(board, source))
            test.eq(ready.snapshot.head, live.as_of)
            test.eq(ready.snapshot.generation, live.generation)
            test.eq(ready.snapshot.sprint_version, live.item.version)
            test.eq(ready.snapshot.rollover_id, next_sprint)
            test.eq(#ready.snapshot.members, 1)
            test.eq(ready.snapshot.members[1].item_id, open)
            test.eq(ready.snapshot.members[1].version, steps.version(board, open))
            test.not_nil(ready.token)
            test.eq(live.item.state, "active")
        end)

        test.it("rejects inactive plugins, read-only callers and ineligible destinations", function()
            local owner, reader = scoped.admin(), scoped.member()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local target = sprint(board, "sprint", true)
            test.eq(steps.one(board, { op = "transition", item = target, transition = "close" }).status, "applied")
            local milestone = sprint(board, "milestone", false)
            local unplanned = custom_board(owner)
            local other = sprint(create_board(owner), "sprint", false)
            assert(board.call("grant", { subject_id = reader.id, mask = 1 }))
            local result, err = planning(reader, "plan_close", { board_id = board.id, sprint_id = source })
            test.is_nil(result)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            for _, rollover in ipairs({ source, target, other, milestone }) do
                local result, err = planning(owner, "plan_close", { board_id = board.id, sprint_id = source, rollover_id = rollover })
                test.is_nil(result)
                test.eq(err:details().code, "planning_rollover_ineligible")
            end
            local result, err = planning(owner, "plan_close", { board_id = unplanned.id, sprint_id = source })
            test.is_nil(result)
            test.eq(err:details().code, "plugin_inactive")
        end)

        test.it("refuses a hidden completed member without returning a selection", function()
            local owner, writer = scoped.admin(), scoped.member()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            issue(board, source)
            local hidden = issue(board, source)
            assert(board.call("apply_schema", { declaration = {
                fields = { { code = "level", form = "text", index = "key" } },
                item_types = { { id = "issue", process = "planning_issue", fields = { "title", "current_sprint", "milestone", "level" } } },
                visibility = { field = "level", bypass = "admin", levels = { { id = "private", holders = { { user = owner.id } } } } },
            } }))
            steps.rebuilt(board.id, "reindex")
            test.eq(steps.one(board, { op = "set", item = hidden, values = { level = "private" } }).status, "applied")
            test.eq(steps.one(board, { op = "transition", item = hidden, transition = "complete" }).status, "applied")
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))
            local result, err = planning(writer, "plan_close", { board_id = board.id, sprint_id = source })
            test.is_nil(result)
            test.eq(err:details().code, "selection_restricted")
            local ready, owner_err = planning(owner, "plan_close", { board_id = board.id, sprint_id = source })
            assert(ready, steps.detail(owner_err))
            test.eq(#ready.snapshot.members, 1)
        end)

        test.it("requires write access to the sprint reference on every affected item", function()
            local owner, writer = scoped.admin(), scoped.member()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            issue(board, source)
            assert(board.call("apply_schema", { declaration = { fields = {
                { code = "current_sprint", type = "item", config = { item_type = "sprint" }, index = "key", track = true,
                    access = { write = { { user = owner.id } } } },
            } } }))
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))
            local result, err = planning(writer, "plan_close", { board_id = board.id, sprint_id = source })
            test.is_nil(result)
            test.eq(err:details().code, "selection_restricted")
        end)

        test.it("refuses 200 unfinished members and closes at 199 after a Work bulk edit", function()
            local owner = scoped.admin()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local ops = {}
            for _ = 1, 200 do
                ops[#ops + 1] = { op = "create", type = "issue", values = { current_sprint = { board = board.id, item = source } } }
            end
            local created = assert(steps.apply(board, ops))
            test.is_true(created.applied)
            local result, err = planning(owner, "plan_close", { board_id = board.id, sprint_id = source })
            test.is_nil(result)
            test.eq(err:details().code, "planning_rollover_limit")
            operations.gate(board, true)
            local reduced = assert(board.call("bulk", { key = "reduce-sprint", query = {
                where = { field = "key", op = "eq", value = created.outcomes[1].key },
            }, ops_template = { { op = "set", clear = { "current_sprint" } } } }))
            test.eq(operations.finished(board, reduced.bulk_id).applied, 1)
            local ready = assert(planning(owner, "plan_close", { board_id = board.id, sprint_id = source }))
            test.eq(#ready.snapshot.members, 199)
            local closed = assert(planning(owner, "close", { key = "limit", snapshot = ready.snapshot, token = ready.token }))
            test.is_true(closed.applied)
            test.eq(#closed.outcomes, 200)
            test.eq(assert(steps.get(board, source)).item.state, "closed")
        end)
    end)

    test.describe("close sprint commit", function()
        test.it("exposes sprint operations alongside the Work agent's pack administration tools", function()
            local board = fixture.board({ bare = true })
            test.eq(assert(board.call("pack_apply", { pack = PACK, expected_generation = 0, key = "planning-trait" })).status, "done")
            local agent, err = board.executor:call("app:compile_work_agent", { board_id = board.id })
            assert(agent, steps.detail(err))
            local tools = {}
            for _, tool in pairs(agent.tools) do tools[tool.registry_id] = true end
            test.is_true(tools["kickside.work.planning:plan_close"])
            test.is_true(tools["kickside.work.planning:close"])
            test.is_true(tools["kickside.work.traits:pack_plan"])
            test.is_true(tools["kickside.work.traits:pack_apply"])
            local source = sprint(board, "sprint", true)
            local preview, preview_err = board.executor:call("app:call_work_agent_tools", { board_id = board.id, calls = {
                { name = "WorkPlanCloseSprint", arguments = { board_id = board.id, sprint_id = source } },
            } })
            assert(preview, steps.detail(preview_err))
            local ready = assert(preview.WorkPlanCloseSprint.result)
            local close, close_err = board.executor:call("app:call_work_agent_tools", { board_id = board.id, calls = {
                { name = "WorkCloseSprint", arguments = { key = "agent-close", snapshot = ready.snapshot, token = ready.token } },
            } })
            assert(close, steps.detail(close_err))
            test.is_true(close.WorkCloseSprint.result.applied)
        end)

        test.it("rolls unfinished issues forward atomically and replays the same close", function()
            local owner, writer = scoped.admin(), scoped.member()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local target = sprint(board, "sprint", false)
            local open = issue(board, source)
            local done = issue(board, source)
            local canceled = issue(board, source)
            assert(steps.one(board, { op = "transition", item = done, transition = "complete" }).status == "applied")
            assert(steps.one(board, { op = "transition", item = canceled, transition = "cancel" }).status == "applied")
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))
            local preview = assert(planning(writer, "plan_close", { board_id = board.id, sprint_id = source, rollover_id = target }))
            local request = { key = "rollover", snapshot = preview.snapshot, token = preview.token }
            local committed, err = planning(writer, "close", request)
            assert(committed, steps.detail(err))
            test.is_true(committed.applied)
            test.eq(#committed.outcomes, 2)
            test.eq(assert(steps.get(board, source)).item.state, "closed")
            test.eq(assert(steps.get(board, open)).item.values.current_sprint.item, target)
            for _, retained in ipairs({ done, canceled }) do
                test.eq(assert(steps.get(board, retained)).item.values.current_sprint.item, source)
            end
            local history = assert(board.call("list_history", { item = { id = open } })).entries
            local changed = assert(find(history, "current_sprint", "field"))
            test.eq(changed.before.item, source)
            test.eq(changed.after.item, target)
            test.eq(changed.source, "planning")
            local replay, replay_err = planning(writer, "close", request)
            assert(replay, steps.detail(replay_err))
            test.is_true(replay.replayed)
            test.eq(replay.seq, committed.seq)
        end)

        test.it("clears membership for backlog and can close an empty sprint", function()
            local owner = scoped.admin()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local open = issue(board, source)
            local preview = assert(planning(owner, "plan_close", { board_id = board.id, sprint_id = source }))
            local result, err = planning(owner, "close", { key = "backlog", snapshot = preview.snapshot, token = preview.token })
            assert(result and result.applied, steps.detail(err))
            local cleared = assert(steps.get(board, open)).item
            test.is_nil(cleared.values.current_sprint)
            test.eq(cleared.value_states.current_sprint, "cleared")
            local empty = sprint(board, "sprint", true)
            local ready = assert(planning(owner, "plan_close", { board_id = board.id, sprint_id = empty }))
            test.eq(#ready.snapshot.members, 0)
            local closed = assert(planning(owner, "close", { key = "empty", snapshot = ready.snapshot, token = ready.token }))
            test.eq(#closed.outcomes, 1)
            test.eq(assert(steps.get(board, empty)).item.state, "closed")
        end)

        test.it("rejects stale previews after membership, lifecycle, destination or schema changes", function()
            local owner = scoped.admin()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local target = sprint(board, "sprint", true)
            local open = issue(board, source)
            local function stale(key, change)
                local ready = assert(planning(owner, "plan_close", { board_id = board.id, sprint_id = source, rollover_id = target }))
                change()
                local result, err = planning(owner, "close", { key = key, snapshot = ready.snapshot, token = ready.token })
                test.is_nil(result)
                test.eq(err:details().code, "planning_snapshot_stale")
                test.eq(assert(steps.get(board, source)).item.state, "active")
            end
            stale("new-member", function() issue(board, source) end)
            stale("late-completion", function()
                assert(steps.one(board, { op = "transition", item = open, transition = "complete" }).status == "applied")
            end)
            stale("changed-schema", function()
                assert(board.call("apply_schema", { declaration = { fields = { { code = "estimate", form = "int" } } } }))
            end)
            stale("closed-destination", function()
                assert(steps.one(board, { op = "transition", item = target, transition = "close" }).status == "applied")
            end)
            test.eq(assert(steps.get(board, open)).item.values.current_sprint.item, source)
        end)

        test.it("authenticates the proposed rollover and binds the snapshot to its caller", function()
            local owner, writer = scoped.admin(), scoped.member()
            local board = create_board(owner)
            local source = sprint(board, "sprint", true)
            local target = sprint(board, "sprint", false)
            issue(board, source)
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))
            local ready = assert(planning(owner, "plan_close", { board_id = board.id, sprint_id = source, rollover_id = target }))
            local request = { key = "invalid", snapshot = ready.snapshot, token = ready.token }
            local result, err = planning(writer, "close", request)
            test.is_nil(result)
            test.eq(err:details().code, "planning_snapshot_invalid")
            request.snapshot.rollover_id = nil
            local result, err = planning(owner, "close", request)
            test.is_nil(result)
            test.eq(err:details().code, "planning_snapshot_invalid")
            test.eq(assert(steps.get(board, source)).item.state, "active")
        end)
    end)

end

return { run = test.run_cases(define) }
