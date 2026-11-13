-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local values = require("values")
local seams = require("seams")
local process = require("process")
local formula = require("formula")
local sql = require("sql")
local types = require("types")
local consts = require("consts")
local store = require("store")
local fold_batch = require("fold_batch")
local rollup = require("rollup")
local document = require("document")
local conditions = require("conditions")
local rollup_rows = require("rollup_rows")
local json = require("json")
local jobs = require("jobs")
local fold_process = require("fold_process")

local M = {}

-- Rollup dependencies accumulate through the batch and recompute in item id order.

local function carries(board: types.Board, type_id: string): boolean
    local t = board.model.item_types[type_id]
    for _, key in ipairs(t and t.fields or {}) do if board.model.fields[key].rollup or board.model.fields[key].formula then return true end end
    return false
end

function M.filtered(board: types.Board): boolean
    for _, f in ipairs(board.compiled.fields) do if f.rollup and f.rollup.where ~= nil then return true end end
    return false
end

local function checks(tx: sql.DB | sql.Transaction, board: types.Board, item: types.Item): ({ string }?, error?)
    local definition, err = store.process(tx, board, item)
    if err or not definition then return nil, err end
    local state = process.state_of(definition, item.state)
    local ids: { string } = {}
    local function collect(active: types.State?)
        for _, id in ipairs(active and active.invariants or {}) do ids[#ids + 1] = id end
    end
    collect(state)
    for _, region in ipairs(state and state.regions or {}) do
        local active = process.region(item, region.id, definition)
        collect(process.state_of(definition, active.state))
    end
    return ids, nil
end

function M.active(board: types.Board): boolean
    for _, definition in ipairs(board.compiled.processes) do
        for _, state in ipairs(definition.states) do if #(state.invariants or {}) > 0 then return true end end
    end
    for _, f in ipairs(board.compiled.fields) do if f.rollup or f.formula then return true end end
    return false
end

function M.mark(tx: sql.DB | sql.Transaction, board: types.Board, batch: types.FoldBatch, id: string?, seq: integer): error?
    if not id then return nil end
    local item, err = store.load(tx, board.board_id, batch.cache, id)
    if err then return err end
    local invariants: { string } = {}
    if item and item.life ~= "purged" then
        local ids, err = checks(tx, board, item)
        if err or not ids then return err end
        invariants = ids
    end
    if item and item.life ~= "purged" and (carries(board, item.type) or #invariants > 0) then
        batch.affected = batch.affected or {}
        batch.affected[id] = math.max(batch.affected[id] or 0, seq)
    end
    return nil
end

-- observe follows local incoming links and symmetric outgoing links to their holders.
function M.observe(tx: sql.Transaction, board: types.Board, batch: types.FoldBatch, event: types.FoldEvent): error?
    local id = event.body.item
    if not id then return nil end
    local item, err = store.load(tx, board.board_id, batch.cache, id)
    if err or not item then return err end
    if not M.active(board) then
        local ids, ierr = checks(tx, board, item)
        if ierr or not ids then return ierr end
        if #ids == 0 then return nil end
    end
    batch.observed = batch.observed or {}
    batch.observed[id] = event.seq
    local target = event.body.target
    if target and target.board == board.board_id then batch.observed[target.item] = event.seq end
    err = M.mark(tx, board, batch, id, event.seq)
    if not err then err = M.mark(tx, board, batch, item.parent_id, event.seq) end
    if err then return err end
    if event.type == consts.EVENTS.ITEM_PARENTED then
        err = M.mark(tx, board, batch, event.body.previous, event.seq)
    end
    local target = event.body.target
    if not err and target and target.board == board.board_id then
        local relation = event.body.type and board.model.relations[event.body.type]
        if relation and relation.symmetric then err = M.mark(tx, board, batch, target.item, event.seq) end
    end
    return err
end

function M.pending(batch: types.FoldBatch): integer
    local n = 0
    for _ in pairs(batch.affected or {}) do n = n + 1 end
    return n
end

local function sources(tx: sql.Transaction, board: types.Board, item: types.Item, r: types.Rollup): ({ types.Item }?, error?)
    local rows: { types.Row }?, err: error?
    if r.of == "children" then
        rows, err = tx:query([[SELECT item_id FROM kickside_work_item WHERE board_id = $1 AND parent_id = $2 AND life = 'live'
            ORDER BY item_id LIMIT $3]], { board.board_id, item.item_id, consts.LIMITS.rollup_children })
    else
        local relation = board.model.relations[r.of]
        local reverse = relation and relation.symmetric and " OR (l.to_id = $2 AND l.from_id = i.item_id)" or ""
        rows, err = tx:query([[SELECT DISTINCT i.item_id FROM kickside_work_item i JOIN kickside_work_link l ON i.board_id = $1 AND l.board_id = i.board_id
            AND l.to_board_id = i.board_id AND ((l.from_id = $2 AND l.to_id = i.item_id)]] .. reverse .. [[)
            WHERE l.type = $3 AND i.life = 'live' ORDER BY i.item_id LIMIT $4]], { board.board_id, item.item_id, r.of, consts.LIMITS.rollup_links })
    end
    if err then return nil, err end
    local ids: { string } = {}
    for _, row in ipairs(rows or {}) do
        local decoded_3, decode_err = store.need(row, "item_id")
        if decode_err then return nil, decode_err end
        local decoded_3 = decoded_3 :: string
        ids[#ids + 1] = decoded_3
    end
    return store.items(tx, board.board_id, ids)
end

function M.finish(tx: sql.Transaction, board: types.Board, batch: types.FoldBatch, dialect: string): error?
    local err = fold_batch.flush(tx, batch)
    if err then return err end
    if batch.observed and next(batch.observed) then
        local expanded, eerr = rollup_rows.expand(tx, board, batch.observed)
        if eerr or not expanded then return eerr end
        local ids: { string } = {}
        for id in pairs(expanded) do ids[#ids + 1] = id end
        local items, ierr = store.items(tx, board.board_id, ids)
        if ierr then return ierr end
        for _, item in ipairs(items or {}) do
            batch.cache[item.item_id] = item
            err = M.mark(tx, board, batch, item.item_id, expanded[item.item_id] :: integer)
            if err then return err end
        end
        batch.observed = {}
    end
    if not batch.affected or next(batch.affected) == nil then return nil end
    local ids: { string } = {}
    for id in pairs(batch.affected) do ids[#ids + 1] = id end
    table.sort(ids)
    for _, id in ipairs(ids) do
        local item, ierr = fold_batch.load(tx, board.board_id, batch, id)
        if ierr or not item then return ierr end
        local rows_by: { [string]: { types.Item } } = {}
        local changed = false
        local t = board.model.item_types[item.type]
        for _, key in ipairs(t and t.fields or {}) do
            local f = board.model.fields[key]
            local r = f.rollup
            if r then
                local rows = rows_by[r.of]
                if not rows then
                    rows, err = sources(tx, board, item, r)
                    if err or not rows then return err end
                    rows_by[r.of] = rows
                end
                local selected = rows
                if r.where ~= nil then
                    local filtered, ferr = conditions.filter(tx, board, rows, r.where, dialect)
                    if ferr or not filtered then return ferr end
                    selected = filtered
                end
                local value: types.Value?
                if r.fn == "any" then value = #selected > 0
                elseif r.fn == "all" then value = #selected == #rows
                else value = rollup.evaluate(f, board.model, selected) end
                local step: types.PatchStep?
                if value ~= nil then step = document.set_step(item.document, f.id, value)
                else step = document.remove_step(item.document, f.id, "unset") end
                if step then fold_batch.patch(batch, item.document, { step }); changed = true end
            end
        end
        local patches, findings = formula.evaluate(board, item)
        local ids, ierr = checks(tx, board, item)
        if ierr or not ids then return ierr end
        if #ids > 0 then
            local allowed, declared, err = seams.guard(board, item, nil, ids)
            if err then findings[#findings + 1] = { code = "guard_unavailable", message = err:message() }
            elseif not allowed then
                for _, finding in ipairs(declared or {}) do findings[#findings + 1] = finding end
            end
        end
        if #patches > 0 then fold_batch.patch(batch, item.document, patches); changed = true end
        if not values.equal(item.findings or {}, findings) then item.findings = findings; changed = true end
        if changed then
            local seq = batch.affected[id] :: integer
            if seq >= item.updated_seq then
                item.updated_at = (batch.times and batch.times[seq]) or item.updated_at
            end
            item.updated_seq = math.max(item.updated_seq, seq)
            batch.dirty[id] = true
            local aerr = fold_process.advance(tx, dialect, board.board_id, id, batch.trace_context)
            if aerr then return aerr end
        end
        batch.rows = batch.rows + 1
    end
    batch.affected = {}
    return nil
end

-- Schema backfill demands a board slot; range events advance its generation cursor.

function M.demand(tx: sql.Transaction, dialect: string, board: types.Board, result: types.FoldResult, trace_context: types.TraceContext?): error?
    local job, err = jobs.enqueue_tx(tx, dialect, { namespace = "kickside.work", scope = "recompute", key = board.board_id,
        owner_locator = { kind = "component", id = board.board_id }, slot = true, demand = true, job_type = consts.RECOMPUTE_JOB,
        trace_context = trace_context, immutable_payload = { board_id = board.board_id } })
    if err then return err end
    local id = job and store.text(job.id)
    if not id then return fold_batch.corrupt("recompute enqueue returned no job id") end
    err = fold_batch.exec(tx, [[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status, error)
        VALUES ($1, $2, 'recompute', $3, 'pending', NULL) ON CONFLICT (board_id, job_id) DO UPDATE SET
        key = excluded.key, status = 'pending', error = NULL]],
        { board.board_id, id, json.encode({ generation = board.generation, after = "" }) })
    result.recompute_job = id
    return err
end

function M.apply_recomputed(tx: sql.Transaction, board: types.Board, event: types.FoldEvent, batch: types.FoldBatch): error?
    local range = event.body.recompute
    if not range then return fold_batch.corrupt("recompute event lacks range") end
    if range.generation ~= board.generation then return nil end
    local jobs_rows, jerr = tx:query("SELECT key FROM kickside_work_job WHERE board_id = $1 AND job_type = 'recompute'", { board.board_id })
    if jerr then return jerr end
    local row = jobs_rows and jobs_rows[1]
    if not row then return nil end
    local decoded_2, decode_err = store.stored(row.key, {} :: types.JsonObject)
    if decode_err then return decode_err end
    local decoded_2 = decoded_2 :: types.JsonObject
    local state = decoded_2
    if state.after ~= range.after or state.generation ~= range.generation then return nil end
    local err = fold_batch.flush(tx, batch)
    if err then return err end
    local rows, rerr = tx:query([[SELECT item_id FROM kickside_work_item WHERE board_id = $1 AND item_id > $2 AND item_id <= $3
        AND life <> 'purged' ORDER BY item_id LIMIT $4]], { board.board_id, range.after, range.through, consts.LIMITS.recompute_batch })
    if rerr then return rerr end
    for _, item in ipairs(rows or {}) do
        local decoded_1, decode_err = store.need(item, "item_id")
        if decode_err then return decode_err end
        local decoded_1 = decoded_1 :: string
        err = M.mark(tx, board, batch, decoded_1, event.seq)
        if err then return err end
    end
    return fold_batch.exec(tx, "UPDATE kickside_work_job SET key = $1 WHERE board_id = $2 AND job_type = 'recompute'",
        { json.encode({ generation = range.generation, after = range.through }), board.board_id })
end

return M
