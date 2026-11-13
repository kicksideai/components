-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- types.Row access over the fixed work tables, shared by the projection, the commands and the reads.
local registry = require("registry")
local sql = require("sql")
local consts = require("consts")
local schema = require("schema")
local types = require("types")
local values = require("values")
local process_data = require("process_data")

local M = {}

local function unconfigured(): error
    return errors.new({ details = { code = "database_unavailable" }, kind = errors.UNAVAILABLE, message = "work database is not configured" })
end

function M.db_id(): (string?, error?)
    local entry, err = registry.get(consts.DB_CONFIG)
    if err then return nil, err end
    if not entry then return nil, unconfigured() end
    local db_id = (entry.meta or {}).db_id
    if type(db_id) ~= "string" or db_id == "" then return nil, unconfigured() end
    return db_id, nil
end

function M.open(): (sql.DB?, error?)
    local db_id, id_err = M.db_id()
    if not db_id then return nil, id_err end
    local db, err = sql.get(db_id)
    if err then return nil, err end
    if not db then return nil, errors.new({ details = { code = "database_unavailable" }, kind = errors.UNAVAILABLE, message = "work database unavailable" }) end
    return db, nil
end

local codec = require("row_decode")
local int, text, need, need_int, stored = codec.int, codec.text, codec.need, codec.need_int, codec.stored
M.int, M.text, M.need, M.need_int, M.stored = int, text, need, need_int, stored

-- encode renders a value for a JSON column; nil stays NULL.
function M.encode(v: unknown): unknown
    if v == nil then return sql.NULL end
    return values.canonical(v)
end

-- board returns the board row with its compiled model, or nil. With a dialect it
-- locks the row (PostgreSQL FOR UPDATE; SQLite's writer lock).
function M.board(db: storage.Executor, board_id: string, lock_dialect: string?): (types.Board?, error?)
    local suffix = ""
    if lock_dialect == sql.type.POSTGRES then suffix = " FOR UPDATE" end
    local rows, err = db:query("SELECT * FROM kickside_work_board WHERE board_id = $1" .. suffix, { board_id })
    if err then return nil, errors.wrap(err, "board read failed") end
    local row: types.Row? = rows and rows[1]
    if not row then return nil, nil end
    return M.decode_board(row)
end

function M.decode_board(row: types.Row): (types.Board?, error?)
    local compiled, decode_err = codec.compiled(row.compiled)
    if decode_err then return nil, decode_err end
    if not compiled then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "board row has no compiled model" }) end
    local schema_version, version_err = need_int(row, "schema_version")
    if version_err then return nil, version_err end
    local layout, decode_err = stored(row.layout, nil :: types.Layout?)
    if decode_err then return nil, decode_err end

    local tombstone_floor_seq, decode_err = need_int(row, "tombstone_floor_seq")
    if decode_err or tombstone_floor_seq == nil then return nil, decode_err end

    local counter, decode_err = need_int(row, "counter")
    if decode_err or counter == nil then return nil, decode_err end

    local applied_seq, decode_err = need_int(row, "applied_seq")
    if decode_err or applied_seq == nil then return nil, decode_err end

    local digest, decode_err = need(row, "digest")
    if decode_err or digest == nil then return nil, decode_err end

    local generation, decode_err = need_int(row, "generation")
    if decode_err or generation == nil then return nil, decode_err end

    local key_prefix, decode_err = need(row, "key_prefix")
    if decode_err or key_prefix == nil then return nil, decode_err end

    local board_id, decode_err = need(row, "board_id")
    if decode_err or board_id == nil then return nil, decode_err end

    local pack_base, pack_err = stored(row.pack_base, nil :: types.JsonObject?)
    if pack_err then return nil, pack_err end
    return {
        pack = text(row.pack), pack_version = text(row.pack_version), pack_digest = text(row.pack_digest), pack_base = pack_base,
        schema_version = schema_version,
        board_id = board_id, key_prefix = key_prefix, generation = generation,
        compiled = compiled, model = schema.model(compiled), digest = digest,
        applied_seq = applied_seq, counter = counter,
        tombstone_floor_seq = tombstone_floor_seq, layout = layout,
    }, nil
end

-- generation returns the declaration and compiled model a generation held.
function M.generation(db: storage.Executor, board_id: string, generation: integer): ({ pack: types.JsonObject?, compiled: types.Compiled, declaration: types.Declaration, digest: string, class: string, applied_seq: integer, maps: types.StateMaps }?, error?)
    local rows, err = db:query("SELECT * FROM kickside_work_generation WHERE board_id = $1 AND generation = $2", { board_id, generation })
    if err then return nil, errors.wrap(err, "generation read failed") end
    local row: types.Row? = rows and rows[1]
    if not row then return nil, nil end
    local maps, decode_err = stored(row.maps, {} :: types.StateMaps)
    if decode_err then return nil, decode_err end

    local applied_seq, decode_err = need_int(row, "applied_seq")
    if decode_err or applied_seq == nil then return nil, decode_err end

    local class, decode_err = need(row, "class")
    if decode_err or class == nil then return nil, decode_err end

    local digest, decode_err = need(row, "digest")
    if decode_err or digest == nil then return nil, decode_err end

    local declaration, decode_err = stored(row.declaration, {} :: types.Declaration)
    if decode_err then return nil, decode_err end

    local compiled, decode_err = codec.compiled(row.compiled)
    if decode_err then return nil, decode_err end

    local pack, pack_err = stored(row.pack, nil :: types.JsonObject?)
    if pack_err then return nil, pack_err end
    return { pack = pack, compiled = compiled :: types.Compiled, declaration = declaration :: types.Declaration, digest = digest,
        class = class, applied_seq = applied_seq, maps = maps :: types.StateMaps }, nil
end

function M.process_model(db: storage.Executor, board: types.Board, item: { type: string, process_generation: integer }): (types.Model?, error?)
    local item_type = board.model.item_types[item.type]
    local current = item_type and board.model.processes[item_type.process]
    if current and current.generation == item.process_generation then return board.model, nil end
    local generation, err = M.generation(db, board.board_id, item.process_generation)
    if err then return nil, err end
    if generation then
        local model = schema.model(generation.compiled)
        local held = model.item_types[item.type]
        if held and model.processes[held.process] then return model, nil end
    end
    return nil, errors.new({ kind = errors.INTERNAL, message = "item process generation is missing", details = { code = "process_generation_missing" } })
end

function M.process(db: storage.Executor, board: types.Board, item: { type: string, process_generation: integer }): (types.Process?, error?)
    local model, err = M.process_model(db, board, item)
    if err or not model then return nil, err end
    return model.processes[model.item_types[item.type].process], nil
end

local function item_rows(db: storage.Executor, rows: { types.Row }): ({ types.Item }?, error?)
    local items: { types.Item } = {}
    local legacy = false
    for _, row in ipairs(rows) do
        local item, err = codec.item(row)
        if err or not item then return nil, err end
        items[#items + 1] = item
        legacy = legacy or process_data.needs(item)
    end
    if legacy then
        local board, berr = M.board(db, items[1].board_id)
        if berr then return nil, berr end
        if not board then return nil, errors.new({ kind = errors.INTERNAL, message = "item board is missing", details = { code = "row_corrupt" } }) end
        local uerr = process_data.read(db, board, items, function(item: { type: string, process_generation: integer }): (types.Process?, error?, types.Compiled?) return M.process(db, board, item) end)
        if uerr then return nil, uerr end
    end
    return items, nil
end

function M.item(db: storage.Executor, board_id: string, item_id: string): (types.Item?, error?)
    local rows, err = db:query("SELECT * FROM kickside_work_item WHERE board_id = $1 AND item_id = $2", { board_id, item_id })
    if err then return nil, errors.wrap(err, "item read failed") end
    local items, ierr = item_rows(db, rows or {})
    if ierr or not items then return nil, ierr end
    return items[1], nil
end

-- key_of renders the key of the item numbered number on a board holding prefix.
function M.key_of(prefix: string, number: integer): string
    return prefix .. "-" .. number
end

-- parse_key splits a key into its prefix and item number.
function M.parse_key(key: string): (string?, integer?)
    local prefix, digits = key:match("^([A-Z][A-Z0-9]*)%-(%d+)$")
    if not prefix or not digits then return nil, nil end
    return prefix, math.tointeger(tonumber(digits))
end

-- item_by_key resolves a key to its item on any board: the board that claimed the
-- prefix holds the number.
function M.item_by_key(db: storage.Executor, key: string): (types.Item?, error?)
    local prefix, number = M.parse_key(key)
    if not prefix or not number then return nil, nil end
    local rows, err = db:query([[SELECT i.* FROM kickside_work_prefix p JOIN kickside_work_item i ON i.board_id = p.board_id
        WHERE p.prefix = $1 AND i.number = $2]], { prefix, number })
    if err then return nil, errors.wrap(err, "item read failed") end
    local row = rows and rows[1]
    local item: types.Item? = nil
    if row then
        local decoded, derr = item_rows(db, { row })
        if derr or not decoded then return nil, derr end
        item = decoded[1]
    else
        local aliases, aerr = db:query("SELECT to_board_id,to_item_id FROM kickside_work_key_alias WHERE key = $1", { key:upper() })
        if aerr then return nil, aerr end
        if aliases and aliases[1] then
            local decoded, derr = M.item(db, aliases[1].to_board_id :: string, aliases[1].to_item_id :: string)
            if derr then return nil, derr end
            item = decoded
        end
    end
    if not item then return nil, nil end
    local target, err = M.endpoint(db, { board = item.board_id, item = item.item_id })
    if err or not target then return nil, err end
    if target.board == item.board_id and target.item == item.item_id then return item, nil end
    return M.item(db, target.board, target.item)
end

-- endpoint follows retained move aliases without depending on intermediate tombstones.
function M.endpoint(db: storage.Executor, target: types.Target): (types.Target?, error?)
    local current = target
    local seen: { [string]: boolean } = {}
    while true do
        local locator = current.board .. "/" .. current.item
        if seen[locator] then return nil, errors.new({ kind = errors.INTERNAL, message = "key aliases contain a cycle", details = { code = "key_alias_cycle" } }) end
        seen[locator] = true
        local aliases, err = db:query("SELECT to_board_id,to_item_id FROM kickside_work_key_alias WHERE board_id = $1 AND item_id = $2 LIMIT 1", { current.board, current.item })
        if err then return nil, err end
        if not aliases or not aliases[1] then return current, nil end
        current = { board = aliases[1].to_board_id :: string, item = aliases[1].to_item_id :: string }
    end
end

-- prefixes lists the prefixes a board holds.
function M.prefixes(db: storage.Executor, board_id: string): ({ string }?, error?)
    local rows, err = db:query("SELECT prefix FROM kickside_work_prefix WHERE board_id = $1 ORDER BY prefix", { board_id })
    if err then return nil, errors.wrap(err, "prefix read failed") end
    local out: { string } = {}
    for _, r in ipairs(rows or {}) do
        local prefix, decode_err = need(r, "prefix")
        if decode_err or prefix == nil then return nil, decode_err end

        out[#out + 1] = prefix
    end
    return out, nil
end

-- items reads the given items of a board, one statement per chunk.
function M.items(db: storage.Executor, board_id: string, ids: { string }): ({ types.Item }?, error?)
    local out: { types.Item } = {}
    local per = 10000
    for first = 1, #ids, per do
        local params: types.SqlParams = { board_id }
        local marks: { string } = {}
        for i = first, math.min(first + per - 1, #ids) do
            params[#params + 1] = ids[i]
            marks[#marks + 1] = "$" .. #params
        end
        local rows, err = db:query("SELECT * FROM kickside_work_item WHERE board_id = $1 AND item_id IN (" .. table.concat(marks, ", ") .. ")", params)
        if err then return nil, errors.wrap(err, "item read failed") end
        local items, ierr = item_rows(db, rows or {})
        if ierr then return nil, ierr end
        for _, item in ipairs(items or {}) do out[#out + 1] = item end
    end
    return out, nil
end

-- load returns an item through cache, reading and caching it on a miss.
function M.load(db: storage.Executor, board_id: string, cache: { [string]: types.Item }, item_id: string): (types.Item?, error?)
    local cached = cache[item_id]
    if cached then return cached, nil end
    local item, err = M.item(db, board_id, item_id)
    if err or not item then return nil, err end
    cache[item_id] = item
    return item, nil
end

function M.children(db: storage.Executor, board_id: string, parent_id: string, limit: integer): ({ types.Item }?, error?)
    local rows, err = db:query("SELECT * FROM kickside_work_item WHERE board_id = $1 AND parent_id = $2 ORDER BY rank, item_id LIMIT $3",
        { board_id, parent_id, limit })
    if err then return nil, errors.wrap(err, "children read failed") end
    return item_rows(db, rows or {})
end

local comment_row = codec.comment

function M.comment(db: storage.Executor, board_id: string, comment_id: string): (types.CommentRow?, error?)
    local rows, err = db:query("SELECT * FROM kickside_work_comment WHERE board_id = $1 AND comment_id = $2", { board_id, comment_id })
    if err then return nil, errors.wrap(err, "comment read failed") end
    local row = rows and rows[1]
    if not row then return nil, nil end
    return comment_row(row)
end

-- comments lists an item's live comments, oldest first.
function M.comments(db: storage.Executor, board_id: string, item_id: string, limit: integer, offset: integer?): ({ types.CommentRow }?, error?)
    local rows, err = db:query([[SELECT * FROM kickside_work_comment WHERE board_id = $1 AND item_id = $2 AND deleted = 0
        ORDER BY created_at, comment_id LIMIT $3 OFFSET $4]], { board_id, item_id, limit, offset or 0 })
    if err then return nil, errors.wrap(err, "comment read failed") end
    local out: { types.CommentRow } = {}
    for _, row in ipairs(rows or {}) do
        local comment, derr = comment_row(row)
        if derr or not comment then return nil, derr end
        out[#out + 1] = comment
    end
    return out, nil
end

-- intervals lists the periods an item held values of one interval field ("state", "category" or a field id),
-- or of every field when interval is nil, oldest first.
function M.intervals(db: storage.Executor, board_id: string, item_id: string, interval: string?, limit: integer, after: integer?): ({ types.IntervalRow }?, error?)
    local params: types.SqlParams = { board_id, item_id }
    local where = "board_id = $1 AND item_id = $2"
    if interval then
        params[3] = interval
        where = where .. " AND field_id = $3"
    end
    if after ~= nil then
        params[#params + 1] = after
        where = where .. " AND start_seq > $" .. #params
    end
    params[#params + 1] = limit
    local rows, err = db:query("SELECT * FROM kickside_work_interval WHERE " .. where .. " ORDER BY start_seq, field_id LIMIT $" .. #params, params)
    if err then return nil, errors.wrap(err, "interval read failed") end
    local out: { types.IntervalRow } = {}
    for _, r in ipairs(rows or {}) do
        local started_at, decode_err = need(r, "started_at")
        if decode_err or started_at == nil then return nil, decode_err end

        local value_key, decode_err = need(r, "value_key")
        if decode_err or value_key == nil then return nil, decode_err end

        local start_seq, decode_err = need_int(r, "start_seq")
        if decode_err or start_seq == nil then return nil, decode_err end

        local field_id, decode_err = need(r, "field_id")
        if decode_err or field_id == nil then return nil, decode_err end

        out[#out + 1] = { field_id = field_id, start_seq = start_seq, value_key = value_key,
            started_at = started_at, ended_at = text(r.ended_at) }
    end
    return out, nil
end

function M.interval_totals(db: storage.Executor, board_id: string, item_id: string, interval: string, now: string, dialect: string): ({ [string]: integer }?, error?)
    local function seconds(column: string): string
        if dialect == sql.type.POSTGRES then return "CAST(EXTRACT(EPOCH FROM CAST(substr(" .. column .. ", 1, 19) || 'Z' AS timestamptz)) AS bigint)" end
        return "CAST(strftime('%s', substr(" .. column .. ", 1, 19) || 'Z') AS bigint)"
    end
    local function fraction(column: string): string
        return "CASE WHEN substr(" .. column .. ",20,1) = '.' THEN CAST(substr(" .. column .. ",21,9) AS bigint) ELSE 0 END"
    end
    local diff = "(" .. fraction("finished") .. " - " .. fraction("started_at") .. ")"
    local remainder = "((" .. diff .. " % 1000000 + 1000000) % 1000000)"
    local duration = "((" .. seconds("finished") .. " - " .. seconds("started_at") .. ") * 1000 + (" .. diff .. " - " .. remainder .. ") / 1000000)"
    local rows, err = db:query("SELECT value_key, SUM(CASE WHEN " .. duration .. " < 0 THEN 0 ELSE " .. duration .. " END) AS duration FROM "
        .. "(SELECT value_key, started_at, COALESCE(ended_at, CAST($1 AS text)) AS finished FROM kickside_work_interval WHERE board_id = $2 AND item_id = $3 AND field_id = $4) periods GROUP BY value_key", { now, board_id, item_id, interval })
    if err then return nil, err end
    local out: { [string]: integer } = {}
    for _, row in ipairs(rows or {}) do
        local duration, decode_err = need_int(row, "duration")
        if decode_err or duration == nil then return nil, decode_err end

        local value_key, decode_err = need(row, "value_key")
        if decode_err or value_key == nil then return nil, decode_err end

        out[value_key] = duration
    end
    return out, nil
end

-- parked_migration answers the job id and error of the board's migration job that failed and waits to be woken.
function M.parked_migration(db: storage.Executor, board_id: string): ({ job_id: string, error: string }?, error?)
    local rows, err = db:query("SELECT job_id, error FROM kickside_work_job WHERE board_id = $1 AND job_type = 'migration' AND status = 'failed' ORDER BY job_id LIMIT 1", { board_id })
    if err then return nil, errors.wrap(err, "migration job read failed") end
    local row: types.Row? = rows and rows[1]
    if not row then return nil, nil end
    local job_id, decode_err = need(row, "job_id")
    if decode_err or job_id == nil then return nil, decode_err end

    return { job_id = job_id, error = text(row.error) or "" }, nil
end

local function count(db: storage.Executor, statement: string, params: types.SqlParams): (integer?, error?)
    local rows, err = db:query(statement, params)
    if err then return nil, err end
    local row: types.Row? = rows and rows[1]
    if not row then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "count returned no row" }) end
    local count, decode_err = need_int(row, "n")
    if decode_err or count == nil then return nil, decode_err end

    return count, nil
end

M.count = count

local function state_rows(dialect: string): string
    local regions = dialect == sql.type.POSTGRES
        and "kickside_work_item i CROSS JOIN LATERAL jsonb_each_text(i.process_data::jsonb -> 'regions') r"
        or "kickside_work_item i, json_each(i.process_data, '$.regions') r"
    return [[SELECT type, state, item_id, life FROM kickside_work_item WHERE board_id = $1 UNION ALL
        SELECT i.type, r.value AS state, i.item_id, i.life FROM ]] .. regions .. [[ WHERE i.board_id = $1]]
end

function M.state_count(db: storage.Executor, board_id: string, state: string, dialect: string): (integer?, error?)
    return count(db, "SELECT COUNT(DISTINCT item_id) AS n FROM (" .. state_rows(dialect) .. ") held WHERE state = $2 AND life = 'live'", { board_id, state })
end

-- usage counts what a board holds, which decides whether a schema change reinterprets stored data.
function M.usage(db: sql.DB, board_id: string): (types.Usage?, error?)
    local usage: types.Usage = { fields = {}, items = 0, types = {}, links = {}, states = {} }
    local total, terr = count(db, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { board_id })
    if terr or not total then return nil, terr end
    usage.items = total
    local by_field, ferr = db:query("SELECT field_id, items FROM kickside_work_field_usage WHERE board_id = $1", { board_id })
    if ferr then return nil, errors.wrap(ferr, "field usage read failed") end
    for _, r in ipairs(by_field or {}) do
        local items, decode_err = need_int(r, "items")
        if decode_err or items == nil then return nil, decode_err end

        local field_id, decode_err = need_int(r, "field_id")
        if decode_err or field_id == nil then return nil, decode_err end

        usage.fields[field_id] = items
    end
    local by_type, berr = db:query("SELECT type, COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 GROUP BY type", { board_id })
    if berr then return nil, errors.wrap(berr, "usage read failed") end
    for _, r in ipairs(by_type or {}) do
        local count, decode_err = need_int(r, "n")
        if decode_err or count == nil then return nil, decode_err end

        local type_id, decode_err = need(r, "type")
        if decode_err or type_id == nil then return nil, decode_err end

        usage.types[type_id] = count
    end
    local by_state, serr = db:query("SELECT type, state, COUNT(DISTINCT item_id) AS n FROM (" .. state_rows(db:type()) .. ") held GROUP BY type, state", { board_id })
    if serr then return nil, errors.wrap(serr, "usage read failed") end
    for _, r in ipairs(by_state or {}) do
        local type_id, decode_err = need(r, "type")
        if decode_err or type_id == nil then return nil, decode_err end

        usage.states[type_id] = usage.states[type_id] or {}
        local count, decode_err = need_int(r, "n")
        if decode_err or count == nil then return nil, decode_err end

        local state, decode_err = need(r, "state")
        if decode_err or state == nil then return nil, decode_err end

        usage.states[type_id][state] = count
    end
    local by_link, lerr = db:query("SELECT type, COUNT(*) AS n FROM kickside_work_link WHERE board_id = $1 GROUP BY type", { board_id })
    if lerr then return nil, errors.wrap(lerr, "usage read failed") end
    for _, r in ipairs(by_link or {}) do
        local count, decode_err = need_int(r, "n")
        if decode_err or count == nil then return nil, decode_err end

        local type_id, decode_err = need(r, "type")
        if decode_err or type_id == nil then return nil, decode_err end

        usage.links[type_id] = count
    end
    return usage, nil
end

function M.read_snapshot(tx: sql.Transaction, timeout: boolean?): error?
    local _, err = tx:execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY", {})
    if err or not timeout then return err end
    local _, terr = tx:execute("SET LOCAL statement_timeout = '2s'", {})
    return terr
end

return M
