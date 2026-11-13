-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local report = require("report")
local M = require("prepare_context")
local context = require("process_context")
local types = require("types")
local domain = require("domain")
local H = {}

local function recorded(item: domain.StateItem, op: types.Op): { domain.Event }
    item.work.timer_due[op.timer :: string] = nil
    item.version = item.version + 1
    return { M.event(consts.EVENTS.TIMER_FIRED, M.item_group(item.item_id), {
        item = item.item_id, state = item.state, visit = item.work.visit or item.visit,
        timer = op.timer, scheduled_at = op.scheduled_at,
    }) }
end

local function declared(state: domain.State, id: string): domain.Timer?
    for _, timer in ipairs(state.timers or {}) do if timer.id == id then return timer end end
    return nil
end

local function retry(ctx: types.PrepareContext, item: domain.StateItem, op: types.Op, p: domain.Process): types.OpPlan
    local work = item.work :: domain.ProcessData
    local group = M.item_group(item.item_id)
    if not work.waiting then return context.done(ctx, item, group, {}) end
    if op.attempt ~= (work.attempt :: integer) + 1 then return context.done(ctx, item, group, {}) end
    local events = recorded(item, op)
    work.waiting, work.attempt = nil, op.attempt
    events[#events + 1] = M.event(consts.EVENTS.STAGE_ENTERED, group, {
        item = item.item_id, state = item.state, visit = item.visit, attempt = op.attempt,
    })
    item.version = item.version + 1
    return context.settle(ctx, item, events, p)
end

function H.plan(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local target, err = context.locate(ctx, op)
    if not target then return err :: types.OpPlan end
    local item = target.item
    local group = M.item_group(item.item_id)
    local work = item.work :: domain.ProcessData
    if (work.visit or item.visit) ~= op.visit then return context.done(ctx, item, group, {}) end
    if item.state ~= op.state then return context.done(ctx, item, group, {}) end
    local deadlines = work.timer_due
    if not deadlines then return context.done(ctx, item, group, {}) end
    local id, scheduled_at = op.timer :: string, op.scheduled_at :: string
    if deadlines[id] ~= scheduled_at then return context.done(ctx, item, group, {}) end
    if ctx.now < scheduled_at then return M.invalid("timer_not_due", "timer deadline is in the future") end
    if id:sub(1, #consts.STAGE_TIMER_PREFIX) == consts.STAGE_TIMER_PREFIX then
        if work.waiting or op.attempt ~= work.attempt then return context.done(ctx, item, group, {}) end
        local events = recorded(item, op)
        return report.finish(ctx, target, { op = "report", attempt = op.attempt, outcome = "failed", outputs = { error = "stage_timeout" } }, events)
    end
    if id == consts.WAIT_TIMER then
        local events = recorded(item, op)
        work.wait_done = true
        return context.settle(ctx, item, events, target.definition)
    end
    if id:sub(1, #consts.RETRY_TIMER_PREFIX) == consts.RETRY_TIMER_PREFIX then
        return retry(ctx, item, op, target.definition)
    end
    local timer = declared(target.state, id)
    if not timer then return M.invalid("timer_unknown", "timer is absent from the recorded process") end
    local effect = timer["then"] :: domain.TimerEffect
    local events = recorded(item, op)
    events[1].body.emitted = effect.emit
    if effect.transition then
        local refused = context.take(ctx, item, target.definition, effect.transition, events)
        if refused then return refused end
    end
    return context.settle(ctx, item, events, target.definition)
end
return H
