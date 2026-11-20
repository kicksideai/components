-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local events = require("events")
local apply_ops = require("apply_ops")
local sql = require("sql")
local M = {}
function M.append(board_id: string, key: string, writes: unknown, result: unknown, boundary: { at: string, ns: integer }?): (unknown, error?)
    if key:sub(-9) == "/prepared" then
        local db = assert(sql.get("app:db"))
        assert(db:execute("CREATE TABLE IF NOT EXISTS work_move_prepare_race (board_id TEXT PRIMARY KEY, item_id TEXT NOT NULL)"))
        local changed = assert(db:query("DELETE FROM work_move_prepare_race WHERE board_id = $1 RETURNING item_id", { board_id }))
        db:release()
        if changed[1] then
            local out = assert(apply_ops.apply({ board_id = board_id,
                ops = { { op = "set", item = changed[1].item_id :: string, values = { title = "after planning" } } } }))
            assert(out.outcomes[1].status == "applied")
        end
    end
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
