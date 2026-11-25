-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local security = require("security")
local resource = require("resource")
local jet = require("jet")

local M = {}

function M.editable(declared: types.Original): error?
    for _, id in pairs(declared.entries) do
        if not security.can("registry.overlay.shadow", id) or not security.can("registry.overlay.update.template.jet", id)
            or not security.can("registry.overlay.delete.template.jet", id) then
            return resource.error(errors.PERMISSION_DENIED, "mail_original_not_editable",
                "The installed module does not grant projection access to this original", declared.resource)
        end
    end
    return nil
end

local function desired(rows: {types.Resource}, originals: types.OriginalMap): ({[string]: types.JetEntry}?, error?)
    local entries: {[string]: types.JetEntry} = {}
    for _, item in ipairs(rows) do
        local original = originals[resource.subject(item)]
        local origin_err = resource.match_origin(item, original)
        if origin_err then return nil, origin_err end
        for _, entry in ipairs(jet.entries(item, jet.live_namespace, jet.html, jet.text, original and original.entries)) do
            entries[entry.id] = entry
        end
    end
    return entries, nil
end

function M.publish(rows: {types.Resource}, originals: types.OriginalMap): (boolean?, error?)
    local entries, err = desired(rows, originals)
    if err then return nil, err end

    local overlay, open_err = registry.overlay(jet.owner)
    if open_err then return nil, open_err end
    local existing, list_err = overlay:entries()
    if list_err then return nil, list_err end
    local changes = overlay:changes()
    local count = 0
    for _, old in ipairs(existing) do
        local entry = entries[old.id]
        if not entry then
            local _, stage_err = changes:delete(old.id)
            if stage_err then return nil, stage_err end
            count = count + 1
        elseif old.meta.name ~= entry.meta.name or old.data.set ~= entry.data.set or old.data.source ~= entry.data.source then
            local _, stage_err = changes:update(entry)
            if stage_err then return nil, stage_err end
            count = count + 1
        end
        entries[old.id] = nil
    end
    for id, entry in pairs(entries) do
        local _, stage_err
        if id:sub(1, #jet.live_namespace) == jet.live_namespace then
            _, stage_err = changes:create(entry)
        else
            _, stage_err = changes:update(entry)
        end
        if stage_err then return nil, stage_err end
        count = count + 1
    end
    if count ~= 0 then
        local _, apply_err = changes:apply()
        if apply_err then return nil, apply_err end
    end
    return true, nil
end

return M
