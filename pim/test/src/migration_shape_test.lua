-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local store = require("store")
local function define()
    test.describe("initial catalog schema", function()
        test.it("registers the catalog migrations and creates durable tables and retention state", function()
            local entries = assert(registry.find({ ["meta.type"] = "migration" }))
            local ids = {}
            for _, entry in ipairs(entries) do
                if tostring(entry.id):match("^kickside.pim.migrations:") then ids[#ids + 1] = tostring(entry.id) end
            end
            table.sort(ids)
            test.eq(#ids, 2)
            test.eq(ids[1], "kickside.pim.migrations:01_catalog")
            test.eq(ids[2], "kickside.pim.migrations:02_proposal_facts")
            local db = assert(store.open())
            for _, name in ipairs({ "merge", "release_job", "schema_work", "retention", "cleanup" }) do
                local exists, err = store.table_exists(db, db:type(), "kickside_pim_" .. name)
                test.is_nil(err, tostring(err))
                test.is_true(exists, name)
            end
            local rows = assert(db:query("SELECT owner_id FROM kickside_pim_retention WHERE owner_id = 'pim'", {}))
            db:release()
            test.eq(#rows, 1)
        end)
        test.it("indexes retired product eligibility by catalog, state and time", function()
            local db = assert(store.open())
            local statement = db:type() == "postgres" and
                "SELECT indexdef AS definition FROM pg_indexes WHERE indexname='kickside_pim_product_retention'" or
                "SELECT sql AS definition FROM sqlite_master WHERE type='index' AND name='kickside_pim_product_retention'"
            local rows = assert(db:query(statement, {}))
            db:release()
            test.eq(#rows, 1)
            local definition = rows[1].definition
            test.not_nil(definition:find("catalog_id, state, state_at", 1, true))
            test.not_nil(definition:find("state <> 'live'", 1, true))
        end)
        test.it("keeps the pending release page's position in its frozen command alone", function()
            local db = assert(store.open())
            local statement = db:type() == "postgres" and
                "SELECT column_name AS name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'kickside_pim_release_job'" or
                "PRAGMA table_info(kickside_pim_release_job)"
            local columns = assert(db:query(statement, {}))
            assert(db:release())
            local names: { [string]: boolean } = {}
            for _, column in ipairs(columns) do names[column.name] = true end
            test.is_true(names.batch)
            test.is_true(names.after_product)
            test.is_nil(names.batch_after)
        end)
    end)
end
return { run = test.run_cases(define) }
