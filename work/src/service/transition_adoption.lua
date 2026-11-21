-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local board_store = require("board_store")
local codec = require("codec")
local clock = require("clock")
local commands = require("commands")
local declaration = require("declaration")
local domain = require("domain")
local guard = require("guard")
local limits = require("limits")
local locate = require("locate")
local pack_catalog = require("pack_catalog")
local pack_types = require("pack_types")
local plugin_rows = require("plugin_rows")
local receipts = require("receipts")
local registry = require("registry")
local registry_values = require("registry_values")
local row_decode = require("row_decode")
local rules = require("rules")
local schema = require("schema")
local schema_commands = require("schema_commands")
local sql = require("sql")
local M = {}

type Spec = {
    item_type: string, process: string, transition: string, command: string, plugin: string, fields: { string },
    pack: string, base_digest: string,
}
type Cohort = { generation: integer, life: string, state: string, count: integer }
type Review = {
    board_id: string, selector: string, head: integer, generation: integer,
    selector_digest: string, base_digest: string, installed_digest: string, rule_digest: string,
}
type Result = {
    status: string, cohorts: { Cohort }?, conflict: { path: string, generation: integer? }?,
    review: Review?, token: string?,
}

local function stale(): error
    return errors.new({ kind = errors.CONFLICT, message = "The board or adoption definition changed. Review adoption again.",
        details = { code = "transition_adoption_stale" } })
end

local function invalid(): error
    return guard.invalid("A valid transition adoption request and review are required.", { code = "invalid_transition_adoption" })
end

local function timed_out(): error
    return errors.new({ kind = errors.TIMEOUT, message = "The transition adoption review exceeded its deadline.",
        details = { code = "transition_adoption_deadline" } })
end

local function text(value: unknown): boolean
    return type(value) == "string" and #value > 0 and #value <= 255
end

local function digest(value: unknown): boolean
    return type(value) == "string" and #value == 64 and value:find("[^0-9a-f]") == nil
end

local function load(id: string): (Spec?, error?)
    local entry, err = registry.get(id)
    if err then return nil, err end
    if not entry or entry.kind ~= "registry.entry" or (entry.meta or {}).type ~= "kickside.work.transition_adoption" then return nil, invalid() end
    local data = registry_values.canonical(entry.data) :: domain.Row
    if type(data) ~= "table" or not digest(data.base_digest) or type(data.fields) ~= "table" or #data.fields == 0 then return nil, invalid() end
    for _, name in ipairs({ "item_type", "process", "transition", "command", "plugin", "pack" }) do
        if not text(data[name]) then return nil, invalid() end
    end
    local seen: { [string]: boolean } = {}
    for _, field in ipairs(data.fields :: { string }) do
        if not text(field) or seen[field] then return nil, invalid() end
        seen[field] = true
    end
    local command, err = registry.get(data.command :: string)
    if err then return nil, err end
    if not command or command.kind ~= "function.lua" or (command.meta or {}).type ~= "kickside.work.transition_command" then
        return nil, invalid()
    end
    return data :: Spec, nil
end

local function refusing(path: string, generation: integer?): Result
    return { status = "ineligible", conflict = { path = path, generation = generation } }
end

local function cohorts(db: sql.Transaction, board: domain.Board, spec: Spec, deadline: domain.Deadline): ({ Cohort }?, Result?, error?)
    local rows, err = db:query([[SELECT process_generation, life, state, COUNT(*) AS count
        FROM kickside_work_item WHERE board_id=$1 AND type=$2 AND life IN ('live','trashed')
        GROUP BY process_generation, life, state ORDER BY process_generation, life, state]], { board.board_id, spec.item_type })
    if err then return nil, nil, err end
    if not rows then
        return nil, nil, errors.new({ kind = errors.INTERNAL, message = "transition adoption cohort query returned no rows proof",
            details = { code = "transition_adoption_response" } })
    end
    local out: { Cohort } = table.create(0, 1)
    local checked: { [integer]: { [string]: boolean } } = {}
    for _, row in ipairs(rows) do
        if clock.passed(deadline) then return nil, nil, timed_out() end
        local record, err = row_decode.object(row, { "life", "state" }, { "process_generation", "count" }, {})
        if err or not record then return nil, nil, err end
        local generation = record.process_generation :: integer
        local states = checked[generation]
        if not states then
            local stored, err = board_store.generation(db, board.board_id, generation)
            if err then return nil, nil, err end
            if not stored then return nil, refusing("process_generation", generation), nil end
            local path = rules.diff(board.compiled, stored.compiled, spec, true)
            if path then return nil, refusing(path, generation), nil end
            states = {}
            for _, definition in ipairs(stored.compiled.processes) do
                if definition.id == spec.process then
                    for _, state in ipairs(definition.states) do states[state.id] = true end
                    break
                end
            end
            checked[generation] = states
        end
        if not states[record.state :: string] then return nil, refusing("state", generation), nil end
        out[#out + 1] = { generation = generation, life = record.life :: string, state = record.state :: string, count = record.count :: integer }
    end
    return out, nil, nil
end

local function context(board_id: string): string
    return "work/transition-adoption/" .. board_id .. "/" .. guard.actor_id()
end

local function inspect(db: sql.Transaction, board: domain.Board, id: string, spec: Spec, installed: string, head: integer,
    deadline: domain.Deadline): (Result?, error?)
    local key = rules.key(spec.item_type, spec.transition)
    local rule = board.compiled.transition_rules and board.compiled.transition_rules[key]
    if rule and rule.command == spec.command and rule.process == spec.process then return { status = "already_adopted" }, nil end
    if rule then return refusing("transition_rules." .. key), nil end
    local attachment, err = plugin_rows.active(db, board.board_id, spec.plugin)
    if err then return nil, err end
    if not attachment then return refusing("plugins." .. spec.plugin), nil end
    if board.pack ~= spec.pack or not board.pack_base or board.pack_digest ~= spec.base_digest
        or receipts.request_hash(board.pack_base) ~= spec.base_digest then
        return refusing("pack.base"), nil
    end
    local base = pack_catalog.declaration(board.pack_base :: pack_types.Data)
    base.key_prefix = board.key_prefix
    local baseline, err = schema.compile(nil, base, 1)
    if err or not baseline then return nil, err end
    local path = rules.diff(baseline, board.compiled, spec, false)
    if path then return refusing(path, board.generation), nil end
    local groups, refused, err = cohorts(db, board, spec, deadline)
    if err then return nil, err end
    if refused then return refused, nil end
    local rule_digest, path = rules.digest(board.compiled, spec)
    if not rule_digest then return refusing(path or "processes." .. spec.process, board.generation), nil end
    local review: Review = { board_id = board.board_id, selector = id, head = math.max(head, board.applied_seq),
        generation = board.generation, selector_digest = receipts.request_hash(spec), base_digest = spec.base_digest,
        installed_digest = installed, rule_digest = rule_digest }
    local token, err = codec.seal(receipts.request_hash(review), context(board.board_id))
    if err or not token then return nil, err end
    return { status = "eligible", cohorts = groups, review = review, token = token }, nil
end

function M.plan(request: unknown): (Result?, error?)
    if type(request) ~= "table" or not text(request.board_id) or not text(request.selector) then return nil, invalid() end
    local board_id, err = locate.resolve(request.board_id :: string)
    if err or not board_id then return nil, err end
    local err = guard.require_access(board_id, guard.admin_access())
    if err then return nil, err end
    local id = request.selector :: string
    local spec, err = load(id)
    if err or not spec then return nil, err end
    local pack, err = pack_catalog.revision(spec.pack)
    if err then return nil, err end
    if not pack then return refusing("pack.installed"), nil end
    local deadline, err = limits.deadline("command_deadline_ms")
    if err or not deadline then return nil, err end
    local head, err = receipts.covered(board_id, deadline)
    if err or not head then return nil, err end
    local db, err = board_store.open()
    if err or not db then return nil, err end
    local tx, err = db:begin()
    if err or not tx then db:release(); return nil, err end
    if db:type() == sql.type.POSTGRES then err = board_store.read_snapshot(tx, deadline) end
    local result: Result? = nil
    if not err then
        local board
        board, err = board_store.board(tx, board_id)
        if board then result, err = inspect(tx, board, id, spec, pack.digest, head, deadline)
        elseif not err then err = invalid() end
    end
    local _, rollback_err = tx:rollback()
    db:release()
    if err or rollback_err or not result then return nil, err or rollback_err end
    if clock.passed(deadline) then return nil, timed_out() end
    return result, nil
end

local function validate_review(value: unknown): boolean
    return type(value) == "table" and text(value.board_id) and text(value.selector)
        and type(value.head) == "number" and math.tointeger(value.head) ~= nil and value.head >= 0
        and type(value.generation) == "number" and math.tointeger(value.generation) ~= nil and value.generation >= 1
        and digest(value.selector_digest) and digest(value.base_digest) and digest(value.installed_digest) and digest(value.rule_digest)
end

function M.apply(request: unknown): (commands.SchemaResult?, error?)
    if type(request) ~= "table" or not text(request.key) or type(request.token) ~= "string" or not validate_review(request.review) then
        return nil, invalid()
    end
    local review = request.review :: Review
    local board_id = review.board_id
    local err = guard.require_access(board_id, guard.admin_access())
    if err then return nil, err end
    local fingerprint = receipts.request_hash(review)
    local held, err = codec.open(request.token, context(board_id))
    if err and err:kind() == errors.UNAVAILABLE then return nil, err end
    if held ~= fingerprint then return nil, invalid() end
    local key = "transition-adoption/" .. receipts.request_hash({ actor = guard.actor_id(), key = request.key })
    local reviewed: commands.ReviewedSchema = { head = review.head, fingerprint = fingerprint,
        plan = function(db: sql.DB, snapshot: commands.SchemaSnapshot): (commands.SchemaPlan?, error?)
            local board, declared = snapshot.board, snapshot.declaration
            if not board or not declared or board.generation ~= review.generation then return nil, stale() end
            local spec, err = load(review.selector)
            if err or not spec then return nil, err end
            if receipts.request_hash(spec) ~= review.selector_digest or board.pack ~= spec.pack
                or board.pack_digest ~= review.base_digest then return nil, stale() end
            local pack, err = pack_catalog.revision(spec.pack)
            if err then return nil, err end
            if not pack or pack.digest ~= review.installed_digest then return nil, stale() end
            local attachment, err = plugin_rows.active(db, board_id, spec.plugin)
            if err then return nil, err end
            if not attachment or rules.digest(board.compiled, spec) ~= review.rule_digest then return nil, stale() end
            local compiled = declaration.copy(board.compiled)
            compiled.transition_rules = compiled.transition_rules or {}
            local index = rules.key(spec.item_type, spec.transition)
            if compiled.transition_rules[index] then return nil, stale() end
            compiled.transition_rules[index] = { item_type = spec.item_type, process = spec.process, transition = spec.transition,
                command = spec.command, plugin = spec.plugin, fields = spec.fields, digest = review.rule_digest }
            return { compiled = compiled, declaration = declared, digest = schema.digest(compiled), generation = board.generation + 1,
                class = "semantic", changes = { { code = spec.item_type, what = "transition_command", class = "semantic", detail = spec.transition } },
                refused = {}, maps = {}, unchanged = false, claim = false, migrates = false }, nil
        end }
    local result, err = schema_commands.apply_schema({ board_id = board_id, declaration = {}, key = key,
        expected_generation = review.generation, source = "transition-adoption" }, nil, nil, reviewed)
    local code = err and (err:details() or {}).code
    if code == "head_changed" or code == "generation_changed" then return nil, stale() end
    return result, err
end

return M
