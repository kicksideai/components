-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")

local function declaration()
    local d = fixture.declaration(fixture.fresh_prefix())
    d.processes[1].states = { { id = "open", category = "started" }, { id = "choice", category = "started" },
        { id = "done", category = "completed" }, { id = "fallback", category = "unstarted" } }
    d.processes[1].transitions = {
        { id = "finish", from = { "open" }, to = "done", when = { field = "assignee", op = "eq", value = { ["$actor"] = "id" } } },
        { id = "route", from = { "open" }, to = "choice" },
        { id = "high", from = { "choice" }, to = "done", auto = true, order = 1, when = { field = "estimate", op = "gte", value = 5 } },
        { id = "low", from = { "choice" }, to = "fallback", auto = true, order = 2, default = true },
    }
    return d
end

local function define()
    test.describe("settlement after mutations", function()
        test.it("settles a transition enabled by a newly planned relation", function()
            local d = declaration()
            d.processes[1].transitions = { { id = "related", from = { "open" }, to = "done", auto = true,
                when = { rel = "blocks", q = "some", where = { field = "estimate", op = "gte", value = 5 } } } }
            local h = fixture.board({ declaration = d })
            local a = steps.create(h, "task")
            local b = steps.create(h, "task", { estimate = 8 })
            test.eq(steps.one(h, { op = "link", item = a, type = "blocks", target = { item = b } }).status, "applied")
            test.eq(assert(steps.get(h, a)).item.state, "done")
            test.eq(assert(steps.get(h, a)).item.version, 3)
        end)
        test.it("settles creation against its declared parent and ancestor path", function()
            local d = declaration()
            d.processes[1].transitions = { { id = "nested", from = { "open" }, to = "done", auto = true,
                when = { ["and"] = { { field = "parent", op = "is_null", value = false }, { field = "path_under", op = "is_null", value = false } } } } }
            local h = fixture.board({ declaration = d })
            local parent = steps.create(h, "task")
            local child = steps.create(h, "task", nil, parent)
            test.eq(assert(steps.get(h, parent)).item.state, "open")
            test.eq(assert(steps.get(h, child)).item.state, "done")
            test.eq(steps.version(h, child), 2)
        end)
        test.it("settles automatic transitions enabled by a field edit", function()
            local d = declaration()
            d.processes[1].transitions = { { id = "auto", from = { "open" }, to = "done", auto = true,
                when = { field = "estimate", op = "gte", value = 5 } } }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "story", { estimate = 3 })
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 8 } }).status, "applied")
            test.eq(assert(steps.get(h, id)).item.state, "done")
        end)
    end)

    test.describe("transition when", function()
        test.it("denies a failing guard and lists caller-specific transitions under real scopes", function()
            local admin, owner, other = scoped.admin(), scoped.member(), scoped.member()
            local h = scoped.board(admin, declaration())
            assert(h.call("grant", { subject_id = owner.id, mask = 3 }))
            assert(h.call("grant", { subject_id = other.id, mask = 3 }))
            local id = steps.create(h, "story", { assignee = { kind = "user", id = owner.id } })
            local denied = assert(other.call("apply", { ops = { { op = "transition", item = id, transition = "finish" } } }, h.id))
            test.eq(denied.outcomes[1].status, "denied")
            test.eq(denied.outcomes[1].findings[1].code, "when_failed")
            for _, pair in ipairs({ { owner, 2 }, { other, 1 } }) do
                local out = assert(pair[1].call("get", { item = { id = id }, include = { "transitions" } }, h.id))
                test.eq(#out.transitions, pair[2])
            end
            test.eq(assert(owner.call("apply", { ops = { { op = "transition", item = id, transition = "finish", expect_version = 1 } } }, h.id)).outcomes[1].status, "applied")
        end)

        test.it("lists no transitions for a caller with only board read access", function()
            local admin, reader = scoped.admin(), scoped.member()
            local h = scoped.board(admin, declaration())
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local id = steps.create(h, "story", { assignee = { kind = "user", id = reader.id } })
            local out = assert(reader.call("get", { item = { id = id }, include = { "transitions" } }, h.id))
            test.eq(#out.transitions, 0)
            local _, err = reader.call("apply", { ops = { { op = "transition", item = id, transition = "finish" } } }, h.id)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
        end)

        test.it("skips failing auto guards in order and chooses a passing guard before the default", function()
            local h = fixture.board({ declaration = declaration() })
            for _, pair in ipairs({ { 3, "fallback" }, { 8, "done" } }) do
                local id = steps.create(h, "story", { estimate = pair[1] })
                test.eq(steps.one(h, { op = "transition", item = id, transition = "route" }).status, "applied")
                test.eq(assert(steps.get(h, id)).item.state, pair[2])
            end
        end)

        test.it("evaluates guards against earlier ops and transition patches", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "story", { estimate = 3 })
            local out = assert(steps.apply(h, { { op = "set", item = id, values = { estimate = 8 } },
                { op = "transition", item = id, transition = "route" } }))
            test.is_true(out.applied)
            test.eq(assert(steps.get(h, id)).item.state, "done")
            id = steps.create(h, "story", { estimate = 3 })
            out = steps.one(h, { op = "transition", item = id, transition = "route", values = { estimate = 8 } })
            test.eq(out.status, "applied")
            test.eq(assert(steps.get(h, out.item)).item.state, "done")
        end)

        test.it("keeps guarded transitions under per-item version CAS", function()
            local h = fixture.board({ declaration = declaration() })
            local id = steps.create(h, "story", { assignee = { kind = "user", id = h.actor:id() } })
            local requests = {}
            for i = 1, 4 do requests[i] = { ops = { { op = "transition", item = id, transition = "finish", expect_version = 1 } } } end
            local applied, conflicts = 0, 0
            for _, out in ipairs(steps.parallel(h, requests)) do
                if out.outcomes[1].status == "applied" then applied = applied + 1 end
                if out.outcomes[1].status == "conflict" then conflicts = conflicts + 1 end
            end
            test.eq(applied, 1); test.eq(conflicts, 3)
        end)

        test.it("evaluates guarded creation and the changed state of an auto chain", function()
            local d = declaration()
            d.processes[1].initial = "choice"
            local h = fixture.board({ declaration = d })
            local out = steps.one(h, { op = "create", type = "story", values = { estimate = 8 } })
            test.eq(out.status, "applied")
            test.eq(assert(steps.get(h, out.item)).item.state, "done")
            d = declaration()
            d.processes[1].transitions[3].when = { field = "state", op = "eq", value = "choice" }
            h = fixture.board({ declaration = d })
            local id = steps.create(h, "story")
            out = steps.one(h, { op = "transition", item = id, transition = "route" })
            test.eq(out.status, "applied")
            test.eq(assert(steps.get(h, out.item)).item.state, "done")
            test.eq(assert(steps.get(h, id)).item.state, "done")
        end)

        test.it("validates guard fields and tree limits at schema apply", function()
            local h = fixture.board({ bare = true })
            for _, field in ipairs({ "title", "missing" }) do
                local d = declaration()
                d.processes[1].transitions[1].when = { field = field, op = "eq", value = "x" }
                local _, err = h.call("apply_schema", { declaration = d })
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().field, field)
                test.eq(err:details().code, field == "title" and "field_unindexed" or "unknown_field")
            end
            local d = declaration()
            local tree = { field = "estimate", op = "eq", value = 1 }
            for _ = 1, 6 do tree = { ["not"] = tree } end
            d.processes[1].transitions[1].when = tree
            test.eq(select(2, h.call("apply_schema", { declaration = d })):kind(), errors.INVALID)
        end)
    end)
end
return { run = test.run_cases(define) }
