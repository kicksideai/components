-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local append = require("append")
local sql = require("sql")
local M = {}
function M.writes(client, board_id, writes)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_keyed_churn (board_id TEXT PRIMARY KEY,item_id TEXT NOT NULL)"))
    local rows = assert(db:query("SELECT item_id FROM work_keyed_churn WHERE board_id=$1", { board_id }))
    db:release()
    if rows[1] then
        assert(client:append_events({ writes = { { thread_id = board_id, events = {
            { type = "kickside.work.events:item.ranked", subject = "command", body = { item = rows[1].item_id } },
        } } } }))
    end
    return append.writes(client,board_id,writes)
end
return M
