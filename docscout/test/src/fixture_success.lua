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
    for name, property in pairs(schema.properties) do
        out[name] = extraction(property)
        if name == "missing_reply" then out[name].found, out[name].evidence = false, {} end
    end
    return out
end
function M.structured(args: any): (any?, error?)
    if args.schema.properties.provider_failure then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "Fixture provider unavailable", details = { code = "fixture_provider_failure" } })
    end
    if args.schema.properties.truncated_reply then
        return { result = { data = extraction(args.schema) }, finish_reason = "length",
            tokens = { prompt_tokens = 12, completion_tokens = 8 } }, nil
    end
    if args.schema.properties.invalid_reply then
        return { result = { data = {} }, tokens = { prompt_tokens = 12, completion_tokens = 8 } }, nil
    end
    return { result = { data = extraction(args.schema) }, tokens = { prompt_tokens = 12, completion_tokens = 8 } }, nil
end
function M.generate(args: any): (any?, error?)
    for _, message in ipairs(args.messages) do
        for _, part in ipairs(message.content or {}) do
            if part.type == "text" and part.text:find("deep_failure", 1, true) then
                return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "Deep analysis unavailable", details = { code = "fixture_deep_failure" } })
            end
        end
    end
    for _, message in ipairs(args.messages) do
        if message.role == "function_result" then
            return { result = { content = "The total is in the Invoice section, passage C1." },
                tokens = { prompt_tokens = 14, completion_tokens = 9 } }, nil
        end
    end
    return { result = { content = "", tool_calls = {
        { id = "fixture-search", name = "keyword_search", arguments = { query = "total amount", limit = 5 } },
    } }, tokens = { prompt_tokens = 11, completion_tokens = 7 } }, nil
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
