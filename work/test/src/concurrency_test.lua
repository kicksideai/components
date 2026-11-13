-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Per-item acceptance: commands on different items never conflict, a stale version
-- on one item does, atomic commands roll back whole and independent commands answer per op.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")

type Map = { [string]: unknown }

local parallel = steps.parallel

local function set(item: string, field: string, value: unknown, expect: integer?): Map
    return { ops = { { op = "set", item = item, expect_version = expect, values = { [field] = value } } } }
end

local function define()
    test.describe("per-item acceptance", function()
        test.it("refuses explicit false approval decisions without recording an approval", function()
            local h = fixture.board({ bare = true })
            local d = fixture.declaration(h.prefix)
            d.processes[1].states[1] = { id = "open", category = "started", kind = "gate", release_when = {
                approvals = { min = 1, from = { { kind = "user", id = h.actor:id() } } },
            } }
            assert(h.call("apply_schema", { declaration = d }))
            local item = steps.create(h, "task")
            local before = steps.version(h, item)
            local result = steps.one(h, { op = "approve", item = item, visit = 1, decision = false })
            test.eq(result.status, "invalid")
            test.eq(result.findings[1].code, "approval_decision_invalid")
            test.eq(steps.version(h, item), before)
        end)
        test.it("returns malformed region findings alongside independent peers", function()
            for _, mode in ipairs({ "atomic", "independent" }) do
                local h = fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
                local item = steps.create(h, "task", { title = "Before" })
                local result, err = steps.apply(h, {
                    { op = "set", item = item, values = { title = "After" } },
                    { op = "transition", item = item, transition = "cancel", region = 3 },
                    { op = "transition", item = item, transition = "cancel", region = {} },
                    { op = "transition", item = item, transition = "cancel", region = false },
                }, { mode = mode })
                test.is_nil(err, steps.detail(err))
                test.eq(#result.outcomes, 4)
                for i = 2, 4 do
                    test.eq(result.outcomes[i].status, "invalid")
                    test.eq(result.outcomes[i].findings[1].code, "parallel_region_unknown")
                end
                test.eq(result.outcomes[1].status, mode == "atomic" and "unchanged" or "applied")
                test.eq(assert(steps.get(h, item)).item.state, "todo")
                test.eq(assert(steps.get(h, item)).item.values.title, mode == "atomic" and "Before" or "After")
            end
        end)
        test.it("returns each malformed operation finding alongside its independent peers", function()
            for _, mode in ipairs({ "atomic", "independent" }) do
                local h = fixture.board()
                local item = steps.create(h, "task", { title = "Before" })
                local result, err = steps.apply(h, {
                    { op = "set", item = item, values = { title = "After" } },
                    { op = "purge", item = item },
                    { op = "rank", item = item, before = 3 },
                    { op = "comment", item = item, body = "Comment", mentions = 3 },
                    { op = "link", item = item, type = "blocks", target = 3 },
                    { op = "link", item = item, type = "blocks", target = { item = "peer", board = 3 } },
                }, { mode = mode })
                test.is_nil(err, steps.detail(err))
                test.eq(#result.outcomes, 6)
                for i, code in ipairs({ "unsupported_op", "invalid_neighbor", "invalid_mentions", "invalid_target", "invalid_target" }) do
                    test.eq(result.outcomes[i + 1].status, "invalid")
                    test.eq(result.outcomes[i + 1].findings[1].code, code)
                end
                test.eq(result.outcomes[1].status, mode == "atomic" and "unchanged" or "applied")
                test.eq(assert(steps.get(h, item)).item.values.title, mode == "atomic" and "Before" or "After")
            end
        end)
        test.it("lets writers on different items proceed at once", function()
            local h = fixture.board()
            local ids: { string } = {}
            for i = 1, 6 do ids[i] = steps.create(h, "task", { title = "T" .. i }) end
            local requests: { Map } = {}
            for i, id in ipairs(ids) do requests[i] = set(id, "title", "Edited " .. i, 1) end
            local results = parallel(h, requests)
            for i, r in ipairs(results) do
                test.eq(r.outcomes[1].status, "applied", "writer " .. i)
                test.eq(r.outcomes[1].version, 2)
            end
            for i, id in ipairs(ids) do test.eq(assert(steps.get(h, id)).item.values.title, "Edited " .. i) end
        end)

        test.it("accepts exactly one writer of the same version and reports the rest as conflicts", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "T" })
            local requests: { Map } = {}
            for i = 1, 5 do requests[i] = set(id, "title", "Writer " .. i, 1) end
            local results = parallel(h, requests)
            local applied, conflicts = 0, 0
            for _, r in ipairs(results) do
                local o = r.outcomes[1]
                if o.status == "applied" then applied = applied + 1 end
                if o.status == "conflict" then
                    conflicts = conflicts + 1
                    test.eq(o.findings[1].code, "version_mismatch")
                end
            end
            test.eq(applied, 1)
            test.eq(conflicts, 4)
            test.eq(steps.version(h, id), 2)
        end)

        test.it("retries a command that read a version a concurrent writer moved", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "T" })
            local results = parallel(h, { set(id, "title", "One"), set(id, "title", "Two"), set(id, "estimate", 4) })
            for i, r in ipairs(results) do test.eq(r.outcomes[1].status, "applied", "writer " .. i) end
            test.eq(steps.version(h, id), 4)
        end)

        test.it("reports a conflict on a stale caller version without retrying it", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "T" })
            steps.one(h, { op = "set", item = id, values = { title = "B" } })
            local o = steps.one(h, { op = "set", item = id, expect_version = 1, values = { title = "C" } })
            test.eq(o.status, "conflict")
            test.eq(o.version, 2)
            test.eq(assert(steps.get(h, id)).item.values.title, "B")
        end)
    end)

    test.describe("atomic mode", function()
        test.it("rolls the whole command back when one item conflicts", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A" })
            local b = steps.create(h, "task", { title = "B" })
            steps.one(h, { op = "set", item = b, values = { title = "B2" } })
            local out = assert(steps.apply(h, {
                { op = "create", type = "task", values = { title = "N" } },
                { op = "set", item = a, expect_version = 1, values = { title = "A2" } },
                { op = "set", item = b, expect_version = 1, values = { title = "B3" } },
            }))
            test.is_false(out.applied)
            test.eq(out.outcomes[3].status, "conflict")
            test.eq(out.outcomes[3].version, 2)
            test.eq(out.outcomes[1].status, "unchanged")
            test.is_true(out.outcomes[1].rolled_back)
            test.eq(out.outcomes[2].status, "unchanged")
            test.eq(assert(steps.get(h, a)).item.values.title, "A")
            test.eq(assert(steps.get(h, b)).item.values.title, "B2")
            local page = assert(h.call("list_changes", {}))
            test.eq(#page.items, 2)
        end)

        test.it("rolls the whole command back when one op is invalid", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A" })
            local out = assert(steps.apply(h, {
                { op = "set", item = a, values = { title = "A2" } },
                { op = "set", item = a, values = { assignee = { kind = "user", id = "x" } } },
            }))
            test.is_false(out.applied)
            test.eq(out.outcomes[2].status, "invalid")
            test.eq(assert(steps.get(h, a)).item.values.title, "A")
        end)

        test.it("applies several ops on several items in one append", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A" })
            local b = steps.create(h, "task", { title = "B" })
            local out = assert(steps.apply(h, {
                { op = "set", item = a, values = { title = "A2" } },
                { op = "create", type = "task", values = { title = "N" } },
                { op = "set", item = b, values = { title = "B2" } },
                { op = "set", item = a, values = { estimate = 8 } },
                { op = "comment", item = b, body = "hello" },
                { op = "link", item = a, type = "blocks", target = { item = b } },
            }))
            test.is_true(out.applied)
            for i, o in ipairs(out.outcomes) do test.eq(o.status, "applied", "op " .. i) end
            test.eq(out.outcomes[1].version, 2)
            test.eq(out.outcomes[4].version, 3)
            test.eq(out.outcomes[6].version, 4)
            local item = assert(steps.get(h, a, { "links" }))
            test.eq(item.item.values.title, "A2")
            test.eq(item.item.values.estimate, 8)
            test.eq(item.item.version, 4)
            test.eq(#item.links, 1)
            test.eq(steps.version(h, b), 2)
        end)

        test.it("keeps the key order of items created in one command", function()
            local h = fixture.board()
            local ops = {}
            for i = 1, 8 do ops[i] = { op = "create", type = "task", values = { title = "T" .. i } } end
            local out = assert(steps.apply(h, ops))
            for i = 1, 8 do test.eq(out.outcomes[i].key, h.prefix .. "-" .. i) end
        end)
    end)

    test.describe("independent mode", function()
        test.it("answers per op and applies what is valid", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "A" })
            local b = steps.create(h, "task", { title = "B" })
            steps.one(h, { op = "set", item = b, values = { title = "B2" } })
            local out = assert(steps.apply(h, {
                { op = "create", type = "task", values = { title = "N" } },
                { op = "set", item = a, values = { title = "A2" } },
                { op = "set", item = a, values = { assignee = { kind = "user", id = "x" } } },
                { op = "set", item = b, expect_version = 1, values = { title = "B3" } },
                { op = "set", item = "00000000-0000-0000-0000-000000000000", values = { title = "x" } },
            }, { mode = "independent" }))
            test.is_true(out.applied)
            test.eq(out.outcomes[1].status, "applied")
            test.eq(out.outcomes[1].key, h.prefix .. "-3")
            test.eq(out.outcomes[2].status, "applied")
            test.eq(out.outcomes[3].status, "invalid")
            test.eq(out.outcomes[4].status, "conflict")
            test.eq(out.outcomes[5].status, "invalid")
            test.eq(assert(steps.get(h, a)).item.values.title, "A2")
            test.eq(assert(steps.get(h, b)).item.values.title, "B2")
        end)

        test.it("applies a bulk edit of many items", function()
            local h = fixture.board()
            local ops = {}
            for i = 1, 30 do ops[i] = { op = "create", type = "task", values = { title = "T" .. i } } end
            local made = assert(steps.apply(h, ops))
            local edits = {}
            for i, o in ipairs(made.outcomes) do edits[i] = { op = "set", item = o.item, expect_version = 1, values = { estimate = i } } end
            local out = assert(steps.apply(h, edits, { mode = "independent" }))
            for i, o in ipairs(out.outcomes) do test.eq(o.status, "applied", "op " .. i) end
            test.eq(assert(steps.get(h, made.outcomes[30].item)).item.values.estimate, 30)
        end)
    end)

    test.describe("limits", function()
        test.it("refuses empty and oversized commands and unknown modes", function()
            local h = fixture.board()
            local _, e1 = steps.apply(h, {})
            test.eq(e1:kind(), errors.INVALID)
            local ops = {}
            for i = 1, 201 do ops[i] = { op = "create", type = "task" } end
            local _, e2 = steps.apply(h, ops)
            test.eq(e2:kind(), errors.INVALID)
            local _, e3 = steps.apply(h, { { op = "create", type = "task" } }, { mode = "sideways" })
            test.eq(e3:kind(), errors.INVALID)
            local out = steps.one(h, { op = "purge", item = "x" })
            test.eq(out.findings[1].code, "unsupported_op")
        end)
    end)
end

return { run = test.run_cases(define) }
