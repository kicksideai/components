-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- Shared state and row helpers of the fold: the batch a fold accumulates, change rows, item writes and tracked
-- field values. Every event family folds through them.
local json = require("json")
local sql = require("sql")
local bulk = require("bulk")
local document = require("document")
local consts = require("consts")
local intervals = require("intervals")
local store = require("store")
local types = require("types")

local M = {}

function M.exec(tx: storage.Executor, statement: string, params: types.SqlParams?): error?
    local _, err = tx:execute(statement, params or {})
    return err
end

function M.corrupt(message: string): error
    return errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = message })
end

-- record appends one change row for the event being folded.
function M.record(batch: types.FoldBatch, board_id: string, event: types.FoldEvent, subject: string, kind: string, field_id: integer?, before: unknown, after: unknown)
    local n = (batch.written[event.seq] or 0) + 1
    batch.written[event.seq] = n
    local body = event.body
    batch.history[#batch.history + 1] = { board_id, event.seq, n, subject, kind, field_id or sql.NULL, store.encode(before), store.encode(after),
        body.actor or "", body.source or sql.NULL, body.origin and json.encode(body.origin) or sql.NULL, body.at or "" }
end

local ITEM_COLUMNS: { storage.Column } = {}
for _, name in ipairs({ "board_id", "item_id", "number", "type", "state", "category", "process_generation", "visit", "parent_id",
    "path", "rank", "version", "life", "life_at", "document", "created_seq", "updated_seq", "created_at", "updated_at", "process_data", "findings", "move_id" }) do
    ITEM_COLUMNS[#ITEM_COLUMNS + 1] = { name = name }
end
local ITEM_UPSERT = [[ ON CONFLICT (board_id, item_id) DO UPDATE SET state = excluded.state, category = excluded.category,
    process_generation = excluded.process_generation, visit = excluded.visit, parent_id = excluded.parent_id, path = excluded.path,
    move_id = excluded.move_id, rank = excluded.rank, version = excluded.version, life = excluded.life, life_at = excluded.life_at,
    findings = excluded.findings, process_data = excluded.process_data, document = excluded.document, updated_seq = excluded.updated_seq, updated_at = excluded.updated_at]]

local function item_row(item: types.Item): types.SqlParams
    return { item.board_id, item.item_id, item.number, item.type, item.state, item.category, item.process_generation, item.visit,
        item.parent_id or sql.NULL, item.path, item.rank or sql.NULL, item.version, item.life, item.life_at or sql.NULL,
        next(item.document) == nil and "{}" or json.encode(item.document), item.created_seq, item.updated_seq, item.created_at or "", item.updated_at or "", store.encode(item.work or {}), store.encode(item.findings or {}), item.move_id or sql.NULL }
end

-- save writes an item through the batch's shared row representation.
function M.save(tx: storage.Executor, item: types.Item): error?
    return bulk.insert(tx, "kickside_work_item", ITEM_COLUMNS, { item_row(item) }, ITEM_UPSERT)
end

-- patch counts changes in held fields across one document patch.
function M.patch(batch: types.FoldBatch, doc: types.Document, patch: { types.PatchStep })
    for _, step in ipairs(patch) do
        local before = document.value(doc, step.f) ~= nil
        document.apply_patch(doc, { step })
        local after = document.value(doc, step.f) ~= nil
        if before ~= after then batch.usage[step.f] = (batch.usage[step.f] or 0) + (after and 1 or -1) end
    end
end

-- held adds all held field ids, including retired fields, to the usage deltas.
function M.held(batch: types.FoldBatch, doc: types.Document, sign: integer)
    for key, cell in pairs(doc) do
        local id = math.tointeger(tonumber(key))
        if id and cell.p ~= nil then batch.usage[id] = (batch.usage[id] or 0) + sign end
    end
end

-- flush_usage writes the accumulated deltas in one bulk upsert.
local function flush_usage(tx: storage.Executor, batch: types.FoldBatch): error?
    local rows: { types.SqlParams } = {}
    local ids: { integer } = {}
    for id, delta in pairs(batch.usage) do if delta ~= 0 then ids[#ids + 1] = id end end
    table.sort(ids)
    for _, id in ipairs(ids) do rows[#rows + 1] = { batch.board_id, id, batch.usage[id] } end
    local err = bulk.insert(tx, "kickside_work_field_usage", { { name = "board_id" }, { name = "field_id" }, { name = "items" } }, rows,
        " ON CONFLICT (board_id, field_id) DO UPDATE SET items = kickside_work_field_usage.items + excluded.items")
    if not err then batch.usage = {} end
    return err
end

-- flush writes the changed items and drops the cache, so set-based statements see and leave consistent rows.
function M.flush(tx: storage.Executor, batch: types.FoldBatch): error?
    local interval_err = intervals.flush(tx, batch)
    if interval_err then return interval_err end
    local ids: { string } = {}
    for id in pairs(batch.dirty) do ids[#ids + 1] = id end
    table.sort(ids)
    local rows: { types.SqlParams } = {}
    for _, id in ipairs(ids) do
        local item = batch.cache[id]
        if item then rows[#rows + 1] = item_row(item) end
    end
    local write_err = bulk.insert(tx, "kickside_work_item", ITEM_COLUMNS, rows, ITEM_UPSERT)
    if write_err then return errors.wrap(write_err, "item write failed") end
    local err = flush_usage(tx, batch)
    if err then return err end
    batch.dirty = {}
    batch.cache = {}
    return nil
end

function M.load(tx: storage.Executor, board_id: string, batch: types.FoldBatch, item_id: string?): (types.Item?, error?)
    if not item_id then return nil, M.corrupt("event names no item") end
    local item, err = store.load(tx, board_id, batch.cache, item_id)
    if err then return nil, err end
    if not item then return nil, M.corrupt("event names unknown item " .. item_id) end
    return item, nil
end

function M.touch(batch: types.FoldBatch, item: types.Item, seq: integer)
    item.version = item.version + 1
    item.updated_seq = seq
    item.updated_at = batch.at or item.updated_at
    batch.dirty[item.item_id] = true
end

-- track writes value rows for the patch steps of fields declared track.
function M.track(batch: types.FoldBatch, board: types.Board, event: types.FoldEvent, item: types.Item, patch: { types.PatchStep })
    if (event.body.audit or board.compiled.policy.audit) ~= "fields" then return end
    for _, step in ipairs(patch) do
        local field = board.model.by_id[step.f]
        if field and field.track then
            local kind = step.unset and "unset" or step.clear and "clear" or "set"
            M.record(batch, board.board_id, event, "i:" .. item.item_id, kind, step.f, step.before, step.v)
        end
    end
end

-- track_intervals shifts the interval of each patched field declared intervals.
function M.track_intervals(tx: storage.Executor, batch: types.FoldBatch, board: types.Board, event: types.FoldEvent, item: types.Item, patch: { types.PatchStep }): error?
    for _, step in ipairs(patch) do
        local field = board.model.by_id[step.f]
        if field and field.intervals then
            local key = intervals.field_key(step.f)
            local err: error?
            if step.v ~= nil then
                err = intervals.shift(tx, batch, board.board_id, item.item_id, key, event.seq, intervals.value_key(step.v), event.body.at or "", event.body.actor :: string, step.before ~= nil and intervals.value_key(step.before) or "null")
            else
                err = intervals.close(tx, batch, board.board_id, item.item_id, key, event.body.at or "", { seq = event.seq, actor = event.body.actor :: string })
            end
            if err then return err end
        end
    end
    return nil
end

return M
