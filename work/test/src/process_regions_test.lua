-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local registry = require("registry")
local json = require("json")
local shape = require("shape")

type Map = { [string]: unknown }

local function definition(): Map
    return { key_prefix = fixture.fresh_prefix(), fields = { { code = "owner", type = "principal" } },
        item_types = { { id = "task", process = "flow", fields = { "owner" } } },
        processes = { { id = "flow", initial = "todo", states = {
            { id = "todo", category = "unstarted" },
            { id = "parallel", category = "started", kind = "parallel", join = "all", regions = {
                { id = "qa", initial = "review" }, { id = "security", initial = "review" },
            } },
            { id = "review", category = "started" }, { id = "done", category = "completed" },
            { id = "canceled", category = "canceled" },
        }, transitions = {
            { id = "start", from = { "todo" }, to = "parallel" },
            { id = "pass", from = { "review" }, to = "done" },
            { id = "cancel", from = { "review" }, to = "canceled" },
        } } } }
end

local function view(h: fixture.Handle, id: string): Map
    return assert(steps.get(h, id)).item :: Map
end

local function define()
    test.describe("regional follow migration", function()
        test.it("admits a regional transition against its regional state", function()
            local d = definition()
            d.processes[1].transitions[2].when = { field = "state", op = "eq", value = "review" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            test.eq(steps.one(h, { op = "transition", item = id, transition = "start" }).status, "applied")
            local offered = steps.get(h, id, { "transitions" }).transitions
            local found = false
            for _, transition in ipairs(offered) do
                if transition.id == "pass" and transition.region == "qa" then found = true end
            end
            test.is_true(found)
            test.eq(steps.one(h, { op = "transition", item = id, transition = "pass", region = "qa" }).status, "applied")
            test.eq(view(h, id).state.qa, "done")
            test.eq(view(h, id).state.security, "review")
        end)
        test.it("refuses removing a held regional state without its map and counts items once", function()
            local d = definition()
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            d.processes[1].states[3].id = "inspect"
            for _, region in ipairs(d.processes[1].states[2].regions) do region.initial = "inspect" end
            d.processes[1].transitions[2].from = { "inspect" }
            d.processes[1].transitions[3].from = { "inspect" }
            local plan = assert(h.call("plan_schema", { declaration = d }))
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].detail, "review")
            test.eq(plan.refused[1].count, 1)
            d.processes[1].map = { review = "inspect" }
            plan = assert(h.call("plan_schema", { declaration = d }))
            test.eq(plan.class, "semantic")
            local count = nil
            for _, change in ipairs(plan.changes) do if change.what == "state.map" then count = change.count end end
            test.eq(count, 1)
        end)

        test.it("maps active regional states into their new generation and enters their stages", function()
            local d = definition()
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            local p = d.processes[1]
            p.states[3] = { id = "build", category = "started", kind = "automated", run = { stage = "verify" } }
            for _, region in ipairs(p.states[2].regions) do region.initial = "build" end
            p.transitions[2] = { id = "passed", from = { "build" }, to = "done" }
            p.transitions[3].from = { "build" }
            p.map = { review = "build" }
            assert(h.call("apply_schema", { declaration = d }))
            local migrated = nil
            steps.wait_for("regional migration event", function()
                for _, event in ipairs(steps.events(h)) do
                    if event.type == "kickside.work.events:item.migrated" then migrated = event end
                end
                return migrated ~= nil or assert(h.call("get_schema", {})).migration_error ~= nil
            end)
            test.not_nil(migrated)
            test.eq(migrated.body.state_map.review, "build")
            steps.wait_for("regional migration projection", function() return view(h, id).process_generation == 2 end)
            test.eq(view(h, id).state.qa, "build")
            test.eq(view(h, id).state.security, "build")
            local entries = {}
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:stage.entered" then entries[#entries + 1] = event.body end
            end
            test.eq(#entries, 2)
            for _, entry in ipairs(entries) do
                test.eq(assert(h.call("report", { item = id, visit = entry.visit, attempt = 1, outcome = "passed" })).outcomes[1].status, "applied")
            end
            test.eq(view(h, id).category, "completed")
        end)
    end)

    test.describe("parallel state entry", function()
        test.it("enforces regional WIP per live item and releases capacity after its last region leaves", function()
            local d = definition()
            d.policy = { wip = { review = { limit = 1, hard = true } } }
            local h = fixture.board({ declaration = d })
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            test.eq(steps.one(h, { op = "transition", item = a, transition = "start" }).status, "applied")
            local refused = steps.one(h, { op = "transition", item = b, transition = "start" })
            test.eq(refused.status, "invalid")
            test.eq(refused.findings[1].code, "wip_limit")
            steps.one(h, { op = "transition", item = a, region = "qa", transition = "pass" })
            test.eq(steps.one(h, { op = "transition", item = b, transition = "start" }).status, "invalid")
            steps.one(h, { op = "transition", item = a, region = "security", transition = "pass" })
            test.eq(steps.one(h, { op = "transition", item = b, transition = "start" }).status, "applied")
        end)

        test.it("returns the complete regional state in schema-valid change feeds", function()
            local h = fixture.board({ declaration = definition() })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            local reply = assert(h.call("list_changes", {}))
            test.eq(reply.items[1].state.qa, "review")
            test.eq(reply.items[1].state.security, "review")
            local entry = assert(registry.get("kickside.work:board"))
            local schema = nil
            for _, method in ipairs(entry.data.methods) do
                if method.name == "list_changes" then schema = assert(json.decode(method.output_schemas[1].definition)) end
            end
            test.not_nil(schema)
            local err = shape.check(shape.tolerant(schema), reply, "parallel change feed")
            test.is_nil(err, steps.detail(err))
        end)

        test.it("lists named transitions for each active region on the recorded process generation", function()
            local d = definition()
            d.processes[1].migration = "pin"
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            d.processes[1].transitions[2].id = "approved"
            assert(h.call("apply_schema", { declaration = { processes = d.processes } }))
            local transitions = assert(steps.get(h, id, { "transitions" })).transitions
            test.eq(#transitions, 4)
            for _, transition in ipairs(transitions) do
                test.is_true(transition.region == "qa" or transition.region == "security")
                test.is_true(transition.id == "pass" or transition.id == "cancel")
            end
            steps.one(h, { op = "transition", item = id, transition = "pass", region = "qa" })
            transitions = assert(steps.get(h, id, { "transitions" })).transitions
            test.eq(#transitions, 2)
            for _, transition in ipairs(transitions) do test.eq(transition.region, "security") end
        end)

        test.it("lists only rejection for a waiting gate and ordinary named exits for an automated stage", function()
            for _, kind in ipairs({ "gate", "automated" }) do
                local d = definition()
                d.processes[1].states[2] = { id = "parallel", category = "started", kind = kind,
                    release_when = kind == "gate" and { wait = "P1D" } or nil,
                    run = kind == "automated" and { stage = "verify" } or nil }
                d.processes[1].transitions[2] = { id = "passed", from = { "parallel" }, to = "done" }
                d.processes[1].transitions[3] = { id = "reject", from = { "parallel" }, to = "canceled" }
                local h = fixture.board({ declaration = d })
                local id = steps.create(h, "task")
                steps.one(h, { op = "transition", item = id, transition = "start" })
                local transitions = assert(steps.get(h, id, { "transitions" })).transitions
                test.eq(#transitions, kind == "gate" and 1 or 2)
                if kind == "gate" then test.eq(transitions[1].id, "reject")
                else test.eq(transitions[1].id, "passed"); test.eq(transitions[2].id, "reject") end
            end
        end)

        test.it("checks every region initial state's entry requirements before accepting entry", function()
            local d = definition()
            d.processes[1].states[3].require = { "owner" }
            local h = fixture.board({ declaration = d })
            local id = steps.create(h, "task")
            local refused = steps.one(h, { op = "transition", item = id, transition = "start" })
            test.eq(refused.status, "invalid")
            test.eq(refused.findings[1].code, "required_field")
            test.eq(view(h, id).state, "todo")
            test.eq(steps.one(h, { op = "transition", item = id, transition = "start", values = {
                owner = { kind = "user", id = h.actor:id() },
            } }).status, "applied")
            test.eq(view(h, id).state.qa, "review")
        end)

        test.it("uses terminal regional categories immediately on creation and entry", function()
            for _, initial in ipairs({ true, false }) do
                for _, terminal in ipairs({ "done", "canceled" }) do
                    local d = definition()
                    if initial then d.processes[1].initial = "parallel" end
                    d.processes[1].states[2].regions[1].initial = "done"
                    d.processes[1].states[2].regions[2].initial = terminal
                    local h = fixture.board({ declaration = d })
                    local id = steps.create(h, "task")
                    if not initial then steps.one(h, { op = "transition", item = id, transition = "start" }) end
                    test.eq(view(h, id).category, terminal == "done" and "completed" or "canceled")
                end
            end
        end)

        test.it("records the effective category history when the last region finishes", function()
            local h = fixture.board({ declaration = definition() })
            local id = steps.create(h, "task")
            steps.one(h, { op = "transition", item = id, transition = "start" })
            steps.one(h, { op = "transition", item = id, transition = "pass", region = "qa" })
            test.eq(view(h, id).category, "started")
            steps.one(h, { op = "transition", item = id, transition = "cancel", region = "security" })
            test.eq(view(h, id).category, "canceled")
            local page = assert(h.call("query", { where = { history = { field = "category", was = "canceled" } } }))
            test.eq(#page.items, 1)
            test.eq(page.items[1].id, id)
            local intervals = assert(h.call("get_time_in_state", { item = { id = id }, field = "category" }))
            local current = false
            for _, interval in ipairs(intervals.periods) do
                if interval.field == "category" and interval.value == "canceled" and not interval.ended_at then current = true end
            end
            test.is_true(current)
        end)
    end)
end

return { run = test.run_cases(define) }
