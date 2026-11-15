-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Receipts share the catalog event window, including successful eventless writes.
local store = require("store")
local values = require("values")
local clock = require("clock")
local registry = require("registry")
local types = require("types")
local sql=require("sql")
local M = {}
type Receipt = {request_hash: string?, result: types.JsonObject?, event_count: integer?, noop: boolean?, marker: string?}
M.Receipt = Receipt
local function get(db: types.Executor,catalog_id: string,marker: string): (Receipt?,integer?,error?)
    local rows,qerr=db:query("SELECT * FROM kickside_pim_receipt WHERE catalog_id=$1 AND marker=$2 AND expires_at > $3",{catalog_id,marker,clock.now()})
    if qerr then return nil,nil,qerr end
    if not rows or not rows[1] then return nil,nil,nil end
    local r,derr=store.decode_row(rows[1],{request_hash="text",result="json",first_seq="int",event_count="int",noop="int"})
    if derr or not r then return nil,nil,derr end
    return {request_hash=r.request_hash :: string,result=r.result :: types.JsonObject,event_count=r.event_count :: integer,noop=r.noop==1},r.first_seq :: integer,nil
end
function M.get(catalog_id: string, marker: string): (Receipt?, integer?, error?)
    local db,err=store.open()
    if not db then return nil,nil,err end
    local receipt,seq,qerr=get(db,catalog_id,marker)
    qerr=store.release(db,qerr)
    if qerr then return nil,nil,qerr end
    return receipt,seq,nil
end
local function record(tx: types.Executor, catalog_id: string, receipt: Receipt, seq: integer, at: string): error?
    if not receipt.marker then return nil end
    local binding,berr=registry.get("kickside.pim.binding:catalog")
    if berr or not binding then return berr end
    local days=((binding :: types.JsonObject).meta :: types.JsonObject).retention.event_days :: integer
    local _,err=tx:execute([[INSERT INTO kickside_pim_receipt(catalog_id,marker,request_hash,result,first_seq,event_count,noop,expires_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(catalog_id,marker) DO UPDATE SET
        request_hash=excluded.request_hash,result=excluded.result,first_seq=excluded.first_seq,event_count=excluded.event_count,
        noop=excluded.noop,expires_at=excluded.expires_at WHERE kickside_pim_receipt.expires_at <= $9 OR (kickside_pim_receipt.request_hash=excluded.request_hash AND kickside_pim_receipt.event_count=0 AND kickside_pim_receipt.noop=0)]],
        {catalog_id,receipt.marker,receipt.request_hash,values.canonical(receipt.result),seq,receipt.event_count,receipt.noop and 1 or 0,clock.after(at,days),at})
    return err
end
-- Projection folding already holds the catalog lock and materializes the first
-- schema before recording its result. It never admits a missing owner.
function M.record(tx:types.Executor,catalog_id:string,receipt:Receipt,seq:integer,at:string): error?
    local rows,err=tx:query([[SELECT catalog_id FROM kickside_pim_catalog WHERE catalog_id=$1
        AND NOT EXISTS(SELECT 1 FROM kickside_pim_cleanup WHERE catalog_id=$1)]],{catalog_id})
    if err then return err end
    if #(rows or {})==0 then return errors.new({kind=errors.NOT_FOUND,message="catalog is absent or deleting",details={code="catalog_not_found"}}) end
    return record(tx,catalog_id,receipt,seq,at)
end
-- Both paths reserve under the fold's catalog lock. A zero-count non-noop is
-- a pending hash reservation, completed only by the fold or an eventless result.
local function reserve(catalog_id: string,marker: string,hashed: string,seq: integer,at: string,result: types.JsonObject?): (boolean?,error?)
    return store.transaction("command key reservation",function(tx: types.Executor,dialect: string): (boolean?,error?)
        local catalog,cerr=store.catalog(tx,catalog_id,dialect)
        if cerr then return nil,cerr end
        local suffix=dialect==sql.type.POSTGRES and " FOR UPDATE" or ""
        local creation,qerr=tx:query("SELECT component_id FROM kickside_pim_creation WHERE catalog_id=$1 AND component_id=$1 AND reserved_at IS NULL"..suffix,{catalog_id})
        if qerr then return nil,qerr end
        local deleting,derr=tx:query("SELECT catalog_id FROM kickside_pim_cleanup WHERE catalog_id=$1",{catalog_id})
        if derr then return nil,derr end
        if #(deleting or {})>0 or (not catalog and (result~=nil or seq~=0 or #(creation or {})==0)) then
            return nil,errors.new({kind=errors.NOT_FOUND,message="catalog is absent or deleting",details={code="catalog_not_found"}})
        end
        local prior,_,rerr=get(tx,catalog_id,marker)
        if rerr then return nil,rerr end
        if prior and prior.request_hash~=hashed then
            return nil,errors.new({kind=errors.CONFLICT,message="idempotency key reused with a different request",details={code="idempotency_conflict"}})
        end
        if prior and (prior.noop or prior.event_count~=0) then return false,nil end
        if catalog and catalog.applied_seq~=seq then return false,nil end
        if prior and not result then return true,nil end
        local err=record(tx,catalog_id,{marker=marker,request_hash=hashed,result=result or {},event_count=0,noop=result~=nil},seq,at)
        if err then return nil,err end
        -- The first schema has no catalog row to lock yet. The receipt's unique
        -- key arbitrates that case; read the insert winner before appending.
        local winner,_,werr=get(tx,catalog_id,marker)
        if werr then return nil,werr end
        if not winner or winner.request_hash~=hashed then
            return nil,errors.new({kind=errors.CONFLICT,message="idempotency key reused with a different request",details={code="idempotency_conflict"}})
        end
        return result~=nil or (not winner.noop and winner.event_count==0),nil
    end)
end
function M.reserve(catalog_id: string,marker: string,hashed: string,seq: integer,at: string): (boolean?,error?)
    return reserve(catalog_id,marker,hashed,seq,at,nil)
end
function M.noop(catalog_id: string,marker: string,hashed: string,result: types.JsonObject,seq: integer,at: string): (boolean?,error?)
    return reserve(catalog_id,marker,hashed,seq,at,result)
end
return M
