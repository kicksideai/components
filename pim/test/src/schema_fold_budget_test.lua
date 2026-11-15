-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local schema = require("schema")
local seams = require("seams")
local materializer = require("materializer")
local types = require("types")
local clock = require("clock")

local function define()
    test.describe("schema fold row budget", function()
        test.it("keeps removed usage rows absent when a whole catalog history folds in one batch", function()
            local h = fixture.catalog({ bare = true })
            assert(h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "token", type = "kickside.pim.types:identifier", unique = true, index = "key" },
            } } } } }))
            assert(h.call("apply", { items = { { product = { sku = "P" }, create = {}, set = { { attr = "core.token", value = "one" } } } } }))
            assert(h.call("apply_schema", { declaration = { remove = { attributes = { "core.token" } } } }))
            local events = assert(h.call("events", {})).events
            local replay = fixture.catalog({ bare = true }).id
            local db = assert(store.open())
            local tx = assert(db:begin())
            local out, err = materializer.fold(tx, db:type(), replay, events, events[#events].seq, 20000)
            local count = tonumber(assert(tx:query("SELECT COUNT(*) AS n FROM kickside_pim_attribute_usage WHERE catalog_id = $1", { replay }))[1].n)
            tx:rollback()
            db:release()
            test.is_nil(err, tostring(err))
            test.eq(out.last_seq, events[#events].seq)
            test.eq(count, 0)
        end)

        test.it("resumes schema removals without advancing the event checkpoint until their rows are gone", function()
            local h = fixture.catalog({ bare = true })
            assert(h.call("apply_schema", { declaration = { vocabularies = { { code = "v" } }, channels = { { id = "web", requirements = {} } },
                aspects = { { namespace = "core", attributes = {
                    { code = "token", type = "kickside.pim.types:identifier", unique = true, index = "key" },
                    { code = "tags", type = "kickside.pim.types:text", cardinality = "set", index = "key" },
                    { code = "body", type = "kickside.pim.types:rich_text", index = "text" },
                } } } } }))
            local db = assert(store.open())
            local current = assert(store.catalog(db, h.id))
            local next_compiled = assert(schema.compile(current.compiled, {}, { type_of = seams.load_type }))
            local attr = current.compiled.attributes["core.token"].id
            local set_col = current.compiled.layout.sets[1].column
            for i = 1, 5 do
                local id = "fanout-" .. i
                assert(db:execute("INSERT INTO kickside_pim_publication (catalog_id, channel, product_id, state, seq, updated_at) VALUES ($1, 'web', $2, 'published', 1, 'now')", { h.id, id }))
                assert(db:execute("INSERT INTO kickside_pim_term (catalog_id, vocabulary, code, labels, retired, updated_seq) VALUES ($1, 'v', $2, '{}', 0, 1)", { h.id, id }))
                assert(db:execute("INSERT INTO kickside_pim_ref (catalog_id, product_id, attribute_id, ctx, path, kind, target) VALUES ($1, $2, $3, '', '', 'product', 'target')", { h.id, id, attr }))
                assert(db:execute("INSERT INTO kickside_pim_unique_value (catalog_id, attribute_id, value_key, product_id) VALUES ($1, $2, $3, $3)", { h.id, attr, id }))
                assert(db:execute("INSERT INTO " .. current.item_table .. "_set (product_id, col, value_key) VALUES ($1, $2, 'value')", { id, set_col }))
            end
            assert(db:execute("INSERT INTO kickside_pim_attribute_usage (catalog_id, attribute_id, products) VALUES ($1, $2, 5)", { h.id, attr }))
            local seq = current.applied_seq + 1
            local event: types.RawEvent = { seq = seq, type = "kickside.pim.events:schema.applied", body = { generation = current.generation + 1,
                declaration = {}, compiled = next_compiled, class = "semantic", changes = {}, actor = h.actor:id(), at = clock.now() } }
            local function remaining(): integer
                local n = 0
                for _, name in ipairs({ "term", "ref", "unique_value", "attribute_usage" }) do
                    n = n + assert(tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_" .. name .. " WHERE catalog_id = $1", { h.id }))[1].n))
                end
                n = n + assert(tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_publication WHERE catalog_id = $1 AND state = 'published'", { h.id }))[1].n))
                n = n + assert(tonumber(assert(db:query("SELECT COUNT(*) AS n FROM " .. current.item_table .. "_set", {}))[1].n))
                return assert(math.tointeger(n))
            end
            local before = remaining()
            local complete = false
            for i = 1, 30 do
                local tx = assert(db:begin())
                local result, err = materializer.fold(tx, db:type(), h.id, { event }, seq, 2)
                test.is_nil(err, tostring(err))
                assert(tx:commit())
                local after = remaining()
                test.is_true(before - after <= 2, "schema fan-out spends the row budget")
                if i == 1 then
                    test.eq(result.last_seq, seq - 1)
                    local value, _, read_err = store.snapshot(h.id, function() return true, nil end)
                    test.is_nil(value)
                    test.eq(read_err:kind(), errors.UNAVAILABLE)
                    test.eq(read_err:details().code, "schema_applying")
                end
                if result.last_seq == seq then
                    test.eq(after, 0)
                    complete = true
                    break
                end
                test.eq(assert(store.catalog(db, h.id)).applied_seq, seq - 1)
                before = after
            end
            test.is_true(complete)
            test.eq(assert(store.catalog(db, h.id)).generation, current.generation + 1)
            db:release()
        end)
    end)
end
return { run = test.run_cases(define) }
