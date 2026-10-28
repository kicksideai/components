-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local funcs=require("funcs")
local security=require("security")
local registry=require("registry")
local contract=require("contract")
local uuid=require("uuid")
local json=require("json")
local sql=require("sql")
local upload_records=require("upload_records")
local function scope() return security.new_scope({assert(security.policy("app:user"))}) end
local function actor(id) return security.new_actor(id,{security_groups={}}) end
local function call(id,dto) return funcs.new():with_actor(actor(id)):with_scope(scope()):call("app:probe",dto) end
local function defaults()
    return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
end
local function field(name,over)
    local f=assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
    f.name=name
    for k,v in pairs(over or {}) do f[k]=v end
    return f
end
local function input()
    return {title="Invoice reader",description="Invoice fields",config=defaults()}
end
-- A completed upload owned by who, named as its file.
local function upload(who,filename)
    local id=uuid.v4()
    assert(upload_records.create(id,who,10,"text/markdown","app:uploads",id..".md","generic",{filename=filename},"completed"))
    return id
end
local function svc(id)
    return assert(contract.get("kickside.component:component_service")):with_actor(actor(id)):with_scope(scope()):open()
end
return {run=test.run_cases(function()
    test.describe("Extractor lifecycle",function()
        test.it("persists configuration and updates through revisions",function()
            local who="docscout-owner-"..uuid.v4()
            local created,err=call(who,{op="create",input=input()})
            test.is_nil(err,tostring(err));test.not_nil(created)
            local id=created.component_id
            local row=assert(call(who,{op="get",id=id}))
            test.eq(row.title,"Invoice reader");test.eq(row.expected_revision,0);test.is_true(row.can_edit)
            local changed=input();changed.title="Contract reader";changed.expected_revision=0
            changed.config.retrieval.section_budget=9000
            local updated,update_err=call(who,{op="update",id=id,input=changed})
            test.is_nil(update_err,tostring(update_err));test.eq(updated.context_revision,1)
            local after=assert(call(who,{op="get",id=id}))
            test.eq(after.title,"Contract reader");test.eq(after.config.retrieval.section_budget,9000)
            local conflict,conflict_err=call(who,{op="update",id=id,input=changed})
            test.is_nil(conflict);test.not_nil(conflict_err)
            test.is_true(errors.is(conflict_err,errors.CONFLICT),tostring(conflict_err))
            test.eq(assert(call(who,{op="get",id=id})).expected_revision,1)
            test.not_nil((call(who,{op="delete",id=id})))
        end)
        test.it("rejects unknown extraction options without changing the stored configuration", function()
            local who=uuid.v4()
            local created=assert(call(who,{op="create",input=input()}))
            local changed=input(); changed.expected_revision=0
            changed.config.stages.extract.unsupported_setting=true
            local value,err=call(who,{op="update",id=created.component_id,input=changed})
            test.is_nil(value);test.not_nil(err);test.is_true(errors.is(err,errors.INVALID),tostring(err))
            local saved=assert(call(who,{op="get",id=created.component_id}))
            test.is_nil(saved.config.stages.extract.unsupported_setting)
            test.eq(saved.config.stages.extract.model,defaults().stages.extract.model)
            test.eq(saved.expected_revision,0)
        end)
        test.it("persists every stage option and validates its ranges",function()
            local who=uuid.v4();local dto=input();local st=dto.config.stages
            dto.config.tags={"invoice","finance"}
            st.prefetch.queries={{name="Totals",query="Amount due",chunks=7},{name="Terms",query="Payment terms",chunks=5}}
            st.scout.max_rounds=2;st.scout.max_tokens=8192;st.scout.mode="agent";st.scout.share_notes=false
            st.deep.query_model="class:premium";st.deep.chunk_cap=120;st.deep.read="sections"
            st.extract.max_fields_per_call=8
            st.verify.enabled=true;st.verify.check_support=false
            dto.config.retrieval.context="generated";dto.config.retrieval.context_model="class:nano";dto.config.retrieval.keep_tables=false
            dto.config.fields={{name="terms",type="text",description="",enum_values=assert(json.decode("[]")),item_type="text",required=false,search_hints="",validation_hints="",expected_format="",strategy="deep",search_within="sections",group="payment",evidence_required=true,chunks=5}}
            local created,err=call(who,{op="create",input=dto})
            test.is_nil(err,tostring(err));test.not_nil(created)
            local saved=assert(call(who,{op="get",id=created.component_id})).config
            test.eq(saved.tags[2],"finance")
            test.eq(saved.stages.prefetch.queries[1].chunks,7)
            test.eq(saved.stages.scout.mode,"agent");test.eq(saved.stages.scout.max_tokens,8192);test.eq(saved.stages.scout.share_notes,false)
            test.eq(saved.stages.deep.query_model,"class:premium");test.eq(saved.stages.deep.chunk_cap,120);test.eq(saved.stages.deep.read,"sections")
            test.eq(saved.stages.extract.max_fields_per_call,8);test.eq(saved.stages.verify.check_support,false)
            test.eq(saved.retrieval.context,"generated");test.eq(saved.retrieval.context_model,"class:nano");test.eq(saved.retrieval.keep_tables,false)
            test.eq(saved.fields[1].search_within,"sections");test.eq(saved.fields[1].group,"payment")
            test.eq(#saved.stages.scout.tools,4)
            for _,mutate in ipairs({
                function(c) c.stages.scout.max_rounds=-1 end,
                function(c) c.stages.deep.min_similarity=1.1 end,
                function(c) c.stages.deep.query_temperature=-.1 end,
                function(c) c.stages.prefetch.queries={{name="Q",query="",chunks=5}} end,
                function(c) c.stages.scout.mode="swarm" end,
                function(c) c.retrieval.context="summaries" end,
                function(c) c.stages.extract.enabled=false end,
                function(c) c.stages.scout.mode="agent";c.stages.scout.max_rounds=0 end,
                function(c) c.stages.scout.mode="agent";c.stages.scout.max_rounds=2;c.stages.scout.max_extra_queries=0 end,
                function(c) c.fields={field("amounts",{type="list",item_type="number",enum_values={"1","2"}})} end,
                function(c) c.fields={field("vendor",{enum_values={"a"}})} end,
                function(c) c.fields={field("vendor")};c.stages.prefetch.enabled=false;c.stages.scout.enabled=false end
            }) do
                local invalid=input();mutate(invalid.config)
                local result,validation_err=call(who,{op="create",input=invalid})
                test.is_nil(result);test.not_nil(validation_err)
            end
            test.not_nil((call(who,{op="delete",id=created.component_id})))
        end)
        test.it("enforces READ, WRITE, owner and stranger boundaries",function()
            local owner,reader,writer,stranger=uuid.v4(),uuid.v4(),uuid.v4(),uuid.v4()
            local id=assert(call(owner,{op="create",input=input()})).component_id
            local service=assert(svc(owner))
            for _,grant in ipairs({{id=reader,mask=1},{id=writer,mask=3}}) do
                local granted,grant_err=service:grant_subtree({root_component_id=id,subject={subject_type="user",subject_id=grant.id},access_mask=grant.mask})
                test.is_nil(grant_err,tostring(grant_err));test.is_true(granted.success,tostring(granted.error))
            end
            local view,read_err=call(reader,{op="get",id=id})
            test.is_nil(read_err,tostring(read_err));test.eq(view.can_edit,false);test.is_nil(view.config);test.eq(view.can_share,false)
            test.eq(assert(call(writer,{op="get",id=id})).can_share,false)
            test.eq(assert(call(owner,{op="get",id=id})).can_share,true)
            local function listed(who)
                for _,row in ipairs(assert(call(who,{op="list"})).items) do if row.component_id==id then return row end end
            end
            test.eq(listed(reader).access_level,1);test.eq(listed(writer).access_level,3);test.eq(listed(owner).access_level,15)
            local change=input();change.expected_revision=0
            local denied,denied_err=call(reader,{op="update",id=id,input=change})
            test.is_nil(denied);test.not_nil(denied_err)
            local saved,write_err=call(writer,{op="update",id=id,input=change})
            test.is_nil(write_err,tostring(write_err));test.not_nil(saved)
            local hidden,hidden_err=call(stranger,{op="get",id=id})
            test.is_nil(hidden);test.not_nil(hidden_err)
            local removed,remove_err=call(writer,{op="delete",id=id})
            test.is_nil(removed);test.not_nil(remove_err)
            test.not_nil((call(owner,{op="delete",id=id})))
        end)
        test.it("rejects invalid configuration before creation",function()
            local who=uuid.v4()
            local function field(over)
                local f={name="status",type="text",description="",enum_values=assert(json.decode("[]")),item_type="text",required=false,search_hints="",validation_hints="",expected_format="",strategy="standard",search_within="document",group="",evidence_required=true,chunks=5}
                for k,v in pairs(over) do f[k]=v end
                return f
            end
            for _,mutate in ipairs({
                function(v) v.config.retrieval.overlap=v.config.retrieval.chunk_size end,
                function(v) v.config.retrieval.top_results=6 end,
                function(v) v.config.stages.scout.tools={"unknown:tool"} end,
                function(v) v.config.stages.scout.mode="agent";v.config.stages.scout.tools=assert(json.decode("[]")) end,
                function(v) v.config.stages.verify.enabled=true;v.config.stages.verify.check_quotes=false;v.config.stages.verify.check_support=false end,
                function(v) v.config.stages.map.enabled=false;v.config.fields={field({search_within="sections"})} end,
                function(v) v.config.fields={field({type="enum"})} end,
                function(v) v.config.fields={field({}),field({})} end,
                function(v) v.unrecognized=true end,
                function(v) v.title=" " end
            }) do
                local value=input();mutate(value)
                local result,err=call(who,{op="create",input=value})
                test.is_nil(result);test.not_nil(err)
            end
            test.eq(#assert(call(who,{op="list"})).items,0)
        end)
        test.it("persists enabled choices for every optional stage",function()
            local who=uuid.v4();local dto=input()
            for _,name in ipairs({"map","prefetch","scout","deep","verify"}) do dto.config.stages[name].enabled=(name=="verify") end
            local created,err=call(who,{op="create",input=dto})
            test.is_nil(err,tostring(err));test.not_nil(created)
            local view=assert(call(who,{op="get",id=created.component_id}))
            for _,name in ipairs({"map","prefetch","scout","deep","verify"}) do test.eq(view.config.stages[name].enabled,name=="verify") end
            test.not_nil((call(who,{op="delete",id=created.component_id})))
        end)
        test.it("stores expected field values in extractor-owned evaluation cases",function()
            local who=uuid.v4();local dto=input()
            dto.config.fields={{name="total",type="number",description="Total due",enum_values=assert(json.decode("[]")),item_type="text",required=true,search_hints="",validation_hints="",expected_format="",strategy="standard",evidence_required=true,chunks=5,search_within="document",group=""}}
            local id=assert(call(who,{op="create",input=dto})).component_id
            local example,other=upload(who,"Example invoice.pdf"),upload(who,"Unstated total.pdf")
            local added,err=call(who,{op="add_case",id=id,input={upload_id=example,expected={total=1250}}})
            test.is_nil(err,tostring(err));test.not_nil(added)
            local view=assert(call(who,{op="get",id=id}))
            test.eq(#view.cases,1);test.eq(view.cases[1].expected.total,1250);test.eq(view.cases[1].upload_name,"Example invoice.pdf")
            local named,named_err=call(who,{op="add_case",id=id,input={upload_id=example,upload_name="Renamed.pdf",expected={total=1}}})
            test.is_nil(named);test.not_nil(named_err)
            local missing,missing_err=call(who,{op="add_case",id=id,input={upload_id="missing-"..uuid.v4(),expected={total=1}}})
            test.is_nil(missing);test.not_nil(missing_err)
            local invalid,invalid_err=call(who,{op="add_case",id=id,input={upload_id=example,expected={total="invalid"}}})
            test.is_nil(invalid);test.not_nil(invalid_err)
            local unstated,unstated_err=call(who,{op="add_case",id=id,input={upload_id=other,expected=json.decode("{}")}})
            test.is_nil(unstated_err,tostring(unstated_err));test.not_nil(unstated)
            local unknown,unknown_err=call(who,{op="add_case",id=id,input={upload_id=example,expected={vendor="x"}}})
            test.is_nil(unknown);test.not_nil(unknown_err)
            test.not_nil((call(who,{op="delete_case",id=id,case_id=unstated.id})))
            local stranger,stranger_err=call(uuid.v4(),{op="add_case",id=id,input={upload_id=example,expected={total=100}}})
            test.is_nil(stranger);test.not_nil(stranger_err)
            test.not_nil((call(who,{op="delete_case",id=id,case_id=added.id})))
            test.eq(#assert(call(who,{op="get",id=id})).cases,0)
            test.not_nil((call(who,{op="delete",id=id})))
        end)
        test.it("shows each person only the runs they made",function()
            local owner,reader=uuid.v4(),uuid.v4()
            local id=assert(call(owner,{op="create",input=input()})).component_id
            local service=assert(svc(owner))
            assert(service:grant_subtree({root_component_id=id,subject={subject_type="user",subject_id=reader},access_mask=1}))
            local db=assert(sql.get("app:db"))
            for _,who in ipairs({owner,reader}) do
                local _,run_err=db:execute([[INSERT INTO kickside_docscout_runs
                    (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                    VALUES($1,$2,$3,$4,'ui','completed',0,'{}','[]',20,100,'2026-01-01T00:00:00Z','2999-01-02T00:00:00Z')]],{uuid.v4(),id,who,"upload-of-"..who})
                test.is_nil(run_err,tostring(run_err))
            end
            db:release()
            for _,who in ipairs({owner,reader}) do
                local view=assert(call(who,{op="get",id=id}))
                test.eq(#view.runs,1);test.eq(view.runs[1].upload_id,"upload-of-"..who)
            end
            test.not_nil((call(owner,{op="delete",id=id})))
        end)
        test.it("tears down the extractor's runs and cases and declares one retention duration",function()
            local who=uuid.v4();local id=assert(call(who,{op="create",input=input()})).component_id
            local db=assert(sql.get("app:db"))
            local _,err=db:execute([[INSERT INTO kickside_docscout_cases(id,component_id,upload_id,upload_name,expected_values,created_at) VALUES($1,$2,'upload','contract.pdf','{}','2026-01-01T00:00:00Z')]],{uuid.v4(),id})
            test.is_nil(err,tostring(err))
            local _,run_err=db:execute([[INSERT INTO kickside_docscout_runs
                (id,component_id,user_id,upload_id,caller,status,config_revision,result,trace,duration_ms,tokens,created_at,expires_at)
                VALUES($1,$2,$3,'upload','agent','completed',0,'{}','[]',20,100,'2026-01-01T00:00:00Z','2026-01-02T00:00:00Z')]],{uuid.v4(),id,who})
            test.is_nil(run_err,tostring(run_err));db:release()
            test.not_nil((call(who,{op="delete",id=id})))
            db=assert(sql.get("app:db"))
            for _,name in ipairs({"cases","runs"}) do
                local rows=assert(db:query("SELECT count(*) AS n FROM kickside_docscout_"..name.." WHERE component_id=$1",{id}))
                test.eq(tonumber(rows[1].n),0)
            end
            db:release()
            local setting=assert(registry.get("kickside.docscout:setting.retention"))
            test.eq(setting.data.value_type,"duration");test.eq(setting.data.default,"2h");test.eq(setting.data.scope,"global")
        end)
    end)
end)}
