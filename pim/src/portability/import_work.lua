-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- One-shot import progress and each exact next command survive process loss.
local store=require("store")
local writer=require("writer")
local jobs=require("jobs")
local execution_identity=require("execution_identity")
local values=require("values")
local references=require("references")
local input=require("input")
local term_line=require("term_line")
local defaults=require("defaults")
local fs=require("fs")
local json=require("json")
local hash=require("hash")
local clock=require("clock")
local types=require("types")
local sql=require("sql")
local component=require("component")
local failure=require("failure")
local error_envelope=require("error_envelope")
local M={}

type Position={phase:string,file:integer,offset:integer,after:string}
type Mapping={old_id:string,sku:string,refs:{types.ExportedValue}}
type Frozen={method:string,request:unknown,mappings:{Mapping},next:Position}
type Work={catalog_id:string,request_id:string,storage_id:string,path:string,identity:types.JsonObject,position:Position,batch:Frozen?,job_id:string,done:integer}
M.Work=Work
local function invalid(message:string,code:string): error
    return errors.new({kind=errors.INVALID,retryable=false,message=message,details={code=code}})
end
function M.get(tx:types.Executor,catalog_id:string,lock:string?): (Work?,error?)
    local rows,err=tx:query("SELECT * FROM kickside_pim_import_work WHERE catalog_id=$1"..(lock=="postgres" and " FOR UPDATE" or ""),{catalog_id})
    if err or not rows or not rows[1] then return nil,err :: error? end
    local row,derr=store.decode_row(rows[1],{catalog_id="text",request_id="text",storage_id="text",path="text",identity="json",position="json",batch="json?",job_id="text",done="int"})
    return row :: Work?,derr
end
function M.start(catalog_id:string,storage_id:string,path:string,declaration:types.Declaration,configs:{[string]:types.JsonObject}): (Work?,error?)
    local database_id,dberr=store.database_id()
    if dberr or not database_id then return nil,dberr end
    local identity,ierr=execution_identity.capture()
    if ierr or not identity then return nil,ierr :: error? end
    local request_id=tostring(hash.sha256(catalog_id.."\0"..storage_id.."\0"..path))
    return store.transaction("import admission",function(tx:types.Executor,dialect:string): (Work?,error?)
        local fence_err=component.fence(tx,catalog_id,database_id)
        if fence_err then return nil,fence_err end
        local prior,perr=M.get(tx,catalog_id,dialect)
        if perr then return nil,perr end
        if prior then
            if prior.request_id~=request_id then return nil,invalid("catalog already has another import","import_conflict") end
            return prior,nil
        end
        local populated,qerr=store.populated(tx,catalog_id)
        if qerr then return nil,qerr end
        if populated then return nil,invalid("a new import needs an empty catalog","import_conflict") end
        local job,jerr=jobs.enqueue_tx(tx :: sql.Transaction,dialect,{namespace="pim",scope="import",key=request_id,max_attempts=5,
            owner_locator={kind="component",id=catalog_id},job_type="kickside.pim.jobs:import",immutable_payload={catalog_id=catalog_id,request_id=request_id}})
        if jerr or not job then return nil,jerr end
        local position:Position={phase="schema",file=1,offset=1,after=""}
        local frozen:Frozen={method="schema",request={declaration=declaration,plugin_configs=configs,idempotency={namespace="import",key=request_id..":schema"}},mappings={},next={phase="terms",file=1,offset=1,after=""}}
        local _,err=tx:execute([[INSERT INTO kickside_pim_import_work(catalog_id,request_id,storage_id,path,identity,position,batch,job_id,done)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,0)]],{catalog_id,request_id,storage_id,path,values.canonical(identity),values.canonical(position),values.canonical(frozen),job.id})
        if err then return nil,err :: error? end
        return M.get(tx,catalog_id)
    end)
end

-- Offset is one plus the next byte to consume; read-ahead is never checkpointed.
local function term_page(storage: fs.FS,path: string,offset: integer,BATCH:integer): ({types.ApplyItem}?,integer?,boolean?,error?)
    local file,oerr=storage:open(path,"r")
    if oerr or not file then return nil,nil,nil,oerr end
    local rows:{types.ApplyItem}={}
    local cursor,payload,lines,read_bytes=offset,0,0,0
    local buffer=""
    local eof=false
    local _,err=file:seek("set",offset-1)
    while not err and lines<BATCH and cursor-offset<term_line.BYTES do
        local newline=buffer:find("\n",1,true)
        if not newline and not eof then
            if read_bytes>=term_line.BYTES then
                if cursor==offset then err=term_line.too_large() end
                break
            end
            local chunk,rerr=file:read(math.min(16384,term_line.BYTES-read_bytes))
            if rerr and not errors.is(rerr,errors.NOT_FOUND) then err=rerr;break end
            if not chunk or chunk=="" then eof=true else buffer=buffer..chunk;read_bytes=read_bytes+#chunk end
        else
            if buffer=="" and eof then break end
            local length=newline or #buffer
            local line=newline and buffer:sub(1,newline-1) or buffer
            if line:match("%S") then
                local berr=input.structure(line)
                if berr then err=berr;break end
                local decoded,jerr=json.decode(line)
                if jerr then err=jerr;break end
                if type(decoded)~="table" then err=invalid("import term must be an object","invalid_request");break end
                local term=decoded :: types.ExportedTerm
                -- Bound normalized JSON too, since an external file may use
                -- different escapes. Apply framing adds only a few bytes per row.
                local encoded,eerr=term_line.encode({vocabulary=term.vocabulary,code=term.code,
                    labels=term.labels,parent=term.parent,retired=term.retired})
                if eerr or not encoded then err=eerr;break end
                if payload+#encoded>term_line.BYTES then break end
                payload=payload+#encoded
                rows[#rows+1]={term={vocabulary=term.vocabulary,code=term.code},
                    labels=term.labels,parent=term.parent,retired=term.retired}
            end
            lines=lines+1
            cursor=cursor+length
            buffer=buffer:sub(length+1)
        end
    end
    err=error_envelope.cleanup(function() return file:close() end,err,"close import term file")
    if err then return nil,nil,nil,err end
    return rows,cursor,eof and buffer=="",nil
end

local function entry(v:types.ExportedValue): types.ValueEntry return {attr=v.attr,ctx=v.ctx,value=v.value,source=v.source} end
local function prepare(work:Work): (Frozen?,error?)
    local operating,oerr=defaults.catalog(work.catalog_id)
    if oerr or not operating then return nil,oerr end
    local BATCH=operating.import_rows
    local pos=work.position
    local storage,serr=fs.get(work.storage_id)
    if serr or not storage then return nil,serr end
    local base=work.path.."/data/"
    local items:{types.ApplyItem}={}
    local mappings:{Mapping}={}
    local next_pos:Position={phase=pos.phase,file=pos.file,offset=pos.offset,after=pos.after}
    if pos.phase=="terms" then
        local rows,cursor,done,err=term_page(storage,base.."terms.jsonl",pos.offset,BATCH)
        if err or not rows or not cursor then return nil,err end
        items=rows
        next_pos.offset=cursor
        if done then next_pos={phase="products",file=1,offset=1,after=""} end
    elseif pos.phase=="products" then
        local file=base..string.format("products-%06d.jsonl",pos.file)
        local exists,eerr=storage:exists(file)
        if eerr then return nil,eerr end
        if not exists then return {method="advance",request={},mappings={},next={phase="references",file=1,offset=1,after=""}},nil end
        local rows,rerr=input.products(storage,file)
        if rerr or not rows then return nil,rerr :: error? end
        if #rows>1000 then return nil,invalid("export product chunk exceeds 1000 rows","import_chunk_limit") end
        for n=pos.offset,math.min(#rows,pos.offset+BATCH-1) do
            local p=rows[n] :: types.ExportedProduct
            local set:{types.ValueEntry}={}
            local clear:{types.ValueEntry}={}
            for _,v in ipairs(p.values or {}) do if v.cleared then clear[#clear+1]=entry(v) else set[#set+1]=entry(v) end end
            items[#items+1]={product={sku=p.sku},create={family=p.family,parent=p.parent_sku and {sku=p.parent_sku} or nil},status=p.status,set=set,clear=clear}
            mappings[#mappings+1]={old_id=p.product_id,sku=p.sku,refs=p.refs or {}}
            if #values.canonical(items)>3000000 then
                if #items==1 then return nil,invalid("import product exceeds command budget","import_chunk_limit") end
                table.remove(items);table.remove(mappings);break
            end
        end
        next_pos.offset=pos.offset+#items
        if next_pos.offset>#rows then next_pos.file=pos.file+1;next_pos.offset=1 end
    elseif pos.phase=="references" then
        local db,derr=store.open()
        if not db then return nil,derr end
        local rows,rerr=db:query("SELECT old_id,new_id,sku,refs FROM kickside_pim_import_map WHERE catalog_id=$1 AND old_id>$2 ORDER BY old_id LIMIT $3",{work.catalog_id,pos.after,BATCH})
        if rerr then return nil,store.release(db,rerr) end
        local catalog,cerr=store.catalog(db,work.catalog_id)
        if cerr or not catalog then return nil,store.release(db,cerr) end
        for _,row in ipairs(rows or {}) do
            local decoded,jerr=store.decode_row(row,{old_id="text",new_id="text",refs="json"})
            if jerr or not decoded then return nil,store.release(db,jerr) end
            local set:{types.ValueEntry}={}
            for _,v in ipairs(decoded.refs :: {types.ExportedValue}) do
                local attr=catalog.compiled.attributes[v.attr]
                if not attr or v.value==nil then return nil,store.release(db,invalid("reference attribute is missing","invalid_reference")) end
                local value,verr=values.normalize(attr,v.value)
                if verr or not value then return nil,store.release(db,verr) end
                local map:{[string]:string}={}
                for _,occurrence in ipairs(references.collect(attr,value)) do
                    local ref=occurrence.value.ref
                    if ref[1]=="product" then
                        local target,terr=db:query("SELECT new_id FROM kickside_pim_import_map WHERE catalog_id=$1 AND old_id=$2",{work.catalog_id,ref[2]})
                        if terr then return nil,store.release(db,terr) end
                        if not target or not target[1] then return nil,store.release(db,invalid("reference target is outside this import","invalid_reference")) end
                        map[ref[2]]=target[1].new_id :: string
                    end
                end
                local remapped=references.map(attr,value,function(ref:types.Ref,_path:string,_vocabulary:string?):types.Ref
                    if ref.ref[1]=="product" then return {ref={"product",map[ref.ref[2]] :: string}} end
                    return ref
                end)
                set[#set+1]={attr=v.attr,ctx=v.ctx,value=remapped,source=v.source}
            end
            if #set>0 then
                items[#items+1]={product={id=decoded.new_id :: string},expect_version="any",set=set}
                if #values.canonical(items)>3000000 then
                    if #items==1 then return nil,store.release(db,invalid("import references exceed command budget","import_chunk_limit")) end
                    table.remove(items);break
                end
            end
            next_pos.after=decoded.old_id :: string
        end
        local release_err=store.release(db,nil)
        if release_err then return nil,release_err end
        if #(rows or {})<BATCH and (not rows or not rows[#rows] or next_pos.after==rows[#rows].old_id) then next_pos.phase="done" end
    else return nil,failure.corrupt("import phase is invalid","position") end
    return {method=#items>0 and "items" or "advance",request={items=items,idempotency={namespace="import",key=work.request_id..":"..pos.phase..":"..pos.file..":"..pos.offset..":"..pos.after}},mappings=mappings,next=next_pos},nil
end

function M.batch(catalog_id:string): (boolean?,error?)
    local db,derr=store.open()
    if not db then return nil,derr end
    local work,werr=M.get(db,catalog_id)
    werr=store.release(db,werr)
    if werr or not work then return nil,werr end
    if work.done==1 then return true,nil end
    if not work.batch then
        local built,berr=prepare(work)
        if berr or not built then return nil,berr end
        local current,ferr=store.transaction("freeze import command",function(tx:types.Executor,dialect:string): (Work?,error?)
            local current,cerr=M.get(tx,catalog_id,dialect)
            if cerr or not current then return nil,cerr end
            if not current.batch and values.equal(current.position,work.position) then
                local _,err=tx:execute("UPDATE kickside_pim_import_work SET batch=$1 WHERE catalog_id=$2",{values.canonical(built),catalog_id})
                if err then return nil,err :: error? end
                current.batch=built
            end
            return current,nil
        end)
        if ferr or not current then return nil,ferr end
        work=current
        if not work.batch then return false,nil end
    end
    local frozen=work.batch :: Frozen
    local command=assert(json.decode(values.canonical(frozen.request)))
    local outcomes:{types.Outcome}={}
    if frozen.method=="schema" then
        local _,err=writer.apply_schema(catalog_id,command :: types.SchemaRequest)
        if err then return nil,err :: error? end
    elseif frozen.method=="items" then
        local out,err=writer.import_items(catalog_id,command :: types.ApplyRequest)
        if err or not out then return nil,err :: error? end
        for _,outcome in ipairs(out.outcomes) do
            if outcome.outcome~="created" and outcome.outcome~="updated" and outcome.outcome~="unchanged" then return nil,invalid("import item refused: "..values.canonical(outcome),"import_item_refused") end
        end
        outcomes=out.outcomes
    end
    local _,aerr=store.transaction("advance import command",function(tx:types.Executor,dialect:string): (boolean?,error?)
        local current,cerr=M.get(tx,catalog_id,dialect)
        if cerr or not current then return nil,cerr end
        if not values.equal(current.batch,frozen) then return true,nil end
        for n,mapping in ipairs(frozen.mappings) do
            local id=outcomes[n] and outcomes[n].product_id
            if not id then return nil,failure.corrupt("import outcome lacks product id","product_id") end
            local _,merr=tx:execute([[INSERT INTO kickside_pim_import_map(catalog_id,old_id,new_id,sku,refs) VALUES($1,$2,$3,$4,$5)
                ON CONFLICT(catalog_id,old_id) DO NOTHING]],{catalog_id,mapping.old_id,id,mapping.sku,values.canonical(mapping.refs)})
            if merr then return nil,merr end
        end
        local _,err=tx:execute("UPDATE kickside_pim_import_work SET position=$1,batch=NULL,done=$2,completed_at=$3 WHERE catalog_id=$4",{values.canonical(frozen.next),frozen.next.phase=="done" and 1 or 0,frozen.next.phase=="done" and clock.now() or require("sql").NULL,catalog_id})
        if err then return nil,err :: error? end
        return true,nil
    end)
    if aerr then return nil,aerr end
    return frozen.next.phase=="done",nil
end

function M.result(catalog_id:string,id_map:types.IdMap?): (types.IdMap?,error?)
    local db,err=store.open()
    if not db then return nil,err :: error? end
    local rows,qerr=db:query("SELECT old_id,new_id FROM kickside_pim_import_map WHERE catalog_id=$1 ORDER BY old_id",{catalog_id})
    qerr=store.release(db,qerr)
    if qerr then return nil,qerr end
    local out=id_map or {}
    out.rows=out.rows or {}
    out.rows.pim_product={}
    for _,row in ipairs(rows or {}) do out.rows.pim_product[row.old_id :: string]=row.new_id :: string end
    return out,nil
end
return M
