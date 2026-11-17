-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Product documents: the patch steps an event applies and the usage of the
-- attributes a document holds under a compiled schema.
local types = require("types")
local values = require("values")

local M = {}

-- apply_step is shared by command planning and the event fold.
function M.apply_step(document: types.Document, step: types.PatchStep, source: string?)
    local key = tostring(step.a)
    local coords: types.Coordinates = document[key] or {}
    if step.unset then
        coords[step.c] = nil
    elseif step.clear then
        coords[step.c] = { c = 1, s = step.s or source }
    else
        coords[step.c] = { p = step.v, s = step.s or source }
    end
    document[key] = next(coords) and coords or nil
end

-- apply_patch applies one event patch to a decoded document.
function M.apply_patch(document: types.Document, patch: { types.PatchStep }, source: string?)
    for _, step in ipairs(patch) do M.apply_step(document, step, source) end
end

-- usage records whether any authored cell fails either index rule, including
-- on models and in contexts that a current index does not resolve.
function M.usage(compiled: types.Compiled, document: types.Document): { [integer]: types.AttributeUsage }
    local out: { [integer]: types.AttributeUsage } = {}
    local by_id = compiled.by_id or {}
    for key, coords in pairs(document) do
        local attr = by_id[math.tointeger(tonumber(key)) or 0]
        if attr then
            local usage: types.AttributeUsage = { products = 1, key_violations = 0, order_violations = 0 }
            local ordered = attr.cardinality == "one" and (attr.form == "int" or attr.form == "dec" or attr.form == "quantity")
            for _, cell in pairs(coords) do
                if cell.c == nil and cell.p ~= nil then
                    if usage.key_violations == 0 and values.key_error(attr, cell.p) then
                        usage.key_violations = 1
                    end
                    if ordered and usage.order_violations == 0 then
                        local _, err = values.order(attr.form, values.scalar(cell.p), attr.config)
                        if err then usage.order_violations = 1 end
                    end
                end
            end
            out[attr.id] = usage
        end
    end
    return out
end

-- compact keeps only values of attributes the schema declares.
function M.compact(compiled: types.Compiled, document: types.Document): boolean
    local by_id = compiled.by_id or {}
    local changed = false
    for key in pairs(document) do
        if not by_id[math.tointeger(tonumber(key)) or 0] then
            document[key] = nil
            changed = true
        end
    end
    return changed
end

return M
