-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A provider that answers a structured call with the smallest reply its schema
-- admits, as a schema-constrained decoder does: every object property, the
-- minimum number of array items, the first enum value or minimum number. A property named
-- "unanswered" is left out, as by a provider that ignores the schema.
local json = require("json")
local M = {}
local function enum_entries(schema: any): integer
    if type(schema) ~= "table" then return 0 end
    local count = schema.enum and #schema.enum or 0
    for key, child in pairs(schema) do
        if key ~= "enum" then count = count + enum_entries(child) end
    end
    return count
end
local function reply(schema: any, options: any): any
    if schema.enum then return schema.enum[1] end
    if schema.type == "number" or schema.type == "integer" then
        local boundary = options.boundary == "maximum" and schema.maximum or schema.minimum
        return (boundary or 1) + (options.offset or 0)
    end
    if schema.type == "boolean" then return false end
    if schema.type == "array" then
        local items = {}
        for i = 1, math.max(1, math.tointeger(schema.minItems) or 1) do items[i] = reply(schema.items, options) end
        return items
    end
    if schema.type == "object" then
        local out = {}
        for name, property in pairs(schema.properties or {}) do
            if not name:find("unanswered", 1, true) then out[name] = reply(property, options) end
        end
        return out
    end
    return "Fixture"
end
function M.structured(args: any): (any?, error?)
    local options = args.options or {}
    local count = enum_entries(args.schema)
    if options.max_enum_entries and count > options.max_enum_entries then
        return nil, errors.new({ kind = errors.INVALID, message = "Schema enum entries exceed " .. options.max_enum_entries .. ": " .. count })
    end
    local encoded = assert(json.encode(args.schema))
    if #encoded > 7000 then return nil, errors.new({ kind = errors.INVALID, message = "Selection schema exceeds 7000 bytes: " .. #encoded }) end
    if encoded:find('"$ref"', 1, true) or encoded:find('"$defs"', 1, true) then
        return nil, errors.new({ kind = errors.INVALID, message = "Selection schema contains references" })
    end
    local maximum
    for _, property in pairs(args.schema.properties) do maximum = property.items.maximum; break end
    local prompt = assert(json.encode(args.messages))
    for n = 1, maximum or 0 do
        if not prompt:find("[S" .. n .. "]", 1, true) then
            return nil, errors.new({ kind = errors.INVALID, message = "Prompt omits section ordinal " .. n })
        end
    end
    return { result = { data = reply(args.schema, options) }, tokens = { prompt_tokens = 10, completion_tokens = 5 } }, nil
end
function M.status(_args: any): (any?, error?) return { status = "ready" }, nil end
return M
