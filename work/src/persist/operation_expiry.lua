-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local policy = require("policy")
local clock = require("clock")
local store = require("store")
local jobs = require("jobs")
local M = {}

M.TERMINAL = "status IN ('done', 'cancelled', 'failed')"
M.RETIRABLE = M.TERMINAL .. " AND NOT (kind = 'move' AND EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = kickside_work_operation.board_id AND i.move_id = kickside_work_operation.operation_id))"

function M.at(dialect: string): string
    local captured = dialect == "postgres" and "(actor_context::jsonb ->> 'captured_at')" or "json_extract(actor_context, '$.captured_at')"
    return "(substr(" .. captured .. ", 1, 19) || '.000000000Z')"
end

function M.before(): (string?, error?)
    local days, err = policy.event_days()
    if err or not days then return nil, err end
    return clock.offset(-days * 86400), nil
end

function M.retire(board_id: string, kind: string?, key: string?): (boolean?, error?)
    local before, berr = M.before()
    if berr or not before then return nil, berr end
    local db, err = store.open()
    if err or not db then return nil, err end
    local params: { unknown } = { board_id, before }
    local named = ""
    if kind then named = " AND kind = $3 AND key = $4"; params[3], params[4] = kind, key end
    local rows, rerr = db:query("SELECT operation_id,kind FROM kickside_work_operation WHERE board_id = $1 AND " ..
        M.RETIRABLE .. " AND " .. M.at(db:type()) .. " < $2" .. named .. " ORDER BY operation_id LIMIT 1", params)
    if rerr then db:release(); return nil, rerr end
    if not rows or not rows[1] then db:release(); return false, nil end
    local row = rows[1]
    local _, perr = jobs.purge_slot({ namespace = "kickside.work", scope = board_id, key = (row.kind :: string) .. ":" .. (row.operation_id :: string) })
    if perr then db:release(); return nil, perr end
    local deleted, derr = db:query("DELETE FROM kickside_work_operation WHERE board_id = $1 AND operation_id = $2 AND " ..
        M.RETIRABLE .. " AND " .. M.at(db:type()) .. " < $3 RETURNING operation_id", { board_id, row.operation_id, before })
    db:release()
    if derr then return nil, derr end
    return deleted ~= nil and deleted[1] ~= nil, nil
end

return M
