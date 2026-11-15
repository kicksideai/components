-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A resumable upgrade: process data and recovered timer enrollment share each
-- bounded progress transaction. Native Jobs remains the owner of slot history.
local store = require("store")
local process = require("process")
local fold_process = require("fold_process")
local types = require("types")
local domain = require("domain")
local limits = require("limits")
local M = {}

function M.batch(input: types.BatchRequest): (types.BoardBatchResult?, error?)
    local settings, settings_err = limits.read()
    if settings_err or not settings then return nil, settings_err end
    local db, err=store.open()
    if not db then return nil,err end
    local tx,terr=db:begin()
    if terr or not tx then db:release(); return nil,terr end
    local function run(): (types.BoardBatchResult?,error?)
        local records,rerr=tx:query("SELECT job_id,key FROM kickside_work_job WHERE board_id=$1 AND job_type='recovery'",{input.board_id})
        if rerr then return nil,rerr end
        local row=records and records[1]
        if not row then return {done=true},nil end
        local progress,perr=store.stored(row.key,{} :: {phase:string,after:string})
        if perr or not progress then return nil,perr end
        local board,berr=store.board(tx,input.board_id,db:type())
        if berr or not board then return nil,berr end
        if progress.phase=="items" then
            local ids,ierr=tx:query([[SELECT item_id FROM kickside_work_item WHERE board_id=$1 AND item_id>$2
                AND life<>'purged' ORDER BY item_id LIMIT $3]],{input.board_id,progress.after,settings.recovery_batch})
            if ierr then return nil,ierr end
            for _, held in ipairs(ids or {}) do
                local item,item_err=store.item(tx,input.board_id,held.item_id :: string)
                if item_err or not item then return nil,item_err end
                -- store.item applies the historical interpretation; persist it now.
                local _, uerr=tx:execute("UPDATE kickside_work_item SET process_data=$1 WHERE board_id=$2 AND item_id=$3",{store.encode(item.work),input.board_id,item.item_id})
                if uerr then return nil,uerr end
                if item.life=="live" then
                    local active: {domain.StateItem}={item}
                    for id in pairs(item.work.region_data or {}) do active[#active+1]=process.region(item,id) end
                    for _, state in ipairs(active) do
                        for timer,due in pairs(state.work.timer_due or {}) do
                            local attempt=timer:match("^%$stage:(%d+)$") or timer:match("^%$retry:(%d+)$")
                            local aerr=fold_process.schedule(tx,db:type(),board,state :: domain.Item,timer,due,attempt and math.tointeger(tonumber(attempt)) or nil,nil)
                            if aerr then return nil,aerr end
                        end
                    end
                end
                progress.after=item.item_id
            end
            if #(ids or {})<settings.recovery_batch then return {done=true},nil end
        end
        local _, uerr=tx:execute("UPDATE kickside_work_job SET key=$1 WHERE board_id=$2 AND job_id=$3",{store.encode(progress),input.board_id,row.job_id})
        if uerr then return nil,uerr end
        return {done=false},nil
    end
    local result,rerr=run()
    if rerr then tx:rollback();db:release();return nil,rerr end
    local _,cerr=tx:commit();db:release()
    if cerr then return nil,cerr end
    return result,nil
end
return M
