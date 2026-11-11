-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
function M.resolve_model(model: string): (any?, error?) return { name = model }, nil end
function M.generate(_messages: any, options: any): (any?, any?)
    if options.model == "plain" then return nil, "Authentication is rejected" end
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = options.model == "transient", message = "Fixture failure" })
end
function M.structured_output(_schema: any, _messages: any, _options: any): (any?, any?)
    return { tokens = { prompt_tokens = 1, completion_tokens = 1 } }, nil
end
function M.probe(input: any): (any?, error?)
    local ai = require("ai")
    if input.structured then
        return ai.structured(ai.meter(), input.model, { type = "object", required = { "answer" },
            properties = { answer = { type = "string" } } }, "system", "user")
    end
    return ai.generate(ai.meter(), input.model, "system", "user")
end
return M
