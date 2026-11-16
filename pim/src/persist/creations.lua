-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A durable token reserves creation before registration; component fields alone prove nothing.
local store=require("store")
local values=require("values")
local types=require("types")
local uuid=require("uuid")
local clock=require("clock")
local component=require("component")
local sql=require("sql")
local M={}
function M.token(): string return uuid.v4() :: string end
function M.proves(catalog_id: string, component_id: string, request: unknown, token: unknown): (boolean?,error?)
    local db,err=store.open()
    if not db then return nil,err end
    local rows,qerr=db:query("SELECT request,token FROM kickside_pim_creation WHERE catalog_id=$1 AND component_id=$2",{catalog_id,component_id})
    qerr=store.release(db,qerr)
    if qerr then return nil,qerr end
    return rows~=nil and rows[1]~=nil and rows[1].request==values.canonical(request) and type(token)=="string" and rows[1].token==token,nil
end
function M.prepare(catalog_id: string,component_id: string,request: unknown): (string?,error?)
    return store.transaction("prepare component provenance",function(tx: types.Executor,_dialect: string): (string?,error?)
        local token=M.token()
        local _,ierr=tx:execute("INSERT INTO kickside_pim_creation(catalog_id,component_id,request,token,reserved_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT(component_id) DO UPDATE SET reserved_at=excluded.reserved_at WHERE kickside_pim_creation.reserved_at IS NOT NULL",{catalog_id,component_id,values.canonical(request),token,clock.now()})
        if ierr then return nil,ierr end
        local rows,qerr=tx:query("SELECT catalog_id,request,token FROM kickside_pim_creation WHERE component_id=$1",{component_id})
        if qerr then return nil,qerr end
        local row=rows and rows[1]
        if not row or row.catalog_id~=catalog_id or row.request~=values.canonical(request) then
            return nil,errors.new({kind=errors.CONFLICT,message="creation request differs",details={code="idempotency_conflict"}})
        end
        return row.token :: string,nil
    end)
end
-- An accepted PIM removal ends this instance's ownership. External repair
-- deletion does not call this path and keeps its record for replacement checks.
function M.forget(component_id: string): error?
    local _,err=store.transaction("retire component provenance",function(tx:types.Executor,_dialect:string): (boolean?,error?)
        local _,derr=tx:execute("DELETE FROM kickside_pim_creation WHERE component_id=$1",{component_id})
        if derr then return nil,derr end
        return true,nil
    end)
    return err
end
-- Confirmation never replaces the token; a registered but interrupted request
-- remains recoverable even if confirmation itself fails.
function M.confirm(component_id:string): error?
    local _,err=store.transaction("confirm component provenance",function(tx:types.Executor,_dialect:string): (boolean?,error?)
        local _,uerr=tx:execute("UPDATE kickside_pim_creation SET reserved_at=NULL WHERE component_id=$1 AND reserved_at IS NOT NULL",{component_id})
        return uerr==nil,uerr
    end)
    return err
end
-- Global discovery is necessary: failed registration has no catalog owner.
-- Only pending reservations age; one bounded component lookup reconciles any
-- successful registration whose caller stopped before confirmation.
function M.reclaim(limit:integer,days:integer): (integer?,boolean?,integer?,error?)
    local candidates,err=store.with_db(function(db:types.Executor): ({types.Row}?,error?)
        return db:query("SELECT component_id,token FROM kickside_pim_creation WHERE reserved_at IS NOT NULL AND reserved_at<$1 ORDER BY reserved_at,component_id LIMIT $2",{clock.ago(days),limit})
    end)
    if err or not candidates then return nil,nil,nil,err end
    local ids:{string}={}
    for _,row in ipairs(candidates) do ids[#ids+1]=row.component_id :: string end
    local present:{[string]:boolean}={}
    if #ids>0 then
        local components,cerr=component.list_system({component_ids=ids,limit=#ids})
        if cerr then return nil,nil,nil,cerr end
        for _,row in ipairs(components or {}) do present[row.component_id]=true end
    end
    local removed,derr=store.transaction("expire creation reservations",function(tx:types.Executor,dialect:string): (integer?,error?)
        local n=0
        for _,row in ipairs(candidates) do
            -- Lock/recheck the age so a reconciliation cannot delete a confirmed row.
            local suffix=dialect==sql.type.POSTGRES and " FOR UPDATE" or ""
            local pending,qerr=tx:query("SELECT component_id FROM kickside_pim_creation WHERE component_id=$1 AND token=$2 AND reserved_at IS NOT NULL AND reserved_at<$3"..suffix,{row.component_id,row.token,clock.ago(days)})
            if qerr then return nil,qerr end
            if #(pending or {})>0 then
                local statement=present[row.component_id :: string] and "UPDATE kickside_pim_creation SET reserved_at=NULL WHERE component_id=$1" or "DELETE FROM kickside_pim_creation WHERE component_id=$1"
                local _,uerr=tx:execute(statement,{row.component_id})
                if uerr then return nil,uerr end
                if not present[row.component_id :: string] then n=n+1 end
            end
        end
        return n,nil
    end)
    if derr or not removed then return nil,nil,nil,derr end
    return removed,#candidates==limit,#candidates,nil
end
return M
