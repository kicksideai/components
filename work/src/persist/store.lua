-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- types.Row access over the fixed work tables, shared by the projection, the commands and the reads.
local registry = require("registry")
local sql = require("sql")
local time = require("time")
local consts = require("consts")
local schema = require("schema")
local tables = require("tables")
local types = require("types")
local values = require("values")

local limits = require("limits")
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
local read_rows = require("read_rows")
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
    if version_err or schema_version == nil then return nil, version_err end
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

function M.process(db: storage.Executor, board: types.Board, item: { type: string, process_generation: integer }): (types.Process?, error?, types.Model?)
    local model, err = M.process_model(db, board, item)
    if err or not model then return nil, err end
    return model.processes[model.item_types[item.type].process], nil, model
end

local function item_rows(rows: { types.Row }): ({ types.Item }?, error?)
    local items: { types.Item } = {}
    for _, row in ipairs(rows) do
        local item, err = codec.item(row)
        if err or not item then return nil, err end
        items[#items + 1] = item
    end
    return items, nil
end

function M.item(db: storage.Executor, board_id: string, item_id: string): (types.Item?, error?)
    local rows, err = db:query("SELECT * FROM kickside_work_item WHERE board_id = $1 AND item_id = $2", { board_id, item_id })
    if err then return nil, errors.wrap(err, "item read failed") end
    local items, ierr = item_rows(rows or {})
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

-- Scope the key's origin before following its move aliases to the current item.
function M.item_by_key(db: storage.Executor, key: string, board_id: string?): (types.Item?, error?)
    local prefix, number = M.parse_key(key)
    if not prefix or not number then return nil, nil end
    local params: types.SqlParams = { prefix, number }
    if board_id then params[3] = board_id end
    local rows, err = db:query([[SELECT i.* FROM kickside_work_prefix p JOIN kickside_work_item i ON i.board_id = p.board_id
        WHERE p.prefix = $1 AND i.number = $2]] .. (board_id and " AND p.board_id = $3" or ""), params)
    if err then return nil, errors.wrap(err, "item read failed") end
    local row = rows and rows[1]
    local item: types.Item? = nil
    if row then
        local decoded, derr = item_rows({ row })
        if derr or not decoded then return nil, derr end
        item = decoded[1]
    else
        local params: types.SqlParams = { key:upper() }
        if board_id then params[2] = board_id end
        local aliases, aerr = db:query("SELECT to_board_id,to_item_id FROM kickside_work_key_alias WHERE key = $1"
            .. (board_id and " AND board_id = $2" or ""), params)
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
local MAX_ALIAS_HOPS = 32

function M.endpoint(db: storage.Executor, target: types.Target): (types.Target?, error?)
    local current = target
    local seen: { [string]: boolean } = {}
    for _ = 0, MAX_ALIAS_HOPS do
        local locator = current.board .. "/" .. current.item
        if seen[locator] then return nil, errors.new({ kind = errors.INTERNAL, message = "key aliases contain a cycle", details = { code = "key_alias_cycle" } }) end
        seen[locator] = true
        local aliases, err = db:query([[SELECT to_board_id,to_item_id FROM kickside_work_key_alias
            WHERE board_id = $1 AND item_id = $2 ORDER BY key LIMIT 1]], { current.board, current.item })
        if err then return nil, err end
        if not aliases or not aliases[1] then return current, nil end
        current = { board = aliases[1].to_board_id :: string, item = aliases[1].to_item_id :: string }
    end
    return nil, errors.new({ kind = errors.CONFLICT, message = "move alias chain exceeds " .. MAX_ALIAS_HOPS .. " redirects",
        details = { code = "key_alias_hop_limit" } })
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
    local settings,settings_err=limits.read()
    if settings_err or not settings then return nil,settings_err end
    local per = settings.storage_batch
    for first = 1, #ids, per do
        local params: types.SqlParams = { board_id }
        local marks: { string } = {}
        for i = first, math.min(first + per - 1, #ids) do
            params[#params + 1] = ids[i]
            marks[#marks + 1] = "$" .. #params
        end
        local rows, err = db:query("SELECT * FROM kickside_work_item WHERE board_id = $1 AND item_id IN (" .. table.concat(marks, ", ") .. ")", params)
        if err then return nil, errors.wrap(err, "item read failed") end
        local items, ierr = item_rows(rows or {})
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
    return item_rows(rows or {})
end

M.comment, M.comments = read_rows.comment, read_rows.comments

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

function M.state_count(db: storage.Executor, board_id: string, state: string, maximum: integer): (integer?, error?)
    if maximum <= 0 then return 0, nil end
    local names = tables.names(board_id)
    return count(db, "SELECT (SELECT COUNT(*) FROM (SELECT 1 FROM " .. names.item
        .. " WHERE life = 'live' AND state = $1 ORDER BY item_id LIMIT $2) root)"
        .. " + (SELECT COUNT(*) FROM (SELECT 1 FROM " .. names.set
        .. " WHERE col = $3 ORDER BY value_key, item_id LIMIT $2) regional) AS n",
        { state, maximum, tables.region_column("live", state) })
end

function M.exceeds_wip(db: storage.Executor, board_id: string, state: string, limit: integer, delta: integer): (boolean, error?)
    local count, err = M.state_count(db, board_id, state, limit - delta + 1)
    if err or count == nil then return false, err end
    return count + delta > limit, nil
end

function M.field_usage(db: storage.Executor, board_id: string): ({ [integer]: integer }?, error?)
    local usage: { [integer]: integer } = {}
    local rows, err = db:query("SELECT field_id, items FROM kickside_work_field_usage WHERE board_id = $1", { board_id })
    if err then return nil, errors.wrap(err, "field usage read failed") end
    for _, row in ipairs(rows or {}) do
        local items, ierr = need_int(row, "items")
        if ierr or items == nil then return nil, ierr end
        local field_id, ferr = need_int(row, "field_id")
        if ferr or field_id == nil then return nil, ferr end
        usage[field_id] = items
    end
    return usage, nil
end

function M.has_items(db: storage.Executor, board_id: string): (boolean, error?)
    local rows, err = db:query("SELECT 1 FROM " .. tables.names(board_id).item .. " ORDER BY item_id LIMIT 1", {})
    return rows ~= nil and #rows > 0, err
end

local function state_usage(db: storage.Executor, names: types.GeneratedNames, targets: { types.StateUsageTarget },
    usage: { [string]: { [string]: integer } }): error?
    if #targets == 0 then return nil end
    local tuples: { string } = {}
    local params: types.SqlParams = {}
    for i, target in ipairs(targets) do
        local before = #params
        params[before + 1] = target.item_type
        params[before + 2] = target.state
        params[before + 3] = tables.region_column("live", target.state)
        params[before + 4] = tables.region_column("trashed", target.state)
        tuples[i] = string.format("($%d, $%d, $%d, $%d)", before + 1, before + 2, before + 3, before + 4)
    end
    -- Index order keeps exact counts on the matching range even for common states.
    local rows, err = db:query("WITH affected(item_type, state, live_col, trashed_col) AS (VALUES " .. table.concat(tuples, ", ")
        .. ") SELECT a.item_type, a.state, (SELECT COUNT(*) FROM (SELECT 1 FROM " .. names.item
        .. " WHERE type = a.item_type AND state = a.state ORDER BY item_id) root)"
        .. " + (SELECT COUNT(*) FROM (SELECT 1 FROM " .. names.set
        .. " WHERE col = a.live_col AND value_key = a.item_type ORDER BY item_id) live)"
        .. " + (SELECT COUNT(*) FROM (SELECT 1 FROM " .. names.set
        .. " WHERE col = a.trashed_col AND value_key = a.item_type ORDER BY item_id) trashed) AS n FROM affected a", params)
    if err then return errors.wrap(err, "state usage read failed") end
    for _, row in ipairs(rows or {}) do
        local item_type, terr = need(row, "item_type")
        if terr or item_type == nil then return terr end
        local state, serr = need(row, "state")
        if serr or state == nil then return serr end
        local n, nerr = need_int(row, "n")
        if nerr or n == nil then return nerr end
        if not usage[item_type] then usage[item_type] = {} end
        usage[item_type][state] = n
    end
    return nil
end

-- Usage checks only the schema members which can affect the proposed change.
function M.usage(db: sql.DB, board_id: string, targets: types.UsageTargets): (types.Usage?, error?)
    local fields, ferr = M.field_usage(db, board_id)
    if ferr or not fields then return nil, ferr end
    local occupied, oerr = M.has_items(db, board_id)
    if oerr then return nil, oerr end
    local usage: types.Usage = { fields = fields, items = occupied and 1 or 0, types = {}, links = {}, states = {} }
    local names = tables.names(board_id)
    for _, id in ipairs(targets.item_types) do
        local rows, err = db:query("SELECT 1 FROM " .. names.item .. " WHERE type = $1 ORDER BY state, item_id LIMIT 1", { id })
        if err then return nil, err end
        if rows and #rows > 0 then usage.types[id] = 1 end
    end
    for _, id in ipairs(targets.links) do
        local rows, err = db:query([[SELECT 1 FROM kickside_work_link WHERE board_id = $1 AND type = $2 ORDER BY from_id LIMIT 1]], { board_id, id })
        if err then return nil, err end
        if rows and #rows > 0 then usage.links[id] = 1 end
    end
    local serr = state_usage(db, names, targets.states, usage.states)
    if serr then return nil, serr end
    return usage, nil
end

function M.read_snapshot(tx: sql.Transaction, deadline: types.Deadline?): error?
    local _, err = tx:execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY", {})
    if err or not deadline then return err end
    local remaining = math.floor((deadline.ns - time.now():unix_nano()) / 1000000)
    if remaining < 1 then return errors.new({kind=errors.TIMEOUT,message="read deadline passed",details={code="read_deadline"}}) end
    local _, terr = tx:execute("SET LOCAL statement_timeout = '" .. remaining .. "ms'", {})
    return terr
end

return M
