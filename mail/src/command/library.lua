-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local security = require("security")
local time = require("time")
local database = require("database")
local library = require("library")
local resources = require("resource")
local edit_rules = require("edit")
local edit_ops = require("library_edits")
local live = require("live")
local scratch = require("scratch")
local originals = require("originals")
local globals = require("globals")
local settings = require("settings")
local notify = require("notify")
local digest = require("digest")
local preview_repo = require("preview_repo")
local library_reader = require("library_reader")
local library_repo = require("library_repo")
local reference_repo = require("reference_repo")
local references = require("references")
local asset_file_repo = require("asset_file_repo")
local error_envelope = require("error_envelope")

local M = {}

local function write_item(tx: types.Transaction, item: types.Resource, change: types.RevisionChange): (types.Resource?, error?)
    local written, err = library_repo.write(tx, item, change)
    if err then return nil, err end
    local _, release_err = asset_file_repo.release(tx, written.released, time.now():unix_nano() // 1000000)
    if release_err then return nil, release_err end
    if item.kind ~= "asset" and not item.archived and change.state ~= "original" then
        local _, ref_err = reference_repo.replace(tx, item, references.keys(item))
        if ref_err then return nil, ref_err end
    end
    return written.item, nil
end

function M.remove(tx: types.Transaction, key: types.ResourceKey, deleting: boolean, revision: integer?): error?
    local released, err = library_repo.remove(tx, key, deleting, revision)
    if err then return err end
    if key.kind ~= "asset" then
        local _, ref_err = reference_repo.delete_from(tx, key)
        if ref_err then return ref_err end
    end
    local _, release_err = asset_file_repo.release(tx, released :: {types.Record}, time.now():unix_nano() // 1000000)
    return release_err
end

local function publish(tx: types.Transaction): (boolean?, error?)
    local declarations, declaration_err = originals.list()
    if declaration_err then return nil, declaration_err end
    local rows, read_err = library_reader.live_rows(tx)
    if read_err then return nil, read_err end
    return live.publish(rows :: {types.Resource}, declarations :: types.OriginalMap)
end

local function reconcile(): (boolean?, error?)
    return database.with_tx(function(tx: types.Transaction, dialect: string): (boolean?, error?)
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local _, clear_err = scratch.clear_workspace()
        if clear_err then return nil, clear_err end
        return publish(tx)
    end)
end

function M.boot(): {status: string, message: string?}
    local _, err = reconcile()
    if err then return {status = "error", message = err:message()} end
    return {status = "success"}
end

local function mismatch(): error
    return resources.error(errors.INVALID, "mail_preview_mismatch",
        "Preview the exact proposed changes again, then use the new preview_id")
end

local function bound_preview(workspace: types.LibraryWorkspace, id: string?, author: string, operation: string,
    edits: {types.LibraryEdit}): (types.PreviewRow?, error?)
    if id == nil or id == "" then
        return nil, resources.error(errors.INVALID, "mail_preview_required", "Preview these changes first, then pass the returned preview_id")
    end
    if type(id) ~= "string" then return nil, mismatch() end
    local row, err = preview_repo.get(workspace.ex, id)
    if err then return nil, err end
    if not row or row.actor ~= author or row.operation ~= operation then return nil, mismatch() end
    if row.expires_at <= time.now():unix() then
        return nil, resources.error(errors.INVALID, "mail_preview_expired", "Preview the changes again to obtain a new preview_id")
    end
    local count = 0
    for _ in pairs(row.expected) do count = count + 1 end
    if count ~= #edits then return nil, mismatch() end
    for _, edit in ipairs(edits) do
        local subject = resources.subject(edit.key)
        local expected = row.expected[subject]
        if expected == nil or (operation ~= "create" and expected ~= edit.expected) then return nil, mismatch() end
        local revision, revision_err = edit_ops.current_revision(workspace, edit.key)
        if revision_err then return nil, revision_err end
        if expected ~= revision or (operation ~= "create" and not workspace.items[subject]) then
            return nil, errors.new({kind = errors.CONFLICT, retryable = false,
                message = "The library changed after this preview. Review the changes again.",
                details = {code = "mail_preview_stale", resource = {kind = edit.key.kind, name = edit.key.name}, revision = revision}})
        end
    end
    return row, nil
end

function M.apply(operation: string, edits: {types.LibraryEdit}, receipt: string?): ({types.Resource}?, error?)
    local invalid = edit_rules.validate(edits, operation)
    if invalid then return nil, invalid end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    if not actor then return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library") end
    local denied = library.require_write()
    if denied then return nil, denied end
    if operation == "restore" then
        local read_denied = library.require_read()
        if read_denied then return nil, read_denied end
    end
    local author = actor:id()
    local keys: {types.ResourceKey} = {}
    local changed: {[string]: boolean} = {}
    for i, edit in ipairs(edits) do
        keys[i], changed[resources.subject(edit.key)] = edit.key, true
    end
    local key = keys[1]
    local appearance, globals_err = settings.appearance()
    if globals_err then return nil, globals_err end
    local values = globals.data(appearance :: types.Appearance)
    values.sender.name = ""

    local function write(tx: types.Transaction, dialect: string): ({types.Resource}?, error?)
        local _, lock_err = library_repo.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local workspace, load_err = edit_ops.workspace(tx)
        if load_err then return nil, load_err end
        local items, originals = workspace.items, workspace.originals
        for _, edit in ipairs(edits) do
            local err = edit_ops.load(workspace, edit.key)
            if err then return nil, err end
            if edit.from then
                local source_err = edit_ops.load(workspace, edit.from)
                if source_err then return nil, source_err end
            end
        end
        local binding: types.PreviewRow?
        if key.kind ~= "asset" and operation ~= "delete" then
            local binding_err
            binding, binding_err = bound_preview(workspace :: types.LibraryWorkspace, receipt, author, operation, edits)
            if binding_err then return nil, binding_err end
        end
        local candidates: {types.ResourceContent} = {}
        local previous: {types.Resource} = {}
        local restore_versions: {[integer]: integer} = {}
        for i, edit in ipairs(edits) do
            local id = resources.subject(edit.key)
            local candidate, err, restored_from = edit_ops.prepare(tx, edit, operation, items, originals)
            if err then return nil, err end
            previous[i] = items[id]
            items[id] = candidate :: types.Resource
            candidates[i] = candidate
            if restored_from then restore_versions[i] = restored_from end
        end
        if binding then
            local signature, err = digest.preview(operation, candidates, binding.expected, edits[1].restore)
            if err then return nil, err end
            if signature ~= binding.digest then return nil, mismatch() end
        end
        if operation == "delete" and key.kind ~= "message" then
            local sources, ref_err = library.referrers(tx, key, originals)
            if ref_err then return nil, ref_err end
            if #sources > 0 then
                return nil, errors.new({kind = errors.CONFLICT, retryable = false, message = "Library resources use this mail resource",
                    details = {code = "mail_resource_in_use", resource = key, messages = library.message_names(sources),
                        resources = sources}})
            end
        end
        local timestamp = time.now():unix_nano() // 1000000
        if operation == "delete" and key.kind == "message" then
            local item = previous[1]
            item.archived, item.author, item.updated_at = true, author, timestamp
            local archived, err = write_item(tx, item, {action = "archived", state = item.state, note = edits[1].note})
            if err then return nil, err end
            return {archived :: types.Resource}, nil
        end

        if key.kind ~= "asset" then
            local dependent, dependants_err = edit_ops.dependants(workspace, keys, changed)
            if dependants_err then return nil, dependants_err end
            local roots: {types.ResourceContent} = {}
            for _, candidate in ipairs(candidates) do roots[#roots + 1] = candidate end
            for _, item in ipairs(dependent) do roots[#roots + 1] = item end
            local dependency_err = edit_ops.dependencies(workspace, roots)
            if dependency_err then return nil, dependency_err end
            for _, candidate in ipairs(candidates) do
                local base_err = edit_rules.base_exists(items, candidate)
                if base_err then return nil, base_err end
            end
            local _, clear_err = scratch.clear_workspace()
            if clear_err then return nil, clear_err end
            local _, validation_err = scratch.validate(items, key, candidates, dependent, values)
            if validation_err then return nil, validation_err end
        end
        if operation == "delete" then
            local remove_err = M.remove(tx, key, true, key.kind ~= "asset" and previous[1].revision or nil)
            if remove_err then return nil, remove_err end
            return previous, nil
        end

        local results: {types.Resource} = {}
        for i, candidate in ipairs(candidates) do
            local stored = candidate :: types.Resource
            local current, original = previous[i], originals[resources.subject(stored)]
            stored.author, stored.updated_at = author, timestamp
            stored.created_at = current and current.created_at or timestamp
            stored.state = original and "customized" or "created"
            if stored.kind ~= "asset" then stored.archived = false end
            stored.origin = original and original.resource.origin or nil
            stored.origin_label = original and original.resource.origin_label or nil
            if stored.asset and edits[i].content then
                local _, activate_err = asset_file_repo.activate(tx, (stored.asset :: types.Asset).upload_id :: string,
                    edits[i].asset_deadline :: integer, timestamp)
                if activate_err then return nil, activate_err end
            end
            local resetting = operation == "reset" or (stored.asset ~= nil and stored.asset.source == "original")
            local action = "edited"
            if restore_versions[i] then
                action = "restored"
            elseif resetting then
                action = "reset"
            elseif not current then
                action = "created"
            elseif current.base ~= stored.base then
                action = "base_changed"
            end
            local item, write_err = write_item(tx, stored, {
                action = action, state = resetting and "original" or stored.state,
                restored_from = restore_versions[i], note = edits[i].note,
            })
            if write_err then return nil, write_err end
            if resetting then
                local remove_err = M.remove(tx, keys[i], false)
                if remove_err then return nil, remove_err end
                item.state, item.author, item.created_at, item.updated_at = "original", nil, nil, nil
            end
            results[i] = item
        end
        if key.kind == "asset" and edits[1].content then
            local sources, ref_err = library.referrers(tx, key, originals :: types.OriginalMap)
            if ref_err then return nil, ref_err end
            results[1].used_by = {messages = library.message_names(sources :: {types.ResourceKey})}
        end
        return results, nil
    end

    local published = false
    local saved, err = database.with_tx(function(tx: types.Transaction, dialect: string): ({types.Resource}?, error?)
        local result, write_err = write(tx, dialect)
        if write_err then return nil, write_err end
        if keys[1].kind ~= "asset" and not (operation == "delete" and keys[1].kind == "message") then
            local _, projection_err = publish(tx)
            if projection_err then
                return nil, error_envelope.wrap(projection_err, projection_err:message(),
                    {code = "mail_projection_failed", resource = keys[1]})
            end
            published = true
        end
        return result, nil
    end)
    if err then
        if published then
            return nil, error_envelope.cleanup(reconcile, err, "Mail live source reconciliation failed")
        end
        return nil, err
    end
    if key.kind == "asset" then notify.retention() end
    notify.library()
    return saved, nil
end

function M.one(edit: types.LibraryEdit, operation: string, receipt: string?): (types.Resource?, error?)
    local saved, err = M.apply(operation, {edit}, receipt)
    if err then return nil, err end
    return saved[1], nil
end

return M
