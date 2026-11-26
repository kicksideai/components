-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local types = require("types")
local resources = require("resource")
local edit_rules = require("edit")
local usage_reader = require("usage")
local library_reader = require("library_reader")
local references = require("references")
local originals_reader = require("originals")
local live = require("live")
local time = require("time")
local policy = require("policy")
local scratch = require("scratch")
local globals = require("globals")
local settings = require("settings")
local preview_repo = require("preview_repo")
local live_repo = require("live_repo")

type LibraryWorkspace = {
    ex: database.Executor, items: types.ResourceMap, originals: types.OriginalMap,
    loaded: {[string]: boolean}, versions: {[string]: integer},
}

type CandidateSet = {
    items: {types.ResourceContent}, keys: {types.ResourceKey},
    previous: types.ResourceMap, expected: {[string]: integer},
}

local M = {LibraryWorkspace = LibraryWorkspace, CandidateSet = CandidateSet}

function M.workspace(ex: database.Executor, versions: {[string]: integer}?): (LibraryWorkspace?, error?)
    local originals, err = originals_reader.list()
    if err then return nil, err end
    return {ex = ex, items = {}, originals = originals :: types.OriginalMap, loaded = {}, versions = versions or {}}, nil
end

function M.load(workspace: LibraryWorkspace, key: types.ResourceKey): error?
    local id = resources.subject(key)
    if workspace.loaded[id] then return nil end
    local row, err = library_reader.get(workspace.ex, key)
    if err then return err end
    local original = workspace.originals[id]
    if original and not row then
        local position, position_err = library_reader.subject_position(workspace.ex, key)
        if position_err then return position_err end
        original.resource.revision = workspace.versions[id] or position.revision
        original.resource.seq = position.seq
        row = original.resource
    end
    workspace.items[id], workspace.loaded[id] = row, true
    return nil
end

function M.current_revision(workspace: LibraryWorkspace, key: types.ResourceKey): integer
    local id = resources.subject(key)
    local item = workspace.items[id]
    if item then return item.revision end
    return workspace.versions[id] or 0
end

local function load_edit(workspace: LibraryWorkspace, edit: types.LibraryEdit): error?
    local err = M.load(workspace, edit.key)
    if err then return err end
    if edit.from then return M.load(workspace, edit.from) end
    return nil
end

local function dependencies(workspace: LibraryWorkspace, roots: {types.ResourceContent}): error?
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

local function linked_messages(workspace: LibraryWorkspace, set: CandidateSet): ({types.Resource}?, error?)
    local selected: {types.Resource} = {}
    local seen: {[string]: boolean} = {}
    for _, key in ipairs(set.keys) do
        local sources, err = usage_reader.referrers(workspace.ex, key, workspace.originals)
        if err then return nil, err end
        for _, source in ipairs(sources) do
            local id = resources.subject(source)
            if source.kind == "message" and set.expected[id] == nil and not seen[id] then
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

function M.prepare(edit: types.LibraryEdit, operation: string, items: types.ResourceMap,
    originals: types.OriginalMap, source: types.Resource?): (types.ResourceContent?, error?)
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
        if not original then return nil, edit_rules.missing(key) end
        local invalid = resources.check_content(original.resource)
        if invalid then return nil, invalid end
        return original.resource, nil
    end
    if operation == "delete" then
        if current.state ~= "created" then
            return nil, resources.error(errors.INVALID, "mail_resource_is_shipped", "A shipped resource can only be reset", key)
        end
        return nil, nil
    end
    if key.kind == "asset" and not (edit.content or source) then
        return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide an upload to add or replace an asset", key)
    end
    local content = edit.content
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
    elseif source then
        content = source
    elseif edit.base ~= nil then
        local copy: types.Record = {}
        for field, value in pairs(current) do copy[field] = value end
        copy.base = edit.base
        content = copy :: types.ResourceContent
    end
    local normalized, err = resources.normalize(content :: types.ResourceContent)
    if err then return nil, err end
    local invalid = resources.check_content(normalized :: types.ResourceContent)
    if invalid then return nil, invalid end
    return normalized, nil
end

function M.candidates(workspace: LibraryWorkspace, operation: string, edits: {types.LibraryEdit},
    source: types.Resource?, review: boolean): (CandidateSet?, error?)
    local set: CandidateSet = {items = {}, keys = {}, previous = {}, expected = {}}
    for i, edit in ipairs(edits) do
        local key = edit.key
        if review then
            if key.kind == "asset" then
                return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", key)
            end
            local err = load_edit(workspace, edit)
            if err then return nil, err end
        end
        local candidate, err = M.prepare(edit, operation, workspace.items, workspace.originals, source)
        if err then return nil, err end
        local id = resources.subject(key)
        local revision = M.current_revision(workspace, key)
        if review and candidate.kind == "asset" then
            return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", candidate)
        end
        set.expected[id], set.items[i], set.keys[i] = revision, candidate, key
        set.previous[id], workspace.items[id] = workspace.items[id], candidate :: types.Resource
    end
    return set, nil
end

function M.preview_digest(operation: string, set: CandidateSet, edits: {types.LibraryEdit}): (string?, error?)
    return edit_rules.preview_digest(operation, set.items, set.expected, edits[1].restore)
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
    if type(input) == "table" then edit.restore = input.seq end
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

local function mismatch(): error
    return resources.error(errors.INVALID, "mail_preview_mismatch",
        "Preview the exact proposed changes again, then use the new preview_id")
end

local function bound_preview(workspace: LibraryWorkspace, id: string?, author: string, operation: string,
    edits: {types.LibraryEdit}): (types.PreviewRow?, error?)
    if id == nil or id == "" then
        return nil, resources.error(errors.INVALID, "mail_preview_required", "Preview these changes first, then pass the returned preview_id")
    end
    if type(id) ~= "string" then return nil, mismatch() end
    local row, err = preview_repo.get(workspace.ex, id)
    if err then return nil, err end
    if not row or row.actor ~= author or row.operation ~= operation then return nil, mismatch() end
    if policy.expired(row.expires_at, time.now():unix()) then
        return nil, resources.error(errors.INVALID, "mail_preview_expired", "Preview the changes again to obtain a new preview_id")
    end
    local count = 0
    for _ in pairs(row.expected) do count = count + 1 end
    if count ~= #edits then return nil, mismatch() end
    for _, edit in ipairs(edits) do
        local subject = resources.subject(edit.key)
        local expected = row.expected[subject]
        if expected == nil or (operation ~= "create" and expected ~= edit.expected) then return nil, mismatch() end
        local revision = M.current_revision(workspace, edit.key)
        if expected ~= revision or (operation ~= "create" and not workspace.items[subject]) then
            return nil, errors.new({kind = errors.CONFLICT, retryable = false,
                message = "The library changed after this preview. Review the changes again.",
                details = {code = "mail_preview_stale", resource = {kind = edit.key.kind, name = edit.key.name}, revision = revision}})
        end
    end
    return row, nil
end

function M.complete(workspace: LibraryWorkspace, candidates: {types.ResourceContent},
    set: CandidateSet?, primary: types.Resource?): ({types.Resource}?, error?)
    local dependants: {types.Resource} = {}
    if set then
        local found, err = linked_messages(workspace, set)
        if err then return nil, err end
        dependants = found :: {types.Resource}
    end
    local roots: {types.ResourceContent} = {}
    if primary then roots[1] = primary end
    for _, candidate in ipairs(candidates) do roots[#roots + 1] = candidate end
    for _, dependant in ipairs(dependants) do roots[#roots + 1] = dependant end
    local dependency_err = dependencies(workspace, roots)
    if dependency_err then return nil, dependency_err end
    for _, candidate in ipairs(candidates) do
        local base_err = edit_rules.base_exists(workspace.items, candidate)
        if base_err then return nil, base_err end
    end
    return dependants, nil
end

local function validate_templates(workspace: LibraryWorkspace, set: CandidateSet): error?
    local dependants, err = M.complete(workspace, set.items, set)
    if err then return err end
    local appearance, globals_err = settings.appearance()
    if globals_err then return globals_err end
    local values = globals.data(appearance :: types.Appearance)
    values.sender.name = ""
    local _, clear_err = scratch.clear_workspace()
    if clear_err then return clear_err end
    local _, validation_err = scratch.validate(workspace.items, set.keys[1], set.items, dependants :: {types.Resource}, values)
    return validation_err
end

function M.plan(ex: database.Executor, operation: string, edits: {types.LibraryEdit}, opts: types.LibraryWriteOptions,
    author: string, signature: string, head: integer, source: types.Resource?, versions: {[string]: integer}): ({types.LibraryEvent}?, error?)
    local mark, state_err = live_repo.get(ex)
    if state_err then return nil, state_err end
    if mark.projected_seq < head then
        return nil, edit_rules.catching_up()
    end

    local loaded, err = M.workspace(ex, versions)
    if err then return nil, err end
    local workspace = loaded :: LibraryWorkspace
    for _, edit in ipairs(edits) do
        local load_err = load_edit(workspace, edit)
        if load_err then return nil, load_err end
    end
    local binding: types.PreviewRow?
    local key = edits[1].key
    if operation ~= "delete" then
        local binding_err
        binding, binding_err = bound_preview(workspace, opts.preview_id, author, operation, edits)
        if binding_err then
            if opts.identity_op == "save" and opts.command_id and (binding_err:details() or {}).code == "mail_preview_stale" then
                for _, edit in ipairs(edits) do
                    local revision = M.current_revision(workspace, edit.key)
                    if edit.expected ~= revision then return nil, edit_rules.conflict(edit.key, revision) end
                end
            end
            return nil, binding_err
        end
    end
    local prepared, prepare_err = M.candidates(workspace, operation, edits, source, false)
    if prepare_err then return nil, prepare_err end
    local set = prepared :: CandidateSet
    if binding then
        local digest_value, digest_err = M.preview_digest(operation, set, edits)
        if digest_err then return nil, digest_err end
        if digest_value ~= binding.digest then return nil, mismatch() end
    end
    if operation == "delete" and key.kind ~= "message" then
        local in_use = usage_reader.require_unused(ex, {kind = key.kind, name = key.name}, workspace.originals)
        if in_use then return nil, in_use end
    end
    if operation ~= "delete" or key.kind ~= "message" then
        local validation_err = validate_templates(workspace, set)
        if validation_err then return nil, validation_err end
    end
    return edit_rules.plan(operation, edits, set.expected, set.previous, set.items, workspace.originals, source,
        author, opts.preview_id, signature)
end

return M
