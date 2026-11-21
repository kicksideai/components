-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local fixture=require("fixture")
local store=require("store")
local pipeline=require("pipeline")
local receipts=require("receipts")
local clock=require("clock")
local funcs=require("funcs")
local json=require("json")
local fs=require("fs")
local layout=require("layout")
local function define()
    test.describe("round three review",function()
        for _,noop_first in ipairs({true,false}) do
        test.it(noop_first and "reserves a noop key before a competing effectful append" or "reserves an effectful key before a competing noop",function()
            local h=fixture.catalog()
            local db=assert(store.open())
            local seq=assert(store.catalog(db,h.id)).applied_seq
            assert(db:release())
            local appended=0
            local client={catch_up_projection=function() return {done=true,last_seq=seq},nil end,
                append_events=function(_self,r)
                    appended=appended+1
                    assert(store.transaction("test fold",function(tx)
                        assert(not receipts.record(tx,h.id,r.events[1].body.receipt,seq+1,clock.now()))
                        return true,nil
                    end))
                    seq=seq+1
                    return {max_seq=seq},nil
                end}
            local function command(noop,build)
                return {client=client,thread={id=h.id,kind="test",source="test"},actor="test",deadline_ms=1000,
                    fingerprint={op=noop and "noop" or "effectful"},idempotency={namespace="race",key="key"},
                    receipt=function(marker) return receipts.get(h.id,marker) end,
                    reserve=function(marker,hashed,position,at) return receipts.reserve(h.id,marker,hashed,position,at) end,
                    noop=function(marker,hashed,result,position,at) return receipts.noop(h.id,marker,hashed,result,position,at) end,
                    build=build or function(s) return {result={class="unchanged"},events={},as_of=s,catalog_seq=s},nil end}
            end
            local winner
            local out,err=pipeline.run(command(not noop_first,function(s)
                winner=assert(pipeline.run(command(noop_first,function(n)
                    return {result={class="unchanged"},events=noop_first and {} or {{type="test",body={}}},as_of=n,catalog_seq=n,expect={head=n}},nil
                end)))
                return {result={class="unchanged"},events=noop_first and {{type="test",body={}}} or {},as_of=s,catalog_seq=s,expect={head=s}},nil
            end))
            test.is_nil(out)
            test.eq(err and err:details().code,"idempotency_conflict")
            test.eq(appended,noop_first and 0 or 1)
            test.not_nil(winner)
        end)
        end
        test.it("keeps a pending reservation exclusive and retries an interrupted append",function()
            local h=fixture.catalog();local db=assert(store.open())
            local seq=assert(store.catalog(db,h.id)).applied_seq;assert(db:release())
            local failed=false
            local client={catch_up_projection=function() return {done=true,last_seq=seq},nil end}
            local function command(noop)
                return {client=client,thread={id=h.id,kind="test",source="test"},actor="test",deadline_ms=1000,
                    fingerprint={op=noop and "noop" or "effectful"},idempotency={namespace="pending",key="key"},
                    receipt=function(marker) return receipts.get(h.id,marker) end,
                    reserve=function(marker,hashed,position,at) return receipts.reserve(h.id,marker,hashed,position,at) end,
                    noop=function(marker,hashed,result,position,at) return receipts.noop(h.id,marker,hashed,result,position,at) end,
                    build=function(s) return {result={class="unchanged"},events=noop and {} or {{type="test",body={}}},as_of=s,catalog_seq=s,expect={head=s}},nil end}
            end
            client.append_events=function(_self,r)
                local out,err=pipeline.run(command(true))
                test.is_nil(out);test.eq(err:details().code,"idempotency_conflict")
                if not failed then failed=true;return nil,errors.new({kind=errors.UNAVAILABLE,retryable=true,message="interrupted append"}) end
                assert(store.transaction("test fold",function(tx)
                    assert(not receipts.record(tx,h.id,r.events[1].body.receipt,seq+1,clock.now()));return true,nil
                end))
                seq=seq+1;return {max_seq=seq},nil
            end
            local first,err=pipeline.run(command(false))
            test.is_nil(first);test.eq(err:kind(),errors.UNAVAILABLE)
            local retried,rerr=pipeline.run(command(false))
            test.is_nil(rerr,tostring(rerr));test.not_nil(retried.seq);test.is_nil(retried.replayed)
            local replay=assert(pipeline.run(command(false)));test.is_true(replay.replayed)
        end)
        test.it("finishes a fresh model release whose children are already published",function()
            local h=fixture.catalog();fixture.boot(h)
            local p=assert(h.call("get",{product={sku="RDG-moss-40"}})).product
            assert(h.call("release",{items={{product={id=p.product_id},expect_version=p.version,channels={"web"}}}}))
            for attempt=1,2 do
                local model=assert(h.call("get",{product={sku="RDG"}})).product
                local out=assert(h.call("release",{items={{product={id=model.product_id},expect_version=model.version,channels={"web"}}},idempotency={namespace="fresh",key=tostring(attempt)}}))
                local request=out.outcomes[1].request_id
                for _=1,200 do
                    local db=assert(store.open())
                    local row=assert(db:query("SELECT done FROM kickside_pim_release_job WHERE catalog_id=$1 AND request_id=$2",{h.id,request}))[1]
                    assert(db:release())
                    if tonumber(row.done)==1 then break end
                    require("time").after("50ms"):receive()
                end
                local db=assert(store.open())
                local row=assert(db:query("SELECT done FROM kickside_pim_release_job WHERE catalog_id=$1 AND request_id=$2",{h.id,request}))[1]
                assert(db:release());test.eq(tonumber(row.done),1)
            end
        end)
        test.it("expires abandoned release tasks by their creation age",function()
            local h=fixture.catalog()
            local db=assert(store.open())
            local _,err=db:execute([[INSERT INTO kickside_pim_release_job(catalog_id,request_id,model_id,root,identity,job_id,after_product,done,created_at)
                VALUES($1,'abandoned','model',1,'{}','missing','',0,'2000-01-01T00:00:00Z')]],{h.id})
            assert(db:release());test.is_nil(err,tostring(err))
            assert(fixture.retain())
            db=assert(store.open())
            local rows=assert(db:query("SELECT request_id FROM kickside_pim_release_job WHERE catalog_id=$1",{h.id}))
            assert(db:release());test.eq(#rows,0)
        end)
        test.it("quiesces with eleven catalogs of protected archive candidates",function()
            local h=fixture.catalog()
            local db=assert(store.open());local compiled=assert(store.catalog(db,h.id)).compiled
            compiled.policy={audit_days=1}
            local tx=assert(db:begin())
            for c=1,11 do
                local id="r3-protected-"..h.id.."-"..string.format("%02d",c)
                assert(tx:execute([[WITH source AS (SELECT * FROM kickside_pim_catalog WHERE catalog_id=$1) INSERT INTO kickside_pim_catalog(catalog_id,generation,compiled,digest,layout_digest,item_table,applied_seq,product_count,item_count,trashed_count,tombstone_floor_seq,created_at,updated_at,retention_after)
                    SELECT $2,generation,$3,digest,layout_digest,item_table,applied_seq,0,0,0,0,created_at,updated_at,$4 FROM source]],{h.id,id,json.encode(compiled),json.encode({archives=c%2==0 and {release={at="2000-01-01T00:00:00Z",keys={"050"}}} or {}})}))
                for n=1,51 do
                    local key=string.format("%03d",n)
                    assert(tx:execute([[INSERT INTO kickside_pim_release(catalog_id,release_id,product_id,version,generation,snapshot,hash,channels,seq,created_at) VALUES($1,$2,$2,1,1,'{}','hash','[]',1,'2000-01-01T00:00:00Z')]],{id,key}))
                    assert(tx:execute([[INSERT INTO kickside_pim_publication(catalog_id,channel,product_id,release_id,state,seq,updated_at) VALUES($1,'web',$2,$2,'published',1,'2000-01-01T00:00:00Z')]],{id,key}))
                end
            end
            test.eq(tonumber(assert(tx:query("SELECT COUNT(*) AS n FROM kickside_pim_catalog WHERE catalog_id LIKE $1",{"r3-protected-"..h.id.."%"}))[1].n),11)
            assert(tx:execute("UPDATE kickside_pim_retention SET catalog_id='',product_after='',pending=0,deadline_ms=NULL WHERE owner_id='pim'",{}));assert(tx:commit())
            local done=false
            for _=1,40 do
                local out=assert(funcs.call("app:r3_retention_owner",{}))
                test.is_true(out.success,tostring(out.error))
                test.eq(#(out.blocked or {}),0,json.encode(out.blocked))
                if not out.needs_continue then done=true;break end
            end
            local rows=assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_release WHERE catalog_id LIKE $1",{"r3-protected-"..h.id.."%"}))
            for _,name in ipairs({"publication","release","catalog"}) do assert(db:execute("DELETE FROM kickside_pim_"..name.." WHERE catalog_id LIKE $1",{"r3-protected-"..h.id.."%"})) end
            assert(db:release());test.eq(tonumber(rows[1].n),561);test.is_true(done,"protected-only scans must stop requesting continuation")
        end)
        test.it("recovers creation after a transient provenance write failure",function()
            local h=fixture.catalog()
            local out,err=h.executor:call("app:r3_creation_recovery",{catalog_id=h.id})
            test.is_nil(err,tostring(err));test.is_true(out.recovered,json.encode(out))
        end)
        test.it("refuses use after catalog registration is interrupted before the first commit",function()
            local h=fixture.catalog()
            local out,err=h.executor:call("app:r3_creation_recovery",{catalog_id=h.id,catalog=true})
            test.is_nil(err,tostring(err));test.is_true(out.refused,json.encode(out))
            for _,op in ipairs({"get_catalog","get_schema","apply_schema","list"}) do
                local result,use_err=h.executor:call("app:pim_call",{op=op,catalog_id=out.catalog_id,
                    request=op=="apply_schema" and {declaration={}} or {}})
                test.is_nil(result)
                test.eq(use_err:details().code,"catalog_not_initialized",tostring(use_err))
            end
            local retried=assert(h.executor:call("app:pim_call",{op="get_schema",catalog_id=out.retry_id,request={}}))
            test.eq(retried.generation,1)
        end)
        test.it("uses predicate-leading schema cleanup indexes without sorting",function()
            local h=fixture.catalog();local db=assert(store.open());local catalog=assert(store.catalog(db,h.id))
            local names=layout.from_base(catalog.item_table)
            if db:type()=="sqlite" then
                local cases={
                    {"SELECT product_id,attribute_id,ctx,path FROM kickside_pim_ref WHERE catalog_id=$1 AND attribute_id=$2 ORDER BY product_id,attribute_id,ctx,path LIMIT 50",{h.id,1},"catalog_id=? AND attribute_id=?"},
                    {"SELECT col,value_key,product_id FROM "..names.set.." WHERE col=$1 ORDER BY col,value_key,product_id LIMIT 50",{"f1"},"col=?"}}
                for _,case in ipairs(cases) do
                    local plan=assert(db:query("EXPLAIN QUERY PLAN "..case[1],case[2]));local text=json.encode(plan)
                    test.is_nil(text:find("TEMP B-TREE",1,true),text);test.not_nil(text:find(case[3],1,true),text)
                end
            else
                local indexes=assert(db:query("SELECT indexdef FROM pg_indexes WHERE tablename IN ('kickside_pim_ref',$1)",{names.set}))
                local text=json.encode(indexes)
                test.not_nil(text:find("catalog_id, attribute_id, product_id, ctx, path",1,true),text)
                test.not_nil(text:find("col, value_key, product_id",1,true),text)
            end
            assert(db:release())
        end)
        for _,line in ipairs({"\n",string.rep(" ",65535).."\n"}) do
        test.it(#line==1 and "bounds examined blank import lines" or "bounds consumed whitespace import bytes",function()
            local h=fixture.catalog();local path="r3-blank-"..h.id
            local storage=assert(fs.get("app:exports"));assert(storage:mkdir(path));assert(storage:mkdir(path.."/data"))
            local content=string.rep(line,#line==1 and 4000000 or 64)..json.encode({vocabulary="categories",code="after-blanks",labels={en="Term"}}).."\n"
            assert(storage:writefile(path.."/data/terms.jsonl",content))
            local db=assert(store.open())
            assert(db:execute([[INSERT INTO kickside_pim_import_work(catalog_id,request_id,storage_id,path,identity,position,job_id,done) VALUES($1,'blank','app:exports',$2,'{}',$3,'manual',0)]],{h.id,path,json.encode({phase="terms",file=1,offset=1,after=""})}))
            local out,err=h.executor:call("app:import_batch_probe",{catalog_id=h.id})
            test.is_nil(err,tostring(err))
            local pos=json.decode(assert(db:query("SELECT position FROM kickside_pim_import_work WHERE catalog_id=$1",{h.id}))[1].position)
            assert(db:release())
            test.eq(pos.phase,"terms");test.is_true(pos.offset>1)
            test.is_true(pos.offset<=3000001,"consumed bytes bounded")
            if #line==1 then test.is_true(pos.offset<=201,"examined lines bounded") end
            test.is_true(out.io.bytes<=3016384,"read bytes bounded")
        end)
        end
        test.it("compares unchanged releases with the requested channel's published snapshot",function()
            local h=fixture.catalog();fixture.boot(h)
            assert(h.call("apply_schema",{declaration={channels={{id="other",requirements={"web"}}}}}))
            local function publish(channel)
                local p=assert(h.call("get",{product={sku="RDG-moss-40"}})).product
                return assert(h.call("release",{items={{product={id=p.product_id},expect_version=p.version,channels={channel}}}}))
            end
            local first=publish("web")
            assert(h.call("apply",{items={{product={sku="RDG"},expect_version="any",set={{attr="core.care",value="B"}}}}}))
            publish("other")
            assert(h.call("apply",{items={{product={sku="RDG"},expect_version="any",set={{attr="core.care",value="Clean with a damp cloth."}}}}}))
            local again=publish("web")
            test.eq(again.outcomes[1].outcome,"unchanged");test.is_nil(again.seq)
            test.eq(again.outcomes[1].release_id,first.outcomes[1].release_id)
        end)
    end)
end
return {run=test.run_cases(define)}
