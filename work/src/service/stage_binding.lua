-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema admission validates both principals; only apply provisions the constant
-- board child. The selected installer owns interruption recovery and collisions.
local component = require("component")
local sql = require("sql")
local service_types = require("service_types")
local automation_db = require("automation_db") :: service_types.AutomationDB
local command = require("automation_command")
local execution_identity = require("execution_identity")
local identifiers = require("identifiers")
local automations = require("automations")
local versions = require("versions")
local schema_validate = require("schema_validate")
local guard = require("guard")
local types = require("types")
local M = {}

local function bound(compiled: types.Compiled): boolean
    for _, p in ipairs(compiled.processes) do
        for _, state in ipairs(p.states) do if state.run and state.run.flow_ref then return true end end
    end
    return false
end

local function validate(request: types.StageBindingRequest): error?
    for _, p in ipairs(request.compiled.processes) do
        for _, state in ipairs(p.states) do
            local ref = state.run and state.run.flow_ref
            if ref then
                local _, access_err = component.validate_access(ref.id, component.ACCESS.READ)
                if access_err then return access_err :: error end
                local version, err = versions.get(ref.id, ref.version)
                if err then return err :: error end
                if not version then return errors.new({ kind = errors.NOT_FOUND, message = "published Flow version is unavailable", details = { code = "stage_flow_version_missing" } }) end
                -- Workflows owns Start validation. Its supported constraints must
                -- admit every UUID and positive attempt/visit, not one sample.
                local input_schema, decode_err = schema_validate.decode(version.input_schema)
                local input_err = decode_err or schema_validate.validate(input_schema, {
                    board_id = request.board_id, item = "00000000-0000-4000-8000-000000000000",
                    state = state.id, visit = 1, attempt = 1,
                }, "Work Start")
                local face = input_schema :: types.JsonObject?
                if face and (face.const ~= nil or face.enum ~= nil) then input_err = "Start must accept every Work envelope" end
                local properties = face and face.properties :: { [string]: types.JsonObject }? or {}
                for _, key in ipairs({ "item", "visit", "attempt" }) do
                    local field = properties[key]
                    if field and (field.const ~= nil or field.enum ~= nil) then input_err = key .. " must accept every Work value" end
                end
                if input_err then return guard.invalid(tostring(input_err), { code = "stage_flow_input_incompatible" }) end
            end
        end
    end
    return nil
end

function M.selected(request: types.StageBindingRequest): (boolean?, error?)
    local aerr = guard.require_access(request.board_id, guard.admin_access())
    if aerr then return nil, aerr end
    local context, cerr = component.get_private_context(request.board_id)
    if cerr then return nil, cerr :: error end
    local identity = context and context[execution_identity.CONTEXT_KEY]
    local valid, ierr = execution_identity.validate(identity)
    if not valid then return nil, ierr :: error? end
    local principal = (identity :: { principal: types.PrincipalDecl }).principal
    if guard.actor_id() ~= execution_identity.actor_key(principal) then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "launcher requires the stored board principal", details = { code = "stage_launch_principal_denied" } })
    end
    local err = validate(request)
    if err then return nil, err end
    if not request.install then return true, nil end
    local id, id_err = identifiers.uuid("kickside.work.launcher.v1\0" .. request.board_id)
    if id_err or not id then return nil, id_err end
    local existing, eerr = component.list_system({ component_ids = { id }, limit = 1 })
    if eerr then return nil, eerr :: error end
    if existing and existing[1] then
        local owned, oerr = automation_db.with_db(function(db: sql.DB): (unknown, error?)
            return command.read_op(db, id, "work/stage-launcher/v1")
        end)
        if oerr then return nil, oerr :: error end
        if not owned or existing[1].impl_id ~= "kickside.sync:sync" then
            return nil, errors.new({ kind = errors.CONFLICT, message = "owned launcher ID is occupied", details = { code = "stage_launcher_occupied" } })
        end
    end
    local installed, install_err = automations.install_type_selected("kickside.sync:sync", {
        title = "Work stage launcher", enabled = true,
        trigger = { v = 2, source = "kickside.work.ports:stage_entered", config = { thread_id = request.board_id }, backfill = "none" },
        sink_port = "kickside.work.sink:stage_launch_port", sink_config = { board_id = request.board_id }, transform = { kind = "none" },
    }, { component_id = id, parent_id = request.board_id, request_id = "work/stage-launcher/v1", principal = principal })
    if install_err then return nil, install_err :: error end
    if not installed then return nil, errors.new({ kind = errors.INTERNAL, message = "launcher installation returned no acknowledgement",
        details = { code = "stage_launcher_unacknowledged" } }) end
    return true, nil
end

function M.admit(request: types.StageBindingRequest): (boolean?, error?)
    local aerr = guard.require_access(request.board_id, guard.admin_access())
    if aerr then return nil, aerr end
    if not bound(request.compiled) then return true, nil end
    local err = validate(request)
    if err then return nil, err end
    local context, cerr = component.get_private_context(request.board_id)
    if cerr then return nil, cerr :: error end
    local identity = context and context[execution_identity.CONTEXT_KEY]
    if not identity then return nil, guard.invalid("board holds no execution identity", { code = "board_identity_absent" }) end
    local valid, ierr = execution_identity.validate(identity)
    if not valid then return nil, ierr :: error? end
    if guard.actor_id() ~= execution_identity.actor_key((identity :: { principal: types.PrincipalDecl }).principal) then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "launcher requires the stored board principal", details = { code = "stage_launch_principal_denied" } })
    end
    local result, run_err = execution_identity.run_as(identity, "kickside.work.service:stage_binding_selected", request,
        { deferred_owner = "kickside.work.service:stage_binding", execution_root = request.board_id })
    return result :: boolean?, run_err :: error?
end
return M
