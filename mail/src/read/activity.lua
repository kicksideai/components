-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local identity = require("identity")
local security = require("security")
local reader = require("message_reader")
local failure = require("failure")
local policy = require("policy")
local time = require("time")
local types = require("types")
local uuid = require("uuid")

local ADMIN = "kickside.mail:mailer"

local function invalid(message: string): error
    return errors.new({kind = errors.INVALID, message = message, retryable = false, details = {code = "invalid_request"}})
end

local function sender_scope(): (string?, error?)
    if security.can("mail.log.admin", ADMIN) then return nil, nil end
    local actor, err = security.actor()
    if err then return nil, err end
    local principal, key_err = identity.principal_of_key(actor:id())
    if key_err then return nil, key_err :: error end
    return identity.actor_key(principal) :: string, nil
end

local function message(row: types.MessageRow, admin: boolean): (types.LogMessage?, error?)
    local content, err = reader.content(row)
    if err then return nil, err end
    local addresses = content.addresses
    local last_error: types.MessageError?
    if row.error_kind then
        local code = row.error_code or "delivery_failed"
        if admin then
            last_error = {kind = row.error_kind, code = code, message = row.error_message :: string,
                provider_detail = row.provider_detail}
        else
            last_error = failure.public(row.error_kind, code)
        end
    end
    return {
        message_id = row.id, status = row.status, created_at = row.created_at, attempts = row.attempts,
        next_attempt_at = row.next_attempt_at, sent_at = row.sent_at, finished_at = row.finished_at,
        sender = row.sender, template = row.template, subject = row.subject, reply_to = row.reply_to,
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, attachments = content.attachments,
        driver_id = admin and row.driver_id or nil, provider_message_id = admin and row.provider_message_id or nil,
        last_error = last_error,
        origin = reader.origin(row), resend_of = row.resend_of,
        can_resend = row.status == "failed" and row.has_failed_content == 1,
    }, nil
end

local function get_message(message_id: string): (types.LogMessage?, error?)
    local sender, err = sender_scope()
    if err then return nil, err end
    if type(message_id) ~= "string" or not uuid.validate(message_id) then
        return nil, invalid("A message ID is required")
    end
    local row, read_err = database.with_db(function(ex: types.Executor): (types.MessageRow?, error?)
        return reader.get(ex, message_id, sender)
    end)
    if read_err then return nil, read_err end
    return message(row :: types.MessageRow, sender == nil)
end

local function list_messages(input: types.ListRequest): (types.ListResult?, error?)
    if type(input) ~= "table" or type(input.limit) ~= "number" or input.limit % 1 ~= 0
        or input.limit < 1 or input.limit > 200 then
        return nil, invalid("Limit must be an integer from 1 to 200")
    end
    if input.status ~= nil and input.status ~= "queued" and input.status ~= "sent" and input.status ~= "failed" then
        return nil, invalid("Status must be queued, sent or failed")
    end
    if input.template ~= nil and (type(input.template) ~= "string" or not input.template:find("%S")) then
        return nil, invalid("A message name must be nonempty")
    end
    if input.since ~= nil and (type(input.since) ~= "number" or input.since % 1 ~= 0
        or input.since < 0 or input.since > 9007199254740991) then
        return nil, invalid("Since must be a nonnegative Unix timestamp in milliseconds")
    end
    if input.q ~= nil then
        local length = type(input.q) == "string" and utf8.len(input.q)
        if not length or length > 256 or input.q:find("%z") then
            return nil, invalid("Search must be UTF-8 text of up to 256 characters")
        end
    end
    local cursor_time: integer?
    local cursor_id: string?
    if input.cursor ~= nil then
        if type(input.cursor) ~= "string" then return nil, invalid("Invalid delivery log cursor") end
        local timestamp, id = input.cursor:match("^(%d+):([%w%-]+)$")
        cursor_time = timestamp and math.tointeger(tonumber(timestamp))
        if not cursor_time or cursor_time > 9007199254740991 or not id or not uuid.validate(id) then
            return nil, invalid("Invalid delivery log cursor")
        end
        cursor_id = id
    end
    local sender, err = sender_scope()
    if err then return nil, err end
    local now = time.now():unix_nano() // 1000000
    local day_start = (now // policy.DAY_MS) * policy.DAY_MS
    local query: types.ListQuery = {status = input.status, template = input.template, since = input.since,
        q = input.q, limit = input.limit, before_time = cursor_time, before_id = cursor_id,
        day_start = day_start, next_day = day_start + policy.DAY_MS}
    local found, read_err = database.with_db(function(ex: types.Executor, dialect: string): (types.MessagePage?, error?)
        return reader.page(ex, dialect, query, sender)
    end)
    if read_err then return nil, read_err end
    local page = found :: types.MessagePage
    local items: {types.LogMessage} = {}
    for index, row in ipairs(page.items) do
        local entry, entry_err = message(row, sender == nil)
        if entry_err then return nil, entry_err end
        items[index] = entry :: types.LogMessage
    end
    local last = items[#items]
    return {items = items, has_more = page.has_more, total = page.total,
        total_is_lower_bound = page.total_is_lower_bound, failed_today = page.failed_today,
        next_cursor = page.has_more and (tostring(last.created_at) .. ":" .. last.message_id) or nil}, nil
end

return {get = get_message, list = list_messages, sender_scope = sender_scope}
