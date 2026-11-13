-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
-- Activation admits exact manifests and associates each seam with its declared plugin.
local manifests = require("manifests")
local registry = require("registry")
local security = require("security")
local defaults = require("defaults")
local shape = require("shape")
local types = require("types")
local M = {}

local FIELD_TYPE = "kickside.work.type"

local function invalid(code: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code } })
end
function M.compile(entries: { types.PluginDecl }?, configs: { [string]: types.JsonObject }?, board_id: string?, previous: { types.PluginDecl }?): ({ types.PluginDecl }?, error?)
    if #(entries or {}) > 200 then return nil, invalid("plugin_limit", "a board activates at most 200 plugins") end
    local out: { types.PluginDecl } = {}
    local seen: { [string]: boolean } = {}
    for _, entry in ipairs(entries or {}) do
        if seen[entry.use] then return nil, invalid("plugin_duplicate", "plugin activation is unique") end
        seen[entry.use] = true
        local plugin, err = manifests.load(entry.use)
        if err or not plugin then return nil, err end
        local config = (configs or {})[entry.use] or {}
        local app: types.JsonObject = {}
        if plugin.settings then
            local values, verr = defaults.namespace(plugin.settings)
            if verr or not values then return nil, verr end
            app = values
        end
        local effective, eerr = manifests.effective(plugin, app, config)
        if eerr then return nil, eerr end
        local resolved = entry.schema
        if board_id then
            local current = nil
            for _, old in ipairs(previous or {}) do if old.use == entry.use then current = old.schema end end
            local serr: error?
            resolved, serr = manifests.resolve_schema(plugin, { board_id = board_id, config = effective or {}, current = current })
            if serr then return nil, serr end
        end
        out[#out + 1] = { use = entry.use, attachment_kind = plugin.attachment, schema = resolved }
    end
    for _, activation in ipairs(out) do
        local manifest, err = manifests.load(activation.use)
        if err or not manifest then return nil, err end
        for _, required in ipairs(manifest.requires) do
            if not seen[required] then return nil, invalid("plugin_required", activation.use .. " requires " .. required) end
        end
    end
    return out, nil
end
function M.seam(id: string, entries: { types.PluginDecl }?, in_use: boolean?, kind: string?): error?
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return err end
    if kind and (not entry or (entry.meta or {}).type ~= "kickside.work." .. kind) then
        return invalid("unknown_" .. kind, "unknown " .. kind .. " " .. id)
    end
    if err or not entry then return invalid("plugin_seam_unowned", "seam is unavailable or its plugin is unlisted") end
    local owner = (entry.meta or {}).plugin
    for _, plugin in ipairs(entries or {}) do
        if plugin.use == owner then
            local manifest, merr = manifests.load(plugin.use)
            if merr or not manifest then return merr end
            for _, seam in ipairs(manifest.seams) do if seam == id then return nil end end
            return invalid("plugin_seam_unowned", "plugin manifest does not declare seam " .. id)
        end
    end
    return invalid(in_use and "plugin_seam_in_use" or "plugin_seam_unowned", "seam " .. id .. " requires its listed plugin")
end
-- load_type reads and checks the field type entry id: its form, the indexes it can
-- take and its config schema. A type declares data only; it names no callbacks.
function M.load_type(id: string): (types.FieldType?, error?)
    local entry, err = registry.get(id)
    if err and err:kind() ~= errors.NOT_FOUND then return nil, err end
    if not entry then return nil, errors.new({ details = { code = "unknown_type" }, kind = errors.INVALID, message = "unknown type " .. id }) end
    local meta = registry_values.canonical(entry.meta)
    if type(meta) ~= "table" then return nil, errors.new({ details = { code = "unknown_type" }, kind = errors.INVALID, message = id .. " is not a work type" }) end
    local m = meta :: { [string]: unknown }
    if m.type ~= FIELD_TYPE or type(m.form) ~= "string" then return nil, errors.new({ details = { code = "unknown_type" }, kind = errors.INVALID, message = id .. " is not a work type" }) end
    if m.normalize ~= nil or m.validate ~= nil then
        return nil, invalid("plugin_type_callbacks_unsupported", "field types take no normalize or validate callbacks")
    end
    local indexes: { string }? = nil
    if type(m.indexes) == "table" then
        local list: { string } = {}
        for _, k in ipairs(m.indexes :: { unknown }) do
            if type(k) == "string" then list[#list + 1] = k end
        end
        indexes = list
    end
    local config_schema: types.JsonObject? = nil
    if m.config_schema ~= nil then
        if type(m.config_schema) ~= "table" or (m.config_schema :: { [string]: unknown }).type ~= "object" then
            return nil, errors.new({ details = { code = "unknown_type" }, kind = errors.INVALID, message = id .. " config_schema must describe an object" })
        end
        config_schema = m.config_schema :: types.JsonObject
    end
    return { form = m.form :: string, indexes = indexes, config_schema = config_schema }, nil
end

function M.field(declaration: types.FieldDecl, entries: { types.PluginDecl }?, in_use: boolean?): (string?, error?)
    local id = declaration.type :: string
    local err = M.seam(id, entries, in_use, "type")
    if err then return nil, err end
    local kind, kerr = M.load_type(id)
    if kerr or not kind then return nil, kerr end
    if declaration.form and declaration.form ~= kind.form then return nil, invalid("invalid_schema", "field form differs from its declared type") end
    if declaration.index and declaration.index ~= "none" and kind.indexes then
        local found = false
        for _, index in ipairs(kind.indexes) do if index == declaration.index then found = true end end
        if not found then return nil, invalid("invalid_schema", "field type refuses this index") end
    end
    if kind.config_schema then
        local cerr = shape.check(shape.tolerant(kind.config_schema :: types.JsonObject), declaration.config or {}, "field config")
        if cerr then return nil, cerr end
    end
    return kind.form, nil
end

return M
