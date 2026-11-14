-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local identity = require("identity")
local sql = require("sql")
local time = require("time")
local M = {}
M.from_row = identity.from_row
function M.run_as(selected: unknown, target: string, input: unknown, options: unknown): (unknown, error?)
    local db, err = sql.get("app:db")
    if not db then return nil, err end
    local tables, terr = db:query("SELECT 1 FROM work_deferred_gate WHERE board_id = $1", { input.board_id })
    if terr then db:release(); return nil, terr end
    if tables and tables[1] then
        local _, stop_err = db:execute([[UPDATE work_deferred_gate SET released = 0 WHERE board_id = $1 AND stop_after > 0
            AND (SELECT processed FROM kickside_work_operation WHERE board_id = $1 AND operation_id = $2) >= stop_after * 200]],
            { input.board_id, input.operation_id })
        if stop_err then db:release(); return nil, stop_err end
        local _, uerr = db:execute("UPDATE work_deferred_gate SET arrived = 1 WHERE board_id = $1", { input.board_id })
        if uerr then db:release(); return nil, uerr end
        for _ = 1, 1200 do
            local rows, rerr = db:query("SELECT released FROM work_deferred_gate WHERE board_id = $1", { input.board_id })
            if rerr then db:release(); return nil, rerr end
            if rows and rows[1] and tonumber(rows[1].released) == 1 then break end
            time.sleep("50ms")
        end
    end
    db:release()
    return identity.run_as(selected, target, input, options)
end
return M
