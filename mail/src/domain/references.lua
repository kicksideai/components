-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local M = {}

local function asset_names(source: string, names: {[string]: boolean})
    local pos = 1
    while pos <= #source do
        local first, last = source:find("assets", pos, true)
        if not first or not last then return end
        pos = last + 1
        if first == 1 or not source:sub(first - 1, first - 1):match("[%w_]") then
            local name = source:match("^%s*%.%s*([%w_%-]+)", pos)
                or source:match([=[^%s*%[%s*"([^"]+)"%s*%]]=], pos)
                or source:match([=[^%s*%[%s*'([^']+)'%s*%]]=], pos)
            if name then names[name] = true end
        end
    end
end

function M.template_keys(content: types.ResourceContent): {types.ResourceKey}
    local keys: {types.ResourceKey} = {}
    local seen: {[string]: boolean} = {}
    local function add(kind: string, name: string)
        local id = kind .. "/" .. name
        if seen[id] then return end
        seen[id] = true
        keys[#keys + 1] = {kind = kind, name = name}
    end
    local function collect(source: string)
        for directive, _, path in source:gmatch([[{{%-?%s*(%a+)%s+(["'])(.-)%2]]) do
            if directive == "extends" or directive == "import" or directive == "include" then
                local kind, name = path:match("^/?([a-z]+)/([a-z0-9][a-z0-9_-]*)$")
                if kind == "base" or kind == "part" or kind == "message" then add(kind, name) end
            end
        end
    end
    if content.base then add("base", content.base) end
    collect(content.html)
    collect(content.text)
    if content.subject then collect(content.subject) end
    return keys
end

function M.closure(items: types.ResourceMap, message: types.ResourceContent?,
    candidates: {types.ResourceContent}, dependants: {types.Resource}?): {types.ResourceContent}
    local selected: {types.ResourceContent} = {}
    local seen: {[string]: boolean} = {}
    local function add(item: types.ResourceContent?)
        if not item then return end
        local id = item.kind .. "/" .. item.name
        if seen[id] then return end
        seen[id] = true
        selected[#selected + 1] = item
    end
    add(message)
    for _, item in ipairs(candidates) do add(item) end
    for _, item in ipairs(dependants or {}) do add(item) end
    for _, item in ipairs(selected) do
        for _, key in ipairs(M.template_keys(item)) do add(items[key.kind .. "/" .. key.name]) end
    end
    return selected
end

local function sorted(names: {[string]: boolean}): {string}
    local result: {string} = {}
    for name in pairs(names) do result[#result + 1] = name end
    table.sort(result)
    return result
end

function M.asset_names(content: types.ResourceContent): {string}
    local names: {[string]: boolean} = {}
    asset_names(content.html, names)
    asset_names(content.text, names)
    if content.subject then asset_names(content.subject, names) end
    return sorted(names)
end

function M.refs(content: types.ResourceContent): types.ResourceReferences
    local bases: {[string]: boolean} = {}
    local parts: {[string]: boolean} = {}
    for _, key in ipairs(M.template_keys(content)) do
        if key.kind == "base" then bases[key.name] = true end
        if key.kind == "part" then parts[key.name] = true end
    end
    return {bases = sorted(bases), parts = sorted(parts), assets = M.asset_names(content)}
end

function M.keys(item: types.ResourceContent): {types.ResourceKey}
    local refs = M.refs(item)
    local keys: {types.ResourceKey} = {}
    for _, name in ipairs(refs.bases) do keys[#keys + 1] = {kind = "base", name = name} end
    for _, name in ipairs(refs.parts) do keys[#keys + 1] = {kind = "part", name = name} end
    for _, name in ipairs(refs.assets) do keys[#keys + 1] = {kind = "asset", name = name} end
    return keys
end

return M
