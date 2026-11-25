-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local resources = require("resource")

local M = {}

function M.missing(key: types.ResourceKey): error
    return resources.error(errors.NOT_FOUND, "mail_resource_not_found", "Mail library resource was not found", key)
end

function M.conflict(key: types.ResourceKey, revision: integer): error
    return errors.new({kind = errors.CONFLICT, retryable = false, message = "Mail library resource has changed",
        details = {code = "mail_revision_conflict", resource = {kind = key.kind, name = key.name}, revision = revision}})
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
        local bad_key = resources.check_key(key)
        if bad_key then return bad_key end
        local note_err = resources.check_note(edit.note)
        if note_err then return note_err end
        if operation == "create" then
            local name_err = resources.check_input_key(key)
            if name_err then return name_err end
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

return M
