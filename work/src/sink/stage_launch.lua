-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local hash = require("hash")
local values = require("values")
local identifiers = require("identifiers")
local writable_sink = require("writable_sink")
local workflow_sink = require("workflow_sink")
local completion = require("completion")
local store = require("store")
local principals = require("principals")
local prepare = require("prepare")
local report = require("report")
local guard = require("guard")
local outcomes = require("outcomes")
local data_error = require("data_error")
local types = require("types")
local commands = require("commands")
local M = {}
local function pending(message: string): types.WorkflowResult
    return { success = false, error = { code = "provider_unavailable", message = message, retriable = true, scope = "flow", retry_after_ms = 2000 } }
end
function M.write(req: types.LaunchRequest): types.WorkflowResult
    local origin, origin_err = writable_sink.origin(req)
    if not origin then return origin_err :: types.WorkflowResult end
    local board_id = req.config and req.config.board_id or ""
    local launcher, id_err = identifiers.uuid("kickside.work.launcher.v1\0" .. board_id)
    if id_err then return data_error.failure(id_err) :: types.WorkflowResult end
    if origin ~= launcher then return data_error.failure(guard.invalid("stage delivery requires the owned launcher", { code = "stage_launcher_mismatch" })) :: types.WorkflowResult end
    if req.sink_op ~= "upsert" then return data_error.failure(guard.invalid("stage launcher supports upsert")) :: types.WorkflowResult end
    local aerr = guard.require_access(board_id, guard.write_access())
    if aerr then return data_error.failure(aerr) :: types.WorkflowResult end
    local entry = req.input or {}
    if not entry.flow_ref then return { success = true, result = "noop" } end
    local token, terr = completion.token({ board_id = entry.board_id, item = entry.item, visit = entry.visit, attempt = entry.attempt })
    if terr or not token then return data_error.failure(terr :: error) :: types.WorkflowResult end
    if token.board_id ~= board_id then return data_error.failure(guard.invalid("stage entry targets another board")) :: types.WorkflowResult end
    local db, derr = store.open()
    if derr or not db then return data_error.failure(derr :: error) :: types.WorkflowResult end
    local board, berr = store.board(db, board_id)
    if board and not berr then berr = principals.resolve(board) end
    local target: commands.ProcessTarget? = nil
    local refusal: commands.OpPlan? = nil
    if board and not berr then
        target, refusal = report.current(prepare.context(db, board, guard.actor_id(), guard.stamp_now(), db:type()),
            { op = "report", item = token.item, visit = token.visit, attempt = token.attempt })
    end
    db:release()
    if berr then return data_error.failure(berr) :: types.WorkflowResult end
    if not target then
        if refusal and refusal.status ~= "unchanged" then return data_error.failure(outcomes.error(refusal.status, refusal.findings, refusal.error) :: error) :: types.WorkflowResult end
        return { success = true, result = "noop" }
    end
    local key, kerr = hash.sha256(values.canonical({ board_id, token.item, token.visit, token.attempt }))
    if kerr then return pending(tostring(kerr)) end
    local result, err = workflow_sink.write({ config = { flow_ref = entry.flow_ref,
        completion = { component_id = board_id, token_fields = { "board_id", "item", "visit", "attempt" } } },
        input = { board_id = board_id, item = token.item, state = entry.state, visit = token.visit, attempt = token.attempt },
        sink_op = "create", origin = origin, automation_ref = req.automation_ref,
        identity_key = tostring(key), idempotency_key = tostring(key), trace_context = req.trace_context })
    if err or not result then return pending(tostring(err or "run admission returned no acknowledgement")) end
    if result.success or (result.error and result.error.retriable) then return result :: types.WorkflowResult end
    if not result.error or result.error.retriable ~= false then return pending("run admission returned no definite refusal") end
    -- An existing reservation can already have reached the engine after an
    -- acknowledgement loss. Its eventual completion owns the outcome.
    local reserved, rerr = workflow_sink.find(entry.flow_ref.id, launcher :: string, tostring(key))
    if rerr or reserved then return pending(tostring(rerr or "reserved run awaits admission/completion")) end
    local closed, cerr = completion.finish(token, "failed", nil, true)
    if cerr then return data_error.failure(cerr) :: types.WorkflowResult end
    return closed :: types.WorkflowResult
end
return M
