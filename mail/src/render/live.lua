-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local security = require("security")
local resource = require("resource")
local jet = require("jet")

local M = {}
local MARKER = "kickside.mail.projection:marker"

function M.published(entries: {types.JetEntry}): integer?
    for _, entry in ipairs(entries) do
        if entry.id == MARKER then return entry.data.seq :: integer? end
    end
    return nil
end

function M.open(): (registry.Snapshot?, error?)
    return registry.overlay(jet.owner)
end

function M.fence(seq: integer, snapshot_seq: integer?): error?
    local marker, err = registry.get(MARKER)
    if err and not errors.is(err, errors.NOT_FOUND) then return err end
    local published = marker and marker.data.seq
    if published == seq and (snapshot_seq == nil or snapshot_seq == seq) then return nil end
    return errors.new({kind = errors.UNAVAILABLE, retryable = true, message = "Mail library templates are publishing",
        details = {code = "mail_library_publishing", template_seq = seq, published = published or -1}})
end

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

function M.publish(overlay: registry.Snapshot, existing: {types.JetEntry}, rows: {types.Resource},
    originals: types.OriginalMap, seq: integer): (boolean?, error?)
    local entries, err = desired(rows, originals)
    if err then return nil, err end

    local changes = overlay:changes()
    for _, old in ipairs(existing) do
        if old.id ~= MARKER then
            local entry = entries[old.id]
            if not entry then
                local _, stage_err = changes:delete(old.id)
                if stage_err then return nil, stage_err end
            elseif old.meta.name ~= entry.meta.name or old.data.set ~= entry.data.set or old.data.source ~= entry.data.source then
                local _, stage_err = changes:update(entry)
                if stage_err then return nil, stage_err end
            end
            entries[old.id] = nil
        end
    end
    for id, entry in pairs(entries) do
        local _, stage_err
        if id:sub(1, #jet.live_namespace) == jet.live_namespace then
            _, stage_err = changes:create(entry)
        else
            _, stage_err = changes:update(entry)
        end
        if stage_err then return nil, stage_err end
    end
    local marker = {id = MARKER, kind = "registry.entry", meta = {type = "kickside.mail:live_marker"}, data = {seq = seq}}
    local _, stage_err
    if M.published(existing) == nil then
        _, stage_err = changes:create(marker)
    else
        _, stage_err = changes:update(marker)
    end
    if stage_err then return nil, stage_err end
    local _, apply_err = changes:apply()
    if apply_err then return nil, apply_err end
    return true, nil
end

return M
