-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local declaration = require("declaration")
local hash = require("hash")
local process = require("process")
local types = require("types")
local values = require("values")
local M = {}

function M.key(item_type: string, transition: string): string
    return item_type .. "/" .. transition
end

function M.owner(compiled: types.Compiled, item_type: string, process_id: string, transition: types.Transition): string?
    local rules = compiled.transition_rules
    local rule = rules and rules[M.key(item_type, transition.id)]
    if rule and rule.process == process_id then return rule.command end
    return transition.prepare_command
end

local function shape(value: types.JsonObject, exclude: { string }): types.JsonObject
    local out: types.JsonObject = {}
    for key, entry in pairs(value) do out[key] = entry end
    for _, key in ipairs(exclude) do out[key] = nil end
    return out
end

type Definitions = { [string]: types.JsonObject }
type Proof = {
    process: { initial: string, migration: string, states: Definitions, transitions: Definitions },
    fields: Definitions,
}

local function proof(compiled: types.Compiled, selector: types.TransitionSelector, field_ids: boolean): (Proof?, string?)
    local item_type: types.ItemType? = nil
    for _, entry in ipairs(compiled.item_types) do
        if entry.id == selector.item_type then item_type = entry; break end
    end
    if not item_type or item_type.process ~= selector.process then return nil, "item_types." .. selector.item_type .. ".process" end
    local definition: types.Process? = nil
    for _, held in ipairs(compiled.processes) do
        if held.id == selector.process then definition = held; break end
    end
    local prefix = "processes." .. selector.process
    if not definition then return nil, prefix end
    local states: Definitions = {}
    local routes: Definitions = {}
    local edge: types.Transition? = nil
    for _, state in ipairs(definition.states) do
        states[state.id] = shape(state :: types.JsonObject, { "name" })
    end
    for _, route in ipairs(definition.transitions) do
        routes[route.id] = shape(route :: types.JsonObject, { "name", "order" })
        if route.id == selector.transition then edge = route end
    end
    local edge_path = prefix .. ".transitions." .. selector.transition
    if not edge or edge.any or #edge.from ~= 1 or edge.auto or edge.people ~= nil
        or edge.command or edge.prepare_command or edge.when ~= nil or #(edge.guards or {}) > 0 then
        if edge and edge.when ~= nil then return nil, edge_path .. ".when" end
        if edge and #(edge.guards or {}) > 0 then return nil, edge_path .. ".guards" end
        return nil, edge_path
    end
    if definition.initial == edge.to then return nil, prefix .. ".initial" end
    for _, route in ipairs(definition.transitions) do
        if route.id ~= edge.id and route.to == edge.to then return nil, prefix .. ".transitions." .. route.id .. ".to" end
    end
    for _, state in ipairs(definition.states) do
        local path = prefix .. ".states." .. state.id
        if state.run then
            for _, key in ipairs({ "on_pass", "on_fail", "on_cancel", "on_exhausted" }) do
                if (state.run :: types.JsonObject)[key] == edge.id then return nil, path .. ".run." .. key end
            end
        end
        for _, timer in ipairs(state.timers or {}) do
            local effect = timer["then"] :: types.TimerEffect?
            if effect and effect.transition == edge.id then return nil, path .. ".timers." .. timer.id end
        end
        for _, region in ipairs(state.regions or {}) do
            if region.initial == edge.to then return nil, path .. ".regions." .. region.id end
        end
    end
    local carried: { [string]: boolean } = {}
    for _, code in ipairs(item_type.fields) do carried[code] = true end
    for _, code in ipairs(process.fields_used(definition)) do
        if not carried[code] then return nil, "item_types." .. selector.item_type .. ".fields." .. code end
    end
    local fields: { [string]: types.JsonObject } = {}
    for _, code in ipairs(selector.fields) do
        for _, field in ipairs(compiled.fields) do
            if field.code == code then
                fields[code] = shape(field :: types.JsonObject, field_ids and { "title", "plugin" } or { "id", "title", "plugin" })
                break
            end
        end
        if not fields[code] then return nil, "fields." .. code end
    end
    return { process = { initial = definition.initial, migration = definition.migration, states = states, transitions = routes }, fields = fields }, nil
end

function M.diff(baseline: types.Compiled, current: types.Compiled, selector: types.TransitionSelector, field_ids: boolean): string?
    local wanted, path = proof(baseline, selector, field_ids)
    if not wanted then return path end
    local actual, path = proof(current, selector, field_ids)
    if not actual then return path end
    local prefix = "processes." .. selector.process
    for _, code in ipairs(selector.fields) do
        if not values.equal(wanted.fields[code], actual.fields[code]) then return "fields." .. code end
    end
    if wanted.process.initial ~= actual.process.initial then return prefix .. ".initial" end
    if wanted.process.migration ~= actual.process.migration then return prefix .. ".migration" end
    for _, section in ipairs({
        { name = "states", old = wanted.process.states, new = actual.process.states },
        { name = "transitions", old = wanted.process.transitions, new = actual.process.transitions },
    }) do
        local mismatches: { string } = {}
        for id, entry in pairs(section.old) do
            if not values.equal(entry, section.new[id]) then mismatches[#mismatches + 1] = id end
        end
        for id in pairs(section.new) do if not section.old[id] then mismatches[#mismatches + 1] = id end end
        if #mismatches > 0 then
            table.sort(mismatches)
            return prefix .. "." .. section.name .. "." .. mismatches[1]
        end
    end
    return nil
end

function M.digest(compiled: types.Compiled, selector: types.TransitionSelector): (string?, string?)
    local model, path = proof(compiled, selector, true)
    if not model then return nil, path end
    return tostring(hash.sha256(values.canonical(model))), nil
end

function M.compile(previous: types.Compiled?, compiled: types.Compiled): error?
    compiled.transition_rules = previous and declaration.copy(previous.transition_rules)
    for _, rule in pairs(compiled.transition_rules or {}) do
        local active = false
        for _, plugin in ipairs(compiled.plugins or {}) do if plugin.use == rule.plugin then active = true; break end end
        local digest = M.digest(compiled, rule)
        if not active or digest ~= rule.digest then
            local path = not active and ("plugins." .. rule.plugin)
                or M.diff(previous :: types.Compiled, compiled, rule, true) or ("processes." .. rule.process)
            return errors.new({ kind = errors.INVALID, message = "schema change conflicts with an adopted transition",
                details = { code = "transition_rule_conflict", item_type = rule.item_type, transition = rule.transition,
                    path = path } })
        end
    end
    return nil
end

return M
