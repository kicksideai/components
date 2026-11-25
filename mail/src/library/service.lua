-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local security = require("security")
local time = require("time")
local client = require("client")
local database = require("database")
local store = require("store")
local resources = require("resources")
local edit_ops = require("edits")
local projection = require("projection")
local draft = require("draft")
local globals = require("globals")
local realtime = require("realtime")
local preview_id = require("preview_id")
local attachments = require("attachments")
local asset_refs = require("asset_refs")
local asset_store = require("asset_store")
local notifier = require("notifier")
local funcs = require("funcs")
local uuid = require("uuid")
local logger = require("logger")
local error_envelope = require("error_envelope")

local M = {}

local function change(edits: {types.LibraryEdit}, operation: string, receipt: string?): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local changed: {[string]: boolean} = {}
    local keys: {types.ResourceKey} = {}
    for i, edit in ipairs(edits) do
        local key = edit.key
        local bad_key = resources.check_key(key)
        if bad_key then return nil, bad_key end
        local note_err = resources.check_note(edit.note)
        if note_err then return nil, note_err end
        if operation == "create" then
            local name_err = resources.check_input_key(key)
            if name_err then return nil, name_err end
            if edit.from ~= nil then
                local from_err = resources.check_key(edit.from)
                if from_err then return nil, from_err end
            end
        elseif type(edit.expected) ~= "number" or math.tointeger(edit.expected) == nil or edit.expected < 0 then
            return nil, resources.error(errors.INVALID, "invalid_mail_revision", "Provide an expected revision", key)
        end
        if edit.content then
            local content_err = resources.check_content(edit.content)
            if content_err then return nil, content_err end
        end
        if edit.base ~= nil then
            local base_err = resources.check_input_key({kind = "base", name = edit.base})
            if base_err then return nil, base_err end
        end
        local id = resources.key(key)
        if changed[id] then
            return nil, resources.error(errors.INVALID, "duplicate_mail_resource", "A resource can appear only once per save", key)
        end
        changed[id], keys[i] = true, key
    end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    if not actor then return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library") end
    local author = actor:id()
    local values, globals_err = globals.library_samples()
    if globals_err then return nil, globals_err end

    local function write(tx: types.Transaction, dialect: string): ({types.Resource}?, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, load_err, originals = resources.load(tx)
        if load_err then return nil, load_err end
        local key = keys[1]
        local candidates: {types.ResourceContent} = {}
        local previous: {types.Resource} = {}
        local restore_versions: {[integer]: integer} = {}
        for i, edit in ipairs(edits) do
            local id = resources.key(edit.key)
            if (edit.restore or operation == "create") and not items[id] then
                local archived, read_err = store.get(tx, edit.key)
                if read_err then return nil, read_err end
                if archived and archived.archived then items[id] = archived end
            end
            local candidate, err, restored_from = edit_ops.prepare(tx, edit, operation, items :: types.ResourceMap, originals :: types.OriginalMap)
            if err then return nil, err end
            previous[i] = items[id]
            items[id] = candidate :: types.Resource
            candidates[i] = candidate
            if restored_from then restore_versions[i] = restored_from end
        end
        if operation == "delete" and key.kind ~= "message" then
            local sources, ref_err = store.referrers(tx, key, originals :: types.OriginalMap)
            if ref_err then return nil, ref_err end
            if #sources > 0 then
                return nil, errors.new({kind = errors.CONFLICT, retryable = false, message = "Library resources use this mail resource",
                    details = {code = "mail_resource_in_use", resource = key, messages = store.message_names(sources),
                        resources = sources}})
            end
        end
        for _, candidate in ipairs(candidates) do
            local base_err = edit_ops.base_exists(items :: types.ResourceMap, candidate)
            if base_err then return nil, base_err end
        end
        if receipt ~= nil then
            if type(receipt) ~= "string" then
                return nil, resources.error(errors.INVALID, "invalid_mail_preview", "preview_id must be text")
            end
            local unbound = preview_id.verify(receipt, candidates, author, operation, time.now():unix())
            if unbound then return nil, unbound end
        end
        local timestamp = time.now():unix_nano() // 1000000
        if operation == "delete" and key.kind == "message" then
            local item = previous[1]
            item.archived, item.author, item.updated_at = true, author, timestamp
            local archived, err = store.write(tx, item, {action = "archived", state = item.state, note = edits[1].note})
            if err then return nil, err end
            return {archived :: types.Resource}, nil
        end

        if key.kind ~= "asset" then
            local dependent = edit_ops.dependants(items :: types.ResourceMap, keys, changed)
            local _, validation_err = draft.validate(items :: types.ResourceMap, key, candidates, dependent, values :: types.RenderGlobals)
            if validation_err then return nil, validation_err end
        end
        if operation == "delete" then
            local remove_err = store.remove(tx, key, true)
            if remove_err then return nil, remove_err end
            return previous, nil
        end

        local results: {types.Resource} = {}
        for i, candidate in ipairs(candidates) do
            local stored = candidate :: types.Resource
            local current, original = previous[i], originals[resources.key(stored)]
            stored.author, stored.updated_at = author, timestamp
            stored.created_at = current and current.created_at or timestamp
            stored.state = original and "customized" or "created"
            if stored.kind ~= "asset" then stored.archived = false end
            stored.origin = original and original.resource.origin or nil
            stored.origin_label = original and original.resource.origin_label or nil
            if stored.asset and edits[i].content then
                local activate_err = asset_store.activate(tx, (stored.asset :: types.Asset).upload_id :: string,
                    edits[i].asset_deadline :: integer)
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
            local item, write_err = store.write(tx, stored, {
                action = action, state = resetting and "original" or stored.state,
                restored_from = restore_versions[i], note = edits[i].note,
            })
            if write_err then return nil, write_err end
            if resetting then
                local remove_err = store.remove(tx, keys[i], false)
                if remove_err then return nil, remove_err end
                item.state, item.author, item.created_at, item.updated_at = "original", nil, nil, nil
            end
            results[i] = item
        end
        if key.kind == "asset" and edits[1].content then
            local sources, ref_err = store.referrers(tx, key, originals :: types.OriginalMap)
            if ref_err then return nil, ref_err end
            results[1].used_by = {messages = store.message_names(sources :: {types.ResourceKey})}
        end
        return results, nil
    end

    local published = false
    local saved, err = database.with_tx(function(tx: types.Transaction, dialect: string): ({types.Resource}?, error?)
        local result, write_err = write(tx, dialect)
        if write_err then return nil, write_err end
        if keys[1].kind ~= "asset" and not (operation == "delete" and keys[1].kind == "message") then
            local _, projection_err = projection.publish(tx)
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
            return nil, error_envelope.cleanup(projection.reconcile, err, "Mail live source reconciliation failed")
        end
        return nil, err
    end
    if keys[1].kind == "asset" then
        local _, notify_err = notifier.notify({kind = "owner_eligibility_changed"})
        if notify_err then logger:error("Mail retention notification failed", {error = tostring(notify_err)}) end
    end
    for _, item in ipairs(saved) do realtime.library(item) end
    return saved, nil
end

local function change_one(edit: types.LibraryEdit, operation: string, receipt: string?): (types.Resource?, error?)
    local saved, err = change({edit}, operation, receipt)
    if err then return nil, err end
    return saved[1], nil
end

local function dimension(value: unknown): boolean
    return value == nil or (type(value) == "number" and math.tointeger(value) ~= nil and value > 0)
end

local function adopt(input: types.AssetWrite, operation: string): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local key = {kind = "asset", name = input.name}
    local bad = operation == "create" and resources.check_input_key(key) or resources.check_key(key)
    if bad then return nil, bad end
    local note_err = resources.check_note(input.note)
    if note_err then return nil, note_err end
    if operation == "update" and (type(input.expected_revision) ~= "number"
        or math.tointeger(input.expected_revision) == nil or input.expected_revision < 0) then
        return nil, resources.error(errors.INVALID, "invalid_mail_revision", "Provide an expected revision", key)
    end
    local content_err = resources.check_content((input :: unknown) :: types.ResourceContent)
    if content_err then return nil, content_err end
    if type(input.upload_id) ~= "string" or not uuid.validate(input.upload_id)
        or not dimension(input.width) or not dimension(input.height)
        or (input.title ~= nil and (type(input.title) ~= "string" or not input.title:find("%S")))
        or (input.description ~= nil and type(input.description) ~= "string") then
        return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide an upload ID and optional image dimensions", key)
    end
    local current, read_err = resources.get(key)
    if read_err and read_err:kind() ~= errors.NOT_FOUND then return nil, read_err end
    if operation == "create" then
        if current then return nil, edit_ops.conflict(key, current.revision) end
    elseif not current then
        return nil, edit_ops.missing(key)
    elseif input.expected_revision ~= current.revision then
        return nil, edit_ops.conflict(key, current.revision)
    end
    local _, info, info_err = attachments.upload_info(input.upload_id)
    if info_err then return nil, info_err end
    info = info :: types.ContentInfo
    local bad_image = asset_refs.image_error(info.content_type, info.size)
    if bad_image then return nil, bad_image end
    local version = uuid.v7()
    local lease = time.now():utc():add(15 * time.MINUTE)
    local asset: types.Asset = {source = "upload", upload_id = version, filename = info.filename,
        content_type = info.content_type, size = info.size :: integer, width = input.width, height = input.height}
    local deadline = lease:unix_nano() // 1000000
    local _, reserve_err = asset_store.reserve(asset, deadline)
    if reserve_err then return nil, reserve_err end
    local _, notify_err = notifier.notify({kind = "owner_eligibility_changed"})
    if notify_err then return nil, notify_err end
    local adopted, adopt_err = funcs.call("kickside.uploads:adopt_component_upload", {
        component_id = asset_store.component_id(), upload_id = input.upload_id, version_id = version,
        lease_until = lease:format(time.RFC3339),
    })
    if adopt_err then return nil, adopt_err end
    if (adopted :: {upload_id: string}).upload_id ~= version then
        return nil, resources.error(errors.INTERNAL, "invalid_mail_asset", "Uploads returns an unexpected asset version", key)
    end
    local candidate: types.ResourceContent = {kind = key.kind, name = input.name, title = input.title or (current and current.title) or input.name,
        description = input.description or (current and current.description) or "", html = "", text = "",
        schema = {type = "object", properties = {}}, samples = {}, asset = asset}
    return change_one({key = key, content = candidate, expected = input.expected_revision, note = input.note,
        asset_deadline = deadline}, operation)
end

function M.asset_add(input: types.AssetWrite): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" then return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide a mail asset upload") end
    local current, read_err = resources.get({kind = "asset", name = input.name})
    if read_err and read_err:kind() ~= errors.NOT_FOUND then return nil, read_err end
    if current and input.expected_revision == nil then input.expected_revision = current.revision end
    if not current and input.expected_revision ~= nil then return nil, edit_ops.missing({kind = "asset", name = input.name}) end
    return adopt(input, current and "update" or "create")
end

function M.create(input: types.ResourceCreate): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    if fields.kind == "asset" then return adopt((input :: unknown) :: types.AssetWrite, "create") end
    return change_one(edit_ops.create(input), "create", fields.preview_id)
end

function M.update(input: types.ResourceEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceEdit
    if fields.kind == "asset" then return adopt((input :: unknown) :: types.AssetWrite, "update") end
    return change_one({key = input, content = input, expected = fields.expected_revision, note = fields.note}, "update")
end

function M.save(input: types.ResourceSave): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local size = type(input) == "table" and edit_ops.count(input.resources) or 0
    if size == 0 then
        return nil, resources.error(errors.INVALID, "invalid_mail_resources", "Provide an array of resources to save")
    end
    local edits: {types.LibraryEdit} = {}
    for i, item in ipairs(input.resources) do
        if item.kind == "asset" then
            return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", item)
        end
        local note = item.note
        if note == nil then note = input.note end
        edits[i] = {key = item, content = item, expected = item.expected_revision, note = note}
    end
    return change(edits, "update", input.preview_id)
end

function M.set_base(input: types.ResourceBaseEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceBaseEdit
    local denied = client.require_library()
    if denied then return nil, denied end
    local bad = resources.check_input_key({kind = "base", name = fields.base})
    if bad then return nil, bad end
    return change_one({key = {kind = "message", name = fields.name}, expected = fields.expected_revision,
        base = fields.base, note = fields.note}, "update")
end

function M.reset(input: types.ResourceRevision): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceRevision
    return change_one({key = input, expected = fields.expected_revision, note = fields.note}, "reset")
end

function M.restore(input: types.ResourceRestore): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" or type(input.revision) ~= "number" or math.tointeger(input.revision) == nil
        or input.revision < 1 then
        return nil, resources.error(errors.INVALID, "invalid_mail_revision", "A positive revision number is required")
    end
    return change_one({key = input, expected = input.expected_revision, note = input.note, restore = input.revision}, "update")
end

function M.delete(input: types.ResourceRevision): (boolean?, error?)
    local _, err = change_one({key = input, expected = type(input) == "table" and input.expected_revision or nil}, "delete")
    if err then return nil, err end
    return true, nil
end

return M
