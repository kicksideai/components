-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local resources = require("resources")
local store = require("store")
local live = require("live")

local M = {}

function M.missing(key: types.ResourceKey): error
    return resources.error(errors.NOT_FOUND, "mail_resource_not_found", "Mail library resource was not found", key)
end

function M.conflict(key: types.ResourceKey, revision: integer): error
    return errors.new({kind = errors.CONFLICT, retryable = false, message = "Mail library resource has changed",
        details = {code = "mail_revision_conflict", resource = {kind = key.kind, name = key.name}, revision = revision}})
end

function M.base_exists(items: types.ResourceMap, resource: types.ResourceContent): error?
    if resource.base and not items[resources.key({kind = "base", name = resource.base})] then
        return resources.error(errors.INVALID, "mail_base_not_found", "The selected base does not exist", resource)
    end
    return nil
end

function M.dependants(ex: types.Executor, items: types.ResourceMap, originals: types.OriginalMap,
    keys: {types.ResourceKey}, changed: {[string]: boolean}): ({types.Resource}?, error?)
    local selected: {types.Resource} = {}
    local seen: {[string]: boolean} = {}
    for _, key in ipairs(keys) do
        local sources, err = store.referrers(ex, key, originals)
        if err then return nil, err end
        for _, source in ipairs(sources) do
            local id = resources.key(source)
            if source.kind == "message" and items[id] and not changed[id] and not seen[id] then
                selected[#selected + 1] = items[id]
                seen[id] = true
            end
        end
    end
    table.sort(selected, function(a, b) return a.name < b.name end)
    return selected, nil
end

function M.prepare(tx: types.Transaction, edit: types.LibraryEdit, operation: string,
    items: types.ResourceMap, originals: types.OriginalMap): (types.ResourceContent?, error?, integer?)
    local key = edit.key
    local id = resources.key(key)
    local current, original = items[id], originals[id]
    if operation == "create" then
        if current then return nil, M.conflict(key, current.revision) end
    else
        if not current then return nil, M.missing(key) end
        if edit.expected ~= current.revision then return nil, M.conflict(key, current.revision) end
    end
    if original then
        local projection_err = live.editable(original)
        if projection_err then return nil, projection_err end
    end
    if operation == "reset" then
        if current.state ~= "customized" then
            return nil, resources.error(errors.INVALID, "mail_resource_not_customized", "Only customized resources can be reset", key)
        end
        return original.resource, nil
    end
    if operation == "delete" then
        if current.state ~= "created" then
            return nil, resources.error(errors.INVALID, "mail_resource_is_shipped", "A shipped resource can only be reset", key)
        end
        return nil, nil
    end
    if key.kind == "asset" and not (edit.content or edit.restore) then
        return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide an upload to add or replace an asset", key)
    end
    local content = edit.content
    local restored_from: integer?
    if operation == "create" and edit.from then
        local bad_from = resources.check_key(edit.from)
        if bad_from then return nil, bad_from end
        if edit.from.kind ~= key.kind then
            return nil, resources.error(errors.INVALID, "invalid_mail_resource", "The source must have the same resource kind", key)
        end
        local source = items[resources.key(edit.from)]
        if not source then return nil, M.missing(edit.from) end
        local copy: types.Record = {}
        for field, value in pairs(source) do copy[field] = value end
        for field, value in pairs(content) do copy[field] = value end
        content = copy :: types.ResourceContent
    elseif edit.restore then
        local history, history_err = store.history(tx, key, edit.restore)
        if history_err then return nil, history_err end
        if not history[1] then
            return nil, resources.error(errors.NOT_FOUND, "mail_revision_not_found", "Mail library revision was not found", key)
        end
        content = history[1].content
        restored_from = history[1].version
        if content.asset and content.asset.source == "original" then
            if not original then return nil, M.missing(key) end
            return original.resource, nil, restored_from
        end
    elseif edit.base ~= nil then
        local copy: types.Record = {}
        for field, value in pairs(current) do copy[field] = value end
        copy.base = edit.base
        content = copy :: types.ResourceContent
    end
    local normalized, err = resources.normalize(content :: types.ResourceContent)
    return normalized, err, restored_from
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

function M.create(input: types.ResourceCreate): types.LibraryEdit
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    return {key = input, content = input :: types.ResourceContent, note = fields.note, from = fields.from}
end

return M
