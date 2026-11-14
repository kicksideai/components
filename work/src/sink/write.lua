-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local local_types = require("local_types")
local registry = require("registry")
local security = require("security")
-- Item-key deliveries use the board apply receipt for exactly the accepted effect.
local board_client = require("board_client")
local writable_sink = require("writable_sink")
local data_error = require("data_error")
local types = require("types")
local read_types = require("read_types")
local domain = require("domain")
local values = require("values")
local hash = require("hash")
local store = require("store")
local outcomes = require("outcomes")
local M = {}





local function invalid(message: string, code: string): local_types.Result
    return data_error.failure(errors.new({ kind = errors.INVALID, message = message, details = { code = code } })) :: local_types.Result
end
function M.write(req: local_types.Request): local_types.Result
    local origin, origin_err = writable_sink.origin(req)
    if not origin then
        local reported = origin_err :: { error: { message: string, code: string } }
        return invalid(reported.error.message, reported.error.code)
    end
    local config = req.config or {}
    local board_id, source = writable_sink.trim(config.board_id), writable_sink.trim(config.source)
    if board_id == "" or source == "" then return invalid("config.board_id and config.source are required", "invalid_config") end
    if security.can("work.source.write", source) ~= true then
        return data_error.failure(errors.new({ kind = errors.PERMISSION_DENIED, message = "source write capability is required",
            details = { code = "source_denied", source = source } })) :: local_types.Result
    end
    local declared, declaration_err = registry.get(source)
    if declaration_err and declaration_err:kind() ~= errors.NOT_FOUND then return data_error.failure(declaration_err) :: local_types.Result end
    if not declared or declared.kind ~= "registry.entry" or (declared.meta or {}).type ~= "kickside.work.write_source" then
        return invalid("source names a registered Work write source", "source_unregistered")
    end
    local identity = writable_sink.trim(req.identity_key)
    if identity == "" then return invalid("identity_key is required", "identity_required") end
    local key = writable_sink.trim(req.idempotency_key)
    if key == "" then return invalid("idempotency_key is required", "idempotency_required") end
    if req.sink_op ~= "upsert" then return invalid("sink_op must be upsert", "unsupported_operation") end
    local opened, err = board_client.open()
    if err or not opened then return data_error.failure(err :: error) :: local_types.Result end
    local client = opened :: local_types.Board
    local prefix = store.parse_key(identity)
    local ref: read_types.ItemRef = prefix and { key = identity } or { id = identity }
    local held, get_err = client:get({ board_id = board_id, item = ref })
    if get_err then return data_error.failure(get_err) :: local_types.Result end
    local item = (held :: read_types.GetResult).item
    local input = req.input or {}
    local result, apply_err = client:apply({ board_id = board_id, source = source, origin = { type = "automation", id = origin },
        trace_context = req.trace_context,
        key = "sink/" .. tostring(hash.sha256(values.canonical({ origin, "upsert", key }))),
        ops = { { op = "set", item = item.id, values = input.values, clear = input.clear, unset = input.unset } } })
    if apply_err then return data_error.failure(apply_err) :: local_types.Result end
    local outcome = (result :: types.ApplyResult).outcomes[1]
    if outcome.status == "applied" or outcome.status == "unchanged" then
        return { success = true, result = outcome.status == "applied" and "updated" or "noop", dest_ref = { item_id = outcome.item } }
    end
    return data_error.failure(outcomes.error(outcome.status, outcome.findings) :: error) :: local_types.Result
end
return M
