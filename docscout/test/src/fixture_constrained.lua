-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A provider that answers a structured call with the smallest reply its schema
-- admits, as a schema-constrained decoder does: every object property, the
-- minimum number of array items, the first enum value. A property named
-- "unanswered" is left out, as by a provider that ignores the schema.
local M = {}
local function reply(schema: any): any
    if schema.enum then return schema.enum[1] end
    if schema.type == "number" or schema.type == "integer" then return schema.minimum or 1 end
    if schema.type == "boolean" then return false end
    if schema.type == "array" then
        local items = {}
        for i = 1, math.max(1, math.tointeger(schema.minItems) or 1) do items[i] = reply(schema.items) end
        return items
    end
    if schema.type == "object" then
        local out = {}
        for name, property in pairs(schema.properties or {}) do
            if not name:find("unanswered", 1, true) then out[name] = reply(property) end
        end
        return out
    end
    return "Fixture"
end
function M.structured(args: any): (any?, error?)
    return { result = { data = reply(args.schema) }, tokens = { prompt_tokens = 10, completion_tokens = 5 } }, nil
end
function M.status(_args: any): (any?, error?) return { status = "ready" }, nil end
return M
