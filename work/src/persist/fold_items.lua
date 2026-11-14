-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
local sql = require("sql")
local json = require("json")
local consts = require("consts")
local rank = require("rank")
local store = require("store")
local types = require("types")
local fold_batch = require("fold_batch")
local document = require("document")
local intervals = require("intervals")
local process = require("process")
local fold_rollup = require("fold_rollup")
local fold_process = require("fold_process")

local M = {}

local fold_rank = require("fold_rank")
M.apply_ranked, M.apply_rebalanced = fold_rank.apply_ranked, fold_rank.apply_rebalanced

-- Fold of item lifecycle events: creation, field changes, transitions and process migrations.

local function apply_created(tx: sql.Transaction, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, result: types.FoldResult, dialect: string): error?
    local body = event.body
    local item_id, type_id = body.item, body.type
    if not item_id or not type_id or not body.state or not body.patch then return fold_batch.corrupt("item.created event is incomplete") end
    local item_type = board.model.item_types[type_id]
    if not item_type then return fold_batch.corrupt("item.created names unknown item type " .. type_id) end
    local proc = board.model.processes[item_type.process]
    local state = proc and process.state_of(proc, body.state)
    if not state then return fold_batch.corrupt("item.created names unknown state " .. body.state) end
    local path = "/" .. item_id .. "/"
    if body.parent then
        local parent, err = fold_batch.load(tx, board.board_id, batch, body.parent)
        if err or not parent then return err end
        path = parent.path .. item_id .. "/"
    end
    local key = batch.rank_end and rank.ending(batch.rank_end) or nil
    if not key then
        local rerr: error?
        key, rerr = fold_rank.ending(tx, board.board_id, batch, nil)
        if rerr or not key then return rerr end
    end
    batch.rank_end = key
    if #key > consts.LIMITS.rank_length then
        local rerr = fold_rank.demand(tx, dialect, board.board_id, result, batch.trace_context)
        if rerr then return rerr end
    end
    board.counter = board.counter + 1
    local doc: types.Document = {}
    document.apply_patch(doc, body.patch)
    local counter_field = board.compiled.counter_field
    if counter_field then
        for _, key in ipairs(item_type.fields) do
            local f = board.model.fields[key]
            if f and f.id == counter_field then doc[tostring(counter_field)] = { p = board.counter } end
        end
    end
    fold_batch.held(batch, doc, 1)
    local item: types.Item = {
        work = { entered_at = body.at, entered_by = body.actor },
        board_id = board.board_id, item_id = item_id, number = board.counter, type = type_id, state = state.id,
        category = state.category, process_generation = proc.generation, visit = 1, parent_id = body.parent, path = path, rank = key,
        created_at = body.at, updated_at = body.at, version = 1, life = "live", life_at = nil, document = doc, created_seq = event.seq, updated_seq = event.seq,
    }
    process.initialize(item, state, body.actor :: string, body.at :: string, proc)
    batch.cache[item_id] = item
    batch.dirty[item_id] = true
    fold_batch.record(batch, board.board_id, event, "i:" .. item_id, "created", nil, nil,
        { key = store.key_of(board.key_prefix, item.number), type = type_id, parent = body.parent, state = state.id })
    fold_batch.track(batch, board, event, item, body.patch)
    batch.rows = batch.rows + 1
    local at = body.at or ""
    local err = intervals.open(tx, batch, board.board_id, item_id, intervals.STATE, event.seq, state.id, at, event.body.actor :: string, { before = "null" })
    if not err then err = intervals.open(tx, batch, board.board_id, item_id, intervals.CATEGORY, event.seq, item.category, at, event.body.actor :: string, { before = "null" }) end
    if not err then err = fold_batch.track_intervals(tx, batch, board, event, item, body.patch) end
    if not err then err = fold_process.arm(tx, dialect, board, item, nil, batch.trace_context) end
    return err
end

local function category_changed(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, item: types.Item, previous: string): error?
    if item.category == previous then return nil end
    if item.life ~= "live" then return nil end
    return intervals.shift(tx, batch, board.board_id, item.item_id, intervals.CATEGORY, event.seq, item.category, event.body.at or "", event.body.actor :: string, previous)
end

-- enter moves an item to its recorded process state and updates counts, visits and intervals.
local function enter(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, item: types.Item, state_id: string, visit: integer): error?
    local proc, perr = store.process(tx, board, item)
    if perr or not proc then return perr end
    local target = process.state_of(proc, state_id)
    if not target then return fold_batch.corrupt("entered state is absent from recorded process") end
    local previous, previous_state = item.category, item.state
    item.state = state_id
    if item.visit ~= visit then
        item.visit = visit - #(target.regions or {})
        process.initialize(item, target, event.body.actor :: string, event.body.at :: string, proc)
    end
    item.category = process.category(proc, item)
    item.visit = visit
    fold_batch.touch(batch, item, event.seq)
    if item.life ~= "live" then return nil end
    local at = event.body.at or ""
    local err = intervals.shift(tx, batch, board.board_id, item.item_id, intervals.STATE, event.seq, state_id, at, event.body.actor :: string, previous_state)
    if not err then err = category_changed(tx, board, event, batch, item, previous) end
    return err
end

local function apply_transitioned(tx: sql.Transaction, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, dialect: string): error?
    local body = event.body
    local found, err = fold_batch.load(tx, board.board_id, batch, body.item)
    if err or not found then return err end
    local item: types.Item = found
    if not body.from or not body.to or not body.visit or not body.patch then return fold_batch.corrupt("item.transitioned event is incomplete") end
    fold_batch.patch(batch, item.document, body.patch)
    if body.region then
        if not item.work or not item.work.regions or item.work.regions[body.region] ~= body.from then return fold_batch.corrupt("transition names an inactive region state") end
        local p, perr = store.process(tx, board, item)
        if perr or not p then return perr end
        local previous = item.category
        item.work.regions[body.region] = body.to
        local regional = process.region(item, body.region, p)
        regional.visit = body.visit
        process.initialize(regional :: types.Item, process.state_of(p, body.to) :: types.State, body.actor :: string, body.at :: string, p)
        item.work.region_data[body.region] = regional.work
        item.category, item.visit = process.category(p, item), body.visit
        fold_batch.touch(batch, item, event.seq)
        err = category_changed(tx, board, event, batch, item, previous)
    else
        err = enter(tx, board, event, batch, item, body.to, body.visit)
    end
    if err then return err end
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, "state", nil, body.from, body.to)
    fold_batch.track(batch, board, event, item, body.patch)
    batch.rows = batch.rows + 1
    err = fold_batch.track_intervals(tx, batch, board, event, item, body.patch)
    if not err then err = fold_process.arm(tx, dialect, board, item, body.region, batch.trace_context) end
    if not err and item.parent_id then err = fold_process.advance(tx, dialect, board.board_id, item.parent_id, batch.trace_context) end
    return err
end

local function apply_migrated(tx: sql.Transaction, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, dialect: string): error?
    local body = event.body
    local found, err = fold_batch.load(tx, board.board_id, batch, body.item)
    if err or not found then return err end
    local item: types.Item = found
    if not body.from_generation or not body.to_generation or not body.state_map then return fold_batch.corrupt("item.migrated event is incomplete") end
    item.process_generation = body.to_generation
    local from_state = item.state
    local to_state = body.state_map[from_state] or from_state
    local definition, perr = store.process(tx, board, item)
    if perr or not definition then return perr end
    local target = process.state_of(definition, to_state) :: types.State
    local entered: { string } = {}
    if to_state == from_state then
        local regions, rerr = process.migrate_regions(item, definition, body.state_map, body.actor :: string, body.at :: string)
        if rerr then return rerr end
        entered = regions :: { string }
    end
    local visit = to_state == from_state and item.visit or item.visit + 1 + #(target.regions or {})
    err = enter(tx, board, event, batch, item, to_state, visit)
    if err then return err end
    item.process_generation = body.to_generation
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, "migration", nil, { generation = body.from_generation, state = from_state },
        { generation = body.to_generation, state = to_state })
    batch.rows = batch.rows + 1
    if to_state ~= from_state then return fold_process.arm(tx, dialect, board, item, nil, batch.trace_context) end
    for _, region in ipairs(entered) do
        local aerr = fold_process.arm(tx, dialect, board, item, region, batch.trace_context)
        if aerr then return aerr end
    end
    return nil
end

local function apply_changed(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local item, err = fold_batch.load(tx, board.board_id, batch, event.body.item)
    if not item or err then return err end
    local patch = event.body.patch or {}
    fold_batch.patch(batch, item.document, patch)
    fold_batch.touch(batch, item, event.seq)
    fold_batch.track(batch, board, event, item, patch)
    batch.rows = batch.rows + 1
    return fold_batch.track_intervals(tx, batch, board, event, item, patch)
end

M.apply_created = apply_created
M.apply_transitioned = apply_transitioned
M.apply_migrated = apply_migrated
M.apply_changed = apply_changed

-- Fold of item relations: parent moves and typed links.

local function apply_parented(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local body = event.body
    local item, err = fold_batch.load(tx, board.board_id, batch, body.item)
    if err or not item then return err end
    if fold_rollup.active(board) then
        err = fold_rollup.mark(tx, board, batch, item.parent_id, event.seq)
        if err then return err end
    end
    local flushed = fold_batch.flush(tx, batch)
    if flushed then return flushed end
    local path = "/" .. item.item_id .. "/"
    local previous = item.parent_id
    local reason: string? = nil
    local rows, qerr = tx:query([[SELECT COUNT(*) AS n FROM kickside_work_item
        WHERE board_id = $1 AND path LIKE $2]], { board.board_id, item.path .. "%" })
    if qerr then return qerr end
    if not rows or not rows[1] then return fold_batch.corrupt("subtree count has no row") end
    local decoded_3, decode_err = store.need_int(rows[1], "n")
    if decode_err then return decode_err end
    local decoded_3 = decoded_3 :: integer
    local size = decoded_3
    if size > consts.LIMITS.subtree_rows then reason = "subtree_too_large" end
    if body.parent then
        local parent, perr = store.item(tx, board.board_id, body.parent)
        if perr then return perr end
        if not parent or parent.life ~= "live" then reason = "parent_trashed"
        else
            local allowed = false
            local item_type = board.model.item_types[item.type]
            for _, t in ipairs(item_type and item_type.parent_types or {}) do if t == parent.type then allowed = true end end
            if not allowed then reason = "parent_type" end
            if parent.path:find("/" .. item.item_id .. "/", 1, true) then reason = "cycle" end
            path = parent.path .. item.item_id .. "/"
        end
    end
    local _, depth = path:gsub("/", "")
    local rows_deep, derr = tx:query([[SELECT path FROM kickside_work_item WHERE board_id = $1 AND path LIKE $2
        ORDER BY length(path) DESC LIMIT 1]], { board.board_id, item.path .. "%" })
    if derr then return derr end
    local deepest_path = item.path
    if rows_deep and rows_deep[1] then
        local decoded_2, decode_err = store.need(rows_deep[1], "path")
        if decode_err then return decode_err end
        local decoded_2 = decoded_2 :: string
        deepest_path = decoded_2 end
    local _, old_depth = item.path:gsub("/", "")
    local _, subtree_depth = deepest_path:gsub("/", "")
    if depth - 1 + subtree_depth - old_depth > consts.LIMITS.depth then reason = "depth" end
    if reason then
        fold_batch.touch(batch, item, event.seq)
        batch.cache[item.item_id] = item
        fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, "parent_refused", nil, previous, { parent = body.parent, reason = reason })
        batch.rows = batch.rows + 1
        return nil
    end
    local old_path = item.path
    item.parent_id = body.parent
    item.path = path
    fold_batch.touch(batch, item, event.seq)
    batch.cache[item.item_id] = item
    err = fold_batch.flush(tx, batch)
    if err then return err end
    local affected, uerr = tx:execute([[UPDATE kickside_work_item SET path = $1 || substr(path, $2), updated_seq = $3, updated_at = $4
        WHERE board_id = $5 AND path LIKE $6 AND item_id <> $7]], { path, #old_path + 1, event.seq, event.body.at or "", board.board_id, old_path .. "%", item.item_id })
    if uerr then return errors.wrap(uerr, "subtree move failed") end
    local rewritten = affected and math.tointeger(affected.rows_affected)
    if not rewritten then return fold_batch.corrupt("subtree update returned no row count") end
    batch.rows = batch.rows + rewritten
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, "parent", nil, previous, body.parent)
    batch.rows = batch.rows + 1
    return nil
end

-- canonical_link orders a symmetric same-board relation so one row stores both directions.
local function canonical_link(board: types.Board, type_id: string, from: string, target: types.Target): (string, string, string)
    local relation = board.model.relations[type_id]
    if relation and relation.symmetric and target.board == board.board_id and target.item < from then
        return target.item, target.board, from
    end
    return from, target.board, target.item
end

local function apply_link(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, linked: boolean): error?
    local body = event.body
    local item, err = fold_batch.load(tx, board.board_id, batch, body.item)
    if err or not item then return err end
    local type_id, target = body.type, body.target
    if not type_id or not target then return fold_batch.corrupt("link event is incomplete") end
    local from, to_board, to_id = canonical_link(board, type_id, item.item_id, target)
    if linked then
        err = fold_batch.exec(tx, [[INSERT INTO kickside_work_link (board_id, from_id, type, to_board_id, to_id, at, seq)
            VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (board_id, from_id, type, to_board_id, to_id) DO NOTHING]],
            { board.board_id, from, type_id, to_board, to_id, body.at or "", event.seq })
    else
        err = fold_batch.exec(tx, "DELETE FROM kickside_work_link WHERE board_id = $1 AND from_id = $2 AND type = $3 AND to_board_id = $4 AND to_id = $5",
            { board.board_id, from, type_id, to_board, to_id })
    end
    if err then return errors.wrap(err, "link write failed") end
    fold_batch.touch(batch, item, event.seq)
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, linked and "link" or "unlink", nil, nil, { type = type_id, target = target })
    batch.rows = batch.rows + 1
    return nil
end

M.apply_parented = apply_parented
M.apply_link = apply_link

-- Each lifecycle event changes one guarded item; prepare expands the bounded subtree.

local function apply_life(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch, deleting: boolean): error?
    local body = event.body
    local item, err = fold_batch.load(tx, board.board_id, batch, body.item)
    if err or not item then return err end
    item.life = deleting and "trashed" or "live"
    item.life_at = deleting and body.at or nil
    fold_batch.touch(batch, item, event.seq)
    local at = body.at or ""
    if deleting then
        err = intervals.close_item(tx, batch, item.item_id, at)
    else
        err = intervals.open(tx, batch, board.board_id, item.item_id, intervals.STATE, event.seq, item.state, at, event.body.actor :: string)
        if not err then err = intervals.open(tx, batch, board.board_id, item.item_id, intervals.CATEGORY, event.seq, item.category, at, event.body.actor :: string) end
        if not err then
            for _, f in ipairs(board.compiled.fields) do
                local value = document.value(item.document, f.id)
                if f.intervals and value ~= nil then
                    err = intervals.open(tx, batch, board.board_id, item.item_id, intervals.field_key(f.id), event.seq, intervals.value_key(value), at, event.body.actor :: string)
                    if err then return err end
                end
            end
        end
    end
    if err then return err end
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, deleting and "deleted" or "restored", nil, nil, nil)
    batch.rows = batch.rows + 1
    return nil
end

M.apply_life = apply_life

-- Purge clears one version-guarded trash document; retention collects its owned rows in pages.
function M.apply_purged(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local item, err = fold_batch.load(tx, board.board_id, batch, event.body.item)
    if err or not item then return err end
    if item.life ~= "trashed" then return fold_batch.corrupt("purge names an item outside trash") end
    fold_batch.held(batch, item.document, -1)
    item.document = {}
    item.life = "purged"
    item.life_at = event.body.at
    fold_batch.touch(batch, item, event.seq)
    fold_batch.record(batch, board.board_id, event, "i:" .. item.item_id, "purged", nil, nil, nil)
    batch.rows = batch.rows + 1
    return nil
end

-- Fold of comment events.

local EV = consts.EVENTS

local function apply_comment(tx: storage.Executor, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local body = event.body
    local id = body.comment
    if not id or not body.item then return fold_batch.corrupt("comment event is incomplete") end
    local err: error?
    if event.type == EV.COMMENT_ADDED then
        err = fold_batch.exec(tx, [[INSERT INTO kickside_work_comment (board_id, comment_id, item_id, body, mentions, author, version, deleted, created_at, edited_at)
            VALUES ($1, $2, $3, $4, $5, $6, 1, 0, $7, NULL) ON CONFLICT (board_id, comment_id) DO NOTHING]],
            { board.board_id, id, body.item, body.body or "", json.encode(body.mentions or {}), body.actor or "", body.at or "" })
    elseif event.type == EV.COMMENT_EDITED then
        err = fold_batch.exec(tx, "UPDATE kickside_work_comment SET body = $1, mentions = $2, version = version + 1, edited_at = $3 WHERE board_id = $4 AND comment_id = $5",
            { body.body or "", json.encode(body.mentions or {}), body.at or "", board.board_id, id })
    else
        err = fold_batch.exec(tx, "UPDATE kickside_work_comment SET deleted = 1, version = version + 1, edited_at = $1 WHERE board_id = $2 AND comment_id = $3",
            { body.at or "", board.board_id, id })
    end
    if err then return errors.wrap(err, "comment write failed") end
    local item, ierr = fold_batch.load(tx, board.board_id, batch, body.item)
    if ierr or not item then return ierr end
    item.updated_seq = event.seq
    batch.dirty[item.item_id] = true
    batch.rows = batch.rows + 1
    return nil
end

M.apply_comment = apply_comment

return M
