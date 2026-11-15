-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Each invocation visits at most ten catalogs and shares one 500-row budget across trash scans, history pruning and tombstone pruning.
local security = require("security")
local consts = require("consts")
local clock = require("clock")
local history = require("history")
local store = require("store")
local retention_rows = require("retention_rows")
local threads = require("threads")
local policy = require("policy")
local defaults = require("defaults")
local types = require("types")

local cleanup = require("cleanup")
local error_envelope = require("error_envelope")

local json=require("json")
local cleanup_rows=require("cleanup_rows")
local archive_rows=require("archive_rows")
local references=require("references")
local failure=require("failure")
local creations=require("creations")
local M = {}

-- Pruned is what one prune transaction removed and whether more remains.
type Pruned = { removed: integer, spent:integer, more: boolean, tombstones: {retention_rows.Tombstone}? }
type Cursor={trash:string?,next:integer?,archives:{[string]:archive_rows.Cursor},cycle:string?,complete:{[string]:boolean}?}

type Result = { success: boolean, deleted: integer?, catalogs: integer?, needs_continue: boolean?, sweep_complete: boolean?, deadline_ms: integer?, error: error?,blocked: {{component_id:string,error:error}}? }


-- purge appends one system-only purge event per trashed product past the
-- window, each guarded by the product's subject version, so a product restored
-- or changed since the scan keeps its state and is reconsidered next run.
local function purge(c: threads.Client, catalog_id: string, days: integer, limit: integer, after: string): (integer?, integer?, string?, boolean?, error?)
    local db, err = store.open()
    if not db then return nil, nil, nil, nil, err end
    local rows, qerr = retention_rows.trashed(db, catalog_id, clock.ago(days), limit, after)
    qerr = error_envelope.cleanup(function() return db:release() end, qerr, "trash scan database release")
    if qerr then return nil, nil, nil, nil, qerr end
    local actor = (security.actor() :: security.Actor):id()
    local at = clock.now()
    local purged, skipped = 0, false
    local last = after
    for _, r in ipairs(rows or {}) do
        local product_id, iderr = store.need(r, "product_id")
        if iderr or not product_id then return nil, nil, nil, nil, iderr end
        local version, verr = store.need_int(r, "version")
        if verr or not version then return nil, nil, nil, nil, verr end
        local subject = "p:" .. product_id
        local body: types.ProductBody = { product_id = product_id, actor = actor, at = at }
        local event: types.Event = { type = consts.EVENTS.PRODUCT_PURGED, subject = subject, body = body }
        local _, aerr = threads.append(c, catalog_id, { event }, { subject = subject, version = version })
        if aerr then
            if not threads.mismatch(aerr, "version_mismatch") then return nil, nil, nil, nil, errors.wrap(aerr, "purge append failed") end
            skipped = true
        else purged = purged + 1 end
        last = json.encode({at=r.state_at,id=product_id}) :: string
    end
    return purged, #(rows or {}), last, skipped, nil
end

-- Each row class receives a share, including classes whose oldest rows are
-- protected. The catalog lock is shared with projection folding.
local function prune(catalog_id:string,effective:types.Policy,limit:integer,cursor:Cursor,had_cursor:boolean): (Pruned?,error?)
    return store.transaction("retention",function(tx:types.Executor,dialect:string): (Pruned?,error?)
        local catalog,cerr=store.catalog(tx,catalog_id,dialect)
        if cerr then return nil,cerr end
        if not catalog then return {removed=0,spent=0,more=false},nil end
        local out:Pruned={removed=0,spent=0,more=false}
        local defaults:{[string]:boolean}={}
        for _,attr in pairs(catalog.compiled.attributes) do
            if attr.default~=nil then
                for _,ref in ipairs(references.collect(attr,attr.default)) do
                    if ref.value.ref[1]=="term" then defaults[ref.value.ref[2]]=true end
                end
            end
        end
        local classes={"release_job","release_abandoned","proposal","import_map","import_work","publication","release","generation","term","usage","history","tombstone"}
        local start=cursor.next or 1
        for offset=0,#classes-1 do
            local n=(start+offset-1)%#classes+1
            local name=classes[n]
            local quota=limit-out.spent
            if out.spent==limit then out.more=true;break end
            local removed,spent,more=0,0,false
            local err:error?=nil
            if name=="release" or name=="generation" or name=="term" then
                if effective.audit_days>0 and not (cursor.complete or {})[name] then
                    local next_cursor:archive_rows.Cursor?
                    removed,spent,next_cursor,err=archive_rows.page(tx,catalog,name,clock.ago(effective.audit_days),quota,cursor.archives[name],defaults)
                    cursor.archives[name]=next_cursor
                    if not next_cursor and removed==0 then (cursor.complete :: {[string]:boolean})[name]=true end
                    more=next_cursor~=nil or (removed or 0)>0
                end
            elseif name=="history" then
                if effective.audit_days>0 then removed,err=history.prune(tx,catalog_id,clock.ago(effective.audit_days),quota);spent=removed;more=removed==quota end
            elseif name=="tombstone" then
                -- Three exact subject seeks plus one owner deletion per product.
                local capacity=math.min(33,quota//4)
                if capacity>0 then
                    out.tombstones,err=retention_rows.tombstones(tx,catalog_id,clock.ago(effective.tombstone_days),capacity)
                    spent=4*#(out.tombstones or {})
                    more=#(out.tombstones or {})==capacity
                else more=true end
                if more then cursor.next=n end
            else
                local table_name,keys,where,params="","","",{catalog_id} :: types.SqlParams
                if name=="release_job" then table_name="kickside_pim_release_job";keys="completed_at,request_id";where="done=1 AND completed_at<$2";params[2]=clock.ago(effective.completed_work_days)
                elseif name=="release_abandoned" then table_name="kickside_pim_release_job";keys="created_at,request_id";where="done=0 AND created_at<$2";params[2]=clock.ago(effective.abandoned_work_days)
                elseif name=="proposal" then table_name="kickside_pim_proposal";keys="created_at,proposal_id";where="created_at<$2";params[2]=clock.ago(effective.proposal_days)
                elseif name=="import_map" then table_name="kickside_pim_import_map";keys="old_id";where="EXISTS(SELECT 1 FROM kickside_pim_import_work w WHERE w.catalog_id=$1 AND w.done=1 AND w.completed_at<$2)";params[2]=clock.ago(effective.import_days)
                elseif name=="import_work" then table_name="kickside_pim_import_work";keys="catalog_id";where="done=1 AND completed_at<$2 AND NOT EXISTS(SELECT 1 FROM kickside_pim_import_map m WHERE m.catalog_id=$1)";params[2]=clock.ago(effective.import_days)
                elseif name=="publication" and effective.audit_days>0 then table_name="kickside_pim_publication";keys="updated_at,channel,product_id";where="state<>'published' AND updated_at<$2";params[2]=clock.ago(effective.audit_days)
                elseif name=="usage" then table_name="kickside_pim_attribute_usage";keys="attribute_id";where="products=0"
                end
                if table_name~="" then removed,more,err=cleanup_rows.page(tx,table_name,keys,"catalog_id=$1 AND "..where,params,quota);spent=removed end
            end
            if err or not removed or not spent then return nil,err end
            -- Deletion can remove a generation or term's last protection.
            if removed>0 then cursor.complete={} end
            out.removed=out.removed+removed;out.spent=out.spent+(spent :: integer);out.more=out.more or more
            if spent>0 and out.spent==limit then cursor.next=n%#classes+1 end
        end
        -- Cycle/completion metadata alone does not make an idle checkpoint dirty.
        if out.spent==0 and not had_cursor and not out.more then return out,nil end
        local encoded=json.encode(cursor)
        local _,uerr=tx:execute("UPDATE kickside_pim_catalog SET retention_after=$1 WHERE catalog_id=$2 AND retention_after<>$1",{encoded,catalog_id})
        if uerr then return nil,uerr end
        return out,nil
    end)
end

type Retained = { removed: integer, spent: integer, more: boolean, skipped: boolean?, deadline_ms: integer? }
local function retain(c:threads.Client,base:types.Policy,catalog_id:string,r:types.Row,limit:integer,cycle:string): (Retained?,error?)
    local decoded,derr=store.decode_row(r,{compiled="json"})
    if derr or not decoded then return nil,derr end
    local effective=policy.effective(base,((decoded.compiled :: types.Compiled).policy :: types.PolicyOverrides))
    local parsed,jerr=json.decode((r.retention_after or "{}") :: string)
    if jerr or type(parsed)~="table" then return nil,failure.corrupt("retention cursor is malformed","retention_after") end
    local cursor=parsed :: Cursor
    cursor.archives=cursor.archives or {}
    local had_cursor=cursor.trash~=nil or next(cursor.archives)~=nil
    if cursor.cycle~=cycle then cursor.cycle=cycle;cursor.complete={} end
    cursor.complete=cursor.complete or {}
    local db,err=store.open()
    if not db then return nil,err end
    local deadline,qerr=retention_rows.deadline(db,catalog_id,effective)
    qerr=store.release(db,qerr)
    if qerr then return nil,qerr end
    local share=math.max(1,limit//2)
    local purged,spent,last,skipped,perr=purge(c,catalog_id,effective.trash_days,share,cursor.trash or "")
    if perr or not purged or not spent or not last then return nil,perr end
    cursor.trash=spent==share and last or nil
    local pruned,prerr=prune(catalog_id,effective,limit-spent,cursor,had_cursor)
    if prerr or not pruned then return nil,prerr end
    local tombs=pruned.tombstones or {}
    if #tombs>0 then
        -- The final purge is projected. Product IDs cannot be restored/reused;
        -- older release/model writers lose the thread-head guard and rebuild
        -- against that permanent fence. Never retire reusable term identities.
        local subjects:{string}={}
        for _,row in ipairs(tombs) do
            for _,prefix in ipairs({"p:","r:","model-release:"}) do subjects[#subjects+1]=prefix..row.product_id end
        end
        local retired,rerr=c:retire_subjects({thread_id=catalog_id,subjects=subjects})
        if rerr then return nil,rerr end
        if not retired then return nil,failure.corrupt("subject retirement returned no result") end
        local removed,derr=store.transaction("retired tombstones",function(tx:types.Executor,dialect:string): (integer?,error?)
            local catalog,cerr=store.catalog(tx,catalog_id,dialect)
            if cerr then return nil,cerr end
            if not catalog then return 0,nil end
            return retention_rows.prune_tombstones(tx,catalog_id,tombs,catalog.tombstone_floor_seq)
        end)
        if derr or not removed then return nil,derr end
        pruned.removed=pruned.removed+removed
    end
    return {removed=purged+pruned.removed,spent=spent+pruned.spent,more=spent==share or pruned.more,skipped=skipped,deadline_ms=deadline},nil
end

function M.run(_input:unknown): Result
    local base,serr=defaults.read()
    if serr or not base then return {success=false,error=serr} end
    local BATCH, CATALOGS = base.maintenance_rows, base.maintenance_catalogs
    local global_share=math.min(50,BATCH//4)
    local abandoned,abandon_more,examined,abandon_err=creations.reclaim(global_share,base.pending_creation_days)
    if abandon_err or not abandoned or not examined then return {success=false,error=abandon_err} end
    local expire_more=false
    local expired,expire_err=store.transaction("global receipt expiry",function(tx:types.Executor,_dialect:string): (integer?,error?)
        local n,more,err=retention_rows.orphan_receipts(tx,global_share)
        expire_more=more
        return n,err
    end)
    if expire_err or not expired then return {success=false,error=expire_err} end
    local cleaned,cerr=cleanup.run(BATCH//2)
    if cerr then return {success=false,error=cerr} end
    local blocked:{{component_id:string,error:error}}=cleaned and cleaned.blocked or {}
    local db,err=store.open()
    if not db then return {success=false,error=err} end
    local global_deadline,gerr=retention_rows.global_deadline(db,base.pending_creation_days)
    if gerr then return {success=false,error=store.release(db,gerr)} end
    local position,perr=retention_rows.position(db)
    local rows:{types.Row}?
    if not perr and position then rows,perr=retention_rows.catalogs(db,position,CATALOGS+1) end
    perr=store.release(db,perr)
    if perr or not position then return {success=false,error=perr} end
    local c,terr=threads.open()
    if terr or not c then return {success=false,error=terr} end
    local deleted,spent,visited=abandoned+expired+(cleaned and cleaned.deleted or 0),examined+expired+(cleaned and cleaned.deleted or 0),0
    -- Keep one archive scan cycle across installation pages and repeat sweeps.
    -- The singleton's former product cursor is unused by per-catalog trash scans.
    local cycle=position.product_after~="" and position.product_after or tostring(clock.deadline(0).ns)
    local next_position:retention_rows.Position=position
    local deadline=position.deadline_ms
    if global_deadline then deadline=deadline and math.min(deadline,global_deadline) or global_deadline end
    local page=rows or {}
    local scan_more=#page>CATALOGS
    local backlog,deferred=position.pending==1 or abandon_more==true or expire_more,false
    for i=1,math.min(#page,CATALOGS) do
        if spent==BATCH then scan_more=true;break end
        local row=page[i]
        local catalog_id,iderr=store.need(row,"catalog_id")
        if iderr or not catalog_id then return {success=false,error=iderr} end
        local retained,rerr=retain(c,base,catalog_id,row,math.min(50,BATCH-spent),cycle)
        visited=visited+1
        next_position={catalog_id=catalog_id,inclusive=0,product_after=""}
        if rerr then blocked[#blocked+1]={component_id=catalog_id,error=rerr}
        elseif retained then
            deleted=deleted+retained.removed;spent=spent+retained.spent
            backlog=backlog or retained.more
            deferred=deferred or retained.skipped==true
            if retained.deadline_ms then deadline=deadline and math.min(deadline,retained.deadline_ms) or retained.deadline_ms end
        end
    end
    if not scan_more then next_position={catalog_id="",inclusive=0,product_after=""} end
    local more=scan_more or backlog or deferred or (cleaned and cleaned.needs_continue==true) or false
    if deadline and deadline<=clock.millis() then deadline=nil;more=true end
    next_position.product_after=more and cycle or ""
    if scan_more then next_position.deadline_ms=deadline;next_position.pending=backlog and 1 or 0 end
    local _,aerr=store.transaction("retention position",function(tx:types.Executor,_dialect:string): (boolean?,error?)
        local err=retention_rows.advance(tx,next_position)
        if err then return nil,err end
        return true,nil
    end)
    if aerr then return {success=false,deleted=deleted,catalogs=visited,error=aerr} end
    return {success=true,blocked=blocked,deleted=deleted,catalogs=visited,needs_continue=more,sweep_complete=not more,deadline_ms=deadline}
end
return M
