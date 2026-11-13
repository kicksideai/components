-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The attachment fixture owns persistent rows and deletes them through its contract.
local sql = require("sql")
local ctx = require("ctx")
local M = {}
function M.seed(id: string)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_attachment_rows (attachment_id TEXT NOT NULL PRIMARY KEY, payload TEXT NOT NULL)", {}))
    assert(db:execute("INSERT INTO app_work_attachment_rows (attachment_id, payload) VALUES ($1, 'owned')", { id }))
    db:release()
end
function M.count(id: string): integer
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT COUNT(*) AS n FROM app_work_attachment_rows WHERE attachment_id = $1", { id }))
    db:release()
    return tonumber(rows[1].n) :: integer
end
function M.delete(): ({ success: boolean }?, error?)
    local id = ctx.get("component_id")
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local _, cerr = db:execute("CREATE TABLE IF NOT EXISTS app_work_attachment_rows (attachment_id TEXT NOT NULL PRIMARY KEY, payload TEXT NOT NULL)", {})
    if cerr then db:release(); return nil, cerr end
    local _, derr = db:execute("DELETE FROM app_work_attachment_rows WHERE attachment_id = $1", { id })
    db:release()
    if derr then return nil, derr end
    return { success = true }, nil
end
return M
