-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local resources = require("resource")
local events = require("events")
local uuid = require("uuid")

local M = {}

function M.missing(key: types.ResourceKey): error
    return resources.error(errors.NOT_FOUND, "mail_resource_not_found", "Mail library resource was not found", key)
end

function M.conflict(key: types.ResourceKey, revision: integer): error
    return errors.new({kind = errors.CONFLICT, retryable = false, message = "Mail library resource has changed",
        details = {code = "mail_revision_conflict", resource = {kind = key.kind, name = key.name}, revision = revision}})
end

function M.catching_up(head: integer?, projected: integer?): error
    return errors.new({kind = errors.CONFLICT, retryable = true, message = "Mail library is catching up",
        details = {code = "mail_library_catching_up", head = head, projected_seq = projected}})
end

function M.base_exists(items: types.ResourceMap, resource: types.ResourceContent): error?
    if resource.base and not items[resources.subject({kind = "base", name = resource.base})] then
        return resources.error(errors.INVALID, "mail_base_not_found", "The selected base does not exist", resource)
    end
    return nil
end

function M.count(input: unknown): integer
    if type(input) ~= "table" then return 0 end
    local size = #input
    if size > resources.MAX_EDITS then return 0 end
    for i in pairs(input) do
        if type(i) ~= "number" or math.tointeger(i) == nil or i < 1 or i > size then return 0 end
    end
    for i = 1, size do
        if type(input[i]) ~= "table" then return 0 end
    end
    return size
end

function M.validate(edits: {types.LibraryEdit}, operation: string): error?
    local changed: {[string]: boolean} = {}
    for _, edit in ipairs(edits) do
        local key = edit.key
        local asset_create = operation == "create" and type(key) == "table" and key.kind == "asset"
        local bad_key = (asset_create and resources.check_input_key or resources.check_key)(key)
        if bad_key then return bad_key end
        local note_err = resources.check_note(edit.note)
        if note_err then return note_err end
        if operation == "create" then
            if not asset_create then
                local name_err = resources.check_input_key(key)
                if name_err then return name_err end
            end
            if edit.from ~= nil then
                local from_err = resources.check_key(edit.from)
                if from_err then return from_err end
            end
        elseif type(edit.expected) ~= "number" or math.tointeger(edit.expected) == nil or edit.expected < 0 then
            return resources.error(errors.INVALID, "invalid_mail_revision", "Provide an expected revision", key)
        end
        if edit.content then
            local content_err = resources.check_content(edit.content)
            if content_err then return content_err end
        end
        if operation == "restore" and (type(edit.restore) ~= "number" or math.tointeger(edit.restore) == nil or edit.restore < 1) then
            return resources.error(errors.INVALID, "invalid_mail_revision", "A positive revision number is required", key)
        end
        if operation == "set_base" then
            local base_err = resources.check_input_key({kind = "base", name = edit.base or ""})
            if base_err then return base_err end
        end
        local id = resources.subject(key)
        if changed[id] then
            return resources.error(errors.INVALID, "duplicate_mail_resource", "A resource can appear only once per save", key)
        end
        changed[id] = true
    end
    return nil
end

function M.command_id(value: string?): (string?, error?)
    if type(value) ~= "string" or not uuid.validate(value) then
        return nil, resources.error(errors.INVALID, "invalid_mail_command_id", "Command ID must be a UUID")
    end
    return value:lower(), nil
end

local event_types = {
    create = events.CREATED, update = events.UPDATED, set_base = events.BASE_SET, reset = events.RESET,
    restore = events.RESTORED,
}

function M.event_type(operation: string, key: types.ResourceKey): string
    if key.kind == "asset" then
        if operation == "delete" then return events.ASSET_REMOVED end
        if operation == "restore" then return events.ASSET_RESTORED end
        if operation ~= "reset" then return events.ASSET_ADDED end
    end
    if operation == "delete" then return key.kind == "message" and events.ARCHIVED or events.DELETED end
    return event_types[operation] :: string
end

function M.plan(operation: string, edits: {types.LibraryEdit}, revisions: {integer}, previous: types.ResourceMap,
    candidates: {types.ResourceContent}, originals: types.OriginalMap, restored: {[integer]: integer},
    restore_seq: integer?, author: string, receipt: string?, signature: string): ({types.LibraryEvent}?, error?)
    local batch: {types.LibraryEvent} = {}
    for i, edit in ipairs(edits) do
        local key = {kind = edit.key.kind, name = edit.key.name}
        local id = resources.subject(key)
        local original, current = originals[id], previous[id]
        local item = candidates[i]
        local event_type = M.event_type(operation, key)
        local body: types.LibraryEventBody = {key = key, revision = revisions[i] + 1, author = author,
            note = edit.note, command_hash = signature, change = "edited"}
        if operation == "delete" then
            body.change = key.kind == "message" and "archived" or "deleted"
        else
            body.content, body.base = events.snapshot(item), item.base
            body.state, body.preview_id = original and "customized" or "created", receipt
            if original then
                body.origin, body.origin_label = original.resource.origin, original.resource.origin_label
            end
            if operation == "create" then
                body.change = "created"
                if edit.from then body.from = {kind = edit.from.kind, name = edit.from.name} end
            elseif operation == "reset" then
                body.change, body.state = "reset", "original"
            elseif operation == "set_base" then
                body.change, body.previous_base = "base_changed", current.base
            elseif operation == "restore" then
                body.change, body.from_seq, body.from_version = "restored", restore_seq, restored[i]
            end
        end
        local event, err = events.build(event_type, body)
        if err then return nil, err end
        batch[i] = event :: types.LibraryEvent
    end
    return batch, nil
end

return M
