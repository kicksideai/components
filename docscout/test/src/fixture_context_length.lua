-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A provider-side refusal after request assembly.  It differs from Docscout's
-- own admission check so the error normalization path stays covered.
local M = {}

function M.resolve_model(model: string): (any?, error?)
    return { name = model, max_tokens = 2400, output_tokens = 256 }, nil
end

function M.structured_output(_schema: any, _messages: any, _options: any): (any?, error?)
    return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "provider context window exceeded",
        details = { error_type = "context_window", estimated_prompt_tokens = 912, context_window = 800 } })
end

function M.generate(_messages: any, _options: any): (any?, error?)
    return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "provider context window exceeded",
        details = { error_type = "context_length_exceeded", estimated_prompt_tokens = 912, context_window = 800 } })
end

function M.embed(_input: any, _options: any): (any?, error?)
    return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "provider context window exceeded",
        details = { error_type = "context_length_exceeded", estimated_prompt_tokens = 912, context_window = 800 } })
end

function M.probe(_input: any): (any?, error?)
    local ai = require("ai")
    if _input.embed then return ai.embed(ai.meter(), "class:docscout-context-budget", { "source" }) end
    return ai.structured(ai.meter(), "class:docscout-context-budget", { type = "object", additionalProperties = false,
        required = { "answer" }, properties = { answer = { type = "string" } } }, "system", "user")
end

return M
