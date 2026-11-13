-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Folds board events into the work tables. Runs inside the projection
-- transaction; board.applied_seq covers every event at or below it.
local json = require("json")
local sql = require("sql")
local consts = require("consts")
local bulk = require("bulk")
local storage = require("storage")
local store = require("store")
local types = require("types")
local fold_batch = require("fold_batch")
local fold_schema = require("fold_schema")
local fold_items = require("fold_items")
local fold_rollup = require("fold_rollup")
local fold_process = require("fold_process")
local fold_moves = require("fold_moves")

local index_rows = require("index_rows")

local plugin_rows = require("plugin_rows")
local board_meta = require("board_meta")
local M = {}

local EV = consts.EVENTS
local ITEM_EVENTS: { [string]: boolean } = {
    [EV.STAGE_ENTERED] = true, [EV.STAGE_REPORTED] = true, [EV.APPROVAL_RECORDED] = true, [EV.TIMER_FIRED] = true,
    [EV.ITEM_CREATED] = true, [EV.ITEM_CHANGED] = true, [EV.ITEM_TRANSITIONED] = true, [EV.ITEM_MIGRATED] = true, [EV.ITEM_PARENTED] = true,
    [EV.ITEM_LINKED] = true,
    [EV.ITEM_UNLINKED] = true, [EV.ITEM_PURGED] = true, [EV.ITEM_DELETED] = true, [EV.ITEM_RESTORED] = true,
}
local MOVE_EVENTS: { [string]: boolean } = { [consts.EVENTS.MOVE_PREPARED] = true,
    [consts.EVENTS.ITEM_MOVED_IN] = true, [consts.EVENTS.ITEM_MOVED_OUT] = true }
local COMMENT_EVENTS: { [string]: boolean } = { [EV.COMMENT_ADDED] = true, [EV.COMMENT_EDITED] = true, [EV.COMMENT_DELETED] = true }

local HISTORY_COLUMNS: { storage.Column } = { { name = "board_id" }, { name = "seq" }, { name = "n" }, { name = "subject" }, { name = "kind" },
    { name = "field_id" }, { name = "before" }, { name = "after" }, { name = "actor" }, { name = "source" }, { name = "origin" }, { name = "at" } }

local function decode(raw: types.RawEvent): (types.FoldEvent?, error?)
    local seq = math.tointeger(tonumber(raw.seq))
    if not seq then return nil, fold_batch.corrupt("event without a seq") end
    local body: unknown = raw.body
    if type(body) == "string" then body = json.decode(body) end
    local t = raw.type
    if t ~= EV.PLUGIN_REBUILD and t ~= EV.BOARD_UPDATED and t ~= EV.COMMAND_RECORDED and t ~= EV.PLUGIN_CONFIGURED and t ~= EV.INDEX_REBUILT and t ~= EV.SCHEMA_APPLIED and t ~= EV.ITEM_RANKED and t ~= EV.RANK_REBALANCED and t ~= EV.ROLLUPS_RECOMPUTED and t ~= consts.EVENTS.BULK_PROGRESS and not MOVE_EVENTS[t] and not ITEM_EVENTS[t] and not COMMENT_EVENTS[t] then return nil, nil end
    if type(body) ~= "table" then return nil, fold_batch.corrupt("event " .. seq .. " (" .. t .. ") has a malformed body") end
    -- Work is the only writer of these event types (declared outputs of its
    -- binding); each body has the shape its planner built.
    return { id = raw.id, trace_context = raw.trace_context, seq = seq, type = t, body = body :: types.EventBody }, nil
end

M.decode = decode

-- fold(tx, dialect, board_id, events, to_seq, row_budget) folds one prefetched
-- batch. It stops after the event that brings the batch to row_budget rows and
-- reports that event as last_seq; the rest of the batch is delivered again.
function M.fold(tx: sql.Transaction, dialect: string, board_id: string, events: { types.RawEvent }, to_seq: integer, row_budget: integer, caller: types.AccessCaller?, caller_error: error?): (types.FoldResult?, error?)
    local loaded, err = store.board(tx, board_id, dialect)
    local board: types.Board? = loaded
    if err then return nil, err end
    if board then board.caller, board.caller_error = caller, caller_error end
    local result: types.FoldResult = { last_seq = to_seq }
    local metadata, meta_err = board_meta.get(tx, board_id)
    if meta_err then return nil, meta_err end
    local applied = math.max(board and board.applied_seq or 0, metadata and metadata.applied_seq or 0)
    local batch: types.FoldBatch = { cache = {}, dirty = {}, history = {}, rows = 0, written = {}, board_id = board_id, usage = {} }
    local parsed: { types.FoldEvent } = {}
    local ids: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, raw in ipairs(events) do
        local event, derr = decode(raw)
        if derr then return nil, derr end
        if event and event.seq > applied then
            parsed[#parsed + 1] = event
            local id = event.body.item
            if id and not seen[id] then ids[#ids + 1] = id; seen[id] = true end
        end
    end
    local held, load_err = store.items(tx, board_id, ids)
    if load_err then return nil, load_err end
    for _, item in ipairs(held or {}) do batch.cache[item.item_id] = item end
    for _, event in ipairs(parsed) do
        if event and event.seq > applied then
            if event.trace_context or event.id then
                local source = event.trace_context
                batch.trace_context = { trace_id = source and source.trace_id or event.id, run_id = source and source.run_id or event.id,
                    correlation_key = source and source.correlation_key, caused_by_event_id = event.id or (source and source.caused_by_event_id) }
            else batch.trace_context = nil end
            batch.at = event.body.at
            batch.times = batch.times or {}
            if event.body.at then batch.times[event.seq] = event.body.at end
            if event.body.command_key and event.body.receipt then
                local receipt = event.body.receipt
                err = fold_batch.exec(tx, "INSERT INTO kickside_work_receipt (board_id, command_key, request_hash, principal, at, result, seq) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (board_id, command_key) DO UPDATE SET request_hash = excluded.request_hash, principal = excluded.principal, at = excluded.at, result = excluded.result, seq = excluded.seq",
                    { board_id, event.body.command_key, receipt.request_hash, event.body.actor, event.body.at, store.encode(receipt.result), event.seq })
                if err then return nil, err end
            end
            if event.type == EV.BOARD_UPDATED then
                err = board_meta.fold(tx, board_id, event)
                batch.rows = batch.rows + 1
            elseif event.type == EV.COMMAND_RECORDED then
                if not event.body.receipt or not event.body.command_key then return nil, fold_batch.corrupt("command receipt is incomplete") end
            elseif event.type == consts.EVENTS.BULK_PROGRESS then
                batch.rows = batch.rows + 1
            elseif MOVE_EVENTS[event.type] and board then
                err = fold_moves.apply(tx, dialect, board, event, batch, result)
            elseif event.type == EV.INDEX_REBUILT and board then
                err = index_rows.apply(tx, dialect, board, event, batch)
            elseif event.type == EV.SCHEMA_APPLIED then
                board, err = fold_schema.apply_schema(tx, dialect, board, board_id, event, batch, result)
                if board then board.caller, board.caller_error = caller, caller_error end
            elseif not board then
                err = fold_batch.corrupt("board event before its schema")
            elseif event.type == EV.PLUGIN_REBUILD then
                err = plugin_rows.rebuild(tx, board_id, event)
                if not err then result.plugin_job, err = plugin_rows.enroll(tx, dialect, board_id) end
            elseif event.type == EV.PLUGIN_CONFIGURED then
                err = plugin_rows.configure(tx, board_id, event)
                if not err then result.plugin_job, err = plugin_rows.enroll(tx, dialect, board_id) end
                if not err then
                    fold_batch.record(batch, board_id, event, "plugin:" .. (event.body.plugin or ""), "plugin", nil, nil,
                        { plugin = event.body.plugin, config = event.body.config })
                    batch.rows = batch.rows + 1
                end
            elseif event.type == EV.ROLLUPS_RECOMPUTED then
                err = fold_rollup.apply_recomputed(tx, board, event, batch)
            elseif event.type == EV.STAGE_ENTERED or event.type == EV.STAGE_REPORTED or event.type == EV.APPROVAL_RECORDED or event.type == EV.TIMER_FIRED then
                err = fold_process.apply(tx, dialect, board, event, batch)
            elseif event.type == EV.ITEM_CREATED then
                err = fold_items.apply_created(tx, board, event, batch, result, dialect)
            elseif event.type == EV.ITEM_RANKED then
                err = fold_items.apply_ranked(tx, board, event, batch, result, dialect)
            elseif event.type == EV.RANK_REBALANCED then
                err = fold_items.apply_rebalanced(tx, board, event, batch)
            elseif event.type == EV.ITEM_CHANGED then
                err = fold_items.apply_changed(tx, board, event, batch)
            elseif event.type == EV.ITEM_TRANSITIONED then
                err = fold_items.apply_transitioned(tx, board, event, batch, dialect)
            elseif event.type == EV.ITEM_MIGRATED then
                err = fold_items.apply_migrated(tx, board, event, batch, dialect)
            elseif event.type == EV.ITEM_PARENTED then
                err = fold_items.apply_parented(tx, board, event, batch)
            elseif event.type == EV.ITEM_LINKED then
                err = fold_items.apply_link(tx, board, event, batch, true)
            elseif event.type == EV.ITEM_UNLINKED then
                err = fold_items.apply_link(tx, board, event, batch, false)
            elseif event.type == EV.ITEM_PURGED then
                err = fold_items.apply_purged(tx, board, event, batch)
            elseif event.type == EV.ITEM_DELETED then
                err = fold_items.apply_life(tx, board, event, batch, true)
            elseif event.type == EV.ITEM_RESTORED then
                err = fold_items.apply_life(tx, board, event, batch, false)
            else
                err = fold_items.apply_comment(tx, board, event, batch)
            end
            if err then return nil, errors.wrap(err, "fold of event " .. tostring(event.seq) .. " failed") end
            if board and event.type ~= EV.BOARD_UPDATED and event.type ~= EV.PLUGIN_CONFIGURED and event.type ~= EV.INDEX_REBUILT and event.type ~= EV.SCHEMA_APPLIED and event.type ~= EV.ROLLUPS_RECOMPUTED then
                err = fold_rollup.observe(tx, board, batch, event)
                if err then return nil, err end
            end
            if 2 * (batch.rows + fold_rollup.pending(batch)) >= row_budget then
                result.last_seq = event.seq
                break
            end
        end
    end
    if not board then return result, nil end
    err = fold_batch.flush(tx, batch)
    if not err and fold_rollup.filtered(board) then err = index_rows.changed(tx, dialect, board, applied, result.last_seq) end
    if not err then err = bulk.insert(tx, "kickside_work_change", HISTORY_COLUMNS, batch.history) end
    if not err then err = fold_rollup.finish(tx, board, batch, dialect) end
    if not err then err = fold_batch.flush(tx, batch) end
    if not err then err = index_rows.changed(tx, dialect, board, applied, result.last_seq) end
    if err then return nil, err end
    if result.last_seq > board.applied_seq then
        err = fold_batch.exec(tx, [[UPDATE kickside_work_board SET applied_seq = $1, counter = $2
            WHERE board_id = $3]], { result.last_seq, board.counter, board_id })
        if err then return nil, err end
    end
    return result, nil
end

return M
