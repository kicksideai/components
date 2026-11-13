-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Counts directory calls and coordinates a committed digest change during resolution.
local sql = require("sql")
local directory = require("directory")
local M = {}

local function open(): sql.DB
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_directory_calls (principal TEXT PRIMARY KEY, calls INTEGER)", {}))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_directory_digest (principal TEXT PRIMARY KEY, board_id TEXT)", {}))
    return db
end

function M.groups(input: { id: string }): (unknown, error?)
    local db = open()
    assert(db:execute([[INSERT INTO app_work_directory_calls (principal,calls) VALUES ($1,1)
        ON CONFLICT (principal) DO UPDATE SET calls = app_work_directory_calls.calls + 1]], { input.id }))
    local changes = assert(db:query("SELECT board_id FROM app_work_directory_digest WHERE principal=$1", { input.id }))
    if changes[1] then
        assert(db:execute("UPDATE kickside_work_board SET digest=digest || '-changed' WHERE board_id=$1", { changes[1].board_id }))
        assert(db:execute("DELETE FROM app_work_directory_digest WHERE principal=$1", { input.id }))
    end
    db:release()
    return directory.groups(input)
end

function M.calls(id: string): integer
    local db = open()
    local rows = assert(db:query("SELECT calls FROM app_work_directory_calls WHERE principal=$1", { id }))
    db:release()
    return rows[1] and math.tointeger(tonumber(rows[1].calls)) or 0
end

function M.change_digest(principal: string, board_id: string)
    local db = open()
    assert(db:execute("INSERT INTO app_work_directory_digest (principal,board_id) VALUES ($1,$2)", { principal, board_id }))
    db:release()
end

return M
