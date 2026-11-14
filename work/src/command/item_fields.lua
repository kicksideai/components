-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local references = require("references")
local consts = require("consts")
local domain = require("domain")
local store = require("store")
local types = require("types")
local flow = require("flow")
local uuid = require("uuid")
local document = require("document")
local fields = require("fields")
local process = require("process")
local when = require("when")
local seams = require("seams")

local rules = require("rules")
local M = require("prepare_context")
local EV = consts.EVENTS
-- Prepare of item creation, field changes and transitions.


local function type_fields(item_type: domain.ItemType): { [string]: boolean }
    local out: { [string]: boolean } = {}
    for _, key in ipairs(item_type.fields) do out[key] = true end
    return out
end

local function sorted_keys(map: { [string]: unknown }): { string }
    local keys: { string } = {}
    for k in pairs(map) do keys[#keys + 1] = k end
    table.sort(keys)
    return keys
end

-- value_steps builds the patch steps for the requested values against a document.
local function value_steps(board: domain.Board, item_type: domain.ItemType, doc: domain.Document, op: types.Op, creating: boolean?): ({ domain.PatchStep }?, types.OpPlan?)
    local allowed = type_fields(item_type)
    local authority = doc
    if creating then
        authority = {}
        for key, value in pairs(doc) do authority[key] = value end
        for key, raw in pairs(op.values or {}) do
            local f = board.model.fields[key]
            if f and f.type == "principal" then
                local value, err = fields.normalize(f, raw)
                if err or value == nil then return nil, M.invalid("invalid_value", tostring(err), key) end
                authority[tostring(f.id)] = { p = value }
            end
        end
    end
    local steps: { domain.PatchStep } = {}
    local touched: { [string]: boolean } = {}
    local function field_of(key: string): (domain.Field?, types.OpPlan?)
        local f = board.model.fields[key]
        if not f or not allowed[key] then
            return nil, M.invalid("unknown_field", "item type " .. item_type.id .. " has no field " .. key, key)
        end
        if not rules.field(board, f, "write", authority) then return nil, M.result("denied", M.FREE, "field_denied", "field " .. key .. " is denied", key) end
        if f.type == "rollup" or f.type == "formula" or f.type == "rank" then return nil, M.invalid("read_only", "field " .. key .. " is computed", key) end
        if touched[key] then return nil, M.invalid("duplicate_field", "field " .. key .. " is written twice", key) end
        touched[key] = true
        return f, nil
    end
    for _, key in ipairs(sorted_keys(op.values or {})) do
        local f, ferr = field_of(key)
        if ferr or not f then return nil, ferr end
        local value, verr = fields.normalize(f, (op.values :: { [string]: unknown })[key])
        if verr or value == nil then return nil, M.invalid("invalid_value", tostring(verr), key) end
        local step = document.set_step(doc, f.id, value)
        if step then steps[#steps + 1] = step end
    end
    for _, mode in ipairs({ "clear", "unset" }) do
        local names = op.unset
        if mode == "clear" then names = op.clear end
        for _, key in ipairs(names or {}) do
            local f, ferr = field_of(key)
            if ferr or not f then return nil, ferr end
            if f.type == "counter" then return nil, M.invalid("invalid_value", "field " .. key .. " is assigned by the board", key) end
            local step = document.remove_step(doc, f.id, mode)
            if step then steps[#steps + 1] = step end
        end
    end
    return steps, nil
end

local function plan_create(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local board = ctx.board
    local item_type = op.type and board.model.item_types[op.type]
    if not item_type then return M.invalid("unknown_type", "unknown item type " .. tostring(op.type), "type") end
    local p = board.model.processes[item_type.process] :: domain.Process
    local initial = p.initial
    if op.moved_from and op.state then initial = op.state end
    if op.state ~= nil and op.state ~= initial then return M.invalid("unknown_state", "item type " .. item_type.id .. " starts in " .. initial, "state") end
    local parent: domain.Item? = nil
    if type(op.parent) == "string" then
        local found, perr = M.locate(ctx, op.parent)
        if perr or not found then return perr or M.invalid("unknown_parent", "unknown parent", "parent") end
        local violation = M.parent_violation(board, item_type, found)
        if violation then return violation end
        local limit = M.child_limit(ctx, found)
        if limit then return limit end
        parent = found
    elseif op.parent ~= nil then
        return M.invalid("invalid_parent", "parent is an item id", "parent")
    end
    local doc: domain.Document = {}
    local steps, serr = value_steps(board, item_type, doc, op, true)
    if serr or not steps then return serr or M.invalid("invalid_value", "invalid values") end
    if parent then
        local written: { [integer]: boolean } = {}
        for _, s in ipairs(steps) do written[s.f] = true end
        for _, key in ipairs(item_type.inherit) do
            local f = board.model.fields[key]
            local inherited = f and document.value(parent.document, f.id)
            if f and inherited ~= nil and not written[f.id] then steps[#steps + 1] = { f = f.id, v = inherited } end
        end
    end
    local id = op.moved_from and op.item or uuid.v4()
    local id = id :: string
    local body: domain.EventBody = { item = id, type = item_type.id, parent = parent and parent.item_id or nil, state = initial, patch = steps :: { domain.PatchStep } }
    body.moved_from, body.operation_id = op.moved_from, op.operation_id
    local events: { domain.Event } = { M.event(op.moved_from and consts.EVENTS.ITEM_MOVED_IN or EV.ITEM_CREATED, M.item_group(id), body) }
    local entered = process.state_of(p, initial)
    if not entered then return M.invalid("move_state_unknown", "mapped target state is absent", "state") end
    local virtual: domain.Item = { board_id = board.board_id, item_id = id, number = 0, type = item_type.id, state = initial,
        category = entered and entered.category or "", process_generation = p.generation, visit = 1,
        parent_id = parent and parent.item_id, path = (parent and parent.path or "/") .. id .. "/", version = 1, life = "live", document = {},
        created_seq = 0, updated_seq = 0, created_at = ctx.now, updated_at = ctx.now }
    flow.initialize(virtual, entered :: domain.State, ctx.actor, ctx.now, p)
    document.apply_patch(virtual.document, steps :: { domain.PatchStep })
    local entry_err = entered and flow.entry(board, entered, virtual.document, p)
    if entry_err then return M.refused(M.FREE, entry_err) end
    local field, verr = fields.document(board.compiled, virtual.document)
    if verr then return M.invalid("invalid_value", verr:message(), field) end
    local settled, ferr, werr = flow.settle(board, virtual, ctx.actor, ctx.now, when.check(ctx), nil, ctx.auto)
    if werr then return M.failed(werr) end
    if ferr then return M.refused(M.FREE, ferr) end
    for _, e in ipairs(settled :: { domain.Event }) do events[#events + 1] = e end
    for _, event in ipairs(events) do
        local reference_err = not ctx.importing and references.patch(ctx, event.body.patch or {}) or nil
        if reference_err then return reference_err end
    end
    ctx.items[id] = virtual
    ctx.base[id] = 0
    M.reserve_child(ctx, parent and parent.item_id, 1)
    local plan: types.OpPlan = { status = "applied", events = events, group = M.FREE, item = id, version = virtual.version }
    return plan
end

local function plan_set(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local item, perr = M.locate(ctx, op.item)
    if perr or not item then return perr or M.invalid("item_required", "item required", "item") end
    local group = M.item_group(item.item_id)
    local conflict = M.stale(op, item)
    if conflict then return conflict end
    if item.life ~= "live" then return M.result("invalid", group, "item_trashed", "item " .. item.item_id .. " is in the trash", "item") end
    local item_type = ctx.board.model.item_types[item.type]
    if not item_type then return M.result("invalid", group, "unknown_type", "item type " .. item.type .. " is no longer declared", "item") end
    local steps, serr = value_steps(ctx.board, item_type, item.document, op)
    if serr or not steps then return serr or M.invalid("invalid_value", "invalid values") end
    local work = flow.copy(item)
    local events: { domain.Event } = {}
    if #steps > 0 then
        document.apply_patch(work.document, steps)
        work.version = work.version + 1
        events[#events + 1] = M.event(EV.ITEM_CHANGED, group, { item = item.item_id, patch = steps })
    end
    local p, process_err = store.process(ctx.db, ctx.board, item)
    if process_err then return M.failed(process_err) end
    local settled, ferr, werr = flow.settle(ctx.board, work, ctx.actor, ctx.now, when.check(ctx), p, ctx.auto)
    if werr then return M.failed(werr) end
    if ferr then return M.refused(group, ferr) end
    for _, event in ipairs(settled or {}) do events[#events + 1] = event end
    for _, event in ipairs(events) do
        local reference_err = not ctx.importing and references.patch(ctx, event.body.patch or {}) or nil
        if reference_err then return reference_err end
    end
    item.work = work.work
    item.document, item.state, item.category, item.visit, item.version = work.document, work.state, work.category, work.visit, work.version
    return M.done(ctx, item, group, events)
end

local function plan_transition(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local item, perr = M.locate(ctx, op.item)
    if perr or not item then return perr or M.invalid("item_required", "item required", "item") end
    local group = M.item_group(item.item_id)
    local conflict = M.stale(op, item)
    if conflict then return conflict end
    if item.life ~= "live" then return M.result("invalid", group, "item_trashed", "item " .. item.item_id .. " is in the trash", "item") end
    local item_type = ctx.board.model.item_types[item.type]
    if not item_type then return M.result("invalid", group, "unknown_type", "item type " .. item.type .. " is no longer declared", "item") end
    local p, process_err = store.process(ctx.db, ctx.board, item)
    if process_err then return M.failed(process_err) end
    local p = p :: domain.Process
    local t: domain.Transition? = nil
    for _, candidate in ipairs(p.transitions) do
        if candidate.id == op.transition then t = candidate end
    end
    if not t or (t.auto and t.people ~= true and not op.force) then
        return M.result("invalid", group, "unknown_transition", "process " .. p.id .. " has no transition " .. tostring(op.transition), "transition")
    end
    local state = process.state_of(p, item.state) :: domain.State
    local source = item.state
    if op.region ~= nil then
        if state.kind ~= "parallel" or not item.work or not item.work.regions or not item.work.regions[op.region] then
            return M.invalid("parallel_region_unknown", "transition names an unknown active region")
        end
        source = item.work.regions[op.region]
        state = process.state_of(p, source) :: domain.State
    end
    if op.force then
        local admin, aerr = M.allows(ctx, ctx.board.board_id, 8)
        if aerr then return M.failed(aerr) end
        if not admin then return M.result("denied", group, "process_force_denied", "force requires board ADMIN") end
    else
        local refusal = process.named_refusal(state, t)
        if refusal then return M.result("denied", group, refusal.code, refusal.message) end
    end
    local allowed = t.any
    for _, s in ipairs(t.from) do if s == source then allowed = true end end
    if not allowed then return M.result("invalid", group, "transition_not_allowed", "transition " .. t.id .. " does not leave state " .. source, "transition") end
    local check = when.check(ctx)
    local active = op.region and process.region(item, op.region, p) or item
    local permitted, werr = check(active, t.when)
    if werr then return M.failed(werr) end
    if not permitted then return M.result("denied", group, "when_failed", "transition " .. t.id .. " fails its when condition") end
    local allowed, findings, gerr = seams.guard(ctx.board, active, t, t.guards)
    if gerr then return M.failed(gerr) end
    if not allowed then return { status = "denied", events = {}, group = group, findings = findings } end
    local work = flow.copy(item)
    local steps, serr = value_steps(ctx.board, item_type, work.document, op)
    if serr or not steps then return serr or M.invalid("invalid_value", "invalid values") end
    document.apply_patch(work.document, steps)
    local events: { domain.Event } = {}
    local function cancel(active: domain.Item)
        local state = process.state_of(p, active.state) :: domain.State
        if state.kind == "automated" and active.work.attempt and not active.work.waiting then
            events[#events + 1] = flow.report(active, "canceled", { reason = "transition", by = ctx.actor })
            work.version = work.version + 1
        end
    end
    if op.region then cancel(process.region(work, op.region, p))
    else
        cancel(work)
        for id in pairs(work.work.region_data or {}) do cancel(process.region(work, id, p)) end
    end
    local taken, ferr, terr = flow.take(ctx.board, work, t, steps, ctx.actor, ctx.now, false, p, op.region, check)
    if terr then return M.failed(terr) end
    if ferr then return M.refused(group, ferr) end
    local settled, serr2, aerr = flow.settle(ctx.board, work, ctx.actor, ctx.now, check, p, ctx.auto)
    if aerr then return M.failed(aerr) end
    if serr2 then return M.refused(group, serr2) end
    if taken and op.force then taken.body.force = true end
    events[#events + 1] = taken :: domain.Event
    for _, e in ipairs(settled :: { domain.Event }) do events[#events + 1] = e end
    for _, event in ipairs(events) do
        local reference_err = not ctx.importing and references.patch(ctx, event.body.patch or {}) or nil
        if reference_err then return reference_err end
    end
    item.work = work.work
    item.document, item.state, item.category, item.visit, item.version = work.document, work.state, work.category, work.visit, work.version
    return M.done(ctx, item, group, events)
end


return { plan_create = plan_create, plan_set = plan_set, plan_transition = plan_transition }
