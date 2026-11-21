-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local json = require("json")
local sql = require("sql")
local domain = require("domain")
local M = {}

local function open(): sql.DB
    local db = assert(sql.get("app:db"))
    assert(db:execute([[CREATE TABLE IF NOT EXISTS work_schema_guard_probe (
        board_id TEXT PRIMARY KEY, action TEXT NOT NULL, calls TEXT NOT NULL
    )]]))
    return db
end

function M.arm(board_id: string, action: domain.Row?)
    local db = open()
    assert(db:execute("INSERT INTO work_schema_guard_probe VALUES ($1,$2,'[]')",
        { board_id, action and assert(json.encode(action)) or "" }))
    db:release()
end

function M.calls(board_id: string): { domain.Row }
    local db = open()
    local rows = assert(db:query("SELECT calls FROM work_schema_guard_probe WHERE board_id=$1", { board_id }))
    db:release()
    return assert(json.decode(rows[1].calls)) :: { domain.Row }
end

-- Run the competing command after Work has released its prepare snapshot and
-- before it takes Core's append lock. Record the actual Core write requests.
function M.interleave(client: domain.ThreadClient, board_id: string): domain.ThreadClient
    local db = open()
    local rows = assert(db:query("SELECT action FROM work_schema_guard_probe WHERE board_id=$1", { board_id }))
    local row = rows[1]
    if row and row.action ~= "" then
        assert(db:execute("UPDATE work_schema_guard_probe SET action='' WHERE board_id=$1", { board_id }))
    end
    db:release()
    if not row then return client end
    if row.action ~= "" then
        local action = assert(json.decode(row.action)) :: domain.Row
        if action.rank_item then
            local result, err = client:append_events({ writes = { { thread_id = board_id, events = {
                { type = "kickside.work.events:item.ranked", subject = "rank", body = { item = action.rank_item } },
            } } } })
            assert(result, tostring(err))
        else
            local result, err = funcs.call("app:work_call", { board_id = board_id, op = action.method, request = action.request })
            assert(result, tostring(err))
        end
    end
    return ({
        append_events = function(_self: domain.ThreadClient, request: domain.ThreadRequest): (unknown, error?)
            local calls = M.calls(board_id)
            calls[#calls + 1] = request
            local db = open()
            assert(db:execute("UPDATE work_schema_guard_probe SET calls=$1 WHERE board_id=$2",
                { assert(json.encode(calls)), board_id }))
            db:release()
            return client:append_events(request)
        end,
    } :: unknown) :: domain.ThreadClient
end

return M
