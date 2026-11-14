-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local declaration = require("declaration")
local values = require("values")
local types = require("types")
local domain = require("domain")
local M = {}

local function indexed<T>(entries: { T }?, key: (T) -> string): ({ [string]: T }, { string })
    local by: { [string]: T } = {}
    local order: { string } = {}
    for _, entry in ipairs(entries or {}) do
        local id = key(entry)
        by[id] = entry; order[#order + 1] = id
    end
    return by, order
end
local function field(value: domain.FieldDecl): domain.FieldDecl
    local copy = declaration.copy(value)
    copy.id = nil
    return copy
end
local function plugin(value: domain.PluginDecl): domain.PluginDecl
    return { use = value.use }
end
-- Named entries are the unit of local ownership; field ids stay with their board.
function M.entries<T>(section: string, key: (T) -> string, before: { T }?, current: { T }?, proposed: { T }?,
    resolutions: { [string]: string }?, normalize: ((T) -> T)?): ({ T }, { string }, { types.Conflict })
    local b = indexed(before, key)
    local l, order = indexed(current, key)
    local n, added = indexed(proposed, key)
    local seen: { [string]: boolean } = {}
    for _, id in ipairs(order) do seen[id] = true end
    for _, id in ipairs(added) do if not seen[id] then order[#order + 1] = id end end
    local result: { T } = {}
    local removed: { string } = {}
    local conflicts: { types.Conflict } = {}
    for _, id in ipairs(order) do
        local bv, lv, nv = b[id], l[id], n[id]
        if normalize then
            if bv then bv = normalize(bv) end
            if lv then lv = normalize(lv) end
            if nv then nv = normalize(nv) end
        end
        local chosen: T? = n[id]
        local local_changed = not values.equal(lv, bv)
        local upstream_changed = not values.equal(nv, bv)
        local path = section .. "." .. id
        if local_changed and upstream_changed and not values.equal(lv, nv) then
            conflicts[#conflicts + 1] = { path = path, base = bv, local_value = lv, incoming = nv }
            if (resolutions or {})[path] ~= "incoming" then chosen = l[id] end
        elseif local_changed then chosen = l[id] end
        if chosen then
            result[#result + 1] = normalize and normalize(chosen) or declaration.copy(chosen)
        elseif l[id] then removed[#removed + 1] = id end
    end
    return result, removed, conflicts
end
function M.schema(base: domain.Declaration?, local_decl: domain.Declaration?, incoming: domain.Declaration,
    resolutions: { [string]: string }?): (domain.Declaration, { types.Conflict })
    if not base or not local_decl then return declaration.copy(incoming), {} end
    local out = declaration.copy(incoming)
    local fields, removed_fields, field_conflicts = M.entries("fields", function(v: domain.FieldDecl): string return v.code end, base.fields, local_decl.fields, incoming.fields, resolutions, field)
    local current_fields = indexed(local_decl.fields, function(v: domain.FieldDecl): string return v.code end)
    for _, entry in ipairs(fields) do if current_fields[entry.code] then entry.id = current_fields[entry.code].id end end
    local item_types, removed_types, type_conflicts = M.entries("item_types", function(v: domain.ItemTypeDecl): string return v.id end, base.item_types, local_decl.item_types, incoming.item_types, resolutions)
    local relations, removed_relations, relation_conflicts = M.entries("relation_types", function(v: domain.RelationDecl): string return v.id end, base.relation_types, local_decl.relation_types, incoming.relation_types, resolutions)
    local processes, removed_processes, process_conflicts = M.entries("processes", function(v: domain.ProcessDecl): string return v.id end, base.processes, local_decl.processes, incoming.processes, resolutions)
    local plugins, _, plugin_conflicts = M.entries("plugins", function(v: domain.PluginDecl): string return v.use end, base.plugins, local_decl.plugins, incoming.plugins, resolutions, plugin)
    out.fields, out.item_types, out.relation_types, out.processes, out.plugins = fields, item_types, relations, processes, plugins
    local remove: domain.RemoveDecl = {}
    if #removed_fields > 0 then remove.fields = removed_fields end
    if #removed_types > 0 then remove.item_types = removed_types end
    if #removed_relations > 0 then remove.relation_types = removed_relations end
    if #removed_processes > 0 then remove.processes = removed_processes end
    local conflicts: { types.Conflict } = {}
    for _, found in ipairs({ field_conflicts, type_conflicts, relation_conflicts, process_conflicts, plugin_conflicts }) do
        for _, conflict in ipairs(found) do conflicts[#conflicts + 1] = conflict end
    end
    local before, current, proposed = base :: types.Map, local_decl :: types.Map, incoming :: types.Map
    local scalar = out :: types.Map
    for _, section in ipairs({ "policy", "visibility", "scopes" }) do
        local bv, lv, nv = before[section], current[section], proposed[section]
        local local_changed, upstream_changed = not values.equal(lv, bv), not values.equal(nv, bv)
        if local_changed and upstream_changed and not values.equal(lv, nv) then
            conflicts[#conflicts + 1] = { path = section, base = bv, local_value = lv, incoming = nv }
            if (resolutions or {})[section] == "incoming" then scalar[section] = nv else scalar[section] = lv end
        elseif local_changed then scalar[section] = lv end
    end
    if next(remove) then out.remove = remove end
    table.sort(conflicts, function(a: types.Conflict, b: types.Conflict): boolean return a.path < b.path end)
    return out, conflicts
end
function M.maps(current: domain.Declaration?, incoming: domain.Declaration): domain.StateMaps
    local maps: domain.StateMaps = {}
    local processes: { [string]: domain.ProcessDecl } = {}
    for _, process in ipairs(incoming.processes or {}) do processes[process.id] = process end
    for _, old in ipairs(current and current.processes or {}) do
        local new = processes[old.id]
        if new then
            local states: { [string]: boolean } = {}
            for _, state in ipairs(new.states) do states[state.id] = true end
            for _, state in ipairs(old.states) do
                if not states[state.id] then
                    local target: string? = nil
                    for _, candidate in ipairs(new.states) do
                        if candidate.name == state.name and candidate.category == state.category then target = candidate.id; break end
                    end
                    if not target then
                        for _, candidate in ipairs(new.states) do if candidate.category == state.category then target = candidate.id; break end end
                    end
                    maps[old.id] = maps[old.id] or {}
                    maps[old.id][state.id] = target or new.initial or new.states[1].id
                end
            end
        end
    end
    return maps
end
return M
