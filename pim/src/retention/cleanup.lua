-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Durable teardown pages finish before their lifecycle completion report.
local store = require("store")
local rows = require("retention_rows")
local cleanup_rows = require("cleanup_rows")
local lifecycle_report = require("lifecycle_report")
local types = require("types")
local M = {}
type Page = { catalog_id: string, cleaned: boolean, deleted: integer }
type Result = { deleted: integer, catalogs: integer, needs_continue: boolean, blocked: {{component_id:string,error:error}} }

function M.report(catalog_id: string): error?
    local reported, err = lifecycle_report.component_deleted(catalog_id)
    if err then return errors.wrap(err, "catalog delete report") end
    if not reported then return errors.new({ kind = errors.INTERNAL, message = "catalog delete report returns no result", details = { code = "internal" } }) end
    local _, ferr = store.transaction("catalog cleanup report", function(tx: types.Executor, _dialect: string): (boolean?, error?)
        local derr = rows.finish_cleanup(tx, catalog_id)
        if derr then return nil, derr end
        return true, nil
    end)
    return ferr
end

function M.run(limit: integer, catalog_limit: integer): (Result?,error?)
    local candidates,err=store.with_db(function(db): ({rows.Cleanup}?,error?) return rows.cleanup_page(db,catalog_limit+1) end)
    if err or not candidates then return nil,err end
    local deleted,visited=0,0
    local blocked: {{component_id:string,error:error}}={}
    local more=#candidates>catalog_limit
    for i=1,math.min(#candidates,catalog_limit) do
        if deleted==limit then more=true;break end
        local selected=candidates[i]
        visited=visited+1
        local _,aerr=store.transaction("cleanup attempt",function(tx: types.Executor,_dialect: string): (boolean?,error?)
            local err=rows.attempt_cleanup(tx,selected.catalog_id)
            if err then return nil,err end
            return true,nil
        end)
        if aerr then return nil,aerr end
        local page,perr=store.transaction("catalog cleanup",function(tx: types.Executor,dialect: string): (Page?,error?)
            local cleaned,spent=selected.cleaned==1,0
            if not cleaned then
                local done,derr,count=cleanup_rows.catalog(tx,dialect,selected.catalog_id,math.min(50,limit-deleted))
                if derr then return nil,derr end
                cleaned,spent=done==true,count :: integer
                local qerr=rows.enqueue_cleanup(tx,selected.catalog_id,cleaned)
                if qerr then return nil,qerr end
            end
            return {catalog_id=selected.catalog_id,cleaned=cleaned,deleted=spent},nil
        end)
        if page then deleted=deleted+page.deleted;more=more or not page.cleaned end
        if not perr and page and page.cleaned then perr=M.report(page.catalog_id) end
        if perr then blocked[#blocked+1]={component_id=selected.catalog_id,error=perr} end
    end
    return {deleted=deleted,catalogs=visited,needs_continue=more,blocked=blocked},nil
end
return M
