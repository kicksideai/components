-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Durable teardown pages finish before their lifecycle completion report.
local store = require("store")
local assets = require("assets")
local rows = require("retention_rows")
local cleanup_rows = require("cleanup_rows")
local lifecycle_report = require("lifecycle_report")
local types = require("types")
local M = {}
type Page = { catalog_id: string, cleaned: boolean, deleted: integer }
type Result = { spent: integer, deadline_ms: integer?, deleted: integer, catalogs: integer, needs_continue: boolean, blocked: {{component_id:string,error:error}} }

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
    local deleted,visited,spent=0,0,0
    local blocked: {{component_id:string,error:error}}={}
    local more=#candidates>catalog_limit
    local deadline: integer?
    for i=1,math.min(#candidates,catalog_limit) do
        if spent==limit then more=true;break end
        local selected=candidates[i]
        visited=visited+1
        local _,aerr=store.transaction("cleanup attempt",function(tx: types.Executor,_dialect: string): (boolean?,error?)
            local err=rows.attempt_cleanup(tx,selected.catalog_id)
            if err then return nil,err end
            return true,nil
        end)
        if aerr then return nil,aerr end
        local media, media_err = assets.collect(selected.catalog_id, math.min(10, limit-spent), true)
        if media_err or not media then return nil, media_err end
        deleted = deleted + media.deleted
        spent = spent + media.spent
        if media.deadline_ms then
            deadline = deadline and math.min(deadline, media.deadline_ms) or media.deadline_ms
        end
        if media.error then
            blocked[#blocked+1] = {component_id = selected.catalog_id, error = media.error}
            more = more or media.more
        elseif media.more or media.deadline_ms or spent==limit then
            more = more or spent==limit or (media.more and (media.spent > 0 or not media.deadline_ms))
        else
            local page,perr=store.transaction("catalog cleanup",function(tx: types.Executor,dialect: string): (Page?,error?)
                local cleaned,rows_removed=selected.cleaned==1,0
                if not cleaned then
                    local done,derr,count=cleanup_rows.catalog(tx,dialect,selected.catalog_id,math.min(50,limit-spent))
                    if derr then return nil,derr end
                    cleaned,rows_removed=done==true,count :: integer
                    local qerr=rows.enqueue_cleanup(tx,selected.catalog_id,cleaned)
                    if qerr then return nil,qerr end
                end
                return {catalog_id=selected.catalog_id,cleaned=cleaned,deleted=rows_removed},nil
            end)
            if page then deleted=deleted+page.deleted;spent=spent+page.deleted;more=more or not page.cleaned end
            if not perr and page and page.cleaned then perr=M.report(page.catalog_id) end
            if perr then blocked[#blocked+1]={component_id=selected.catalog_id,error=perr} end
        end
    end
    return {deleted=deleted,spent=spent,catalogs=visited,needs_continue=more,blocked=blocked,deadline_ms=deadline},nil
end
return M
