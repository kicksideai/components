-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The board creation authority. A request owns one actor-scoped, deterministic
-- component id; the component and its thread are created through the threads
-- contract, then an optional initial declaration is applied as an ordinary
-- schema command keyed by the board id, so a retried request converges on the
-- same board and schema.
local component = require("component")
local identifiers = require("identifiers")
local packs = require("packs")
local security = require("security")
local consts = require("consts")
local threads = require("threads")
local schema_commands = require("schema_commands")
local locate = require("locate")
local types = require("types")
local domain = require("domain")
local plugins = require("plugins")
local catalog = require("catalog")
local planner = require("planner")

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

local function existing(board_id: string, title: string, parent_id: string): (boolean?, error?)
    local rows, err = component.query({ component_ids = { board_id }, include = { meta = true, placement = true }, limit = 1 })
    if err then return nil, errors.wrap(err :: error, "board idempotency lookup failed") end
    local first: unknown = type(rows) == "table" and (rows :: { unknown })[1] or nil
    if first == nil then return false, nil end
    if type(first) ~= "table" then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "board component row is malformed" }) end
    local row = first :: domain.ComponentRow
    if row.impl_id ~= consts.BOARD_IMPL then
        return nil, errors.new({ details = { code = "idempotency_conflict" }, kind = errors.CONFLICT, message = "board idempotency key collides with another component" })
    end
    local meta: domain.ComponentMeta = row.meta or {}
    if trim(meta.title) ~= title or trim(row.parent_id) ~= parent_id then
        return nil, errors.new({ kind = errors.CONFLICT, message = "board idempotency key was already used with a different request",
            details = { code = "idempotency_conflict" } })
    end
    return true, nil
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

    local initial = input.declaration
    if input.pack then
        local pack, perr = catalog.load(input.pack, input.version)
        if perr or not pack then return nil, perr end
        initial = planner.declaration(pack.data)
    end
    if initial then
        local _, err = plugins.compile(initial.plugins, input.plugin_configs)
        if err then return nil, err end
    end

    local found, ferr = existing(board_id, title, parent_id)
    if ferr then return nil, ferr end
    if not found then
        local c, oerr = threads.open()
        if oerr or not c then return nil, oerr end
        local created, cerr = threads.create(c, { id = board_id, impl_id = consts.BOARD_IMPL, thread_class = consts.THREAD_CLASS,
            parent_id = parent_id ~= "" and parent_id or nil, title = title, icon = ICON })
        if not created then
            local winner, werr = existing(board_id, title, parent_id)
            if not winner then return nil, errors.wrap(cerr or werr or errors.new({ kind = errors.INTERNAL, retryable = false, message = "operation returned no result", details = { code = "internal" } }), "board create failed") end
        end
    end

    local generation: integer? = nil
    if input.pack then
        local installed, perr = packs.apply({ board_id = board_id, pack = input.pack, version = input.version,
            starter = input.starter, plugin_configs = input.plugin_configs, expected_generation = 0, key = "create/" .. board_id, declaration = input.declaration, trace_context = input.trace_context })
        if perr or not installed then return nil, perr end
        generation = installed.generation
    elseif input.declaration then
        local applied, serr = schema_commands.apply_schema({ trace_context = input.trace_context, board_id = board_id, declaration = input.declaration, plugin_configs = input.plugin_configs, key = "create/" .. board_id })
        if serr or not applied then return nil, errors.wrap(serr or errors.new({ kind = errors.INTERNAL, retryable = false, message = "operation returned no result", details = { code = "internal" } }), "initial schema failed") end
        generation = applied.generation
    end
    return { board_id = board_id, title = title, generation = generation, replayed = found == true }, nil
end

return M
