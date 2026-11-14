-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The host answers one plugin shape for schema reads, options and service admission.
local registry = require("registry")
local manifests = require("manifests")
local defaults = require("defaults")
local states = require("states")
local types = require("types")
local M = {}

function M.failure(err: error): types.PluginError
    local details = err:details()
    return { kind = err:kind(), code = details and details.code :: string?, message = err:message() }
end

function M.effective(plugin: types.Plugin, own: types.JsonObject?): (types.JsonObject?, error?)
    local app: types.JsonObject = {}
    if plugin.settings then
        local values, err = defaults.namespace(plugin.settings)
        if err or not values then return nil, err end
        app = values
    end
    return manifests.effective(plugin, app, own)
end

function M.list(board_id: string, desired: { types.PluginState }, activations: { types.PluginDecl }, historical: boolean?, options: boolean?): ({ types.PluginView }?, error?)
    local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = manifests.TYPE })
    if err then return nil, err end
    local installed: { [string]: registry.Entry } = {}
    local ids: { [string]: boolean } = {}
    local owned: { [string]: types.PluginState } = {}
    local active: { [string]: types.PluginDecl } = {}
    for _, entry in ipairs(entries or {}) do installed[tostring(entry.id)] = entry; ids[tostring(entry.id)] = true end
    for _, row in ipairs(desired) do owned[row.plugin] = row end
    for _, entry in ipairs(activations) do active[entry.use] = entry; ids[entry.use] = true end
    local out: { types.PluginView } = {}
    for id in pairs(ids) do
        local entry, activation, row = installed[id], active[id], owned[id]
        local meta = entry and entry.meta or {}
        local view: types.PluginView = { plugin = id, installed = entry ~= nil, active = activation ~= nil,
            title = type(meta.title) == "string" and meta.title or nil,
            description = type(meta.description) == "string" and meta.description or nil,
            icon = type(meta.icon) == "string" and meta.icon or nil,
            requires = {}, tools = {}, projections = {}, lifecycle = { state = "ready" } }
        local plugin, perr = manifests.load(id)
        if plugin then
            view.title, view.description, view.icon = plugin.title, plugin.description, plugin.icon
            view.requires, view.tools = plugin.requires, plugin.tools
            if options then view.config_schema = plugin.config_schema end
        elseif options and type(meta.config_schema) == "table" then view.config_schema = meta.config_schema :: types.JsonObject end
        if row and not activation and not historical then
            view.lifecycle, view.attachment_id = row.lifecycle, row.attachment_id
        end
        if activation then
            view.attachment_id = activation.attachment_id
            view.version, view.digest = activation.schema and activation.schema.version, activation.schema and activation.schema.digest
            if row and row.attachment_id == activation.attachment_id then
                view.lifecycle = row.lifecycle
                if plugin then view.config, perr = M.effective(plugin, row.config) end
            else view.lifecycle = { state = "pending" } end
        end
        if perr then
            view.lifecycle = { state = "failed", error = M.failure(perr) }
            if perr:kind() == errors.INVALID then
                view.problem = { code = perr:details().code :: string, message = perr:message() }
            end
        end
        out[#out + 1] = view
    end
    table.sort(out, function(a: types.PluginView, b: types.PluginView): boolean
        if a.active ~= b.active then return a.active end
        return a.plugin < b.plugin
    end)
    return out, nil
end
function M.projections(board_id: string, listed: { types.PluginView })
    for _, view in ipairs(listed) do
        if view.active and not view.problem then
            local plugin, err = manifests.load(view.plugin)
            if plugin then view.projections = states.states(board_id, plugin)
            elseif err then view.lifecycle = { state = "failed", error = M.failure(err) } end
        end
    end
end
return M
