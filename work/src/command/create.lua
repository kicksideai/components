-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The board creation authority. A request owns one actor-scoped, deterministic
-- component id; Component atomically creates its identity and declared thread.
-- Initialization uses ordinary keyed commands. Its permanent completion result
-- prevents a completed retry from reapplying the initial declaration.
local component = require("component")
local identifiers = require("identifiers")
local packs = require("packs")
local security = require("security")
local consts = require("consts")
local schema_commands = require("schema_commands")
local locate = require("locate")
local types = require("types")
local domain = require("domain")
local plugins = require("plugins")
local catalog = require("catalog")
local receipts = require("receipts")
local envelope = require("envelope")
local component_types = require("component_types")
local threads = require("threads")

local M = {}

local ID_NAMESPACE = "kickside.work.create.v1"
local ICON = "tabler:layout-kanban"

local trim = locate.trim

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_request" }, kind = errors.INVALID, message = message })
end

-- board_id derives the caller's board id for an idempotency key.
function M.board_id(key: string): (string?, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({ details = { code = "authentication_required" }, kind = errors.PERMISSION_DENIED, message = "authentication required" }) end
    return identifiers.uuid(ID_NAMESPACE .. "\0" .. actor:id() .. "\0" .. key)
end

local function existing(board_id: string): (boolean?, error?)
    local rows, err = component.query({ component_ids = { board_id }, access_mask = component.ACCESS.ADMIN :: integer, include = { meta = false }, limit = 1 })
    if err then return nil, errors.wrap(err :: error, "board idempotency lookup failed") end
    local first: unknown = type(rows) == "table" and (rows :: { unknown })[1] or nil
    if first == nil then return false, nil end
    if type(first) ~= "table" then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "board component row is malformed" }) end
    local row = first :: domain.ComponentRow
    if row.impl_id ~= consts.BOARD_IMPL then
        return nil, errors.new({ details = { code = "idempotency_conflict" }, kind = errors.CONFLICT, message = "board idempotency key collides with another component" })
    end
    return true, nil
end

local function validate_initial(input: types.CreateRequest): error?
    local initial = input.declaration
    if input.pack then
        local pack, perr = catalog.load(input.pack, input.version)
        if perr or not pack then return perr end
        initial = catalog.declaration(pack.data)
    end
    if initial then
        local _, err = plugins.compile(initial.plugins, input.plugin_configs)
        if err then return err end
    end

    return nil
end

function M.create(input: types.CreateRequest): (types.CreateResult?, error?)
    local allowed, permission_err = security.can("work.board.create", consts.BOARD_IMPL)
    if permission_err then return nil, permission_err end
    if not allowed then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "board creation requires the Work administration capability", details = { code = "board_creation_denied" } }) end
    local key = trim(input.idempotency_key)
    if key == "" then return nil, invalid("idempotency_key is required") end
    if #key > 255 then return nil, invalid("idempotency_key must be at most 255 characters") end
    local title = trim(input.title)
    if title == "" then title = "Board" end
    local parent_id = trim(input.parent_id)
    local board_id, id_err = M.board_id(key)
    if not board_id then return nil, id_err end

    local fingerprint = receipts.request_hash({ title = title, parent_id = parent_id, declaration = input.declaration,
        pack = input.pack, version = input.version, starter = input.starter, plugin_configs = input.plugin_configs })
    local found, ferr = existing(board_id)
    if ferr then return nil, ferr end
    local service, service_err = component.get_service()
    if service_err or not service then return nil, service_err :: error? end
    if not found then
        local validation_err = validate_initial(input)
        if validation_err then return nil,validation_err end
        -- Component owns atomic creation of the board, its immutable identity
        -- and the primary thread declared by the kind. Failed admission leaves
        -- no independent Work receipt behind.
        local result, call_err = service:register({ component_id = board_id, impl_id = consts.BOARD_IMPL,
            parent_id = parent_id ~= "" and parent_id or nil,
            meta = { title = title, icon = ICON }, private_context = { work_creation = fingerprint } })
        local creation_err = call_err :: error? or envelope.error_of(result :: component_types.ServiceEnvelope, "register")
        if creation_err then
            if not errors.is(creation_err,errors.CONFLICT) then return nil, creation_err end
            local winner, werr = existing(board_id)
            if werr or not winner then return nil, werr or creation_err end
        end
    end
    local context, context_err = service:get_access_context({component_id=board_id,access_mask=component.ACCESS.ADMIN,include_context=true})
    if context_err then return nil,context_err :: error end
    local read_err = envelope.error_of(context :: component_types.ServiceEnvelope,"get_access_context")
    if read_err then return nil,read_err end
    local held = context :: component_types.AccessContextResult
    local creation = held.context and held.context.work_creation
    if creation ~= fingerprint then return nil,receipts.conflict_of() end
    local completed = held.context and held.context.work_creation_result
    if completed then
        local result = completed :: types.CreateResult
        return { board_id = result.board_id, title = result.title, generation = result.generation, replayed = true }, nil
    end

    if found then
        local validation_err = validate_initial(input)
        if validation_err then return nil,validation_err end
    end

    local client, client_err = threads.open()
    if client_err or not client then return nil,client_err end
    local _, converge_err = client:ensure_thread({component_id=board_id,impl_id=consts.BOARD_IMPL,thread_class=consts.THREAD_CLASS})
    if converge_err then return nil,converge_err end
    local generation: integer? = nil
    if input.pack then
        local installed, perr = packs.apply({ board_id = board_id, pack = input.pack, version = input.version,
            starter = input.starter, plugin_configs = input.plugin_configs, expected_generation = 0, key = "create/" .. board_id, declaration = input.declaration, trace_context = input.trace_context })
        if perr or not installed then return nil, perr end
        generation = installed.generation
    else
        local initial = input.declaration or { key_prefix = "W" .. board_id:gsub("-", ""):sub(1, 9):upper() }
        local applied, serr = schema_commands.apply_schema({ trace_context = input.trace_context, board_id = board_id, declaration = initial, plugin_configs = input.plugin_configs, key = "create/" .. board_id })
        if serr or not applied then return nil, errors.wrap(serr or errors.new({ kind = errors.INTERNAL, retryable = false, message = "operation returned no result", details = { code = "internal" } }), "initial schema failed") end
        generation = applied.generation
    end
    local result: types.CreateResult = { board_id = board_id, title = title, generation = generation, replayed = found == true }
    -- Absence of a result means initialization is still recoverable. Publish
    -- completion with the fingerprint, independently of expiring schema receipts.
    local current, read_context_err = service:get_access_context({component_id=board_id,access_mask=component.ACCESS.ADMIN,include_context=true})
    if read_context_err then return nil,read_context_err :: error end
    local current_err = envelope.error_of(current :: component_types.ServiceEnvelope,"get_access_context")
    if current_err then return nil,current_err end
    local completed_context = current :: component_types.AccessContextResult
    local _, complete_err = component.update(board_id,{{type="PATCH_CONTEXT",payload={patch={work_creation=fingerprint,work_creation_result=result}}}},
        {expected_revision=completed_context.context_revision})
    if complete_err then return nil,complete_err :: error end
    return result, nil
end

return M
