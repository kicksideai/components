-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local process = require("process")
local approvals = require("approvals")
local M = require("prepare_context")
local context = require("process_context")
local types = require("types")
local domain = require("domain")
local H = {}
local locate, done, take, settle = context.locate, context.done, context.take, context.settle

function H.plan(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local target, err = locate(ctx, op)
    if not target then return err :: types.OpPlan end
    local item: domain.StateItem = target.item
    local p: domain.Process = target.definition
    local state: domain.State = target.state
    if state.kind ~= "gate" then return M.invalid("approval_gate_required", "approval requires an approval gate") end
    local release = state.release_when :: domain.Release
    local rule = release.approvals
    if not rule then return M.invalid("approval_gate_required", "approval requires an approval gate") end
    if op.visit ~= item.visit then return M.invalid("approval_visit_mismatch", "approval visit differs from the current visit") end
    local work = item.work :: domain.ProcessData
    local refusal, aerr = approvals.check(rule, item, ctx.actor, ctx.board, target.model)
    if aerr then return M.failed(aerr) end
    if refusal then return M.result("denied", M.item_group(item.item_id), refusal.code, refusal.message) end
    local decision = op.decision
    if decision == nil then decision = "approve" end
    if decision ~= "approve" and decision ~= "reject" then return M.invalid("approval_decision_invalid", "decision is approve or reject") end
    work.approvals = work.approvals or {}
    if work.approvals[ctx.actor] == decision then return done(ctx, item, M.item_group(item.item_id), {}) end
    work.approvals[ctx.actor] = decision
    local events = { M.event(consts.EVENTS.APPROVAL_RECORDED, M.item_group(item.item_id), { item = item.item_id, gate = item.state, visit = item.visit, decision = decision }) }
    item.version = item.version + 1
    if decision == "reject" then
        work.rejected = true
        local transition: domain.Transition? = nil
        for _, t in ipairs(process.leaving(p, item.state, false)) do if t.id == "reject" then transition = t end end
        if transition then
            local refused = take(ctx, item, p, "reject", events)
            if refused then return refused end
        end
    end
    return settle(ctx, item, events, p)
end

return H
