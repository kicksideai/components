-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local templates = require("templates")
local types = require("types")
local catalog = require("catalog")
local shape = require("shape")
local schemas = require("schemas")
local writable = require("writable")
local data_error = require("data_error")
local hash = require("hash")
local automation_policy = require("automation_policy")
local values = require("values")

local M = {}

local function invalid(code: string, message: string): error
    return catalog.problem(errors.INVALID, code, message)
end

-- Automation's delivery tuple ends in the operator replay generation. An
-- at-most-once retry may recover a receipt, but cannot open a new create.
local function replay(identity: string, delivery: string): (boolean?, error?)
    local at = 1
    local parts: { string } = {}
    for i = 1, 5 do
        local colon = delivery:find(":", at, true)
        local size = colon and math.tointeger(tonumber(delivery:sub(at, colon - 1))) or nil
        if not colon or not size or size < 0 or size > #delivery - colon then
            return nil, invalid("template_delivery_invalid", "Automation delivery identity is malformed")
        end
        parts[i] = delivery:sub(colon + 1, colon + size)
        at = colon + size + 1
    end
    local generation = math.tointeger(tonumber(parts[5]))
    if at ~= #delivery + 1 or parts[1] ~= identity or parts[3] ~= "upsert" or not generation or generation < 0 then
        return nil, invalid("template_delivery_invalid", "Automation delivery does not match the occurrence")
    end
    return generation > 0, nil
end

function M.write(input: unknown): unknown
    if type(input) ~= "table" then return data_error.failure(invalid("invalid_request", "write requires an object")) end
    local req = input :: types.Write
    local origin, failure = writable.origin(req)
    if not origin then return failure end
    if req.sink_op ~= "upsert" then return data_error.failure(invalid("unsupported_operation", "template action requires upsert")) end
    local identity, delivery = req.identity_key, req.idempotency_key
    if type(identity) ~= "string" or #identity == 0 or #identity > 2048 or type(delivery) ~= "string" or #delivery > 8192 then
        return data_error.failure(invalid("template_delivery_invalid", "occurrence and delivery identities are required"))
    end
    local replay_only, rerr = replay(identity, delivery)
    if rerr then return data_error.failure(rerr) end
    local config_err = shape.check(schemas.config, req.config, "template action config")
    if config_err then return data_error.failure(config_err) end
    local action = req.input
    if action == nil then action = {} end
    local input_err = shape.check(schemas.input, action, "template action input")
    if input_err then return data_error.failure(input_err) end
    local config = req.config :: types.Pinned
    local policy, perr = automation_policy.policy()
    if perr then return data_error.failure(perr) end
    if not policy then return data_error.failure(errors.new({ kind = errors.INTERNAL, message = "Automation retention policy is missing" })) end
    local replay_window = math.max(policy.history_ms, policy.ledger_resolved_ms)
    local result, err = templates.occurrence({ board_id = config.board_id, template_id = config.template_id,
        version = config.version, key = tostring(hash.sha256(values.canonical({ origin, identity }))), overrides = action.overrides },
        replay_window, replay_only, req.trace_context)
    if err then return data_error.failure(err) end
    if not result then return data_error.failure(errors.new({ kind = errors.INTERNAL, message = "template apply returned no result" })) end
    return { success = true, result = result.replayed and "noop" or "created", dest_ref = { item_id = result.outcomes[1].item } }
end

return M
