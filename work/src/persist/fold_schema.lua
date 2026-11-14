-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Fold of schema generations: the board row, its generation, key prefixes and the follow migration demand.
local json = require("json")
local sql = require("sql")
local consts = require("consts")
local jobs = require("jobs")
local rollup = require("rollup")
local fold_rollup = require("fold_rollup")
local schema = require("schema")
local store = require("store")
local types = require("types")
local fold_batch = require("fold_batch")

local generated = require("generated")
local values = require("values")
local tables = require("tables")
local index_rows = require("index_rows")

local plugin_rows = require("plugin_rows")
local M = {}

-- start_migration demands the board's migration slot in the fold's transaction; the caller wakes the job after commit.
local function start_migration(tx: sql.Transaction, dialect: string, board_id: string, trace_context: types.TraceContext?): (string?, error?)
    local job, jerr = jobs.enqueue_tx(tx, dialect, { namespace = "kickside.work", scope = "migration", key = board_id,
        owner_locator = { kind = "component", id = board_id }, slot = true, demand = true, job_type = consts.MIGRATION_JOB,
        trace_context = trace_context, immutable_payload = { board_id = board_id } })
    if jerr then return nil, errors.wrap(jerr, "migration enqueue failed") end
    local job_id = job and store.text(job.id)
    if not job_id then return nil, fold_batch.corrupt("migration enqueue returned no job id") end
    local err = fold_batch.exec(tx, [[INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status, error)
        VALUES ($1, $2, 'migration', $3, 'pending', NULL)
        ON CONFLICT (board_id, job_id) DO UPDATE SET status = 'pending', error = NULL]],
        { board_id, job_id, board_id })
    if err then return nil, errors.wrap(err, "migration job write failed") end
    return job_id, nil
end

local function apply_schema(tx: sql.Transaction, dialect: string, board: types.Board?, board_id: string, event: types.FoldEvent, batch: types.FoldBatch, result: types.FoldResult): (types.Board?, error?)
    local body = event.body
    local compiled = body.compiled
    local declaration = body.declaration
    if not compiled or not declaration or not body.generation or not body.digest then return nil, fold_batch.corrupt("schema event is incomplete") end
    local previous = board and board.compiled
    local before = board and board.layout or nil
    local after = tables.layout(compiled)
    local lerr: error?
    if not before then lerr = generated.create(tx, dialect, tables.of(board_id, after))
    elseif not values.equal(before, after) then lerr = generated.alter(tx, dialect, tables.of(board_id, after), before) end
    if lerr then return nil, lerr end
    local needs_reindex = not before or not previous or tables.signature(previous) ~= tables.signature(compiled)
    local needs_recompute = rollup.changed(board and board.compiled, compiled)
    local at = body.at or ""
    local err: error?
    local encoded = json.encode(compiled)
    if not board then
        err = fold_batch.exec(tx, [[INSERT INTO kickside_work_board (board_id, key_prefix, generation, schema_version, compiled, digest, layout, applied_seq, counter,
                tombstone_floor_seq, created_at, updated_at)
            VALUES ($1, $2, $3, 1, $4, $5, NULL, 0, 0, 0, $6, $6)]], { board_id, compiled.key_prefix, body.generation, encoded, body.digest, at })
        if err then return nil, errors.wrap(err, "board insert failed") end
        board = { schema_version = 1, board_id = board_id, key_prefix = compiled.key_prefix, generation = body.generation, compiled = compiled,
            model = schema.model(compiled), digest = body.digest, applied_seq = 0, counter = 0, tombstone_floor_seq = 0 }
    else
        err = fold_batch.exec(tx, [[UPDATE kickside_work_board SET key_prefix = $1, generation = $2, schema_version = schema_version + 1, compiled = $3, digest = $4, updated_at = $5
            WHERE board_id = $6]], { compiled.key_prefix, body.generation, encoded, body.digest, at, board_id })
        if err then return nil, errors.wrap(err, "board update failed") end
        board.key_prefix = compiled.key_prefix
        board.schema_version = (board.schema_version or 0) + 1
        board.generation = body.generation
        board.compiled = compiled
        board.model = schema.model(compiled)
        board.digest = body.digest
    end
    if body.pack then
        board.pack = body.pack.id :: string
        board.pack_version = body.pack.version :: string
        board.pack_digest = body.pack.digest :: string
        board.pack_base = body.pack.base :: types.JsonObject
        err = fold_batch.exec(tx, "UPDATE kickside_work_board SET pack = $1, pack_version = $2, pack_digest = $3, pack_base = $4 WHERE board_id = $5",
            { board.pack, board.pack_version, board.pack_digest, store.encode(board.pack_base), board_id })
        if err then return nil, err end
    end
    err = fold_batch.exec(tx, "UPDATE kickside_work_board SET layout = $1 WHERE board_id = $2", { json.encode(after), board_id })
    if err then return nil, err end
    local pending, perr = tx:query("SELECT key FROM kickside_work_job WHERE board_id = $1 AND job_type = 'reindex' AND status <> 'done'", { board_id })
    if perr then return nil, perr end
    if needs_reindex or #(pending or {}) > 0 then
        err = fold_batch.flush(tx, batch)
        if err then return nil, err end
        local count, cerr = store.count(tx, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { board_id })
        if cerr then return nil, cerr end
        if count and count > 0 then
            local fields = tables.unbuilt(previous, compiled)
            if compiled.visibility then fields[#fields + 1] = compiled.visibility.field end
            local seen: { [string]: boolean } = {}
            for _, code in ipairs(fields) do seen[code] = true end
            for _, row in ipairs(pending or {}) do
                local decoded_1, decode_err = store.stored(row.key, {} :: types.JsonObject)
                if decode_err then return nil, decode_err end
                local decoded_1 = decoded_1 :: types.JsonObject
                local state = decoded_1
                for _, code in ipairs((state.fields or {}) :: { string }) do
                    if not seen[code] then fields[#fields + 1] = code; seen[code] = true end
                end
            end
            err = index_rows.demand(tx, dialect, board, result, fields, batch.trace_context)
            if err then return nil, err end
        end
    end
    board.layout = after
    local claim_version = math.tointeger(body.claim_version)
    if claim_version then
        err = fold_batch.exec(tx, [[INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, $3, $4)
            ON CONFLICT (prefix) DO UPDATE SET board_id = excluded.board_id, claimed_seq = excluded.claimed_seq, claim_version = excluded.claim_version]],
            { compiled.key_prefix, board_id, event.seq, claim_version })
    end
    if err then return nil, errors.wrap(err, "prefix insert failed") end
    err = fold_batch.exec(tx, [[INSERT INTO kickside_work_generation (board_id, generation, declaration, digest, class, actor, applied_seq, applied_at, maps, compiled, pack)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (board_id, generation) DO NOTHING]],
        { board_id, body.generation, json.encode(declaration), body.digest, body.class or "", body.actor or "", event.seq, at, json.encode(body.maps or {}), encoded, store.encode(board.pack and { id = board.pack, version = board.pack_version, digest = board.pack_digest, base = board.pack_base } or nil) })
    if err then return nil, errors.wrap(err, "generation insert failed") end
    fold_batch.record(batch, board_id, event, "schema", "schema", nil, nil, { generation = body.generation, class = body.class })
    batch.rows = batch.rows + 1
    if body.migrates then
        local job_id, merr = start_migration(tx, dialect, board_id, batch.trace_context)
        if merr then return nil, merr end
        result.migration_job = job_id
    end
    if needs_recompute then
        err = fold_batch.flush(tx, batch)
        if err then return nil, err end
        local count, cerr = store.count(tx, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { board_id })
        if cerr then return nil, cerr end
        if count and count > 0 then
            err = fold_rollup.demand(tx, dialect, board, result, batch.trace_context)
            if err then return nil, err end
        end
    end
    local plugin_err = plugin_rows.schema(tx, board_id, compiled, event.seq, body.plugin_configs)
    if plugin_err then return nil, plugin_err end
    result.plugin_job, plugin_err = plugin_rows.enroll(tx, dialect, board_id)
    if plugin_err then return nil, plugin_err end
    return board, nil
end

M.apply_schema = apply_schema

return M
