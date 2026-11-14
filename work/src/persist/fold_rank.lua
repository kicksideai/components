-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local jobs = require("jobs")
local consts = require("consts")
local rank = require("rank")
local store = require("store")
local types = require("types")
local fold_batch = require("fold_batch")
local json = require("json")
local M = {}

-- Rank folds update order independently of item subject versions.

function M.ending(tx: sql.Transaction, board_id: string, batch: types.FoldBatch, exclude: string?): (string?, error?)
    local rows, err = tx:query("SELECT rank FROM kickside_work_item WHERE board_id = $1 AND item_id <> $2 ORDER BY rank DESC LIMIT 1",
        { board_id, exclude or "" })
    if err then return nil, err end
    local last = rows and rows[1] and store.text(rows[1].rank)
    for id, item in pairs(batch.cache) do
        if id ~= exclude and item.rank and (not last or item.rank > last) then last = item.rank end
    end
    return rank.ending(last), nil
end

function M.demand(tx: sql.Transaction, dialect: string, board_id: string, result: types.FoldResult, trace_context: types.TraceContext?): error?
    if result.rebalance_job then return nil end
    local job, err = jobs.enqueue_tx(tx, dialect, { namespace = "kickside.work", scope = "rebalance", key = board_id,
        owner_locator = { kind = "component", id = board_id }, slot = true, demand = true, job_type = consts.REBALANCE_JOB,
        trace_context = trace_context, immutable_payload = { board_id = board_id } })
    if err then return err end
    local id = job and store.text(job.id)
    if not id then return fold_batch.corrupt("rebalance enqueue returned no job id") end
    err = fold_batch.exec(tx, [[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status, error)
        VALUES ($1, $2, 'rebalance', $3, 'pending', NULL) ON CONFLICT (board_id, job_id) DO UPDATE SET
        status = CASE WHEN kickside_work_job.status = 'done' THEN 'pending' ELSE kickside_work_job.status END,
        key = CASE WHEN kickside_work_job.status = 'done' THEN excluded.key ELSE kickside_work_job.key END, error = NULL]],
        { board_id, id, board_id })
    result.rebalance_job = id
    return err
end

local function neighbor(tx: sql.Transaction, board_id: string, batch: types.FoldBatch, id: string?): (string?, error?)
    if not id then return nil, nil end
    local item, err = store.load(tx, board_id, batch.cache, id)
    if err then return nil, err end
    if not item or item.life ~= "live" then return nil, nil end
    return item.rank, nil
end

-- beside returns the key next to anchor on one side, the batch's unflushed moves included.
local function beside(tx: sql.Transaction, board_id: string, batch: types.FoldBatch, anchor: string, above: boolean, exclude: string): (string?, error?)
    local statement = above and "SELECT MIN(rank) AS rank FROM kickside_work_item WHERE board_id = $1 AND rank > $2 AND item_id <> $3"
        or "SELECT MAX(rank) AS rank FROM kickside_work_item WHERE board_id = $1 AND rank < $2 AND item_id <> $3"
    local rows, err = tx:query(statement, { board_id, anchor, exclude })
    if err then return nil, err end
    local key = rows and rows[1] and store.text(rows[1].rank)
    for id, cached in pairs(batch.cache) do
        local r = cached.rank
        if id ~= exclude and r then
            if above and r > anchor and (not key or r < key) then key = r end
            if not above and r < anchor and (not key or r > key) then key = r end
        end
    end
    return key, nil
end

function M.apply_ranked(tx: sql.Transaction, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, result: types.FoldResult, dialect: string): error?
    local item, err = fold_batch.load(tx, board.board_id, batch, event.body.item)
    if err or not item then return err end
    local after, aerr = neighbor(tx, board.board_id, batch, event.body.after)
    local before, berr = neighbor(tx, board.board_id, batch, event.body.before)
    if aerr or berr then return aerr or berr end
    if after and before and after >= before then before = nil end
    local key: string?
    if not after and not before then
        key, err = M.ending(tx, board.board_id, batch, item.item_id)
    else
        if after and not before then before, err = beside(tx, board.board_id, batch, after, true, item.item_id)
        elseif before and not after then after, err = beside(tx, board.board_id, batch, before, false, item.item_id) end
        if err then return err end
        key = rank.midpoint(after, before)
    end
    if err or not key then return err end
    local previous = item.rank
    item.rank, item.updated_seq, item.updated_at = key, event.seq, event.body.at or item.updated_at
    if batch.dirty[item.item_id] then
        err = fold_batch.save(tx, item)
        batch.dirty[item.item_id] = nil
    else
        err = fold_batch.exec(tx, "UPDATE kickside_work_item SET rank = $1, updated_seq = $2, updated_at = $3 WHERE board_id = $4 AND item_id = $5",
            { key, event.seq, event.body.at or "", board.board_id, item.item_id })
    end
    if err then return err end
    batch.rank_end = nil
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, "rank", nil, previous, key)
    batch.rows = batch.rows + 1
    if #key > consts.LIMITS.rank_length then return M.demand(tx, dialect, board.board_id, result, batch.trace_context) end
    return nil
end

-- Directional passes keep each batch in board order as it converges on evenly spaced keys.
function M.apply_rebalanced(tx: sql.Transaction, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local range, count = event.body.range, event.body.count
    if not range or not count or count < 1 or count > consts.LIMITS.rebalance_batch or range.offset < 0 or range.total < 1
        or (range.direction ~= "left" and range.direction ~= "right") then return fold_batch.corrupt("rank.rebalanced range is malformed") end
    local err = fold_batch.flush(tx, batch)
    if err then return err end
    local total, cerr = store.count(tx, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { board.board_id })
    if cerr then return cerr end
    if total ~= range.total then
        return fold_batch.exec(tx, "UPDATE kickside_work_job SET key = board_id WHERE board_id = $1 AND job_type = 'rebalance'", { board.board_id })
    end
    local rows, qerr = tx:query("SELECT item_id, rank FROM kickside_work_item WHERE board_id = $1 ORDER BY rank, item_id LIMIT $2 OFFSET $3", { board.board_id, count, range.offset })
    if qerr then return qerr end
    for n = 1, #(rows or {}) do
        local i = range.direction == "left" and n or (#rows - n + 1)
        local row = rows[i]
        local decoded_5, decode_err = store.need(row, "rank")
        if decode_err then return decode_err end
        local decoded_5 = decoded_5 :: string
        local old = decoded_5
        local key = rank.spaced(range.offset + i, range.total)
        if (range.direction == "left" and key < old) or (range.direction == "right" and key > old) then
            local decoded_4, decode_err = store.need(row, "item_id")
            if decode_err then return decode_err end
            local decoded_4 = decoded_4 :: string
            err = fold_batch.exec(tx, "UPDATE kickside_work_item SET rank = $1, updated_seq = $2, updated_at = $3 WHERE board_id = $4 AND item_id = $5",
                { key, event.seq, event.body.at or "", board.board_id, decoded_4 })
            if err then return err end
        end
    end
    batch.rows = batch.rows + #(rows or {})
    batch.rank_end = nil
    local next_state: types.RebalanceState = { direction = range.direction, offset = range.offset, total = range.total }
    if range.direction == "left" then
        next_state.offset = range.offset + count
        if next_state.offset >= range.total then next_state.direction, next_state.offset = "right", range.total end
    else
        next_state.offset = range.offset
    end
    return fold_batch.exec(tx, "UPDATE kickside_work_job SET key = $1 WHERE board_id = $2 AND job_type = 'rebalance'",
        { json.encode(next_state), board.board_id })
end

return M
