-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Process execution in prepare: takes a transition on a working copy of an item - effects, requirements,
-- the new state and visit - and follows the auto transitions the new state leaves by.
local consts = require("consts")
local document = require("document")
local fields = require("fields")
local process = require("process")
local durations = require("durations")
local types = require("types")
local identity = require("identity")
local declaration = require("declaration")
local seams = require("seams")

local M = {}

local function finding(code: string, message: string, field: string?): types.Finding
    return { code = code, message = message, field = field }
end

-- copy returns a working copy of an item: a transition changes the copy, and the caller adopts it on success.
function M.copy(item: types.Item): types.Item
    local doc: types.Document = {}
    for k, v in pairs(item.document) do doc[k] = v end
    return { findings = declaration.copy(item.findings), work = declaration.copy(item.work), board_id = item.board_id, item_id = item.item_id, number = item.number, type = item.type, state = item.state,
        category = item.category, process_generation = item.process_generation, visit = item.visit, parent_id = item.parent_id, path = item.path,
        rank = item.rank, version = item.version, life = item.life, life_at = item.life_at, document = doc, created_seq = item.created_seq,
        updated_seq = item.updated_seq, created_at = item.created_at, updated_at = item.updated_at }
end

-- present reports whether a field holds a value after the transition; the board assigns counters.
local function present(board: types.Board, doc: types.Document, key: string): boolean
    local f = board.model.fields[key]
    return f ~= nil and (f.type == "counter" or f.type == "rank" or document.value(doc, f.id) ~= nil)
end

local function effect_value(board: types.Board, doc: types.Document, e: types.Effect, actor: string, at: string): (types.Value?, error?)
    local f = board.model.fields[e.field]
    if e.op == "now" then return at, nil end
    if e.op == "actor" then
        local principal, err = identity.principal_of_key(actor)
        if err then return nil, err :: error end
        return fields.normalize(f, principal)
    end
    if e.op == "copy" then return document.value(doc, (board.model.fields[e.from :: string] :: types.Field).id), nil end
    return e.value, nil
end

-- effect_steps applies the effects of t to doc and returns the patch steps they make. steps already hold
-- the fields the caller writes.
local function effect_steps(board: types.Board, doc: types.Document, t: types.Transition, steps: { types.PatchStep }, actor: string, at: string): ({ types.PatchStep }?, types.Finding?)
    local touched: { [integer]: boolean } = {}
    for _, s in ipairs(steps) do touched[s.f] = true end
    local out: { types.PatchStep } = {}
    for _, e in ipairs(t.set) do
        local f = board.model.fields[e.field]
        if not f then return nil, finding("unknown_field", "transition " .. t.id .. " sets field " .. e.field .. ", which the board no longer declares", e.field) end
        if touched[f.id] then
            return nil, finding("effect_field", "field " .. f.code .. " is set by transition " .. t.id, f.code)
        end
        local step: types.PatchStep? = nil
        if e.op == "clear" then
            step = document.remove_step(doc, f.id, "clear")
        else
            local value, err = effect_value(board, doc, e, actor, at)
            if err then return nil, finding("invalid_value", tostring(err), f.code) end
            if value == nil then
                step = document.remove_step(doc, f.id, "unset")
            else
                step = document.set_step(doc, f.id, value)
            end
        end
        if step then
            document.apply_patch(doc, { step })
            out[#out + 1] = step
        end
    end
    return out, nil
end

function M.entry(board: types.Board, state: types.State, doc: types.Document, p: types.Process): types.Finding?
    local entering = { state }
    for _, region in ipairs(state.regions or {}) do entering[#entering + 1] = process.state_of(p, region.initial) :: types.State end
    for _, target in ipairs(entering) do
        for _, key in ipairs(target.require) do
            if not present(board, doc, key) then return finding("required_field", "state " .. target.id .. " needs " .. key, key) end
        end
    end
    return nil
end

local function admit(board: types.Board, item: types.Item, transition: types.Transition, check: types.WhenCheck): (types.Finding?, error?)
    local allowed, err = check(item, transition.when)
    if err then return nil, err end
    if not allowed then return finding("when_failed", "exhaustion transition condition fails"), nil end
    local admitted, findings, gerr = seams.guard(board, item, transition, transition.guards)
    if gerr then return nil, gerr end
    if not admitted then return findings[1] or finding("guard_denied", "exhaustion transition guard denies entry"), nil end
    return nil, nil
end

-- take moves the working item through t: it applies the effects, checks that the fields t and the target
-- state require are present, and returns the transition event. The item holds the new state only on success.
function M.take(board: types.Board, item: types.Item, t: types.Transition, steps: { types.PatchStep }, actor: string, at: string, auto: boolean, definition: types.Process?, region: string?, check: types.WhenCheck): (types.Event?, types.Finding?, error?)
    local p = (definition or board.model.processes[board.model.item_types[item.type].process]) :: types.Process
    local source = region and item.work.regions[region] or item.state
    local target = process.state_of(p :: types.Process, t.to)
    while target and target.run and target.run.on_exhausted
        and ((item.work.stage_visits or {})[target.id] or 0) >= (target.run.max_visits or board.compiled.policy.stage_max_visits :: integer) do
        for _, route in ipairs(p.transitions) do if route.id == target.run.on_exhausted then t = route; break end end
        local refused, err = admit(board, region and process.region(item, region, p) or item, t, check)
        if err or refused then return nil, refused, err end
        target = process.state_of(p, t.to)
    end
    if not target then return nil, finding("unknown_state", "transition " .. t.id .. " goes to state " .. t.to .. ", which the process no longer declares") end
    local doc: types.Document = {}
    for k, v in pairs(item.document) do doc[k] = v end
    local effects, ferr = effect_steps(board, doc, t, steps, actor, at)
    if ferr or not effects then return nil, ferr end
    local patch: { types.PatchStep } = {}
    for _, s in ipairs(steps) do patch[#patch + 1] = s end
    for _, s in ipairs(effects) do patch[#patch + 1] = s end
    for _, key in ipairs(t.require) do
        if not present(board, doc, key) then
            return nil, finding("required_field", "transition " .. t.id .. " needs " .. key, key)
        end
    end
    local entry_err = M.entry(board, target, doc, p)
    if entry_err then return nil, entry_err end
    item.document = doc
    item.visit = item.visit + 1
    if region then
        item.work.regions[region] = target.id
        local regional = process.region(item, region, p)
        regional.visit = item.visit
        process.initialize(regional :: types.Item, target, actor, at, p, true)
        item.work.region_data[region] = regional.work
        item.category = process.category(p, item)
    else
        item.state = target.id
        item.category = target.category
        M.initialize(item, target, actor, at, p)
    end
    local body: types.EventBody = { item = item.item_id, transition = t.id, from = source, to = t.to, visit = item.visit, patch = patch,
        auto = auto or nil, region = region }
    item.version = item.version + 1
    return { type = consts.EVENTS.ITEM_TRANSITIONED, subject = "i:" .. item.item_id, body = body }, nil
end

function M.initialize(item: types.Item, state: types.State, actor: string, at: string, p: types.Process)
    process.initialize(item, state, actor, at, p, true)
end

local function ready(state: types.State, item: types.Item, check: types.WhenCheck, p: types.Process): (boolean, error?)
    if state.kind == "automated" then return false, nil end
    local work = item.work or {}
    if state.kind == "gate" then
        if work.rejected then return false, nil end
        local release = state.release_when :: types.Release
        if release.wait and not work.wait_done then return false, nil end
        if release.approvals then
            local count = 0
            for _, decision in pairs(work.approvals or {}) do if decision == "approve" then count = count + 1 end end
            if count < release.approvals.min then return false, nil end
        end
        return check(item, release.when)
    end
    if state.kind == "parallel" then
        local done, total = 0, 0
        for _, id in pairs(work.regions or {}) do
            local region = process.state_of(p, id)
            total = total + 1
            if region and consts.TERMINAL[region.category] then done = done + 1 end
        end
        local required = state.join == "all" and total or state.join == "any" and 1 or state.join
        return done >= (required :: integer), nil
    end
    return true, nil
end

local function next_auto(board: types.Board, p: types.Process, item: types.Item, check: types.WhenCheck): (types.Transition?, error?)
    local default: types.Transition? = nil
    for _, candidate in ipairs(process.leaving(p, item.state, true)) do
        if candidate.default then default = candidate
        else
            local allowed, err = check(item, candidate.when)
            if err then return nil, err end
            if allowed then
                local admitted, _, gerr = seams.guard(board, item, candidate, candidate.guards)
                if gerr then return nil, gerr end
                if admitted then return candidate, nil end
            end
        end
    end
    if default then
        local allowed, _, err = seams.guard(board, item, default, default.guards)
        if err then return nil, err end
        if not allowed then return nil, nil end
    end
    return default, nil
end

function M.report(item: types.Item, outcome: string, outputs: types.JsonObject?, progress: types.JsonObject?): types.Event
    item.work.waiting = true
    return { type = consts.EVENTS.STAGE_REPORTED, subject = "i:" .. item.item_id,
        body = { item = item.item_id, state = item.state, visit = item.work.visit or item.visit,
            attempt = item.work.attempt, outcome = outcome, outputs = outputs, progress = progress } }
end

local function entry_event(board: types.Board, item: types.Item, state: types.State, p: types.Process): (types.Event?, error?, types.Transition?)
    local work = item.work
    if not work or not work.pending_entry then return nil, nil end
    for _, timer in ipairs(state.timers or {}) do
        local _, err = durations.deadline(timer, item, board, work.entered_at :: string)
        if err then return nil, err end
    end
    if state.kind == "automated" and (work.stage_visit :: integer) > (state.run.max_visits or board.compiled.policy.stage_max_visits :: integer)
        and state.run.on_exhausted then
        for _, route in ipairs(p.transitions) do if route.id == state.run.on_exhausted then return nil, nil, route end end
    end
    work.pending_entry = nil
    if state.kind ~= "automated" then return nil, nil end
    work.attempt, work.waiting = 1, nil
    if (work.stage_visit :: integer) > (state.run.max_visits or board.compiled.policy.stage_max_visits :: integer) then
        return M.report(item, "failed", { error = "stage_visits_exhausted" }), nil
    end
    return { type = consts.EVENTS.STAGE_ENTERED, subject = "i:" .. item.item_id,
        body = { item = item.item_id, state = item.state, visit = work.visit or item.visit, attempt = 1 } }, nil
end

-- settle shares one automatic-step budget across items and regions in the command.
function M.settle(board: types.Board, item: types.Item, actor: string, at: string, check: types.WhenCheck, definition: types.Process?, budget: types.AutoBudget?): ({ types.Event }?, types.Finding?, error?)
    local p = (definition or board.model.processes[board.model.item_types[item.type].process]) :: types.Process
    local events: { types.Event } = {}
    local budget = budget or { steps = 0, chain = {} }
    local chain = budget.chain
    chain[#chain + 1] = item.state
    while true do
        local state = process.state_of(p, item.state) :: types.State
        local entered, eerr, route = entry_event(board, item, state, p)
        if eerr then return nil, nil, eerr end
        if entered then events[#events + 1] = entered; item.version = item.version + 1 end
        local candidate: types.Transition? = route
        local exhausted = route ~= nil
        local region: string? = nil
        for _, declared in ipairs(state.regions or {}) do
            local regional = process.region(item, declared.id, p)
            local regional_state = process.state_of(p, regional.state) :: types.State
            local entered, eerr, route = entry_event(board, regional :: types.Item, regional_state, p)
            if eerr then return nil, nil, eerr end
            if entered then events[#events + 1] = entered; item.version = item.version + 1 end
            if route and not candidate then candidate, region, exhausted = route, declared.id, true end
            local released, rerr = ready(regional_state, regional :: types.Item, check, p)
            if rerr then return nil, nil, rerr end
            if released and not candidate then
                local next, nerr = next_auto(board, p, regional :: types.Item, check)
                if nerr then return nil, nil, nerr end
                if next then candidate, region = next, declared.id end
            end
        end
        if not candidate then
            local released, rerr = ready(state, item, check, p)
            if rerr then return nil, nil, rerr end
            if not released then return events, nil, nil end
            local nerr: error?
            candidate, nerr = next_auto(board, p, item, check)
            if nerr then return nil, nil, nerr end
        end
        if not candidate then return events, nil, nil end
        if budget.steps >= consts.LIMITS.auto_steps then
            return nil, finding("auto_chain_too_long", "auto transitions " .. table.concat(chain, " -> ") .. " -> " .. candidate.to .. " exceed " .. consts.LIMITS.auto_steps .. " steps"), nil
        end
        if exhausted then
            local refused, err = admit(board, region and process.region(item, region, p) or item, candidate, check)
            if err or refused then return nil, refused, err end
        end
        local event, ferr, terr = M.take(board, item, candidate, {}, actor, at, true, p, region, check)
        if terr then return nil, nil, terr end
        if ferr or not event then return nil, ferr, nil end
        events[#events + 1] = event
        budget.steps = budget.steps + 1
        chain[#chain + 1] = region and (region .. ":" .. candidate.to) or item.state
    end
end

return M
