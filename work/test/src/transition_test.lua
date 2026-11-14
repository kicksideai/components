-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Transitions: allowed moves, requirements, effects, auto chains, concurrency and idempotency.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local domain = require("domain")

type Map = { [string]: unknown }

local READ = 1

local function board(): fixture.Handle
    return fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
end

local function person(id: string): Map
    return { kind = "user", id = id }
end

-- task creates a task that satisfies the requirements of the first transitions.
local function task(h: fixture.Handle, extra: Map?): string
    local values: Map = { title = "Write the spec", estimate = 3, assignee = person("u1") }
    for k, v in pairs(extra or {}) do values[k] = v end
    return steps.create(h, "task", values)
end

local function move(h: fixture.Handle, id: string, transition: string, extra: Map?): Map
    local op: Map = { op = "transition", item = id, transition = transition }
    for k, v in pairs(extra or {}) do op[k] = v end
    return steps.one(h, op)
end

local function view(h: fixture.Handle, id: string): Map
    return (assert(steps.get(h, id)) :: Map).item :: Map
end

local function define()
    test.describe("pinned process definitions", function()
        test.it("executes and lists the definition recorded on the item", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.processes[1] = { id = "delivery", migration = "pin", initial = "open",
                states = { { id = "open", category = "started" }, { id = "done", category = "completed" } },
                transitions = { { id = "finish", from = { "open" }, to = "done", set = { { field = "title", value = "old" } } } } }
            local h = fixture.board({ declaration = d })
            local old = steps.create(h, "task")
            d.processes[1].transitions[1].id = "close"
            d.processes[1].transitions[1].set[1].value = "new"
            assert(h.call("apply_schema", { declaration = { processes = d.processes } }))
            local fresh = steps.create(h, "task")
            test.eq(assert(steps.get(h, old, { "transitions" })).transitions[1].id, "finish")
            test.eq(steps.one(h, { op = "transition", item = old, transition = "finish" }).status, "applied")
            test.eq(assert(steps.get(h, old)).item.values.title, "old")
            test.eq(steps.one(h, { op = "transition", item = fresh, transition = "close" }).status, "applied")
            test.eq(assert(steps.get(h, fresh)).item.values.title, "new")
        end)
    end)

    test.describe("actor effects", function()
        test.it("preserves group and service principals in actor effects", function()
            local schema = require("schema")
            local flow = require("flow")
            local compiled = assert(schema.compile(nil, fixture.workflow("ACT"), 1))
            local board = { model = schema.model(compiled), compiled = compiled } :: domain.Board
            local p = board.model.processes.delivery
            for _, kind in ipairs({ "group", "service" }) do
                local item = { item_id = "task", type = "task", state = "doing", category = "started", visit = 1,
                    version = 1, document = {}, process_generation = 1 } :: domain.Item
                local transition = assert(p.transitions[3])
                local event, err = flow.take(board, item, transition, {}, "principal:" .. kind .. ":worker", "2026-11-08T00:00:00.000000000Z", false, p, nil, function(_item: unknown, _where: unknown): (boolean, error?) return true, nil end)
                test.is_nil(err)
                test.not_nil(event)
                local closer = assert(board.model.fields.closer)
                local ref = assert(item.document[tostring(closer.id)]).p :: domain.Ref
                test.eq(ref.ref[1], "principal")
                test.eq(ref.ref[2], kind .. ":worker")
            end
        end)
    end)

    test.describe("initial entry requirements", function()
        test.it("requires fields on initial entry including inherited values", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.processes[1].states[1].require = { "priority" }
            d.item_types[3].fields[#d.item_types[3].fields + 1] = "priority"
            local h = fixture.board({ declaration = d })
            local out = steps.one(h, { op = "create", type = "story" })
            test.eq(out.status, "invalid")
            test.eq(out.findings[1].code, "required_field")
            local parent = steps.create(h, "epic", { priority = "p0" })
            test.not_nil(steps.create(h, "story", {}, parent))
        end)
    end)

    test.describe("automatic command budget", function()
        test.it("limits the complete command to eight automatic steps across items", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            local p = { id = "delivery", initial = "todo", states = { { id = "todo", category = "unstarted" } }, transitions = { { id = "start", from = { "todo" }, to = "s1" } } }
            for n = 1, 6 do
                p.states[#p.states + 1] = { id = "s" .. n, category = n == 6 and "completed" or "started" }
                if n < 6 then p.transitions[#p.transitions + 1] = { id = "step" .. n, from = { "s" .. n }, to = "s" .. (n + 1), auto = true, default = true } end
            end
            d.processes = { p }
            local h = fixture.board({ declaration = d })
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            local result = assert(steps.apply(h, { { op = "transition", item = a, transition = "start" }, { op = "transition", item = b, transition = "start" } }))
            test.is_false(result.applied)
            test.eq(result.outcomes[2].findings[1].code, "auto_chain_too_long")
            test.eq(view(h, a).state, "todo")
            test.eq(view(h, b).state, "todo")
        end)
    end)

    test.describe("creation", function()
        test.it("starts an item in the declared initial state with its category and first visit", function()
            local h = board()
            local item = view(h, task(h))
            test.eq(item.state, "todo")
            test.eq(item.category, "unstarted")
            test.eq(item.visit, 1)
            test.eq(item.version, 1)
        end)

        test.it("refuses a starting state other than the declared initial state", function()
            local h = board()
            local o = steps.one(h, { op = "create", type = "task", values = { title = "T" }, state = "doing" })
            test.eq(o.status, "invalid")
            test.eq(o.findings[1].code, "unknown_state")
        end)
    end)

    test.describe("transition", function()
        test.it("moves an item along a declared transition and updates state, category and visit", function()
            local h = board()
            local id = task(h)
            local o = move(h, id, "start")
            test.eq(o.status, "applied")
            test.eq(o.version, 2)
            local item = view(h, id)
            test.eq(item.state, "doing")
            test.eq(item.category, "started")
            test.eq(item.visit, 2)
            test.eq(item.version, 2)
            local page = assert(h.call("list_changes", {}))
            test.eq(page.items[1].state, "doing")
            test.eq(page.items[1].category, "started")
        end)

        test.it("refuses a transition that does not leave the current state", function()
            local h = board()
            local id = task(h)
            local o = move(h, id, "finish")
            test.eq(o.status, "invalid")
            test.eq(o.findings[1].code, "transition_not_allowed")
            test.eq(view(h, id).state, "todo")
            local unknown = move(h, id, "missing")
            test.eq(unknown.findings[1].code, "unknown_transition")
        end)

        test.it("allows a transition from any state", function()
            local h = board()
            local id = task(h)
            test.eq(move(h, id, "cancel").status, "applied")
            local item = view(h, id)
            test.eq(item.state, "canceled")
            test.eq(item.category, "canceled")
        end)

        test.it("refuses a transition when a required field is missing and accepts it with the field supplied", function()
            local h = board()
            local id = steps.create(h, "task", { title = "T", estimate = 2 })
            local o = move(h, id, "start")
            test.eq(o.status, "invalid")
            test.eq(o.findings[1].code, "required_field")
            test.eq(o.findings[1].field, "assignee")
            test.eq(view(h, id).state, "todo")
            local ok = move(h, id, "start", { values = { assignee = person("u2") } })
            test.eq(ok.status, "applied")
            test.eq(view(h, id).values.assignee.id, "u2")
        end)

        test.it("checks the requirements of the state it enters", function()
            local h = board()
            local id = steps.create(h, "task", { title = "T", assignee = person("u1") })
            test.eq(move(h, id, "start").status, "applied")
            local o = move(h, id, "to_review")
            test.eq(o.status, "invalid")
            test.eq(o.findings[1].field, "estimate")
            test.eq(move(h, id, "to_review", { values = { estimate = 5 } }).status, "applied")
            test.eq(view(h, id).state, "review")
        end)

        test.it("applies set effects: now, actor, copy, literal and clear", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            local started = view(h, id).values.started
            test.not_nil(started)
            move(h, id, "finish")
            local item = view(h, id)
            test.eq(item.state, "done")
            test.eq(item.category, "completed")
            test.not_nil(item.values.finished)
            test.eq(item.values.closer.kind, "user")
            test.eq(item.values.closer.id, h.actor:id())
            test.eq(item.values.snapshot, "Write the spec")
            test.eq(item.values.note, "shipped")
            move(h, id, "reopen")
            item = view(h, id)
            test.eq(item.state, "todo")
            test.is_nil(item.values.finished)
            move(h, id, "start")
            test.is_nil(view(h, id).values.closer)
        end)

        test.it("refuses a value for a field the transition sets", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            local o = move(h, id, "finish", { values = { note = "mine" } })
            test.eq(o.status, "invalid")
            test.eq(o.findings[1].code, "effect_field")
        end)

        test.it("records the transition in the change history and the event log", function()
            local h = board()
            local id = task(h)
            move(h, id, "start")
            local page = assert(h.call("list_history", { item = { id = id } }))
            local state_rows = {}
            for _, e in ipairs(page.entries) do
                if e.kind == "state" then state_rows[#state_rows + 1] = e end
            end
            test.eq(#state_rows, 1)
            test.eq(state_rows[1].before, "todo")
            test.eq(state_rows[1].after, "doing")
            local events = steps.events(h)
            local last = events[#events]
            test.eq(last.type, "kickside.work.events:item.transitioned")
            test.eq(last.body.transition, "start")
            test.eq(last.body.from, "todo")
            test.eq(last.body.to, "doing")
            test.eq(last.body.visit, 2)
            test.is_nil(last.body.auto)
        end)

        test.it("lists the transitions an item can take", function()
            local h = board()
            local id = task(h)
            local out = assert(steps.get(h, id, { "transitions" }))
            local ids = {}
            for _, t in ipairs(out.transitions) do ids[#ids + 1] = t.id end
            table.sort(ids)
            test.eq(table.concat(ids, ","), "cancel,start")
            local start
            for _, t in ipairs(out.transitions) do if t.id == "start" then start = t end end
            test.eq(start.to, "doing")
            test.eq(start.name, "Start")
            test.eq(start.require[1], "assignee")
        end)

        test.it("denies a caller that can only read", function()
            local h = board()
            local id = task(h)
            local reader, reader_id = fixture.user(h)
            assert(h.call("grant", { subject_id = reader_id, mask = READ }))
            local _, err = reader("apply", { ops = { { op = "transition", item = id, transition = "start" } } })
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(view(h, id).state, "todo")
        end)
    end)

    test.describe("auto transitions", function()
        test.it("lands an auto chain atomically with the command that entered it", function()
            local h = board()
            local o = steps.one(h, { op = "create", type = "short", values = { title = "Chain" } })
            test.eq(o.status, "applied")
            test.eq(o.version, 9)
            local item = view(h, o.item :: string)
            test.eq(item.state, "s8")
            test.eq(item.category, "completed")
            test.eq(item.visit, 9)
            test.eq(item.version, 9)
            local events = steps.events(h)
            local auto = 0
            for _, e in ipairs(events) do
                if e.type == "kickside.work.events:item.transitioned" then
                    test.is_true(e.body.auto)
                    auto = auto + 1
                end
            end
            test.eq(auto, 8)
        end)

        test.it("refuses the ninth auto step and names the chain", function()
            local h = board()
            local o = steps.one(h, { op = "create", type = "long", values = { title = "Chain" } })
            test.eq(o.status, "invalid")
            test.eq(o.findings[1].code, "auto_chain_too_long")
            test.is_true(o.findings[1].message:find("s0 -> s1 -> s2", 1, true) ~= nil)
            test.eq(#assert(h.call("list_changes", {})).items, 0)
        end)
    end)

    test.describe("concurrent transitions", function()
        test.it("accepts one of several transitions of the same version", function()
            local h = board()
            local id = task(h)
            local requests: { Map } = {}
            for i = 1, 5 do
                requests[i] = { ops = { { op = "transition", item = id, transition = i % 2 == 0 and "cancel" or "start", expect_version = 1 } } }
            end
            local applied, conflicts = 0, 0
            for _, r in ipairs(steps.parallel(h, requests)) do
                local o = r.outcomes[1]
                if o.status == "applied" then applied = applied + 1 end
                if o.status == "conflict" then conflicts = conflicts + 1 end
            end
            test.eq(applied, 1)
            test.eq(conflicts, 4)
            test.eq(steps.version(h, id), 2)
        end)

        test.it("re-prepares writers without a version and refuses the ones whose move is no longer open", function()
            local h = board()
            local id = task(h)
            local requests: { Map } = {}
            for i = 1, 4 do requests[i] = { ops = { { op = "transition", item = id, transition = "start" } } } end
            local applied, invalid = 0, 0
            for _, r in ipairs(steps.parallel(h, requests)) do
                local o = r.outcomes[1]
                if o.status == "applied" then applied = applied + 1 end
                if o.status == "invalid" then invalid = invalid + 1 end
            end
            test.eq(applied, 1)
            test.eq(invalid, 3)
            test.eq(view(h, id).state, "doing")
        end)

        test.it("lets transitions on different items proceed at once", function()
            local h = board()
            local ids: { string } = {}
            local requests: { Map } = {}
            for i = 1, 6 do
                ids[i] = task(h)
                requests[i] = { ops = { { op = "transition", item = ids[i], transition = "start", expect_version = 1 } } }
            end
            for i, r in ipairs(steps.parallel(h, requests)) do test.eq(r.outcomes[1].status, "applied", "writer " .. i) end
            for _, id in ipairs(ids) do test.eq(view(h, id).state, "doing") end
        end)
    end)

    test.describe("idempotency", function()
        test.it("returns the stored result for a retried keyed transition and refuses the key for another request", function()
            local h = board()
            local id = task(h)
            local request = { key = "move-1", ops = { { op = "transition", item = id, transition = "start" } } }
            local first = assert(h.call("apply", request))
            test.eq(first.outcomes[1].status, "applied")
            local again = assert(h.call("apply", request))
            test.is_true(again.replayed)
            test.eq(again.outcomes[1].version, 2)
            test.eq(steps.version(h, id), 2)
            local _, err = h.call("apply", { key = "move-1", ops = { { op = "transition", item = id, transition = "cancel" } } })
            test.not_nil(err)
            test.eq(err:details().code, "idempotency_conflict")
        end)
    end)
end

return { run = test.run_cases(define) }
