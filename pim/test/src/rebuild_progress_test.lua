-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local values = require("values")
local worker = require("worker")
local jobs_fixture = require("jobs_fixture")
local clock = require("clock")

local function define()
    test.describe("resumable rebuilds", function()
        test.it("rejects missing and malformed batch deadlines", function()
            local h = fixture.catalog()
            for _, case in ipairs({ { code = "job_deadline_required" }, { deadline = "tomorrow", code = "job_deadline_invalid" } }) do
                local out, err = h.call("rebuild_batch", { deadline = case.deadline })
                test.is_nil(out)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, case.code)
            end
        end)

        test.it("leaves rebuild state untouched when a five-second batch cannot fit", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_catalog SET rebuild_after = '', rebuild_seq = applied_seq WHERE catalog_id = $1", { h.id }))
            local before = assert(store.catalog(db, h.id))
            local products = values.canonical(assert(db:query("SELECT * FROM kickside_pim_product WHERE catalog_id = $1 ORDER BY product_id", { h.id })))
            assert(db:release())
            local out, err = h.call("rebuild_batch", { deadline = clock.offset(4) })
            db = assert(store.open())
            local after = assert(store.catalog(db, h.id))
            local unchanged = values.canonical(assert(db:query("SELECT * FROM kickside_pim_product WHERE catalog_id = $1 ORDER BY product_id", { h.id })))
            assert(db:execute("UPDATE kickside_pim_catalog SET rebuild_after = NULL, rebuild_seq = NULL WHERE catalog_id = $1", { h.id }))
            assert(db:release())
            test.is_nil(err, tostring(err))
            test.is_false(out.done)
            test.eq(after.rebuild_after, before.rebuild_after)
            test.eq(after.rebuild_seq, before.rebuild_seq)
            test.eq(after.applied_seq, before.applied_seq)
            test.eq(unchanged, products)
        end)

        test.it("resumes after 500 rows stamps live and trashed products and preserves later stamps and complete history", function()
            local h = fixture.catalog({ bare = true })
            assert(h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "name", type = "kickside.pim.types:text", default = "Rebuilt", index = "key" },
            } } } } }))
            local db = assert(store.open())
            local tx = assert(db:begin())
            for i = 1, 501 do
                local id = string.format("p%05d", i)
                assert(tx:execute([[INSERT INTO kickside_pim_product
                    (catalog_id, product_id, sku, family, root_id, level, is_item, version, status, state, document, source_seq, created_seq, updated_seq)
                    VALUES ($1, $2, $2, 'generic', $2, 0, 1, 1, 'active', $3, '{}', '{}', 1, $4)]],
                    { h.id, id, i % 2 == 0 and "trashed" or "live", i == 1 and 2002 or 1 }))
            end
            assert(tx:execute("UPDATE kickside_pim_catalog SET rebuild_after = '', rebuild_seq = 1001 WHERE catalog_id = $1", { h.id }))
            assert(tx:commit())
            local before = values.canonical(assert(db:query("SELECT * FROM kickside_pim_change WHERE catalog_id = $1 ORDER BY seq, n", { h.id })))
            assert(db:release())
            local first, ferr = h.call("rebuild_batch", { deadline = "2090-01-01T00:00:00Z" })
            test.is_nil(ferr, tostring(ferr))
            test.is_false(first.done)
            db = assert(store.open())
            local saved = assert(store.catalog(db, h.id)).rebuild_after
            local completed = assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_product WHERE catalog_id = $1 AND updated_seq >= 1001", { h.id }))[1].n
            assert(db:release())
            test.eq(saved, "p00500")
            test.eq(tonumber(completed), 500)
            local second, serr = h.call("rebuild_batch", { deadline = "2090-01-01T00:00:00Z" })
            test.is_nil(serr, tostring(serr))
            test.is_true(second.done)
            db = assert(store.open())
            local current = assert(store.catalog(db, h.id))
            local rows = assert(db:query("SELECT product_id, updated_seq, version FROM kickside_pim_product WHERE catalog_id = $1 ORDER BY product_id", { h.id }))
            local after = values.canonical(assert(db:query("SELECT * FROM kickside_pim_change WHERE catalog_id = $1 ORDER BY seq, n", { h.id })))
            local derived = assert(db:query("SELECT COUNT(*) AS n FROM " .. current.item_table .. "_item", {}))[1].n
            assert(db:release())
            test.is_nil(current.rebuild_after)
            test.is_nil(current.rebuild_seq)
            test.eq(#rows, 501)
            for i, row in ipairs(rows) do
                test.eq(tonumber(row.updated_seq), i == 1 and 2002 or 1001)
                test.eq(tonumber(row.version), 1)
            end
            test.eq(tonumber(derived), 251)
            test.eq(after, before)
        end)

        test.it("rearms after twenty batches and resumes the remaining batch in the next execution", function()
            jobs_fixture.reset(nil)
            jobs_fixture.done_after(21)
            local input = { job = { id = "job", lease_token = "lease", execution_seq = 1, deadline = clock.offset(600) }, payload = { catalog_id = "catalog" } }
            local first, ferr = worker.run(input)
            test.is_nil(ferr, tostring(ferr))
            test.is_true(first.self_completed)
            test.eq(jobs_fixture.calls, 20)
            test.eq(jobs_fixture.completed, 1)
            local second, serr = worker.run(input)
            test.is_nil(serr, tostring(serr))
            test.is_true(second.rebuilt)
            test.eq(jobs_fixture.calls, 21)
            test.eq(jobs_fixture.completed, 1)
        end)
    end)
end
return { run = test.run_cases(define) }
