-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local trace = require("trace")
local domain = require("domain")
local writable_sink = require("writable_sink")
local data_error = require("data_error")
local apply_ops = require("apply_ops")
local outcomes = require("outcomes")
local M = {}

local function invalid(message: string, code: string): unknown
    return data_error.failure(errors.new({ kind = errors.INVALID, message = message, details = { code = code } }))
end

function M.write(req: types.FailureRequest): unknown
    local board_id = writable_sink.trim((req.config or {}).board_id)
    if board_id == "" then return invalid("config.board_id is required", "invalid_config") end
    if req.sink_op ~= "upsert" then return invalid("sink_op must be upsert", "unsupported_operation") end
    local input = req.input or {}
    local correlation = input.correlation
    if input.status ~= "failed" and input.status ~= "cancelled" and input.status ~= "terminated" then
        return { success = true, result = "noop" }
    end
    -- A shared Flow can also run for another board or without a stage locator.
    if not correlation or correlation.board_id ~= board_id then return { success = true, result = "noop" } end
    if type(correlation.item) ~= "string" or correlation.item == ""
        or type(correlation.visit) ~= "number" or correlation.visit < 1 or correlation.visit % 1 ~= 0
        or type(correlation.attempt) ~= "number" or correlation.attempt < 1 or correlation.attempt % 1 ~= 0
        or type(input.run_id) ~= "string" or input.run_id == "" then
        return invalid("terminal failure requires run_id and a complete stage correlation", "invalid_request")
    end
    local origin, origin_err = writable_sink.origin(req)
    if not origin then return origin_err end
    local context, trace_err = trace.normalize(req.trace_context or input.trace_context)
    if trace_err then return data_error.failure(trace_err) end
    context = context or trace.begin("work.stage_failure")
    context.run_id = input.run_id
    local result, err = apply_ops.apply({ board_id = board_id, mode = "atomic", source = "flow_run_failed",
        origin = { type = "automation", id = origin }, trace_context = context :: domain.TraceContext,
        ops = { { op = "stage_failed", item = correlation.item, visit = correlation.visit, attempt = correlation.attempt } } })
    if err then return data_error.failure(err) end
    local outcome = result.outcomes[1]
    if outcome.status == "applied" or outcome.status == "unchanged" then
        return { success = true, result = outcome.status == "applied" and "updated" or "noop", dest_ref = { item_id = correlation.item } }
    end
    return data_error.failure(outcomes.error(outcome.status, outcome.findings, outcome.error) :: error)
end
return M
