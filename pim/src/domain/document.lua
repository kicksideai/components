-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Product documents: the patch steps an event applies and the attributes a
-- document holds under a compiled schema.
local types = require("types")

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

-- attribute_ids lists the live attributes a document holds values for.
function M.attribute_ids(compiled: types.Compiled, document: types.Document): { [integer]: boolean }
    local out: { [integer]: boolean } = {}
    local by_id = compiled.by_id or {}
    for key in pairs(document) do
        local id = math.tointeger(tonumber(key)) or 0
        if by_id[id] then out[id] = true end
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
