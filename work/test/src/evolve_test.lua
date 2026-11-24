-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema evolution through the public plan and apply methods.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local rows = require("rows")
local clock = require("clock")
local json = require("json")
local store = require("store")
local materializer = require("materializer")
local domain = require("domain")

type Map = { [string]: unknown }

local function usage(h: fixture.Handle, id: integer): integer
    return rows.scalar("SELECT COALESCE(SUM(items), 0) AS n FROM kickside_work_field_usage WHERE board_id = $1 AND field_id = $2", { h.id, id })
end

local function define()
    test.describe("evolve", function()
        test.it("does not count a permanently purged item as holding a schema member", function()
            local h = fixture.board()
            local id = steps.create(h, "task")
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            local request = { declaration = { remove = { item_types = { "task" } } } }
            test.eq(assert(h.call("plan_schema", request)).class, "refused", "trashed items can be restored")
            assert(h.call("trusted_append", { thread_id = h.id, events = {
                { type = "kickside.work.events:item.purged", subject = "i:" .. id,
                    body = { item = id, actor = "system:kickside.work.retention", at = clock.now(), source = "retention" } },
            } }))
            assert(h.call("settle", {}))
            test.eq(steps.count_rows("kickside_work_item", h.id, " AND life = 'purged'"), 1)

            local plan, err = h.call("plan_schema", request)
            local result = assert(plan, steps.detail(err)) :: Map
            test.eq(result.class, "semantic", json.encode(result.refused))
            test.eq(assert(h.call("apply_schema", request)).generation, 2)
        end)
        test.it("excludes a retained purged item from item-type usage", function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.policy = { trash_days = 0, tombstone_days = 30 }
            local board = fixture.board({ declaration = declaration })
            local item = steps.create(board, "task", { estimate = 1 })
            steps.one(board, { op = "delete", item = item })
            steps.retention_sweep(function(): boolean
                assert(board.call("settle", {}))
                return steps.count_rows("kickside_work_item", board.id, " AND life = 'purged' AND purge_pending = 0") == 1
            end)
            local next_declaration = fixture.declaration(board.prefix)
            table.remove(next_declaration.item_types :: { unknown }, 3)
            next_declaration.remove = { item_types = { "task" } }
            local plan = assert(board.call("plan_schema", { declaration = next_declaration }))
            test.eq(#plan.refused, 0)
        end)
        test.it("classifies a numeric option order edit as a semantic index change", function()
            local h = fixture.board()
            steps.create(h, "story", { priority = "p0" })
            local priority = (fixture.declaration(h.prefix).fields :: { Map })[5]
            local options = priority.options :: { Map }
            options[1].order = 10
            local request = { declaration = { fields = { priority } } }
            local plan = assert(h.call("plan_schema", request))
            local applied = assert(h.call("apply_schema", request))
            local reindexes = steps.count_rows("kickside_work_job", h.id, " AND job_type = 'reindex'")
            test.eq(plan.class, "semantic", json.encode({ apply_class = applied.class, reindex_jobs = reindexes }))
            test.eq(applied.class, "semantic")
            test.is_true(reindexes > 0)
            options[1].label = "Immediate"
            test.eq(assert(h.call("plan_schema", request)).class, "cosmetic")
            test.eq(assert(h.call("apply_schema", request)).class, "cosmetic")
        end)

        test.it("retains a state held by trash and permits removal after purge", function()
            local h = fixture.board()
            local item = steps.create(h, "task")
            assert(h.call("apply_schema", { declaration = { processes = { { id = "delivery", initial = "open",
                states = { { id = "open", category = "started" }, { id = "ready", category = "started" } },
            } } } }))
            test.eq(steps.one(h, { op = "delete", item = item }).status, "applied")
            local request = { declaration = { processes = { { id = "delivery", initial = "ready",
                states = { { id = "ready", category = "started" } },
            } } } }
            test.eq(assert(h.call("plan_schema", request)).class, "refused")
            assert(h.call("trusted_append", { thread_id = h.id, events = {
                { type = "kickside.work.events:item.purged", subject = "i:" .. item,
                    body = { item = item, actor = "system:kickside.work.retention", at = clock.now(), source = "retention" } },
            } }))
            assert(h.call("settle", {}))
            test.eq(assert(h.call("plan_schema", request)).class, "semantic")
            test.eq(assert(h.call("apply_schema", request)).class, "semantic")
        end)

        test.it("preserves a relation through relabeling and refuses shape changes while linked", function()
            local h = fixture.board()
            local from = steps.create(h, "task")
            local to = steps.create(h, "task")
            test.eq(steps.one(h, { op = "link", item = from, type = "blocks", target = { item = to } }).status, "applied")
            local label = { declaration = { relation_types = { { id = "blocks", outward = "waits on", inward = "unblocks" } } } }
            test.eq(assert(h.call("apply_schema", label)).class, "cosmetic")
            test.eq(assert(steps.get(h, from, { "links" })).links[1].item, to)
            local requests = {
                { declaration = { relation_types = { { id = "blocks", cardinality = "one" } } } },
                { declaration = { relation_types = { { id = "blocks", symmetric = true } } } },
                { declaration = { remove = { relation_types = { "blocks" } } } },
            }
            for _, request in ipairs(requests) do
                test.eq(assert(h.call("plan_schema", request)).class, "refused")
            end
            test.eq(steps.one(h, { op = "unlink", item = from, type = "blocks", target = { item = to } }).status, "applied")
            for _, request in ipairs(requests) do
                test.eq(assert(h.call("plan_schema", request)).class, "semantic")
            end
        end)
        test.it("classifies the first schema as initial with an empty change list", function()
            local h = fixture.board({ bare = true })
            local d = fixture.declaration(h.prefix)
            local plan = assert(h.call("plan_schema", { declaration = d }))
            test.eq(plan.class, "initial")
            test.eq(#plan.changes, 0)
            local applied = assert(h.call("apply_schema", { declaration = d }))
            test.eq(applied.class, "initial")
            test.eq(#applied.changes, 0)
        end)

        test.it("merges a partial field declaration and stamps the effective schema", function()
            local h = fixture.board()
            local request = { fields = { { code = "title", form = "text", track = true, intervals = true } } }
            local plan = assert(h.call("plan_schema", { declaration = request }))
            test.eq(plan.class, "semantic")
            assert(h.call("apply_schema", { declaration = request }))
            local view = assert(h.call("get_schema", {}))
            test.eq(#view.declaration.fields, 6)
            test.eq(#view.declaration.item_types, 3)
            test.eq(#view.declaration.processes, 1)
            test.eq(#view.declaration.relation_types, 3)
            test.eq(view.declaration.key_prefix, h.prefix)
            test.eq(view.declaration.fields[1].id, 1)
            test.is_true(view.compiled.fields[1].intervals)
            test.eq(view.compiled.fields[1].form, "text")
        end)

        test.it("validates explicit removal targets and references", function()
            local h = fixture.board()
            for _, section in ipairs({ "fields", "item_types", "processes", "relation_types" }) do
                local _, err = h.call("plan_schema", { declaration = { remove = { [section] = { "missing" } } } })
                test.not_nil(err)
                test.eq(err:kind(), errors.NOT_FOUND)
            end
            local _, err = h.call("apply_schema", { declaration = { remove = { fields = { "title" } } } })
            test.eq(err:kind(), errors.INVALID)
            local bare = fixture.board({ bare = true })
            _, err = bare.call("plan_schema", { declaration = { key_prefix = bare.prefix, remove = { fields = {} } } })
            test.eq(err:kind(), errors.INVALID)
            _, err = bare.call("apply_schema", { declaration = { key_prefix = bare.prefix, remove = {} } })
            test.eq(err:kind(), errors.INVALID)
        end)

        test.it("refuses a stable field form change before and after its values disappear", function()
            local h = fixture.board()
            steps.create(h, "story", { title = "Held" })
            local request = { fields = { { code = "estimate", form = "dec", index = "number", track = true } } }
            test.eq(assert(h.call("plan_schema", { declaration = request })).class, "refused")
            local _, err = h.call("apply_schema", { declaration = request })
            test.eq(err:kind(), errors.INVALID)
            local id = steps.create(h, "task", { estimate = 2 })
            test.eq(steps.one(h, { op = "set", item = id, unset = { "estimate" } }).status, "applied")
            test.eq(assert(h.call("plan_schema", { declaration = request })).class, "refused")
            local priority = fixture.declaration(h.prefix).fields[5]
            priority.options = { priority.options[1] }
            assert(h.call("apply_schema", { declaration = { fields = { priority } } }))
            local held = { fields = { { code = "title", form = "int" } } }
            local plan = assert(h.call("plan_schema", { declaration = held }))
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].code, "title")
            test.eq(plan.refused[1].what, "form")
            test.eq(plan.migration, "add the new field or option, copy the values with apply commands, then remove the old one")
        end)

        test.it("judges type changes by field values across live and trashed items", function()
            local h = fixture.board()
            local id = steps.create(h, "story", { title = "A" })
            local d = { fields = { { code = "assignee", form = "ref", config = { target = "principal" }, index = "key", track = true } } }
            test.eq(assert(h.call("plan_schema", { declaration = d })).class, "additive")
            assert(h.call("apply_schema", { declaration = d }))
            assert(steps.one(h, { op = "set", item = id, values = { assignee = { ref = { "principal", "user:x" } } } }).status == "applied")
            local request = { fields = { fixture.declaration(h.prefix).fields[3] } }
            local plan = assert(h.call("plan_schema", { declaration = request }))
            test.eq(plan.class, "refused")
            local found = false
            for _, c in ipairs(plan.refused) do if c.what == "type" then found = c.code == "assignee" end end
            test.is_true(found)
            assert(steps.one(h, { op = "delete", item = id }).status == "applied")
            test.eq(assert(h.call("plan_schema", { declaration = request })).class, "refused")
            test.eq(usage(h, 3), 1)
            assert(steps.one(h, { op = "restore", item = id }).status == "applied")
            assert(steps.one(h, { op = "set", item = id, clear = { "assignee" } }).status == "applied")
            assert(h.call("apply_schema", { declaration = request }))
            test.eq(usage(h, 3), 0)
        end)

        test.it("retires held fields across reads and writes and allocates a fresh id", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A", estimate = 3 })
            local d = fixture.declaration(h.prefix)
            for _, t in ipairs(d.item_types) do
                for i = #t.fields, 1, -1 do if t.fields[i] == "estimate" then table.remove(t.fields, i) end end
            end
            local request = { item_types = d.item_types, remove = { fields = { "estimate" } } }
            test.eq(steps.archive_fields(h, request).class, "semantic")
            test.is_nil(steps.get(h, id).item.values.estimate)
            local feed = assert(h.call("list_changes", {}))
            test.is_nil(feed.items[1].values.estimate)
            local history = assert(h.call("list_history", { item = { id = id }, include = { "intervals" } }))
            test.is_true(#history.entries > 0)
            test.eq(steps.one(h, { op = "set", item = id, values = { title = "B" } }).status, "applied")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND document LIKE '%\"2\":{\"p\":3}%'", { h.id }), 1)
            assert(h.call("apply_schema", { declaration = { fields = { { code = "estimate", form = "int" } }, item_types = fixture.declaration(h.prefix).item_types } }))
            local view = assert(h.call("get_schema", {}))
            test.eq(view.compiled.fields[6].code, "estimate")
            test.eq(view.compiled.fields[6].id, 7)
            test.is_nil(steps.get(h, id).item.values.estimate)
            test.eq(usage(h, 2), 1)
            test.eq(usage(h, 7), 0)
        end)

        test.it("removes explicitly named sections while keeping omitted entries", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { processes = { { id = "unused", initial = "open", states = { { id = "open", category = "started" } } } } } }))
            assert(h.call("apply_schema", { declaration = { remove = { processes = { "unused" }, item_types = { "story", "task" }, relation_types = { "duplicates" } } } }))
            local view = assert(h.call("get_schema", {}))
            test.eq(#view.declaration.processes, 1)
            test.eq(#view.declaration.item_types, 1)
            test.eq(#view.declaration.relation_types, 2)
            test.eq(#view.declaration.fields, 6)
            test.is_nil(view.declaration.remove)
            local policy = { policy = { audit = "off" } }
            assert(h.call("apply_schema", { declaration = policy }))
            assert(h.call("apply_schema", { declaration = { fields = { { code = "extra", form = "text" } } } }))
            test.eq(assert(h.call("get_schema", {})).declaration.policy.audit, "off")
        end)

        test.it("uses a migration map once and keeps it out of effective declarations", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A" })
            local p = { id = "delivery", initial = "ready", states = { { id = "ready", category = "started" } }, map = { open = "ready" } }
            assert(h.call("apply_schema", { declaration = { processes = { p } } }))
            test.is_nil(assert(h.call("get_schema", {})).declaration.processes[1].map)
            assert(h.call("apply_schema", { declaration = { fields = { { code = "extra", form = "text" } } } }))
            test.is_nil(assert(h.call("get_schema", {})).declaration.processes[1].map)
            steps.wait_for("mapped item", function() return steps.get(h, id).item.state == "ready" end)
            local ev = steps.events(h)
            for _, e in ipairs(ev) do
                if e.type == "kickside.work.events:schema.applied" then
                    test.is_nil(e.body.declaration.processes[1].map)
                end
            end
        end)

        test.it("counts a redelivered batch once and rolls usage back with items", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "A", estimate = 1 })
            local events: { domain.RawEvent } = {}
            for _, e in ipairs(steps.events(h)) do events[#events + 1] = { seq = e.seq, type = e.type, body = e.body } end
            local db = assert(store.open())
            local tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, events, events[#events].seq, 5000))
            assert(tx:commit())
            db:release()
            test.eq(usage(h, 1), 1)
            test.eq(usage(h, 2), 1)
            local id = steps.get(h, assert(h.call("list_changes", {})).items[1].item_id).item.id
            local _, err = steps.apply(h, { { op = "set", item = id, clear = { "estimate" } }, { op = "set", item = id, values = { missing = 1 } } })
            test.is_nil(err)
            test.eq(usage(h, 2), 1)
            test.eq(steps.get(h, id).item.values.estimate, 1)
        end)

        test.it("classifies a compiled difference no change names as semantic", function()
            local h = fixture.board()
            local declaration = fixture.declaration(h.prefix)
            declaration.fields[1].config = { note = "shown in forms" }
            local plan = assert(h.call("plan_schema", { declaration = declaration }))
            test.eq(#plan.changes, 0)
            test.eq(plan.class, "semantic")
        end)

        test.it("counts counter inheritance and transition effects", function()
            local h = fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
            local epic = steps.create(h, "epic", { title = "E", priority = "p4" })
            local story = steps.create(h, "story", { title = "S", estimate = 1, assignee = { kind = "user", id = "u" } }, epic)
            test.eq(usage(h, 5), 2)
            test.eq(usage(h, 6), 2)
            assert(steps.one(h, { op = "transition", item = story, transition = "start" }).status == "applied")
            test.eq(usage(h, 7), 1)
            assert(steps.one(h, { op = "transition", item = story, transition = "finish" }).status == "applied")
            for _, id in ipairs({ 8, 9, 10, 11 }) do test.eq(usage(h, id), 1) end
            assert(steps.one(h, { op = "transition", item = story, transition = "reopen" }).status == "applied")
            test.eq(usage(h, 8), 0)
        end)

        test.it("counts set clear unset trash and restore exactly once", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "A", estimate = 3 })
            test.eq(usage(h, 2), 1)
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 4 } }).status, "applied", "values")
            test.eq(usage(h, 2), 1)
            test.eq(steps.one(h, { op = "set", item = id, clear = { "estimate" } }).status, "applied", "clear")
            test.eq(usage(h, 2), 0)
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 5 } }).status, "applied", "values")
            test.eq(steps.one(h, { op = "set", item = id, unset = { "estimate" } }).status, "applied", "unset")
            test.eq(usage(h, 2), 0)
            test.eq(steps.one(h, { op = "set", item = id, values = { estimate = 6 } }).status, "applied", "values")
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            test.eq(usage(h, 2), 1)
            test.eq(steps.one(h, { op = "restore", item = id }).status, "applied")
            test.eq(usage(h, 2), 1)
        end)
    end)
end

return { run = test.run_cases(define) }
