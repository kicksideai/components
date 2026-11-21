-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local operations = require("operations")
local probe = require("probe")

type Map = { [string]: unknown }

local function board(): fixture.Handle
    local declaration = fixture.declaration(fixture.fresh_prefix())
    declaration.processes = { { id = "delivery", migration = "pin", initial = "open",
        states = { { id = "open", category = "started" }, { id = "done", category = "completed" } },
        transitions = { { id = "finish", from = { "open" }, to = "done" } },
    } }
    return fixture.board({ declaration = declaration })
end

local function finish(item: string, version: integer?): Map
    return { op = "transition", item = item, transition = "finish", expect_version = version }
end

local function edit(item: string): Map
    return { op = "set", item = item, values = { title = "Updated" } }
end

local function expectations(h: fixture.Handle, item: string): { Map }
    local out: { Map } = {}
    for _, call in ipairs(probe.calls(h.id)) do
        for _, write in ipairs(call.writes) do
            if write.expect and write.expect.subject == "i:" .. item then out[#out + 1] = write.expect end
        end
    end
    return out
end

local function schema_change(): Map
    return { method = "apply_schema", request = { declaration = { fields = { { code = "extra", form = "text" } } } } }
end

local function apply(h: fixture.Handle, ops: { Map }, opts: Map): Map
    local result, err = steps.apply(h, ops, opts)
    return assert(result, steps.detail(err))
end

local function define()
    test.describe("schema guard for named transitions", function()
        test.it("passes five independent groups across a disjoint edit without retrying or fencing a field edit", function()
            local h = board()
            local disjoint, ordinary = steps.create(h, "task"), steps.create(h, "task")
            local ids, ops = {}, {} :: { Map }
            for i = 1, 5 do
                ids[i] = steps.create(h, "task")
                ops[i] = finish(ids[i])
            end
            ops[6] = edit(ordinary)
            probe.arm(h.id, { method = "apply", request = { ops = { edit(disjoint) } } })
            local result = apply(h, ops, { mode = "independent" })
            for _, outcome in ipairs(result.outcomes) do test.eq(outcome.status, "applied") end
            test.eq(#probe.calls(h.id), 7)
            for _, item in ipairs(ids) do
                local guarded = expectations(h, item)
                test.eq(#guarded, 1)
                test.eq(guarded[1].also.subject, "schema")
                test.eq(guarded[1].also.version, 1)
                test.is_nil(guarded[1].head)
            end
            test.is_nil(expectations(h, ordinary)[1].also)
            test.is_nil(expectations(h, disjoint)[1].also)
        end)

        test.it("reprepares the stale transition group and lets the ordinary edit commit once", function()
            local h = board()
            local transition, ordinary = steps.create(h, "task"), steps.create(h, "task")
            probe.arm(h.id, schema_change())
            local result = apply(h, { finish(transition, 1), edit(ordinary) }, { mode = "independent" })
            for _, outcome in ipairs(result.outcomes) do test.eq(outcome.status, "applied") end
            test.eq(#probe.calls(h.id), 3)
            local guarded = expectations(h, transition)
            test.eq(#guarded, 2)
            test.eq(guarded[1].also.version, 1)
            test.eq(guarded[2].also.version, 2)
            test.eq(guarded[1].version, 1)
            test.eq(guarded[2].version, 1)
            test.is_nil(expectations(h, ordinary)[1].also)
        end)

        test.it("preserves an explicit item conflict when the same item changes after preparation", function()
            local h = board()
            local item = steps.create(h, "task")
            probe.arm(h.id, { method = "apply", request = { ops = { edit(item) } } })
            local result = apply(h, { finish(item, 1) }, { mode = "independent" })
            test.eq(result.outcomes[1].status, "conflict")
            test.eq(result.outcomes[1].findings[1].code, "version_mismatch")
            test.eq(#probe.calls(h.id), 2)
            test.eq(assert(steps.get(h, item)).item.state, "open")
        end)

        test.it("reprepares the entire atomic command when the schema changes", function()
            local h = board()
            local first, second = steps.create(h, "task"), steps.create(h, "task")
            probe.arm(h.id, schema_change())
            local result = apply(h, { finish(first, 1), finish(second, 1) }, { mode = "atomic", key = "schema-race" })
            test.is_true(result.applied)
            local calls = probe.calls(h.id)
            test.eq(#calls, 2)
            test.eq(calls[1].writes[1].expect.also.version, 1)
            test.eq(calls[2].writes[1].expect.also.version, 2)
            local first_delivery = calls[1].writes[1].events[1].external
            local retry_delivery = calls[2].writes[1].events[1].external
            test.eq(first_delivery.external_id, retry_delivery.external_id)
            test.is_true(first_delivery.external_source ~= retry_delivery.external_source)
            for _, item in ipairs({ first, second }) do
                test.eq(assert(steps.get(h, item)).item.state, "done")
                test.eq(assert(steps.get(h, item)).item.version, 2)
            end
        end)

        test.it("checks the schema once per atomic append and replays after the schema advances", function()
            local h = board()
            local first, second = steps.create(h, "task"), steps.create(h, "task")
            probe.arm(h.id)
            local ops = { finish(first), finish(second) }
            local opts = { mode = "atomic", key = "guarded-command" }
            local result = apply(h, ops, opts)
            test.is_true(result.applied)
            local calls = probe.calls(h.id)
            test.eq(#calls, 1)
            test.eq(#calls[1].writes, 3)
            test.eq(calls[1].writes[1].expect.also.version, 1)
            test.is_nil(calls[1].writes[2].expect.also)
            assert(h.call("apply_schema", schema_change().request))
            local replay = apply(h, ops, opts)
            test.is_true(replay.replayed)
            test.eq(replay.seq, result.seq)
            test.eq(#probe.calls(h.id), 1)

            local other = steps.create(h, "task")
            local schema = assert(h.call("get_schema", {}))
            local exact = apply(h, { finish(other) }, { mode = "atomic", expected_head = schema.as_of })
            test.is_true(exact.applied)
            calls = probe.calls(h.id)
            local last = calls[#calls].writes
            test.eq(#last, 1)
            test.eq(last[1].expect.head, schema.as_of)
            test.is_nil(last[1].expect.also)
        end)

        test.it("passes five groups from a Bulk chunk across a disjoint append", function()
            local h = board()
            operations.gate(h, true)
            local disjoint = steps.create(h, "task")
            local ids = {}
            for i = 1, 5 do ids[i] = steps.create(h, "task", { estimate = 1 }) end
            probe.arm(h.id, { rank_item = disjoint })
            local started = operations.call(h, "bulk", { key = "guarded-bulk",
                query = { where = { field = "estimate", op = "eq", value = 1 } },
                ops_template = { { op = "transition", transition = "finish" } },
            })
            local status = operations.finished(h, started.bulk_id)
            test.eq(status.status, "done")
            test.eq(status.applied, 5)
            test.eq(#probe.calls(h.id), 5)
            for _, item in ipairs(ids) do
                local guarded = expectations(h, item)
                test.eq(#guarded, 1)
                test.eq(guarded[1].also.version, 1)
                test.is_nil(guarded[1].head)
            end
        end)
    end)
end

return { run = test.run_cases(define) }
