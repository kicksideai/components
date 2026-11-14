-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local read_rows = require("read_rows")
local values = require("values")
local flow = require("flow")
local process = require("process")
local M = require("prepare_context")
local context = require("process_context")
local types = require("types")
local domain = require("domain")
local H = {}
local locate, done, take, settle = context.locate, context.done, context.take, context.settle

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
    if not consts.STAGE_OUTCOMES[op.outcome :: string] then return M.invalid("stage_outcome_invalid", "outcome is passed, failed or canceled") end
    if #values.canonical(op.outputs or {}) > consts.LIMITS.stage_outputs then return M.invalid("stage_outputs_limit", "stage outputs exceed 64 KB") end
    return H.finish(ctx, target, op, {})
end

function H.finish(ctx: types.PrepareContext, target: types.ProcessTarget, op: types.Op, events: { domain.Event }): types.OpPlan
    local item: domain.StateItem = target.item
    local p: domain.Process = target.definition
    local state: domain.State = target.state
    events[#events + 1] = flow.report(item, op.outcome :: string, op.outputs, op.progress)
    item.version = item.version + 1
    local run = state.run :: domain.Stage
    local retry = run.retry
    if op.outcome == "failed" and retry then
        if (op.attempt :: integer) < retry.max then return done(ctx, item, M.item_group(item.item_id), events) end
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
    local refused = take(ctx, item, p, id, events)
    if refused then return refused end
    return settle(ctx, item, events, p)
end

return H
