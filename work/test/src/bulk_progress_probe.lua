-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local events = require("events")
local sql = require("sql")
local time = require("time")
local domain = require("domain")
local M = {}
function M.progress(board: string, id: string, kind: string, processed: integer, total: integer, status: string, counts: { [string]: integer }, boundary: domain.Deadline?): error?
    if processed > 0 then
        local db, err = sql.get("app:db")
        if not db then return err end
        local _, cerr = db:execute("CREATE TABLE IF NOT EXISTS work_bulk_progress_gate (board_id TEXT PRIMARY KEY, arrived INTEGER NOT NULL, released INTEGER NOT NULL)")
        if cerr then db:release(); return cerr end
        local rows, rerr = db:query("UPDATE work_bulk_progress_gate SET arrived = 1 WHERE board_id = $1 AND arrived = 0 RETURNING board_id", { board })
        db:release()
        if rerr then return rerr end
        if rows and rows[1] then
            local released = false
            for _ = 1, 600 do
                local handle, herr = sql.get("app:db")
                if not handle then return herr end
                local gates, gerr = handle:query("SELECT released FROM work_bulk_progress_gate WHERE board_id = $1", { board })
                handle:release()
                if gerr then return gerr end
                if gates and gates[1] and tonumber(gates[1].released) == 1 then released = true; break end
                time.sleep("100ms")
            end
            if not released then return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "bulk progress waits for its test release", details = { code = "bulk_progress_gate_timeout" } }) end
        end
    end
    return events.progress(board, id, kind, processed, total, status, counts, boundary)
end
return M
