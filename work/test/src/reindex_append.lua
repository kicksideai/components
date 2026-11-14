-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local time = require("time")
local append = require("append")
local domain = require("domain")
local M = {}

local function open(): sql.DB
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_test_reindex_gate (board_id TEXT PRIMARY KEY)", {}))
    return db
end

function M.hold(board_id: string)
    local db = open()
    assert(db:execute("INSERT INTO work_test_reindex_gate (board_id) VALUES ($1)", { board_id }))
    db:release()
end

function M.release()
    local db = open()
    assert(db:execute("DELETE FROM work_test_reindex_gate", {}))
    db:release()
end

function M.writes(client: domain.ThreadClient, board_id: string, writes: { domain.Write }): (integer?, error?)
    while true do
        local db = open()
        local rows, err = db:query("SELECT board_id FROM work_test_reindex_gate WHERE board_id=$1", { board_id })
        db:release()
        if err then return nil, err end
        if not rows or not rows[1] then break end
        time.sleep("10ms")
    end
    return append.writes(client, board_id, writes)
end

return M
