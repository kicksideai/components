-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema declaration: compile, plan, apply, field ids and refusals.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local json = require("json")

local READ, WRITE = 1, 2

local function minimal(prefix: string): { [string]: unknown }
    return {
        key_prefix = prefix,
        fields = { { code = "title", form = "text" } },
        item_types = { { id = "task", process = "flow", fields = { "title" } } },
        processes = { { id = "flow", initial = "open", states = { { id = "open", category = "unstarted" } } } },
    }
end

local function invalid_declaration(h: fixture.Handle, declaration: { [string]: unknown }, what: string)
    local _, err = h.call("plan_schema", { declaration = declaration })
    test.not_nil(err, what)
    test.eq(err:kind(), errors.INVALID, what)
end

local function define()
    test.describe("accepted index representations", function()
        test.it("returns historical plugin provenance from the selected generation", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } } }))
            for _, plugin in ipairs(assert(h.call("get_schema", { generation = 1 })).plugins) do test.eq(plugin.active, false) end
            local attached = assert(h.call("get_schema", { generation = 2 })).plugins[1].attachment_id
            assert(h.call("apply_schema", { declaration = { plugins = {} } }))
            local old = assert(h.call("get_schema", { generation = 2 }))
            test.eq(old.generation, 2)
            test.eq(old.plugins[1].plugin, "app:work_plugin")
            test.eq(old.plugins[1].attachment_id, attached)
        end)
        test.it("carries the schema event's causal trace into rebuild demand", function()
            local h = fixture.board()
            steps.create(h, "task")
            assert(h.call("apply_schema", { declaration = { fields = { { code = "traced", form = "text", index = "key" } } },
                trace_context = { trace_id = "schema-trace", run_id = "schema-run" } }))
            local event_id: string? = nil
            for _, event in ipairs(steps.events(h)) do if event.type == "kickside.work.events:schema.applied" then event_id = event.id end end
            local db = assert(store.open())
            local rows = assert(db:query("SELECT j.payload FROM kickside_job j JOIN kickside_work_job w ON w.job_id = CAST(j.id AS text) WHERE w.board_id = $1 AND w.job_type = 'reindex'", { h.id }))
            db:release()
            test.eq(#rows, 1)
            local payload = assert(json.decode(rows[1].payload))
            test.eq(payload.trace_context.trace_id, "schema-trace")
            test.eq(payload.trace_context.run_id, "schema-run")
            test.eq(payload.trace_context.caused_by_event_id, event_id)
        end)
        test.it("refuses malformed builtin field configuration", function()
            local h = fixture.board({ bare = true })
            for _, config in ipairs({ { scale = "bad" }, { scale = -1 }, { scale = 19 }, { range = { 10, 1 } } }) do
                local d = minimal(h.prefix)
                d.fields[1] = { code = "title", form = "dec", index = "number", config = config }
                local _, err = h.call("apply_schema", { declaration = d })
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "invalid_field_config")
            end
        end)
        test.it("validates nested record member forms cardinalities and reference targets", function()
            local h = fixture.board({ bare = true })
            for _, member in ipairs({ {}, { form = "unknown" }, { form = "text", cardinality = "bag" }, { form = "ref" } }) do
                local d = minimal(h.prefix)
                d.fields[1] = { code = "title", form = "record", config = { members = { entry = member } } }
                local _, err = h.call("apply_schema", { declaration = d })
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "invalid_field_config")
            end
        end)
        test.it("refuses a schema index that cannot represent stored values", function()
            local h = fixture.board()
            steps.create(h, "task", { title = string.rep("x", 257) })
            local _, err = h.call("apply_schema", { declaration = { fields = { { code = "title", form = "text", index = "key" } } } })
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(assert(h.call("get_schema", {})).generation, 1)
        end)
        test.it("keeps an explicit generation snapshot stable when app defaults change", function()
            local h = fixture.board()
            local original = assert(h.call("get_schema", { generation = 1 }))
            assert(h.call("set_setting", { namespace = "kickside.work", key = "trash_days", value = 43 }))
            local historical, err = h.call("get_schema", { generation = 1 })
            assert(h.call("unset_setting", { namespace = "kickside.work", key = "trash_days" }))
            test.is_nil(err)
            test.eq(historical.compiled.policy.trash_days, original.compiled.policy.trash_days)
            test.eq(historical.digest, original.digest)
        end)
        test.it("returns one generation's declaration compiled model and prefix together", function()
            local h = fixture.board()
            local original = assert(h.call("get_schema", { generation = 1 }))
            assert(h.call("apply_schema", { declaration = { key_prefix = fixture.fresh_prefix(), fields = { { code = "later", form = "text" } } } }))
            local old = assert(h.call("get_schema", { generation = 1 }))
            test.eq(old.generation, 1)
            test.eq(#old.compiled.fields, #original.compiled.fields)
            test.eq(old.compiled.key_prefix, original.compiled.key_prefix)
            test.eq(old.key_prefix, original.key_prefix)
            test.eq(old.digest, original.digest)
        end)
    end)

    test.describe("schema", function()
        test.it("applies the first generation and reads it back", function()
            local h = fixture.board()
            local view, err = h.call("get_schema", {})
            test.is_nil(err)
            test.eq(view.generation, 1)
            test.eq(view.key_prefix, h.prefix)
            test.eq(#view.compiled.fields, 6)
            test.eq(view.compiled.fields[1].code, "title")
            test.eq(view.compiled.fields[1].id, 1)
            test.eq(view.declaration.item_types[2].id, "story")
            test.is_true(view.as_of >= 1)
        end)

        test.it("returns an unchanged declaration without a new generation", function()
            local h = fixture.board()
            local again, err = h.call("apply_schema", { declaration = fixture.declaration(h.prefix) })
            test.is_nil(err)
            test.eq(again.class, "unchanged")
            test.eq(again.generation, 1)
            test.is_nil(again.seq)
            test.eq(h.call("get_schema", {}).generation, 1)
        end)

        test.it("keeps a field id across a rename", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Write the spec", estimate = 3 })
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[1] = { id = 1, code = "name", form = "text", track = true }
            for _, t in ipairs(declaration.item_types) do
                for i, f in ipairs(t.fields) do if f == "title" then t.fields[i] = "name" end end
            end
            local plan, perr = h.call("plan_schema", { declaration = declaration })
            test.is_nil(perr)
            test.eq(plan.class, "cosmetic")
            test.eq(plan.changes[1].what, "renamed from title")
            local applied, err = h.call("apply_schema", { declaration = declaration })
            test.is_nil(err, steps.detail(err))
            test.eq(applied.generation, 2)
            local view = h.call("get_schema", {})
            test.eq(view.compiled.fields[1].id, 1)
            test.eq(view.compiled.fields[1].code, "name")
            local item = steps.get(h, id)
            test.eq(item.item.values.name, "Write the spec")
            test.eq(item.item.values.estimate, 3)
            test.eq(h.call("get_schema", { generation = 1 }).declaration.fields[1].code, "title")
        end)

        test.it("hands out new field ids after the last one and never reuses a removed id", function()
            local h = fixture.board({ bare = false })
            local declaration = fixture.declaration(h.prefix)
            local removed = declaration.fields[2]
            table.remove(declaration.fields, 2)
            for _, t in ipairs(declaration.item_types) do
                for i = #t.fields, 1, -1 do if t.fields[i] == "estimate" then table.remove(t.fields, i) end end
                if t.inherit then t.inherit = nil end
            end
            declaration.remove = { fields = { "estimate" } }
            test.eq(removed.code, "estimate")
            local removal = assert(h.call("apply_schema", { declaration = declaration }))
            test.eq(removal.class, "semantic")
            declaration.remove = nil
            declaration.fields[#declaration.fields + 1] = { code = "effort", form = "int" }
            assert(h.call("apply_schema", { declaration = declaration }))
            local fields = h.call("get_schema", {}).compiled.fields
            test.eq(fields[#fields].code, "effort")
            test.eq(fields[#fields].id, 7)
        end)

        test.it("classifies additions, labels and structural changes", function()
            local h = fixture.board()
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[#declaration.fields + 1] = { code = "reviewer", type = "principal" }
            test.eq(h.call("plan_schema", { declaration = declaration }).class, "additive")
            declaration = fixture.declaration(h.prefix)
            declaration.item_types[1].title = "Initiative"
            test.eq(h.call("plan_schema", { declaration = declaration }).class, "cosmetic")
            declaration = fixture.declaration(h.prefix)
            declaration.item_types[2].parent_types = {}
            test.eq(h.call("plan_schema", { declaration = declaration }).class, "semantic")
            declaration = fixture.declaration(h.prefix)
            declaration.fields[5].options[1].label = "Critical"
            test.eq(h.call("plan_schema", { declaration = declaration }).class, "cosmetic")
            declaration.fields[5].options[#declaration.fields[5].options + 1] = { id = "p2", label = "Medium", order = 5 }
            test.eq(h.call("plan_schema", { declaration = declaration }).class, "additive")
        end)

        test.it("plans without applying", function()
            local h = fixture.board()
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[#declaration.fields + 1] = { code = "reviewer", type = "principal" }
            local plan = assert(h.call("plan_schema", { declaration = declaration }))
            test.eq(plan.generation, 2)
            test.eq(h.call("get_schema", {}).generation, 1)
        end)

        test.it("refuses changes that reinterpret stored values and says how to migrate", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "A", estimate = 3 })
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[2] = { id = 2, code = "estimate", form = "dec" }
            local plan = assert(h.call("plan_schema", { declaration = declaration }))
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].what, "form")
            test.not_nil(plan.migration)
            local _, err = h.call("apply_schema", { declaration = declaration })
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "migration_required")
            test.eq(h.call("get_schema", {}).generation, 1)
        end)

        test.it("refuses removing what the board holds and allows it on an empty board", function()
            local h = fixture.board()
            local empty = fixture.board()
            local declaration = fixture.declaration(h.prefix)
            table.remove(declaration.item_types :: { unknown }, 3)
            declaration.remove = { item_types = { "task" } }
            test.eq(h.call("plan_schema", { declaration = declaration }).class, "semantic")
            steps.create(h, "task", { title = "A" })
            test.eq(h.call("plan_schema", { declaration = declaration }).class, "refused")
            steps.create(h, "story", { title = "Option holder", priority = "p4" })
            local clean = fixture.declaration(h.prefix)
            clean.fields[5].options = { clean.fields[5].options[1] }
            test.eq(h.call("plan_schema", { declaration = clean }).refused[1].what, "options.remove")
            local other = fixture.declaration(empty.prefix)
            other.fields[5].options = { other.fields[5].options[1] }
            test.eq(empty.call("plan_schema", { declaration = other }).class, "semantic")
        end)

        test.it("refuses a stale expected generation", function()
            local h = fixture.board()
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[#declaration.fields + 1] = { code = "reviewer", type = "principal" }
            local _, err = h.call("apply_schema", { declaration = declaration, expected_generation = 5 })
            test.not_nil(err)
            test.eq(err:kind(), errors.CONFLICT)
            test.eq(err:details().generation, 1)
            local ok, aerr = h.call("apply_schema", { declaration = declaration, expected_generation = 1 })
            test.is_nil(aerr)
            test.eq(ok.generation, 2)
        end)

        test.it("refuses declarations that do not mean anything", function()
            local h = fixture.board({ bare = true })
            local p = fixture.fresh_prefix()
            invalid_declaration(h, { key_prefix = "a", item_types = {} }, "lowercase prefix")
            invalid_declaration(h, { key_prefix = "X", item_types = {} }, "short prefix")
            invalid_declaration(h, { key_prefix = "ABCDEFGHIJK" }, "long prefix")
            local d = minimal(p)
            d.fields[#d.fields + 1] = { code = "r", type = "rollup" }
            invalid_declaration(h, d, "deferred kind")
            d = minimal(p)
            d.fields[#d.fields + 1] = { code = "title", form = "text" }
            invalid_declaration(h, d, "duplicate field")
            d = minimal(p)
            d.fields[#d.fields + 1] = { code = "pick", type = "option" }
            invalid_declaration(h, d, "option without options")
            d = minimal(p)
            d.fields[#d.fields + 1] = { code = "n", form = "ref" }
            invalid_declaration(h, d, "reference without target")
            d = minimal(p)
            d.fields[#d.fields + 1] = { code = "n", form = "blob" }
            invalid_declaration(h, d, "unknown form")
            d = minimal(p)
            d.item_types[1].process = "missing"
            invalid_declaration(h, d, "unknown process")
            d = minimal(p)
            d.item_types[1].fields = { "missing" }
            invalid_declaration(h, d, "unknown field")
            d = minimal(p)
            d.item_types[1].parent_types = { "missing" }
            invalid_declaration(h, d, "unknown parent type")
            d = minimal(p)
            d.processes[1].states[2] = { id = "open", category = "completed" }
            invalid_declaration(h, d, "duplicate state")
            d = minimal(p)
            d.processes[1].states[1].category = "doing"
            invalid_declaration(h, d, "unknown category")
            d = minimal(p)
            d.fields[#d.fields + 1] = { code = "a", type = "counter" }
            d.fields[#d.fields + 1] = { code = "b", type = "counter" }
            invalid_declaration(h, d, "two counters")
            d = minimal(p)
            d.fields[#d.fields + 1] = { code = "n", form = "int", index = "bogus" }
            invalid_declaration(h, d, "unknown index")
            d = minimal(p)
            d.fields[#d.fields + 1] = { code = "t", form = "text", index = "number" }
            invalid_declaration(h, d, "number index on text")
            d = minimal(p)
            d.fields[#d.fields + 1] = { id = 99, code = "ghost", form = "text" }
            invalid_declaration(h, d, "unknown field id")
            d = minimal(p)
            d.relation_types = { { id = "r", cardinality = "few" } }
            invalid_declaration(h, d, "unknown relation cardinality")
        end)

        test.it("keeps a key prefix unique across boards", function()
            local first = fixture.board()
            local second = fixture.board({ bare = true })
            local _, err = second.call("apply_schema", { declaration = minimal(first.prefix) })
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "key_prefix_taken")
            local ok, aerr = second.call("apply_schema", { declaration = minimal(fixture.fresh_prefix()) })
            test.is_nil(aerr)
            test.eq(ok.generation, 1)
        end)

        test.it("needs admin access", function()
            local h = fixture.board()
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[#declaration.fields + 1] = { code = "reviewer", type = "principal" }
            local reader, reader_id = fixture.user(h)
            assert(h.call("grant", { subject_id = reader_id, mask = READ }))
            local _, e1 = reader("plan_schema", { declaration = declaration })
            test.not_nil(e1)
            local writer, writer_id = fixture.user(h)
            assert(h.call("grant", { subject_id = writer_id, mask = READ + WRITE }))
            local _, e2 = writer("apply_schema", { declaration = declaration })
            test.not_nil(e2)
            test.eq(e2:kind(), errors.PERMISSION_DENIED)
            test.eq(h.call("get_schema", {}).generation, 1)
        end)

        test.it("replays a keyed schema apply and refuses the key for another declaration", function()
            local h = fixture.board()
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[#declaration.fields + 1] = { code = "reviewer", type = "principal" }
            local first = assert(h.call("apply_schema", { declaration = declaration, key = "k1" }))
            test.eq(first.generation, 2)
            local again = assert(h.call("apply_schema", { declaration = declaration, key = "k1" }))
            test.is_true(again.replayed)
            test.eq(again.generation, 2)
            test.eq(again.seq, first.seq)
            declaration.fields[#declaration.fields + 1] = { code = "watcher", type = "principal" }
            local _, err = h.call("apply_schema", { declaration = declaration, key = "k1" })
            test.not_nil(err)
            test.eq(err:details().code, "idempotency_conflict")
            test.eq(h.call("get_schema", {}).generation, 2)
        end)
    end)
end

return { run = test.run_cases(define) }
