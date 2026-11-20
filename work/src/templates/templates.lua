-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local uuid = require("uuid")
local hash = require("hash")
local types = require("types")
local domain = require("domain")
local reads = require("reads")
local commands = require("commands")
local access = require("access")
local rules = require("rules")
local requests = require("requests")
local catalog = require("catalog")
local presets = require("presets")
local store = require("store")
local policy = require("policy")
local apply = require("apply")
local outcomes = require("outcomes")
local values = require("values")
local peers = require("peers")
local limits = require("limits")
local M = {}

local function version_of(input: types.Pinned, mode: integer, min_window: integer?): (types.Version?, string?, error?)
    local aerr = access.admit(input.board_id, mode)
    if aerr then return nil, nil, aerr end
    local db, err = store.open()
    if err or not db then return nil, nil, err end
    local attachment, cerr = catalog.attachment(db, input.board_id)
    if cerr or not attachment then db:release(); return nil, nil, cerr end
    if min_window then
        local window, werr = policy.event_window(db, input.board_id)
        if werr or not window then db:release(); return nil, nil, werr end
        if window.ms and window.ms < min_window then
            db:release()
            return nil, nil, catalog.problem(errors.INVALID, "template_replay_window_short",
                "Work board event retention must cover Automation history and delivery retention")
        end
    end
    local version, verr = catalog.get(db, attachment, input.template_id, input.version)
    db:release()
    return version, attachment, verr
end

local function redact(db: reads.Executor, board: domain.Board, version: types.Version): (types.Record?, error?)
    local record = version.record
    local preset = record.preset
    local function readable(code: string): boolean
        local field = board.model.fields[code]
        return field ~= nil and presets.matches(field, version) and rules.field(board, field, "read", nil)
    end
    local defaults: types.Map = table.create(0, 1)
    for code, value in pairs(preset.values or {}) do
        if readable(code) then defaults[code] = value end
    end
    local overrides: { string } = {}
    for _, code in ipairs(record.override_fields) do
        if readable(code) then overrides[#overrides + 1] = code end
    end
    local parent: string? = nil
    if preset.parent then
        local item, err = store.item(db, board.board_id, preset.parent)
        if err then return nil, err end
        if item and item.life == "live" and rules.visible(board, item.document) then parent = preset.parent end
    end
    return { template_id = record.template_id, version = record.version, title = record.title, description = record.description,
        schema_generation = record.schema_generation, override_fields = overrides,
        preset = { op = "create", type = preset.type, parent = parent, state = preset.state, values = defaults } }, nil
end

function M.list(input: unknown): (types.List?, error?)
    local err = requests.parse("list", input, catalog.CONTRACT)
    if err then return nil, err end
    local req = input :: types.BoardRequest
    local peer_fields: { [string]: domain.Field } = {}
    local result, rerr = access.with_snapshot(req.board_id, nil, function(tx: reads.Executor, board: domain.Board, _dialect: string): (types.List?, error?)
        peer_fields = peers.catalog(board)
        local attachment, aerr = catalog.attachment(tx, req.board_id)
        if aerr or not attachment then return nil, aerr end
        local versions, verr = catalog.active(tx, attachment)
        if verr or not versions then return nil, verr end
        local result: { types.Record } = {}
        for _, version in ipairs(versions) do
            local record, rerr = redact(tx, board, version)
            if rerr or not record then return nil, rerr end
            result[#result + 1] = record
        end
        return { templates = result }, nil
    end)
    if rerr or not result then return nil, rerr end
    local redact_ref = peers.redactor(peer_fields)
    for _, record in ipairs(result.templates) do
        local defaults: types.Map = record.preset.values or {}
        for code, value in pairs(defaults) do
            local surface, err = redact_ref(code, value)
            if err then return nil, err end
            defaults[code] = surface
        end
    end
    return result, nil
end

function M.publish(input: unknown): (types.Record?, error?)
    local err = requests.parse("publish", input, catalog.CONTRACT)
    if err then return nil, err end
    local req = input :: types.Publish
    local prepared, perr = access.with_snapshot(req.board_id, nil, function(tx: reads.Executor, board: domain.Board, _dialect: string): (types.Publication?, error?)
        local attachment, aerr = catalog.attachment(tx, req.board_id)
        if aerr or not attachment then return nil, aerr end
        local overrides = req.override_fields or {}
        local identities, type_id, ierr = presets.identities(board, req.preset, overrides)
        if ierr or not identities or not type_id then return nil, ierr end
        local verr = presets.validate(board, req.preset)
        if verr then return nil, verr end
        local record: types.Record = { template_id = req.template_id, version = uuid.v4(), title = req.title,
            description = req.description, schema_generation = board.generation, preset = req.preset, override_fields = overrides }
        local version: types.Version = { record = record, field_identities = identities, type_identity = type_id, archived = false }
        return { attachment = attachment, version = version }, nil
    end, nil, nil, nil, component.ACCESS.ADMIN)
    if perr or not prepared then return nil, perr end
    return catalog.publish(prepared.attachment, prepared.version)
end

function M.archive(input: unknown): (types.Archive?, error?)
    local err = requests.parse("archive", input, catalog.CONTRACT)
    if err then return nil, err end
    local req = input :: types.Pinned
    local version, attachment, verr = version_of(req, component.ACCESS.ADMIN)
    if verr or not version or not attachment then return nil, verr end
    local db, derr = store.open()
    if derr or not db then return nil, derr end
    local window, werr = policy.event_window(db, req.board_id)
    db:release()
    if werr or not window then return nil, werr end
    return catalog.archive(attachment, version, window.ms and window.ms + limits.DEFINITIONS.command_deadline_ms.max)
end

local function instantiate(input: unknown, replay_window: integer?, replay_only: boolean?, trace: domain.TraceContext?): (commands.ApplyResult?, error?)
    local err = requests.parse("instantiate", input, catalog.CONTRACT)
    if err then return nil, err end
    local req = input :: types.Instantiate
    local version, attachment, verr = version_of(req :: types.Pinned, component.ACCESS.WRITE, replay_window)
    if verr or not version or not attachment then return nil, verr end
    local preset, merr = presets.merge(version, req.overrides)
    if merr or not preset then return nil, merr end
    local channel = replay_window and "occurrence" or "request"
    local request: commands.ApplyRequest = { board_id = req.board_id, mode = "atomic", ops = { preset :: commands.Op },
        key = "work-templates/" .. channel .. "/" .. tostring(hash.sha256(req.key)), source = "work-templates",
        trace_context = trace, origin = { template_id = req.template_id, version = req.version, overrides_hash = tostring(hash.sha256(values.canonical(req.overrides or {}))) } }
    local result, aerr = apply.apply(request, nil, function(board: domain.Board): error?
        local db, derr = store.open()
        if derr or not db then return derr end
        local active, cerr = catalog.attachment(db, req.board_id)
        local latest, lerr
        if active == attachment and not cerr then latest, lerr = catalog.get(db, attachment, req.template_id, req.version) end
        db:release()
        if cerr or lerr then return cerr or lerr end
        if not latest then
            return catalog.problem(errors.NOT_FOUND, "template_version_not_found", "template attachment changed")
        end
        if latest.archived then
            return catalog.problem(errors.CONFLICT, "template_archived", "template version is archived; pin an active version")
        end
        if replay_only then
            return catalog.problem(errors.CONFLICT, "template_replay_unavailable", "the occurrence has no retained Work receipt")
        end
        return presets.current(board, latest)
    end)
    if aerr or not result then return nil, aerr end
    local outcome = result.outcomes[1]
    local oerr = outcomes.error(outcome.status, outcome.findings, outcome.error)
    if oerr then return nil, oerr end
    return result, nil
end

function M.instantiate(input: unknown): (commands.ApplyResult?, error?)
    return instantiate(input, nil, nil, nil)
end

function M.occurrence(input: types.Instantiate, replay_window: integer, replay_only: boolean?, trace: domain.TraceContext?): (commands.ApplyResult?, error?)
    return instantiate(input, replay_window, replay_only, trace)
end

return M
