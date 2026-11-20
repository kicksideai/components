-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local domain = require("domain")
local values = require("values")
local fields = require("fields")
local catalog = require("catalog")
local M = {}

local function field_identity(field: domain.Field): string
    return values.canonical({ field.id, field.type, field.form, field.cardinality, field.plugin or "" })
end

local function type_identity(item_type: domain.ItemType): string
    return values.canonical({ item_type.process, item_type.plugin or "" })
end

function M.identities(board: domain.Board, preset: types.Preset, overrides: { string }): ({ [string]: string }?, string?, error?)
    local item_type = board.model.item_types[preset.type]
    if not item_type then return nil, nil, catalog.problem(errors.INVALID, "unknown_type", "template item type is unavailable") end
    local process = board.model.processes[item_type.process]
    if preset.state and preset.state ~= process.initial then
        return nil, nil, catalog.problem(errors.INVALID, "unknown_state", "template state must be the item's initial state")
    end
    local allowed: { [string]: boolean } = {}
    for _, code in ipairs(item_type.fields) do allowed[code] = true end
    local used: { [string]: boolean } = {}
    for code in pairs(preset.values or {}) do used[code] = true end
    for _, code in ipairs(overrides) do used[code] = true end
    local identities: { [string]: string } = {}
    for code in pairs(used) do
        local field = board.model.fields[code]
        if not field or not allowed[code] then
            return nil, nil, catalog.problem(errors.INVALID, "unknown_field", "template item type has no field " .. code)
        end
        if field.type == "counter" or field.type == "formula" or field.type == "rollup" or field.type == "rank" then
            return nil, nil, catalog.problem(errors.INVALID, "read_only", "template field is computed: " .. code)
        end
        identities[code] = field_identity(field)
    end
    return identities, type_identity(item_type), nil
end

function M.validate(board: domain.Board, preset: types.Preset): error?
    if #values.canonical(preset) > 65536 then
        return catalog.problem(errors.INVALID, "template_preset_too_large", "template preset exceeds 65536 bytes")
    end
    for code, raw in pairs(preset.values or {}) do
        local field = board.model.fields[code] :: domain.Field
        local normalized, err = fields.normalize(field, raw)
        if err then return err end
        if normalized ~= nil then
            local verr = fields.validate(field, normalized)
            if verr then return verr end
        end
    end
    return nil
end

function M.current(board: domain.Board, version: types.Version): error?
    local identities, item_type, err = M.identities(board, version.record.preset, version.record.override_fields)
    if err or item_type ~= version.type_identity or not values.equal(identities, version.field_identities) then
        return catalog.problem(errors.CONFLICT, "template_schema_changed", "template field, type or initial state changed; publish and pin a new version")
    end
    return nil
end

function M.matches(field: domain.Field, version: types.Version): boolean
    return version.field_identities[field.code] == field_identity(field)
end

function M.merge(version: types.Version, overrides: types.Map?): (types.Preset?, error?)
    local base = version.record.preset
    local merged: types.Map = table.create(0, 1)
    for code, value in pairs(base.values or {}) do merged[code] = value end
    local allowed: { [string]: boolean } = {}
    for _, code in ipairs(version.record.override_fields) do allowed[code] = true end
    for code, value in pairs(overrides or {}) do
        if not allowed[code] then
            return nil, catalog.problem(errors.INVALID, "template_override_denied", "template does not allow overriding " .. code)
        end
        merged[code] = value
    end
    local preset = { op = "create", type = base.type, parent = base.parent, state = base.state, values = merged }
    if #values.canonical(preset) > 65536 then
        return nil, catalog.problem(errors.INVALID, "template_preset_too_large", "template preset exceeds 65536 bytes")
    end
    return preset, nil
end

return M
