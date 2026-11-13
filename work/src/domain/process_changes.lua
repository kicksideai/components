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

local function diff_states(out: { types.SchemaChange }, old: types.Process, new: types.Process, next: types.Compiled, usage: types.Usage, map: { [string]: string })
    for _, s in ipairs(old.states) do
        local n = held_by(old.id, next, usage, s.id)
        local kept = process.state_of(new, s.id)
        if not kept then
            if n == 0 then
                change(out, "state.remove", old.id, "semantic", s.id)
            elseif new.migration == "follow" and map[s.id] then
                change(out, "state.map", old.id, "semantic", s.id, map[s.id], n)
            else
                change(out, "state.remove", old.id, "refused", s.id, nil, n)
            end
        else
            if kept.kind ~= s.kind then
                change(out, "state.kind", old.id, "refused", s.id, kept.kind, n)
            elseif kept.category ~= s.category then
                change(out, "state.category", old.id, "semantic", s.id, kept.category, n)
            elseif process.behavior(kept) ~= process.behavior(s) then
                change(out, "state.change", old.id, "semantic", s.id, nil, n)
            elseif kept.name ~= s.name then
                change(out, "state.name", old.id, "cosmetic", s.id)
            end
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
