-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local materializer = require("materializer")
local types = require("types")

local M = { decode = materializer.decode }
local source = "w02-later-writer"

function M.after_append(client: types.ThreadClient, board_id: string, writes: {types.Write}, seq: integer)
    for _, write in ipairs(writes) do
        for _, event in ipairs(write.events) do
            local key = event.body.command_key
            if key == "apply/ack-append" or key == "apply/ack-replay" then
                local caught = assert(client:catch_up_projection({ thread_id = board_id, kind = "kickside.work:board_model", max_ticks = 1000 }))
                    :: { last_seq: integer }
                assert(caught.last_seq == seq, "command must be projected before the later write")
                local db = assert(sql.get("app:db"))
                assert(db:execute("CREATE TABLE IF NOT EXISTS work_apply_ack_hold (board_id TEXT PRIMARY KEY)"))
                assert(db:execute("INSERT INTO work_apply_ack_hold (board_id) VALUES ($1)", { board_id }))
                db:release()
                local item = ((event.body.receipt :: types.Receipt).result.outcomes :: {{item: string}})[1].item
                assert(client:append_events({ writes = { { thread_id = board_id, events = {
                    { type = "kickside.work.events:item.ranked", subject = "command", body = { item = item, source = source } },
                } } } }))
                return
            end
        end
    end
end

function M.fold(tx: sql.Transaction, dialect: string, board_id: string, events: {types.RawEvent}, to_seq: integer,
    row_budget: integer, caller: types.AccessCaller?, caller_error: error?): (types.FoldResult?, error?)
    for _, raw in ipairs(events) do
        if raw.type == "kickside.work.events:item.ranked" then
            local event, decode_err = materializer.decode(raw)
            if decode_err then return nil, decode_err end
            if event and event.body.source == source then
                local rows, err = tx:query("SELECT board_id FROM work_apply_ack_hold WHERE board_id = $1", { board_id })
                if err then return nil, err end
                if rows and rows[1] then
                    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "later projection batch held by test" })
                end
            end
        end
    end
    return materializer.fold(tx, dialect, board_id, events, to_seq, row_budget, caller, caller_error)
end

function M.release(board_id: string, key: string): integer
    local db = assert(sql.get("app:db"))
    local thread_id = db:type() == sql.type.POSTGRES and "CAST(CAST($1 AS TEXT) AS UUID)" or "$1"
    local rows = assert(db:query([[SELECT r.seq AS committed, b.applied_seq AS projected, t.event_count AS head
        FROM kickside_work_receipt r JOIN kickside_work_board b ON b.board_id = r.board_id
        JOIN kickside_thread t ON t.id = ]] .. thread_id .. [[ WHERE r.board_id = $1 AND r.command_key = $2]],
        { board_id, "apply/" .. key }))
    assert(db:execute("DELETE FROM work_apply_ack_hold WHERE board_id = $1", { board_id }))
    db:release()
    local row = assert(rows[1], "the command must have a committed receipt")
    local committed = assert(math.tointeger(tonumber(row.committed)))
    assert(tonumber(row.projected) == committed, "expected projection at " .. committed .. ", got " .. tostring(row.projected))
    assert(tonumber(row.head) == committed + 1, "expected later append at " .. (committed + 1) .. ", got " .. tostring(row.head))
    return committed
end

return M
