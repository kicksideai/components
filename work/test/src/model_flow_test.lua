-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local directory_probe = require("directory_probe")

local function with_field(field: { [string]: unknown }): { [string]: unknown }
    local d = fixture.declaration(fixture.fresh_prefix())
    d.fields[#d.fields + 1] = field
    for _, item_type in ipairs(d.item_types) do item_type.fields[#item_type.fields + 1] = field.code end
    return d
end

local function define()
    test.describe("declarative model flows", function()
        test.it("checks peer visibility in the shared schema snapshot", function()
            local h = fixture.board({ declaration = with_field({ code = "peer", type = "item", index = "key" }) })
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2].access = { read = { { group = "app.security:work_test" } } }
            local foreign = fixture.board({ declaration = d })
            local target = steps.create(foreign, "task")
            assert(foreign.call("grant", { subject_id = h.actor:id(), mask = 1 }))
            local id = steps.create(h, "task", { peer = { board = foreign.id, item = target } })
            directory_probe.change_digest(h.actor:id(), foreign.id)
            local result, err = steps.get(h, id)
            test.is_nil(result)
            test.not_nil(err)
            test.eq(err:kind(), errors.UNAVAILABLE)
            test.eq(err:details().code, "access_projection_changed")
        end)
        test.it("refuses externally changing source selections", function()
            local h = fixture.board()
            local selections = {
                { field = "estimate", op = "eq", value = { ["$operand"] = { id = "app:model_operand" } } },
                { match = { scope = "app:model_search", query = "query" } },
            }
            for _, selection in ipairs(selections) do
                local _, err = h.call("list_changes", { selection = { ["and"] = { selection } } })
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "source_filter_unsupported")
            end
        end)
        test.it("quantifies direct live children with nested predicates and empty complements", function()
            local h = fixture.board()
            local parent = steps.create(h, "task")
            local child = steps.create(h, "task", { estimate = 2 }, parent)
            steps.create(h, "task", { estimate = 4 }, child)
            local function ids(q: string, value: integer): { [string]: boolean }
                local page = assert(h.call("query", { where = { children = true, q = q, where = { field = "estimate", op = "eq", value = value } } }))
                local out = {}
                for _, item in ipairs(page.items) do out[item.id] = true end
                return out
            end
            test.is_true(ids("some", 2)[parent])
            test.is_nil(ids("some", 4)[parent])
            test.is_true(ids("every", 2)[parent])
            test.is_nil(ids("none", 2)[parent])
            test.eq(steps.one(h, { op = "delete", item = child }).status, "applied")
            test.is_true(ids("none", 2)[parent])
            test.is_true(ids("every", 2)[parent])
        end)
        test.it("rejects a children-dependent change-feed selection", function()
            local h = fixture.board()
            local _, err = h.call("list_changes", { selection = { children = true, q = "some" } })
            test.not_nil(err)
            test.eq(err:details().code, "source_filter_unsupported")
        end)
        test.it("propagates grandchild changes through children rollup predicates", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[#d.fields + 1] = { code = "nested", type = "rollup", form = "bool", of = "children", fn = "any",
                where = { children = true, q = "some", where = { field = "estimate", op = "gt", value = 2 } } }
            d.item_types[3].fields[#d.item_types[3].fields + 1] = "nested"
            local h = fixture.board({ declaration = d })
            local parent = steps.create(h, "task")
            local child = steps.create(h, "task", nil, parent)
            local grandchild = steps.create(h, "task", { estimate = 1 }, child)
            test.is_false(steps.get(h, parent).item.values.nested)
            test.eq(steps.one(h, { op = "set", item = grandchild, values = { estimate = 3 } }).status, "applied")
            test.is_true(steps.get(h, parent).item.values.nested)
        end)
        test.it("returns allowed transitions over a page using the shared guard predicate", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.processes[1].states[#d.processes[1].states + 1] = { id = "done", category = "completed" }
            d.processes[1].transitions = { { id = "finish", from = { "open" }, to = "done", when = { field = "estimate", op = "gte", value = 2 } } }
            local h = fixture.board({ declaration = d })
            local yes = steps.create(h, "task", { estimate = 2 })
            local no = steps.create(h, "task", { estimate = 1 })
            local page = assert(h.call("query", { include = { "transitions" } }))
            for _, item in ipairs(page.items) do
                test.eq(#item.transitions, item.id == yes and 1 or 0)
                if item.id == yes then test.eq(item.transitions[1].id, "finish") else test.eq(item.id, no) end
            end
        end)
        test.it("refuses formula environment access that bypasses dependency admission", function()
            local h = fixture.board()
            for _, expression in ipairs({ "$env.estimate", '$env["estimate"]', "$env[title]" }) do
                local _, err = h.call("plan_schema", { declaration = { fields = {
                    { code = "leaked", type = "formula", form = "int", expression = expression },
                } } })
                test.not_nil(err, expression)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "formula_invalid")
            end
        end)
        test.it("evaluates formulas in the fold and retains findings for failed results", function()
            local d = with_field({ code = "double", type = "formula", form = "int", expression = "estimate * 2", index = "number" })
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { estimate = 3 })
            test.eq(steps.get(h, id).item.values.double, 6)
            test.eq(#assert(h.call("query", { where = { field = "double", op = "eq", value = 6 } })).items, 1)
            test.eq(steps.one(h, { op = "set", item = id, values = { double = 9 } }).status, "invalid")
            test.eq(steps.one(h, { op = "set", item = id, unset = { "estimate" } }).status, "applied")
            local item = steps.get(h, id).item
            test.is_nil(item.values.double)
            test.eq(item.value_states.double, "absent")
            test.eq(item.findings[1].code, "formula_failed")
            test.eq(item.findings[1].field, "double")
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 4 } }).status, "applied")
            item = steps.get(h, id).item
            test.eq(item.values.double, 8)
            test.eq(#item.findings, 0)
        end)
        test.it("withholds formula-index queries until their recompute finishes", function()
            local d = with_field({ code = "double", type = "formula", form = "int", expression = "estimate * 2", index = "number" })
            local h = fixture.board({ declaration = d })
            steps.create(h, "task", { estimate = 3 })
            local db = assert(store.open())
            assert(db:execute([[INSERT INTO kickside_work_job (board_id,job_id,job_type,key,status)
                VALUES ($1,'pending-formula','recompute','{}','pending')]], { h.id }))
            db:release()
            for _, method in ipairs({ "query", "count" }) do
                local page = assert(h.call(method, { where = { field = "double", op = "eq", value = 6 } }))
                test.is_true(page.reindexing, method)
                test.is_nil(page.total)
                if method == "query" then test.eq(#page.items, 0) end
            end
        end)
        test.it("backfills an existing formula when an item type starts carrying it", function()
            local d = with_field({ code = "double", type = "formula", form = "int", expression = "estimate * 2", index = "number" })
            table.remove(d.item_types[3].fields :: { unknown })
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { estimate = 3 })
            test.is_nil(steps.get(h, id).item.values.double)
            local patch = { item_types = { { id = "task", process = "delivery", parent_types = { "story", "task" },
                fields = { "title", "estimate", "labels", "double" } } } }
            test.eq(assert(h.call("plan_schema", { declaration = patch })).class, "semantic")
            assert(h.call("apply_schema", { declaration = patch }))
            steps.wait_for("newly carried formula", function(): boolean
                return steps.get(h, id).item.values.double == 6
            end)
        end)
        test.it("evaluates formula dependencies on the command working document", function()
            local d = with_field({ code = "double", type = "formula", form = "int", expression = "estimate * 2", index = "number" })
            d.processes[1].states[#d.processes[1].states + 1] = { id = "done", category = "completed" }
            d.processes[1].transitions = { { id = "finish", from = { "open" }, to = "done", auto = true,
                when = { field = "double", op = "gte", value = 6 } } }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task", { estimate = 1 })
            test.eq(steps.get(h, id).item.state, "open")
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 3 } }).status, "applied")
            test.eq(steps.get(h, id).item.state, "done")
        end)

        test.it("stores rich text documents with the last accepted field write winning", function()
            local h = fixture.board({ declaration = with_field({ code = "body", type = "rich_text", config = { format = "json" } }) })
            local id = steps.create(h, "task", { body = { type = "doc", content = { { text = "first" } } } })
            test.eq(steps.get(h, id).item.values.body.content[1].text, "first")
            test.eq(steps.one(h, { op = "set", item = id, values = { body = { type = "doc", content = { { text = "second" } } } } }).status, "applied")
            test.eq(steps.get(h, id).item.values.body.content[1].text, "second")
        end)
        test.it("exposes declared rank fields over the system rank and refuses client values", function()
            local h = fixture.board({ declaration = with_field({ code = "position", type = "rank", index = "key" }) })
            local a = steps.create(h, "task")
            local b = steps.create(h, "task")
            test.eq(steps.get(h, a).item.values.position, steps.get(h, a).item.rank)
            test.eq(steps.one(h, { op = "set", item = a, values = { position = "x" } }).status, "invalid")
            test.eq(steps.one(h, { op = "rank", item = b, before = a }).status, "applied")
            local page = assert(h.call("query", { order = { field = "position" } }))
            test.eq(page.items[1].id, b)
            test.eq(page.items[1].values.position, page.items[1].rank)
        end)
        test.it("redacts item reference fields after target access is revoked", function()
            local h = fixture.board({ declaration = with_field({ code = "peer", type = "item", track = true, intervals = true, index = "key" }) })
            local foreign = fixture.board()
            local target = steps.create(foreign, "task")
            assert(foreign.call("grant", { subject_id = h.actor:id(), mask = 1 }))
            local id = steps.create(h, "task", { peer = { board = foreign.id, item = target } })
            test.eq(steps.get(h, id).item.values.peer.item, target)
            assert(foreign.call("revoke", { subject_id = h.actor:id() }))
            for _, item in ipairs({ steps.get(h, id).item, assert(h.call("query", {})).items[1], assert(h.call("list_changes", {})).items[1] }) do
                test.is_nil(item.values.peer.item)
                test.is_nil(item.values.peer.board)
                test.is_true(item.values.peer.unavailable)
            end
            local grouped = assert(h.call("query", { group_by = "peer" }))
            test.is_true(grouped.groups[1].value.unavailable)
            test.is_nil(grouped.groups[1].value.item)
            local history = assert(h.call("list_history", { item = { id = id }, include = { "intervals" } }))
            for _, entry in ipairs(history.entries) do
                if entry.field == "peer" then test.is_true(entry.after.unavailable); test.is_nil(entry.after.item) end
            end
            for _, period in ipairs(history.intervals) do
                if period.field == "peer" then test.is_true(period.value.unavailable); test.is_nil(period.value.item) end
            end
            local times = assert(h.call("get_time_in_state", { item = { id = id }, field = "peer" }))
            for key in pairs(times.totals) do test.is_nil(key:find(foreign.id, 1, true)) end
        end)

        test.it("uses item reference set members in the shared filter language", function()
            local h = fixture.board({ declaration = with_field({ code = "peers", type = "item", cardinality = "set", index = "key" }) })
            local target = steps.create(h, "task")
            local id = steps.create(h, "task", { peers = { { board = h.id, item = target } } })
            test.eq(steps.get(h, id).item.values.peers[1].item, target)
            local page = assert(h.call("query", { where = { field = "peers", op = "has", value = { board = h.id, item = target } } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, id)
        end)

        test.it("resolves item reference fields as the caller before acceptance", function()
            local h = fixture.board({ declaration = with_field({ code = "peer", type = "item", index = "key" }) })
            local target = steps.create(h, "task")
            local id = steps.create(h, "task", { peer = { board = h.id, item = target } })
            local peer = steps.get(h, id).item.values.peer
            test.eq(peer.board, h.id)
            test.eq(peer.item, target)
            local page = assert(h.call("query", { where = { field = "peer", op = "eq", value = { board = h.id, item = target } } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, id)
            local foreign = fixture.board()
            local hidden = steps.create(foreign, "task")
            local outcome = steps.one(h, { op = "set", item = id, values = { peer = { board = foreign.id, item = hidden } } })
            test.eq(outcome.status, "invalid")
            test.eq(outcome.findings[1].code, "invalid_reference")
            test.eq(steps.get(h, id).item.values.peer.item, target)
        end)
    end)
end
return { run = test.run_cases(define) }
