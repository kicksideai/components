-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local security = require("security")
local time = require("time")
local client = require("client")
local database = require("database")
local store = require("store")
local resources = require("resources")
local projection = require("projection")
local draft = require("draft")
local renderer = require("render")
local globals = require("globals")
local outbox = require("outbox")
local settings = require("settings")
local policy = require("policy")
local realtime = require("realtime")
local keyset = require("keyset")
local preview_id = require("preview_id")
local attachments = require("attachments")
local message = require("message")
local asset_refs = require("asset_refs")
local asset_store = require("asset_store")
local notifier = require("notifier")
local funcs = require("funcs")
local uuid = require("uuid")
local logger = require("logger")

local M = {}

local function missing(key: types.ResourceKey): error
    return resources.error(errors.NOT_FOUND, "mail_resource_not_found", "Mail library resource was not found", key)
end

local function conflict(key: types.ResourceKey, revision: integer): error
    return errors.new({kind = errors.CONFLICT, retryable = false, message = "Mail library resource has changed",
        details = {code = "mail_revision_conflict", resource = {kind = key.kind, name = key.name}, revision = revision}})
end

local function base_exists(items: types.ResourceMap, resource: types.ResourceContent): error?
    if resource.base and not items[resources.key({kind = "base", name = resource.base})] then
        return resources.error(errors.INVALID, "mail_base_not_found", "The selected base does not exist", resource)
    end
    return nil
end

local function dependants(items: types.ResourceMap, keys: {types.ResourceKey}, changed: {[string]: boolean}): {types.Resource}
    local all = false
    local bases: {[string]: boolean} = {}
    for _, key in ipairs(keys) do
        if key.kind == "part" then all = true end
        if key.kind == "base" then bases[key.name] = true end
    end
    local selected: {types.Resource} = {}
    for id, item in pairs(items) do
        if item.kind == "message" and not changed[id] and (all or (item.base and bases[item.base])) then
            selected[#selected + 1] = item
        end
    end
    table.sort(selected, function(a, b) return a.name < b.name end)
    return selected
end

local function message_names(items: {types.Resource}): {string}
    local names = {}
    for i, item in ipairs(items) do names[i] = item.name end
    return names
end

local function prepare(tx: sql.Transaction, edit: types.LibraryEdit, operation: string,
    items: types.ResourceMap, originals: types.OriginalMap): (types.ResourceContent?, error?, integer?)
    local key = edit.key
    local id = resources.key(key)
    local current, original = items[id], originals[id]
    if operation == "create" then
        if current then return nil, conflict(key, current.revision) end
    else
        if not current then return nil, missing(key) end
        if edit.expected ~= current.revision then return nil, conflict(key, current.revision) end
    end
    if original then
        local projection_err = projection.check_shadow(original)
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
        if not source then return nil, missing(edit.from) end
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
            if not original then return nil, missing(key) end
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

local function change(edits: {types.LibraryEdit}, operation: string, receipt: string?): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local changed: {[string]: boolean} = {}
    local keys: {types.ResourceKey} = {}
    for i, edit in ipairs(edits) do
        local key = edit.key
        local bad_key = resources.check_key(key)
        if bad_key then return nil, bad_key end
        if edit.note ~= nil and type(edit.note) ~= "string" then
            return nil, resources.error(errors.INVALID, "invalid_revision_note", "A revision note must be text", key)
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
    local values, globals_err = globals.read()
    if globals_err then return nil, globals_err end

    local saved, error_before_commit = database.transaction(function(tx: sql.Transaction, dialect: string): ({types.Resource}?, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, load_err, originals = resources.load(tx)
        if load_err then return nil, load_err end
        local key = keys[1]
        if operation == "delete" and key.kind == "asset" then
            local references, usage_err = draft.asset_usage(items :: types.ResourceMap, values :: types.RenderGlobals)
            if usage_err then return nil, usage_err end
            local messages = references[key.name] or {}
            if #messages > 0 then
                return nil, errors.new({kind = errors.CONFLICT, retryable = false, message = "Messages use this mail asset",
                    details = {code = "mail_resource_in_use", resource = key, messages = messages}})
            end
        end
        local candidates: {types.ResourceContent} = {}
        local previous: {types.Resource} = {}
        local restore_versions: {[integer]: integer} = {}
        local asset_usage: {[string]: {string}}?
        for i, edit in ipairs(edits) do
            local candidate, err, restored_from = prepare(tx, edit, operation, items :: types.ResourceMap, originals :: types.OriginalMap)
            if err then return nil, err end
            local id = resources.key(edit.key)
            previous[i] = items[id]
            items[id] = candidate :: types.Resource
            candidates[i] = candidate
            if restored_from then restore_versions[i] = restored_from end
        end
        if key.kind == "asset" and edits[1].content then
            local usage_err
            asset_usage, usage_err = draft.asset_usage(items :: types.ResourceMap, values :: types.RenderGlobals)
            if usage_err then return nil, usage_err end
        end
        for _, candidate in ipairs(candidates) do
            local base_err = base_exists(items :: types.ResourceMap, candidate)
            if base_err then return nil, base_err end
        end
        if receipt ~= nil then
            if type(receipt) ~= "string" then
                return nil, resources.error(errors.INVALID, "invalid_mail_preview", "preview_id must be text")
            end
            local unbound = preview_id.verify(receipt, candidates, author, operation, time.now():unix())
            if unbound then return nil, unbound end
        end
        local dependent = dependants(items :: types.ResourceMap, keys, changed)
        if operation == "delete" and key.kind == "base" and #dependent ~= 0 then
            return nil, errors.new({kind = errors.CONFLICT, retryable = false, message = "Messages use this base template",
                details = {code = "mail_resource_in_use", resource = key, messages = message_names(dependent)}})
        end
        if key.kind ~= "asset" then
            local validation_err = draft.validate(items :: types.ResourceMap, key, candidates, dependent, values :: types.RenderGlobals)
            if validation_err then return nil, validation_err end
        end
        if operation == "delete" then
            local remove_err = store.remove(tx, key, true)
            if remove_err then return nil, remove_err end
            return previous, nil
        end

        local results: {types.Resource} = {}
        local timestamp = time.now():unix_nano() // 1000000
        for i, candidate in ipairs(candidates) do
            local stored = candidate :: types.Resource
            local current, original = previous[i], originals[resources.key(stored)]
            stored.author, stored.updated_at = author, timestamp
            stored.created_at = current and current.created_at or timestamp
            stored.state = original and "customized" or "created"
            stored.origin = original and original.resource.origin or nil
            stored.origin_label = original and original.resource.origin_label or nil
            if stored.asset and edits[i].content then
                local activate_err = asset_store.activate(tx, (stored.asset :: types.Asset).upload_id :: string)
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
            if asset_usage then item.used_by = {messages = asset_usage[item.name] or {}} end
            results[i] = item
        end
        return results, nil
    end)
    if error_before_commit then return nil, error_before_commit end
    local projection_err: error?
    if keys[1].kind == "asset" then
        local _, notify_err = notifier.notify({kind = "owner_eligibility_changed"})
        if notify_err then logger:error("Mail retention notification failed", {error = tostring(notify_err)}) end
    else
        local _
        _, projection_err = projection.reconcile()
    end
    if projection_err then
        local revisions = {}
        for i, item in ipairs(saved) do
            revisions[i] = {kind = item.kind, name = item.name, revision = item.revision}
        end
        return nil, errors.new({kind = projection_err:kind(), retryable = false, message = projection_err:message(),
            details = {code = "mail_projection_failed", resource = keys[1], revision = saved[1].revision, resources = revisions}})
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
    local bad = resources.check_key(key)
    if bad then return nil, bad end
    if type(input.upload_id) ~= "string" or not uuid.validate(input.upload_id)
        or not dimension(input.width) or not dimension(input.height)
        or (input.title ~= nil and (type(input.title) ~= "string" or not input.title:find("%S")))
        or (input.description ~= nil and type(input.description) ~= "string")
        or (input.note ~= nil and type(input.note) ~= "string") then
        return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide an upload ID and optional image dimensions", key)
    end
    local current, read_err = resources.get(key)
    if read_err and read_err:kind() ~= errors.NOT_FOUND then return nil, read_err end
    if operation == "create" then
        if current then return nil, conflict(key, current.revision) end
    elseif not current then
        return nil, missing(key)
    elseif input.expected_revision ~= current.revision then
        return nil, conflict(key, current.revision)
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
    local _, reserve_err = asset_store.reserve(asset, lease:unix_nano() // 1000000)
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
    return change_one({key = key, content = candidate, expected = input.expected_revision, note = input.note}, operation)
end

function M.asset_add(input: types.AssetWrite): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" then return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide a mail asset upload") end
    local current, read_err = resources.get({kind = "asset", name = input.name})
    if read_err and read_err:kind() ~= errors.NOT_FOUND then return nil, read_err end
    if current and input.expected_revision == nil then input.expected_revision = current.revision end
    if not current and input.expected_revision ~= nil then return nil, missing({kind = "asset", name = input.name}) end
    return adopt(input, current and "update" or "create")
end

local function count(input: unknown): integer
    if type(input) ~= "table" then return 0 end
    local size = #input
    for i in pairs(input) do
        if type(i) ~= "number" or math.tointeger(i) == nil or i < 1 or i > size then return 0 end
    end
    for i = 1, size do
        if type(input[i]) ~= "table" then return 0 end
    end
    return size
end

local function sampled_asset_usage(): ({[string]: {string}}?, error?)
    local values, err = globals.read()
    if err then return nil, err end
    return database.transaction(function(tx: sql.Transaction, dialect: string): ({[string]: {string}}?, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, load_err = resources.load(tx)
        if load_err then return nil, load_err end
        return draft.asset_usage(items :: types.ResourceMap, values :: types.RenderGlobals)
    end)
end

local function used_by(item: types.Resource): (types.UsedBy?, error?)
    if item.kind == "asset" then
        local usage, err = sampled_asset_usage()
        if err then return nil, err end
        return {messages = usage[item.name] or {}}, nil
    elseif item.kind == "base" then
        local messages, read_err = resources.list({kind = "message", base = item.name})
        if read_err then return nil, read_err end
        return {messages = message_names(messages)}, nil
    elseif item.kind == "message" then
        local config, config_err = settings.read("kickside.mail")
        if config_err then return nil, config_err end
        local days = policy.retention_days(config.log_retention_days)
        if not days then return nil, settings.missing("Mail delivery log retention days are invalid") end
        local senders, read_err = outbox.recent_senders(item.name, policy.now() - days * policy.DAY_MS)
        if read_err then return nil, read_err end
        return {recent_senders = senders}, nil
    end
    return nil, nil
end

function M.get(input: types.ResourceKey): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local found, err, declared = resources.get(input)
    if err then return nil, err end
    local item = found :: types.Resource
    if declared and item.kind ~= "asset" then
        local source = declared.resource
        item.original = {html = source.html, text = source.text, subject = source.subject,
            base = source.base, schema = source.schema, samples = source.samples}
    end
    local usage, usage_err = used_by(item)
    if usage_err then return nil, usage_err end
    item.used_by = usage
    return item, nil
end

function M.list(input: types.ResourceFilter?): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    return resources.list(input or {})
end

function M.list_page(input: types.LibraryPageRequest): (types.LibraryPage?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" or (input.q ~= nil and type(input.q) ~= "string")
        or (input.kind and input.kind ~= "base" and input.kind ~= "message" and input.kind ~= "part" and input.kind ~= "asset")
        or (input.state and input.state ~= "original" and input.state ~= "customized" and input.state ~= "created") then
        return nil, resources.error(errors.INVALID, "invalid_mail_filter", "Provide a valid resource kind, state and search query")
    end
    local limit, cursor, page_err = keyset.args(input)
    if page_err then return nil, page_err end
    local items, read_err = M.list(input)
    if read_err then return nil, read_err end
    local page, next_cursor = keyset.page(items, function(row: unknown): string
        return resources.key(row :: types.ResourceKey)
    end, limit :: integer, cursor)
    local rows: {types.LibraryListRow} = {}
    local base_counts: {[string]: integer}?
    for i, value in ipairs(page) do
        local item = value :: types.Resource
        local usage: types.UsedBy?
        if item.kind == "base" then
            if not base_counts then
                local messages, read_err = resources.list({kind = "message"})
                if read_err then return nil, read_err end
                base_counts = {}
                for _, message in ipairs(messages) do
                    local base = message.base :: string
                    base_counts[base] = (base_counts[base] or 0) + 1
                end
            end
        elseif item.kind == "message" then
            local usage_err
            usage, usage_err = used_by(item)
            if usage_err then return nil, usage_err end
        end
        rows[i] = {kind = item.kind, name = item.name, title = item.title, description = item.description,
            state = item.state, revision = item.revision, origin = item.origin, origin_label = item.origin_label,
            base = item.base, author = item.author, updated_at = item.updated_at,
            used_by = base_counts and item.kind == "base" and {messages = base_counts[item.name] or 0}
                or usage and {messages = usage.messages and #usage.messages or nil,
                    recent_sources = usage.recent_senders and #usage.recent_senders or nil} or nil}
    end
    return {items = rows, next_cursor = next_cursor}, nil
end

local function create_edit(input: types.ResourceCreate): types.LibraryEdit
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    return {key = input, content = input :: types.ResourceContent, note = fields.note, from = fields.from}
end

function M.create(input: types.ResourceCreate): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    if fields.kind == "asset" then return adopt((input :: unknown) :: types.AssetWrite, "create") end
    return change_one(create_edit(input), "create", fields.preview_id)
end

function M.update(input: types.ResourceEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceEdit
    if fields.kind == "asset" then return adopt((input :: unknown) :: types.AssetWrite, "update") end
    return change_one({key = input, content = input, expected = fields.expected_revision, note = fields.note}, "update")
end

function M.save(input: types.ResourceSave): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local size = type(input) == "table" and count(input.resources) or 0
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
    return change_one({key = {kind = "message", name = fields.name}, expected = fields.expected_revision,
        base = fields.base, note = fields.note}, "update")
end

function M.reset(input: types.ResourceRevision): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceRevision
    return change_one({key = input, expected = fields.expected_revision, note = fields.note}, "reset")
end

function M.history(input: types.ResourceKey): ({types.Revision}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local bad_key = resources.check_key(input)
    if bad_key then return nil, bad_key end
    local _, err = resources.get(input)
    if err then return nil, err end
    return database.read(function(db: sql.DB): ({types.Revision}?, error?)
        return store.history(db, input)
    end)
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

function M.render(input: types.PreviewRequest): (types.Rendered?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if input.attachments ~= nil then
        local invalid = message.attachments_error(input.attachments)
        if invalid then return nil, invalid end
    end
    local result, err = renderer.render(input.template, input.vars, input.attachments)
    if err then return nil, err end
    local rendered = result :: types.Rendered
    local inline, inline_err = attachments.preview(rendered, input.attachments)
    if inline_err then return nil, inline_err end
    return {subject = rendered.subject, html = rendered.html, text = rendered.text, inline_assets = inline}, nil
end

local function preview(input: types.EditPreview, bind: boolean): (types.Rendered | types.DraftPreview | nil, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" or type(input.message) ~= "string"
        or (input.resource and (input.resources or input.create))
        or (input.create and (not bind or input.resources)) then
        return nil, resources.error(errors.INVALID, "invalid_mail_draft", "Provide a message and either edited resources or one new resource")
    end
    if input.attachments ~= nil then
        local invalid = message.attachments_error(input.attachments)
        if invalid then return nil, invalid end
    end
    if (input.resources and count(input.resources) == 0) or (bind and not (input.resources or input.create)) then
        return nil, resources.error(errors.INVALID, "invalid_mail_resources", "Provide draft resources or a new resource to preview")
    end
    local edits: {types.ResourceContent} = input.resource and {input.resource} or input.resources or {}
    local candidates: {types.ResourceContent} = {}
    local keys: {types.ResourceKey} = {}
    local changed: {[string]: boolean} = {}
    for i, edit in ipairs(edits) do
        if edit.kind == "asset" then
            return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", edit)
        end
        local candidate, invalid = resources.normalize(edit)
        if invalid then return nil, invalid end
        local id = resources.key(candidate)
        if changed[id] then
            return nil, resources.error(errors.INVALID, "duplicate_mail_resource", "A resource can appear only once per draft", candidate)
        end
        changed[id], candidates[i], keys[i] = true, candidate, candidate
    end
    local values, globals_err = globals.read()
    if globals_err then return nil, globals_err end
    local rendered, render_err = database.transaction(function(tx: sql.Transaction, dialect: string): (types.Rendered | types.DraftPreview | nil, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, err, originals = resources.load(tx)
        if err then return nil, err end
        if input.create then
            if input.create.kind == "asset" then
                return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Assets are added from an upload", input.create)
            end
            local key_err = resources.check_key(input.create)
            if key_err then return nil, key_err end
            local candidate, create_err = prepare(tx, create_edit(input.create), "create",
                items :: types.ResourceMap, originals :: types.OriginalMap)
            if create_err then return nil, create_err end
            changed[resources.key(candidate)] = true
            candidates[1], keys[1] = candidate, candidate
        end
        for _, candidate in ipairs(candidates) do
            items[resources.key(candidate)] = candidate :: types.Resource
        end
        for _, candidate in ipairs(candidates) do
            local base_err = base_exists(items :: types.ResourceMap, candidate)
            if base_err then return nil, base_err end
        end
        local key = {kind = "message", name = input.message}
        local item = items[resources.key(key)]
        if not item then return nil, missing(key) end
        local vars = input.vars
        if vars == nil then vars = item.samples end
        if not bind then
            return draft.render(items :: types.ResourceMap, item, vars, candidates, values :: types.RenderGlobals, input.attachments)
        end
        local dependent = dependants(items :: types.ResourceMap, keys, changed)
        local result, draft_err = draft.preview(items :: types.ResourceMap, item, vars, candidates, dependent,
            values :: types.RenderGlobals, input.attachments)
        if draft_err then return nil, draft_err end
        if #result.errors == 0 then
            local actor, actor_err = security.actor()
            if actor_err then return nil, actor_err end
            if not actor then
                return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library")
            end
            local receipt, sign_err = preview_id.issue(candidates, actor:id(), input.create and "create" or "update", time.now():unix())
            if sign_err then return nil, sign_err end
            result.preview_id = receipt
        end
        return result, nil
    end)
    if render_err then return nil, render_err end
    local output = rendered :: types.DraftPreview
    if output.html then
        local inline, inline_err = attachments.preview(output :: types.Rendered, input.attachments)
        if inline_err then return nil, inline_err end
        output.inline_assets = inline
    end
    output.library_assets = nil
    return rendered, nil
end

function M.render_draft(input: types.DraftRequest): (types.Rendered?, error?)
    local result, err = preview(input, false)
    return result :: types.Rendered?, err
end

function M.preview_edits(input: types.EditPreview): (types.DraftPreview?, error?)
    local result, err = preview(input, true)
    return result :: types.DraftPreview?, err
end

return M
