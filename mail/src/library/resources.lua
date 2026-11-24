-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local canonical = require("canonical_json")
local database = require("database")
local store = require("store")
local jet = require("jet")

local M = {}

local MAX_NAME_BYTES = 128
local MAX_DISPLAY_BYTES = 4096
local MAX_FACE_BYTES = 64 * 1024
local MAX_SCHEMA_BYTES = 32 * 1024
local MAX_NOTE_BYTES = 4096
M.MAX_VARIABLE_BYTES = 64 * 1024
M.MAX_EDITS = 12

function M.error(kind: string, code: string, message: string, key: types.ResourceKey?): error
    return errors.new({kind = kind, retryable = false, message = message,
        details = {code = code, resource = key and {kind = key.kind, name = key.name} or nil}})
end

function M.key(key: types.ResourceKey): string
    return key.kind .. "/" .. key.name
end

local function valid_name(name: unknown): boolean
    return type(name) == "string" and name:match("^[a-z0-9][a-z0-9_-]*$") ~= nil
end

function M.check_key(key: types.ResourceKey): error?
    if type(key) ~= "table" or (key.kind ~= "base" and key.kind ~= "message" and key.kind ~= "part" and key.kind ~= "asset") or not valid_name(key.name) then
        return M.error(errors.INVALID, "invalid_mail_resource", "A library resource requires a kind and a stable name")
    end
    return nil
end

function M.check_input_key(key: types.ResourceKey): error?
    local invalid = M.check_key(key)
    if invalid then return invalid end
    if #key.name > MAX_NAME_BYTES then
        return M.error(errors.INVALID, "invalid_mail_resource", "Resource names may use at most 128 bytes")
    end
    return nil
end

function M.check_filter(filter: types.ResourceFilter): error?
    if type(filter) ~= "table" or (filter.q ~= nil and (type(filter.q) ~= "string"
        or #filter.q > MAX_DISPLAY_BYTES or filter.q:find("%z") or not utf8.len(filter.q)))
        or (filter.kind ~= nil and filter.kind ~= "base" and filter.kind ~= "message" and filter.kind ~= "part" and filter.kind ~= "asset")
        or (filter.state ~= nil and filter.state ~= "original" and filter.state ~= "customized" and filter.state ~= "created")
        or (filter.base ~= nil and not valid_name(filter.base)) then
        return M.error(errors.INVALID, "invalid_mail_filter", "Provide a valid resource kind, state, base and search query")
    end
    return nil
end

function M.check_json(value: unknown, maximum: integer, code: string, message: string): error?
    local encoded, err = canonical.encode(value)
    if err or #encoded > maximum then return M.error(errors.INVALID, code, message) end
    return nil
end

function M.check_note(note: unknown): error?
    if note ~= nil and (type(note) ~= "string" or #note > MAX_NOTE_BYTES or not utf8.len(note)) then
        return M.error(errors.INVALID, "invalid_revision_note", "A revision note must be UTF-8 text of at most 4096 bytes")
    end
    return nil
end

function M.check_content(input: types.ResourceContent): error?
    for name, maximum in pairs({title = MAX_DISPLAY_BYTES, description = MAX_DISPLAY_BYTES,
        base = MAX_NAME_BYTES, subject = MAX_FACE_BYTES, html = MAX_FACE_BYTES, text = MAX_FACE_BYTES}) do
        local value = ((input :: unknown) :: types.Record)[name]
        if value ~= nil and (type(value) ~= "string" or #value > maximum or not utf8.len(value)) then
            return M.error(errors.INVALID, "invalid_mail_resource",
                "The resource " .. name .. " must be UTF-8 text of at most " .. maximum .. " bytes", input)
        end
    end
    if input.schema ~= nil then
        local err = M.check_json(input.schema, MAX_SCHEMA_BYTES, "invalid_mail_resource",
            "The variable schema must be valid JSON of at most 32768 bytes")
        if err then return err end
    end
    if input.samples ~= nil then
        return M.check_json(input.samples, M.MAX_VARIABLE_BYTES, "invalid_mail_resource",
            "Sample variables must be valid JSON of at most 65536 bytes")
    end
    return nil
end

function M.normalize(key: types.ResourceContent): (types.ResourceContent?, error?)
    local invalid = M.check_key(key)
    if invalid then return nil, invalid end
    if key.kind == "asset" then
        if type(key.title) ~= "string" or not key.title:find("%S") or type(key.description) ~= "string" or not key.asset then
            return nil, M.error(errors.INVALID, "invalid_mail_asset", "A library asset needs an image source", key)
        end
        return {kind = key.kind, name = key.name, title = key.title, description = key.description,
            html = "", text = "", schema = {type = "object", properties = {}}, samples = {}, asset = key.asset}, nil
    end
    if type(key.title) ~= "string" or not key.title:find("%S") or type(key.description) ~= "string"
        or type(key.html) ~= "string" or key.html == "" or type(key.text) ~= "string" or key.text == "" then
        return nil, M.error(errors.INVALID, "invalid_mail_resource", "A library resource requires its title, description, and both faces", key)
    end
    local base = key.base
    if key.kind == "message" then
        base = base or "standard"
        if type(key.subject) ~= "string" or not key.subject:find("%S") or not valid_name(base) then
            return nil, M.error(errors.INVALID, "invalid_mail_resource", "A message requires a subject and base template", key)
        end
    elseif key.subject ~= nil or key.base ~= nil then
        return nil, M.error(errors.INVALID, "invalid_mail_resource", "Only messages have a subject and base template", key)
    end
    local schema, samples = key.schema, key.samples
    if type(schema) ~= "table" or schema.type ~= "object" or type(schema.properties) ~= "table" or type(samples) ~= "table" then
        return nil, M.error(errors.INVALID, "invalid_mail_resource", "A library resource requires an object schema and samples", key)
    end
    schema = canonical.normalize_schema(schema) :: types.VariableSchema
    schema.additionalProperties = false
    return {
        kind = key.kind, name = key.name, title = key.title, description = key.description,
        html = key.html, text = key.text, base = base, subject = key.subject,
        schema = schema, samples = canonical.object(samples) :: types.JsonObject,
    }, nil
end

local function original(id: string, data: types.Record): (types.Original?, error?)
    local declaration = data.template :: types.ResourceContent
    if type(declaration) ~= "table" then
        return nil, M.error(errors.INVALID, "invalid_template_declaration", "Missing mail resource declaration " .. id)
    end
    local fields = data.template :: types.Record
    local entry_ids = fields.entries :: {[string]: string}
    if declaration.kind == "asset" then
        entry_ids = {}
        declaration.html, declaration.text = "", ""
    elseif type(entry_ids) ~= "table" or type(entry_ids.html) ~= "string" or type(entry_ids.text) ~= "string"
        or (declaration.kind == "message" and type(entry_ids.subject) ~= "string") then
        return nil, M.error(errors.INVALID, "invalid_template_declaration", "Missing Jet registry IDs for " .. id)
    end
    declaration.schema = (fields.variable_schema or fields.input_schema or {type = "object", properties = {}}) :: types.VariableSchema
    declaration.samples = (fields.sample or {}) :: types.JsonObject
    local item, err = M.normalize(declaration)
    if err then return nil, err end
    if item.base then
        local prefix = jet.prefix(item.base)
        if item.html:sub(1, #prefix) ~= prefix or item.text:sub(1, #prefix) ~= prefix then
            return nil, M.error(errors.INVALID, "invalid_template_declaration", "The shipped Jet faces must use the declared base for " .. id, item)
        end
        item.html = item.html:sub(#prefix + 1)
        item.text = item.text:sub(#prefix + 1)
    end
    local resource = item :: types.Resource
    resource.state, resource.revision, resource.origin = "original", 0, id
    return {resource = resource, entries = entry_ids}, nil
end

local function module_title(id: string, titles: {[string]: string}): string
    local namespace = id:match("^([^:]+):")
    while namespace do
        if titles[namespace] then return titles[namespace] end
        namespace = namespace:match("^(.*)%.[^.]+$")
    end
    return "Installed module"
end

function M.originals(): (types.OriginalMap?, error?)
    local entries, err = registry.find({[".kind"] = "registry.entry", ["meta.type"] = "kickside.mail:template"})
    if err then return nil, err end
    local definitions, definitions_err = registry.find({[".kind"] = "ns.definition"})
    if definitions_err then return nil, definitions_err end
    local titles: {[string]: string} = {}
    for _, definition in ipairs(definitions) do
        local namespace = definition.id:match("^([^:]+):")
        local title = definition.meta.title
        if namespace and type(title) == "string" and title:find("%S") then
            titles[namespace] = title
        end
    end
    local items: types.OriginalMap = {}
    for _, entry in ipairs(entries) do
        local declared, declaration_err = original(entry.id, entry.data :: types.Record)
        if declaration_err then return nil, declaration_err end
        declared.resource.origin_label = module_title(entry.id, titles)
        local key = M.key(declared.resource)
        if items[key] then
            return nil, M.error(errors.CONFLICT, "duplicate_template_name", "Multiple modules declare " .. key, declared.resource)
        end
        items[key] = declared
    end
    return items, nil
end

function M.match_origin(item: types.Resource, declared: types.Original?): error?
    if item.state == "created" and declared then
        return M.error(errors.CONFLICT, "mail_resource_collision", "An installed module declares the same resource name", item)
    end
    if item.state == "customized" and (not declared or declared.resource.origin ~= item.origin) then
        return M.error(errors.CONFLICT, "mail_original_changed", "The shipped resource declaration has changed identity", item)
    end
    item.origin_label = declared and declared.resource.origin_label or nil
    return nil
end

local function merge(db: types.Executor, originals: types.OriginalMap, rows: {types.Resource}): (types.ResourceMap?, error?)
    local effective: types.ResourceMap = {}
    local revisions, read_err = store.original_revisions(db)
    if read_err then return nil, read_err end
    for key, declared in pairs(originals) do
        local item = declared.resource
        local by_name = revisions[item.kind]
        item.revision = by_name and by_name[item.name] or 0
        effective[key] = item
    end
    for _, row in ipairs(rows) do
        local key = M.key(row)
        local err = M.match_origin(row, originals[key])
        if err then return nil, err end
        effective[key] = row
    end
    return effective, nil
end

function M.load(db: types.Executor): (types.ResourceMap?, error?, types.OriginalMap?)
    local originals, err = M.originals()
    if err then return nil, err end
    local rows, read_err = store.find(db, {})
    if read_err then return nil, read_err end
    local items, merge_err = merge(db, originals :: types.OriginalMap, rows :: {types.Resource})
    return items, merge_err, originals
end

function M.get(key: types.ResourceKey): (types.Resource?, error?, types.Original?)
    local bad_key = M.check_key(key)
    if bad_key then return nil, bad_key end
    local originals, err = M.originals()
    if err then return nil, err end
    local item, read_err = store.read(key)
    if read_err then return nil, read_err end
    local declared = originals[M.key(key)]
    if item and item.state == "original" then
        if declared then declared.resource.revision = item.revision end
    elseif item then
        return item, M.match_origin(item, declared), declared
    end
    if declared then return declared.resource, nil, declared end
    return nil, M.error(errors.NOT_FOUND, "mail_resource_not_found", "Mail library resource was not found", key)
end

local function contains(value: string?, q: string): boolean
    return value ~= nil and value:lower():find(q, 1, true) ~= nil
end

local function matches(item: types.Resource, q: string?): boolean
    return not q or q == "" or contains(item.name, q) or contains(item.title, q)
        or contains(item.description, q) or contains(item.subject, q)
        or contains(item.html, q) or contains(item.text, q)
end

function M.page(filter: types.ResourceFilter, after: types.ResourceKey?, limit: integer): (types.LibraryPage?, error?)
    local originals, err = M.originals()
    if err then return nil, err end
    local declarations: {types.LibraryDeclaration} = {}
    for _, declared in pairs(originals) do
        local item = declared.resource
        local selected = (not filter.kind or item.kind == filter.kind) and (not filter.base or item.base == filter.base)
            and matches(item, filter.q and filter.q:lower())
        declarations[#declarations + 1] = {kind = item.kind, name = item.name, base = item.base, selected = selected and 1 or 0}
    end
    return database.read(function(db: sql.DB): (types.LibraryPage?, error?)
        local page, read_err = store.summary(db, declarations, filter, after, limit)
        if read_err then return nil, read_err end
        for _, row in ipairs(page.items) do
            local original = originals[M.key(row)]
            if row.state == "original" then
                local item = original.resource
                row.title, row.description, row.origin = item.title, item.description, item.origin
                row.origin_label = item.origin_label
            else
                local origin_err = M.match_origin((row :: unknown) :: types.Resource, original)
                if origin_err then return nil, origin_err end
            end
        end
        return page, nil
    end)
end

function M.list(filter: types.ResourceFilter): ({types.Resource}?, error?)
    local q = filter.q and filter.q:lower()
    return database.read(function(db: sql.DB): ({types.Resource}?, error?)
        local originals, err = M.originals()
        if err then return nil, err end
        local stored_only = filter.state == "created" or filter.state == "customized"
        local rows, read_err = store.find(db, stored_only and filter or {kind = filter.kind})
        if read_err then return nil, read_err end
        if stored_only then
            local selected: {types.Resource} = {}
            for _, row in ipairs(rows) do
                local origin_err = M.match_origin(row, originals[M.key(row)])
                if origin_err then return nil, origin_err end
                if matches(row, q) then selected[#selected + 1] = row end
            end
            return selected, nil
        end
        local items, merge_err = merge(db, originals :: types.OriginalMap, rows :: {types.Resource})
        if merge_err then return nil, merge_err end
        local selected = {}
        for _, item in pairs(items) do
            if (not filter.kind or item.kind == filter.kind) and (not filter.state or item.state == filter.state)
                and (not filter.base or item.base == filter.base) and matches(item, q) then
                selected[#selected + 1] = item
            end
        end
        table.sort(selected, function(a, b) return M.key(a) < M.key(b) end)
        return selected, nil
    end)
end

function M.names(items: {types.Resource}): {string}
    local names = {}
    for i, item in ipairs(items) do names[i] = item.name end
    return names
end

function M.visible_messages(names: {string}, items: types.ResourceMap): {string}
    local visible = {}
    for _, name in ipairs(names) do
        if items["message/" .. name] then visible[#visible + 1] = name end
    end
    return visible
end

return M
