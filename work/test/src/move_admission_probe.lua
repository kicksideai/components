-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local principals = require("principals")
local sql = require("sql")
local domain = require("domain")
local M = {}
function M.resolve(board: domain.Board): error?
    local err = principals.resolve(board)
    if err then return err end
    local db, derr = sql.get("app:db")
    if not db then return derr end
    local _, cerr = db:execute("CREATE TABLE IF NOT EXISTS work_move_schema_race (board_id TEXT PRIMARY KEY)")
    if cerr then db:release(); return cerr end
    local rows, rerr = db:query("DELETE FROM work_move_schema_race WHERE board_id = $1 RETURNING board_id", { board.board_id })
    if rerr then db:release(); return rerr end
    if rows and rows[1] then
        local _, uerr = db:execute("UPDATE kickside_work_board SET digest = $1 WHERE board_id = $2", { board.digest .. "-changed", board.board_id })
        if uerr then db:release(); return uerr end
    end
    db:release()
    return nil
end
return M
