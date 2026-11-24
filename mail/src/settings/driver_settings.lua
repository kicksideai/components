-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local settings_types = require("settings_types")
local definitions = require("settings_defs")
local settings = require("settings")
local function rows(namespace: string): ({types.DriverSetting}?, error?)
    local snapshot, err = settings.namespace(namespace)
    if err then return nil, err end
    local overrides: {[string]: boolean} = {}
    for _, key in ipairs(snapshot.overridden or {}) do overrides[key] = true end
    local values = snapshot.values or {}
    local result: {types.DriverSetting} = {}
    for key, def in pairs(definitions.all()[namespace] or {}) do
        if def.read_access == nil or def.read_access == "admin" then
            local secret = settings_types.SECRET_TYPES[def.value_type] == true
            local row: types.DriverSetting = {namespace = namespace, key = key, value_type = def.value_type,
                title = def.title, description = def.description, order = def.order, editable = def.editable,
                schema = def.schema, is_secret = secret}
            if secret then
                row.has_value = overrides[key] == true
            else
                row.value, row.default = values[key], def.default
            end
            result[#result + 1] = row
        end
    end
    table.sort(result, function(a: types.DriverSetting, b: types.DriverSetting): boolean
        if (a.order or 100) ~= (b.order or 100) then return (a.order or 100) < (b.order or 100) end
        return a.key < b.key
    end)
    return result, nil
end

return {rows = rows}
