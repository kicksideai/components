-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local cleanup_rows = require("cleanup_rows")
local retention_rows = require("retention_rows")
local types = require("types")
local funcs = require("funcs")
local time = require("time")
local json = require("json")
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local store = require("store")

local TABLES = { "creation", "receipt", "import_work", "import_map", "schema_work", "release_job", "change", "proposal",
    "publication", "publication_floor", "release", "attribute_usage", "unique_value", "ref", "product", "term", "generation", "merge", "catalog" }
local function counts(catalog_id: string): integer
    local db = assert(store.open())
    local total = 0
    for _, name in ipairs(TABLES) do
        local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_" .. name .. " WHERE catalog_id = $1", { catalog_id }))
        total = total + (tonumber(rows[1].n) :: integer)
    end
    local current, cerr = store.catalog(db, catalog_id)
    assert(not cerr, tostring(cerr))
    if current then
        for _, suffix in ipairs({ "_item", "_set", "_fts" }) do
            local name = current.item_table .. suffix
            local exists, err = store.table_exists(db, db:type(), name)
            assert(not err, tostring(err))
            if exists then
                local rows = assert(db:query("SELECT COUNT(*) AS n FROM " .. name, {}))
                total = total + (tonumber(rows[1].n) :: integer)
            end
        end
    end
    db:release()
    return total
end
local function reports(catalog_id: string): integer
    local db = assert(store.open())
    local rows = assert(db:query("SELECT body FROM kickside_event WHERE type = $1", { "kickside.lifecycle.events:component.deleted" }))
    db:release()
    local n = 0
    for _, row in ipairs(rows) do
        local body = assert(json.decode(row.body))
        if body.subject_id == catalog_id then n = n + 1 end
    end
    return n
end

local function unregistered(catalog_id: string): boolean
    local deadline = time.now():add(30 * time.SECOND)
    repeat
        local db = assert(store.open())
        local rows = assert(db:query("SELECT component_id FROM kickside_components WHERE component_id = $1", { catalog_id }))
        assert(db:release())
        if #rows == 0 then return true end
        time.sleep("10ms")
    until not time.now():before(deadline)
    return false
end

local function define()
    test.describe("bounded catalog teardown", function()
        test.it("refuses direct teardown with a forged catalog context without DELETE access", function()
            for _, mask in ipairs({ 1, 11 }) do
                local owner, caller = scoped.member(), scoped.member()
                local h = scoped.catalog(owner)
                assert(h.call("grant", { subject_id = caller.id, mask = mask }))
                local before = counts(h.id)
                local out, err = caller.call("delete_catalog_rows", {}, h.id)
                local after = counts(h.id)
                test.is_nil(out)
                test.not_nil(err)
                test.eq(err:kind(), errors.PERMISSION_DENIED)
                test.eq(after, before)
            end
        end)

        test.it("unregisters a large catalog and resumes cleanup in fresh owner invocations before reporting deletion", function()
            local h, other = fixture.catalog(), fixture.catalog()
            fixture.boot(h)
            fixture.boot(other)
            local db = assert(store.open())
            local current = assert(store.catalog(db, h.id))
            local tx = assert(db:begin())
            assert(tx:execute([[INSERT INTO kickside_pim_creation(catalog_id,component_id,request,token)
                VALUES($1,$2,'{}','fixture')]], { h.id, h.id .. "-fixture" }))
            assert(tx:execute([[INSERT INTO kickside_pim_receipt(catalog_id,marker,request_hash,result,first_seq,event_count,noop,expires_at)
                VALUES($1,'cleanup-fixture','hash','{}',0,0,1,'2099-01-01T00:00:00Z')]], { h.id }))
            assert(tx:execute([[INSERT INTO kickside_pim_import_work(catalog_id,request_id,storage_id,path,identity,position,job_id,done)
                VALUES($1,'request','storage','path','{}','{}','job',0)]], { h.id }))
            assert(tx:execute([[INSERT INTO kickside_pim_import_map(catalog_id,old_id,new_id,sku,refs)
                VALUES($1,'old','new','sku','[]')]], { h.id }))
            assert(tx:execute([[INSERT INTO kickside_pim_publication_floor(catalog_id,channel,seq,product_id)
                VALUES($1,'web',1,'deleted')]], { h.id }))
            assert(tx:execute("INSERT INTO kickside_pim_schema_work (catalog_id, seq) VALUES ($1, 1000)", { h.id }))
            for i = 1, 501 do
                local key = "cleanup-" .. i
                assert(tx:execute([[INSERT INTO kickside_pim_release_job (catalog_id, request_id, model_id, root, identity, job_id, after_product, done)
                    VALUES ($1, $2, $2, 1, '{}', $2, '', 0)]], { h.id, key }))
                assert(tx:execute("INSERT INTO " .. current.item_table .. "_item (product_id, root_id, family, status, version, updated_seq, findings) VALUES ($1, $1, 'generic', 'active', 1, 1, '{}')", { key }))
                assert(tx:execute("INSERT INTO " .. current.item_table .. "_set (product_id, col, value_key) VALUES ($1, 'cleanup', 'value')", { key }))
                assert(tx:execute([[INSERT INTO kickside_pim_change (catalog_id, seq, n, subject, kind, actor, at) VALUES ($1, $2, 1, 'schema', 'schema', 'actor', 'now')]], { h.id, 10000 + i }))
                assert(tx:execute([[INSERT INTO kickside_pim_merge (catalog_id, vocabulary, from_code, into_code, identity, requested_by, created_at) VALUES ($1, 'v', $2, 'b', '{}', 'actor', 'now')]], { h.id, key }))
                assert(tx:execute([[INSERT INTO kickside_pim_term (catalog_id, vocabulary, code, labels, retired, updated_seq) VALUES ($1, 'v', $2, '{}', 0, 1)]], { h.id, key }))
                assert(tx:execute([[INSERT INTO kickside_pim_ref (catalog_id, product_id, attribute_id, ctx, path, kind, target) VALUES ($1, $2, 1, '', '', 'term', 'v:b')]], { h.id, key }))
                assert(tx:execute([[INSERT INTO kickside_pim_unique_value (catalog_id, attribute_id, value_key, product_id) VALUES ($1, 1, $2, $2)]], { h.id, key }))
                assert(tx:execute([[INSERT INTO kickside_pim_attribute_usage (catalog_id, attribute_id, products) VALUES ($1, $2, 1)]], { h.id, 10000 + i }))
                assert(tx:execute([[INSERT INTO kickside_pim_proposal (catalog_id, proposal_id, origin, items, base, status, created_by, created_at) VALUES ($1, $2, '{}', '[]', '{}', 'pending', 'actor', 'now')]], { h.id, key }))
                assert(tx:execute([[INSERT INTO kickside_pim_release (catalog_id, release_id, product_id, version, generation, snapshot, hash, channels, seq, created_at) VALUES ($1, $2, $2, 1, 1, '{}', 'hash', '[]', 1, 'now')]], { h.id, key }))
                assert(tx:execute([[INSERT INTO kickside_pim_publication (catalog_id, channel, product_id, state, seq, updated_at) VALUES ($1, 'web', $2, 'withdrawn', 1, 'now')]], { h.id, key }))
                assert(tx:execute([[WITH source AS (SELECT * FROM kickside_pim_catalog WHERE catalog_id = $1) INSERT INTO kickside_pim_generation (catalog_id, generation, declaration, compiled, digest, class, actor, applied_seq, applied_at) SELECT catalog_id, $2, '{}', compiled, digest, 'cosmetic', 'actor', 1, 'now' FROM source]], { h.id, 10000 + i }))
                assert(tx:execute([[INSERT INTO kickside_pim_product (catalog_id, product_id, sku, family, root_id, level, is_item, version, status, state, document, source_seq, created_seq, updated_seq) VALUES ($1, $2, $2, 'generic', $2, 0, 1, 1, 'active', 'purged', '{}', '{}', 1, 1)]], { h.id, key }))
            end
            assert(tx:commit())
            db:release()
            local keep = counts(other.id)
            local before = counts(h.id)
            local deleted, derr = h.call("delete_component", {})
            test.is_nil(derr, tostring(derr))
            test.is_true(deleted.success, tostring(deleted.error))
            test.is_true(unregistered(h.id), "Core unregisters the component after the first page")
            local after = counts(h.id)
            test.is_true(before - after <= 500, "deletable row budget")
            test.is_true(after < before)
            test.is_true(after > 0)
            test.eq(reports(h.id), 0, "no lifecycle report precedes cleanup completion")
            before = after
            local pages = 1
            for _ = 1, (before+49)//50+20 do
                local out, err = funcs.call("kickside.pim.retention:owner", {})
                test.is_nil(err, tostring(err))
                local after = counts(h.id)
                test.is_true(out.success, tostring(out.error))
                test.is_true(before - after <= 50, "one teardown catalog receives at most 50 rows per owner pass")
                pages = pages + 1
                if after == 0 then break end
                test.is_true(out.needs_continue)
                test.eq(reports(h.id), 0, "partial cleanup does not report deletion")
                test.is_true(after < before)
                before = after
            end
            test.eq(counts(h.id), 0)
            local verify = assert(store.open())
            for _, name in ipairs(TABLES) do
                local rows = assert(verify:query("SELECT COUNT(*) AS n FROM kickside_pim_" .. name .. " WHERE catalog_id = $1", { h.id }))
                test.eq(tonumber(rows[1].n), 0, name)
            end
            for _, suffix in ipairs({ "_item", "_set", "_fts" }) do
                local exists, err = store.table_exists(verify, verify:type(), current.item_table .. suffix)
                test.is_nil(err, tostring(err))
                test.is_false(exists, current.item_table .. suffix)
            end
            assert(verify:release())
            test.eq(reports(h.id), 1)
            local again, aerr = funcs.call("kickside.pim.retention:owner", {})
            test.is_nil(aerr, tostring(aerr))
            test.is_true(again.success, tostring(again.error))
            test.eq(reports(h.id), 1, "completion is reported once")
            test.eq(counts(other.id), keep)
        end)

        test.it("resumes a committed teardown awaiting its lifecycle report", function()
            local h = fixture.catalog({ bare = true })
            local db = assert(store.open())
            assert(db:execute([[WITH RECURSIVE nums(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM nums WHERE n<501)
                INSERT INTO kickside_pim_change(catalog_id,seq,n,subject,kind,actor,at)
                SELECT $1,n+1000,1,'schema','schema','fixture','2000-01-01T00:00:00Z' FROM nums]], { h.id }))
            assert(db:release())
            test.is_true(assert(h.call("delete_component", {})).success)
            test.is_true(unregistered(h.id))
            local done, derr = store.transaction("finish fixture data page", function(tx: types.Executor, dialect: string): (boolean?, error?)
                local complete, err = cleanup_rows.catalog(tx, dialect, h.id, 50)
                if err or not complete then return nil, err end
                return true, retention_rows.enqueue_cleanup(tx, h.id, true)
            end)
            test.is_nil(derr, tostring(derr))
            test.is_true(done)
            test.eq(counts(h.id), 0)
            test.eq(reports(h.id), 0, "the last data page was committed before the report")
            local resumed, rerr = funcs.call("kickside.pim.retention:owner", {})
            test.is_nil(rerr, tostring(rerr))
            test.is_true(resumed.success, tostring(resumed.error))
            local check = assert(store.open())
            local queue = assert(check:query("SELECT catalog_id FROM kickside_pim_cleanup WHERE catalog_id=$1", { h.id }))
            assert(check:release())
            test.eq(#queue, 0)
            test.eq(reports(h.id), 1)
            test.is_true(assert(fixture.retain()).success)
            test.eq(reports(h.id), 1)
        end)
    end)
    test.describe("catalog cleanup", function()
        test.it("removes pending merge rows only for the deleted catalog", function()
            local db = assert(store.open())
            for _, id in ipairs({ "cleanup-delete", "cleanup-keep" }) do
                assert(db:execute([[INSERT INTO kickside_pim_merge (catalog_id, vocabulary, from_code, into_code, identity, requested_by, created_at)
                    VALUES ($1, 'v', 'a', 'b', '{}', 'actor', 'now')]], { id }))
            end
            local done, derr = cleanup_rows.catalog(db, db:type(), "cleanup-delete", 500)
            test.is_nil(derr)
            test.is_true(done)
            local rows = assert(db:query("SELECT catalog_id FROM kickside_pim_merge WHERE catalog_id IN ($1, $2)", { "cleanup-delete", "cleanup-keep" }))
            db:execute("DELETE FROM kickside_pim_merge WHERE catalog_id = $1", { "cleanup-keep" })
            db:release()
            test.eq(#rows, 1)
            test.eq(rows[1].catalog_id, "cleanup-keep")
        end)
    end)

end
return { run = test.run_cases(define) }
