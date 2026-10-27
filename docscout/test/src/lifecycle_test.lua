-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local funcs=require("funcs")
local security=require("security")
local registry=require("registry")
local contract=require("contract")
local uuid=require("uuid")
local json=require("json")
local sql=require("sql")
local function scope() return security.new_scope({assert(security.policy("app:user"))}) end
local function actor(id) return security.new_actor(id,{security_groups={}}) end
local function call(id,dto) return funcs.new():with_actor(actor(id)):with_scope(scope()):call("app:probe",dto) end
local function defaults()
    return assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
end
local function input()
    return {title="Invoice reader",description="Invoice fields",config=defaults()}
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
            changed.config.retrieval.top_results=9
            local updated,update_err=call(who,{op="update",id=id,input=changed})
            test.is_nil(update_err,tostring(update_err));test.eq(updated.context_revision,1)
            local after=assert(call(who,{op="get",id=id}))
            test.eq(after.title,"Contract reader");test.eq(after.config.retrieval.top_results,9)
            local conflict,conflict_err=call(who,{op="update",id=id,input=changed})
            test.is_nil(conflict);test.not_nil(conflict_err)
            test.is_true(errors.is(conflict_err,errors.CONFLICT),tostring(conflict_err))
            test.eq(assert(call(who,{op="get",id=id})).expected_revision,1)
            test.not_nil(call(who,{op="delete",id=id}))
        end)
        test.it("persists all builder options and validates their ranges",function()
            local who=uuid.v4();local dto=input()
            dto.config.tags={"invoice","finance"};dto.config.shared_context=false
            dto.config.workflow[2].options.queries={{name="Totals",query="Amount due",chunks=7},{name="Terms",query="Payment terms",chunks=5}}
            dto.config.workflow[3].options.max_iterations=2
            dto.config.workflow[3].options.max_tokens=8192
            dto.config.workflow[4].options.query_model="class:premium"
            dto.config.workflow[4].options.chunk_cap=120
            dto.config.workflow[5].options.structured_output=false
            local created,err=call(who,{op="create",input=dto})
            test.is_nil(err,tostring(err));test.not_nil(created)
            local saved=assert(call(who,{op="get",id=created.component_id})).config
            test.eq(saved.tags[2],"finance");test.eq(saved.shared_context,false)
            test.eq(saved.workflow[2].options.queries[1].chunks,7)
            test.eq(saved.workflow[3].options.max_tokens,8192)
            test.eq(saved.workflow[4].options.query_model,"class:premium")
            test.eq(saved.workflow[4].options.chunk_cap,120)
            test.eq(saved.workflow[5].options.structured_output,false)
            test.eq(#saved.tools,4)
            for _,mutate in ipairs({
                function(c) c.workflow[3].options.max_iterations=-1 end,
                function(c) c.workflow[4].options.min_similarity=1.1 end,
                function(c) c.workflow[4].options.query_temperature=-.1 end,
                function(c) c.workflow[2].options.queries={{name="Q",query="",chunks=5}} end,
                function(c) c.workflow[5].enabled=false end,
                function(c) c.workflow[5],c.workflow[6]=c.workflow[6],c.workflow[5] end
            }) do
                local invalid=input();mutate(invalid.config)
                local result,validation_err=call(who,{op="create",input=invalid})
                test.is_nil(result);test.not_nil(validation_err)
            end
            test.not_nil(call(who,{op="delete",id=created.component_id}))
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
            test.is_nil(read_err,tostring(read_err));test.eq(view.can_edit,false);test.is_nil(view.config)
            local change=input();change.expected_revision=0
            local denied,denied_err=call(reader,{op="update",id=id,input=change})
            test.is_nil(denied);test.not_nil(denied_err)
            local saved,write_err=call(writer,{op="update",id=id,input=change})
            test.is_nil(write_err,tostring(write_err));test.not_nil(saved)
            local hidden,hidden_err=call(stranger,{op="get",id=id})
            test.is_nil(hidden);test.not_nil(hidden_err)
            local removed,remove_err=call(writer,{op="delete",id=id})
            test.is_nil(removed);test.not_nil(remove_err)
            test.not_nil(call(owner,{op="delete",id=id}))
        end)
        test.it("rejects invalid configuration before creation",function()
            local who=uuid.v4()
            for _,mutate in ipairs({
                function(v) v.config.retrieval.overlap=v.config.retrieval.chunk_size end,
                function(v) v.config.retrieval.top_results=0 end,
                function(v) v.config.workflow[1].enabled=false;v.config.workflow[1],v.config.workflow[2]=v.config.workflow[2],v.config.workflow[1] end,
                function(v) v.config.workflow[2]=v.config.workflow[1] end,
                function(v) v.config.tools={"unknown:tool"} end,
                function(v) v.unrecognized=true end,
                function(v) v.title=" " end,
                function(v) v.config.fields={{name="status",type="enum",description="",enum_values={},item_type="text",required=false,search_hints="",validation_hints="",expected_format="",strategy="standard",evidence_required=true,chunks=5}} end
            }) do
                local value=input();mutate(value)
                local result,err=call(who,{op="create",input=value})
                test.is_nil(result);test.not_nil(err)
            end
            test.eq(#assert(call(who,{op="list"})).items,0)
        end)
        test.it("persists enabled choices for every reading step",function()
            local who=uuid.v4();local dto=input()
            for _,step in ipairs(dto.config.workflow) do if step.kind~="extract" then step.enabled=false end end
            local created,err=call(who,{op="create",input=dto})
            test.is_nil(err,tostring(err));test.not_nil(created)
            local view=assert(call(who,{op="get",id=created.component_id}))
            for _,step in ipairs(view.config.workflow) do test.eq(step.enabled,step.kind=="extract") end
            test.not_nil(call(who,{op="delete",id=created.component_id}))
        end)
        test.it("stores expected field values in extractor-owned evaluation cases",function()
            local who=uuid.v4();local dto=input()
            dto.config.fields={{name="total",type="number",description="Total due",enum_values=assert(json.decode("[]")),item_type="text",required=true,search_hints="",validation_hints="",expected_format="",strategy="standard",evidence_required=true,chunks=5}}
            local id=assert(call(who,{op="create",input=dto})).component_id
            local added,err=call(who,{op="add_case",id=id,input={upload_id="example-upload",upload_name="Example invoice.pdf",expected={total=1250}}})
            test.is_nil(err,tostring(err));test.not_nil(added)
            local view=assert(call(who,{op="get",id=id}))
            test.eq(#view.cases,1);test.eq(view.cases[1].expected.total,1250);test.eq(view.cases[1].upload_name,"Example invoice.pdf")
            local invalid,invalid_err=call(who,{op="add_case",id=id,input={upload_id="example-upload",upload_name="Example invoice.pdf",expected={total="invalid"}}})
            test.is_nil(invalid);test.not_nil(invalid_err)
            local stranger,stranger_err=call(uuid.v4(),{op="add_case",id=id,input={upload_id="example-upload",upload_name="Example invoice.pdf",expected={total=100}}})
            test.is_nil(stranger);test.not_nil(stranger_err)
            test.not_nil(call(who,{op="delete_case",id=id,case_id=added.id}))
            test.eq(#assert(call(who,{op="get",id=id})).cases,0)
            test.not_nil(call(who,{op="delete",id=id}))
        end)
        test.it("tears down every owned row and declares one retention duration",function()
            local who=uuid.v4();local id=assert(call(who,{op="create",input=input()})).component_id
            local db=assert(sql.get("app:db"))
            local _,err=db:execute([[INSERT INTO kickside_docscout_cases(id,component_id,upload_id,expected_values,created_at) VALUES($1,$2,'upload','{}','2026-01-01')]],{uuid.v4(),id})
            test.is_nil(err,tostring(err))
            local _,document_err=db:execute([[INSERT INTO kickside_docscout_documents
                (id,component_id,user_id,upload_id,markdown,chunks,outline,vectors,created_at,expires_at)
                VALUES($1,$2,$3,'upload','text','[]','[]','[]','2026-01-01','2026-01-02')]],{uuid.v4(),id,who})
            test.is_nil(document_err,tostring(document_err))
            local _,run_err=db:execute([[INSERT INTO kickside_docscout_runs
                (id,component_id,user_id,upload_id,caller,status,config_revision,duration_ms,tokens,created_at,expires_at)
                VALUES($1,$2,$3,'upload','agent','completed',0,20,100,'2026-01-01','2026-01-02')]],{uuid.v4(),id,who})
            test.is_nil(run_err,tostring(run_err));db:release()
            test.not_nil(call(who,{op="delete",id=id}))
            db=assert(sql.get("app:db"))
            for _,name in ipairs({"cases","runs","documents"}) do
                local rows=assert(db:query("SELECT count(*) AS n FROM kickside_docscout_"..name.." WHERE component_id=$1",{id}))
                test.eq(tonumber(rows[1].n),0)
            end
            db:release()
            local setting=assert(registry.get("kickside.docscout:setting.retention"))
            test.eq(setting.data.value_type,"duration");test.eq(setting.data.default,"2h");test.eq(setting.data.scope,"global")
        end)
    end)
end)}
