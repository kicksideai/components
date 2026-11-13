-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local process = require("process")
local flow = require("flow")
local when = require("when")
local seams = require("seams")
local M = require("prepare_context")
local types = require("types")
local domain = require("domain")
local C = {}

function C.done(ctx: types.PrepareContext, item: domain.StateItem, group: string, events: { domain.Event }): types.OpPlan
    process.sync(item)
    return M.done(ctx, item.root or item, group, events)
end

function C.settle(ctx: types.PrepareContext, item: domain.StateItem, events: { domain.Event }, p: domain.Process): types.OpPlan
    process.sync(item)
    item = item.root or item
    local settled, finding, err = flow.settle(ctx.board, item, ctx.actor, ctx.now, when.check(ctx), p, ctx.auto)
    if err then return M.failed(err) end
    if finding then return M.refused(M.item_group(item.item_id), finding) end
    for _, e in ipairs(settled or {}) do events[#events + 1] = e end
    return C.done(ctx, item, M.item_group(item.item_id), events)
end

function C.take(ctx: types.PrepareContext, item: domain.StateItem, p: domain.Process, id: string, events: { domain.Event }): types.OpPlan?
    local transition: domain.Transition? = nil
    for _, t in ipairs(process.leaving(p, item.state, false)) do if t.id == id then transition = t end end
    if not transition then return M.invalid("process_transition_missing", "state has no transition " .. id) end
    local allowed, err = when.check(ctx)(item, transition.when)
    if err then return M.failed(err) end
    if not allowed then return M.result("denied", M.item_group(item.item_id), "when_failed", "transition condition fails") end
    local admitted, findings, gerr = seams.guard(ctx.board, item, transition, transition.guards)
    if gerr then return M.failed(gerr) end
    if not admitted then return { status = "denied", events = {}, group = M.item_group(item.item_id), findings = findings } end
    process.sync(item)
    local event, finding, terr = flow.take(ctx.board, item.root or item, transition, {}, ctx.actor, ctx.now, false, p, item.region, when.check(ctx))
    if terr then return M.failed(terr) end
    if finding then return M.refused(M.item_group(item.item_id), finding) end
    events[#events + 1] = event :: domain.Event
    if item.root then
        local refreshed = process.region(item.root, item.region :: string, p)
        item.state, item.work, item.visit, item.version, item.document = refreshed.state, refreshed.work, refreshed.visit, refreshed.version, refreshed.document
    end
    return nil
end


function C.locate(ctx: types.PrepareContext, op: types.Op): (types.ProcessTarget?, types.OpPlan?)
    local found, perr = M.locate(ctx, op.item)
    if not found then return nil, perr end
    if found.life ~= "live" then return nil, M.invalid("item_trashed", "process commands require a live item") end
    local conflict = M.stale(op, found)
    if conflict then return nil, conflict end
    local model, err = store.process_model(ctx.db, ctx.board, found)
    if err or not model then return nil, M.failed(err :: error) end
    local p = model.processes[model.item_types[found.type].process]
    local item: domain.StateItem = found
    if op.visit then
        local target = process.for_visit(found, op.visit, p)
        if target then item = target end
    end
    local state = process.state_of(p :: domain.Process, item.state)
    if not state then return nil, M.invalid("process_state_missing", "recorded process has no active state") end
    return { model = model, item = item, definition = p :: domain.Process, state = state }, nil
end

function C.advance(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local target, err = C.locate(ctx, op)
    if not target then return err :: types.OpPlan end
    return C.settle(ctx, target.item, {}, target.definition)
end

return C
