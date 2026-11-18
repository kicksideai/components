-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local retention_rows = require("retention_rows")
local defaults = require("defaults")
local contract = require("contract")
local types = require("types")
local fixture = require("fixture")
local store = require("store")
local funcs = require("funcs")
local json = require("json")

local function execute(db, statement: string, params: types.SqlParams?)
    local result, err = db:execute(statement, params or {})
    assert(result, tostring(err))
    return result
end

local function query(db, statement: string, params: types.SqlParams?): { types.Row }
    local rows, err = db:query(statement, params or {})
    assert(rows, tostring(err))
    return rows
end

local function count(db, statement: string, params: types.SqlParams?): integer
    return assert(math.tointeger(tonumber(query(db, statement, params)[1].n)))
end

local function owner()
    local result, err = funcs.call("kickside.pim.retention:owner", {})
    assert(not err and result and result.success, tostring(err or (result and result.error)))
    return result
end

local function reset_position(db)
    assert(not retention_rows.advance(db, { catalog_id = "", inclusive = 0, product_after = "" }))
end

local function start_at(db, catalog_id: string)
    assert(not retention_rows.advance(db, { catalog_id = catalog_id, inclusive = 1, product_after = "" }))
end

local function series(last: integer): string
    return "WITH RECURSIVE nums(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM nums WHERE n<" .. last .. ") "
end

local function define()
    test.describe("retention sweep budget", function()
        test.it("retains an active catalog at the minimum budget under sustained global work and teardown", function()
            local h = fixture.catalog({ bare = true })
            local db = assert(store.open())
            local original = assert(defaults.read()).maintenance_rows
            local settings = assert(assert(contract.get("kickside.settings:settings")):open())
            local function set_rows(value: integer)
                local answer, err = settings:set({ namespace = "kickside.pim", key = "maintenance_rows",
                    value = value, actor_id = "harness" })
                assert(answer and answer.success, tostring(err or (answer and answer.error)))
            end
            local deleting = "0-retention-min-delete"
            execute(db, "INSERT INTO kickside_pim_cleanup(catalog_id,cleaned) VALUES($1,0)", { deleting })
            execute(db, series(31) .. [[INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                SELECT $1,n,1,'schema','schema','audit','1900-01-01T00:00:00Z' FROM nums]], { deleting })
            execute(db, [[INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                VALUES($1,12345,1,'schema','schema','audit','1900-01-01T00:00:00Z')]], { h.id })
            start_at(db, h.id)
            set_rows(20)
            local removed, visits = 0, 0
            local ran, err = pcall(function()
                for pass = 1, 3 do
                    for i = 1, 5 do
                        local component_id = string.format("00000000-0000-4000-8000-%012d", pass * 5 + i)
                        execute(db, [[INSERT INTO kickside_pim_creation(catalog_id,component_id,request,token,reserved_at)
                            VALUES($1,$2,'{}','token','1900-01-01T00:00:00Z')]], { deleting, component_id })
                        execute(db, [[INSERT INTO kickside_pim_receipt(catalog_id,marker,request_hash,result,first_seq,event_count,noop,expires_at)
                            VALUES($1,$2,'hash','{}',0,0,1,'1900-01-01T00:00:00Z')]], { deleting, component_id })
                    end
                    local sweep = owner()
                    test.is_true(sweep.deleted <= 20)
                    removed = removed + sweep.deleted
                    visits = visits + sweep.catalogs
                end
            end)
            set_rows(original)
            local left = count(db, "SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id=$1 AND seq=12345", { h.id })
            execute(db, "DELETE FROM kickside_pim_change WHERE catalog_id=$1 OR (catalog_id=$2 AND seq=12345)", { deleting, h.id })
            execute(db, "DELETE FROM kickside_pim_creation WHERE catalog_id=$1", { deleting })
            execute(db, "DELETE FROM kickside_pim_receipt WHERE catalog_id=$1", { deleting })
            execute(db, "DELETE FROM kickside_pim_cleanup WHERE catalog_id=$1", { deleting })
            reset_position(db)
            assert(db:release())
            assert(ran, tostring(err))
            test.eq(left, 0, string.format("%d rows removed and %d catalogs visited over three callbacks", removed, visits))
        end)

        test.it("shares the visit limit between queued teardowns and ordinary catalog retention", function()
            local h = fixture.catalog({ bare = true })
            local db = assert(store.open())
            local cap = assert(defaults.read()).maintenance_catalogs
            test.eq(cap, 10)
            local tx = assert(db:begin())
            execute(tx, series(8) .. [[INSERT INTO kickside_pim_catalog(catalog_id,generation,compiled,digest,layout_digest,item_table,
                applied_seq,product_count,item_count,trashed_count,tombstone_floor_seq,created_at,updated_at)
                SELECT '0-retention-active-'||CAST(n AS TEXT),generation,compiled,digest,layout_digest,item_table,
                applied_seq,0,0,0,0,created_at,updated_at FROM nums,kickside_pim_catalog WHERE catalog_id=$1]], { h.id })
            execute(tx, series(8) .. [[INSERT INTO kickside_pim_cleanup(catalog_id,cleaned)
                SELECT '0-retention-delete-'||CAST(n AS TEXT),0 FROM nums]])
            execute(tx, series(50) .. [[INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                SELECT catalog_id,n,1,'schema','schema','audit','2000-01-01T00:00:00Z' FROM nums,kickside_pim_cleanup
                WHERE catalog_id LIKE '0-retention-delete-%']])
            execute(tx, [[INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                SELECT catalog_id,1,1,'schema','schema','audit','2000-01-01T00:00:00Z' FROM kickside_pim_catalog
                WHERE catalog_id LIKE '0-retention-active-%']])
            assert(tx:commit())
            start_at(db, "0-retention-active-1")
            assert(db:release())
            local sweep = owner()
            local read = assert(store.open())
            local ordinary = 8 - count(read, [[SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id LIKE '0-retention-active-%']])
            local teardown = count(read, [[SELECT COUNT(*) AS n FROM kickside_pim_cleanup
                WHERE catalog_id LIKE '0-retention-delete-%' AND attempted_at<>'']])
            execute(read, "DELETE FROM kickside_pim_change WHERE catalog_id LIKE '0-retention-%'")
            execute(read, "DELETE FROM kickside_pim_cleanup WHERE catalog_id LIKE '0-retention-delete-%'")
            execute(read, "DELETE FROM kickside_pim_catalog WHERE catalog_id LIKE '0-retention-active-%'")
            reset_position(read)
            assert(read:release())
            test.is_true(ordinary > 0 and teardown > 0)
            test.is_true(ordinary + teardown <= sweep.catalogs)
            test.is_true(sweep.catalogs <= cap, string.format("%d ordinary + %d teardown catalogs; reported %d; configured cap %d",
                ordinary, teardown, sweep.catalogs, cap))
        end)

        test.it("alternates real teardown and active retention at both minimum settings", function()
            local h = fixture.catalog({ bare = true })
            local db = assert(store.open())
            local settings = assert(assert(contract.get("kickside.settings:settings")):open())
            local original = assert(defaults.read())
            local function change(key: string, value: integer)
                local result, err = settings:set({ namespace = "kickside.pim", key = key, value = value, actor_id = "harness" })
                assert(result and result.success, tostring(err or (result and result.error)))
            end

            local active, deleting = "0-retention-single-active", "0-retention-single-delete"
            execute(db, [[INSERT INTO kickside_pim_catalog(catalog_id,generation,compiled,digest,layout_digest,item_table,
                applied_seq,product_count,item_count,trashed_count,tombstone_floor_seq,created_at,updated_at)
                SELECT $1,generation,compiled,digest,layout_digest,item_table,applied_seq,0,0,0,0,created_at,updated_at
                FROM kickside_pim_catalog WHERE catalog_id=$2]], { active, h.id })
            execute(db, "INSERT INTO kickside_pim_cleanup(catalog_id,cleaned) VALUES($1,0)", { deleting })
            start_at(db, active)
            change("maintenance_rows", 20)
            change("maintenance_catalogs", 1)
            local ran, err = pcall(function()
                for pass = 1, 3 do
                    local seq = pass * 100
                    for _, id in ipairs({ active, deleting }) do
                        execute(db, series(30) .. [[INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                            SELECT $1,$2+n,1,'schema','schema','fixture','1900-01-01T00:00:00Z' FROM nums]], { id, seq })
                    end
                    local before_active = count(db, "SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id=$1", { active })
                    local before_delete = count(db, "SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id=$1", { deleting })
                    local sweep = owner()
                    local active_rows = before_active - count(db, "SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id=$1", { active })
                    local delete_rows = before_delete - count(db, "SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id=$1", { deleting })
                    test.eq(sweep.catalogs, 1)
                    test.is_true(sweep.needs_continue)
                    test.is_true(active_rows + delete_rows <= 20)
                    if pass == 1 then
                        test.is_true(active_rows > 0)
                        test.eq(delete_rows, 0)
                    elseif pass == 2 then
                        test.is_true(delete_rows > 0)
                        test.eq(active_rows, 0)
                    end
                end
            end)
            change("maintenance_rows", original.maintenance_rows)
            change("maintenance_catalogs", original.maintenance_catalogs)
            execute(db, "DELETE FROM kickside_pim_change WHERE catalog_id IN ($1,$2)", { active, deleting })
            execute(db, "DELETE FROM kickside_pim_cleanup WHERE catalog_id=$1", { deleting })
            execute(db, "DELETE FROM kickside_pim_catalog WHERE catalog_id=$1", { active })
            reset_position(db)
            assert(db:release())
            assert(ran, tostring(err))
        end)

        test.it("checkpoints teardown keys within the catalog budget and reaches the next active catalog", function()
            local h = fixture.catalog({ bare = true })
            local db = assert(store.open())
            local settings = assert(assert(contract.get("kickside.settings:settings")):open())
            local original = assert(defaults.read()).maintenance_catalogs
            local function set_cap(value: integer)
                local result, err = settings:set({ namespace = "kickside.pim", key = "maintenance_catalogs", value = value, actor_id = "harness" })
                assert(result and result.success, tostring(err or (result and result.error)))
            end
            local first = "0-retention-scan-1"
            local second = "0-retention-scan-2"
            local active = "0-retention-scan-3"
            local deleting = "0-retention-scan-work"
            for _, id in ipairs({ first, second, active }) do
                execute(db, [[INSERT INTO kickside_pim_catalog(catalog_id,generation,compiled,digest,layout_digest,item_table,
                    applied_seq,product_count,item_count,trashed_count,tombstone_floor_seq,created_at,updated_at)
                    SELECT $1,generation,compiled,digest,layout_digest,item_table,applied_seq,0,0,0,0,created_at,updated_at
                    FROM kickside_pim_catalog WHERE catalog_id=$2]], { id, h.id })
            end
            -- Give teardown its own backlog so neither skipped catalog disappears between scans.
            execute(db, [[INSERT INTO kickside_pim_cleanup(catalog_id,cleaned,attempted_at)
                VALUES($1,0,'9999'),($2,0,'9999'),($3,0,'')]], { first, second, deleting })
            execute(db, series(120) .. [[INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                SELECT $1,n,1,'schema','schema','fixture','1900-01-01T00:00:00Z' FROM nums]], { deleting })
            execute(db, [[INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                VALUES($1,1,1,'schema','schema','fixture','1900-01-01T00:00:00Z')]], { active })
            local function remaining(id: string): integer
                return count(db, "SELECT COUNT(*) AS n FROM kickside_pim_change WHERE catalog_id=$1", { id })
            end

            start_at(db, first)
            set_cap(1)
            local ran, err = pcall(function()
                for i, id in ipairs({ first, second }) do
                    local sweep = owner()
                    test.is_true(sweep.needs_continue)
                    test.eq(assert(retention_rows.position(db)).catalog_id, id)
                    test.eq(remaining(active), 1)
                    test.eq(remaining(deleting), 120 - 50 * (i - 1))

                    test.eq(owner().catalogs, 1)
                    test.eq(assert(retention_rows.position(db)).catalog_id, id)
                    test.eq(remaining(deleting), 120 - 50 * i)
                end
                test.eq(owner().catalogs, 1)
                test.eq(remaining(active), 0)
            end)
            set_cap(original)
            execute(db, "DELETE FROM kickside_pim_change WHERE catalog_id IN ($1,$2)", { active, deleting })
            execute(db, "DELETE FROM kickside_pim_cleanup WHERE catalog_id IN ($1,$2,$3)", { first, second, deleting })
            execute(db, "DELETE FROM kickside_pim_catalog WHERE catalog_id IN ($1,$2,$3)", { first, second, active })
            reset_position(db)
            assert(db:release())
            assert(ran, tostring(err))
        end)

        test.it("rotates past a replenished early catalog",function()
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
                local out=assert(funcs.call("kickside.pim.retention:owner",{}))
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
