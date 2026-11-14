-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Layout changes, backfill ranges and lifecycle cascades keep queries explicit.
local scoped = require("scoped")
local funcs = require("funcs")
local json = require("json")
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local tables = require("tables")
local materializer = require("materializer")
local rollup_fixture = require("rollup_fixture")

local function define()
    test.describe("query indexes", function()
        test.it("fills new columns in bounded slot batches and refuses retired fields", function()
            local h = scoped.board(scoped.admin())
            for _ = 1, 3 do steps.create(h, "task", { title = "indexed later" }) end
            assert(h.call("apply_schema", { declaration = { fields = { { code = "title", form = "text", index = "key", track = true } } } }))
            steps.wait_for("index backfill", function(): boolean
                local page = assert(h.call("query", { where = { field = "title", op = "eq", value = "indexed later" } }))
                if page.reindexing then test.eq(#page.items, 0); return false end
                test.eq(#page.items, 3)
                return true
            end)
            local db = assert(store.open())
            local jobs = assert(db:query("SELECT status, key FROM kickside_work_job WHERE board_id = $1 AND job_type = 'reindex'", { h.id }))
            test.eq(jobs[1].status, "done")
            local board = assert(store.board(db, h.id))
            local field = board.model.fields.title.id
            local names = tables.names(h.id)
            test.eq(assert(store.count(db, "SELECT COUNT(*) AS n FROM " .. names.item, {})), 3)
            db:release()
            local retired = fixture.declaration(h.prefix)
            for _, item_type in ipairs(retired.item_types) do
                local kept = {}
                for _, code in ipairs(item_type.fields) do if code ~= "title" then kept[#kept + 1] = code end end
                item_type.fields = kept
            end
            assert(h.call("apply_schema", { declaration = { remove = { fields = { "title" } }, item_types = retired.item_types } }))
            local _, err = h.call("query", { where = { field = "title", op = "eq", value = "indexed later" } })
            test.eq(err:kind(), errors.INVALID); test.eq(err:details().field, "title"); test.eq(err:details().code, "unknown_field")
            db = assert(store.open())
            local row = assert(db:query("SELECT * FROM " .. names.item .. " LIMIT 1", {}))[1]
            test.is_nil(row["f" .. field .. "_key"])
            db:release()
        end)

        test.it("reports reindexing and advances only a bounded current-generation range", function()
            local h = fixture.board()
            local ids = {}
            for i = 1, 4 do ids[i] = steps.create(h, "task", { estimate = i }) end
            table.sort(ids)
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            assert(db:execute([[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status)
                VALUES ($1, 'manual-index-test', 'reindex', $2, 'pending')]], { h.id, json.encode({ generation = board.generation, after = "" }) }))
            test.is_true(assert(h.call("query", {})).reindexing)
            local counted = assert(h.call("count", {})); test.is_true(counted.reindexing); test.is_nil(counted.total)
            local seq = board.applied_seq + 1
            local tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, { { seq = seq, type = "kickside.work.events:index.rebuilt",
                body = { recompute = { after = "", through = ids[2], generation = board.generation } } } }, seq, 5000))
            assert(tx:commit())
            local row = assert(db:query("SELECT key FROM kickside_work_job WHERE board_id = $1 AND job_type = 'reindex'", { h.id }))[1]
            test.eq(json.decode(row.key).after, ids[2])
            tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, { { seq = seq + 1, type = "kickside.work.events:index.rebuilt",
                body = { recompute = { after = "", through = ids[4], generation = board.generation - 1 } } } }, seq + 1, 5000))
            assert(tx:commit())
            row = assert(db:query("SELECT key FROM kickside_work_job WHERE board_id = $1 AND job_type = 'reindex'", { h.id }))[1]
            test.eq(json.decode(row.key).after, ids[2])
            db:release()
        end)

        test.it("answers built fields while another field awaits indexing", function()
            local h = scoped.board(scoped.admin())
            steps.create(h, "task", { estimate = 4 })
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            assert(db:execute([[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status)
                VALUES ($1, 'scoped-index-test', 'reindex', $2, 'pending')]],
                { h.id, json.encode({ generation = board.generation, after = "", fields = { "estimate" } }) }))
            db:release()
            local page = assert(h.call("query", { where = { field = "state", op = "eq", value = "open" } }))
            test.is_false(page.reindexing)
            test.eq(#page.items, 1)
            test.eq(assert(h.call("count", {})).total, 1)
            test.is_true(assert(h.call("query", { where = { field = "estimate", op = "eq", value = 4 } })).reindexing)
            test.is_true(assert(h.call("query", { order = { field = "estimate" } })).reindexing)
        end)

        test.it("keeps rank, parent, descendants, trash and restore consistent", function()
            local h = fixture.board()
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            local child = steps.create(h, "task", {}, a)
            local grandchild = steps.create(h, "task", {}, child)
            test.eq(#assert(h.call("query", { where = { field = "path_under", op = "has", value = a } })).items, 2)
            steps.one(h, { op = "parent", item = child, parent = b })
            test.eq(#assert(h.call("query", { where = { field = "path_under", op = "has", value = a } })).items, 0)
            test.eq(#assert(h.call("query", { where = { field = "path_under", op = "has", value = b } })).items, 2)
            local page = assert(h.call("query", { where = { field = "parent", op = "eq", value = b } }))
            test.eq(page.items[1].id, child)
            test.eq(#assert(h.call("query", { where = { field = "parent", op = "is_null", value = true } })).items, 2)
            steps.one(h, { op = "rank", item = b, before = a })
            test.eq(assert(h.call("query", {})).items[1].id, b)
            steps.one(h, { op = "delete", item = b })
            test.eq(assert(h.call("count", {})).total, 1)
            test.eq(#assert(h.call("query", { include_trashed = true })).items, 4)
            steps.one(h, { op = "restore", item = b })
            test.eq(assert(h.call("count", {})).total, 4)
            test.eq(assert(h.call("get", { item = { id = grandchild } })).item.life, "live")
        end)

        test.it("indexes rollups after finish recomputes them", function()
            local d = rollup_fixture.declaration()
            d.fields[7].index = "number"
            local h = fixture.board({ declaration = d })
            local parent = steps.create(h, "parent")
            local child = steps.create(h, "child", { points = 3 }, parent)
            local page = assert(h.call("query", { where = { field = "total", op = "eq", value = 3 } }))
            test.eq(#page.items, 1); test.eq(page.items[1].id, parent)
            steps.one(h, { op = "set", item = child, values = { points = 9 } })
            test.eq(#assert(h.call("query", { where = { field = "total", op = "eq", value = 3 } })).items, 0)
            test.eq(assert(h.call("query", { where = { field = "total", op = "eq", value = 9 } })).items[1].id, parent)
        end)

        test.it("drops generated tables on board deletion", function()
            local h = fixture.board()
            steps.create(h, "task", { estimate = 2 })
            local names = tables.names(h.id)
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            local db = assert(store.open())
            local _, err = db:query("SELECT * FROM " .. names.item, {})
            test.not_nil(err)
            db:release()
        end)

        test.it("drops orphan generated tables through retention", function()
            local h = fixture.board()
            steps.create(h, "task")
            local names = tables.names(h.id)
            local db = assert(store.open())
            assert(db:execute("DELETE FROM kickside_work_board WHERE board_id = $1", { h.id }))
            db:release()
            local result = assert(funcs.call("kickside.work.retention:owner", {}))
            test.is_true(result.success)
            db = assert(store.open())
            local _, err = db:query("SELECT * FROM " .. names.item, {})
            test.not_nil(err)
            db:release()
        end)

        test.it("backfills more than 500 rows under the stored board identity", function()
            local admin = scoped.admin()
            local d = fixture.declaration(fixture.fresh_prefix())
            local h = scoped.board(admin, d)
            for batch = 1, 3 do
                local ops = {}
                for _ = 1, (batch == 3 and 151 or 200) do ops[#ops + 1] = { op = "create", type = "task", values = { title = "backfill" } } end
                assert(steps.apply(h, ops))
            end
            assert(h.call("apply_schema", { declaration = { fields = { { code = "title", form = "text", index = "key", track = true } } } }))
            steps.wait_for("all index batches", function(): boolean
                return not assert(h.call("count", { where = { field = "title", op = "eq", value = "backfill" } })).reindexing
            end)
            test.eq(assert(h.call("count", { where = { field = "title", op = "eq", value = "backfill" } })).total, 551)
            local page = assert(h.call("events", {}))
            local n = 0
            for _, event in ipairs(page.events) do
                if event.type == "kickside.work.events:index.rebuilt" then
                    local body = type(event.body) == "string" and json.decode(event.body) or event.body
                    test.eq(body.actor, admin.id)
                    test.is_nil(body.execution_identity)
                    test.is_nil(body.groups)
                    n = n + 1
                end
            end
            test.eq(n, 2)
        end)

        test.it("refuses schemas beyond index capabilities and limits", function()
            local h = fixture.board({ bare = true })
            local d = fixture.declaration(h.prefix)
            d.fields = {}
            local codes = {}
            for i = 1, 61 do
                local code = "indexed_" .. i
                d.fields[i] = { code = code, form = "int", index = "number" }
                codes[i] = code
            end
            d.item_types = { { id = "task", process = "delivery", fields = codes } }
            local _, err = h.call("apply_schema", { declaration = d })
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "index_limit"); test.eq(err:details().limit, 60)
            d.fields = { { code = "structured", form = "record", index = "key" } }
            d.item_types = { { id = "task", process = "delivery", fields = { "structured" } } }
            _, err = h.call("apply_schema", { declaration = d })
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "invalid_schema"); test.eq(err:details().field, "structured")
        end)
    end)
end
return { run = test.run_cases(define) }
