-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- types.Process changes are classified against the states items hold.
local process = require("process")
local types = require("types")

local M = {}

local function held_by(process: string, next: types.Compiled, usage: types.Usage, state: string): integer
    local n = 0
    for _, t in ipairs(next.item_types) do
        if t.process == process then n = n + ((usage.states[t.id] or {})[state] or 0) end
    end
    return n
end

local function change(out: { types.SchemaChange }, what: string, id: string, class: string, detail: string?, to: string?, count: integer?)
    out[#out + 1] = { code = "process " .. id, what = what, class = class, detail = detail, to = to, count = count }
end

local function state_change(old: types.State, new: types.State?): string?
    if not new then return "state.remove" end
    if new.kind ~= old.kind then return "state.kind" end
    if new.category ~= old.category then return "state.category" end
    if process.behavior(new) ~= process.behavior(old) then return "state.change" end
    if new.name ~= old.name then return "state.name" end
    return nil
end

-- Only changes which return a held count or depend on one select a state.
function M.usage_targets(prev: types.Model, next: types.Model): { types.StateUsageTarget }
    local targets: { types.StateUsageTarget } = {}
    local affected: { [string]: { string } } = {}
    for _, old in ipairs(prev.compiled.processes) do
        local new = next.processes[old.id]
        if new then
            local states: { string } = {}
            for _, state in ipairs(old.states) do
                local what = state_change(state, process.state_of(new, state.id))
                if what and what ~= "state.name" then states[#states + 1] = state.id end
            end
            affected[old.id] = states
        end
    end
    for _, item_type in ipairs(next.compiled.item_types) do
        for _, state in ipairs(affected[item_type.process] or {}) do
            targets[#targets + 1] = { item_type = item_type.id, state = state }
        end
    end
    return targets
end

local function diff_states(out: { types.SchemaChange }, old: types.Process, new: types.Process, next: types.Compiled, usage: types.Usage, map: { [string]: string })
    for _, s in ipairs(old.states) do
        local kept = process.state_of(new, s.id)
        local what = state_change(s, kept)
        if not kept then
            local n = held_by(old.id, next, usage, s.id)
            if n == 0 then
                change(out, "state.remove", old.id, "semantic", s.id)
            elseif new.migration == "follow" and map[s.id] then
                change(out, "state.map", old.id, "semantic", s.id, map[s.id], n)
            else
                change(out, "state.remove", old.id, "refused", s.id, nil, n)
            end
        elseif what == "state.name" then
            change(out, what, old.id, "cosmetic", s.id)
        elseif what then
            local class = what == "state.kind" and "refused" or "semantic"
            local to = what == "state.kind" and kept.kind or (what == "state.category" and kept.category or nil)
            change(out, what, old.id, class, s.id, to, held_by(old.id, next, usage, s.id))
        end
    end
    for _, s in ipairs(new.states) do
        if not process.state_of(old, s.id) then change(out, "state.add", old.id, "additive", s.id) end
    end
end

local function diff_transitions(out: { types.SchemaChange }, old: types.Process, new: types.Process)
    local old_by: { [string]: types.Transition } = {}
    local new_by: { [string]: types.Transition } = {}
    for _, t in ipairs(new.transitions) do new_by[t.id] = t end
    for _, t in ipairs(old.transitions) do
        old_by[t.id] = t
        local kept = new_by[t.id]
        if not kept then
            change(out, "transition.remove", old.id, "semantic", t.id)
        elseif process.behavior(kept) ~= process.behavior(t) then
            change(out, "transition.change", old.id, "semantic", t.id)
        elseif kept.name ~= t.name then
            change(out, "transition.name", old.id, "cosmetic", t.id)
        end
    end
    for _, t in ipairs(new.transitions) do
        if not old_by[t.id] then change(out, "transition.add", old.id, "additive", t.id) end
    end
end

-- changes classifies process changes against held states and this apply's state maps.
function M.changes(out: { types.SchemaChange }, prev: types.Compiled, next: types.Compiled, usage: types.Usage, maps: { [string]: { [string]: string } })
    local new_by: { [string]: types.Process } = {}
    for _, p in ipairs(next.processes) do new_by[p.id] = p end
    local old_by: { [string]: types.Process } = {}
    for _, old in ipairs(prev.processes) do
        old_by[old.id] = old
        local new = new_by[old.id]
        if not new then
            change(out, "remove", old.id, "semantic")
        else
            if old.initial ~= new.initial then change(out, "initial", old.id, "semantic", new.initial) end
            if old.migration ~= new.migration then change(out, "migration", old.id, "semantic", new.migration) end
            if old.name ~= new.name then change(out, "name", old.id, "cosmetic") end
            diff_states(out, old, new, next, usage, maps[old.id] or {})
            diff_transitions(out, old, new)
        end
    end
    for _, p in ipairs(next.processes) do
        if not old_by[p.id] then change(out, "add", p.id, "additive") end
    end
end

return M
