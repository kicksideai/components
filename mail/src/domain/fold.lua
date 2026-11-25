-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local events = require("events")
local references = require("references")
local resource = require("resource")

local M = {}

local upserts = {
    [events.CREATED] = true, [events.UPDATED] = true, [events.BASE_SET] = true, [events.RESTORED] = true,
}
local deletes = {
    [events.RESET] = true, [events.DELETED] = true, [events.ASSET_REMOVED] = true,
}
local asset_upserts = {[events.ASSET_ADDED] = true, [events.ASSET_RESTORED] = true}

function M.key(event: types.PrefetchedLibraryEvent): (types.ResourceKey?, error?)
    local kind = event.type
    if not (upserts[kind] or deletes[kind] or asset_upserts[kind] or kind == events.ARCHIVED) then
        return nil, resource.error(errors.INTERNAL, "mail_unknown_event", "Unknown library event " .. kind)
    end
    local key = event.body.key
    local err = resource.check_input_key(key)
    if err then return nil, err end
    return key, nil
end

function M.apply(state: types.ProjectedState?, event: types.PrefetchedLibraryEvent, at: integer): (types.FoldEffect?, error?)
    local kind, body, seq = event.type, event.body, event.seq
    local resource_key, key_err = M.key(event)
    if key_err then return nil, key_err end
    local key = resource_key :: types.ResourceKey
    local effect: types.FoldEffect = {
        history = {seq = seq, kind = key.kind, name = key.name, version = body.revision, action = body.change,
            at = at, author = body.author, note = body.note, restored_from = body.from_version},
        template_change = key.kind ~= "asset" and kind ~= events.ARCHIVED,
    }
    if upserts[kind] or kind == events.RESET then
        local content, err = events.content(body)
        if err then return nil, err end
        if upserts[kind] then
            local item = content :: types.ResourceContent
            effect.upsert = {
                kind = item.kind, name = item.name, title = item.title, description = item.description,
                html = item.html, text = item.text, subject = item.subject, base = item.base,
                schema = item.schema, samples = item.samples, state = body.state :: string,
                origin = body.origin, origin_label = body.origin_label, revision = body.revision, last_seq = seq,
                archived = kind ~= events.RESTORED and state ~= nil and (state.archived == true or state.archived == 1),
                author = body.author, created_at = state and state.created_at or at, updated_at = at,
            }
            effect.refs = references.keys(item)
        end
    end
    if deletes[kind] then
        effect.delete = true
    elseif kind == events.ARCHIVED then
        if not state then
            return nil, resource.error(errors.INTERNAL, "mail_projection_resource_missing", "Cannot archive a missing resource", key)
        end
        effect.archive = true
    elseif asset_upserts[kind] then
        local asset = body.asset :: types.EventAsset
        effect.upsert_asset = {
            name = key.name, title = body.title :: string, description = body.description :: string,
            origin = body.origin, origin_label = body.origin_label, author = body.author,
            upload_id = asset.upload_id, filename = asset.filename, content_type = asset.content_type, size = asset.size,
            revision = body.revision, last_seq = seq, created_at = state and state.created_at or at, updated_at = at,
        }
    end
    local previous_upload = state and state.upload_id
    if previous_upload and (effect.delete or (effect.upsert_asset and previous_upload ~= effect.upsert_asset.upload_id)) then
        effect.retire = {upload_id = previous_upload, last_seq = (state :: types.ProjectedState).last_seq}
    end
    return effect, nil
end

return M
