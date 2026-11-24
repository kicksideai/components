-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local sql = require("sql")
local channel = require("channel")
local base64 = require("base64")
local delivery = require("delivery")

local function result(id, message)
    return {provider_message_id = table.concat({
        id, message.from.address, message.from.name or "", message.reply_to or "",
    }, "|")}
end

local function capture(message)
    local behavior = message.subject:match("^Fixture ([%w_]+)$")
    if behavior then
        local db = assert(sql.get("app:db"))
        local rows = assert(db:query("SELECT attempts FROM mail_message WHERE id=$1", {message.idempotency_key}))
        assert(db:release())
        local attempts = rows[1].attempts
        local fault = behavior:match("^http_(.+)$")
        if fault then
            local response, err = delivery.post("https://provider.example.org/messages",
                assert(json.encode({fault = fault, attempts = attempts})), {})
            if err then return nil, err end
            return delivery.message_id(response)
        end
        if (behavior == "ceiling" or behavior == "ceiling_lost") and attempts == 5 then
            channel.new():receive()
        end
        if behavior == "detail" then
            if attempts == 1 then
                return nil, errors.new({kind = errors.RATE_LIMITED, retryable = true, message = "Test rate limit",
                    details = {code = "rate_limited", provider_detail = "Upstream retry diagnostic"}})
            end
            return nil, errors.new({kind = errors.INVALID, retryable = false, message = "Test refusal",
                details = {code = "message_rejected", provider_detail = "Upstream refusal diagnostic"}})
        end
        if behavior == "echo" then
            local detail = "Rejected record: " .. message.to[1] .. " <" .. message.bcc[1] .. "> different@sample.org; "
                .. message.subject .. " / Private message body / Confidential fragment / Restricted HTML phrase"
            return nil, errors.new({kind = errors.INVALID, retryable = false, message = detail,
                details = {code = "message_rejected", provider_detail = detail}})
        end
        if behavior == "rejected" then
            return nil, errors.new({kind = errors.PERMISSION_DENIED, retryable = false, message = "Test authorization refused",
                details = {code = "credentials_invalid"}})
        end
        if behavior ~= "once" or attempts == 1 then
            return nil, errors.new({kind = errors.RATE_LIMITED, retryable = true, message = "Test rate limit",
                details = {code = "rate_limited"}})
        end
    end
    local attachments = {}
    for i, file in ipairs(message.attachments or {}) do
        attachments[i] = {content_id = file.content_id, disposition = file.disposition,
            content_type = file.content_type, base64 = assert(base64.encode(file.content))}
    end
    return {provider_message_id = assert(json.encode({
        attachments = attachments,
        subject = message.subject, html = message.html, text = message.text,
        to = message.to, cc = message.cc, bcc = message.bcc, idempotency_key = message.idempotency_key,
    }))}
end

return {
    capture = capture,
    first = function(message)
        if message.subject == "Resend fixture" then
            return nil, errors.new({kind = errors.INVALID, retryable = false, message = "Fixture transport refused delivery",
                details = {code = "message_rejected"}})
        end
        local response = result("first", message)
        response.transport_metadata = "fixture detail"
        return response
    end,
    second = function(message) return result("second", message) end,
    available = function() return {available = true} end,
}
