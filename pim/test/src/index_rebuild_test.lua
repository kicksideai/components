-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local clock = require("clock")
local consts = require("consts")
local fixture = require("fixture")
local funcs = require("funcs")
local materializer = require("materializer")
local registry = require("registry")
local schema = require("schema")
local seams = require("seams")
local steps = require("steps")
local store = require("store")
local test = require("test")
local types = require("types")

local TEXT = "kickside.pim.types:text"
local INTEGER = "kickside.pim.types:integer"
local CHECK = "app:rebuild_readiness_check"

local function change(h: fixture.Handle, declaration: types.Declaration): types.SchemaResult
    local out, err = h.call("apply_schema", { declaration = declaration })
    assert(out and not err, tostring(err))
    return out :: types.SchemaResult
end

local function head(h: fixture.Handle): types.SchemaView
    return assert(h.call("get_schema", {})) :: types.SchemaView
end

-- A corrupt trashed product blocks the worker without affecting live values
-- under schema admission. Return a function that repairs it and completes backfill.
local function pause_rebuild(h: fixture.Handle): () -> ()
    local retired = steps.one(h, { product = { sku = "RETIRED" }, create = {} }).product_id
    test.is_true(steps.one(h, { product = { id = retired }, expect_version = 1, delete = true }).trashed)
    local function write_document(document: string)
        local db = assert(store.open())
        assert(db:execute("UPDATE kickside_pim_product SET document = $1 WHERE catalog_id = $2 AND product_id = $3",
            { document, h.id, retired }))
        assert(db:release())
    end
    write_document("{broken")
    return function()
        write_document("{}")
        for _ = 1, 6 do
            local batch = assert(h.call("rebuild_batch", { deadline = "2090-01-01T00:00:00Z" }))
            if batch.done then
                test.is_false(steps.query(h, {}).rebuilding)
                return
            end
        end
        error("rebuild and its storage cleanup did not finish")
    end
end

local function expect_rebuilding(h: fixture.Handle, request: types.QueryRequest)
    local result, err = h.call("query", request)
    test.is_nil(result)
    test.eq(err:kind(), errors.UNAVAILABLE)
    test.eq(err:details().code, "index_rebuilding")
    test.is_true(err:retryable())
end

local function define()
    test.describe("index rebuilds", function()
        test.it("plans a key index within the command deadline on a large catalog", function()
            local h = fixture.catalog({ bare = true })
            change(h, { aspects = { { namespace = "core", attributes = {
                { code = "name", type = TEXT }, { code = "description", type = TEXT },
            } } } })
            local seed = steps.one(h, { product = { sku = "SEED" }, create = {}, set = {
                { attr = "core.name", value = "compatible key" },
                { attr = "core.description", value = string.rep("A catalog product description. ", 25) },
            } }).product_id

            -- Clone a valid live document and its usage in bulk to exercise admission
            -- at storage-audit scale without timing product creation.
            local db = assert(store.open())
            local tx = assert(db:begin())
            assert(tx:execute([[WITH RECURSIVE numbers(n) AS (
                SELECT 1 UNION ALL SELECT n+1 FROM numbers WHERE n < 439999
            )
            INSERT INTO kickside_pim_product(catalog_id, product_id, sku, family, root_id, level, is_item,
                version, status, state, document, source_seq, created_seq, updated_seq)
            SELECT catalog_id, 'bulk-' || n, 'BULK-' || n, family, 'bulk-' || n, level, is_item,
                version, status, state, document, source_seq, created_seq, updated_seq
            FROM kickside_pim_product CROSS JOIN numbers WHERE catalog_id = $1 AND product_id = $2]], { h.id, seed }))
            local rows = assert(tx:query("SELECT COUNT(*) AS n FROM kickside_pim_product WHERE catalog_id = $1", { h.id }))
            test.eq(tonumber(rows[1].n), 440000)
            assert(tx:execute("UPDATE kickside_pim_attribute_usage SET products = 440000 WHERE catalog_id = $1", { h.id }))
            assert(tx:execute("UPDATE kickside_pim_catalog SET product_count = 440000, item_count = 440000 WHERE catalog_id = $1", { h.id }))
            assert(tx:commit())

            local patch = { aspects = { { namespace = "core", attributes = { { code = "name", type = TEXT, index = "key" } } } } }
            local start = clock.millis()
            local plan, err = h.call("plan_schema", { declaration = patch })
            local elapsed = clock.millis() - start

            local cleanup = assert(db:begin())
            assert(cleanup:execute("DELETE FROM kickside_pim_product WHERE catalog_id = $1 AND product_id <> $2", { h.id, seed }))
            assert(cleanup:execute("UPDATE kickside_pim_attribute_usage SET products = 1 WHERE catalog_id = $1", { h.id }))
            assert(cleanup:execute("UPDATE kickside_pim_catalog SET product_count = 1, item_count = 1 WHERE catalog_id = $1", { h.id }))
            assert(cleanup:commit())
            assert(db:release())
            assert(plan and not err, tostring(err))
            test.eq(plan.class, "semantic")
            test.is_true(elapsed < consts.LIMITS.command_deadline_ms,
                "planning 440,000 products took " .. elapsed .. " ms")
        end)

        test.it("refuses an index that existing values cannot fit before appending", function()
            local h = fixture.catalog({ bare = true })
            change(h, { aspects = { { namespace = "core", attributes = { { code = "text", type = TEXT } } } } })
            test.eq(steps.one(h, { product = { sku = "P" }, create = {},
                set = { { attr = "core.text", value = string.rep("a", 257) } } }).outcome, "created")

            local patch = { aspects = { { namespace = "core", attributes = { { code = "text", type = TEXT, index = "key" } } } } }
            local before = head(h)
            local plan = assert(h.call("plan_schema", { declaration = patch }))
            local applied, err = h.call("apply_schema", { declaration = patch })
            if applied then
                local _, rebuild_err = h.call("rebuild_batch", { deadline = "2090-01-01T00:00:00Z" })
                local _, query_err = h.call("query", { where = { field = "core.text", op = "eq", value = "a" } })
                test.is_nil(applied, "plan " .. plan.class .. " advanced to generation " .. applied.generation
                    .. ". Rebuild " .. tostring(rebuild_err) .. ". Query " .. tostring(query_err))
            end
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "migration_required")
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].code, "core.text")
            test.eq(head(h).as_of, before.as_of)
        end)

        test.it("checks every member of a stored list against a new key index", function()
            local h = fixture.catalog({ bare = true })
            change(h, { aspects = { { namespace = "core", attributes = { { code = "labels", type = TEXT, cardinality = "list" } } } } })
            test.eq(steps.one(h, { product = { sku = "P" }, create = {},
                set = { { attr = "core.labels", value = { "short", string.rep("a", 257) } } } }).outcome, "created")
            local patch: types.Declaration = { aspects = { { namespace = "core", attributes = {
                { code = "labels", type = TEXT, cardinality = "list", index = "key" },
            } } } }
            local previous = head(h).as_of
            local plan = assert(h.call("plan_schema", { declaration = patch }))
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].code, "core.labels")
            test.eq(head(h).as_of, previous)

            local limit = string.rep("a", 256)
            test.eq(steps.set(h, "P", "core.labels", { "short", limit }).outcome, "updated")
            change(h, patch)
            steps.rebuilt(h)
            test.eq(steps.count(h, { where = { field = "core.labels", op = "has", value = limit } }), 1)
        end)

        test.it("refuses a number index when a stored value is finer than its scale", function()
            local h = fixture.catalog({ bare = true })
            local number = "kickside.pim.types:number"
            change(h, { aspects = { { namespace = "core", attributes = {
                { code = "amount", type = number, config = { scale = 3 } },
            } } } })
            test.eq(steps.one(h, { product = { sku = "P" }, create = {},
                set = { { attr = "core.amount", value = "0.7405" } } }).outcome, "created")
            local patch: types.Declaration = { aspects = { { namespace = "core", attributes = {
                { code = "amount", type = number, index = "number", config = { scale = 3 } },
            } } } }
            local previous = head(h).as_of
            local plan = assert(h.call("plan_schema", { declaration = patch }))
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].code, "core.amount")
            local applied, err = h.call("apply_schema", { declaration = patch })
            test.is_nil(applied)
            test.eq(err:details().code, "migration_required")
            test.eq(head(h).as_of, previous)
        end)

        test.it("counts incompatible authored contexts across clear, trash and restore", function()
            local h = fixture.catalog({ bare = true })
            change(h, { dimensions = { { name = "locale", members = { "en", "de" } } },
                aspects = { { namespace = "core", attributes = { { code = "title", type = TEXT, scope = { "locale" } } } } } })
            local de = { locale = "de" }
            local too_long = string.rep("é", 129)
            local function create(sku: string): string
                local outcome = steps.one(h, { product = { sku = sku }, create = {},
                    set = {
                        { attr = "core.title", ctx = { locale = "en" }, value = "Compatible" },
                        { attr = "core.title", ctx = de, value = too_long },
                    } })
                test.eq(outcome.outcome, "created")
                return assert(outcome.product_id)
            end
            local first, second = create("A"), create("B")
            local patch: types.Declaration = { aspects = { { namespace = "core", attributes = {
                { code = "title", type = TEXT, scope = { "locale" }, index = "key", index_contexts = { { locale = "en" } } },
            } } } }
            local function planned(): string
                return assert(h.call("plan_schema", { declaration = patch })).class
            end
            test.eq(planned(), "refused")
            test.eq(steps.one(h, { product = { id = first }, expect_version = 1,
                clear = { { attr = "core.title", ctx = de } } }).outcome, "updated")
            test.eq(planned(), "refused")
            test.is_true(steps.one(h, { product = { id = second }, expect_version = 1, delete = true }).trashed)
            test.eq(planned(), "semantic")
            test.eq(steps.one(h, { product = { id = second }, expect_version = 2, restore = true }).outcome, "updated")
            test.eq(planned(), "refused")
            test.is_true(steps.one(h, { product = { id = second }, expect_version = 3, delete = true }).trashed)
            test.eq(change(h, patch).class, "semantic")
            test.eq(steps.one(h, { product = { id = second }, expect_version = 4, restore = true }).outcome, "invalid")
        end)

        test.it("marks a physically replaced index column pending until rebuilt", function()
            local h = fixture.catalog({ bare = true })
            change(h, { aspects = { { namespace = "core", attributes = {
                { code = "quantity", type = INTEGER, index = "key" }, { code = "label", type = TEXT, index = "key" },
            } } } })
            local product = steps.one(h, { product = { sku = "P" }, create = {},
                set = { { attr = "core.quantity", value = 7 }, { attr = "core.label", value = "before" } } }).product_id
            test.not_nil(product)

            -- Inspect the fold before commit so the rebuild worker cannot win the race.
            local db = assert(store.open())
            local tx = assert(db:begin())
            local previous = assert(store.catalog(tx, h.id))
            local attributes: { types.AttributeDecl } = {
                { id = previous.compiled.attributes["core.quantity"].id, code = "quantity", type = INTEGER, index = "number" },
                { id = previous.compiled.attributes["core.label"].id, code = "label", type = TEXT, index = "key" },
            }
            local declaration: types.Declaration = { aspects = { { namespace = "core", attributes = attributes } } }
            local compiled = assert(schema.compile(previous.compiled, declaration, { type_of = seams.load_type }))
            local seq = previous.applied_seq + 1
            local body = { generation = previous.generation + 1, declaration = declaration, compiled = compiled,
                class = "semantic", changes = {}, actor = h.actor:id(), at = clock.now() }
            local column = compiled.layout.columns[1].column
            local original = "SELECT " .. column .. " AS value FROM " .. previous.item_table .. "_item"
            local before_rows = assert(tx:query(original, {}))
            local folded = assert(materializer.fold(tx, db:type(), h.id,
                { { seq = seq, type = "kickside.pim.events:schema.applied", body = body } }, seq, 20000))
            local after = assert(store.catalog(tx, h.id))
            local after_rows = assert(tx:query(original, {}))
            assert(tx:rollback())
            assert(db:release())
            test.eq(folded.last_seq, seq)
            test.not_nil(after.rebuild_after)
            test.eq(previous.compiled.layout.columns[1].column, column)
            test.not_nil(before_rows[1].value)
            test.eq(after_rows[1].value, before_rows[1].value, "the fold leaves populated index storage intact")
            test.eq(after.pending_columns[1], column)

            local resume = pause_rebuild(h)
            change(h, declaration)
            local filter: types.QueryRequest = { where = { field = "core.quantity", op = "eq", value = 8 } }
            local sorted: types.QueryRequest = { sort = { field = "core.quantity" } }
            local unchanged: types.QueryRequest = { where = { field = "core.label", op = "eq", value = "before" } }
            expect_rebuilding(h, filter)
            expect_rebuilding(h, sorted)
            test.eq(steps.query(h, unchanged).items[1].sku, "P")
            test.eq(steps.one(h, { product = { id = product }, expect_version = 1,
                set = { { attr = "core.quantity", value = 8 }, { attr = "core.label", value = "after" } } }).outcome, "updated")
            test.eq(steps.count(h, unchanged), 0)
            unchanged.where = { field = "core.label", op = "eq", value = "after" }
            test.eq(steps.query(h, unchanged).items[1].sku, "P")
            resume()
            test.eq(steps.query(h, filter).items[1].sku, "P")
            test.eq(steps.query(h, sorted).items[1].sku, "P")
            test.eq(steps.query(h, unchanged).items[1].sku, "P")
            db = assert(store.open())
            local rebuilt = assert(store.catalog(db, h.id))
            test.is_false(rebuilt.item_table == previous.item_table)
            test.is_false(store.table_exists(db, db:type(), previous.item_table .. "_item"))
            assert(db:release())
        end)

        test.it("keeps four new indexes unavailable through a second schema change until backfill", function()
            local h = fixture.catalog({ bare = true })
            change(h, { aspects = { { namespace = "core", attributes = {
                { code = "quantity", type = INTEGER },
                { code = "tags", type = TEXT, cardinality = "set" },
                { code = "name", type = TEXT },
            } } }, families = { { code = "stock", aspects = { "core" } } } })
            test.eq(steps.one(h, { product = { sku = "MATCH" }, create = { family = "stock" }, set = {
                { attr = "core.quantity", value = 7 }, { attr = "core.tags", value = { "outdoor", "summer" } },
                { attr = "core.name", value = "Ridgeline boot" },
            } }).outcome, "created")
            test.eq(steps.one(h, { product = { sku = "OTHER" }, create = { family = "stock" },
                set = { { attr = "core.quantity", value = 12 } } }).outcome, "created")
            local resume = pause_rebuild(h)
            change(h, { aspects = { { namespace = "core", attributes = {
                { code = "quantity", type = INTEGER, index = "number" },
                { code = "tags", type = TEXT, cardinality = "set", index = "key" },
                { code = "name", type = TEXT, index = "text" },
            } } }, families = { { code = "stock", aspects = { "core" },
                requirements = { { id = "web", require = { "core.name" } } } } } })

            local selectors: { types.QueryRequest } = {
                { where = { field = "core.quantity", op = "eq", value = 7 } },
                { sort = { field = "core.quantity" }, limit = 1 },
                { where = { field = "core.tags", op = "has", value = "outdoor" } },
                { ready = { set = "web", value = true } },
                { text = "ridgeline" },
            }
            local function pending()
                test.is_true(steps.query(h, {}).rebuilding)
                for _, request in ipairs(selectors) do expect_rebuilding(h, request) end
            end
            pending()
            change(h, { aspects = { { namespace = "core", attributes = {
                { code = "extra", type = TEXT, default = "new default" },
            } } } })
            pending()

            resume()
            for _, request in ipairs(selectors) do
                local rows = steps.query(h, request).items
                test.eq(#rows, 1)
                test.eq(rows[1].sku, "MATCH")
            end
        end)

        test.it("re-adopts a revised check under the same registry id and rebuilds readiness", function()
            local h = fixture.catalog({ bare = true })
            local declaration: types.Declaration = { aspects = { { namespace = "core", attributes = { { code = "name", type = TEXT } } } },
                families = { { code = "apparel", aspects = { "core" }, requirements = { { id = "web" } },
                    checks = { { check = CHECK, reads = { "core.name" } } } },
                    { code = "other", aspects = { "core" }, requirements = { { id = "internal" } } } } }
            test.eq(change(h, declaration).generation, 2)
            test.eq(steps.one(h, { product = { sku = "SHIRT" }, create = { family = "apparel" } }).outcome, "created")
            test.eq(steps.one(h, { product = { sku = "OTHER" }, create = { family = "other" } }).outcome, "created")
            test.eq(#assert(funcs.call(CHECK, {})).findings, 0)
            test.eq(#steps.query(h, { ready = { set = "web", value = true } }).items, 1)
            local resume = pause_rebuild(h)

            local entry = assert(registry.get(CHECK))
            local data = {}
            for key, value in pairs(entry.data) do data[key] = value end
            data.source = 'return { run = function() return { findings = { { code = "revised", message = "Revised check" } } } end }'
            local changes = assert(registry.snapshot()):changes()
            changes:update({ id = CHECK, kind = entry.kind, meta = entry.meta, data = data })
            assert(not select(2, changes:apply()))

            local ok, err = pcall(function()
                test.eq(assert(funcs.call(CHECK, {})).findings[1].code, "revised")
                local request = { expected_generation = 2, declaration = declaration }
                local plan = assert(h.call("plan_schema", request))
                local combined = assert(h.call("plan_schema", { expected_generation = 2,
                    declaration = { families = declaration.families, vocabularies = { { code = "color" } } } }))
                test.eq(combined.class, "semantic")
                local applied = assert(h.call("apply_schema", request))
                test.eq(plan.class .. "/" .. applied.class, "semantic/semantic")
                test.eq(applied.generation, 3)
                expect_rebuilding(h, { ready = { set = "web", value = true } })
                expect_rebuilding(h, { ready = { set = "web", value = false } })
                test.eq(steps.query(h, { ready = { set = "internal", value = true } }).items[1].sku, "OTHER")
                test.is_nil(assert(steps.get(h, "SHIRT")).readiness.web)
                resume()
                test.eq(#steps.query(h, { ready = { set = "web", value = true } }).items, 0)
                test.eq(#steps.query(h, { ready = { set = "web", value = false } }).items, 1)
                local shirt = assert(steps.get(h, "SHIRT"))
                test.eq((shirt.readiness :: { [string]: { types.Finding } }).web[1].code, "revised")
                test.eq(change(h, declaration).class, "unchanged")
            end)
            local restore = assert(registry.snapshot()):changes()
            restore:update({ id = CHECK, kind = entry.kind, meta = entry.meta, data = entry.data })
            assert(not select(2, restore:apply()))
            assert(ok, tostring(err))
        end)
    end)
end

return { run = test.run_cases(define) }
