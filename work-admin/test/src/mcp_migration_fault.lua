-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Optional authorization lookups expose controlled native dependency failures.
local sql = require("sql")
local component = require("component")
local M = { ACCESS = component.ACCESS }
local function open(): sql.DB
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_authorization_fault (board_id TEXT NOT NULL, mask INTEGER NOT NULL, kind TEXT NOT NULL, PRIMARY KEY (board_id,mask))", {}))
    return db
end
function M.fail(board_id: string, mask: integer, kind: string)
    local db = open()
    assert(db:execute("INSERT INTO app_work_authorization_fault (board_id,mask,kind) VALUES ($1,$2,$3)", { board_id, mask, kind }))
    db:release()
end
function M.clear(board_id: string)
    local db = open()
    assert(db:execute("DELETE FROM app_work_authorization_fault WHERE board_id=$1", { board_id }))
    db:release()
end
function M.validate_access(board_id: string, mask: integer): (unknown, error?)
    local db = open()
    local rows = assert(db:query("SELECT kind FROM app_work_authorization_fault WHERE board_id=$1 AND mask=$2", { board_id, mask }))
    db:release()
    if rows[1] then return nil, errors.new({ kind = rows[1].kind, message = "authorization dependency is offline", details = { code = "contract_unavailable" } }) end
    return component.validate_access(board_id, mask)
end
return M
