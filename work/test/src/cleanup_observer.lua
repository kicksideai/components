-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The harness records committed cleanup pages and their deletion fence.
local sql = require("sql")
local lifecycle = require("lifecycle")
local tables = require("tables")
local M = {}
local OWNED = { "kickside_work_receipt", "kickside_work_visibility", "kickside_work_plugin", "kickside_work_job", "kickside_work_comment",
    "kickside_work_change", "kickside_work_interval", "kickside_work_link", "kickside_work_field_usage", "kickside_work_item", "kickside_work_generation", "kickside_work_board" }
M.OWNED = OWNED
local function snapshot(id: string): (integer, boolean, boolean)
    local db = assert(sql.get("app:db"))
    local total, shell = 0, false
    for _, name in ipairs(OWNED) do
        local rows = assert(db:query("SELECT COUNT(*) AS n FROM " .. name .. " WHERE board_id = $1", { id }))
        local n = tonumber(rows[1].n) :: integer
        total = total + n
        if name == "kickside_work_board" then shell = n > 0 end
    end
    local names = tables.names(id)
    local catalog = db:type() == "postgres" and "SELECT tablename AS name FROM pg_tables WHERE tablename = $1 OR tablename = $2"
        or "SELECT name FROM sqlite_master WHERE type='table' AND (name = $1 OR name = $2)"
    local found = assert(db:query(catalog, { names.item, names.set }))
    for _, row in ipairs(found) do
        local rows = assert(db:query("SELECT COUNT(*) AS n FROM " .. row.name, {}))
        total = total + (tonumber(rows[1].n) :: integer)
    end
    local fence = assert(db:query("SELECT component_id FROM kickside_components WHERE component_id = $1 AND deleting_at IS NOT NULL", { id }))
    db:release()
    return total, shell, #fence == 1
end
function M.pause(id: string, paused: boolean)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_cleanup_pause (board_id TEXT PRIMARY KEY)", {}))
    if paused then
        assert(db:execute("INSERT INTO app_work_cleanup_pause (board_id) VALUES ($1)", { id }))
    else
        assert(db:execute("DELETE FROM app_work_cleanup_pause WHERE board_id=$1", { id }))
    end
    db:release()
end
function M.delete(id: string): (unknown, error?)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_cleanup_pause (board_id TEXT PRIMARY KEY)", {}))
    local paused = assert(db:query("SELECT board_id FROM app_work_cleanup_pause WHERE board_id=$1", { id }))
    db:release()
    if #paused > 0 then return { success = false, deleted = 0 }, nil end
    local before, _, fenced = snapshot(id)
    local result, err = lifecycle.delete(id)
    if err then return nil, err end
    local after, shell = snapshot(id)
    local db = assert(sql.get("app:db"))
    assert(db:execute([[CREATE TABLE IF NOT EXISTS app_work_cleanup_pages
        (board_id TEXT NOT NULL, removed INTEGER NOT NULL, remaining INTEGER NOT NULL, shell INTEGER NOT NULL, fenced INTEGER NOT NULL)]], {}))
    assert(db:execute("INSERT INTO app_work_cleanup_pages (board_id, removed, remaining, shell, fenced) VALUES ($1,$2,$3,$4,$5)",
        { id, before - after, after, shell and 1 or 0, fenced and 1 or 0 }))
    db:release()
    return result, nil
end
function M.pages(id: string): { { removed: integer, remaining: integer, shell: integer, fenced: integer } }
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT removed, remaining, shell, fenced FROM app_work_cleanup_pages WHERE board_id = $1", { id }))
    db:release()
    return rows
end
return M
