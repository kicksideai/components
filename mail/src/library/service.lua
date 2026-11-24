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

local function prepare(tx: sql.Transaction, edit: types.LibraryEdit, operation: string,
    items: types.ResourceMap, originals: types.OriginalMap): (types.ResourceContent?, error?)
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
    local content = edit.content
    if edit.restore then
        local history, history_err = store.history(tx, key, edit.restore)
        if history_err then return nil, history_err end
        if not history[1] then
            return nil, resources.error(errors.NOT_FOUND, "mail_revision_not_found", "Mail library revision was not found", key)
        end
        content = history[1].content
    elseif edit.base ~= nil then
        local copy: types.Record = {}
        for field, value in pairs(current) do copy[field] = value end
        copy.base = edit.base
        content = copy :: types.ResourceContent
    end
    return resources.normalize(content :: types.ResourceContent)
end

local function change(edits: {types.LibraryEdit}, operation: string): ({types.Resource}?, error?)
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
        local candidates: {types.ResourceContent} = {}
        local previous: {types.Resource} = {}
        for i, edit in ipairs(edits) do
            local candidate, err = prepare(tx, edit, operation, items :: types.ResourceMap, originals :: types.OriginalMap)
            if err then return nil, err end
            local id = resources.key(edit.key)
            previous[i] = items[id]
            items[id] = candidate :: types.Resource
            candidates[i] = candidate
        end
        for _, candidate in ipairs(candidates) do
            local base_err = base_exists(items :: types.ResourceMap, candidate)
            if base_err then return nil, base_err end
        end
        local dependent = dependants(items :: types.ResourceMap, keys, changed)
        local key = keys[1]
        if operation == "delete" and key.kind == "base" and #dependent ~= 0 then
            return nil, resources.error(errors.CONFLICT, "mail_resource_in_use", "Messages use this base template", key)
        end
        local validation_err = draft.validate(items :: types.ResourceMap, key, candidates, dependent, values :: types.RenderGlobals)
        if validation_err then return nil, validation_err end
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
            local resetting = operation == "reset"
            local item, write_err = store.write(tx, stored, edits[i].note, resetting)
            if write_err then return nil, write_err end
            if resetting then
                local remove_err = store.remove(tx, keys[i], false)
                if remove_err then return nil, remove_err end
                item.state, item.author, item.created_at, item.updated_at = "original", nil, nil, nil
            end
            results[i] = item
        end
        return results, nil
    end)
    if error_before_commit then return nil, error_before_commit end
    local _, projection_err = projection.reconcile()
    if projection_err then
        local revisions = {}
        for i, item in ipairs(saved) do
            revisions[i] = {kind = item.kind, name = item.name, revision = item.revision}
        end
        return nil, errors.new({kind = projection_err:kind(), retryable = false, message = projection_err:message(),
            details = {code = "mail_projection_failed", resource = keys[1], revision = saved[1].revision, resources = revisions}})
    end
    return saved, nil
end

local function change_one(edit: types.LibraryEdit, operation: string): (types.Resource?, error?)
    local saved, err = change({edit}, operation)
    if err then return nil, err end
    return saved[1], nil
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

function M.get(input: types.ResourceKey): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    return resources.get(input)
end

function M.list(input: types.ResourceFilter?): ({types.Resource}?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    return resources.list(input or {})
end

function M.create(input: types.ResourceCreate): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceCreate
    return change_one({key = input, content = input, note = fields.note}, "create")
end

function M.update(input: types.ResourceEdit): (types.Resource?, error?)
    local fields = type(input) == "table" and input or {} :: types.ResourceEdit
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
        local note = item.note
        if note == nil then note = input.note end
        edits[i] = {key = item, content = item, expected = item.expected_revision, note = note}
    end
    return change(edits, "update")
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
    return renderer.render(input.template, input.vars)
end

function M.render_draft(input: types.DraftRequest): (types.Rendered?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(input) ~= "table" or type(input.message) ~= "string" or (input.resource and input.resources) then
        return nil, resources.error(errors.INVALID, "invalid_mail_draft", "Provide a message and draft resources")
    end
    local edits: {types.ResourceContent} = input.resource and {input.resource} or input.resources or {}
    if input.resources and count(input.resources) == 0 then
        return nil, resources.error(errors.INVALID, "invalid_mail_resources", "Provide an array of draft resources")
    end
    local candidates: types.ResourceMap = {}
    for _, edit in ipairs(edits) do
        local candidate, invalid = resources.normalize(edit)
        if invalid then return nil, invalid end
        local id = resources.key(candidate)
        if candidates[id] then
            return nil, resources.error(errors.INVALID, "duplicate_mail_resource", "A resource can appear only once per draft", candidate)
        end
        candidates[id] = candidate :: types.Resource
    end
    local values, globals_err = globals.read()
    if globals_err then return nil, globals_err end
    return database.transaction(function(tx: sql.Transaction, dialect: string): (types.Rendered?, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, err = resources.load(tx)
        if err then return nil, err end
        for id, candidate in pairs(candidates) do items[id] = candidate end
        for _, candidate in pairs(candidates) do
            local base_err = base_exists(items :: types.ResourceMap, candidate)
            if base_err then return nil, base_err end
        end
        local key = {kind = "message", name = input.message}
        local item = items[resources.key(key)]
        if not item then return nil, missing(key) end
        return draft.render(items :: types.ResourceMap, item, input.vars or item.samples, values :: types.RenderGlobals)
    end)
end

return M
