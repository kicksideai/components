-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local funcs = require("funcs")
local json = require("json")

local function define()
    test.describe("retention sweep budget", function()
        for _,teardown in ipairs({false,true}) do
        test.it(teardown and "shares retention with sustained teardown" or "rotates past a replenished early catalog",function()
            local h=fixture.catalog()
            local db=assert(store.open())
            local early,later="0-fair-a-"..h.id,"0-fair-b-"..h.id
            local compiled=assert(store.catalog(db,h.id)).compiled
            compiled.policy={audit_days=1,trash_days=1,tombstone_days=1}
            for _,id in ipairs({early,later}) do
                assert(db:execute([[WITH source AS (SELECT * FROM kickside_pim_catalog WHERE catalog_id=$1) INSERT INTO kickside_pim_catalog(catalog_id,generation,compiled,digest,layout_digest,item_table,applied_seq,product_count,item_count,trashed_count,tombstone_floor_seq,created_at,updated_at)
                    SELECT $2,generation,$3,digest,layout_digest,item_table,applied_seq,0,0,0,0,created_at,updated_at FROM source]],{h.id,id,json.encode(compiled)}))
            end
            assert(db:execute("UPDATE kickside_pim_retention SET catalog_id='',inclusive=0,product_after='',deadline_ms=NULL WHERE owner_id='pim'",{}))
            assert(db:execute("INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at) VALUES($1,1,1,'schema','schema','a','2000-01-01T00:00:00Z')",{later}))
            local advanced=false
            for pass=1,5 do
                local tx=assert(db:begin())
                for n=1,501 do assert(tx:execute("INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at) VALUES($1,$2,1,'schema','schema','a','2000-01-01T00:00:00Z')",{early,pass*1000+n})) end
                assert(tx:commit())
                local out=assert(funcs.call(teardown and "app:retention_fair_owner" or "kickside.pim.retention:owner",{}))
                test.is_true(out.success,tostring(out.error))
                test.is_true(out.deleted<=500)
                test.is_true(out.needs_continue,"eligible backlog requests continuation")
                if tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id=$1",{later}))[1].n)==0 then advanced=true;break end
            end
            assert(db:execute("DELETE FROM kickside_pim_change WHERE catalog_id IN ($1,$2)",{early,later}))
            assert(db:execute("DELETE FROM kickside_pim_catalog WHERE catalog_id IN ($1,$2)",{early,later}))
            assert(db:release())
            test.is_true(advanced,"later catalogs receive retention while earlier work is replenished")
        end)
        end
        test.it("pages across catalogs with durable progress and one overall row budget", function()
            local h = fixture.catalog()
            local db = assert(store.open())
            local compiled = assert(store.catalog(db, h.id)).compiled
            compiled.policy = { audit_days = 1, trash_days = 1, tombstone_days = 1 }
            local encoded = assert(json.encode(compiled))
            local tx = assert(db:begin())
            for c = 1, 11 do
                local id = string.format("z-retention-%03d", c)
                assert(tx:execute([[WITH source AS (SELECT * FROM kickside_pim_catalog WHERE catalog_id = $1)
                    INSERT INTO kickside_pim_catalog (catalog_id, generation, compiled, digest, layout_digest, item_table,
                    applied_seq, product_count, item_count, trashed_count, tombstone_floor_seq, created_at, updated_at)
                    SELECT $2, generation, $3, digest, layout_digest, item_table, applied_seq, 0, 0, 0, 0, created_at, updated_at
                    FROM source]], { h.id, id, encoded }))
                for i = 1, (c==1 and 501 or 1) do
                    assert(tx:execute([[INSERT INTO kickside_pim_change (catalog_id, seq, n, subject, kind, actor, at)
                        VALUES ($1, $2, 1, 'schema', 'schema', 'actor', '2000-01-01T00:00:00Z')]], { id, i }))
                end
            end
            test.eq(tonumber(assert(tx:query("SELECT COUNT(*) AS n FROM kickside_pim_catalog WHERE catalog_id LIKE 'z-retention-%'", {}))[1].n), 11)
            assert(tx:commit())
            db:release()
            local done = false
            local previous: string? = nil
            local advanced = false
            for _ = 1, 1000 do
                local out, err = funcs.call("kickside.pim.retention:owner", {})
                test.is_nil(err, tostring(err))
                test.is_true(out.success, tostring(out.error))
                test.is_true(out.deleted <= 500, "overall retention row budget")
                test.is_true(out.catalogs <= 10, "catalog page budget")
                local read = assert(store.open())
                local position = assert(read:query("SELECT catalog_id, inclusive FROM kickside_pim_retention WHERE owner_id = 'pim'", {}))[1]
                local current = tostring(position.catalog_id) .. ":" .. tostring(position.inclusive)
                if previous and previous ~= current then advanced = true end
                previous = current
                local left = assert(read:query("SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id LIKE 'z-retention-%'", {}))[1].n
                read:release()
                if not out.needs_continue then
                    test.eq(tonumber(left), 0)
                    done = true
                    break
                end
            end
            test.is_true(done)
            test.is_true(advanced)
            local cleanup = assert(store.open())
            assert(cleanup:execute("DELETE FROM kickside_pim_catalog WHERE catalog_id LIKE 'z-retention-%'", {}))
            cleanup:release()
        end)
    end)
end
return { run = test.run_cases(define) }
