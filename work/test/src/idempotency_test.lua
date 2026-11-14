-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Idempotency keys: replay, conflicts, namespaces and what is stored.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")

type Map = { [string]: unknown }

local function create(title: string): Map
    return { op = "create", type = "task", values = { title = title } }
end

local function define()
    test.describe("command receipt identity", function()
        test.it("carries causal trace context on accepted events", function()
            local h = fixture.board()
            local trace = { trace_id = "trace-work", run_id = "run-work", caused_by_event_id = steps.events(h)[1].id }
            assert(steps.apply(h, { { op = "create", type = "task" } }, { trace_context = trace }))
            local events = steps.events(h)
            local context = events[#events].trace_context
            test.eq(context.trace_id, trace.trace_id)
            test.eq(context.run_id, trace.run_id)
            test.eq(context.caused_by_event_id, trace.caused_by_event_id)
        end)
        test.it("refuses a reused key across items and event families", function()
            local h = fixture.board()
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            assert(steps.apply(h, { { op = "set", item = a, values = { title = "A" } } }, { key = "identity" }))
            for _, op in ipairs({ { op = "set", item = b, values = { title = "B" } }, { op = "delete", item = a } }) do
                local _, err = steps.apply(h, { op }, { key = "identity" })
                test.not_nil(err)
                test.eq(err:kind(), errors.CONFLICT)
                test.eq(err:details().code, "idempotency_conflict")
            end
        end)
        test.it("replays every outcome of a committed independent group", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local ops = { { op = "set", item = id, values = { title = "A" } }, { op = "set", item = id, values = { title = "B" } } }
            local first = assert(steps.apply(h, ops, { key = "outcomes", mode = "independent" }))
            local again = assert(steps.apply(h, ops, { key = "outcomes", mode = "independent" }))
            test.eq(#again.outcomes, 2)
            for i = 1, 2 do
                test.eq(again.outcomes[i].status, first.outcomes[i].status)
                test.eq(again.outcomes[i].version, first.outcomes[i].version)
            end
        end)
        test.it("replays invalid outcomes beside committed operations on the same item", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local ops = {
                { op = "set", item = id, values = { missing = "invalid" } },
                { op = "set", item = id, values = { title = "B" } },
            }
            local first = assert(steps.apply(h, ops, { key = "invalid-outcome", mode = "independent" }))
            test.eq(first.outcomes[1].status, "invalid")
            test.eq(first.outcomes[2].status, "applied")
            local again = assert(steps.apply(h, ops, { key = "invalid-outcome", mode = "independent" }))
            test.not_nil(again.outcomes[1])
            test.eq(#again.outcomes, 2)
            test.eq(again.outcomes[1].status, first.outcomes[1].status)
            test.eq(again.outcomes[1].findings[1].code, first.outcomes[1].findings[1].code)
            test.eq(again.outcomes[2].version, first.outcomes[2].version)
        end)
        test.it("concurrent independent retries return every winning outcome before a no-op", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local request = { key = "independent-concurrent", mode = "independent", ops = {
                { op = "set", item = id, values = { title = "B" }, expect_version = 1 },
                { op = "set", item = id, values = { title = "B" } },
            } }
            for _, result in ipairs(steps.parallel(h, { request, request, request, request, request, request })) do
                test.eq(#result.outcomes, 2)
                test.eq(result.outcomes[1].status, "applied")
                test.eq(result.outcomes[2].status, "unchanged")
                test.eq(result.outcomes[1].version, 2)
                test.eq(result.outcomes[2].version, 2)
                test.not_nil(result.seq)
            end
            test.eq(steps.version(h, id), 2)
        end)
        test.it("concurrent unversioned independent setters all recover the applied receipt", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local request = { key = "unversioned-concurrent", mode = "independent", ops = {
                { op = "set", item = id, values = { title = "B" } },
            } }
            local requests = {}
            for _ = 1, 32 do requests[#requests + 1] = request end
            for _, result in ipairs(steps.parallel(h, requests)) do
                test.eq(result.outcomes[1].status, "applied")
                test.eq(result.outcomes[1].version, 2)
                test.not_nil(result.seq)
            end
            test.eq(steps.version(h, id), 2)
        end)
        test.it("concurrent keyed mutations all return the winning receipt", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local request = { key = "concurrent", ops = { { op = "set", item = id, values = { title = "B" }, expect_version = 1 } } }
            for _, result in ipairs(steps.parallel(h, { request, request, request, request })) do
                test.eq(result.outcomes[1].status, "applied")
                test.eq(result.outcomes[1].version, 2)
                test.not_nil(result.seq)
            end
            test.eq(steps.version(h, id), 2)
        end)
    end)

    test.describe("idempotency", function()
        test.it("replays the stored result of an atomic command", function()
            local h = fixture.board()
            local first = assert(steps.apply(h, { create("A"), create("B") }, { key = "k1" }))
            test.is_nil(first.replayed)
            local again = assert(steps.apply(h, { create("A"), create("B") }, { key = "k1" }))
            test.is_true(again.replayed)
            test.eq(again.outcomes[1].item, first.outcomes[1].item)
            test.eq(again.outcomes[2].item, first.outcomes[2].item)
            test.eq(again.outcomes[2].key, h.prefix .. "-2")
            test.is_true(again.seq <= first.seq)
            test.is_true(again.as_of >= first.seq)
            test.eq(#assert(h.call("list_changes", {})).items, 2)
        end)

        test.it("refuses the same key for a different request", function()
            local h = fixture.board()
            assert(steps.apply(h, { create("A"), create("B") }, { key = "k" }))
            local cases = {
                { { create("A"), create("C") }, nil },
                { { create("B"), create("A") }, nil },
                { { create("A"), create("B") }, { mode = "independent" } },
                { { create("A"), create("B") }, { source = "import" } },
            }
            for i, c in ipairs(cases) do
                local extra: Map = { key = "k" }
                for k, v in pairs(c[2] or {}) do extra[k] = v end
                local _, err = steps.apply(h, c[1], extra)
                test.not_nil(err, "case " .. i)
                test.eq(err:kind(), errors.CONFLICT)
                test.eq(err:details().code, "idempotency_conflict")
            end
            test.eq(#assert(h.call("list_changes", {})).items, 2)
        end)

        test.it("scopes keys to the board and to the command kind", function()
            local h = fixture.board()
            local other = fixture.board()
            local a = assert(steps.apply(h, { create("A") }, { key = "shared" }))
            local b = assert(steps.apply(other, { create("A") }, { key = "shared" }))
            test.is_nil(b.replayed)
            test.not_nil(a.outcomes[1].item)
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[#declaration.fields + 1] = { code = "extra", form = "text" }
            local schema = assert(h.call("apply_schema", { declaration = declaration, key = "shared" }))
            test.is_nil(schema.replayed)
        end)

        test.it("stores nothing for a failed or unchanged command so the key runs again", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "T" })
            local failed = assert(steps.apply(h, { create("N"), { op = "set", item = id, values = { assignee = { kind = "user", id = "u" } } } }, { key = "f" }))
            test.is_false(failed.applied)
            local fixed = assert(steps.apply(h, { create("N"), { op = "set", item = id, values = { title = "T2" } } }, { key = "f" }))
            test.is_nil(fixed.replayed)
            test.is_true(fixed.applied)
            local same = assert(steps.apply(h, { { op = "set", item = id, values = { title = "T2" } } }, { key = "u" }))
            test.is_nil(same.seq)
            local rerun = assert(steps.apply(h, { { op = "set", item = id, values = { title = "T3" } } }, { key = "u" }))
            test.is_nil(rerun.replayed)
            test.eq(rerun.outcomes[1].status, "applied")
        end)

        test.it("replays an independent command per group and runs what it has not stored", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A" })
            local b = steps.create(h, "task", { title = "B" })
            local ops = {
                create("N"),
                { op = "set", item = a, values = { title = "A2" } },
                { op = "set", item = b, values = { assignee = { kind = "user", id = "u" } } },
            }
            local first = assert(steps.apply(h, ops, { key = "multi", mode = "independent" }))
            test.eq(first.outcomes[1].status, "applied")
            test.eq(first.outcomes[2].status, "applied")
            test.eq(first.outcomes[3].status, "invalid")
            local again = assert(steps.apply(h, ops, { key = "multi", mode = "independent" }))
            test.is_true(again.replayed)
            test.eq(again.outcomes[1].item, first.outcomes[1].item)
            test.eq(again.outcomes[2].version, 2)
            test.eq(again.outcomes[3].status, "invalid")
            test.eq(steps.version(h, a), 2)
            test.eq(#assert(h.call("list_changes", {})).items, 3)
            local _, err = steps.apply(h, { create("N"), { op = "set", item = a, values = { title = "other" } } }, { key = "multi", mode = "independent" })
            test.not_nil(err)
            test.eq(err:details().code, "idempotency_conflict")
        end)

        test.it("marks every event of the command with its external identity", function()
            local h = fixture.board()
            assert(steps.apply(h, { create("A"), create("B") }, { key = "marks" }))
            local page = assert(h.call("events", {})) :: { events: { { external_id: string? } } }
            local marked: { [string]: boolean } = {}
            for _, e in ipairs(page.events) do
                if e.external_id then marked[e.external_id :: string] = true end
            end
            test.is_true(marked["apply/marks/free"])
            test.is_true(marked["apply/marks/free/2"])
        end)

        test.it("refuses an empty or oversized key", function()
            local h = fixture.board()
            local _, e1 = steps.apply(h, { create("A") }, { key = "" })
            test.eq(e1:kind(), errors.INVALID)
            local _, e2 = steps.apply(h, { create("A") }, { key = string.rep("k", 256) })
            test.eq(e2:kind(), errors.INVALID)
        end)

        test.it("creates a board once per caller and key", function()
            local h = fixture.board({ bare = true })
            local again, err = h.call("create", { idempotency_key = "fixture", title = "Fixture board" })
            test.is_nil(err)
            test.is_true(again.replayed)
            test.eq(again.board_id, h.id)
            local _, cerr = h.call("create", { idempotency_key = "fixture", title = "Another title" })
            test.not_nil(cerr)
            test.eq(cerr:details().code, "idempotency_conflict")
            test.eq(#h.call("list", {}).boards, 1)
            local second = assert(h.call("create", { idempotency_key = "two", title = "Second" }))
            test.is_false(second.replayed)
            test.eq(#h.call("list", {}).boards, 2)
            local _, ambiguous = h.executor:call("app:work_call", { op = "get_schema", request = {} })
            test.eq(ambiguous:kind(), errors.CONFLICT)
            test.eq(ambiguous:details().code, "board_required")
            test.eq(#ambiguous:details().boards, 2)
        end)
    end)
end

return { run = test.run_cases(define) }
