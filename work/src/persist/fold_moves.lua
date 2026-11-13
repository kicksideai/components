-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local sql = require("sql")
local jobs = require("jobs")
local store = require("store")
local batch_rows = require("batch_rows")
local items = require("items")
local intervals = require("intervals")
local rollup_rows = require("rollup_rows")
local rollups = require("rollups")
local types = require("types")
local M = {}
function M.apply(tx: sql.Transaction, dialect: string, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, result: types.FoldResult): error?
    local body = event.body
    if event.type == consts.EVENTS.ITEM_MOVED_IN then
        local err = items.apply_created(tx, board, event, batch, result, dialect)
        if err then return err end
        batch_rows.record(batch, board.board_id, event, event.body.item and "i:" .. event.body.item or "", "moved_in", nil, body.moved_from, nil)
        return nil
    end
    local item, err = batch_rows.load(tx, board.board_id, batch, body.item)
    if err or not item then return err end
    if event.type == consts.EVENTS.MOVE_PREPARED then
        item.move_id = body.operation_id
        batch_rows.touch(batch, item, event.seq)
        batch.rows = batch.rows + 1
        local _, werr = jobs.wake_tx(tx, "work:" .. (body.operation_id :: string), dialect)
        return werr
    end
    if item.move_id ~= body.operation_id or not body.moved_to then return batch_rows.corrupt("moved_out names another reservation") end
    if rollups.active(board) then
        local affected, aerr = rollup_rows.expand(tx, board, { [item.item_id] = event.seq })
        if aerr or not affected then return aerr end
        batch.observed = batch.observed or {}
        for id, seq in pairs(affected) do batch.observed[id] = math.max(batch.observed[id] or 0, seq) end
    end
    batch_rows.held(batch, item.document, -1)
    item.document, item.work, item.findings = {}, nil, nil
    item.life, item.life_at, item.move_id = "purged", body.at, nil
    batch_rows.touch(batch, item, event.seq)
    local _, redirect_err = tx:execute([[UPDATE kickside_work_key_alias SET to_board_id = $1, to_item_id = $2
        WHERE to_board_id = $3 AND to_item_id = $4]], { body.moved_to.board, body.moved_to.item, board.board_id, item.item_id })
    if redirect_err then return redirect_err end
    local prefixes, perr = store.prefixes(tx, board.board_id)
    if perr then return perr end
    for _, prefix in ipairs(prefixes or {}) do
        local _, aerr = tx:execute([[INSERT INTO kickside_work_key_alias (board_id,key,item_id,to_board_id,to_item_id,at)
            VALUES ($1,$2,$3,$4,$5,$6)]], { board.board_id, store.key_of(prefix, item.number), item.item_id, body.moved_to.board, body.moved_to.item, body.at })
        if aerr then return aerr end
    end
    local _, lerr = tx:execute("DELETE FROM kickside_work_link WHERE board_id = $1 AND from_id = $2", { board.board_id, item.item_id })
    if lerr then return lerr end
    -- Incoming endpoint indexes follow the alias while the originating link fact stays on its thread.
    local _, rerr = tx:execute([[INSERT INTO kickside_work_link (board_id,from_id,type,to_board_id,to_id,at,seq)
        SELECT board_id,from_id,type,$1,$2,at,seq FROM kickside_work_link WHERE to_board_id = $3 AND to_id = $4
        ON CONFLICT (board_id,from_id,type,to_board_id,to_id) DO NOTHING]],
        { body.moved_to.board, body.moved_to.item, board.board_id, item.item_id })
    if rerr then return rerr end
    local _, derr = tx:execute("DELETE FROM kickside_work_link WHERE to_board_id = $1 AND to_id = $2", { board.board_id, item.item_id })
    if derr then return derr end
    local cerr = intervals.close_item(tx, batch, item.item_id, body.at :: string)
    if cerr then return cerr end
    batch_rows.record(batch, board.board_id, event, "i:" .. item.item_id, "moved_out", nil, nil, body.moved_to)
    batch.rows = batch.rows + 1
    return nil
end
return M
