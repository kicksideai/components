-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema commands: plan a declaration against the board, apply it as the next generation (claiming key prefixes
-- on the registry) and wake a parked follow migration. All need ADMIN on the board.
local jobs = require("jobs")
local sql = require("sql")
local consts = require("consts")
local clock = require("clock")
local store = require("store")
local threads = require("threads")
local append = require("append")
local registry = require("registry")
local rollup_rows = require("rollup_rows")
local schema = require("schema")
local declaration = require("declaration")
local changes = require("changes")
local guard = require("guard")
local receipts = require("receipts")
local domain = require("domain")
local types = require("types")

local defaults = require("defaults")
local hash = require("hash")
local plugin_rows = require("plugin_rows")
local plugins = require("plugins")
local plugin_schema = require("plugin_schema")
local fields = require("fields")
local layout = require("layout")
local M = {}

local EV = consts.EVENTS

-- Initial pack admission uses the same snapshot as its schema head expectation.
function M.check_pack_install(db: sql.DB, board_id: string, board: domain.Board?): error?
    if board and board.pack then return nil end
    local count, err = store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND life <> 'purged'", { board_id })
    if err then return err end
    if (count or 0) > 0 then
        return errors.new({ kind = errors.INVALID, message = "pack installation requires an empty unprovenanced board",
            details = { code = "pack_requires_empty_board" } })
    end
    return nil
end

-- migrating reports whether the generation changes the definition of a follow process the board already ran.
local function migrating(board: domain.Board?, compiled: domain.Compiled, generation: integer): boolean
    if not board then return false end
    for _, p in ipairs(compiled.processes) do
        if p.migration == "follow" and p.generation == generation and board.model.processes[p.id] then return true end
    end
    return false
end

-- current_schema reads the generation and declaration from one planning snapshot.
function M.current_schema(db: sql.DB, board_id: string, expected_generation: integer?): (types.SchemaSnapshot?, error?)
    local board, err = store.board(db, board_id)
    if err then return nil, err end
    local generation = board and board.generation or 0
    if expected_generation ~= nil and expected_generation ~= generation then
        return nil, errors.new({ kind = errors.CONFLICT, message = "schema generation changed", details = { code = "generation_changed", generation = generation } })
    end
    local previous: domain.Declaration? = nil
    if board then
        local row, rerr = store.generation(db, board_id, generation)
        if rerr then return nil, rerr end
        if not row then return nil, errors.new({ kind = errors.INTERNAL, message = "board has no current declaration", details = { code = "row_corrupt" } }) end
        previous = row.declaration
    end
    return { board = board, declaration = previous }, nil
end

-- plan_schema compiles and classifies a declaration against the board state at
-- the command head; plan_schema returns it, apply_schema appends it.
local function plan_schema(db: sql.DB, snapshot: types.SchemaSnapshot, board_id: string, request: types.SchemaRequest, frozen: types.SchemaPlan?): (types.SchemaPlan?, error?)
    local board, previous = snapshot.board, snapshot.declaration
    local generation = board and board.generation or 0
    if request.pack then
        local admission_err = M.check_pack_install(db, board_id, board)
        if admission_err then return nil, admission_err end
    end
    local effective: domain.Declaration
    local compiled: domain.Compiled
    if frozen then
        effective, compiled = declaration.copy(frozen.declaration), declaration.copy(frozen.compiled)
    else
        local claim_err = plugin_schema.check_claims(request.declaration, board and board.compiled)
        if claim_err then return nil, claim_err end
        local merged, merr = declaration.merge(previous, request.declaration)
        effective = merged :: domain.Declaration
        if merr or not merged then return nil, merr end
        local configured, config_err = plugin_rows.list(db, board_id)
        if config_err then return nil, config_err end
        local configs: { [string]: domain.JsonObject } = {}
        local active: { [string]: boolean } = {}
        local listed: { [string]: boolean } = {}
        for _, entry in ipairs(effective.plugins or {}) do listed[entry.use] = true end
        for _, row in ipairs(configured or {}) do
            if row.active then configs[row.plugin] = row.config; active[row.plugin] = true end
        end
        for id, config in pairs(request.plugin_configs or {}) do
            if not listed[id] then return nil, guard.invalid("initial configuration names an unlisted plugin", { code = "plugin_unlisted" }) end
            if active[id] then return nil, guard.invalid("active plugin configuration changes through its attachment", { code = "plugin_config_requires_attachment" }) end
            configs[id] = config
        end
        if request.declaration.plugins ~= nil then
            local resolved, err = plugins.compile(effective.plugins, configs, board_id, previous and previous.plugins)
            if err then return nil, err end
            effective.plugins = resolved
            for _, plugin in ipairs(effective.plugins or {}) do plugin.attachment_kind = nil end
        end
        local removal_err = plugin_schema.check_removal(effective, board and board.compiled)
        if removal_err then return nil, removal_err end
        local composed, owners, compose_err = plugin_schema.compose(effective, board and board.compiled)
        if compose_err or not composed or not owners then return nil, compose_err end
        local settings, setting_err = defaults.read()
        if setting_err or not settings then return nil, setting_err end
        local built, cerr = schema.compile(board and board.compiled or nil, composed, generation + 1, configs, settings :: domain.JsonObject)
        if cerr or not built then return nil, cerr end
        compiled = built
        plugin_schema.stamp(compiled, owners)
        for _, plugin in ipairs(compiled.plugins or {}) do
            local previous_plugin: domain.PluginDecl? = nil
            for _, old in ipairs(board and board.compiled.plugins or {}) do if old.use == plugin.use then previous_plugin = old end end
            if previous_plugin then plugin.attachment_id = previous_plugin.attachment_id
            else
                local digest = tostring(hash.sha256(board_id .. "\0" .. plugin.use .. "\0" .. (generation + 1)))
                plugin.attachment_id = digest:sub(1, 8) .. "-" .. digest:sub(9, 12) .. "-5" .. digest:sub(14, 16) .. "-8" .. digest:sub(18, 20) .. "-" .. digest:sub(21, 32)
            end
        end
    end
    local limit_err = rollup_rows.check(db, board_id, compiled)
    if limit_err then return nil, limit_err end
    declaration.stamp(effective, compiled)
    local digest = schema.digest(compiled)
    if board and board.digest == digest and request.pack == nil then
        return { generation = generation, class = "unchanged", changes = {}, refused = {}, declaration = effective,
            compiled = compiled, digest = digest, unchanged = true, claim = false, migrates = false, maps = {} }, nil
    end
    local usage: domain.Usage = { fields = {}, items = 0, types = {}, links = {}, states = {} }
    if board then
        local loaded, uerr = store.usage(db, board_id)
        if uerr or not loaded then return nil, uerr end
        usage = loaded
    end
    local claim: boolean = false
    if not board or board.key_prefix ~= compiled.key_prefix then
        local held, herr = store.prefixes(db, board_id)
        if herr or not held then return nil, herr end
        claim = true
        for _, prefix in ipairs(held) do
            if prefix == compiled.key_prefix then claim = false end
        end
    end
    local maps: { [string]: { [string]: string } } = {}
    for _, p in ipairs(request.declaration.processes or {}) do maps[p.id] = p.map or {} end
    local delta = changes.changes(board and board.compiled or nil, compiled, usage, maps)
    local refused: { domain.SchemaChange } = {}
    for _, c in ipairs(delta) do
        if c.class == "refused" then refused[#refused + 1] = c end
    end
    local affected = board and layout.unbuilt(board.compiled, compiled) or {}
    if board and #refused == 0 and #affected > 0 then
        local selected: { domain.Field } = {}
        for _, field in ipairs(compiled.fields) do
            for _, code in ipairs(affected) do if field.code == code then selected[#selected + 1] = field end end
        end
        local representation = { fields = selected } :: domain.Compiled
        local until_at = clock.deadline(consts.LIMITS.command_deadline_ms)
        local after = ""
        while true do
            if clock.passed(until_at) then return nil, errors.new({ kind = errors.TIMEOUT, message = "schema validation deadline passed", details = { code = "schema_validation_deadline" } }) end
            local rows, err = db:query("SELECT item_id FROM kickside_work_item WHERE board_id = $1 AND item_id > $2 AND life <> 'purged' ORDER BY item_id LIMIT 200", { board_id, after })
            if err then return nil, err end
            if not rows or #rows == 0 then break end
            local ids: { string } = {}
            for _, row in ipairs(rows) do
                local decoded_1, decode_err = store.need(row, "item_id")
                if decode_err then return nil, decode_err end
                local decoded_1 = decoded_1 :: string
                ids[#ids + 1] = decoded_1
            end
            local items, ierr = store.items(db, board_id, ids)
            if ierr then return nil, ierr end
            for _, item in ipairs(items or {}) do
                if clock.passed(until_at) then return nil, errors.new({ kind = errors.TIMEOUT, message = "schema validation deadline passed", details = { code = "schema_validation_deadline" } }) end
                local _, verr = fields.document(representation, item.document)
                if verr then return nil, verr end
            end
            after = ids[#ids]
        end
    end
    return { generation = generation + 1, class = #refused > 0 and "refused" or changes.classify(board and board.compiled or nil, delta), changes = delta,
        refused = refused, declaration = effective, compiled = compiled, digest = digest, unchanged = false, claim = claim,
        maps = maps, migrates = usage.items > 0 and migrating(board, compiled, generation + 1) }, nil
end

local MIGRATION = "add the new field or option, copy the values with apply commands, then remove the old one"
local STATE_MIGRATION = "declare map: { removed_state: new_state } on the process; its items follow at apply"

-- migration_hint names the way out of the refused changes: a state map when only states are removed.
local function migration_hint(refused: { domain.SchemaChange }): string
    for _, c in ipairs(refused) do
        if c.what ~= "state.remove" then return MIGRATION end
    end
    return STATE_MIGRATION
end

-- plan_schema(request) classifies a declaration without applying it. Needs ADMIN.
function M.prepare_schema(request: types.SchemaRequest, snapshot: types.SchemaSnapshot?): (types.SchemaPlan?, error?)
    local access_err = guard.require_access(request.board_id, guard.admin_access())
    if access_err then return nil, access_err end
    local db, err = store.open()
    if not db then return nil, err end
    local berr: error?
    if not snapshot then snapshot, berr = M.current_schema(db, request.board_id, request.expected_generation) end
    local plan: types.SchemaPlan?
    local perr: error?
    if not berr and snapshot then plan, perr = plan_schema(db, snapshot, request.board_id, request) end
    db:release()
    if berr or perr or not plan then return nil, berr or perr end
    return plan, nil
end

function M.describe(plan: types.SchemaPlan): types.SchemaPlanResult
    return { generation = plan.generation, class = plan.class, changes = plan.changes, refused = plan.refused,
        migration = #plan.refused > 0 and migration_hint(plan.refused) or nil }
end

function M.plan_schema(request: types.SchemaRequest, snapshot: types.SchemaSnapshot?): (types.SchemaPlanResult?, error?)
    local plan, err = M.prepare_schema(request, snapshot)
    if err or not plan then return nil, err end
    return M.describe(plan), nil
end

-- apply_schema(request) appends the declaration as the next generation, expecting
-- the thread head. Needs ADMIN.
function M.apply_schema(request: types.SchemaRequest, frozen: types.SchemaPlan?, boundary: domain.Deadline?): (types.SchemaResult?, error?)
    local context, trace_err = receipts.trace(request.trace_context, "work.schema")
    if trace_err then return nil, trace_err end
    request.trace_context = context
    local board_id = request.board_id
    local access_err = guard.require_access(board_id, guard.admin_access())
    if access_err then return nil, access_err end
    local c, cerr = threads.open()
    if not c then return nil, cerr end
    local until_at = clock.deadline(consts.LIMITS.command_deadline_ms)
    if boundary and boundary.ns < until_at.ns then until_at = boundary end
    local marker: string? = nil
    local hashed: string? = nil
    if request.key ~= nil then
        if request.key == "" then return nil, guard.invalid("key must not be empty") end
        marker = "schema/" .. request.key
        hashed = receipts.request_hash({ op = "schema", board_id = board_id, pack = request.pack, declaration = request.declaration, expected_generation = request.expected_generation, source = request.source or "api", origin = request.origin, plugin_configs = request.plugin_configs })
    end
    local function replay(): (types.SchemaResult?, error?)
        if not marker or not hashed then return nil, nil end
        local as_of, cerr = receipts.covered(board_id, until_at)
        if cerr then return nil, cerr end
        local found, ferr = receipts.command(board_id, marker)
        if ferr or not found then return nil, ferr end
        if found.receipt.request_hash ~= hashed then return nil, receipts.conflict_of() end
        local result = found.receipt.result :: types.SchemaResult
        result.seq, result.as_of, result.replayed = found.seq, as_of, true
        return result, nil
    end
    while not clock.passed(until_at) do
        local stored, rerr = replay()
        if rerr or stored then return stored, rerr end
        local last_seq, cu_err = receipts.covered(board_id, until_at)
        if cu_err or not last_seq then return nil, cu_err end
        local db, derr = store.open()
        if not db then return nil, derr end
        local snapshot, berr = M.current_schema(db, board_id, request.expected_generation)
        local board = snapshot and snapshot.board
        local plan: types.SchemaPlan?
        local perr: error?
        local head = 0
        if not berr and snapshot then
            head = math.max(board and board.applied_seq or 0, last_seq)
            plan, perr = plan_schema(db, snapshot, board_id, request, frozen)
        end
        db:release()
        local stored, rerr = replay()
        if rerr or stored then return stored, rerr end
        if berr then return nil, berr end
        if perr or not plan then return nil, perr end
        if plan.unchanged and not marker then
            return { generation = plan.generation, class = "unchanged", changes = {}, as_of = head }, nil
        end
        if #plan.refused > 0 then
            return nil, guard.invalid("schema change reinterprets stored values", { code = "migration_required",
                changes = plan.refused :: { domain.JsonObject }, migration = migration_hint(plan.refused) })
        end
        local result: types.SchemaResult = { generation = plan.generation, class = plan.class, changes = plan.changes }
        local claim: types.Write? = nil
        local claim_version: integer? = nil
        if plan.claim then
            local kerr: error?
            claim, kerr = registry.claim(c, plan.compiled.key_prefix, board_id, guard.actor_id(), guard.stamp_now(), request.trace_context)
            if kerr or not claim then return nil, kerr end
            claim_version = (claim.expect_version :: integer) + 1
        end
        local event: domain.Event = { type = EV.SCHEMA_APPLIED, subject = "schema", body = { generation = plan.generation,
            pack = request.pack, plugin_configs = request.plugin_configs, declaration = plan.declaration, compiled = plan.compiled, digest = plan.digest, class = plan.class, changes = plan.changes,
            claim_version = claim_version, migrates = plan.migrates or nil, maps = plan.maps } }
        receipts.decorate(event, guard.actor_id(), guard.stamp_now(), request.source or "api", request.origin, request.trace_context)
        if marker and hashed then
            event.body.command_key = marker
            receipts.mark({ event }, marker, { request_hash = hashed, result = result :: domain.JsonObject })
        end
        local write: types.Write = { group = "schema", events = { event }, ops = {}, expect_head = head, caller_expect = false }
        local writes: { types.Write } = plan.unchanged and {} or { write }
        if marker and hashed and plan.unchanged then
            local receipt = receipts.claim(board_id, marker, hashed, result :: domain.JsonObject, head)
            receipt.expect_head = head
            receipts.decorate(receipt.events[1], guard.actor_id(), guard.stamp_now(), request.source or "api", request.origin, request.trace_context)
            table.insert(writes, 1, receipt)
        end
        if claim then table.insert(writes, 1, claim) end
        local max_seq, aerr = append.writes(c, board_id, writes)
        if aerr then
            local stored, rerr = replay()
            if rerr or stored then return stored, rerr end
            if plan.claim and threads.mismatch(aerr, "version_mismatch") then return nil, registry.taken(plan.compiled.key_prefix) end
            if not threads.mismatch(aerr, "head_mismatch") and not threads.mismatch(aerr, "version_mismatch") then return nil, errors.wrap(aerr, "board append failed") end
        else
            local stored, rerr = replay()
            if rerr then return nil, rerr end
            if stored then stored.replayed = nil; return stored, nil end
            local as_of, done_err = receipts.covered(board_id, until_at)
            if done_err or not as_of then return nil, done_err end
            result.seq = max_seq
            result.as_of = as_of
            return result, nil
        end
    end
    return nil, guard.busy()
end

-- resume_migration(request) wakes the board's parked follow migration so it continues from where it stopped. Needs ADMIN.
function M.resume_migration(request: types.ResumeMigrationRequest): (types.ResumeMigrationResult?, error?)
    local board_id = request.board_id
    local access_err = guard.require_access(board_id, guard.admin_access())
    if access_err then return nil, access_err end
    local db, derr = store.open()
    if not db then return nil, derr end
    local parked, perr = store.parked_migration(db, board_id)
    db:release()
    if perr then return nil, perr end
    if not parked then return nil, guard.invalid("board has no parked migration", { code = "no_parked_migration" }) end
    local woken, werr = jobs.wake_job(parked.job_id, { control = true })
    if werr or not woken then return nil, errors.wrap(werr or errors.new({ kind = errors.INTERNAL, retryable = false, message = "operation returned no result", details = { code = "internal" } }), "migration wake failed") end
    return { resumed = woken.woken == true, job_id = parked.job_id }, nil
end

return M
