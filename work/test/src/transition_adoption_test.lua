-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local probe = require("probe")

local SELECTOR = "app:legacy_adoption_selector"
local PACK = "app:legacy_adoption_pack"

local function board(): fixture.Handle
    local root = fixture.board({ bare = true })
    local result, err = root.call("create", { idempotency_key = "adoption-seed", title = "Legacy adoption", pack = PACK })
    assert(result, steps.detail(err))
    local id = result.board_id :: string
    return {
        actor = root.actor, id = id, prefix = root.prefix, executor = root.executor,
        call = function(op: string, request: unknown): (unknown, error?)
            return root.executor:call("app:work_call", { op = op, board_id = id, request = request })
        end,
    }
end

local function period(h: fixture.Handle, field_type: string?): string
    local id = steps.create(h, field_type or "sprint", { name = "Period", planning_start = "2026-11-01", planning_end = "2026-11-14" })
    test.eq(steps.one(h, { op = "transition", item = id, transition = "start" }).status, "applied")
    return id
end

local function plan(h: fixture.Handle)
    local result, err = h.call("plan_transition_adoption", { board_id = h.id, selector = SELECTOR })
    return assert(result, steps.detail(err))
end

local function request(plan, key: string)
    return { review = plan.review, token = plan.token, key = key }
end

local function close(h: fixture.Handle, item: string, force: boolean?)
    return steps.one(h, { op = "transition", item = item, transition = "close", force = force })
end

local function process(schema)
    for _, p in ipairs(schema.declaration.processes) do if p.id == "planning_period" then return p end end
    error("legacy process missing")
end

local function define()
    test.describe("transition adoption", function()
        test.it("rejects a reviewed plan when the legacy close commits first", function()
            local h = board()
            local item = period(h)
            local reviewed = plan(h)
            test.eq(reviewed.status, "eligible", tostring(reviewed.conflict and reviewed.conflict.path))
            test.eq(close(h, item).status, "applied")
            local result, err = h.call("apply_transition_adoption", request(reviewed, "stale"))
            test.is_nil(result)
            test.eq(err:details().code, "transition_adoption_stale")
            test.eq(assert(h.call("get_schema", {})).generation, reviewed.review.generation)
        end)

        test.it("reprepares a direct close after adoption wins the append race", function()
            local h = board()
            local item, trashed, milestone = period(h), period(h), period(h, "milestone")
            local held = assert(steps.get(h, trashed)).item.process_generation
            test.eq(steps.one(h, { op = "delete", item = trashed }).status, "applied")
            local reviewed = plan(h)
            test.eq(reviewed.status, "eligible", tostring(reviewed.conflict and reviewed.conflict.path))
            test.eq(#reviewed.cohorts, 2)
            test.eq(reviewed.cohorts[2].life, "trashed")
            test.eq(reviewed.cohorts[2].generation, held)
            local apply = request(reviewed, "wins")
            probe.arm(h.id, { method = "apply_transition_adoption", request = apply })
            local output, err = steps.apply(h, { { op = "transition", item = item, transition = "close" } }, { mode = "independent" })
            assert(output, steps.detail(err))
            test.eq(output.outcomes[1].status, "denied")
            test.eq(output.outcomes[1].findings[1].code, "transition_command_required")
            test.eq(#probe.calls(h.id), 1)
            test.eq(assert(steps.get(h, item)).item.state, "active")
            test.eq(#assert(steps.get(h, item, { "transitions" })).transitions, 0)
            test.eq(close(h, item, true).status, "denied")
            test.eq(close(h, milestone, true).status, "applied")
            test.eq(steps.one(h, { op = "restore", item = trashed }).status, "applied")
            test.eq(assert(steps.get(h, trashed)).item.process_generation, held)
            test.eq(close(h, trashed).status, "denied")
            local replay = assert(h.call("apply_transition_adoption", apply))
            test.is_true(replay.replayed)
            test.eq(replay.generation, reviewed.review.generation + 1)
            test.eq(plan(h).status, "already_adopted")
        end)

        test.it("refuses a custom close kept only in an older restorable process generation", function()
            local h = board()
            local pristine = process(assert(h.call("get_schema", {})))
            local custom = process(assert(h.call("get_schema", {})))
            custom.transitions[2].when = { field = "number", op = "eq", value = 1 }
            assert(h.call("apply_schema", { declaration = { processes = { custom } } }))
            local item = period(h)
            local held = assert(steps.get(h, item)).item.process_generation
            test.eq(steps.one(h, { op = "delete", item = item }).status, "applied")
            assert(h.call("apply_schema", { declaration = { processes = { pristine } } }))
            local reviewed = plan(h)
            test.eq(reviewed.status, "ineligible", tostring(reviewed.conflict and reviewed.conflict.path))
            test.eq(reviewed.conflict.path, "processes.planning_period.transitions.close.when")
            test.eq(reviewed.conflict.generation, held)
        end)

        test.it("refuses a competing path to the close state", function()
            local h = board()
            local change = process(assert(h.call("get_schema", {})))
            change.transitions[#change.transitions + 1] = { id = "other_close", from = { "active" }, to = "closed" }
            assert(h.call("apply_schema", { declaration = { processes = { change } } }))
            local reviewed = plan(h)
            test.eq(reviewed.status, "ineligible")
            test.eq(reviewed.conflict.path, "processes.planning_period.transitions.other_close.to")
        end)

        test.it("carries the rule through schema updates and refuses an incompatible close change", function()
            local h = board()
            local item = period(h)
            local reviewed = plan(h)
            test.eq(reviewed.status, "eligible", tostring(reviewed.conflict and reviewed.conflict.path))
            assert(h.call("apply_transition_adoption", request(reviewed, "adopt")))
            assert(h.call("apply_schema", { declaration = { fields = { { code = "extra", form = "text" } } } }))
            local before = assert(h.call("get_schema", {}))
            local change = process(before)
            change.transitions[2].when = { field = "number", op = "eq", value = 1 }
            local result, err = h.call("apply_schema", { declaration = { processes = { change } } })
            test.is_nil(result)
            test.eq(err:details().code, "transition_rule_conflict")
            test.eq(assert(h.call("get_schema", {})).generation, before.generation)
            test.eq(close(h, item).status, "denied")
        end)
    end)
end

return { run = test.run_cases(define) }
