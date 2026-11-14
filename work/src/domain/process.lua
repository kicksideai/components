-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Compile process declarations and manage item states, visits and regions.
local consts = require("consts")
local fields = require("fields")
local values = require("values")
local types = require("types")
local state_compile = require("state_compile")
local transitions = require("transitions")

local M = {}

local STATE_KEYS = consts.STATE_KEYS
local TRANSITION_KEYS = consts.TRANSITION_KEYS
local PROCESS_KEYS = consts.PROCESS_KEYS

local function invalid(message: string, code: string?, details: types.JsonObject?): error
    local d: types.JsonObject = details or {}
    d.code = code or "invalid_schema"
    return errors.new({ kind = errors.INVALID, message = message, details = d })
end

local function valid_id(id: unknown): boolean
    return type(id) == "string" and id:match(consts.ID_PATTERN) ~= nil and #id <= 40
end

local function reject_keys(decl: { [string]: unknown }, known: { [string]: boolean }, where: string): error?
    local names: { string } = {}
    for k in pairs(decl) do names[#names + 1] = tostring(k) end
    table.sort(names)
    for _, k in ipairs(names) do
        if not known[k] then return invalid("unknown key " .. k .. " on " .. where) end
    end
    return nil
end

local function field_keys(list: { string }?, by_key: { [string]: types.Field }, where: string): ({ string }?, error?)
    local out: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, key in ipairs((list or {})) do
        if not by_key[key] then return nil, invalid(where .. " names unknown field " .. tostring(key)) end
        if seen[key] then return nil, invalid(where .. " names field " .. key .. " twice") end
        seen[key] = true
        out[#out + 1] = key
    end
    return out, nil
end

local function compile_state(decl: types.StateDecl, by_key: { [string]: types.Field }, process: string): (types.State?, error?)
    local where = "state of process " .. process
    local kerr = reject_keys(decl :: { [string]: unknown }, STATE_KEYS, where)
    if kerr then return nil, kerr end
    if not valid_id(decl.id) then return nil, invalid("state id must match " .. consts.ID_PATTERN) end
    if not consts.CATEGORIES[decl.category] then
        return nil, invalid("state " .. decl.id .. " has unknown category " .. tostring(decl.category))
    end
    local kind = decl.kind or "human"
    if not consts.STATE_KINDS[kind] then return nil, invalid("state " .. decl.id .. " has unknown kind " .. tostring(kind)) end
    if decl.stage ~= nil and (type(decl.stage) ~= "string" or decl.stage == "") then
        return nil, invalid("state " .. decl.id .. " stage is a label")
    end
    local shape_err = state_compile.compile(decl, by_key)
    if shape_err then return nil, shape_err end
    local assign: { types.PrincipalDecl } = {}
    for _, p in ipairs((decl.assign or {})) do
        if type(p) ~= "table" or not consts.PRINCIPAL_KINDS[p.kind] or type(p.id) ~= "string" or p.id == "" then
            return nil, invalid("state " .. decl.id .. " assigns principals as { kind, id }")
        end
        assign[#assign + 1] = { kind = p.kind, id = p.id }
    end
    local require, rerr = field_keys(decl.require, by_key, "state " .. decl.id .. " require")
    if rerr or not require then return nil, rerr end
    return { id = decl.id, name = decl.name or decl.id, category = decl.category, kind = kind, awaiting = decl.awaiting, stage = decl.stage, assign = assign,
        require = require, invariants = decl.invariants, due = decl.due, timers = decl.timers, run = decl.run, release_when = decl.release_when, regions = decl.regions, join = decl.join }, nil
end

local function same_options(source: types.Field, target: types.Field): boolean
    local held: { [string]: boolean } = {}
    for _, o in ipairs(target.options or {}) do held[o.id] = true end
    for _, o in ipairs(source.options or {}) do
        if not held[o.id] then return false end
    end
    return true
end

local function compile_effect(decl: types.EffectDecl, by_key: { [string]: types.Field }, where: string): (types.Effect?, error?)
    local field = type(decl) == "table" and type(decl.field) == "string" and by_key[decl.field] or nil
    if not field then return nil, invalid(where .. " sets unknown field " .. tostring(type(decl) == "table" and decl.field or nil)) end
    local forms = 0
    if decl.value ~= nil then forms = forms + 1 end
    if decl.clear ~= nil then forms = forms + 1 end
    if decl.copy ~= nil then forms = forms + 1 end
    if forms ~= 1 then return nil, invalid(where .. " effect on " .. field.code .. " is one of value, clear or copy") end
    if field.type == "counter" or field.type == "rollup" or field.type == "formula" or field.type == "rank" then return nil, invalid(where .. " cannot set the counter field " .. field.code) end
    if decl.clear ~= nil then
        if decl.clear ~= true then return nil, invalid(where .. " clear on " .. field.code .. " is true") end
        return { field = field.code, op = "clear" }, nil
    end
    if decl.copy ~= nil then
        local source = type(decl.copy) == "string" and by_key[decl.copy] or nil
        if not source then return nil, invalid(where .. " copies unknown field " .. tostring(decl.copy)) end
        if source.type ~= field.type or source.form ~= field.form or source.cardinality ~= field.cardinality then
            return nil, invalid(where .. " copies " .. source.code .. " into " .. field.code .. ", which holds another kind of value")
        end
        if field.type == "option" and not same_options(source, field) then
            return nil, invalid(where .. " copies " .. source.code .. " into " .. field.code .. ", which lacks some of its options")
        end
        return { field = field.code, op = "copy", from = source.code }, nil
    end
    if decl.value == "$now" then
        if field.form ~= "time" or field.cardinality ~= "one" then return nil, invalid(where .. " sets $now on " .. field.code .. ", which is not a single time") end
        return { field = field.code, op = "now" }, nil
    end
    if decl.value == "$actor" then
        if field.type ~= "principal" or field.cardinality ~= "one" then
            return nil, invalid(where .. " sets $actor on " .. field.code .. ", which is not a single principal")
        end
        return { field = field.code, op = "actor" }, nil
    end
    if type(decl.value) == "string" and (decl.value :: string):sub(1, 1) == "$" then
        return nil, invalid(where .. " sets unknown token " .. (decl.value :: string) .. " on " .. field.code)
    end
    local value, err = fields.normalize(field, decl.value)
    if err or value == nil then return nil, invalid(where .. " sets an invalid value on " .. field.code .. ": " .. tostring(err)) end
    return { field = field.code, op = "literal", value = value }, nil
end

local function compile_transition(decl: types.TransitionDecl, ids: { [string]: boolean }, by_key: { [string]: types.Field }, process: string): (types.Transition?, error?)
    local where = "transition of process " .. process
    local kerr = reject_keys(decl :: { [string]: unknown }, TRANSITION_KEYS, where)
    if kerr then return nil, kerr end
    if not valid_id(decl.id) then return nil, invalid("transition id must match " .. consts.ID_PATTERN) end
    where = "transition " .. decl.id
    if not ids[tostring(decl.to)] then return nil, invalid(where .. " goes to unknown state " .. tostring(decl.to)) end
    local from: { string } = {}
    local any = false
    if decl.from == "any" then
        any = true
    elseif type(decl.from) == "table" and #(decl.from :: { unknown }) > 0 then
        local seen: { [string]: boolean } = {}
        for _, s in ipairs(decl.from :: { unknown }) do
            if type(s) ~= "string" or not ids[s] then return nil, invalid(where .. " leaves unknown state " .. tostring(s)) end
            if seen[s] then return nil, invalid(where .. " leaves state " .. s .. " twice") end
            seen[s] = true
            from[#from + 1] = s
        end
    else
        return nil, invalid(where .. " from is a list of states or any")
    end
    local auto = decl.auto == true
    local default = decl.default == true
    if decl.auto ~= nil and type(decl.auto) ~= "boolean" then return nil, invalid(where .. " auto is true or false") end
    if decl.people ~= nil and type(decl.people) ~= "boolean" then return nil, invalid(where .. " people is true or false") end
    if decl.default ~= nil and type(decl.default) ~= "boolean" then return nil, invalid(where .. " default is true or false") end
    if default and not auto then return nil, invalid(where .. " is a default but not auto") end
    if decl.order ~= nil and (math.type(decl.order) ~= "integer" or (decl.order :: integer) < 0) then
        return nil, invalid(where .. " order is a non-negative integer")
    end
    local require, rerr = field_keys(decl.require, by_key, where .. " require")
    if rerr or not require then return nil, rerr end
    local set: { types.Effect } = {}
    local written: { [string]: boolean } = {}
    for _, e in ipairs((decl.set or {})) do
        local effect, eerr = compile_effect(e, by_key, where)
        if eerr or not effect then return nil, eerr end
        if written[effect.field] then return nil, invalid(where .. " sets field " .. effect.field .. " twice") end
        written[effect.field] = true
        set[#set + 1] = effect
    end
    return { id = decl.id, name = decl.name or decl.id, from = from, any = any, to = decl.to, require = require, set = set, auto = auto,
        order = decl.order or 0, default = default, when = decl.when, guards = decl.guards, people = decl.people }, nil
end

-- Automatic edges without effects form an acyclic graph, including conditional branches.
local function check_auto(p: types.Process): error?
    local edges: { [string]: { types.Transition } } = {}
    local defaults: { [string]: boolean } = {}
    for _, t in ipairs(p.transitions) do
        if t.auto then
            if t.any then return invalid("auto transition " .. t.id .. " cannot leave any state", "process_auto_cycle", { transition = t.id }) end
            for _, state in ipairs(t.from) do
                if t.default and defaults[state] then return invalid("state " .. state .. " has more than one default", "process_default_duplicate", { state = state }) end
                if t.default then defaults[state] = true end
                local source = M.state_of(p, state) :: types.State
                local external = source.kind == "automated" or source.kind == "parallel"
                    or (source.release_when and (source.release_when.wait ~= nil or source.release_when.approvals ~= nil))
                local deterministic = (t.default or t.when == nil) and #M.leaving(p, state, true) == 1
                if not external and (#t.set == 0 or deterministic) then
                    edges[state] = edges[state] or {}
                    edges[state][#edges[state] + 1] = t
                end
            end
        end
    end
    return state_compile.acyclic(edges, "process_auto_cycle", "automatic")
end

local function check_map(decl: types.ProcessDecl, ids: { [string]: boolean }): error?
    if decl.map == nil then return nil end
    if type(decl.map) ~= "table" then return invalid("map of process " .. decl.id .. " is { old_state: new_state }") end
    for old, new in pairs(decl.map) do
        if ids[old] then return invalid("map of process " .. decl.id .. " names state " .. old .. ", which the process still declares") end
        if type(new) ~= "string" or not ids[new] then
            return invalid("map of process " .. decl.id .. " sends " .. tostring(old) .. " to unknown state " .. tostring(new))
        end
    end
    return nil
end

function M.behavior(value: unknown): string
    local body: types.JsonObject = {}
    for key, entry in pairs(value :: types.JsonObject) do
        if key ~= "name" and key ~= "generation" then body[key] = entry end
    end
    return values.canonical(body)
end

local function same_definition(a: types.Process, b: types.Process): boolean
    return a.name == b.name and M.behavior(a) == M.behavior(b)
end

-- compile turns one process declaration into its compiled form. prev is the compiled process the board
-- held; generation stamps a definition that differs from it.
function M.compile(decl: types.ProcessDecl, by_key: { [string]: types.Field }, prev: types.Process?, generation: integer): (types.Process?, error?)
    local kerr = reject_keys(decl :: { [string]: unknown }, PROCESS_KEYS, "process " .. tostring(decl.id))
    if kerr then return nil, kerr end
    if not valid_id(decl.id) then return nil, invalid("process id must match " .. consts.ID_PATTERN) end
    local source = (decl.states or {})
    if #source == 0 then return nil, invalid("process " .. decl.id .. " declares no states") end
    if #source > consts.LIMITS.states then
        return nil, invalid("a process declares at most " .. consts.LIMITS.states .. " states", "process_limit", { process = decl.id })
    end
    local transitions = (decl.transitions or {})
    if #transitions > consts.LIMITS.transitions then
        return nil, invalid("a process declares at most " .. consts.LIMITS.transitions .. " transitions", "process_limit", { process = decl.id })
    end
    local states: { types.State } = {}
    local ids: { [string]: boolean } = {}
    local initial_kind: string? = nil
    for _, s in ipairs(source) do
        local state, serr = compile_state(s, by_key, decl.id)
        if serr or not state then return nil, serr end
        if ids[state.id] then return nil, invalid("duplicate state " .. state.id .. " in process " .. decl.id) end
        ids[state.id] = true
        states[#states + 1] = state
        if state.id == decl.initial then initial_kind = state.kind end
    end
    if type(decl.initial) ~= "string" or not ids[decl.initial] then
        return nil, invalid("process " .. decl.id .. " needs an initial state it declares")
    end
    local out: { types.Transition } = {}
    local seen: { [string]: types.Transition } = {}
    for _, t in ipairs(transitions) do
        local transition, terr = compile_transition(t, ids, by_key, decl.id)
        if terr or not transition then return nil, terr end
        if seen[transition.id] then return nil, invalid("duplicate transition " .. transition.id .. " in process " .. decl.id) end
        seen[transition.id] = transition
        out[#out + 1] = transition
    end
    local exhausted: { [string]: { types.Transition } } = {}
    for _, s in ipairs(states) do
        for _, region in ipairs(s.regions or {}) do
            if not ids[region.initial] then return nil, invalid("region initial state is unknown", "parallel_initial_unknown") end
        end
        if s.run and s.run.on_exhausted then
            local route = seen[s.run.on_exhausted]
            if not route or route.auto then return nil, invalid("on_exhausted names a manual transition", "stage_on_exhausted_unknown") end
            exhausted[s.id] = { route }
            local sources: { string } = {}
            if s.id == decl.initial then sources[#sources + 1] = "*" end
            for _, target in pairs(decl.map or {}) do if target == s.id then sources[#sources + 1] = "*" end end
            for _, parent in ipairs(states) do
                for _, region in ipairs(parent.regions or {}) do
                    if region.initial == s.id then sources[#sources + 1] = "*" end
                end
            end
            for _, incoming in ipairs(out) do
                if incoming.to == s.id then
                    if incoming.any then sources[#sources + 1] = "*" end
                    for _, source in ipairs(incoming.from) do sources[#sources + 1] = source end
                end
            end
            for _, source in ipairs(sources) do
                local leaves = route.any
                for _, from in ipairs(route.from) do if from == source then leaves = true end end
                if not leaves or route.to == source then
                    return nil, invalid("on_exhausted leaves every incoming source or is global", "stage_on_exhausted_unknown", { state = s.id, transition = route.id })
                end
            end
        end
        if s.run then
            local routes: { [string]: string? } = { on_pass = s.run.on_pass, on_cancel = s.run.on_cancel, on_fail = s.run.on_fail }
            for name, id in pairs(routes) do
                if id then
                    local transition = seen[id]
                    local leaves = false
                    if transition then
                        leaves = transition.any
                        for _, from in ipairs(transition.from) do if from == s.id then leaves = true end end
                    end
                    if not leaves then
                        return nil, invalid(name .. " names no transition leaving this state", "stage_" .. name .. "_unknown", { state = s.id, transition = id })
                    end
                end
            end
        end
        for _, timer in ipairs(s.timers or {}) do
            local effect = timer["then"] :: types.TimerEffect
            if effect.transition and not seen[effect.transition] then return nil, invalid("timer names an unknown transition", "timer_transition_unknown") end
        end
    end
    local cycle = state_compile.acyclic(exhausted, "stage_on_exhausted_cycle", "exhaustion")
    if cycle then return nil, cycle end
    local migration = decl.migration or consts.MIGRATION_DEFAULTS[initial_kind :: string]
    if not consts.MIGRATIONS[migration] then return nil, invalid("process " .. decl.id .. " migration is follow or pin") end
    local merr = check_map(decl, ids)
    if merr then return nil, merr end
    local p: types.Process = { id = decl.id, name = decl.name or decl.id, initial = decl.initial, migration = migration, generation = generation,
        states = states, transitions = out }
    local aerr = check_auto(p)
    if aerr then return nil, aerr end
    if prev and same_definition(prev, p) then p.generation = prev.generation end
    return p, nil
end

-- fields_used lists the fields a process reads or writes.
function M.fields_used(p: types.Process): { string }
    local seen: { [string]: boolean } = {}
    local out: { string } = {}
    local function use(key: string)
        if not seen[key] then
            seen[key] = true
            out[#out + 1] = key
        end
    end
    for _, s in ipairs(p.states) do
        for _, key in ipairs(s.require) do use(key) end
    end
    for _, t in ipairs(p.transitions) do
        for _, key in ipairs(t.require) do use(key) end
        for _, e in ipairs(t.set) do
            use(e.field)
            if e.from then use(e.from) end
        end
    end
    table.sort(out)
    return out
end

-- state_of returns the state a process declares under id.
function M.state_of(p: types.Process, id: string): types.State?
    for _, s in ipairs(p.states) do
        if s.id == id then return s end
    end
    return nil
end

function M.holds_state(item: types.Item, state: string): boolean
    if item.state == state then return true end
    for _, held in pairs(item.work and item.work.regions or {}) do if held == state then return true end end
    return false
end

M.named_refusal = transitions.named_refusal
M.leaving = transitions.leaving
M.people = transitions.people

-- initialize records a state entry and its declared region values.
function M.initialize(item: types.Item, state: types.State, actor: string, at: string, p: types.Process, pending: boolean?)
    local root = (item :: types.StateItem).root
    local visits = (root and root.work and root.work.stage_visits) or (item.work and item.work.stage_visits) or {}
    item.work = { visit = item.visit, entered_at = at, entered_by = actor, pending_entry = pending or nil }
    if root then root.work.stage_visits = visits else item.work.stage_visits = visits end
    if state.kind == "automated" then
        visits[state.id] = (visits[state.id] or 0) + 1
        item.work.stage_visit = visits[state.id]
    end
    if state.regions then
        item.work.regions, item.work.region_data = {}, {}
        for _, region in ipairs(state.regions) do
            item.visit = item.visit + 1
            item.work.regions[region.id] = region.initial
            local data: types.StateData = { visit = item.visit, entered_at = at, entered_by = actor, pending_entry = pending or nil }
            if (M.state_of(p, region.initial) :: types.State).kind == "automated" then
                visits[region.initial] = (visits[region.initial] or 0) + 1
                data.stage_visit = visits[region.initial]
            end
            item.work.region_data[region.id] = data
        end
    end
    item.category = M.category(p, item)
end

-- region exposes one active region to the same state evaluator.
function M.region(item: types.Item, id: string, p: types.Process?): types.StateItem
    local out: { [string]: unknown } = {}
    for key, value in pairs(item :: { [string]: unknown }) do out[key] = value end
    local target: types.StateItem = out :: types.StateItem
    target.root, target.region = item, id
    target.state = item.work.regions[id] :: string
    target.work = item.work.region_data[id] :: types.ProcessData
    target.visit = target.work.visit :: integer
    if p then target.category = (M.state_of(p, target.state) :: types.State).category end
    return target
end

function M.for_visit(item: types.Item, visit: integer?, p: types.Process?): types.StateItem?
    if not item.work or item.work.visit == visit then return item end
    for id, data in pairs(item.work.region_data or {}) do
        if data.visit == visit then return M.region(item, id, p) end
    end
    return nil
end

function M.sync(item: types.StateItem)
    local root = item.root
    if not root then return end
    root.work.regions[item.region :: string] = item.state
    root.work.region_data[item.region :: string] = item.work
    root.document, root.version = item.document, item.version
end

function M.migrate_regions(item: types.Item, p: types.Process, state_map: { [string]: string }, actor: string, at: string, pending: boolean?): ({ string }?, error?)
    local state = M.state_of(p, item.state) :: types.State
    local entered: { string } = {}
    if state.kind ~= "parallel" then return entered, nil end
    local regions: { [string]: string } = {}
    local data: { [string]: types.ProcessData } = {}
    for _, region in ipairs(state.regions or {}) do
        local held = item.work.regions[region.id]
        local target_id = (held and (state_map[held] or held) or region.initial) :: string
        local target = M.state_of(p, target_id)
        if not target then return nil, errors.new({ kind = errors.INVALID, message = "regional state has no migration destination", details = { code = "migration_state_unmapped", state = target_id } }) end
        if target_id ~= held then
            item.visit = item.visit + 1
            local regional: types.StateItem = { root = item, region = region.id, item_id = item.item_id, state = target_id, visit = item.visit } :: types.StateItem
            M.initialize(regional, target, actor, at, p, pending)
            data[region.id] = regional.work
            entered[#entered + 1] = region.id
        else data[region.id] = item.work.region_data[region.id] end
        regions[region.id] = target_id
    end
    item.work.regions, item.work.region_data = regions, data
    return entered, nil
end

function M.category(p: types.Process, item: types.Item): string
    local state = M.state_of(p, item.state) :: types.State
    if state.kind ~= "parallel" then return state.category end
    local canceled = false
    for _, id in pairs(item.work and item.work.regions or {}) do
        local region = M.state_of(p, id) :: types.State
        if not consts.TERMINAL[region.category] then return state.category end
        canceled = canceled or region.category == "canceled"
    end
    return canceled and "canceled" or "completed"
end

return M
