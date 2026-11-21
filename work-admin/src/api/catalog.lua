-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local types = require("types")
local M = {}

local MAX_CHOICES = 200
type Rule = { id: string, title: string, plugin: string, description: string?, reads: { string }? }
type BoardApp = { id: string, title: string }
type Catalog = { guards: { Rule }, filters: { Rule }, board_apps: { BoardApp } }
type IdSet = { [string]: boolean }
type Label = { id: string, title: string }
type RuleKind = { kind: string, name: string, target: { Rule } }
M.Catalog = Catalog

function M.empty(): Catalog
    return { guards = table.create(1, 0), filters = table.create(1, 0), board_apps = table.create(1, 0) }
end

local function limit_error(kind: string): error
    return errors.new({ kind = errors.UNAVAILABLE, message = "Work Admin discovery exceeds the installed " .. kind .. " limit",
        details = { code = "options_limit", type = kind, limit = MAX_CHOICES } })
end

-- Fixed selectors use the runtime's revision-aware finder cache. Its Lua
-- registry API applies the caller's registry.get access on every lookup.
local function entries(kind: string, name: string): ({ registry.Entry }?, error?)
    local found, err = registry.find({ [".kind"] = kind, ["meta.type"] = "kickside.work." .. name })
    if err then return nil, err end
    if #found > MAX_CHOICES then return nil, limit_error(name) end
    return found, nil
end

local function ordered(a: Label, b: Label): boolean
    if a.title == b.title then return a.id < b.id end
    return a.title < b.title
end

local function nonblank(value: unknown): boolean
    return type(value) == "string" and value:match("%S") ~= nil
end

local function seam_ids(owner: string): (IdSet?, error?)
    local manifest, err = registry.get(owner)
    if err and err:kind() ~= errors.NOT_FOUND and err:kind() ~= errors.PERMISSION_DENIED then return nil, err end
    local meta = manifest and manifest.meta or {}
    local ids: IdSet = {}
    if not manifest or manifest.kind ~= "registry.entry" or meta.type ~= "kickside.work.plugin" or meta.interface_version ~= 1 then
        return ids, nil
    end
    local seams = meta.seams
    if type(seams) ~= "table" then return ids, nil end
    if #seams > MAX_CHOICES then return nil, limit_error("plugin seams") end
    for _, id in ipairs(seams :: { unknown }) do
        if type(id) == "string" then ids[id] = true end
    end
    return ids, nil
end

local function board_app(entry: registry.Entry): BoardApp?
    local id, meta = entry.id, entry.meta or {}
    -- Match the published board UI app registration used by Work's binding.
    if not id:match("^[^:%s]+:[^:%s]+$") or not nonblank(meta.title) or not nonblank(meta.icon) then return nil end
    local page, tag = meta.page, meta.component
    if page ~= nil then
        if tag ~= nil or type(page) ~= "string" or page:sub(1, 1) ~= "/" or page:sub(1, 2) == "//"
            or page:match("[\\%s%c?#]") then return nil end
    elseif type(tag) ~= "string" or not tag:match("^[a-z][a-z0-9]*%-[a-z0-9][a-z0-9%-]*$") then
        return nil
    end
    return { id = id, title = meta.title :: string }
end

local function rule(entry: registry.Entry, owner: string): Rule
    local meta = entry.meta or {}
    local name = entry.id:match("([^:]+)$") or entry.id
    local title = nonblank(meta.title) and meta.title :: string or name:gsub("[_%.%-]+", " "):gsub("^%l", string.upper)
    local reads: { string } = table.create(1, 0)
    for index = 1, type(meta.reads) == "table" and math.min(#meta.reads, MAX_CHOICES) or 0 do
        local field = (meta.reads :: { unknown })[index]
        if type(field) == "string" then reads[#reads + 1] = field end
    end
    return { id = entry.id, title = title, plugin = owner, reads = reads,
        description = type(meta.description) == "string" and meta.description or nil }
end

function M.load(options: types.SchemaOptions?): (Catalog?, error?)
    local out = M.empty()
    local admitted: IdSet = {}
    local seams: { [string]: IdSet } = {}
    if options then
        if #options.plugins > MAX_CHOICES then return nil, limit_error("plugins") end
        for _, plugin in ipairs(options.plugins) do
            if plugin.installed and not plugin.problem then admitted[plugin.plugin] = true end
        end
    end
    local rules: { RuleKind } = {
        { kind = "function.lua", name = "guard", target = out.guards },
        { kind = "registry.entry", name = "scope", target = out.filters },
    }
    for _, spec in ipairs(rules) do
        local found, err = entries(spec.kind, spec.name)
        if err then return nil, err end
        for _, entry in ipairs(found or {}) do
            local owner = (entry.meta or {}).plugin
            if type(owner) == "string" and (not options or admitted[owner]) then
                local ids = seams[owner]
                if not ids then
                    local listed, load_err = seam_ids(owner)
                    if load_err or not listed then return nil, load_err end
                    ids = listed
                    seams[owner] = ids
                end
                if ids[entry.id] then spec.target[#spec.target + 1] = rule(entry, owner) end
            end
        end
        table.sort(spec.target, ordered)
    end
    local apps, err = entries("registry.entry", "ui.app")
    if err then return nil, err end
    for _, entry in ipairs(apps or {}) do
        local app = board_app(entry)
        if app then out.board_apps[#out.board_apps + 1] = app end
    end
    table.sort(out.board_apps, ordered)
    return out, nil
end

return M
