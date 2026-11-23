-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local sink = require("writable_sink") :: types.WritableSink
local client = require("client")

local CLASSIFICATION = {
    [errors.INVALID] = {code = "invalid_request", scope = "item"},
    [errors.NOT_FOUND] = {code = "not_found", scope = "item"},
    [errors.PERMISSION_DENIED] = {code = "permission_denied", scope = "item"},
    [errors.RATE_LIMITED] = {code = "rate_limited", scope = "capacity"},
    [errors.UNAVAILABLE] = {code = "provider_unavailable", scope = "provider"},
    [errors.TIMEOUT] = {code = "provider_unavailable", scope = "provider"},
}

local function write(request: types.SinkRequest): types.SinkResult | types.SinkFailure
    local _, origin_err = sink.origin(request)
    if origin_err then return origin_err end
    if request.sink_op ~= "create" or type(request.input) ~= "table"
        or type(request.idempotency_key) ~= "string" or request.idempotency_key == "" then
        return sink.fail("A create write requires a message record and an idempotency key", "invalid_request")
    end
    local input = {}
    for key, value in pairs(request.input) do input[key] = value end
    input.idempotency_key = request.idempotency_key
    local sent, err = client.send(input :: types.SendRequest)
    if err then
        local details = err:details() or {}
        if details.code == "invalid_config" then
            return sink.fail(err:message(), "invalid_config", err:retryable(), "provider", details)
        end
        if details.code == "idempotency_conflict" then
            return sink.fail(err:message(), "idempotency_conflict", false, "item", details)
        end
        local classification = CLASSIFICATION[err:kind()] or {code = "provider_error", scope = "item"}
        return sink.fail(err:message(), classification.code, err:retryable(), classification.scope, details)
    end
    local message = sent :: types.SendResult
    return {success = true, result = "created", dest_ref = {message_id = message.message_id}}
end

return { write = write }
