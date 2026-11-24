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

local function dependants(tx: sql.Transaction, key: types.ResourceKey, items: types.ResourceMap): ({types.Resource}?, error?)
    local selected: {types.Resource} = {}
    if key.kind == "base" then
        local rows, err = store.find(tx, {base = key.name})
        if err then return nil, err end
        selected = rows
    end
    for _, item in pairs(items) do
        if item.kind == "message" and (key.kind == "part"
            or (key.kind == "base" and item.state == "original" and item.base == key.name)) then
            selected[#selected + 1] = item
        end
    end
    table.sort(selected, function(a, b) return a.name < b.name end)
    return selected, nil
end

local function change(key: types.ResourceKey, operation: string, edit: types.ResourceContent?, revision: integer?,
    base: string?): (types.Resource?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local bad_key = resources.check_key(key)
    if bad_key then return nil, bad_key end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    if not actor then return nil, resources.error(errors.PERMISSION_DENIED, "mail_library_denied", "A principal must edit the mail library") end
    local author = actor:id()
    local values, globals_err = globals.read()
    if globals_err then return nil, globals_err end

    local item, error_before_commit = database.transaction(function(tx: sql.Transaction, dialect: string): (types.Resource?, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, load_err, originals = resources.load(tx)
        if load_err then return nil, load_err end
        local id = resources.key(key)
        local current, original = items[id], originals[id]
        if operation == "create" then
            if current then return nil, conflict(key, current.revision) end
        else
            if not current then return nil, missing(key) end
            if revision ~= current.revision then return nil, conflict(key, current.revision) end
        end

        local candidate: types.ResourceContent?
        if operation == "reset" then
            if current.state ~= "customized" then
                return nil, resources.error(errors.INVALID, "mail_resource_not_customized", "Only customized resources can be reset", key)
            end
            candidate = original.resource
        elseif operation == "delete" then
            if current.state ~= "created" then
                return nil, resources.error(errors.INVALID, "mail_resource_is_shipped", "A shipped resource can only be reset", key)
            end
        else
            if base then
                local copy: types.Record = {}
                for field, value in pairs(current) do copy[field] = value end
                copy.base = base
                edit = copy :: types.ResourceContent
            end
            local invalid
            candidate, invalid = resources.normalize(edit :: types.ResourceContent)
            if invalid then return nil, invalid end
        end

        if original then
            local projection_err = projection.check_shadow(original)
            if projection_err then return nil, projection_err end
        end
        if candidate then
            local base_err = base_exists(items :: types.ResourceMap, candidate)
            if base_err then return nil, base_err end
        end
        local dependent, dependent_err = dependants(tx, key, items)
        if dependent_err then return nil, dependent_err end
        if not candidate and key.kind == "base" and #dependent ~= 0 then
            return nil, resources.error(errors.CONFLICT, "mail_resource_in_use", "Messages use this base template", key)
        end
        items[id] = candidate :: types.Resource
        local validation_err = draft.validate(items, key, candidate, dependent, values :: types.RenderGlobals)
        if validation_err then return nil, validation_err end
        if operation == "reset" or operation == "delete" then
            local remove_err = store.remove(tx, key)
            if remove_err then return nil, remove_err end
            return (candidate or current) :: types.Resource, nil
        end

        local timestamp = time.now():unix_nano() // 1000000
        local stored = candidate :: types.Resource
        stored.author, stored.updated_at = author, timestamp
        stored.created_at = current and current.created_at or timestamp
        stored.state = original and "customized" or "created"
        stored.origin = original and original.resource.origin or nil
        return store.write(tx, stored)
    end)
    if error_before_commit then return nil, error_before_commit end
    local _, projection_err = projection.reconcile()
    if projection_err then
        return nil, errors.new({kind = projection_err:kind(), retryable = false, message = projection_err:message(),
            details = {code = "mail_projection_failed", resource = {kind = key.kind, name = key.name}, revision = item.revision}})
    end
    return item, nil
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

function M.create(input: types.ResourceContent): (types.Resource?, error?)
    return change(input, "create", input)
end

function M.update(input: types.ResourceEdit): (types.Resource?, error?)
    return change(input, "update", input :: types.ResourceContent, type(input) == "table" and input.expected_revision or nil)
end

function M.set_base(input: types.ResourceBaseEdit): (types.Resource?, error?)
    return change({kind = "message", name = input.name}, "update", nil, input.expected_revision, input.base)
end

function M.reset(input: types.ResourceRevision): (types.Resource?, error?)
    return change(input, "reset", nil, type(input) == "table" and input.expected_revision or nil)
end

function M.delete(input: types.ResourceRevision): (boolean?, error?)
    local _, err = change(input, "delete", nil, type(input) == "table" and input.expected_revision or nil)
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
    local candidate, invalid = resources.normalize(input.resource)
    if invalid then return nil, invalid end
    local values, globals_err = globals.read()
    if globals_err then return nil, globals_err end
    return database.transaction(function(tx: sql.Transaction, dialect: string): (types.Rendered?, error?)
        local lock_err = store.lock(tx, dialect)
        if lock_err then return nil, lock_err end
        local items, err = resources.load(tx)
        if err then return nil, err end
        local base_err = base_exists(items :: types.ResourceMap, candidate)
        if base_err then return nil, base_err end
        items[resources.key(candidate)] = candidate :: types.Resource
        local key = {kind = "message", name = input.message}
        local item = items[resources.key(key)]
        if not item then return nil, missing(key) end
        return draft.render(items :: types.ResourceMap, item, input.vars or item.samples, values :: types.RenderGlobals)
    end)
end

return M
