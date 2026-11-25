-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local resources = require("resource")
local edit_rules = require("edit")
local library = require("library")
local library_reader = require("library_reader")
local references = require("references")
local originals_reader = require("originals")
local live = require("live")

local M = {}

function M.workspace(ex: types.Executor): (types.LibraryWorkspace?, error?)
    local originals, err = originals_reader.list()
    if err then return nil, err end
    return {ex = ex, items = {}, originals = originals :: types.OriginalMap, loaded = {}}, nil
end

function M.load(workspace: types.LibraryWorkspace, key: types.ResourceKey): error?
    local id = resources.subject(key)
    if workspace.loaded[id] then return nil end
    local row, err = library_reader.get(workspace.ex, key)
    if err then return err end
    local original = workspace.originals[id]
    if original and (not row or row.state == "original") then
        original.resource.revision = row and row.revision or 0
        row = original.resource
    end
    workspace.items[id], workspace.loaded[id] = row, true
    return nil
end

function M.current_revision(workspace: types.LibraryWorkspace, key: types.ResourceKey): (integer?, error?)
    local item = workspace.items[resources.subject(key)]
    if item then return item.revision, nil end
    return library_reader.deleted_revision(workspace.ex, key)
end

function M.dependencies(workspace: types.LibraryWorkspace, roots: {types.ResourceContent}): error?
    local visited: {[string]: boolean} = {}
    for _, item in ipairs(roots) do visited[resources.subject(item)] = true end
    for _, item in ipairs(roots) do
        local keys = references.template_keys(item)
        for _, name in ipairs(references.asset_names(item)) do keys[#keys + 1] = {kind = "asset", name = name} end
        for _, key in ipairs(keys) do
            local err = M.load(workspace, key)
            if err then return err end
            local id = resources.subject(key)
            local dependency = workspace.items[id]
            if dependency and not dependency.archived and not visited[id] then
                visited[id] = true
                roots[#roots + 1] = dependency
            end
        end
    end
    return nil
end

function M.dependants(workspace: types.LibraryWorkspace, keys: {types.ResourceKey}, changed: {[string]: boolean}): ({types.Resource}?, error?)
    local selected: {types.Resource} = {}
    local seen: {[string]: boolean} = {}
    for _, key in ipairs(keys) do
        local sources, err = library.referrers(workspace.ex, key, workspace.originals)
        if err then return nil, err end
        for _, source in ipairs(sources) do
            local id = resources.subject(source)
            if source.kind == "message" and not changed[id] and not seen[id] then
                local read_err = M.load(workspace, source)
                if read_err then return nil, read_err end
                local item = workspace.items[id]
                if item and not item.archived then selected[#selected + 1] = item end
                seen[id] = true
            end
        end
    end
    table.sort(selected, function(a, b) return a.name < b.name end)
    return selected, nil
end

function M.prepare(ex: types.Executor, edit: types.LibraryEdit, operation: string,
    items: types.ResourceMap, originals: types.OriginalMap): (types.ResourceContent?, error?, integer?)
    local key = edit.key
    local id = resources.subject(key)
    local current, original = items[id], originals[id]
    if operation == "create" then
        if current then return nil, edit_rules.conflict(key, current.revision) end
    else
        if not current or (current.archived and operation ~= "restore") then return nil, edit_rules.missing(key) end
        if edit.expected ~= current.revision then return nil, edit_rules.conflict(key, current.revision) end
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
        local source = items[resources.subject(edit.from)]
        if not source or source.archived then return nil, edit_rules.missing(edit.from) end
        local copy: types.Record = {}
        for field, value in pairs(source) do copy[field] = value end
        for field, value in pairs(content) do copy[field] = value end
        content = copy :: types.ResourceContent
    elseif edit.restore then
        local history, history_err = library_reader.history(ex, key, edit.restore)
        if history_err then return nil, history_err end
        if not history[1] then
            return nil, resources.error(errors.NOT_FOUND, "mail_revision_not_found", "Mail library revision was not found", key)
        end
        content = history[1].content
        restored_from = history[1].version
        if content.asset and content.asset.source == "original" then
            if not original then return nil, edit_rules.missing(key) end
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

function M.create(input: types.ResourceCreate): types.LibraryEdit
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    return {key = input, content = input :: types.ResourceContent, note = fields.note, from = fields.from}
end

function M.update(input: types.ResourceEdit): types.LibraryEdit
    local fields = type(input) == "table" and input or {} :: types.ResourceEdit
    return {key = input, content = input, expected = fields.expected_revision, note = fields.note}
end

function M.set_base(input: types.ResourceBaseEdit): types.LibraryEdit
    local fields = type(input) == "table" and input or {} :: types.ResourceBaseEdit
    return {key = {kind = "message", name = fields.name}, expected = fields.expected_revision,
        base = fields.base, note = fields.note}
end

function M.revision(input: types.ResourceRevision): types.LibraryEdit
    local fields = type(input) == "table" and input or {} :: types.ResourceRevision
    return {key = input, expected = fields.expected_revision, note = fields.note}
end

function M.restore(input: types.ResourceRestore): types.LibraryEdit
    local edit = M.revision(input)
    if type(input) == "table" then edit.restore = input.revision end
    return edit
end

function M.save(input: types.ResourceSave): ({types.LibraryEdit}?, error?)
    if type(input) ~= "table" or edit_rules.count(input.resources) == 0 then
        return nil, resources.error(errors.INVALID, "invalid_mail_resources", "Provide an array of resources to save")
    end
    local edits: {types.LibraryEdit} = {}
    for i, item in ipairs(input.resources) do
        if item.kind == "asset" then
            return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", item)
        end
        local edit = M.update(item)
        if edit.note == nil then edit.note = input.note end
        edits[i] = edit
    end
    return edits, nil
end

return M
