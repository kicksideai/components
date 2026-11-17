-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local M = {}

-- The reply object of a field, from either alternative of its reply union.
local function field_reply(schema: any): any?
    if schema.anyOf then return schema.anyOf[1] end
    return schema.properties and schema.properties.found and schema or nil
end

-- A schema-constrained decoder: the first preferred reply the field's
-- schema admits. Field "text" prefers found with no value; other fields
-- prefer found without quotes, then found with a quote.
local function constrained(schema: any, name: string, model: string): string
    local item = assert(field_reply(schema))
    local property = item.properties.value
    if property.anyOf then property = property.anyOf[1] end
    local kind = type(property.type) == "table" and property.type[1] or property.type
    local answer = property.enum and assert(json.encode(property.enum[1])) or
        ({string = '"stated"', number = "0", boolean = "false", object = '{"book":"stated"}', array = "[0]"})[kind]
    local ref = item.properties.evidence.items.properties.chunk and "chunk" or "page"
    local at = item.properties.evidence.items.properties[ref].enum[1]
    local quoted = '{"found":true,"value":' .. answer .. ',"confidence":1,"evidence":[{"' .. ref .. '":' .. at .. ',"quote":"No reference is stated."}]}'
    local preferred = {'{"found":true,"value":' .. answer .. ',"confidence":1,"evidence":[]}', quoted}
    if model == "reply-contract-constrained-null" then
        preferred = name == "text" and {'{"found":true,"value":null,"confidence":1,"evidence":[]}'} or {quoted}
    end
    preferred[#preferred + 1] = '{"found":false,"value":null,"confidence":0,"evidence":[]}'
    for _, candidate in ipairs(preferred) do
        if json.validate_string(schema, candidate) then return candidate end
    end
    error("No preferred reply matches the schema of " .. name)
end

local function reply(schema: any, model: string, name: string?): string
    if field_reply(schema) and model:find("reply-contract-constrained", 1, true) then return constrained(schema, assert(name), model) end
    if field_reply(schema) then
        schema = assert(field_reply(schema))
        if model == "reply-contract-found-null" then
            return '{"found":true,"value":null,"confidence":1,"evidence":[]}'
        end
        if model == "reply-contract-absent-value" then
            local property = schema.properties.value
            local kind = type(property.type) == "table" and property.type[1] or property.type
            local value = ({string = '"registered"', number = "0", boolean = "false", object = '{"book":"registered"}', array = "[0]"})[kind]
            return '{"found":false,"value":' .. value .. ',"confidence":1,"evidence":[]}'
        end
        return '{"found":false,"value":null,"confidence":0,"evidence":[]}'
    end
    local members = {}
    for name, property in pairs(schema.properties) do
        members[#members + 1] = assert(json.encode(name)) .. ":" .. reply(property, model, name)
    end
    return "{" .. table.concat(members, ",") .. "}"
end

function M.structured(args: any): (any?, error?)
    local tokens = {prompt_tokens = 12, completion_tokens = 32}
    if args.model == "reply-contract-partial" then
        return nil, errors.new({kind = errors.NOT_FOUND, retryable = false,
            message = "Model failed to return valid JSON: unexpected EOF", details = {
                finish_reason = "length", raw_content = '{"reference":{"found":false,"value":', tokens = tokens,
            }})
    end
    if args.model == "reply-contract-parsed" then
        return {result = {data = {}}, finish_reason = "length", tokens = tokens}, nil
    end
    local raw = reply(args.schema, args.model)
    -- A found field without a value comes from a provider that ignores the schema.
    local valid, validation_err = json.validate_string(args.schema, raw)
    if not valid and args.model ~= "reply-contract-found-null" then
        return nil, errors.new({kind = errors.INVALID, message = tostring(validation_err)})
    end
    local messages = assert(json.encode(args.messages))
    assert(not messages:find("placeholder", 1, true), "Extraction still requests a placeholder")
    assert(messages:find("null", 1, true), "Extraction omits the absent-value instruction")
    return {result = {data = assert(json.decode(raw))}, finish_reason = "stop", tokens = tokens}, nil
end

function M.generate(_args: any): (any?, error?)
    return {result = {content = '{"reference":'}, finish_reason = "length",
        tokens = {prompt_tokens = 12, completion_tokens = 32}}, nil
end

return M
