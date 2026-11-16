-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local fixture=require("fixture")
local store=require("store")
local receipts=require("receipts")
local cleanup_rows=require("cleanup_rows")
local clock=require("clock")
local creations=require("creations")
local funcs=require("funcs")
local json=require("json")
local function define()
    test.describe("Review 3 lifecycle and idle retention",function()
        test.it("reclaims aged reservations from denied catalog registrations",function()
            local h=fixture.catalog()
            for n=1,3 do
                local out,err=h.executor:call("app:pim_call",{op="create",request={idempotency_key="denied-"..n,parent_id="missing-parent",title="Denied"}})
                test.is_nil(out);test.not_nil(err)
            end
            local db=assert(store.open())
            test.eq(tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_creation WHERE request LIKE '%missing-parent%'",{}))[1].n),3)
            assert(db:execute("UPDATE kickside_pim_creation SET reserved_at='2000-01-01T00:00:00Z' WHERE request LIKE '%missing-parent%'",{}))
            assert(db:release());assert(fixture.retain())
            db=assert(store.open())
            local n=tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_creation WHERE request LIKE '%missing-parent%'",{}))[1].n)
            assert(db:release());test.eq(n,0)
        end)
        test.it("renews an old pending reservation before retrying registration",function()
            local h=fixture.catalog();local id="r4-renew-"..h.id
            local token=assert(creations.prepare(h.id,id,{retry=true}))
            local db=assert(store.open());assert(db:execute("UPDATE kickside_pim_creation SET reserved_at='2000-01-01T00:00:00Z' WHERE component_id=$1",{id}));assert(db:release())
            test.eq(assert(creations.prepare(h.id,id,{retry=true})),token)
            assert(fixture.retain());db=assert(store.open())
            test.eq(#assert(db:query("SELECT token FROM kickside_pim_creation WHERE component_id=$1",{id})),1)
            assert(db:execute("DELETE FROM kickside_pim_creation WHERE component_id=$1",{id}));assert(db:release())
        end)
        test.it("uses product and published-only publication seeks on both engines",function()
            local h=fixture.catalog();local db=assert(store.open());local tx=assert(db:begin())
            -- An empty catalog lets PostgreSQL cost every owner-only index as a
            -- one-row seek. Model the reviewed large catalog before costing it.
            assert(tx:execute([[WITH RECURSIVE ids(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM ids WHERE n<4000)
                INSERT INTO kickside_pim_publication(catalog_id,channel,product_id,release_id,state,seq,updated_at)
                SELECT $1,'web',CAST(n AS TEXT),CAST(n AS TEXT),'published',1,'2000-01-01T00:00:00Z' FROM ids]],{h.id}))
            assert(tx:execute("ANALYZE kickside_pim_publication",{}))
            if db:type()=="postgres" then assert(tx:execute("SET LOCAL enable_seqscan=off",{})) end
            local explain=db:type()=="sqlite" and "EXPLAIN QUERY PLAN " or "EXPLAIN "
            local plan=json.encode(assert(tx:query(explain.."SELECT p.channel,p.release_id,p.state,r.hash FROM kickside_pim_publication p LEFT JOIN kickside_pim_release r ON r.catalog_id=p.catalog_id AND r.release_id=p.release_id WHERE p.catalog_id=$1 AND p.product_id=$2",{h.id,"2000"})))
            if db:type()=="sqlite" then test.not_nil(plan:find("catalog_id=? AND product_id=?",1,true),plan)
            else test.not_nil(plan:find("kickside_pim_publication_product",1,true),plan);test.not_nil(plan:find("product_id =",1,true),plan) end
            local channel=json.encode(assert(tx:query(explain.."SELECT product_id FROM kickside_pim_publication WHERE catalog_id=$1 AND channel=$2 AND state='published' ORDER BY product_id LIMIT $3",{h.id,"web",50})))
            test.not_nil(channel:find("kickside_pim_publication_published",1,true),channel)
            assert(tx:rollback());assert(db:release())
        end)
        test.it("preserves a registered partial creation beyond reservation expiry",function()
            local h=fixture.catalog({bare=true})
            local db=assert(store.open())
            assert(db:execute("UPDATE kickside_pim_creation SET reserved_at='2000-01-01T00:00:00Z' WHERE component_id=$1",{h.id}))
            assert(db:release());assert(fixture.retain())
            local recovered,rerr=h.executor:call("app:pim_call",{op="create",request={idempotency_key="fixture",title="Fixture catalog"}})
            test.is_nil(rerr,tostring(rerr));test.eq(recovered.catalog_id,h.id)
            local out,err=h.call("apply_schema",{declaration=fixture.DECLARATION,idempotency={namespace="initial",key="schema"}})
            test.is_nil(err,tostring(err));test.not_nil(out)
            db=assert(store.open())
            test.eq(#assert(db:query("SELECT token FROM kickside_pim_creation WHERE component_id=$1",{h.id})),1)
            assert(db:release())
        end)
        for _,phase in ipairs({"deleting","deleted"}) do
        test.it("fences a planned noop when the catalog is "..phase,function()
            local h=fixture.catalog();local db=assert(store.open())
            local seq=assert(store.catalog(db,h.id)).applied_seq;assert(db:release())
            assert(store.transaction("test teardown",function(tx,dialect)
                if phase=="deleted" then assert(cleanup_rows.catalog(tx,dialect,h.id,10000))
                else assert(tx:execute("INSERT INTO kickside_pim_cleanup(catalog_id,cleaned) VALUES($1,0)",{h.id})) end
                return true,nil
            end))
            local saved,err=receipts.noop(h.id,"late","hash",{class="unchanged"},seq,clock.now())
            test.is_nil(saved);test.not_nil(err)
            db=assert(store.open());test.eq(#assert(db:query("SELECT marker FROM kickside_pim_receipt WHERE catalog_id=$1 AND marker='late'",{h.id})),0);assert(db:release())
        end)
        end
        test.it("reclaims expired receipts whose catalog is absent",function()
            local db=assert(store.open())
            assert(db:execute("INSERT INTO kickside_pim_receipt VALUES('r4-orphan','late','hash','{}',0,0,1,'2000-01-01T00:00:00Z')",{}));assert(db:release())
            assert(fixture.retain());db=assert(store.open())
            test.eq(#assert(db:query("SELECT marker FROM kickside_pim_receipt WHERE catalog_id='r4-orphan'",{})),0);assert(db:release())
        end)
        test.it("does not write catalog checkpoints on independent idle sweeps",function()
            local h=fixture.catalog();local db=assert(store.open())
            assert(db:execute("UPDATE kickside_pim_catalog SET catalog_id=$1 WHERE catalog_id=$2",{"r3-protected-idle-"..h.id,h.id}))
            assert(db:execute("UPDATE kickside_pim_retention SET catalog_id='',product_after='',pending=0,deadline_ms=NULL WHERE owner_id='pim'",{}));assert(db:release())
            -- Warm up the first discovery, then measure three independent sweeps.
            assert(funcs.call("app:r3_retention_owner",{}))
            db=assert(store.open())
            local id="r3-protected-idle-"..h.id
            local data_version=db:type()=="sqlite" and assert(db:query("PRAGMA data_version",{}))[1].data_version or nil
            local prior=assert(db:query("SELECT retention_after FROM kickside_pim_catalog WHERE catalog_id=$1",{id}))[1].retention_after
            for _=1,3 do
                local out=assert(funcs.call("app:r3_retention_owner",{}));test.is_true(out.success,tostring(out.error));test.is_false(out.needs_continue)
                if data_version then test.eq(assert(db:query("PRAGMA data_version",{}))[1].data_version,data_version,"idle sweeps commit no database changes") end
                test.eq(assert(db:query("SELECT retention_after FROM kickside_pim_catalog WHERE catalog_id=$1",{id}))[1].retention_after,prior)
            end
            assert(db:execute("DELETE FROM kickside_pim_catalog WHERE catalog_id=$1",{id}));assert(db:release())
        end)
    end)
end
return {run=test.run_cases(define)}
