-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply_ops = require("apply_ops")
local sql = require("sql")
local time = require("time")
local types = require("types")
local M = {}
function M.apply(request: types.ApplyRequest, boundary: unknown): (types.ApplyResult?, error?)
    local out, err = apply_ops.apply(request, boundary)
    if err or not out then return nil, err end
    local db, derr = sql.get("app:db")
    if not db then return nil, derr end
    local _, cerr = db:execute("CREATE TABLE IF NOT EXISTS work_bulk_page_gate (board_id TEXT PRIMARY KEY, arrived INTEGER NOT NULL, released INTEGER NOT NULL, interrupt INTEGER NOT NULL)")
    if cerr then db:release(); return nil, cerr end
    local rows, rerr = db:query("UPDATE work_bulk_page_gate SET arrived = 1 WHERE board_id = $1 AND arrived = 0 RETURNING released,interrupt", { request.board_id })
    db:release()
    if rerr then return nil, rerr end
    if not rows or not rows[1] then return out, nil end
    if tonumber(rows[1].interrupt) == 1 then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "bulk page is interrupted after its accepted chunk", details = { code = "bulk_page_interrupted" } })
    end
    for _ = 1, 600 do
        local handle, herr = sql.get("app:db")
        if not handle then return nil, herr end
        local gates, gerr = handle:query("SELECT released FROM work_bulk_page_gate WHERE board_id = $1", { request.board_id })
        handle:release()
        if gerr then return nil, gerr end
        if gates and gates[1] and tonumber(gates[1].released) == 1 then return out, nil end
        time.sleep("100ms")
    end
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "bulk page waits for its test release", details = { code = "bulk_page_gate_timeout" } })
end
return M
