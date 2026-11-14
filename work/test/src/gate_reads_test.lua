-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local sql = require("sql")
local json = require("json")

type Map = { [string]: unknown }

local function setup(): (fixture.Handle, string, (string, unknown) -> (unknown, error?), string)
    local h = fixture.board({ bare = true })
    local reviewer, reviewer_id = fixture.user(h, nil, true)
    assert(h.call("grant", { subject_id = reviewer_id, mask = 3 }))
    local d = { key_prefix = h.prefix, fields = { { code = "level", form = "text", index = "key" } },
        item_types = { { id = "task", process = "flow", fields = { "level" } } },
        visibility = { field = "level", bypass = "admin", levels = { { id = "private", holders = { { user = h.actor:id() } } } } },
        processes = { { id = "flow", initial = "todo", migration = "pin", states = {
            { id = "todo", category = "unstarted" },
            { id = "review", category = "started", kind = "gate", release_when = {
                approvals = { min = 1, from = { group = "app.security:work_test" }, prevent_self = true }, when = { field = "level", op = "eq", value = "release" } } },
            { id = "done", category = "completed" },
        }, transitions = { { id = "review", from = { "todo" }, to = "review" }, { id = "release", from = { "review" }, to = "done", auto = true, default = true } } } } }
    assert(h.call("apply_schema", { declaration = d }))
    local id = steps.create(h, "task")
    steps.one(h, { op = "transition", item = id, transition = "review" })
    return h, id, reviewer, reviewer_id
end

local function define()
    test.describe("current gate reads", function()
        test.it("shares live group eligibility and entrant prevention with approval commands", function()
            local h, id, reviewer, reviewer_id = setup()
            local own = assert(steps.get(h, id)).item.gate
            test.not_nil(own)
            test.eq(own.entered_by.kind, "user")
            test.eq(own.entered_by.id, h.actor:id())
            test.not_nil(own.entered_at)
            test.is_false(own.can_approve)
            test.eq(assert(h.call("approve", { item = id, visit = 2 })).outcomes[1].findings[1].code, "approval_self_prevented")
            local gate = assert(reviewer("get", { item = { id = id } })).item.gate
            test.is_true(gate.can_approve)
            test.eq(#gate.approvals, 0)
            assert(reviewer("approve", { item = id, visit = 2 }))
            gate = assert(reviewer("get", { item = { id = id } })).item.gate
            test.eq(#gate.approvals, 1)
            test.eq(gate.approvals[1].principal.kind, "user")
            test.eq(gate.approvals[1].principal.id, reviewer_id)
            test.eq(gate.approvals[1].decision, "approve")
            test.not_nil(gate.approvals[1].at)
            local page = assert(reviewer("query", { include = { "gate", "transitions" } }))
            test.eq((json.encode(page.items[1].gate)), (json.encode(gate)))
            local plain = assert(reviewer("query", {}))
            test.is_nil(plain.items[1].gate)
            local changes = assert(reviewer("list_changes", {}))
            test.eq((json.encode(changes.items[1].gate)), (json.encode(gate)))
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM app_user_groups WHERE user_id=$1 AND group_id=$2", { reviewer_id, "app.security:work_test" }))
            db:release()
            test.is_false(assert(reviewer("get", { item = { id = id } })).item.gate.can_approve)
            test.eq(assert(reviewer("approve", { item = id, visit = 2, decision = "reject" })).outcomes[1].findings[1].code, "approval_ineligible")
        end)

        test.it("reads the pinned gate's approver rule after the declaration changes", function()
            local h, id, reviewer = setup()
            local d = assert(h.call("get_schema", {})).declaration
            d.processes[1].states[2].release_when.approvals.from = { group = "app.security:work_admin" }
            assert(h.call("apply_schema", { declaration = d }))
            test.is_true(assert(reviewer("get", { item = { id = id } })).item.gate.can_approve)
            test.is_true(assert(reviewer("query", { include = { "gate" } })).items[1].gate.can_approve)
            test.eq(assert(reviewer("approve", { item = id, visit = 2 })).outcomes[1].status, "applied")
        end)

        test.it("matches group principals inside the declared approver list", function()
            local h, _, reviewer = setup()
            local d = assert(h.call("get_schema", {})).declaration
            d.processes[1].states[2].release_when.approvals.from = { { kind = "group", id = "app.security:work_test" } }
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "review" })
            test.is_true(assert(reviewer("get", { item = { id = id } })).item.gate.can_approve)
            test.eq(assert(reviewer("approve", { item = id, visit = 2 })).outcomes[1].status, "applied")
        end)

        test.it("counts independent group members toward a quorum in a principal source list", function()
            local h, _, reviewer = setup()
            local other, other_id = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = other_id, mask = 3 }))
            local d = assert(h.call("get_schema", {})).declaration
            local release = d.processes[1].states[2].release_when
            release.approvals.from = { { kind = "group", id = "app.security:work_test" } }
            release.approvals.min = 2
            release.when = nil
            assert(h.call("apply_schema", { declaration = d }))
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "review" })
            test.eq(assert(reviewer("approve", { item = id, visit = 2 })).outcomes[1].status, "applied")
            test.eq(assert(steps.get(h, id)).item.state, "review")
            test.eq(assert(other("approve", { item = id, visit = 2 })).outcomes[1].status, "applied")
            test.eq(assert(steps.get(h, id)).item.state, "done")
        end)

        test.it("keeps approval data behind item visibility and clears it on exit", function()
            local h, id, reviewer = setup()
            assert(reviewer("approve", { item = id, visit = 2 }))
            steps.one(h, { op = "set", item = id, values = { level = "private" } })
            local _, err = reviewer("get", { item = { id = id } })
            test.eq(err:kind(), errors.NOT_FOUND)
            test.eq(#assert(reviewer("query", { include = { "gate" } })).items, 0)
            test.eq(#assert(reviewer("list_changes", {})).items, 0)
            test.eq(#assert(steps.get(h, id)).item.gate.approvals, 1)
            steps.one(h, { op = "set", item = id, values = { level = "release" } })
            local got = assert(steps.get(h, id)).item
            test.eq(got.state, "done")
            test.is_nil(got.gate)
        end)
    end)
end
return { run = test.run_cases(define) }
