-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local resource = require("resource")
local jet = require("jet")

local M = {}

local function original(id: string, data: types.Record): (types.Original?, error?)
    local declaration = data.template :: types.ResourceContent
    if type(declaration) ~= "table" then
        return nil, resource.error(errors.INVALID, "invalid_template_declaration", "Missing mail resource declaration " .. id)
    end
    local fields = data.template :: types.Record
    local entry_ids = fields.entries :: {[string]: string}
    if declaration.kind == "asset" then
        entry_ids = {}
        declaration.html, declaration.text = "", ""
    elseif type(entry_ids) ~= "table" or type(entry_ids.html) ~= "string" or type(entry_ids.text) ~= "string"
        or (declaration.kind == "message" and type(entry_ids.subject) ~= "string") then
        return nil, resource.error(errors.INVALID, "invalid_template_declaration", "Missing Jet registry IDs for " .. id)
    end
    declaration.schema = (fields.variable_schema or fields.input_schema or {type = "object", properties = {}}) :: types.VariableSchema
    declaration.samples = (fields.sample or {}) :: types.JsonObject
    local item, err = resource.normalize(declaration)
    if err then return nil, err end
    if item.base then
        local prefix = jet.prefix(item.base)
        if item.html:sub(1, #prefix) ~= prefix or item.text:sub(1, #prefix) ~= prefix then
            return nil, resource.error(errors.INVALID, "invalid_template_declaration", "The shipped Jet faces must use the declared base for " .. id, item)
        end
        item.html = item.html:sub(#prefix + 1)
        item.text = item.text:sub(#prefix + 1)
    end
    local packaged = item :: types.Resource
    packaged.state, packaged.revision, packaged.origin = "original", 0, id
    return {resource = packaged, entries = entry_ids}, nil
end

local function module_title(id: string, titles: {[string]: string}): string
    local namespace = id:match("^([^:]+):")
    while namespace do
        if titles[namespace] then return titles[namespace] end
        namespace = namespace:match("^(.*)%.[^.]+$")
    end
    return "Installed module"
end

function M.list(): (types.OriginalMap?, error?)
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
        local key = resource.subject(declared.resource)
        if items[key] then
            return nil, resource.error(errors.CONFLICT, "duplicate_template_name", "Multiple modules declare " .. key, declared.resource)
        end
        items[key] = declared
    end
    return items, nil
end

return M
