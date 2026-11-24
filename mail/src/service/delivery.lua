-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local http_client = require("http_client")
local json = require("json")
local base64 = require("base64")
local time = require("time")
local error_envelope = require("error_envelope")

local M = {}

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

local function text_only(value: string): string
    return (value:gsub("[\r\n\t]+", " "):gsub("%c", ""):gsub("<[^>]*>", " ")
        :gsub("[\194][\128-\159]", ""):gsub("\226\128[\139-\143\170-\174]", "")
        :gsub("\226\129[\160-\175]", ""))
end

local WORD = "[%w_\128-\255]+"

local function redact_message(value: string, content: types.Rendered): string
    local text = value:gsub("[^%s<>()%[%],;]+@[^%s<>()%[%],;]+", "[redacted]")
    local words: {[string]: boolean} = {}
    for word in text:gmatch(WORD) do words[word:lower()] = false end
    for _, part in ipairs({content.subject, content.text or "", content.html or ""}) do
        for word in text_only(part):gmatch(WORD) do
            local key = word:lower()
            if words[key] == false then words[key] = true end
        end
    end
    return (text:gsub(WORD, function(word: string): string
        return words[word:lower()] and "[redacted]" or word
    end))
end

function M.clean_detail(value: unknown, content: types.Rendered?): string?
    if type(value) ~= "string" or not utf8.len(value) then return nil end
    local text = text_only(value):match("^%s*(.-)%s*$") :: string
    if content then text = redact_message(text, content) end
    if text == "" then return nil end
    if #text <= 512 then return text end
    local cut = utf8.offset(text, 0, 513) :: integer
    return text:sub(1, cut - 1)
end

local function redact(value: string, secret: string): string
    return (value:gsub(secret:gsub("(%W)", "%%%1"), "[redacted]"))
end

function M.response_detail(response: types.HttpResponse, credential: string, basic_user: string?): string?
    local content_type = header(response.headers, "content-type") or ""
    local value
    local decoded, decode_err = json.decode(response.body)
    if not decode_err and type(decoded) == "table" then
        value = decoded.message
        if type(value) ~= "string" and type(decoded.errors) == "table" and type(decoded.errors[1]) == "table" then
            value = decoded.errors[1].message
        end
    elseif content_type:lower():match("^text/plain") or (content_type == "" and not response.body:match("^%s*[<{%[]")) then
        value = response.body
    end
    if type(value) ~= "string" then return nil end
    local text = redact(text_only(redact(value, credential)), credential)
    if basic_user then
        local encoded, err = base64.encode(basic_user .. ":" .. credential)
        if err then return nil end
        text = redact(text, encoded :: string)
    end
    text = text:gsub("([Bb][Ee][Aa][Rr][Ee][Rr]%s+)[^%s,;]+", "%1[redacted]")
        :gsub("([Bb][Aa][Ss][Ii][Cc]%s+)[^%s,;]+", "%1[redacted]")
        :gsub("(://)[^%s/@]+:[^%s/@]+@", "%1[redacted]@")
    return M.clean_detail(text)
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
