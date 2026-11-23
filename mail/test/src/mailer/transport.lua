-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local sql = require("sql")
local channel = require("channel")

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
        if (behavior == "ceiling" or behavior == "ceiling_lost") and attempts == 5 then
            channel.new():receive()
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
    return {provider_message_id = assert(json.encode({
        subject = message.subject, html = message.html, text = message.text,
        to = message.to, cc = message.cc, bcc = message.bcc, idempotency_key = message.idempotency_key,
    }))}
end

return {
    capture = capture,
    first = function(message)
        local response = result("first", message)
        response.transport_metadata = "fixture detail"
        return response
    end,
    second = function(message) return result("second", message) end,
    available = function() return {available = true} end,
}
