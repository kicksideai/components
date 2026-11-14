-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local generated = require("generated")
local bulk = require("bulk")
local tables = require("tables")
local store = require("store")
local types = require("types")
local json = require("json")
local jobs = require("jobs")
local consts = require("consts")
local fold_batch = require("fold_batch")

local access_rows = require("access_rows")
local M = {}

-- Generated rows follow every item row changed by a fold, including subtree writes.

local function write_batch(tx: sql.Transaction, board: types.Board, ids: { string }): error?
    local items, err = store.items(tx, board.board_id, ids)
    if err or not items then return err end
    local l = tables.layout(board.compiled)
    local rows: { types.IndexRow } = {}
    local gone: { string } = {}
    for _, item in ipairs(items) do
        if item.life == "purged" then gone[#gone + 1] = item.item_id
        else
            local aerr = access_rows.record(tx, board, item)
            if aerr then return aerr end
            local row, rerr = tables.row(board, item, l)
            if rerr or not row then return rerr end
            rows[#rows + 1] = row
        end
    end
    local t = tables.of(board.board_id, l)
    err = bulk.delete_in(tx, t.names.item, nil, {}, "item_id", gone)
    if not err then err = generated.write_rows(tx, t, rows) end
    return err
end

function M.write(tx: sql.Transaction, dialect: string, board: types.Board, ids: { string }): error?
    local per = dialect == sql.type.POSTGRES and 500 or 100
    for first = 1, #ids, per do
        local chunk: { string } = {}
        for i = first, math.min(first + per - 1, #ids) do chunk[#chunk + 1] = ids[i] end
        local err = write_batch(tx, board, chunk)
        if err then return err end
    end
    return nil
end

function M.changed(tx: sql.Transaction, dialect: string, board: types.Board, applied: integer, through: integer): error?
    local rows, err = tx:query("SELECT item_id FROM kickside_work_item WHERE board_id = $1 AND updated_seq > $2 AND updated_seq <= $3 ORDER BY item_id",
        { board.board_id, applied, through })
    if err then return err end
    local ids: { string } = {}
    for _, row in ipairs(rows or {}) do
        local decoded_3, decode_err = store.need(row, "item_id")
        if decode_err then return decode_err end
        local decoded_3 = decoded_3 :: string
        ids[#ids + 1] = decoded_3
    end
    return M.write(tx, dialect, board, ids)
end

-- Index backfill advances through bounded ranges in the board log.

function M.demand(tx: sql.Transaction, dialect: string, board: types.Board, result: types.FoldResult, fields: { string }, trace_context: types.TraceContext?): error?
    local job, err = jobs.enqueue_tx(tx, dialect, { namespace = "kickside.work", scope = "reindex", key = board.board_id,
        owner_locator = { kind = "component", id = board.board_id }, slot = true, demand = true, job_type = consts.REINDEX_JOB,
        trace_context = trace_context, immutable_payload = { board_id = board.board_id } })
    if err then return err end
    local id = job and store.text(job.id)
    if not id then return fold_batch.corrupt("reindex enqueue returned no job id") end
    err = fold_batch.exec(tx, [[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status, error)
        VALUES ($1, $2, 'reindex', $3, 'pending', NULL) ON CONFLICT (board_id, job_id) DO UPDATE SET
        key = excluded.key, status = 'pending', error = NULL]],
        { board.board_id, id, json.encode({ generation = board.generation, after = "", fields = fields }) })
    result.reindex_job = id
    return err
end

function M.apply(tx: sql.Transaction, dialect: string, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local range = event.body.recompute
    if not range then return fold_batch.corrupt("reindex event lacks range") end
    if range.generation ~= board.generation then return nil end
    if range.through <= range.after then return fold_batch.corrupt("reindex range must advance") end
    local jobs_rows, jerr = tx:query("SELECT key, status FROM kickside_work_job WHERE board_id = $1 AND job_type = 'reindex'", { board.board_id })
    if jerr then return jerr end
    local row = jobs_rows and jobs_rows[1]
    if not row or row.status == "done" then return nil end
    local decoded_2, decode_err = store.stored(row.key, {} :: types.JsonObject)
    if decode_err then return decode_err end
    local decoded_2 = decoded_2 :: types.JsonObject
    local state = decoded_2
    if state.after ~= range.after or state.generation ~= range.generation then return nil end
    local err = fold_batch.flush(tx, batch)
    if err then return err end
    local rows, rerr = tx:query([[SELECT item_id FROM kickside_work_item WHERE board_id = $1 AND item_id > $2 AND item_id <= $3
        AND life <> 'purged' ORDER BY item_id LIMIT $4]], { board.board_id, range.after, range.through, consts.LIMITS.recompute_batch + 1 })
    if rerr then return rerr end
    if #(rows or {}) > consts.LIMITS.recompute_batch then return fold_batch.corrupt("reindex range exceeds its batch limit") end
    local ids: { string } = {}
    for _, item in ipairs(rows or {}) do
        local decoded_1, decode_err = store.need(item, "item_id")
        if decode_err then return decode_err end
        local decoded_1 = decoded_1 :: string
        ids[#ids + 1] = decoded_1
    end
    err = M.write(tx, dialect, board, ids)
    if err then return err end
    batch.rows = batch.rows + #ids
    return fold_batch.exec(tx, "UPDATE kickside_work_job SET key = $1 WHERE board_id = $2 AND job_type = 'reindex'",
        { json.encode({ generation = range.generation, after = range.through, fields = state.fields }), board.board_id })
end

return M
