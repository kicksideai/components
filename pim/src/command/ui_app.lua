-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local component = require("component")
local security = require("security")
local consts = require("consts")
local failure = require("failure")
local types = require("types")

local M = {}

local function lookup(id: string, entry_type: string): (registry.Entry?, error?)
    if not id:match("^[^:%s]+:[^:%s]+$") then return nil, nil end
    local entries, err = registry.find({ [".id"] = id, [".kind"] = "registry.entry", ["meta.type"] = entry_type })
    if err then return nil, err end
    if entries and #entries == 1 then return entries[1], nil end
    return nil, nil
end

function M.validate(id: string): error?
    local entry, err = lookup(id, "kickside.pim.ui.app")
    if err then return err end
    local invalid = failure.invalid("catalog UI app is unavailable: " .. id, { code = "invalid_ui_app", ui_app = id })
    if not entry then return invalid end
    local meta = entry.meta or {}
    if type(meta.title) ~= "string" or not meta.title:match("%S") or type(meta.icon) ~= "string" or not meta.icon:match("%S") then
        return invalid
    end
    local page, tag = meta.page, meta.component
    if page ~= nil then
        if tag ~= nil or type(page) ~= "string" or page:sub(1, 1) ~= "/" or page:sub(1, 2) == "//"
            or page:match("[\\%s%c?#]") then return invalid end
    elseif type(tag) ~= "string" or not tag:match("^[a-z][a-z0-9]*%-[a-z0-9][a-z0-9%-]*$") then
        return invalid
    end
    return nil
end

function M.preset(pack: string): (string?, error?)
    local entry, err = lookup(pack, "kickside.pim.pack")
    if err then return nil, err end
    local binding: unknown = entry and type(entry.data) == "table" and entry.data.ui_app or nil
    if type(binding) ~= "string" or binding == "" then
        return nil, failure.invalid("catalog UI preset is unavailable: " .. pack, { code = "invalid_pack", pack = pack })
    end
    return binding, nil
end

-- Component's owned metadata validator also runs for generic metadata writes.
function M.authorize(input: { component_id: string }): (boolean?, error?)
    return security.can("component.runtime_meta.write", input.component_id, { impl_id = consts.CATALOG_IMPL })
end

function M.update(id: string, binding: string): (types.UpdateResult?, error?)
    local rows, err = component.query({ component_ids = { id }, impl_ids = { consts.CATALOG_IMPL },
        access_mask = component.ACCESS.ADMIN, limit = 1 })
    if err then return nil, err end
    if not rows or not rows[1] then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "catalog access denied",
            details = { code = "catalog_access_denied" } })
    end
    if binding == "" then
        local _, clear_err = component.set_meta(id, {}, { trusted_runtime = true, delete_keys = { "pim_ui_app" } })
        if clear_err then return nil, clear_err end
        return { catalog_id = id }, nil
    end
    local validation_err = M.validate(binding)
    if validation_err then return nil, validation_err end
    local _, set_err = component.set_meta(id, { pim_ui_app = binding }, { trusted_runtime = true })
    if set_err then return nil, set_err end
    return { catalog_id = id, ui_app = binding }, nil
end

return M
