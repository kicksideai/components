-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Canonical field cells preserve explicit clearing independently of the event log.
local values = require("values")
local types = require("types")

local M = {}

function M.value(document: types.Document, field_id: integer): types.Value?
    local cell = document[tostring(field_id)]
    return cell and cell.p
end

function M.state(document: types.Document, field_id: integer): string
    local cell = document[tostring(field_id)]
    if not cell then return "absent" end
    return cell.c == 1 and "cleared" or "provided"
end

function M.apply_patch(document: types.Document, patch: { types.PatchStep })
    for _, p in ipairs(patch) do
        local key = tostring(p.f)
        if p.unset then document[key] = nil
        elseif p.clear then document[key] = { c = 1 }
        else document[key] = { p = p.v } end
    end
end

function M.set_step(document: types.Document, field_id: integer, value: types.Value): types.PatchStep?
    local before = M.value(document, field_id)
    if before ~= nil and values.equal(before, value) then return nil end
    return { f = field_id, v = value, before = before }
end

function M.remove_step(document: types.Document, field_id: integer, mode: string): types.PatchStep?
    local state = M.state(document, field_id)
    if (mode == "clear" and state == "cleared") or (mode == "unset" and state == "absent") then return nil end
    local before = M.value(document, field_id)
    if mode == "clear" then return { f = field_id, clear = true, before = before } end
    return { f = field_id, unset = true, before = before }
end

return M
