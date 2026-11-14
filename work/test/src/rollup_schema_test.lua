-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local rollup_fixture = require("rollup_fixture")
local steps = require("steps")
local store = require("store")

type Map = { [string]: unknown }

local function define()
    test.describe("rollup schemas", function()
        test.it("validates row predicates and refuses malformed boolean rollups with their stable code", function()
            local h = fixture.board({ bare = true })
            for _, patch in ipairs({ { fn = "any" }, { fn = "all" }, { where = { field = "missing", op = "eq", value = "completed" } } }) do
                local d = rollup_fixture.declaration()
                local f = (d.fields :: { Map })[6]
                for key, value in pairs(patch) do f[key] = value end
                local out, err = h.call("plan_schema", { declaration = d })
                test.is_nil(out); test.not_nil(err)
                if patch.fn then test.eq((err:details() :: Map).code, "invalid_schema")
                else test.eq(err:details().code, "unknown_field"); test.eq(err:details().field, "missing") end
            end
            local d = rollup_fixture.declaration()
            d.fields[6].where = { field = "category", op = "eq", value = "completed" }
            assert(h.call("plan_schema", { declaration = d }))
        end)

        test.it("refuses invalid source, relation, result form, tracking and inheritance", function()
            local h = fixture.board({ bare = true })
            local patches: { Map } = { { field = "missing" }, { of = "missing" }, { field = "title" }, { field = "total" },
                { form = "dec" }, { track = true }, { intervals = true }, { fn = "mystery" }, { by = "rank" } }
            for _, patch in ipairs(patches) do
                local d = rollup_fixture.declaration()
                local f = (d.fields :: { Map })[7]
                for key, value in pairs(patch) do f[key] = value end
                local out, err = h.call("plan_schema", { declaration = d })
                test.is_nil(out); test.not_nil(err)
            end
            local d = rollup_fixture.declaration()
            local item_types = d.item_types :: { Map }
            item_types[1].inherit = { "total" }
            test.not_nil(select(2, h.call("plan_schema", { declaration = d })))
            d = rollup_fixture.declaration()
            local transitions = (d.processes :: { Map })[1].transitions :: { Map }
            transitions[1].set = { { field = "total", clear = true } }
            test.not_nil(select(2, h.call("plan_schema", { declaration = d })))
            d = rollup_fixture.declaration()
            local fields = d.fields :: { Map }
            fields[1].cardinality = "list"
            test.not_nil(select(2, h.call("plan_schema", { declaration = d })))
        end)

        test.it("refuses activation on an existing parent beyond the child bound", function()
            local h = fixture.board()
            local p = steps.create(h, "epic")
            local child = steps.create(h, "story", nil, p)
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 2000)
                INSERT INTO kickside_work_item (board_id, item_id, number, type, state, category, process_generation, visit,
                    parent_id, path, rank, version, life, document, created_seq, updated_seq, created_at, updated_at)
                SELECT b.board_id, $1 || CAST(n.i AS text), n.i + 2, b.type, b.state, b.category, b.process_generation, b.visit,
                    b.parent_id, b.path || CAST(n.i AS text) || '/', b.rank, b.version, b.life, b.document, b.created_seq, b.updated_seq, b.created_at, b.updated_at
                FROM n CROSS JOIN kickside_work_item b WHERE b.board_id = $2 AND b.item_id = $3]], { "existing-", h.id, child }))
            db:release()
            local out, err = h.call("apply_schema", { declaration = {
                fields = { { code = "count", type = "rollup", form = "int", of = "children", fn = "count" } },
                item_types = { { id = "epic", process = "delivery", fields = { "count" } } },
            } })
            test.is_nil(out); test.not_nil(err)
            test.eq((err:details() :: Map).code, "children_limit")
            test.eq(assert(h.call("get_schema", {})).generation, 1)
        end)

        test.it("backfills more than 500 items under the board identity in bounded event ranges", function()
            local h = scoped.board(scoped.admin())
            for _ = 1, 3 do
                local ops: { Map } = {}
                for _ = 1, 200 do ops[#ops + 1] = { op = "create", type = "epic" } end
                local out = assert(steps.apply(h, ops))
                test.is_true(out.applied)
            end
            assert(h.call("apply_schema", { declaration = {
                fields = { { code = "count", type = "rollup", form = "int", of = "children", fn = "count" } },
                item_types = { { id = "epic", process = "delivery", fields = { "count" } } },
            } }))
            steps.wait_for("600 rollup values", function()
                local db = assert(store.open())
                local board = assert(store.board(db, h.id))
                local usage = assert(store.usage(db, h.id))
                db:release()
                return usage.fields[board.model.fields.count.id] == 600
            end)
            local db = assert(store.open())
            local events = assert(h.call("events", { from_seq = 602 }))
            local ranges = 0
            for _, event in ipairs(events.events) do
                if event.type == "kickside.work.events:rollups.recomputed" then
                    local body = event.body
                    if type(body) == "string" then body = require("json").decode(body) end
                    local range = (body :: Map).recompute :: Map
                    local n = assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND item_id > $2 AND item_id <= $3",
                        { h.id, range.after, range.through }))
                    test.is_true(n <= 500)
                    ranges = ranges + 1
                end
            end
            test.eq(ranges, 2)
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND version <> 1", { h.id })), 0)
            local _, identity_err = db:query("SELECT identity FROM kickside_work_job", {})
            test.not_nil(identity_err)
            db:release()
        end)

        test.it("backfills new and changed rollups and option order through identity-free slot events", function()
            local h = fixture.board()
            local p = steps.create(h, "epic")
            steps.create(h, "story", { estimate = 3, priority = "p0" }, p)
            steps.create(h, "story", { estimate = 8, priority = "p4" }, p)
            local version = steps.version(h, p)
            local patch: Map = { fields = { { code = "total", type = "rollup", form = "int", of = "children", fn = "sum", field = "estimate" } },
                item_types = { { id = "epic", process = "delivery", fields = { "title", "total" } } } }
            local plan = assert(h.call("plan_schema", { declaration = patch }))
            test.eq(plan.class, "semantic")
            assert(h.call("apply_schema", { declaration = patch, expected_generation = 1 }))
            steps.rebuilt(h.id, "recompute")
            test.eq(((assert(steps.get(h, p)).item :: Map).values :: Map).total, 11)
            test.eq(steps.version(h, p), version)
            patch = { fields = { { code = "total", type = "rollup", form = "int", of = "children", fn = "sum", field = "priority" } } }
            test.eq(assert(h.call("plan_schema", { declaration = patch })).class, "semantic")
            assert(h.call("apply_schema", { declaration = patch, expected_generation = 2 }))
            steps.rebuilt(h.id, "recompute")
            test.eq(((assert(steps.get(h, p)).item :: Map).values :: Map).total, 10)
            patch = { fields = { { code = "priority", type = "option", options = { { id = "p0", order = 4 }, { id = "p4", order = 9 } }, index = "number", track = true } } }
            test.eq(assert(h.call("plan_schema", { declaration = patch })).class, "semantic")
            assert(h.call("apply_schema", { declaration = patch, expected_generation = 3 }))
            steps.rebuilt(h.id, "recompute")
            test.eq(((assert(steps.get(h, p)).item :: Map).values :: Map).total, 13)
            local events = steps.events(h)
            local count = 0
            for _, event in ipairs(events) do if event.type == "kickside.work.events:rollups.recomputed" then count = count + 1 end end
            test.is_true(count >= 3)
            local db = assert(store.open())
            local rows = assert(db:query("SELECT * FROM kickside_work_job WHERE board_id = $1 AND job_type = 'recompute'", { h.id }))
            db:release()
            test.eq(#rows, 1)
            test.is_nil(rows[1].identity)
        end)
    end)
end
return { run = test.run_cases(define) }
