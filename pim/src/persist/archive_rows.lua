-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Age-ordered candidate pages: protected rows consume budget and advance the
-- cursor, so neither their number nor their position makes a pass unbounded.
local types=require("types")
local M={}
type Key=string|integer
type Cursor={at:string,keys:{Key}}
M.Cursor=Cursor
local CLASSES:{[string]:{table:string,at:string,keys:{string},filter:string}}={
    release={table="kickside_pim_release",at="created_at",keys={"release_id"},filter=""},
    generation={table="kickside_pim_generation",at="applied_at",keys={"generation"},filter=""},
    term={table="kickside_pim_term",at="retired_at",keys={"vocabulary","code"},filter=" AND retired=1"},
}
local function exists(tx:types.Executor,statement:string,params:types.SqlParams): (boolean?,error?)
    local rows,err=tx:query(statement.." LIMIT 1",params)
    if err then return nil,err end
    return rows~=nil and #rows>0,nil
end
local function protected(tx:types.Executor,catalog:types.Catalog,name:string,row:types.Row,defaults:{[string]:boolean}): (boolean?,error?)
    local id=catalog.catalog_id
    if name=="release" then
        return exists(tx,"SELECT 1 FROM kickside_pim_publication WHERE catalog_id=$1 AND release_id=$2 AND state='published'",{id,row.release_id})
    elseif name=="generation" then
        if tonumber(row.generation)==catalog.generation or catalog.rebuild_after then return true,nil end
        local pending,err=exists(tx,"SELECT 1 FROM kickside_pim_schema_work WHERE catalog_id=$1",{id})
        if err or pending then return pending,err end
        return exists(tx,"SELECT 1 FROM kickside_pim_release WHERE catalog_id=$1 AND generation=$2",{id,row.generation})
    end
    local vocabulary,code=row.vocabulary :: string,row.code :: string
    if defaults[vocabulary..":"..code] then return true,nil end
    local parent,perr=exists(tx,"SELECT 1 FROM kickside_pim_term WHERE catalog_id=$1 AND vocabulary=$2 AND parent=$3",{id,vocabulary,code})
    if perr or parent then return parent,perr end
    local used,uerr=exists(tx,"SELECT 1 FROM kickside_pim_ref WHERE catalog_id=$1 AND kind='term' AND target=$2",{id,vocabulary..":"..code})
    if uerr or used then return used,uerr end
    local merging,merr=exists(tx,"SELECT 1 FROM kickside_pim_merge WHERE catalog_id=$1 AND vocabulary=$2 AND from_code=$3",{id,vocabulary,code})
    if merr or merging then return merging,merr end
    return exists(tx,"SELECT 1 FROM kickside_pim_merge WHERE catalog_id=$1 AND vocabulary=$2 AND into_code=$3",{id,vocabulary,code})
end
function M.page(tx:types.Executor,catalog:types.Catalog,name:string,before:string,limit:integer,cursor:Cursor?,defaults:{[string]:boolean}): (integer?,integer?,Cursor?,error?)
    if limit==0 then return 0,0,cursor,nil end
    local class=CLASSES[name]
    local cols={class.at}
    for _,key in ipairs(class.keys) do cols[#cols+1]=key end
    local params:types.SqlParams={catalog.catalog_id,before}
    local condition="catalog_id=$1 AND "..class.at.."<$2"..class.filter
    if cursor then
        params[#params+1]=cursor.at
        local marks={"$3"}
        for _,key in ipairs(cursor.keys) do params[#params+1]=key;marks[#marks+1]="$"..#params end
        condition=condition.." AND ("..table.concat(cols,",")..")>("..table.concat(marks,",")..")"
    end
    params[#params+1]=limit
    local rows,err=tx:query("SELECT "..table.concat(cols,",").." FROM "..class.table.." WHERE "..condition.." ORDER BY "..table.concat(cols,",").." LIMIT $"..#params,params)
    if err then return nil,nil,nil,err end
    local removed=0
    local last:Cursor?=nil
    for _,row in ipairs(rows or {}) do
        local keys:{Key}={}
        for _,key in ipairs(class.keys) do keys[#keys+1]=row[key] :: Key end
        last={at=row[class.at] :: string,keys=keys}
        local keep,kerr=protected(tx,catalog,name,row,defaults)
        if kerr then return nil,nil,nil,kerr end
        if not keep then
            if name=="release" then
                local _,uerr=tx:execute("UPDATE kickside_pim_product SET release_id=NULL WHERE catalog_id=$1 AND release_id=$2",{catalog.catalog_id,row.release_id})
                if uerr then return nil,nil,nil,uerr end
            end
            local bound:types.SqlParams={catalog.catalog_id}
            local where="catalog_id=$1"
            for _,key in ipairs(class.keys) do bound[#bound+1]=row[key];where=where.." AND "..key.."=$"..#bound end
            local _,derr=tx:execute("DELETE FROM "..class.table.." WHERE "..where,bound)
            if derr then return nil,nil,nil,derr end
            removed=removed+1
        end
    end
    local spent=#(rows or {})
    return removed,spent,spent==limit and last or nil,nil
end
return M
