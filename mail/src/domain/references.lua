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

function M.source_reference(source: string?, name: string): boolean
    if not source then return false end
    local names: {[string]: boolean} = {}
    asset_names(source, names)
    return names[name] == true
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

local function sorted(names: {[string]: boolean}): {string}
    local result: {string} = {}
    for name in pairs(names) do result[#result + 1] = name end
    table.sort(result)
    return result
end

function M.refs(content: types.ResourceContent): types.ResourceReferences
    local bases: {[string]: boolean} = {}
    local parts: {[string]: boolean} = {}
    local assets: {[string]: boolean} = {}
    for _, key in ipairs(M.template_keys(content)) do
        if key.kind == "base" then bases[key.name] = true end
        if key.kind == "part" then parts[key.name] = true end
    end
    asset_names(content.html, assets)
    asset_names(content.text, assets)
    if content.subject then asset_names(content.subject, assets) end
    return {bases = sorted(bases), parts = sorted(parts), assets = sorted(assets)}
end

return M
