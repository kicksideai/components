-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local uuid = require("uuid")
local guard = require("guard")
local component = require("component")
local identity = require("identity")
local apply_ops = require("apply_ops")
local outcomes = require("outcomes")
local types = require("types")
local requests = require("requests")
local M = {}
local OUTCOMES: { [string]: string } = { completed = "passed", cancelled = "canceled", failed = "failed", terminated = "failed" }

function M.token(value: unknown): (types.Token?, error?)
    if type(value) ~= "table" then return nil, guard.invalid("Work completion requires a stage token") end
    local token = value :: types.Token
    for key in pairs(token) do
        if key ~= "board_id" and key ~= "item" and key ~= "visit" and key ~= "attempt" then
            return nil, guard.invalid("unknown Work token field", { code = "stage_token_invalid" })
        end
    end
    if type(token.board_id) ~= "string" or not uuid.validate(token.board_id)
        or type(token.item) ~= "string" or not uuid.validate(token.item)
        or type(token.visit) ~= "number" or token.visit < 1 or token.visit % 1 ~= 0
        or type(token.attempt) ~= "number" or token.attempt < 1 or token.attempt % 1 ~= 0 then
        return nil, guard.invalid("Work token requires board/item UUIDs and positive integer visit/attempt", { code = "stage_token_invalid" })
    end
    return token, nil
end

function M.finish(token: types.Token, outcome: string, run_id: string?, rejection: boolean?): (types.WorkflowResult?, error?)
    local denied = guard.require_access(token.board_id, guard.write_access())
    if denied then return nil, denied end
    local context, cerr = component.get_private_context(token.board_id)
    if cerr then return nil, cerr :: error end
    local stored = context and context[identity.CONTEXT_KEY]
    local valid, ierr = identity.validate(stored)
    if not valid then return nil, ierr :: error? end
    if guard.actor_id() ~= identity.actor_key(stored.principal) then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "completion requires the stored board principal", details = { code = "stage_launch_principal_denied" } })
    end
    local result, err = apply_ops.apply({ board_id = token.board_id, source = rejection and "flow_launch_rejected" or "flow_completion",
        trace_context = run_id and { trace_id = "workflow:" .. run_id, run_id = run_id } or nil,
        ops = { { op = "report", completion = true, item = token.item, visit = token.visit, attempt = token.attempt,
            outcome = outcome, outputs = rejection and { error = "flow_launch_rejected" } or nil } } })
    if err or not result then return nil, err end
    local one = result.outcomes[1]
    if one.status ~= "applied" and one.status ~= "unchanged" then
        return nil, outcomes.error(one.status, one.findings, one.error)
    end
    return { success = true, result = one.status == "applied" and "updated" or "noop" }, nil
end

function M.complete(input: unknown): ({ acknowledged: boolean }?, error?)
    local invalid = requests.parse("complete", input, "kickside.workflows:run_completion")
    if invalid then return nil, invalid end
    local envelope = input :: types.Completion
    local token, err = M.token(envelope.token)
    if err or not token then return nil, err end
    if ctx.get("component_id") ~= token.board_id then return nil, guard.invalid("completion token targets another board", { code = "stage_token_board_mismatch" }) end
    local outcome = OUTCOMES[envelope.status]
    if not outcome then return nil, guard.invalid("terminal status required") end
    local _, finish_err = M.finish(token, outcome, envelope.run_id)
    if finish_err then return nil, finish_err end
    return { acknowledged = true }, nil
end
return M
