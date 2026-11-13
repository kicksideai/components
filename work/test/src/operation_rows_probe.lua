-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local rows = require("rows")
local security = require("security")
local sql = require("sql")
local types = require("types")
local M = {}
M.create, M.resume, M.status = rows.create, rows.resume, rows.status
function M.get(db: sql.DB, board_id: string, id: string?, kind: string?, key: string?): (types.Owner?, error?)
    if kind == "bulk" and key then
        local _, err = db:execute("CREATE TABLE IF NOT EXISTS work_owner_race (board_id TEXT NOT NULL, actor_id TEXT NOT NULL, PRIMARY KEY (board_id,actor_id))")
        if err then return nil, err end
        local selected, serr = db:query("DELETE FROM work_owner_race WHERE board_id = $1 AND actor_id = $2 RETURNING board_id", { board_id, security.actor():id() })
        if serr then return nil, serr end
        if selected and selected[1] then return nil, nil end
    end
    return rows.get(db, board_id, id, kind, key)
end
return M
