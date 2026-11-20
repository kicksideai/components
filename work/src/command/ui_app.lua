-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local M = {}

local function invalid(id: string): error
    return errors.new({ kind = errors.INVALID, message = "board UI app is unavailable: " .. id,
        details = { code = "invalid_ui_app", ui_app = id } })
end

function M.validate(id: string): error?
    if not id:match("^[^:%s]+:[^:%s]+$") then return invalid(id) end
    local entries, err = registry.find({ [".id"] = id, [".kind"] = "registry.entry", ["meta.type"] = "kickside.work.ui.app" })
    if err then return err end
    if not entries or #entries ~= 1 then return invalid(id) end
    local meta = entries[1].meta or {}
    if type(meta.title) ~= "string" or not meta.title:match("%S") or type(meta.icon) ~= "string" or not meta.icon:match("%S") then
        return invalid(id)
    end
    local page = meta.page
    local component = meta.component
    if page ~= nil then
        if component ~= nil or type(page) ~= "string" or page:sub(1, 1) ~= "/" or page:sub(1, 2) == "//"
            or page:match("[\\%s%c?#]") then return invalid(id) end
    elseif type(component) ~= "string" or not component:match("^[a-z][a-z0-9]*%-[a-z0-9][a-z0-9%-]*$") then
        return invalid(id)
    end
    return nil
end

return M
