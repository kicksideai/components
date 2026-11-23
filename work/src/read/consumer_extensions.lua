-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local security = require("security")
local access_rows = require("access_rows")
local predicates = require("predicates")
local plugins = require("plugins")
local scopes = require("scopes")
local search = require("search")
local domain = require("domain")
local types = require("types")

local M = {}
local LIMIT_PER_SLOT = 16
local MAX_TEXT_BYTES = 255
local KINDS = { "card", "panel", "filter" }

local function text(raw: unknown): string?
    if type(raw) ~= "string" or #raw > MAX_TEXT_BYTES or not raw:match("%S") or raw:find("%z") then return nil end
    return raw
end

local function active_plugin(meta: domain.JsonObject, active: { [string]: boolean }): string?
    local id = text(meta.plugin)
    if id and active[id] then return id end
    if type(meta.plugins) == "table" then
        for _, raw in ipairs(meta.plugins :: { unknown }) do
            local alternative = text(raw)
            if alternative and active[alternative] then return alternative end
        end
    end
    return nil
end

local function placement(entry: registry.Entry, kind: string, active: { [string]: boolean },
    grants: domain.BoardAccess, board: domain.Board): types.ConsumerPlacement?
    local id, meta = text(tostring(entry.id)), (entry.meta or {}) :: domain.JsonObject
    local title, plugin = text(meta.title), active_plugin(meta, active)
    local access = meta.access == nil and "read" or text(meta.access)
    if not id or not title or not plugin or not access or not grants[access] then return nil end
    local order = meta.order == nil and 100 or math.tointeger(tonumber(meta.order))
    if not order or order < -2147483647 or order > 2147483647 then return nil end
    local tag = text(meta.tag)
    if meta.tag ~= nil and (not tag or not tag:match("^[a-z][a-z0-9._]*%-[a-z0-9._%-]*$")) then return nil end
    if kind ~= "filter" and not tag then return nil end
    local target = text(meta.target)
    if meta.target ~= nil and not target then return nil end
    local slot = kind
    if kind == "filter" then
        if not target then return nil end
    elseif kind == "panel" and target and target:match("^board:[a-z][a-z0-9_%-]*$") then
        slot = "board_panel"
    else
        if target and target ~= "item" then return nil end
        slot = kind == "card" and "card_badge" or "drawer_panel"
        target = "item"
        if meta.type_ref ~= nil then
            local item_type = text(meta.type_ref)
            if not item_type or not board.model.item_types[item_type] then return nil end
            target = target .. ":" .. item_type
        end
    end
    return { id = id, slot = slot, tag = tag, title = title, order = order, access = access, plugin = plugin, target = target }
end

local function filter_admitted(target: string, board: domain.Board, grants: domain.BoardAccess,
    active: { [string]: boolean }, resolve: domain.Resolver): boolean
    local kind, id = target:match("^([a-z]+):(.+)$")
    if not id then return false end
    if kind == "field" then
        local field = resolve(id)
        return field ~= nil
    end
    if kind ~= "scope" and kind ~= "operand" then return false end
    local entry = registry.get(id)
    if not entry then return false end
    local meta = entry.meta or {}
    local owner = text(meta.plugin)
    if not owner or not active[owner] or plugins.seam(id, board.compiled.plugins, false, kind) then return false end
    if kind == "operand" then return entry.kind == "function.lua" and security.can("funcs.call", id) == true end
    local scope = scopes.load(id)
    if scope then return grants[scope.access] == true end
    -- Lexical scopes backed by a resolver are selected through the board's match query.
    local level = meta.access == nil and "read" or text(meta.access)
    if (level ~= "read" and level ~= "write" and level ~= "admin") or not grants[level] or type(meta.resolve_ids) ~= "string" then return false end
    for _, scope_id in ipairs(board.compiled.scopes or {}) do
        if scope_id == id then return search.validate_scope(board.compiled, id) == nil end
    end
    return false
end

function M.list(board: domain.Board, grants: domain.BoardAccess, selected: { domain.PluginView }): ({ types.ConsumerPlacement }?, error?)
    local active: { [string]: boolean } = {}
    for _, plugin in ipairs(selected) do
        if plugin.active and plugin.installed and plugin.config and plugin.lifecycle.state ~= "failed" then active[plugin.plugin] = true end
    end
    local out: { types.ConsumerPlacement } = table.create(1, 0)
    if next(active) == nil then return out, nil end
    local candidates: { types.ConsumerPlacement } = {}
    for _, kind in ipairs(KINDS) do
        local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.work.ui." .. kind })
        if err then return nil, err end
        for _, entry in ipairs(entries or {}) do
            local item = placement(entry, kind, active, grants, board)
            if item then candidates[#candidates + 1] = item end
        end
    end
    table.sort(candidates, function(a: types.ConsumerPlacement, b: types.ConsumerPlacement): boolean
        if a.order ~= b.order then return a.order < b.order end
        return a.id < b.id
    end)
    local counts: { [string]: integer } = {}
    local panels: { [string]: boolean } = {}
    local filters: { [string]: boolean } = {}
    local resolve = access_rows.resolver(board, predicates.targets(board.compiled, nil, {}))
    for _, item in ipairs(candidates) do
        local count = counts[item.slot] or 0
        if count < LIMIT_PER_SLOT then
            local admitted = true
            if item.slot == "board_panel" then
                admitted = not panels[item.target]
                panels[item.target] = true
            elseif item.slot == "filter" then
                if filters[item.target] == nil then
                    filters[item.target] = filter_admitted(item.target, board, grants, active, resolve)
                end
                admitted = filters[item.target]
            end
            if admitted then out[#out + 1], counts[item.slot] = item, count + 1 end
        end
    end
    return out, nil
end

return M
