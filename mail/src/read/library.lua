-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local database = require("database")
local resource = require("resource")
local originals_reader = require("originals")
local library_reader = require("library_reader")
local reference_repo = require("reference_repo")
local references = require("references")
local settings = require("settings")
local policy = require("policy")
local time = require("time")
local messages = require("message_reader")
local keyset = require("keyset")
local asset_refs = require("asset_refs")
local content = require("content")
local contract = require("contract")
local component_types = require("component_types")
local component_envelope = require("component_envelope")
local error_envelope = require("error_envelope")
local config = require("config")

local live = require("live")
local live_repo = require("live_repo")

local M = {}
local RECENT_SENDER_LIMIT = 100

local function original_referrers(originals: types.OriginalMap): {[string]: {types.ResourceKey}}
    local incoming: {[string]: {types.ResourceKey}} = {}
    for _, original in pairs(originals) do
        local item = original.resource
        if item.kind ~= "asset" then
            for _, target in ipairs(references.keys(item)) do
                local id = resource.subject(target)
                local keys = incoming[id] or {}
                keys[#keys + 1] = {kind = item.kind, name = item.name}
                incoming[id] = keys
            end
        end
    end
    return incoming
end

local function referrers(ex: types.Executor, key: types.ResourceKey,
    packaged: {[string]: {types.ResourceKey}}): ({types.ResourceKey}?, error?)
    local queue: {types.ResourceKey} = {key}
    local seen: {[string]: boolean} = {[resource.subject(key)] = true}
    local function add(source: types.ResourceKey)
        local id = resource.subject(source)
        if seen[id] then return end
        seen[id] = true
        queue[#queue + 1] = source
    end
    for _, target in ipairs(queue) do
        local stored, err = reference_repo.referrers(ex, target)
        if err then return nil, err end
        for _, source in ipairs(stored) do add(source) end
        for _, source in ipairs(packaged[resource.subject(target)] or {}) do
            if not seen[resource.subject(source)] then
                local current, read_err = library_reader.get(ex, source)
                if read_err then return nil, read_err end
                if not current or current.state == "original" then add(source) end
            end
        end
    end
    local result: {types.ResourceKey} = {}
    for i = 2, #queue do result[#result + 1] = queue[i] end
    table.sort(result, function(a, b) return resource.subject(a) < resource.subject(b) end)
    return result, nil
end

function M.referrers(ex: types.Executor, key: types.ResourceKey, originals: types.OriginalMap): ({types.ResourceKey}?, error?)
    return referrers(ex, key, original_referrers(originals))
end

function M.message_names(keys: {types.ResourceKey}): {string}
    local names: {string} = {}
    for _, key in ipairs(keys) do
        if key.kind == "message" then names[#names + 1] = key.name end
    end
    return names
end

local function summary(db: types.Executor, dialect: string, declarations: {types.LibraryDeclaration},
    originals: types.OriginalMap, filter: types.ResourceFilter, after: types.ResourceKey?, limit: integer): (types.LibraryPage?, error?)
    local page, err = library_reader.summary_page(db, dialect, declarations, filter, after, limit)
    if err then return nil, err end
    local packaged = original_referrers(originals)
    for _, item in ipairs(page.items) do
        if item.kind == "asset" or item.kind == "base" then
            local sources, read_err = referrers(db, item :: types.ResourceKey, packaged)
            if read_err then return nil, read_err end
            item.used_by = {messages = #M.message_names(sources :: {types.ResourceKey})}
        end
    end
    return page, nil
end

local function match_origin(item: types.Resource, declared: types.Original?): error?
    local err = resource.match_origin(item, declared)
    if err then return err end
    item.origin_label = declared and declared.resource.origin_label or nil
    return nil
end

local function merge(db: types.Executor, originals: types.OriginalMap, rows: {types.Resource}): (types.ResourceMap?, error?)
    local revisions, err = library_reader.original_revisions(db)
    if err then return nil, err end
    for _, declared in pairs(originals) do
        local item = declared.resource
        local by_name = revisions[item.kind]
        item.revision = by_name and by_name[item.name] or 0
    end
    return resource.merge(rows, originals)
end

function M.load(db: types.Executor): (types.ResourceMap?, error?, types.OriginalMap?)
    local originals, err = originals_reader.list()
    if err then return nil, err end
    local rows, read_err = library_reader.rows(db, {})
    if read_err then return nil, read_err end
    local items, merge_err = merge(db, originals :: types.OriginalMap, rows :: {types.Resource})
    return items, merge_err, originals
end

local function lookup_in(ex: types.Executor, key: types.ResourceKey, declared: types.Original?): (types.Resource?, error?)
    local item, read_err = library_reader.get(ex, key)
    if read_err then return nil, read_err end
    if item and item.state ~= "original" then return item, match_origin(item, declared) end
    if not declared then
        return nil, resource.error(errors.NOT_FOUND, "mail_resource_not_found", "Mail library resource was not found", key)
    end
    if item then
        declared.resource.revision, declared.resource.seq = item.revision, item.seq
    elseif key.kind ~= "asset" then
        local position, err = library_reader.subject_position(ex, key)
        if err then return nil, err end
        declared.resource.revision, declared.resource.seq = position.revision, position.seq
    end
    return declared.resource, nil
end

function M.lookup(key: types.ResourceKey): (types.Resource?, error?, types.Original?)
    local bad_key = resource.check_key(key)
    if bad_key then return nil, bad_key end
    local originals, err = originals_reader.list()
    if err then return nil, err end
    local declared = originals[resource.subject(key)]
    local item, read_err = database.with_db(function(ex: types.Executor): (types.Resource?, error?)
        return lookup_in(ex, key, declared)
    end)
    return item, read_err, declared
end

local function summary_page(filter: types.ResourceFilter, after: types.ResourceKey?, limit: integer): (types.LibraryPage?, error?)
    local originals, err = originals_reader.list()
    if err then return nil, err end
    local declarations: {types.LibraryDeclaration} = {}
    for _, declared in pairs(originals) do
        local item = declared.resource
        local selected = (not filter.kind or item.kind == filter.kind) and (not filter.base or item.base == filter.base)
            and resource.matches(item, filter.q and filter.q:lower())
        declarations[#declarations + 1] = {kind = item.kind, name = item.name, base = item.base, selected = selected and 1 or 0}
    end
    return database.with_db(function(db: types.DB, dialect: string): (types.LibraryPage?, error?)
        local mark, mark_err = live_repo.get(db)
        if mark_err then return nil, mark_err end
        local page, read_err = summary(db, dialect, declarations, originals :: types.OriginalMap, filter, after, limit)
        if read_err then return nil, read_err end
        for _, row in ipairs(page.items) do
            local original = originals[resource.subject(row)]
            if row.state == "original" then
                local item = original.resource
                row.title, row.description, row.origin = item.title, item.description, item.origin
                row.origin_label, row.asset = item.origin_label, item.asset
            else
                local origin_err = match_origin((row :: unknown) :: types.Resource, original)
                if origin_err then return nil, origin_err end
            end
        end
        page.library_seq = mark.projected_seq
        return page, nil
    end)
end

function M.resources(filter: types.ResourceFilter): ({types.Resource}?, error?)
    local q = filter.q and filter.q:lower()
    return database.with_db(function(db: types.DB): ({types.Resource}?, error?)
        local originals, err = originals_reader.list()
        if err then return nil, err end
        local stored_only = filter.state == "created" or filter.state == "customized"
        local rows, read_err = library_reader.rows(db, stored_only and filter or {kind = filter.kind})
        if read_err then return nil, read_err end
        if stored_only then
            local selected: {types.Resource} = {}
            for _, row in ipairs(rows) do
                local origin_err = match_origin(row, originals[resource.subject(row)])
                if origin_err then return nil, origin_err end
                if resource.matches(row, q) then selected[#selected + 1] = row end
            end
            return selected, nil
        end
        local items, merge_err = merge(db, originals :: types.OriginalMap, rows :: {types.Resource})
        if merge_err then return nil, merge_err end
        local selected = {}
        for _, item in pairs(items) do
            if (not filter.kind or item.kind == filter.kind) and (not filter.state or item.state == filter.state)
                and (not filter.base or item.base == filter.base) and resource.matches(item, q) then
                selected[#selected + 1] = item
            end
        end
        table.sort(selected, function(a, b) return resource.subject(a) < resource.subject(b) end)
        return selected, nil
    end)
end

local function require_access(mask: integer, mode: string): error?
    local denied = client.require_library()
    if denied then return denied end
    local definition, definition_err = contract.get("kickside.component:component_service")
    if definition_err then return definition_err end
    local service, open_err = definition:open()
    if open_err then return open_err end
    local result, call_err = (service :: types.ComponentAccessContract):get_access_context({
        component_id = content.library_component_id(), access_mask = mask, include_context = false,
    })
    if call_err then return component_envelope.call_error(call_err, "get_access_context") end
    local err = component_envelope.error_of(result, "get_access_context")
    if err and err:kind() == errors.PERMISSION_DENIED then
        return error_envelope.wrap(err, "Mail library component " .. mode:upper() .. " access is required",
            {code = "mail_library_" .. mode .. "_denied"})
    end
    return err
end

function M.require_read(): error?
    return require_access(component_types.ACCESS.READ, "read")
end

function M.require_write(): error?
    return require_access(component_types.ACCESS.WRITE, "write")
end

local function fence(ex: types.Executor, snapshot_seq: integer?): error?
    local mark, err = live_repo.get(ex)
    if err then return err end
    return live.fence(mark.template_seq :: integer, snapshot_seq)
end

function M.require_live(): error?
    local _, err = database.with_db(function(ex: types.Executor): (boolean?, error?)
        return true, fence(ex)
    end)
    return err
end

function M.live_message(name: unknown): (types.Resource?, error?)
    if type(name) ~= "string" or not name:find("%S") then
        return nil, resource.error(errors.INVALID, "invalid_template", "A mail template name is required")
    end
    local key = {kind = "message", name = name}
    local invalid = resource.check_key(key)
    if invalid then return nil, invalid end
    local originals, err = originals_reader.list()
    if err then return nil, err end
    return database.with_db(function(ex: types.Executor): (types.Resource?, error?)
        local before, mark_err = live_repo.get(ex)
        if mark_err then return nil, mark_err end
        local item, lookup_err = lookup_in(ex, key, originals[resource.subject(key)])
        if lookup_err then
            if errors.is(lookup_err, errors.NOT_FOUND) then
                return nil, resource.error(errors.NOT_FOUND, "template_not_found", "Mail template is not declared: " .. name)
            end
            return nil, lookup_err
        end
        if item.archived then
            return nil, resource.error(errors.NOT_FOUND, "mail_template_archived", "This mail template is archived", item)
        end
        local fenced = fence(ex, before.template_seq :: integer)
        if fenced then return nil, fenced end
        return item, nil
    end)
end

local function recent_since(): (integer?, error?)
    local values, err = settings.mail()
    if err then return nil, err end
    local days = policy.retention_days(values.log_retention_days)
    if not days then return nil, config.setup_error("Mail delivery log retention days are invalid") end
    local now = time.now():unix_nano() // 1000000
    return now - days * policy.DAY_MS, nil
end

local function used_by(item: types.Resource): (types.UsedBy?, error?)
    if item.kind == "asset" or item.kind == "base" then
        local declarations, err = originals_reader.list()
        if err then return nil, err end
        return database.with_db(function(db: types.DB): (types.UsedBy?, error?)
            local keys, read_err = M.referrers(db, item, declarations :: types.OriginalMap)
            if read_err then return nil, read_err end
            return {messages = M.message_names(keys :: {types.ResourceKey})}, nil
        end)
    elseif item.kind == "message" then
        local since, since_err = recent_since()
        if since_err then return nil, since_err end
        return database.with_db(function(ex: types.Executor): (types.UsedBy?, error?)
            local page, read_err = messages.recent_senders(ex, item.name, since :: integer, RECENT_SENDER_LIMIT)
            if read_err then return nil, read_err end
            return {recent_senders = page.items}, nil
        end)
    end
    return nil, nil
end

function M.get(input: types.ResourceKey): (types.Resource?, error?)
    local denied = M.require_read()
    if denied then return nil, denied end
    local found, err, declared = M.lookup(input)
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

function M.asset_content(input: types.LibraryAssetRequest): (types.AssetContent?, error?)
    local denied = M.require_read()
    if denied then return nil, denied end
    if type(input) ~= "table" then
        return nil, resource.error(errors.INVALID, "invalid_mail_asset", "Provide an asset name")
    end
    local key = {kind = "asset", name = input.name}
    local found, err, declared = M.lookup(key)
    if err then return nil, err end
    local item = found :: types.Resource
    local revision = input.revision
    if revision == 0 and declared then
        item = declared.resource
    elseif revision ~= nil and revision ~= item.revision then
        local previous, revision_err = M.revision({kind = key.kind, name = key.name, revision = revision})
        if revision_err then return nil, revision_err end
        local saved = previous :: types.Revision
        item = (saved.content :: unknown) :: types.Resource
        item.origin = declared and declared.resource.origin or nil
    end
    local ref = asset_refs.reference(item, asset_refs.cid(item.name))
    local file, read_err = content.asset_file(ref, true)
    if read_err then return nil, read_err end
    local part = file :: types.AssetPart
    return {revision = revision or item.revision, content_type = part.content_type, bytes = part.content :: string}, nil
end

function M.page(input: types.LibraryPageRequest): (types.LibraryPage?, error?)
    local denied = M.require_read()
    if denied then return nil, denied end
    local invalid = resource.check_filter(input)
    if invalid then return nil, invalid end
    local limit, cursor, page_err = keyset.args(input)
    if page_err then return nil, page_err end
    local after: types.ResourceKey?
    if cursor then
        local kind, name = cursor:match("^([a-z]+)/([a-z0-9][a-z0-9_%-]*)$")
        if not kind or not name then
            return nil, resource.error(errors.INVALID, "invalid_mail_filter", "Use the next cursor from a library page")
        end
        after = {kind = kind, name = name}
        if resource.check_key(after) then
            return nil, resource.error(errors.INVALID, "invalid_mail_filter", "Use the next cursor from a library page")
        end
    end
    local page, err = summary_page(input, after, limit :: integer)
    if err then return nil, err end
    local names: {string} = {}
    for _, row in ipairs(page.items) do
        if row.kind == "message" then names[#names + 1] = row.name end
    end
    if #names > 0 then
        local since, since_err = recent_since()
        if since_err then return nil, since_err end
        local counts, counts_err = database.with_db(function(ex: types.Executor): ({[string]: integer}?, error?)
            return messages.recent_sender_counts(ex, names, since :: integer)
        end)
        if counts_err then return nil, counts_err end
        for _, row in ipairs(page.items) do
            if row.kind == "message" then row.used_by = {recent_sources = counts[row.name] or 0} end
        end
    end
    return page, nil
end

local function history(input: types.ResourceKey, revision: integer?, before: integer?, limit: integer?): ({types.Revision}?, error?)
    local denied = M.require_read()
    if denied then return nil, denied end
    local bad_key = resource.check_key(input)
    if bad_key then return nil, bad_key end
    local _, err = M.lookup(input)
    if err then return nil, err end
    return database.with_db(function(db: types.DB): ({types.Revision}?, error?)
        return library_reader.history(db, input, revision, before, limit)
    end)
end

function M.history_page(input: types.LibraryHistoryRequest): (types.LibraryHistoryPage?, error?)
    local limit, cursor, page_err = keyset.args(input)
    if page_err then return nil, page_err end
    local before = cursor and math.tointeger(tonumber(cursor)) or nil
    if cursor and (not before or before < 1) then
        return nil, resource.error(errors.INVALID, "invalid_mail_filter", "Use the next cursor from a library history page")
    end
    local size = limit :: integer
    local rows, err = history(input, nil, before, size + 1)
    if err then return nil, err end
    local items = rows :: {types.Revision}
    local next_cursor: string?
    if #items > size then
        items[size + 1] = nil
        next_cursor = tostring(items[size].revision)
    end
    return {items = items, next_cursor = next_cursor}, nil
end

function M.revision(input: types.LibraryRevisionRequest): (types.Revision?, error?)
    local bad_key = resource.check_key(input)
    if bad_key then return nil, bad_key end
    local revision = input.revision
    if type(revision) ~= "number" or not math.tointeger(revision) or revision < 1 then
        return nil, resource.error(errors.INVALID, "invalid_mail_revision", "Provide a positive revision", input)
    end
    local rows, err = history(input, revision)
    if err then return nil, err end
    if not rows[1] then
        return nil, resource.error(errors.NOT_FOUND, "mail_revision_not_found", "Mail library revision was not found", input)
    end
    return rows[1] :: types.Revision, nil
end

return M
