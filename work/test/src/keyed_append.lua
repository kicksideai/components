-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local append = require("append")
local apply_ack_probe = require("apply_ack_probe")
local sql = require("sql")
local M = {}
function M.writes(client, board_id, writes): (integer?, error?)
    local injected = require("delivery_probe").before_append(client, board_id, writes)
    if injected then return nil,injected end
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_keyed_churn (board_id TEXT PRIMARY KEY,item_id TEXT NOT NULL)"))
    local rows = assert(db:query("SELECT item_id FROM work_keyed_churn WHERE board_id=$1", { board_id }))
    db:release()
    if rows[1] then
        assert(client:append_events({ writes = { { thread_id = board_id, events = {
            { type = "kickside.work.events:item.ranked", subject = "command", body = { item = rows[1].item_id } },
        } } } }))
    end
    local seq, err = append.writes(client,board_id,writes)
    if seq and not err then apply_ack_probe.after_append(client, board_id, writes, seq) end
    return seq, err
end
return M
