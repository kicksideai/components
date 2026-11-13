-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local views = require("views")
local sql = require("sql")
local schema_commands = require("schema_commands")
local M = {}
local function open(): (sql.DB?, error?)
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local _, terr = db:execute("CREATE TABLE IF NOT EXISTS work_test_pack_pause (board_id text PRIMARY KEY, value text NOT NULL)")
    if terr then db:release(); return nil, terr end
    return db, nil
end
function M.set_pause(board_id: string, value: string)
    local db = assert(open())
    assert(db:execute("INSERT INTO work_test_pack_pause (board_id, value) VALUES ($1, $2) ON CONFLICT (board_id) DO UPDATE SET value = excluded.value", { board_id, value }))
    db:release()
end
local function pause(board_id: string): (string?, error?)
    local db, err = open()
    if err or not db then return nil, err end
    local rows, rerr = db:query("SELECT value FROM work_test_pack_pause WHERE board_id = $1", { board_id })
    db:release()
    if rerr then return nil, rerr end
    return rows and rows[1] and rows[1].value :: string? or nil, nil
end
local function interrupted(): error
    return errors.new({ kind = errors.UNAVAILABLE, message = "pack execution is interrupted", details = { code = "pack_test_interrupted" } })
end
function M.apply_schema(request: unknown, frozen: unknown, deadline: unknown): (unknown, error?)
    local state, err = pause(request.board_id)
    if err then return nil, err end
    if state == "before_schema" then return nil, interrupted() end
    return schema_commands.apply_schema(request, frozen, deadline)
end
function M.install(id: string, request: unknown, revision: integer?): (unknown, error?)
    local state, err = pause(request.board_id)
    if err then return nil, err end
    if state == "paused" then
        local installed, ierr = views.install(id, request, revision)
        if ierr or not installed then return nil, ierr end
        return nil, interrupted()
    end
    return views.install(id, request, revision)
end
return M
