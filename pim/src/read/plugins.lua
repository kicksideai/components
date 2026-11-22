-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local component = require("component")
local failure = require("failure")
local plugins = require("plugins")
local plugin_projections = require("plugin_projections")
local registry = require("registry")
local store = require("store")
local types = require("types")

local M = {}

local function add_plugin_references(catalog_id: string, views: { types.PluginOption }, compiled: types.Compiled): error?
    local refs: { [string]: types.PluginReferences } = {}
    for _, plugin in ipairs(views) do
        if plugin.active and (not plugin.installed or plugin.problem and plugin.problem.code == "plugin_interface_version_unsupported") then
            local reference: types.PluginReferences = { fields = {}, scopes = {}, checks = {}, plugins = {}, shell_bindings = {} }
            refs[plugin.plugin], plugin.references = reference, reference
        end
    end
    if next(refs) == nil then return nil end
    local owners = compiled.seam_owners or {}
    for code, attr in pairs(compiled.attributes) do
        local affected: { [string]: boolean } = {}
        local function mark(owner: string?)
            if owner and refs[owner] then affected[owner] = true end
        end
        local function targets(config: types.AttributeConfig)
            if config.target then mark(owners[config.target]) end
            for _, member in pairs(config.members or {}) do targets(member) end
        end
        mark(compiled.aspects[attr.aspect].plugin)
        mark(owners[attr.type])
        targets(attr.config)
        for owner in pairs(affected) do refs[owner].fields[#refs[owner].fields + 1] = code end
    end
    for scope in pairs(compiled.scopes) do
        local ref = refs[owners[scope]]
        if ref then ref.scopes[#ref.scopes + 1] = scope end
    end
    for family, definition in pairs(compiled.families) do
        for _, check in ipairs(definition.checks) do
            local ref = refs[owners[check.fn]]
            if ref then ref.checks[#ref.checks + 1] = family .. " · " .. check.fn end
        end
    end
    for _, plugin in ipairs(views) do
        for _, required in ipairs(plugin.requires) do
            if plugin.active and refs[required] then refs[required].plugins[#refs[required].plugins + 1] = plugin.plugin end
        end
    end
    local catalog, err = component.query({ component_ids = { catalog_id }, access_mask = component.ACCESS.READ, include = { meta = true }, limit = 1 })
    if err then return err end
    local row = catalog and catalog[1]
    local binding = row and row.meta and row.meta.pim_ui_app
    if type(binding) == "string" then
        local owner = owners[binding]
        if owner then
            if refs[owner] then refs[owner].shell_bindings[1] = binding end
        else
            local apps, app_err = registry.find({ [".id"] = binding, [".kind"] = "registry.entry", ["meta.type"] = "kickside.pim.ui.app" })
            if app_err then return app_err end
            if not apps or not apps[1] then
                for _, ref in pairs(refs) do ref.shell_bindings[1] = binding end
            end
        end
    end
    for _, ref in pairs(refs) do
        table.sort(ref.fields)
        table.sort(ref.scopes)
        table.sort(ref.checks)
        table.sort(ref.plugins)
    end
    return nil
end

function M.list(catalog_id: string, states: { [string]: types.PluginIntent }, compiled: types.Compiled): ({ types.PluginOption }?, error?)
    local views, err = plugins.list(states, compiled.plugins, function(plugin: types.Plugin, intent: types.PluginIntent?)
        return plugin_projections.states(catalog_id, plugin, intent)
    end)
    if err or not views then return nil, err end
    local by_attachment: { [string]: types.PluginOption } = {}
    local attachment_ids: { string } = {}
    for _, view in ipairs(views) do
        local id = view.attachment_id
        if view.active and not view.installed and id then
            by_attachment[id] = view
            attachment_ids[#attachment_ids + 1] = id
        end
    end
    -- The readable catalog's own attachment retains the package title after
    -- uninstall. Only fetch metadata for the exact attachments missing titles.
    for start = 1, #attachment_ids, 100 do
        local ids: { string } = {}
        for i = start, math.min(start + 99, #attachment_ids) do ids[#ids + 1] = attachment_ids[i] end
        local rows, title_err = component.list_system({ component_ids = ids, include = { meta = true }, limit = #ids })
        if title_err then return nil, title_err end
        for _, row in ipairs(rows or {}) do
            local title = row.meta and row.meta.title
            if type(title) == "string" and title ~= "" then by_attachment[row.component_id].title = title end
        end
    end
    local refs_err = add_plugin_references(catalog_id, views, compiled)
    if refs_err then return nil, refs_err end
    return views, nil
end
function M.context(catalog_id: string, plugin: string): (types.PluginContext?, error?)
    local _, access_err = access.reader(catalog_id)
    if access_err then return nil, access_err end
    local state, _, err = store.snapshot(catalog_id, function(_tx: types.Executor, catalog: types.Catalog, _dialect: string): (types.PluginIntent?, error?)
        if not catalog.compiled.plugins[plugin] then
            return nil, errors.new({ kind = errors.NOT_FOUND, retryable = false, message = "plugin is inactive",
                details = { code = "plugin_inactive", plugin = plugin } })
        end
        local intent = catalog.plugin_state[plugin]
        if not intent then return nil, failure.corrupt("active plugin has no lifecycle intent", "plugin_state") end
        return intent, nil
    end)
    if err or not state then return nil, err end
    local declaration, derr = plugins.load(plugin)
    if derr or not declaration then return nil, derr end
    local _, cerr = plugins.merged(declaration, {}, state.config)
    if cerr then return nil, cerr end
    local projections, perr = plugin_projections.states(catalog_id, declaration, state)
    if perr then return nil, perr end
    local binding, berr = registry.get("kickside.pim.binding:catalog")
    if berr then return nil, berr end
    local retention = (binding :: { meta: { retention: { event_days: integer } } }).meta.retention
    return { attachment_id = state.attachment_id, config = state.config, lifecycle = state.lifecycle,
        projections = projections or {}, retention = { event_days = retention.event_days } }, nil
end

return M
