-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local events = require("events")
local sql = require("sql")
local M = {}
function M.append(board_id: string, key: string, writes: unknown, result: unknown, boundary: { at: string, ns: integer }?): (unknown, error?)
    if key:sub(-4) == "/out" then
        local db, err = sql.get("app:db")
        if not db then return nil, err end
        local rows, rerr = db:query("SELECT released FROM work_deferred_gate WHERE board_id = $1", { board_id })
        if rerr then db:release(); return nil, rerr end
        if rows and rows[1] and tonumber(rows[1].released) == 0 then
            local _, uerr = db:execute("UPDATE work_deferred_gate SET arrived = 1 WHERE board_id = $1", { board_id })
            db:release()
            if uerr then return nil, uerr end
            return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "phase two is interrupted", details = { code = "move_phase_interrupted" } })
        end
        db:release()
    end
    return events.append(board_id, key, writes, result, boundary)
end
return M
