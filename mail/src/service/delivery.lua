-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local http_client = require("http_client")
local json = require("json")
local base64 = require("base64")
local time = require("time")
local error_envelope = require("error_envelope")

local redact = require("redact")

local M = {clean_detail = redact.clean_detail, response_detail = redact.response_detail}

local function header(headers: {[string]: string | {string}}, key: string): string?
    for name, value in pairs(headers) do
        if name:lower() == key then
            if type(value) == "string" then return value end
            return value[1]
        end
    end
    return nil
end

local function number_header(raw: string?): number?
    if not raw or not raw:match("^%s*%d+%s*$") then return nil end
    local value = tonumber(raw)
    if value and value < math.huge then return value end
    return nil
end

function M.retry_hint(response: types.HttpResponse, reset: string, units: string): number?
    local raw = header(response.headers, "retry-after")
    local seconds = number_header(raw)
    if seconds then return math.min(seconds, math.maxinteger // 1000) * 1000 end
    local now = time.now():unix_nano() // 1000000
    if raw then
        local target, parse_err = time.parse(time.RFC1123, raw)
        if not parse_err then return math.max(0, target:unix_nano() // 1000000 - now) end
    end
    if response.status_code ~= 429 and response.status_code ~= 420 then return nil end
    local value = number_header(header(response.headers, reset))
    if not value then return nil end
    if units == "seconds" then return math.min(value, math.maxinteger // 1000) * 1000 end
    if units == "epoch_seconds" then value = value * 1000.0 end
    return math.max(0, value - now)
end

function M.failure(kind: string, code: string, message: string, retryable: boolean, status: number?,
    retry_after_ms: number?, provider_detail: string?): error
    return errors.new({kind = kind, message = message, retryable = retryable,
        details = {code = code, status = status, retry_after_ms = retryable and retry_after_ms or nil,
            provider_detail = provider_detail}})
end

function M.authorization_refused(status: number, provider_detail: string?): error
    return M.failure(errors.PERMISSION_DENIED, "authorization_refused",
        "The mail service refused authorization", false, status, nil, provider_detail)
end

function M.status_error(status: number, rejected_status: number, retry_after_ms: number?, provider_detail: string?): error
    if status == 403 then return M.authorization_refused(status, provider_detail) end
    if status == 401 then
        return M.failure(errors.PERMISSION_DENIED, "credentials_invalid", "The mail service refused authorization", false, status, nil, provider_detail)
    end
    if status == 400 or status == rejected_status then
        return M.failure(errors.INVALID, "message_rejected", "The mail service refused the message", false, status, nil, provider_detail)
    end
    if status == 429 then
        return M.failure(errors.RATE_LIMITED, "rate_limited", "Mail sending rate limit exceeded", true, status, retry_after_ms, provider_detail)
    end
    if status >= 500 and status < 600 then
        return M.failure(errors.UNAVAILABLE, "provider_unavailable", "The mail service is unavailable", true, status, retry_after_ms, provider_detail)
    end
    return M.failure(errors.INTERNAL, "provider_rejected", "The mail service returned an unexpected status", false, status, nil, provider_detail)
end

function M.post(url: string, body: string, headers: {[string]: string}, auth: types.HttpAuth?): (types.HttpResponse?, error?)
    local response, err = http_client.request("POST", url, {
        auth = auth, headers = headers, body = body, timeout = "20s", max_response_body = 64 * 1024,
    })
    if err then
        if not response and err:retryable() then
            return nil, errors.wrap(errors.new({kind = errors.UNAVAILABLE, message = err:message(), retryable = true,
                details = {code = "provider_transport_failed", cause = error_envelope.encode(err)}}),
                "Mail delivery request failed")
        end
        return nil, error_envelope.wrap(err, "Mail delivery request failed", {code = "provider_request_failed"})
    end
    return response :: types.HttpResponse, nil
end

function M.encode_message(payload: types.Record): (string?, error?)
    local body, err = json.encode(payload)
    if err then return nil, error_envelope.wrap(err, "Cannot encode message", {code = "message_encoding_failed"}) end
    return body, nil
end

function M.encode_attachment(bytes: string): (string?, error?)
    local encoded, err = base64.encode(bytes)
    if err then return nil, error_envelope.wrap(err, "Cannot encode attachment", {code = "attachment_encoding_failed"}) end
    return encoded, nil
end

function M.message_id(response: types.HttpResponse): (types.TransportResult, nil)
    local decoded, err = json.decode(response.body)
    if not err and type(decoded) == "table" and type(decoded.id) == "string" and decoded.id:find("%S") then
        return {provider_message_id = decoded.id}, nil
    end
    -- An accepted response can omit a usable ID.
    return {}, nil
end

return M
