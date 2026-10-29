-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Validates extractor configurations and evaluation expected values. The JSON
-- Schema declares shapes and bounds; the rules here relate settings to each other.
local json = require("json")
local registry = require("registry")
local shapes = require("shapes")

local M = {}

local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, message = message })
end

function M.schema(): (any?, error?)
    local entry, err = registry.get("kickside.docscout:config_schema")
    if err then return nil, err end
    return json.decode((entry :: any).data.schema_json)
end

function M.validate(value: any): error?
    local schema, schema_err = M.schema()
    if schema_err then return schema_err end
    local valid, validation_err = json.validate(schema, value)
    if not valid then return invalid("Invalid configuration: " .. tostring(validation_err)) end
    local names, sections = {}, false
    for _, field in ipairs(value.fields) do
        local path = shapes.path(field)
        if names[path] then return invalid("Field paths must be unique") end
        names[path] = true
        if #field.enum_values > 0 and field.type ~= "enum" then return invalid("Allowed values apply to enum fields and text items") end
        local shape_err = M.validate_shape(field, 1)
        if shape_err then return shape_err end
        if field.search_within == "sections" then sections = true end
    end
    for path in pairs(names) do
        local prefix = ""
        for segment in path:gmatch("[^.]+") do
            prefix = prefix == "" and segment or prefix .. "." .. segment
            if prefix ~= path and names[prefix] then return invalid("Group path collides with field " .. prefix) end
        end
    end
    local stages = value.stages
    if sections and not stages.map.enabled then return invalid("Fields that search within sections need Map the document") end
    for _, field in ipairs(value.fields) do
        local deep = field.strategy == "deep" and stages.deep.enabled
        if not deep and not stages.prefetch.enabled and not stages.scout.enabled then
            return invalid("Turn on Prefetch or Scout so extraction has passages to read for " .. field.name)
        end
    end
    if stages.scout.enabled and stages.scout.mode == "agent" then
        if #stages.scout.tools == 0 then return invalid("Agent scouting needs at least one tool") end
        if stages.scout.max_rounds == 0 or stages.scout.max_extra_queries == 0 then
            return invalid("Agent scouting needs at least one round and one query per round")
        end
    end
    if stages.verify.enabled and not (stages.verify.check_quotes or stages.verify.check_support) then return invalid("Verify needs at least one check") end
    if value.retrieval.overlap >= value.retrieval.chunk_size then return invalid("Overlap must be smaller than chunk size") end
    return nil
end

-- Declared properties have local names; list items are shapes without a name.
function M.validate_shape(field: any, depth: integer): error?
    if depth > 4 then return invalid("Field shapes support at most four levels") end
    local enums = field.enum_values or {}
    if field.type == "enum" and #enums == 0 then return invalid("Enum fields need at least one value") end
    if #enums > 0 and field.type ~= "enum" and field.type ~= "text" then
        return invalid("Allowed values apply to enum fields and text items")
    end
    if field.type == "object" then
        if not field.properties or #field.properties == 0 then return invalid("Object fields need a declared property") end
        local names = {}
        for _, p in ipairs(field.properties) do
            if names[p.name] then return invalid("Property names must be unique") end
            names[p.name] = true
            local err = M.validate_shape(p, depth + 1)
            if err then return err end
        end
    elseif field.properties ~= nil then return invalid("Properties apply to object shapes") end
    if field.type == "list" then
        if not field.item then return invalid("Lists need a declared item shape") end
        local err = M.validate_shape(field.item, depth + 1)
        if err then return err end
    elseif field.item ~= nil then return invalid("Item shapes apply to lists") end
    return nil
end

-- Expected values share the extraction's nested group and typed value shape.
function M.validate_expected(fields: { any }, value: any): error?
    local valid, err = json.validate(shapes.expected_schema(fields), value)
    if not valid then return invalid("Expected values do not match the fields: " .. tostring(err)) end
    return nil
end

return M
