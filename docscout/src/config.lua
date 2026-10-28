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

-- Retires the former extraction selector in stored component contexts.
function M.migrate(value: any): any
    value.stages.extract.structured_output = nil
    return value
end

function M.validate(value: any): error?
    local schema, schema_err = M.schema()
    if schema_err then return schema_err end
    local valid, validation_err = json.validate(schema, value)
    if not valid then return invalid("Invalid configuration: " .. tostring(validation_err)) end
    local names, sections = {}, false
    for _, field in ipairs(value.fields) do
        if names[field.name] then return invalid("Field names must be unique") end
        names[field.name] = true
        if field.type == "enum" and #field.enum_values == 0 then return invalid("Enum fields need at least one value") end
        if #field.enum_values > 0 and field.type ~= "enum" and not (field.type == "list" and field.item_type == "text") then
            return invalid("Allowed values apply to enum fields and lists of text; remove them from " .. field.name)
        end
        if field.search_within == "sections" then sections = true end
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

-- Expected values of an evaluation case keyed by field name, each a value of
-- the field's type; absent fields represent unstated values.
function M.validate_expected(fields: { any }, value: any): error?
    local properties = shapes.object()
    for _, field in ipairs(fields) do properties[field.name] = shapes.value_schema(field) end
    local schema = { type = "object", additionalProperties = false, properties = properties }
    local valid, err = json.validate(schema, value)
    if not valid then return invalid("Expected values do not match the fields: " .. tostring(err)) end
    return nil
end

return M
