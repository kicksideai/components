-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Model calls for the engine. Every call adds its token usage to the step
-- meter it is given, so the run trace reports cost per step.
local llm = require("llm")
local prompt = require("prompt")
local json = require("json")

local M = {}

M.DIMENSIONS = 512
local EMBED_BATCH = 64

-- The llm module reports provider failures as strings; those are transient.
-- A native error keeps its own kind and retryability.
local function model_error(what: string, err: any): error
    if type(err) == "userdata" then return errors.wrap(err, what .. " failed") end
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = what .. " failed: " .. tostring(err) })
end

-- Characters per token for prompt size estimates; matches the chunker.
local CHARS_PER_TOKEN = 4

local function messages(system: string, user: string): { any }
    return {
        { role = "system", content = { { type = "text", text = system } } },
        { role = "user", content = { { type = "text", text = user } } },
    }
end

local function count(meter: any, response: any)
    local tokens = response and response.tokens
    if type(tokens) ~= "table" then return end
    meter.input_tokens = meter.input_tokens + (tonumber(tokens.prompt_tokens) or 0)
    meter.output_tokens = meter.output_tokens + (tonumber(tokens.completion_tokens) or 0) + (tonumber(tokens.thinking_tokens) or 0)
end

function M.meter(): any
    return { input_tokens = 0, output_tokens = 0 }
end

-- The model behind a reference such as class:fast, as its catalog card.
function M.resolve(model: string): (any?, error?)
    local card, err = llm.resolve_model(model)
    if err then return nil, model_error("model lookup (" .. model .. ")", err) end
    if type(card) ~= "table" then
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "no model answers to " .. model })
    end
    return card, nil
end

-- Refuses a prompt that, with its output allowance, exceeds the model's context window.
function M.check_budget(model: string, prompt_text: string, output_tokens: integer): error?
    local card, err = M.resolve(model)
    if err then return err end
    local window = tonumber(card.max_tokens)
    if not window or window <= 0 then return nil end
    local needed = math.ceil(#prompt_text / CHARS_PER_TOKEN) + output_tokens
    if needed > window then
        return errors.new({ kind = errors.INVALID, message = "the extraction prompt needs about " .. needed .. " tokens but " .. tostring(card.name or model) ..
            " takes " .. math.floor(window) .. "; lower passages per field, Deep chunk cap or fields per call" })
    end
    return nil
end

-- Structured output as a Lua table that matches schema.
function M.structured(meter: any, model: string, schema: any, system: string, user: string, opts: any?): (any?, error?)
    local options: any = { model = model }
    if opts and opts.max_tokens then options.max_tokens = opts.max_tokens end
    if opts and opts.temperature then options.temperature = opts.temperature end
    local response, err = llm.structured_output(schema, messages(system, user), options)
    if err then return nil, model_error("structured model call (" .. model .. ")", err) end
    count(meter, response)
    if type(response.result) ~= "table" then
        return nil, model_error("structured model call (" .. model .. ")", "no structured result")
    end
    return response.result, nil
end

function M.generate(meter: any, model: string, system: string, user: string, opts: any?): (string?, error?)
    local options: any = { model = model }
    if opts and opts.max_tokens then options.max_tokens = opts.max_tokens end
    if opts and opts.temperature then options.temperature = opts.temperature end
    local response, err = llm.generate(messages(system, user), options)
    if err then return nil, model_error("model call (" .. model .. ")", err) end
    count(meter, response)
    return tostring(response.result or ""), nil
end

-- A tool-using conversation: call(name, args) runs a tool and returns its text.
-- Stops when the model answers without tools, after max_calls tool calls, or
-- when a tool fails.
function M.agent(meter: any, model: string, system: string, user: string, tools: { any }, max_calls: integer,
        call: (string, any) -> (string?, error?), opts: any?): (string?, integer, error?)
    local conversation = prompt.new()
    conversation:add_system(system)
    conversation:add_user(user)
    local calls = 0
    while true do
        local options: any = { model = model, tools = tools, tool_choice = calls < max_calls and "auto" or "none" }
        if opts and opts.max_tokens then options.max_tokens = opts.max_tokens end
        local response, err = llm.generate(conversation, options)
        if err then return nil, calls, model_error("agent model call (" .. model .. ")", err) end
        count(meter, response)
        local tool_calls = response.tool_calls
        if not tool_calls or #tool_calls == 0 or calls >= max_calls then return tostring(response.result or ""), calls, nil end
        for _, tc in ipairs(tool_calls) do
            calls = calls + 1
            local args, encode_err = json.encode(tc.arguments or {})
            if encode_err then return nil, calls, model_error("agent tool call", encode_err) end
            conversation:add_function_call(tc.name, args, tc.id)
            local result = "Tool budget used; answer now."
            if calls <= max_calls then
                local text, call_err = call(tc.name, tc.arguments or {})
                if call_err then return nil, calls, call_err end
                result = text :: string
            end
            local encoded = json.encode(result)
            conversation:add_function_result(tc.name, encoded, tc.id)
        end
    end
end

-- Embeds texts in batches; one 512-dimensional vector per text, in order.
function M.embed(meter: any, model: string, texts: { string }): (any?, error?)
    local vectors: { any } = {}
    for start = 1, #texts, EMBED_BATCH do
        local batch = {}
        for i = start, math.min(#texts, start + EMBED_BATCH - 1) do batch[#batch + 1] = texts[i] end
        local response, err = llm.embed(batch, { model = model, dimensions = M.DIMENSIONS })
        if err then return nil, model_error("embedding (" .. model .. ")", err) end
        count(meter, response)
        local result = response and response.result
        if type(result) ~= "table" or #result ~= #batch then
            return nil, model_error("embedding (" .. model .. ")", "returned " .. tostring(type(result) == "table" and #result or 0) .. " vectors for " .. #batch .. " texts")
        end
        for _, vector in ipairs(result) do
            if type(vector) ~= "table" or #vector ~= M.DIMENSIONS then
                return nil, model_error("embedding (" .. model .. ")", "returned a vector that is not " .. M.DIMENSIONS .. "-dimensional")
            end
            vectors[#vectors + 1] = vector
        end
    end
    return vectors, nil
end

return M
