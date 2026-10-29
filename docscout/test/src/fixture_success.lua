-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
local function value(schema: any): any
    if schema.enum then return schema.enum[1] end
    if schema.type == "number" then return 1250 end
    if schema.type == "boolean" then return false end
    if schema.type == "array" then return { value(schema.items) } end
    if schema.type == "object" then
        local out = {}
        for name, property in pairs(schema.properties) do out[name] = value(property) end
        return out
    end
    return "Fixture"
end
local function extraction(schema: any): any
    if schema.properties.found and schema.properties.found.type == "boolean" then
        local chunk = schema.properties.evidence.items.properties.chunk.enum[1]
        return { found = true, value = value(schema.properties.value), confidence = 1,
            evidence = { { chunk = chunk, quote = "The total amount is 1250." } } }
    end
    local out = {}
    for name, property in pairs(schema.properties) do out[name] = extraction(property) end
    return out
end
function M.structured(args: any): (any?, error?)
    return { result = { data = extraction(args.schema) }, tokens = { prompt_tokens = 12, completion_tokens = 8 } }, nil
end
function M.embed(args: any): (any?, error?)
    local vectors = {}
    for i = 1, #args.input do
        local vector = {}
        for n = 1, 512 do vector[n] = n == 1 and 1.0 or 0.0 end
        vectors[i] = vector
    end
    return { result = { embeddings = vectors }, tokens = { prompt_tokens = #args.input, completion_tokens = 0 } }, nil
end
function M.status(_args: any): (any?, error?) return { status = "ready" }, nil end
return M
