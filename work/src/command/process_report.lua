-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local canonical_json = require("canonical_json")
local read_rows = require("read_rows")
local values = require("values")
local flow = require("flow")
local process = require("process")
local M = require("prepare_context")
local context = require("process_context")
local types = require("types")
local domain = require("domain")
local H = {}
local locate, done = context.locate, context.done

function H.plan(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local target, err = locate(ctx, op)
    if not target then return err :: types.OpPlan end
    local previous, perr = read_rows.stage_run(ctx.db, ctx.board.board_id, target.item.item_id, op.visit :: integer, op.attempt :: integer)
    if perr then return M.failed(perr) end
    if previous and previous.outcome then return M.invalid("stage_attempt_finished", "stage attempt already finishes") end
    local item: domain.StateItem = target.item
    local state: domain.State = target.state
    if state.kind ~= "automated" then return M.invalid("stage_state_required", "report requires an automated state") end
    if op.visit ~= item.visit then return M.invalid("stage_visit_mismatch", "report visit differs from the current visit") end
    local work = item.work :: domain.ProcessData
    if op.attempt ~= work.attempt then return M.invalid("stage_attempt_mismatch", "report attempt differs from the current attempt") end
    if work.waiting then return M.invalid("stage_attempt_finished", "stage attempt already finishes") end
    if op.progress then
        local progress = canonical_json.object(op.progress) :: domain.JsonObject
        local encoded, encode_err = canonical_json.encode(progress)
        if not encoded then return M.invalid("stage_progress_invalid", tostring(encode_err)) end
        if #encoded > consts.LIMITS.stage_progress then return M.invalid("stage_progress_limit", "stage progress exceeds 64 KiB") end
        op.progress = progress
    end
    if op.kind == "progress" then
        if not ctx.keyed then return M.invalid("stage_progress_key_required", "progress reports require a command key") end
        if op.outcome ~= nil or op.outputs ~= nil or op.progress == nil then
            return M.invalid("stage_progress_invalid", "progress reports require progress and omit outcome and outputs")
        end
        local group = M.item_group(item.item_id)
        local event = M.event(consts.EVENTS.STAGE_PROGRESSED, group,
            { item = item.item_id, state = item.state, visit = op.visit, attempt = op.attempt, progress = op.progress })
        item.version = item.version + 1
        return done(ctx, item, group, { event })
    end
    if not consts.STAGE_OUTCOMES[op.outcome :: string] then return M.invalid("stage_outcome_invalid", "outcome is passed, failed or canceled") end
    if #values.canonical(op.outputs or {}) > consts.LIMITS.stage_outputs then return M.invalid("stage_outputs_limit", "stage outputs exceed 64 KB") end
    return H.finish(ctx, target, op, {})
end

-- Both launch delivery and terminal completion fence against the recorded process.
function H.current(ctx: types.PrepareContext, op: types.Op): (types.ProcessTarget?, types.OpPlan?)
    local found, err = M.read(ctx, op.item :: string)
    if err then return nil, M.failed(err) end
    if not found or found.life == "purged" then return nil, M.result("unchanged", M.item_group(op.item :: string)) end
    local target, refusal = locate(ctx, op, true)
    if not target then return nil, refusal end
    local item = target.item
    local work = item.work :: domain.ProcessData
    if target.state.kind ~= "automated" or (work.visit or item.visit) ~= op.visit
        or work.attempt ~= op.attempt or work.waiting then
        return nil, done(ctx, item, M.item_group(item.item_id), {})
    end
    local previous, perr = read_rows.stage_run(ctx.db, ctx.board.board_id, item.item_id, op.visit :: integer, op.attempt :: integer)
    if perr then return nil, M.failed(perr) end
    if not previous or previous.outcome then return nil, done(ctx, item, M.item_group(item.item_id), {}) end
    return target, nil
end

function H.complete(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local target, refusal = H.current(ctx, op)
    if not target then return refusal :: types.OpPlan end
    return H.finish(ctx, target, op, {})
end

function H.finish(ctx: types.PrepareContext, target: types.ProcessTarget, op: types.Op, events: { domain.Event }): types.OpPlan
    local item: domain.StateItem = target.item
    local p: domain.Process = target.definition
    local state: domain.State = target.state
    events[#events + 1] = flow.report(item, op.outcome :: string, op.outputs, op.progress)
    item.version = item.version + 1
    local run = state.run :: domain.Stage
    if item.life == "trashed" or process.retry_delay(state, item.work, op.attempt :: integer, op.outcome :: string) then
        return done(ctx, item, M.item_group(item.item_id), events)
    end
    local id = op.outcome == "failed" and run.on_fail or op.outcome
    if op.outcome == "passed" then id = run.on_pass or "passed"
    elseif op.outcome == "canceled" then id = run.on_cancel or "canceled" end
    if op.outcome == "failed" and not run.on_fail then
        id = nil
        for _, transition in ipairs(process.leaving(p, item.state, false)) do
            if transition.id == "failed" then id = transition.id end
        end
        if not id then return done(ctx, item, M.item_group(item.item_id), events) end
    end
    if not id then return M.invalid("stage_outcome_transition_missing", "stage declares no transition for its outcome") end
    return context.record(ctx, item, target.model, id, events)
end

return H
