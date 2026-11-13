-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Stored plugin fragments compose with the board's own declaration in prepare.
local declaration = require("declaration")
local values = require("values")
local consts = require("consts")
local types = require("types")
local M = {}
local SECTIONS = { "fields", "item_types", "processes", "relation_types" }

local function invalid(code: string, message: string, details: types.JsonObject?): error
    local info = details or {}
    info.code = code
    return errors.new({ kind = errors.INVALID, message = message, details = info })
end

function M.check(fragment: types.JsonObject): error?
    local allowed: { [string]: boolean } = {}
    for _, key in ipairs(SECTIONS) do allowed[key] = true end
    for key in pairs(fragment) do
        if not allowed[key] then return invalid("invalid_plugin_fragment", "plugin fragment refuses " .. key) end
    end
    if #values.canonical(fragment) > consts.LIMITS.plugin_fragment_bytes then
        return invalid("plugin_fragment_too_large", "plugin fragment exceeds its size bound", { limit = consts.LIMITS.plugin_fragment_bytes })
    end
    local checked = declaration.copy(fragment) :: types.JsonObject
    if type(checked.item_types) == "table" then
        for _, item in ipairs(checked.item_types :: { types.JsonObject }) do
            if type(item) == "table" and item.process == nil then item.process = "" end
        end
    end
    return declaration.check_entries(checked :: types.Declaration)
end

local function collision(section: string, key: string, first: string, second: string): error
    return invalid("plugin_schema_collision", section .. " " .. key .. " is claimed by " .. first .. " and " .. second,
        { section = section, reference = key, first = first, second = second })
end

-- check_claims identifies plugin ids before the board merges its own fields.
function M.check_claims(incoming: types.Declaration, previous: types.Compiled?): error?
    local owners: { [integer]: string } = {}
    for _, field in ipairs(previous and previous.fields or {}) do
        if field.plugin then owners[field.id] = field.plugin end
    end
    for _, field in ipairs(incoming.fields or {}) do
        local owner = field.id and owners[field.id] or nil
        if owner then return collision("fields", tostring(field.id), owner, "board") end
    end
    return nil
end

-- compose appends extensions only to types the board owns and preserves every source copy.
function M.compose(own: types.Declaration, previous: types.Compiled?): (types.Declaration?, types.PluginOwners?, error?)
    local out = declaration.copy(own)
    local owners: types.PluginOwners = { fields = {}, item_types = {}, processes = {}, relation_types = {} }
    local lists = out :: types.JsonObject
    local ids: { [integer]: string } = {}
    local previous_ids: { [integer]: string } = {}
    local previous_codes: { [string]: string } = {}
    for _, f in ipairs(previous and previous.fields or {}) do
        previous_ids[f.id], previous_codes[f.code] = f.plugin or "board", f.plugin or "board"
    end
    local type_fields: { [string]: string } = {}
    local board_types: { [string]: types.ItemTypeDecl } = {}
    for _, t in ipairs(out.item_types or {}) do
        board_types[t.id] = t
        for _, code in ipairs(t.fields or {}) do type_fields[t.id .. "." .. code] = "board" end
    end
    local function add(section: string, entry: types.JsonObject, owner: string): error?
        local key = tostring(section == "fields" and entry.code or entry.id)
        local held = owners[section][key]
        if held then return collision(section, key, held, owner) end
        if section == "fields" then
            local id = math.tointeger(entry.id)
            local prior = id and previous_ids[id] or previous_codes[key]
            if prior and prior ~= owner then return collision(section, key, prior, owner) end
            if id then
                if ids[id] then return collision(section, tostring(id), ids[id], owner) end
                ids[id] = owner
            end
        end
        owners[section][key] = owner
        return nil
    end
    for _, section in ipairs(SECTIONS) do
        lists[section] = lists[section] or {}
        for _, entry in ipairs(lists[section] :: { types.JsonObject }) do
            local err = add(section, entry, "board")
            if err then return nil, nil, err end
        end
    end
    for _, plugin in ipairs(own.plugins or {}) do
        local resolved = plugin.schema
        if resolved then
            local err = M.check(resolved.fragment)
            if err then return nil, nil, err end
            local fragment = declaration.copy(resolved.fragment)
            for _, section in ipairs(SECTIONS) do
                for _, entry in ipairs((fragment[section] or {}) :: { types.JsonObject }) do
                    local target = section == "item_types" and board_types[tostring(entry.id)] or nil
                    if target then
                        for key in pairs(entry) do
                            if key ~= "id" and key ~= "fields" then
                                return nil, nil, collision(section, target.id, "board", plugin.use)
                            end
                        end
                        target.fields = target.fields or {}
                        for _, code in ipairs((entry.fields or {}) :: { string }) do
                            local key = target.id .. "." .. code
                            if type_fields[key] then return nil, nil, collision("item_types.fields", key, type_fields[key], plugin.use) end
                            target.fields[#target.fields + 1] = code
                            type_fields[key] = plugin.use
                        end
                    else
                        local aerr = add(section, entry, plugin.use)
                        if aerr then return nil, nil, aerr end
                        local list = lists[section] :: { types.JsonObject }
                        list[#list + 1] = entry
                    end
                end
            end
        end
    end
    return out, owners, nil
end

-- check_removal names surviving declarations that reference a deactivated contribution.
function M.check_removal(own: types.Declaration, previous: types.Compiled?): error?
    if not previous then return nil end
    local active: { [string]: boolean } = {}
    for _, p in ipairs(own.plugins or {}) do active[p.use] = true end
    local removed: types.PluginOwners = { fields = {}, item_types = {}, processes = {}, relation_types = {} }
    local old = previous :: types.JsonObject
    for _, section in ipairs(SECTIONS) do
        for _, entry in ipairs((old[section] or {}) :: { types.JsonObject }) do
            local plugin = entry.plugin :: string?
            if plugin and not active[plugin] then removed[section][tostring(section == "fields" and entry.code or entry.id)] = plugin end
        end
    end
    local function reference(section: string, value: unknown, path: string, owner: string): error?
        local plugin = type(value) == "string" and removed[section][value] or nil
        if plugin then return invalid("plugin_seam_in_use", owner .. " references " .. tostring(value) .. " from " .. plugin,
            { plugin = plugin, owner = owner, reference = path, target = tostring(value) }) end
        return nil
    end
    local function walk(raw: unknown, path: string, owner: string): error?
        if type(raw) ~= "table" then return nil end
        for key, value in pairs(raw :: types.JsonObject) do
            local location = path .. "." .. tostring(key)
            local section: string? = nil
            if key == "field" or key == "copy" or key == "by" then section = "fields"
            elseif key == "process" then section = "processes"
            elseif key == "rel" or key == "of" then section = "relation_types" end
            local err = section and reference(section, value, location, owner) or nil
            if err then return err end
            if key == "fields" or key == "inherit" or key == "require" or key == "parent_types" then
                if type(value) == "table" then
                    for i, name in ipairs(value :: { unknown }) do
                        local rerr = reference(key == "parent_types" and "item_types" or "fields", name, location .. "." .. i, owner)
                        if rerr then return rerr end
                    end
                end
            end
            if key ~= "config" and key ~= "value" and key ~= "options" and key ~= "map" then
                local werr = walk(value, location, owner)
                if werr then return werr end
            end
        end
        return nil
    end
    local err = walk({ fields = own.fields, item_types = own.item_types, processes = own.processes, visibility = own.visibility }, "board", "board")
    if err then return err end
    for _, plugin in ipairs(own.plugins or {}) do
        if plugin.schema then
            local perr = walk(plugin.schema.fragment, plugin.use, plugin.use)
            if perr then return perr end
        end
    end
    return nil
end

function M.stamp(compiled: types.Compiled, owners: types.PluginOwners)
    local entries = compiled :: types.JsonObject
    for _, section in ipairs(SECTIONS) do
        for _, entry in ipairs(entries[section] :: { types.JsonObject }) do
            local owner = owners[section][tostring(section == "fields" and entry.code or entry.id)]
            if owner ~= "board" then entry.plugin = owner end
        end
    end
end
return M
