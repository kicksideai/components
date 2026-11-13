-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Process compile: states, categories, transitions and the refusals that keep a process well formed.
local test = require("test")
local fixture = require("fixture")

type Map = { [string]: unknown }

local function flow(prefix: string): Map
    return {
        key_prefix = prefix,
        fields = { { code = "title", form = "text" }, { code = "owner", type = "principal" } },
        item_types = { { id = "task", process = "flow", fields = { "title", "owner" } } },
        processes = { {
            id = "flow", initial = "todo",
            states = { { id = "todo", category = "unstarted" }, { id = "doing", category = "started" }, { id = "done", category = "completed" } },
            transitions = {
                { id = "start", from = { "todo" }, to = "doing" },
                { id = "finish", from = { "doing" }, to = "done" },
            },
        } },
    }
end

local function process_of(d: Map): Map
    local list = d.processes :: { Map }
    return assert(list[1])
end

local function refused(h: fixture.Handle, d: Map, what: string, code: string?)
    local _, err = h.call("plan_schema", { declaration = d })
    test.not_nil(err, what)
    test.eq(err:kind(), errors.INVALID, what)
    if code then test.eq(err:details().code, code, what) end
end

local function define()
    test.describe("process compile", function()
        test.it("defaults human entry to follow and automated or parallel entry to pin", function()
            for _, kind in ipairs({ "human", "automated", "parallel" }) do
                local h = fixture.board({ bare = true })
                local d = flow(h.prefix)
                local p = process_of(d)
                p.states[1].kind = kind
                if kind == "automated" then p.states[1].run = { stage = "build" } end
                if kind == "parallel" then p.states[1].regions = { { id = "qa", initial = "doing" } }; p.states[1].join = "all" end
                assert(h.call("apply_schema", { declaration = d }))
                test.eq(assert(h.call("get_schema", {})).compiled.processes[1].migration, kind == "human" and "follow" or "pin")
            end
        end)

        test.it("compiles states, transitions and the initial state", function()
            local h = fixture.board({ bare = true })
            local out, err = h.call("apply_schema", { declaration = flow(h.prefix) })
            test.is_nil(err)
            test.eq(out.generation, 1)
            local view = assert(h.call("get_schema", {}))
            local p = view.compiled.processes[1]
            test.eq(p.initial, "todo")
            test.eq(#p.states, 3)
            test.eq(p.states[1].kind, "human")
            test.eq(#p.transitions, 2)
            test.eq(p.transitions[1].id, "start")
            test.eq(p.transitions[1].name, "start")
            test.eq(p.transitions[1].to, "doing")
            test.eq(p.migration, "follow")
        end)

        test.it("refuses transitions and states that name unknown states", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).transitions[1].to = "missing"
            refused(h, d, "unknown to")
            d = flow(h.prefix)
            process_of(d).transitions[1].from = { "missing" }
            refused(h, d, "unknown from")
            d = flow(h.prefix)
            process_of(d).initial = "missing"
            refused(h, d, "unknown initial")
        end)

        test.it("refuses a category outside the closed set", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).states[2].category = "doing"
            refused(h, d, "category")
        end)

        test.it("refuses a process without an initial state", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).initial = nil
            refused(h, d, "no initial")
        end)

        test.it("refuses duplicate state and transition ids", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).states[3].id = "doing"
            refused(h, d, "duplicate state")
            d = flow(h.prefix)
            process_of(d).transitions[2].id = "start"
            refused(h, d, "duplicate transition")
        end)

        test.it("refuses an auto cycle that makes no progress", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            local p = process_of(d)
            p.transitions[1] = { id = "a", from = { "todo" }, to = "doing", auto = true, default = true }
            p.transitions[2] = { id = "b", from = { "doing" }, to = "todo", auto = true, default = true }
            refused(h, d, "two state cycle", "process_auto_cycle")
            d = flow(h.prefix)
            process_of(d).transitions[1] = { id = "a", from = { "todo" }, to = "todo", auto = true, default = true }
            refused(h, d, "self loop", "process_auto_cycle")
            d = flow(h.prefix)
            process_of(d).transitions[1] = { id = "a", from = "any", to = "doing", auto = true, default = true }
            refused(h, d, "auto from any state", "process_auto_cycle")
        end)

        test.it("refuses an unconditional automatic cycle even when it writes a field", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).transitions[1] = { id = "loop", from = { "todo" }, to = "todo", auto = true, default = true, set = { { field = "title", value = "same" } } }
            refused(h, d, "unconditional effect cycle", "process_auto_cycle")
        end)

        test.it("accepts an automatic cycle separated by a declared wait", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            local p = process_of(d)
            p.states[1] = { id = "todo", kind = "gate", category = "unstarted", release_when = { wait = "PT1S" } }
            p.transitions[1] = { id = "release", from = { "todo" }, to = "doing", auto = true, default = true }
            p.transitions[2] = { id = "again", from = { "doing" }, to = "todo", auto = true, default = true }
            assert(h.call("plan_schema", { declaration = d }))
        end)

        test.it("refuses duplicate defaults and accepts an unconditional automatic transition", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            local p = process_of(d)
            p.transitions[1] = { id = "a", from = { "todo" }, to = "doing", auto = true, default = true }
            p.transitions[2] = { id = "b", from = { "todo" }, to = "done", auto = true, default = true }
            refused(h, d, "two defaults")
            d = flow(h.prefix)
            process_of(d).transitions[1] = { id = "a", from = { "todo" }, to = "doing", auto = true }
            assert(h.call("plan_schema", { declaration = d }))
            d = flow(h.prefix)
            process_of(d).transitions[1].default = true
            refused(h, d, "default on a named transition")
        end)

        test.it("accepts core gate, automated, parallel, due and timer declarations", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            local p = process_of(d)
            p.states = {
                { id = "todo", category = "unstarted", due = "PT1H", timers = {
                    { id = "sla", after = "PT1H", interrupting = true, ["then"] = { transition = "start" } },
                } },
                { id = "doing", category = "started", kind = "automated",
                  run = { stage = "build", retry = { max = 2, backoff = "PT1M" }, on_fail = "failed" } },
                { id = "review", category = "started", kind = "gate", release_when = {
                    approvals = { min = 1, from = { { kind = "user", id = h.actor:id() } }, prevent_self = true }, wait = "PT1M",
                } },
                { id = "fan", category = "started", kind = "parallel", regions = { { id = "qa", initial = "todo" } }, join = "all" },
                { id = "done", category = "completed" },
            }
            p.transitions = {
                { id = "start", from = { "todo" }, to = "doing" },
                { id = "passed", from = { "doing" }, to = "review" },
                { id = "failed", from = { "doing" }, to = "done" },
                { id = "release", from = { "review" }, to = "done", auto = true, default = true },
                { id = "reject", from = { "review" }, to = "todo" },
            }
            local out, err = h.call("apply_schema", { declaration = d })
            test.is_nil(err)
            test.eq(out.generation, 1)
            local compiled = assert(h.call("get_schema", {})).compiled.processes[1]
            test.eq(compiled.states[2].kind, "automated")
            test.eq(compiled.states[3].release_when.approvals.min, 1)
            test.eq(compiled.states[4].join, "all")
        end)

        test.it("refuses unindexed predicates and undeclared plugin guards", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).transitions[1].when = { field = "title", op = "eq", value = "x" }
            refused(h, d, "unindexed when")
            d = flow(h.prefix)
            process_of(d).transitions[1].guards = { "acme.qa:window" }
            refused(h, d, "guards", "plugin_seam_unowned")
        end)

        test.it("refuses processes past the state and transition limits", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            local p = process_of(d)
            for i = 1, 61 do p.states[#p.states + 1] = { id = "s" .. i, category = "started" } end
            local _, ok = h.call("plan_schema", { declaration = d })
            test.is_nil(ok, "64 states are allowed")
            p.states[#p.states + 1] = { id = "extra", category = "started" }
            refused(h, d, "65 states", "process_limit")
            d = flow(h.prefix)
            p = process_of(d)
            p.transitions = {}
            for i = 1, 257 do p.transitions[i] = { id = "t" .. i, from = "any", to = "doing" } end
            refused(h, d, "257 transitions", "process_limit")
        end)

        test.it("refuses effects and requirements over unknown or uncarried fields", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).transitions[1].require = { "missing" }
            refused(h, d, "unknown required field")
            d = flow(h.prefix)
            process_of(d).transitions[1].set = { { field = "missing", value = "x" } }
            refused(h, d, "unknown effect field")
            d = flow(h.prefix)
            process_of(d).states[2].require = { "missing" }
            refused(h, d, "unknown state requirement")
            d = flow(h.prefix)
            d.item_types[1].fields = { "title" }
            process_of(d).transitions[1].require = { "owner" }
            refused(h, d, "required field the item type does not carry")
            d = flow(h.prefix)
            process_of(d).transitions[1].set = { { field = "title", value = "$actor" } }
            refused(h, d, "$actor on a text field")
            d = flow(h.prefix)
            process_of(d).transitions[1].set = { { field = "title", value = 5 } }
            refused(h, d, "literal of the wrong form")
            d = flow(h.prefix)
            process_of(d).transitions[1].set = { { field = "title", copy = "owner" } }
            refused(h, d, "copy between different kinds")
        end)

        test.it("refuses a state map that names a state the process still declares", function()
            local h = fixture.board({ bare = true })
            local d = flow(h.prefix)
            process_of(d).map = { doing = "done" }
            refused(h, d, "map of a declared state")
            d = flow(h.prefix)
            process_of(d).map = { gone = "missing" }
            refused(h, d, "map to an unknown state")
        end)
    end)
end

return { run = test.run_cases(define) }
