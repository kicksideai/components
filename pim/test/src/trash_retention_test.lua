-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Trash, restore, purge and retention: a trashed product frees its keys, restore
-- revalidates at the head, and the retention owner purges past the window,
-- leaves tombstones, prunes them and the change history, and raises the floor.
local test = require("test")
local funcs = require("funcs")
local json = require("json")
local steps = require("steps")
local fixture = require("fixture")
local store = require("store")
local retention_rows = require("retention_rows")
local types = require("types")
local clock = require("clock")

local OLD = "2000-01-01T00:00:00Z"

local version = steps.version

local trash_fixture = require("trash_fixture")
local trash, restore, exec, product, run_owner = trash_fixture.trash, trash_fixture.restore, trash_fixture.exec, trash_fixture.product, trash_fixture.run_owner

local function define()
    test.describe("retention across catalogs", function()
        test.it("persists the first full trash page when no other class changes", function()
            local h = fixture.catalog({ bare = true })
            local create: { types.ApplyItem }, deletes: { types.ApplyItem } = {}, {}
            for i = 1, 26 do
                local product = { sku = "RETENTION-TRASH-" .. i }
                create[i] = { product = product, create = { family = "generic" } }
                deletes[i] = { product = product, expect_version = 1, delete = true }
            end
            test.is_true(assert(h.call("apply", { items = create })).applied)
            test.is_true(assert(h.call("apply", { items = deletes })).applied)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_product SET state_at=$1 WHERE catalog_id=$2", { clock.ago(1000), h.id }))
            local tied = assert(db:query([[SELECT product_id FROM kickside_pim_product
                WHERE catalog_id=$1 ORDER BY state_at,product_id LIMIT 1 OFFSET 24]], { h.id }))
            local last = tied[1].product_id
            assert(not retention_rows.advance(db, { catalog_id = h.id, inclusive = 1, product_after = "" }))
            assert(db:release())
            local sweep = assert(funcs.call("kickside.pim.retention:owner", {}))
            test.is_true(sweep.success, tostring(sweep.error))
            test.is_true(sweep.needs_continue)
            local read = assert(store.open())
            local purges = tonumber(assert(read:query("SELECT COUNT(*) AS n FROM kickside_event WHERE thread_id=$1 AND type='kickside.pim.events:product.purged'", { h.id }))[1].n)
            local cursor = assert(json.decode(assert(read:query("SELECT retention_after FROM kickside_pim_catalog WHERE catalog_id=$1", { h.id }))[1].retention_after))
            assert(read:release())
            test.eq(purges, 25)
            test.not_nil(cursor.trash, "full trash page left no durable keyset")
            test.eq(assert(json.decode(cursor.trash)).id, last)
            local settled = assert(h.call("settle", {}))
            test.is_true(settled.done)
            run_owner(h)
            local check = assert(store.open())
            local after = assert(check:query("SELECT retention_after FROM kickside_pim_catalog WHERE catalog_id=$1", { h.id }))[1]
            local left = assert(check:query("SELECT product_id FROM kickside_pim_product WHERE catalog_id=$1 AND state='trashed'", { h.id }))
            assert(check:release())
            test.is_nil(assert(json.decode(after.retention_after)).trash, "a partial page clears the durable keyset")
            test.eq(#left, 0)
        end)

        test.it("keeps retaining the other catalogs when one fails, and reports the failure", function()
            local broken = fixture.catalog()
            fixture.boot(broken)
            local healthy = fixture.catalog()
            fixture.boot(healthy)
            local sku = "RDG-moss-40"
            local version = healthy.call("get", { product = { sku = sku } }).product.version
            local _, derr = healthy.call("apply", { items = { { product = { sku = sku }, expect_version = version, delete = true } } })
            test.is_nil(derr)
            local db = assert(store.open())
            local kept = assert(db:query("SELECT compiled FROM kickside_pim_catalog WHERE catalog_id = $1", { broken.id }))[1].compiled
            assert(db:execute("UPDATE kickside_pim_catalog SET compiled = '{not json' WHERE catalog_id = $1", { broken.id }))
            assert(db:execute("UPDATE kickside_pim_product SET state_at = '2000-01-01T00:00:00Z' WHERE catalog_id = $1 AND state = 'trashed'", { healthy.id }))
            db:release()
            local out, err = fixture.retain()
            local restore = assert(store.open())
            assert(restore:execute("UPDATE kickside_pim_catalog SET compiled = $1 WHERE catalog_id = $2", { kept, broken.id }))
            restore:release()
            test.is_nil(err)
            test.is_true(out.success)
            test.not_nil(out.blocked[1].error)
            local settled, serr = healthy.call("settle", {})
            test.is_nil(serr)
            test.is_true(settled.done)
            local _, gone = healthy.call("get", { product = { sku = sku } })
            test.not_nil(gone)
            local read = assert(store.open())
            local rows = assert(read:query("SELECT state FROM kickside_pim_product WHERE catalog_id = $1 AND sku = $2 AND state = 'purged'", { healthy.id, sku }))
            read:release()
            test.eq(#rows, 1)
        end)
    end)

    test.describe("retention windows", function()
        test.it("purges by the catalog's trash window", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local applied = h.call("apply_schema", { declaration = { policy = { trash_days = 30 } } })
            test.not_nil(applied)
            local id = trash(h, "RDG-moss-41")
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { clock.ago(20), h.id, id })
            run_owner(h)
            test.eq((product(h, id) :: types.Product).state, "trashed")
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { clock.ago(31), h.id, id })
            run_owner(h)
            test.eq((product(h, id) :: types.Product).state, "purged")
        end)

        test.it("prunes history past 365 days when the audit window is zero", function()
            local h = fixture.catalog()
            fixture.boot(h)
            assert(h.call("apply_schema", { declaration = { policy = { audit_days = 0 } } }))
            local subject = "p:" .. h.call("get", { product = { sku = "RDG-moss-40" } }).product.product_id
            exec("UPDATE kickside_pim_change SET at = $1 WHERE catalog_id = $2 AND subject = $3", { clock.ago(364), h.id, subject })
            run_owner(h)
            test.is_true(#h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 50 }).entries > 0)
            exec("UPDATE kickside_pim_change SET at = $1 WHERE catalog_id = $2 AND subject = $3", { clock.ago(366), h.id, subject })
            run_owner(h)
            test.eq(#h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 50 }).entries, 0)
        end)

        test.it("returns retained product history after tombstone removal", function()
            local h = fixture.catalog()
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 1, tombstone_days = 1, audit_days = 365 } } }))
            test.eq(steps.one(h, { product = { sku = "AUDIT-TRAIL" }, create = {} }).outcome, "created")
            local id = trash(h, "AUDIT-TRAIL")
            local function expire()
                exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3",
                    { clock.ago(2), h.id, id })
                run_owner(h)
            end
            expire()
            test.eq(assert(product(h, id)).state, "purged")
            expire()
            test.is_nil(product(h, id))
            local all = assert(h.call("list_history", {})) :: types.HistoryResult
            local subject = "p:" .. id
            local retained = 0
            for _, row in ipairs(all.entries) do
                if row.subject == subject then retained = retained + 1 end
            end
            test.eq(retained, 3)
            local specific, err = h.call("list_history", { product = { id = id } })
            test.is_nil(err, tostring(err))
            test.eq(#(specific :: types.HistoryResult).entries, retained)
            local before: string? = nil
            for _, kind in ipairs({ "purged", "deleted", "created" }) do
                local page = assert(h.call("list_history", { product = { id = id }, before = before, limit = 1 })) :: types.HistoryResult
                test.eq(page.entries[1].kind, kind)
                before = assert(page.next)
            end
            local last = assert(h.call("list_history", { product = { id = id }, before = before })) :: types.HistoryResult
            test.eq(#last.entries, 0)
            exec("UPDATE kickside_pim_change SET at = $1 WHERE catalog_id = $2 AND subject = $3", { clock.ago(366), h.id, subject })
            run_owner(h)
            local _, missing = h.call("list_history", { product = { id = id } })
            test.eq(assert(missing):details().code, "product_not_found")
        end)

        test.it("prunes old change rows in bounded catalog shares", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local count_old = function(): integer
                local db = assert(store.open())
                local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id = $1 AND at < $2", { h.id, "2001-01-01T00:00:00Z" }))
                db:release()
                return math.tointeger(tonumber(rows[1].n)) :: integer
            end
            for i = 1, 501 do
                exec([[INSERT INTO kickside_pim_change (catalog_id, seq, n, subject, kind, attribute_id, ctx, before, after, actor, source, origin, at)
                    VALUES ($1, $2, 1, 'p:x', 'value', NULL, NULL, NULL, NULL, 'a', NULL, NULL, $3)]], { h.id, 1000000 + i, OLD })
            end
            test.eq(count_old(), 501)
            local first = run_owner(h)
            test.is_true(first.needs_continue == true)
            local left=count_old()
            test.is_true(left<501 and left>=451,"one catalog receives at most 50 rows of the shared budget")
            for _=1,50 do if count_old()==0 then break end;run_owner(h) end
            test.eq(count_old(),0)
        end)
    end)

    test.describe("retention owner", function()
        test.it("purges trash past the window and keeps a tombstone until its own window ends", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-41")
            run_owner(h)
            test.eq(product(h, id).state, "trashed")
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { OLD, h.id, id })
            local out = run_owner(h)
            test.is_true(out.deleted >= 1)
            local tomb = product(h, id)
            test.eq(tomb.state, "purged")
            test.eq(next(tomb.document), nil)
            local history = h.call("list_history", { product = { id = id }, limit = 1 })
            test.eq(history.entries[1].kind, "purged")
            test.eq(history.entries[1].actor, "system:kickside.pim.retention")
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { OLD, h.id, id })
            run_owner(h)
            test.is_nil(product(h, id))
            local db = assert(store.open())
            local catalog = assert(store.catalog(db, h.id))
            db:release()
            test.eq(catalog.tombstone_floor_seq, tomb.updated_seq)
        end)

        test.it("purges nothing a restore overtook between the scan and the append", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-40")
            local stale = (product(h, id) :: types.Product).version
            local restored = restore(h, id)
            test.eq(restored.outcome, "updated")
            local current = (product(h, id) :: types.Product).version
            exec("UPDATE kickside_pim_product SET state = 'trashed', state_at = $1, version = $2 WHERE catalog_id = $3 AND product_id = $4",
                { "2000-01-01T00:00:00Z", stale, h.id, id })
            local out = run_owner(h)
            test.is_true(out.needs_continue == true)
            exec("UPDATE kickside_pim_product SET state = 'live', state_at = NULL, version = $1 WHERE catalog_id = $2 AND product_id = $3", { current, h.id, id })
            local db = assert(store.open())
            local purged = assert(db:query("SELECT COUNT(*) AS n FROM kickside_event WHERE thread_id = $1 AND type = $2", { h.id, "kickside.pim.events:product.purged" }))
            db:release()
            test.eq(math.tointeger(purged[1].n), 0)
            test.eq((product(h, id) :: types.Product).state, "live")
        end)

        test.it("purges strictly past the window, leaving a product exactly at its edge", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-40")
            local edge = "2020-06-01T12:00:00Z"
            exec("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { edge, h.id, id })
            local db = assert(store.open())
            local at_edge = assert((retention_rows.trashed(db, h.id, edge, 10)))
            local past = assert((retention_rows.trashed(db, h.id, "2020-06-01T12:00:01Z", 10)))
            db:release()
            test.eq(#at_edge, 0)
            test.eq(#past, 1)
            test.eq(past[1].product_id, id)
        end)

        test.it("leaves a product changed since the scan for a later pass", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = trash(h, "RDG-moss-42")
            exec("UPDATE kickside_pim_product SET state_at = $1, version = version + 7 WHERE catalog_id = $2 AND product_id = $3",
                { OLD, h.id, id })
            local out = run_owner(h)
            test.is_true(out.needs_continue == true)
            test.eq((product(h, id) :: types.Product).state, "trashed")
        end)

        test.it("prunes change history past the audit window", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local before = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 50 })
            exec("UPDATE kickside_pim_change SET at = $1 WHERE catalog_id = $2 AND subject = $3",
                { OLD, h.id, "p:" .. h.call("get", { product = { sku = "RDG-moss-40" } }).product.product_id })
            run_owner(h)
            local after = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 50 })
            test.is_true(#before.entries > 0)
            test.eq(#after.entries, 0)
            test.eq(version(h, "RDG-moss-40"), 1)
        end)
    end)end
return { run = test.run_cases(define) }
