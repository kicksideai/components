-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local M = {}

local function absent(schema: any): string
    if schema.properties.found then
        return '{"found":false,"value":null,"confidence":0,"evidence":[]}'
    end
    local members = {}
    for name, property in pairs(schema.properties) do
        members[#members + 1] = assert(json.encode(name)) .. ":" .. absent(property)
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
    local raw = absent(args.schema)
    local valid, validation_err = json.validate_string(args.schema, raw)
    if not valid then
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
