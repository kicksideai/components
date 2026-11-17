-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local policy = require("policy")
local store = require("store")
local jobs = require("jobs")
local threads = require("threads")
local types = require("types")
local M = {}

M.TERMINAL = "status IN ('done', 'cancelled', 'failed')"
M.RETIRABLE = M.TERMINAL .. " AND NOT (kind = 'move' AND EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = kickside_work_operation.board_id AND i.move_id = kickside_work_operation.operation_id))"

-- Phase receipts remain authoritative until their durable owner can retire.
M.PROTECTED_RECEIPT = "EXISTS (SELECT 1 FROM kickside_work_operation WHERE operation_id = CASE " ..
    "WHEN command_key LIKE 'move/%' THEN substr(command_key,6,36) WHEN command_key LIKE 'bulk/%' THEN substr(command_key,6,36) " ..
    "WHEN command_key LIKE 'apply/bulk/%' THEN substr(command_key,12,36) WHEN command_key LIKE 'schema/pack/%' THEN substr(command_key,13,36) " ..
    "WHEN command_key LIKE 'apply/pack/%' THEN substr(command_key,12,36) END AND NOT (" .. M.RETIRABLE .. ") AND (" ..
    "command_key LIKE ('move/' || operation_id || '/%') OR command_key LIKE ('bulk/' || operation_id || '/%') OR " ..
    "command_key LIKE ('apply/bulk/' || operation_id || '/%') OR command_key = ('schema/pack/' || operation_id) OR " ..
    "command_key LIKE ('apply/pack/' || operation_id || '/%')))"

function M.at(dialect: string): string
    local captured = dialect == "postgres" and "(actor_context::jsonb ->> 'captured_at')" or "json_extract(actor_context, '$.captured_at')"
    return "(substr(" .. captured .. ", 1, 19) || '.000000000Z')"
end

-- The age expression is an index key, but SQLite cannot seek it in a row
-- tuple. Equal-age and later-age seeks each inspect at most one candidate.
function M.selection(dialect: string, named: string, continuing: boolean): string
    local at=M.at(dialect)
    local head="SELECT *, " .. at .. " AS retention_at FROM kickside_work_operation WHERE board_id=$1 AND " .. M.TERMINAL .. " AND " .. at .. "<$2"
    local candidates=head .. named .. " ORDER BY " .. at .. ",operation_id LIMIT 1"
    if continuing then
        candidates="SELECT * FROM (SELECT * FROM (" .. head .. " AND " .. at .. "=$3 AND operation_id>$4 ORDER BY operation_id LIMIT 1) same_age UNION ALL SELECT * FROM (" .. head .. " AND " .. at .. ">$3 ORDER BY " .. at .. ",operation_id LIMIT 1) later_age) candidates ORDER BY retention_at,operation_id LIMIT 1"
    end
    return "SELECT kickside_work_operation.*, CASE WHEN " .. M.RETIRABLE .. " THEN 1 ELSE 0 END AS eligible FROM (" .. candidates .. ") kickside_work_operation"
end

function M.retire(board_id: string, kind: string?, key: string?, after: string?, window: types.EventWindow?): (boolean?, error?, string?)
    local db, err = store.open()
    if err or not db then return nil, err end
    if not window then
        window, err = policy.event_window(db, board_id)
        if err or not window then db:release(); return nil, err end
    end
    local before = window.before
    if not before then db:release(); return false, nil end
    local params: { unknown } = { board_id, before }
    local named = ""
    local continuing=false
    if kind then named = " AND kind = $3 AND key = $4"; params[3], params[4] = kind, key
    elseif after and after~="" then
        local anchor,aerr=store.stored(after,{} :: types.OperationPosition)
        if aerr or not anchor then db:release();return nil,aerr end
        params[3],params[4]=anchor.at,anchor.id
        continuing=true
    end
    local rows, rerr = db:query(M.selection(db:type(),named,continuing),params)
    if rerr then db:release(); return nil, rerr end
    if not rows or not rows[1] then db:release(); return false, nil end
    local row = rows[1]
    local next_after=not kind and (store.encode({at=row.retention_at,id=row.operation_id}) :: string) or nil
    if store.int(row.eligible)~=1 then db:release();return false,nil,next_after end
    local _, perr = jobs.purge_slot({ namespace = "kickside.work", scope = board_id, key = (row.kind :: string) .. ":" .. (row.operation_id :: string) })
    if perr then
        db:release()
        if not kind and (perr:details() or {}).cleanup_pending then return true,nil,after or "" end
        return nil,perr
    end
    local retirement_err = threads.retire(board_id,{(row.kind :: string) .. ":" .. (row.operation_id :: string)})
    if retirement_err then db:release(); return nil,retirement_err end
    local deleted, derr = db:query("DELETE FROM kickside_work_operation WHERE board_id = $1 AND operation_id = $2 AND " ..
        M.RETIRABLE .. " AND " .. M.at(db:type()) .. " < $3 RETURNING operation_id", { board_id, row.operation_id, before })
    db:release()
    if derr then return nil, derr end
    return deleted ~= nil and deleted[1] ~= nil, nil, next_after
end

return M
