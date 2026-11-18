-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Installed declarations are discovered under the signed-in caller's scope.
local registry = require("registry")
local types = require("types")
local M = {}
function M.field_types(): ({ types.FieldTypeOption }?, error?)
    local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.work.type" })
    if err then return nil, errors.wrap(err, "field type discovery failed") end
    local out: { types.FieldTypeOption } = {}
    for _, entry in ipairs(entries or {}) do
        local meta = entry.meta :: types.Map
        if type(meta.form) == "string" then
            out[#out + 1] = {
                id = entry.id, title = type(meta.title) == "string" and meta.title :: string or "Custom field type",
                form = meta.form :: string, config_schema = type(meta.config_schema) == "table" and meta.config_schema :: types.Map or nil,
            }
        end
    end
    table.sort(out, function(a: types.FieldTypeOption, b: types.FieldTypeOption): boolean return a.title < b.title end)
    return out, nil
end
return M
