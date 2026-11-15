-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local input=require("input")
local fs=require("fs")
local policy=require("policy")
local fixture=require("fixture")
local catalog_fixture=require("catalog_fixture")
local store=require("store")
local json=require("json")
local clock=require("clock")
local function define()
    test.describe("Round 5 bounded portable input and operating policies",function()
        test.it("discovers all 51 readable catalogs through continuation and exact summary",function()
            local h=fixture.catalog()
            local expected:{[string]:boolean}={[h.id]=true}
            for n=1,50 do
                local out=assert(h.call("create",{idempotency_key="round5-list-"..n,title="Catalog "..n}))
                expected[out.catalog_id]=true
            end
            local seen:{[string]:boolean}={}
            local after:integer?=nil
            repeat
                local page=assert(h.call("list",{limit=13,after=after}))
                for _,row in ipairs(page.catalogs) do test.is_nil(seen[row.catalog_id]);seen[row.catalog_id]=true end
                after=page.after
            until after==nil
            local count=0
            for id in pairs(expected) do test.eq(seen[id],true);count=count+1 end
            test.eq(count,51)
            for id in pairs(expected) do
                local summary=assert(h.executor:call("app:pim_call",{op="get_catalog",catalog_id=id}))
                test.eq(summary.catalog_id,id);test.eq(summary.access.admin,true)
            end
            test.eq(count,51)
            local other=fixture.catalog()
            local denied,err=other.executor:call("app:pim_call",{op="get_catalog",catalog_id=h.id})
            test.is_nil(denied);test.not_nil(err)
        end)
        test.it("honors seven-day proposal expiry and catalog quota",function()
            local h=fixture.catalog()
            fixture.boot(h)
            assert(h.call("apply_schema",{declaration={policy={proposal_days=7,proposal_count=1,proposal_bytes=1024}}}))
            local request={items={{product={sku="RDG"},set={{attr="core.care",value="proposal"}}}}}
            assert(h.call("propose",request))
            local refused,err=h.call("propose",request)
            test.is_nil(refused);test.not_nil(err)
            local db=assert(store.open())
            assert(db:execute("UPDATE kickside_pim_proposal SET created_at=$1 WHERE catalog_id=$2",{clock.ago(8),h.id}));assert(db:release())
            assert(fixture.retain())
            db=assert(store.open())
            test.eq(tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_proposal WHERE catalog_id=$1",{h.id}))[1].n),0)
            assert(db:release())
            local large,lerr=h.call("propose",{items={{product={sku="RDG"},set={{attr="core.care",value=string.rep("x",1100)}}}}})
            test.is_nil(large);test.not_nil(lerr)
            assert(h.call("propose",request))
        end)
        test.it("bounds oversized product chunks at the actual import boundary",function()
            local h=fixture.catalog();local path="r5-products-"..h.id
            local storage=assert(fs.get("app:exports"));assert(storage:mkdir(path));assert(storage:mkdir(path.."/data"))
            assert(storage:writefile(path.."/data/products-000001.jsonl",string.rep(" ",input.BYTES+100)))
            local db=assert(store.open())
            assert(db:execute([[INSERT INTO kickside_pim_import_work(catalog_id,request_id,storage_id,path,identity,position,job_id,done) VALUES($1,'oversized','app:exports',$2,'{}',$3,'manual',0)]],{h.id,path,json.encode({phase="products",file=1,offset=1,after=""})}));assert(db:release())
            local out=assert(h.executor:call("app:r5_import_boundary",{catalog_id=h.id}))
            test.not_nil(out.error);test.eq(out.io.whole,0)
            test.is_true(out.io.bytes<=input.BYTES+1,json.encode(out.io))
            db=assert(store.open());assert(db:execute("DELETE FROM kickside_pim_import_work WHERE catalog_id=$1",{h.id}));assert(db:release())
        end)
        test.it("rejects overlong product lines and too many lines before decoding",function()
            local storage=assert(fs.get("app:exports"));local path="r5-line-bounds"
            assert(storage:writefile(path,string.rep(' ',input.LINE_BYTES+1)))
            local rows,err=input.products(storage,path);test.is_nil(rows);test.not_nil(err)
            assert(storage:writefile(path,string.rep("{}\n",1001)))
            rows,err=input.products(storage,path);test.is_nil(rows);test.not_nil(err)
            assert(storage:writefile(path,string.rep("\n",1001)))
            rows,err=input.products(storage,path);test.is_nil(rows);test.not_nil(err)
            assert(storage:writefile(path,string.rep("{}\n",1000)))
            rows,err=input.products(storage,path);test.is_nil(err);test.eq(#assert(rows),1000)
        end)
        test.it("rejects depth and structural width before JSON decoding",function()
            test.not_nil(input.structure(string.rep('[',25)..'0'..string.rep(']',25)))
            test.not_nil(input.structure('['..string.rep('0,',70000)..'0]'))
            test.is_nil(input.structure('{"quoted":"[\\\"{", "value":false}'))
        end)
        test.it("bounds reads before allocating or decoding oversized files",function()
            local read_bytes,closed=0,false
            local storage={open=function(_self:unknown,_path:string,_mode:string): (unknown,error?)
                return {read=function(_file:unknown,n:integer): (string?,error?) read_bytes=read_bytes+n;return string.rep(' ',n),nil end,
                    close=function(_file:unknown): (boolean?,error?) closed=true;return true,nil end},nil
            end}
            local text,err=input.text(storage :: fs.FS,"oversized")
            test.is_nil(text);test.not_nil(err);test.eq(read_bytes,input.BYTES+1);test.eq(closed,true)
        end)
        test.it("validates operating windows, quotas and bounded execution",function()
            test.is_nil(policy.check("proposal_days",7))
            test.is_nil(policy.check("maintenance_rows",50))
            test.not_nil(policy.check("maintenance_rows",501))
            test.not_nil(policy.check("proposal_bytes",4194305))
            test.not_nil(policy.check("pending_creation_days",0))
        end)
    end)
end
return {run=test.run_cases(define)}
