-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Model calls for the engine. Every call adds its token usage and a call
-- record to the step meter it is given, so the run trace reports cost per step
-- and per call, and ends by the run's deadline when the meter carries one.
local time = require("time")
local llm = require("llm")
local prompt = require("prompt")
local json = require("json")
local shapes = require("shapes")
local base64 = require("base64")
local types = require("types")

local M = {}

M.DIMENSIONS = 512
local EMBED_BATCH = 64

-- Native errors retain their retry classification. Structured reply checks
-- supply their existing retry policy; an unclassified string defaults to false.
local function model_error(what: string, err: any, retryable: boolean?): error
    if type(err) == "userdata" then return errors.wrap(err, what .. " failed") end
    return errors.new({ kind = errors.UNAVAILABLE, retryable = retryable == true, message = what .. " failed: " .. tostring(err) })
end

-- A free-text reply stopped at the output limit is incomplete.
local function truncated(model: string): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = false,
        message = "Model reply is truncated by its output limit", details = { code = "model_reply_truncated", model = model } })
end

local function messages(system: string, user: types.UserContent): { any }
    return {
        { role = "system", content = { { type = "text", text = system } } },
        { role = "user", content = type(user) == "string" and { { type = "text", text = user } } or user },
    }
end

-- One model request as the trace records it. stage names what the call does;
-- token counts are absent when the provider reported no usage; sources are the
-- chunk ordinals the prompt carried and fields the field paths it served.
type CallRecord = { stage: string, model: string, prompt_tokens: number?, completion_tokens: number?, latency_ms: integer?,
    pages: {integer}?, image_bytes: integer?, estimated_input_tokens: integer?, finish_reason: string?, error_code: string?, sources: { integer }?, fields: { string }? }

-- Token usage and call records of one step, and the instant its model calls must end by.
type Meter = { input_tokens: number, output_tokens: number, calls: { CallRecord }, deadline: any? }

-- Per-call settings a stage may pass, and what the call record names.
type CallOpts = { pages: {integer}?, image_bytes: integer?, estimated_input_tokens: integer?, max_tokens: integer?, temperature: number?, stage: string?, sources: { integer }?, fields: { string }? }

-- Options handed to the llm module for one call.
type ModelOptions = { model: string, deadline_ms: integer?, max_tokens: integer?, temperature: number?,
    tools: { any }?, tool_choice: string?, dimensions: integer? }

local function millis(): integer return math.floor(time.now():unix_nano() / 1000000) end

-- The code a call record names for a failure: the error's details code, else its kind.
local function error_code(err: error): string
    local details = (err :: any):details()
    if type(details) == "table" and type(details.code) == "string" then return details.code end
    return tostring((err :: any):kind())
end

-- Adds one model call to the meter: its usage to the step totals and its record to the step's calls.
-- usage holds the provider's token counts, or nil when it reported none.
function M.add_call(meter: Meter, stage: string, model: string, usage: any?, extra: any?)
    local entry: CallRecord = { stage = stage, model = model }
    if type(usage) == "table" then
        entry.prompt_tokens = tonumber(usage.prompt_tokens) or 0
        entry.completion_tokens = (tonumber(usage.completion_tokens) or 0) + (tonumber(usage.thinking_tokens) or 0)
        meter.input_tokens = meter.input_tokens + entry.prompt_tokens
        meter.output_tokens = meter.output_tokens + entry.completion_tokens
    end
    if extra then
        entry.latency_ms, entry.finish_reason, entry.error_code = extra.latency_ms, extra.finish_reason, extra.error_code
        entry.sources, entry.fields = extra.sources, extra.fields
        entry.pages, entry.image_bytes, entry.estimated_input_tokens = extra.pages, extra.image_bytes, extra.estimated_input_tokens
    end
    meter.calls[#meter.calls + 1] = entry
end

-- Records a request made at started (milliseconds) with its response and outcome.
local function record(meter: Meter, stage: string, model: string, opts: CallOpts?, started: integer, response: any?, err: error?)
    local finish = type(response) == "table" and response.finish_reason or nil
    M.add_call(meter, (opts and opts.stage) or stage, model, type(response) == "table" and response.tokens or nil, {
        latency_ms = millis() - started, finish_reason = finish and tostring(finish) or nil, error_code = err and error_code(err) or nil,
        sources = opts and opts.sources, fields = opts and opts.fields, pages = opts and opts.pages,
        image_bytes = opts and opts.image_bytes, estimated_input_tokens = opts and opts.estimated_input_tokens })
end

function M.meter(deadline: any?): Meter
    return { input_tokens = 0, output_tokens = 0, calls = {}, deadline = deadline }
end

-- Milliseconds left before the meter's deadline, or nil without one.
function M.time_left(meter: Meter): integer?
    if not meter.deadline then return nil end
    local deadline: any = meter.deadline
    return math.max(0, math.floor((tonumber(deadline:sub(time.now()):nanoseconds()) or 0) / 1000000))
end

-- A TIMEOUT error once the meter's deadline has passed.
function M.check_deadline(meter: Meter, what: string): error?
    if M.time_left(meter) == 0 then
        return errors.new({ kind = errors.TIMEOUT, message = "the run reached its deadline before " .. what })
    end
    return nil
end

-- Options for one model call, bounded by the time left before the deadline.
local function options_for(meter: Meter, what: string, model: string, opts: CallOpts?): (ModelOptions?, error?)
    local late = M.check_deadline(meter, what)
    if late then return nil, late end
    local options: ModelOptions = { model = model, deadline_ms = M.time_left(meter) }
    if opts and opts.max_tokens then options.max_tokens = opts.max_tokens end
    if opts and opts.temperature then options.temperature = opts.temperature end
    return options, nil
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

function M.text_part(text: string): types.TextPart
    return prompt.text(text) :: types.TextPart
end

function M.image_part(mime_type: string, bytes: string): types.ImagePart
    return prompt.image_base64(mime_type, base64.encode(bytes)) :: types.ImagePart
end

function M.require_vision(model: string): error?
    local card, err = M.resolve(model)
    if err then return err end
    for _, capability in ipairs(card.capabilities or {}) do
        if capability == "vision" then return nil end
    end
    return errors.new({kind = errors.INVALID, retryable = false,
        message = "The model does not support page images", details = {code = "model_vision_unsupported", model = model}})
end

-- Prompt sizes are estimates: encoded UTF-8 bytes at four per token,
-- plus a 25% safety margin. Include schemas, tools and message framing in the
-- same estimate everywhere; provider tokenization can still differ.
function M.estimate_value(value: any): integer
    return math.ceil(#assert(json.encode(value)) * 1.25 / 4)
end

function M.estimate(system: string, user: types.UserContent, schema: any?): integer
    return M.estimate_value({ messages = messages(system, user), schema = schema })
end

-- Input allowance from the resolved card, shared by text, tool and embedding
-- requests. Unknown card limits do not create an allowance or output option.
function M.input_budget(model: string, max_output: integer?): (integer?, integer?, error?)
    local card, err = M.resolve(model)
    if err then return nil, nil, err end
    local output, window = tonumber(card.output_tokens), tonumber(card.max_tokens)
    if not output or output <= 0 or not window or window <= 0 then return nil, nil, nil end
    local reserved = math.floor(math.min(max_output and max_output > 0 and max_output or output, output))
    return math.floor(window - reserved), reserved, nil
end

function M.fitter(model: string, max_output: integer?): (any?, integer?, error?)
    local available, reserved, err = M.input_budget(model, max_output)
    if err then return nil, nil, err end
    return function(system: string, user: types.UserContent, schema: any?): (boolean, integer, integer?)
        local estimated = M.estimate(system, user, schema)
        return available == nil or estimated <= available, estimated, available
    end, reserved, nil
end

function M.over_budget(model: string, what: string, advice: string): error
    return errors.new({ kind = errors.INVALID, retryable = false,
        message = what .. " exceeds the context window of " .. model .. "; " .. advice,
        details = { code = "prompt_exceeds_budget", model = model } })
end

function M.budget_error(model: string, estimated: integer?, available: integer?): error
    return errors.new({ kind = errors.INVALID, retryable = false,
        message = "Document context exceeds the model budget" ..
            (estimated and (" (estimated " .. estimated .. " tokens" .. (available and (", available " .. available) or "") .. ")") or ""),
        details = { code = "context_budget_exceeded", model = model, estimated_tokens = estimated, available_tokens = available } })
end

-- The LLM and native agent errors preserve structured causes. Inspect those
-- details, never provider-specific message text, to distinguish input rejection
-- from an output reply stopped at length.
function M.context_error(model: string, err: any): error?
    local function find(value: any): any?
        if type(value) == "userdata" then return find(value:details()) end
        if type(value) ~= "table" then return nil end
        if value.error_type == "context_window" or value.error_type == "context_length_exceeded" then return value end
        for _, child in pairs(value) do
            if type(child) == "table" or type(child) == "userdata" then
                local found = find(child)
                if found then return found end
            end
        end
        return nil
    end
    local source = find(err)
    if not source then return nil end
    local estimated = tonumber(source.estimated_prompt_tokens)
    local available = tonumber(source.context_window)
    if available then available = available - (tonumber(source.requested_output_tokens) or 0) end
    local details = {}
    for key, value in pairs(source) do details[key] = value end
    details.code, details.model = "context_budget_exceeded", source.model or model
    details.estimated_tokens, details.available_tokens = estimated, available
    return errors.new({ kind = errors.INVALID, retryable = false,
        message = "Document context exceeds the model budget: " .. tostring(err), details = details })
end

local function admission(model: string, system: string, user: types.UserContent, schema: any?, opts: CallOpts?): error?
    local fits, _, err = M.fitter(model, opts and opts.max_tokens)
    if err then return err end
    local ok, estimated, available = fits(system, user, schema)
    if not ok then return M.budget_error(model, estimated, available) end
    return nil
end

-- The reply a provider failure reports: the llm module carries a failed
-- reply's usage and finish reason in the error details. nil when the failure
-- came before any reply.
local function failed_reply(err: any): any?
    if type(err) ~= "userdata" then return nil end
    local details = (err :: any):details()
    if type(details) ~= "table" or (details.tokens == nil and details.finish_reason == nil) then return nil end
    return { tokens = details.tokens, finish_reason = details.finish_reason }
end

-- The structured result of a response, or why the response is unusable. A
-- failed reply that stopped at the output limit is a truncation.
local function structured_result(model: string, schema: any, response: any, err: any): (any?, error?)
    local reply = err and failed_reply(err) or response
    if err then
        local budget = M.context_error(model, err)
        if budget then return nil, budget end
    end
    if err and not (reply and reply.finish_reason == "length") then return nil, model_error("structured model call (" .. model .. ")", err) end
    if reply.finish_reason == "length" then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true,
            message = "Structured model reply is truncated", details = { code = "structured_reply_truncated", model = model } })
    end
    if type(response.result) ~= "table" then
        return nil, model_error("structured model call (" .. model .. ")", "no structured result", true)
    end
    local encoded, encode_err = json.encode(response.result)
    if encode_err then return nil, model_error("structured reply encoding", encode_err, true) end
    local valid, validation_err = json.validate_string(schema, encoded)
    if not valid then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true,
            message = "Structured model reply does not match its schema: " .. tostring(validation_err),
            details = { code = "structured_reply_invalid", model = model } })
    end
    return response.result, nil
end

-- Structured output as a Lua table that matches schema.
function M.structured(meter: Meter, model: string, schema: any, system: string, user: types.UserContent, opts: CallOpts?): (any?, error?)
    local options, late = options_for(meter, "a structured model call", model, opts)
    if late then return nil, late end
    local budget = admission(model, system, user, schema, opts)
    if budget then return nil, budget end
    local started = millis()
    local response, call_err = llm.structured_output(schema, messages(system, user), options)
    local result, err = structured_result(model, schema, response, call_err)
    record(meter, "structured", model, opts, started, response or failed_reply(call_err), err)
    return result, err
end

function M.generate(meter: Meter, model: string, system: string, user: string, opts: CallOpts?): (string?, error?)
    local options, late = options_for(meter, "a model call", model, opts)
    if late then return nil, late end
    local budget = admission(model, system, user, nil, opts)
    if budget then return nil, budget end
    local started = millis()
    local response, call_err = llm.generate(messages(system, user), options)
    local err = call_err and (M.context_error(model, call_err) or model_error("model call (" .. model .. ")", call_err)) or nil
    if not err and response.finish_reason == "length" then err = truncated(model) end
    record(meter, "generate", model, opts, started, response or failed_reply(call_err), err)
    if err then return nil, err end
    return tostring(response.result or ""), nil
end

-- A tool-using conversation: call(name, args) runs a tool and returns its text.
-- Stops when the model answers without tools, after max_calls tool calls, or
-- when a tool fails.
function M.agent(meter: Meter, model: string, system: string, user: string, tools: { any }, max_calls: integer,
        call: (string, any, string?) -> (string?, error?), opts: CallOpts?, reduce: any?): (string?, integer, error?)
    local conversation = prompt.new()
    conversation:add_system(system)
    conversation:add_user(user)
    local calls = 0
    local fits, _, fit_err = M.fitter(model, opts and opts.max_tokens)
    if fit_err then return nil, calls, fit_err end
    local _, _, available = (fits :: any)("", "", nil)
    -- The fitted message array replaces the prompt builder only when it is
    -- necessary. That keeps unknown-limit and fitting requests byte-for-byte
    -- on the established prompt path.
    local function request(): (any?, error?)
        if not available then return conversation, nil end
        local original = conversation:get_messages()
        local function accepts(candidate: { any }): (boolean, integer, integer)
            local estimated = M.estimate_value({ messages = candidate, tools = tools })
            return estimated <= (available :: integer), estimated, available :: integer
        end
        if accepts(original) then return conversation, nil end
        if not reduce then
            return nil, M.budget_error(model, M.estimate_value({ messages = original, tools = tools }), available)
        end
        local reduced, reduce_err = reduce(original, accepts)
        if reduce_err then return nil, reduce_err end
        if type(reduced) ~= "table" then
            return nil, M.budget_error(model, M.estimate_value({ messages = original, tools = tools }), available)
        end
        if not accepts(reduced) then
            return nil, M.budget_error(model, M.estimate_value({ messages = reduced, tools = tools }), available)
        end
        return reduced, nil
    end
    while true do
        local options, late = options_for(meter, "an agent model call", model, opts)
        if late then return nil, calls, late end
        local input, budget_err = request()
        if budget_err then return nil, calls, budget_err end
        options.tools, options.tool_choice = tools, calls < max_calls and "auto" or "none"
        local started = millis()
        local response, call_err = llm.generate(input, options)
        local err = call_err and (M.context_error(model, call_err) or model_error("agent model call (" .. model .. ")", call_err)) or nil
        if not err and response.finish_reason == "length" then err = truncated(model) end
        record(meter, "agent", model, opts, started, response or failed_reply(call_err), err)
        if err then return nil, calls, err end
        local tool_calls = response.tool_calls
        if not tool_calls or #tool_calls == 0 or calls >= max_calls then return tostring(response.result or ""), calls, nil end
        for _, tc in ipairs(tool_calls) do
            calls = calls + 1
            local args, encode_err = json.encode(tc.arguments or {})
            if encode_err then return nil, calls, model_error("agent tool call", encode_err) end
            conversation:add_function_call(tc.name, args, tc.id)
            local result = "Tool budget used; answer now."
            if calls <= max_calls then
                local text, call_err = call(tc.name, tc.arguments or {}, tc.id)
                if call_err then return nil, calls, call_err end
                result = text :: string
            end
            local encoded = json.encode(result)
            conversation:add_function_result(tc.name, encoded, tc.id)
        end
    end
end

-- Embeds texts in batches; one 512-dimensional vector per text, in order.
function M.embed(meter: Meter, model: string, texts: { string }): (any?, error?)
    if #texts == 0 then return {}, nil end
    local late = M.check_deadline(meter, "embedding")
    if late then return nil, late end
    local available, _, fit_err = M.input_budget(model)
    if fit_err then return nil, fit_err end
    local function estimate(batch: { any }): integer return M.estimate_value({ input = batch }) end
    local batches, rejected = shapes.batches(texts, function(batch: { any }): boolean return available == nil or estimate(batch) <= available end, EMBED_BATCH)
    local vectors: { any } = {}
    for _, batch in ipairs(batches) do
        local options, late = options_for(meter, "embedding", model)
        if late then return nil, late end
        options.dimensions = M.DIMENSIONS
        local started = millis()
        local response, call_err = llm.embed(batch, options)
        local err = call_err and (M.context_error(model, call_err) or model_error("embedding (" .. model .. ")", call_err)) or nil
        local result = response and response.result
        if not err then
            if type(result) ~= "table" or #result ~= #batch then
                err = model_error("embedding (" .. model .. ")", "returned " .. tostring(type(result) == "table" and #result or 0) .. " vectors for " .. #batch .. " texts")
            else
                for _, vector in ipairs(result) do
                    if type(vector) ~= "table" or #vector ~= M.DIMENSIONS then
                        err = model_error("embedding (" .. model .. ")", "returned a vector that is not " .. M.DIMENSIONS .. "-dimensional")
                        break
                    end
                end
            end
        end
        record(meter, "embed", model, nil, started, response or failed_reply(call_err), err)
        if err then return nil, err end
        for _, vector in ipairs(result) do vectors[#vectors + 1] = vector end
    end
    if #rejected > 0 then return nil, M.budget_error(model, estimate({ rejected[1] }), available) end
    return vectors, nil
end

return M
