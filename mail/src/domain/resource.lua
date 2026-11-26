-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local canonical = require("canonical_json")
local types = require("types")

local M = {}

local MAX_NAME_BYTES = 128
local MAX_DISPLAY_BYTES = 4096
local MAX_SUBJECT_BYTES = 64 * 1024
local MAX_SCHEMA_BYTES = 32 * 1024
-- A names lookup resolves at most one library page of references.
local MAX_LOOKUP_NAMES = 100
M.MAX_VARIABLE_BYTES = 64 * 1024
M.MAX_EDITS = 12
-- A note adds at most 3,000 escaped bytes to a Threads event row.
M.MAX_NOTE_LENGTH = 500
-- Bound JSON-escaped snapshots to the Threads event row limit.
M.MAX_CONTENT_BYTES = 512 * 1024

function M.error(kind: string, code: string, message: string, key: types.ResourceKey?): error
    return errors.new({kind = kind, retryable = false, message = message,
        details = {code = code, resource = key and {kind = key.kind, name = key.name} or nil}})
end

function M.subject(key: types.ResourceKey): string
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

local function valid_names(names: unknown): boolean
    if names == nil then return true end
    if type(names) ~= "table" or #names == 0 or #names > MAX_LOOKUP_NAMES then return false end
    for _, name in ipairs(names :: {unknown}) do
        if not valid_name(name) then return false end
    end
    return true
end

function M.check_filter(filter: types.ResourceFilter): error?
    if type(filter) ~= "table" or not valid_names(filter.names) or (filter.q ~= nil and (type(filter.q) ~= "string"
        or #filter.q > MAX_DISPLAY_BYTES or filter.q:find("%z") or not utf8.len(filter.q)))
        or (filter.kind ~= nil and filter.kind ~= "base" and filter.kind ~= "message" and filter.kind ~= "part" and filter.kind ~= "asset")
        or (filter.state ~= nil and filter.state ~= "original" and filter.state ~= "customized" and filter.state ~= "created")
        or (filter.base ~= nil and not valid_name(filter.base)) then
        return M.error(errors.INVALID, "invalid_mail_filter", "Provide a valid resource kind, state, base, names and search query")
    end
    return nil
end

function M.check_json(value: unknown, maximum: integer, code: string, message: string): error?
    local encoded, err = canonical.encode(value)
    if err or #encoded > maximum then return M.error(errors.INVALID, code, message) end
    return nil
end

function M.check_note(note: unknown): error?
    if note == nil then return nil end
    local length = type(note) == "string" and utf8.len(note)
    if not length or length > M.MAX_NOTE_LENGTH then
        return M.error(errors.INVALID, "invalid_revision_note",
            "A revision note must be UTF-8 text of at most " .. M.MAX_NOTE_LENGTH .. " characters")
    end
    return nil
end

function M.check_content(input: types.ResourceContent): error?
    local content_bytes = 0
    for _, name in ipairs({"description", "html", "text"}) do
        local value = ((input :: unknown) :: types.Record)[name]
        if value ~= nil then
            if type(value) ~= "string" or not utf8.len(value) then
                return M.error(errors.INVALID, "invalid_mail_resource", "The resource " .. name .. " must be UTF-8 text", input)
            end
            content_bytes = content_bytes + #value
        end
    end
    if content_bytes > M.MAX_CONTENT_BYTES then
        return M.error(errors.INVALID, "mail_resource_too_large", "HTML, text and description must total at most 512 KiB", input)
    end
    for name, maximum in pairs({title = MAX_DISPLAY_BYTES, base = MAX_NAME_BYTES, subject = MAX_SUBJECT_BYTES}) do
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

function M.asset_content(name: string, title: string, description: string, asset: types.Asset): types.ResourceContent
    return {kind = "asset", name = name, title = title, description = description, asset = asset,
        html = "", text = "", schema = {type = "object", properties = {}}, samples = {}}
end

function M.normalize(key: types.ResourceContent): (types.ResourceContent?, error?)
    local invalid = M.check_key(key)
    if invalid then return nil, invalid end
    if key.kind == "asset" then
        if type(key.title) ~= "string" or not key.title:find("%S") or type(key.description) ~= "string" or not key.asset then
            return nil, M.error(errors.INVALID, "invalid_mail_asset", "A library asset needs an image source", key)
        end
        return M.asset_content(key.name, key.title, key.description, key.asset), nil
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

function M.match_origin(item: types.Resource, declared: types.Original?): error?
    if item.state == "created" and declared then
        return M.error(errors.CONFLICT, "mail_resource_collision", "An installed module declares the same resource name", item)
    end
    if item.state == "customized" and (not declared or declared.resource.origin ~= item.origin) then
        return M.error(errors.CONFLICT, "mail_original_changed", "The shipped resource declaration has changed identity", item)
    end
    return nil
end

local function copy(resource: types.Resource): types.Resource
    local result: types.Record = {}
    for key, value in pairs(resource) do result[key] = value end
    return (result :: unknown) :: types.Resource
end

function M.merge(rows: {types.Resource}, originals: types.OriginalMap): (types.ResourceMap?, error?)
    local effective: types.ResourceMap = {}
    for key, declared in pairs(originals) do
        effective[key] = copy(declared.resource)
    end
    for _, row in ipairs(rows) do
        local key = M.subject(row)
        local original = originals[key]
        local err = M.match_origin(row, original)
        if err then return nil, err end
        local item = copy(row)
        item.origin_label = original and original.resource.origin_label or nil
        effective[key] = item
    end
    return effective, nil
end

local function contains(value: string?, q: string): boolean
    return value ~= nil and value:lower():find(q, 1, true) ~= nil
end

function M.matches(item: types.Resource, q: string?): boolean
    return not q or q == "" or contains(item.name, q) or contains(item.title, q)
        or contains(item.description, q) or contains(item.subject, q)
        or contains(item.html, q) or contains(item.text, q)
end

return M
