-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local identity = require("identity")
local security = require("security")
local sql = require("sql")
local store = require("store")
local types = require("types")
local uuid = require("uuid")

local COLUMNS = [[id, status, created_at, attempts, next_attempt_at, sent_at, finished_at, sender,
    template, recipients, subject, reply_to, attachments, driver_id, provider_message_id,
    error_kind, error_code, error_message]]
local ADMIN = "kickside.mail:mailer"

local function invalid(message: string): error
    return errors.new({kind = errors.INVALID, message = message, retryable = false, details = {code = "invalid_request"}})
end

local function viewer(): (string?, error?)
    if security.can("mail.log.admin", ADMIN) then return nil, nil end
    local actor, err = security.actor()
    if err then return nil, err end
    local principal, key_err = identity.principal_of_key(actor:id())
    if key_err then return nil, key_err :: error end
    return identity.actor_key(principal) :: string, nil
end

local function message(row: types.MessageRow, admin: boolean): (types.LogMessage?, error?)
    local addresses, refs, err = store.content(row)
    if err then return nil, err end
    local last_error: types.MessageError?
    if row.error_kind then
        last_error = {kind = row.error_kind, code = row.error_code :: string, message = row.error_message :: string}
    end
    return {
        message_id = row.id, status = row.status, created_at = row.created_at, attempts = row.attempts,
        next_attempt_at = row.next_attempt_at, sent_at = row.sent_at, finished_at = row.finished_at,
        sender = row.sender, template = row.template, subject = row.subject, reply_to = row.reply_to,
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, attachments = refs,
        driver_id = admin and row.driver_id or nil, provider_message_id = admin and row.provider_message_id or nil,
        last_error = last_error,
    }, nil
end

local function get_message(message_id: string): (types.LogMessage?, error?)
    if type(message_id) ~= "string" or not uuid.validate(message_id) then
        return nil, invalid("A message ID is required")
    end
    local sender, err = viewer()
    if err then return nil, err end
    return database.read(function(db: sql.DB): (types.LogMessage?, error?)
        local query = "SELECT " .. COLUMNS .. " FROM mail_message WHERE id=$1"
        local params = {message_id}
        if sender then query = query .. " AND sender=$2"; params[2] = sender end
        local rows, read_err = db:query(query, params)
        if read_err then return nil, read_err end
        if not rows[1] then
            return nil, errors.new({kind = errors.NOT_FOUND, message = "Mail message not found",
                retryable = false, details = {code = "message_not_found"}})
        end
        return message(rows[1] :: types.MessageRow, sender == nil)
    end)
end

local function list_messages(input: types.ListRequest): (types.ListResult?, error?)
    if type(input) ~= "table" or type(input.limit) ~= "number" or input.limit % 1 ~= 0
        or input.limit < 1 or input.limit > 200 then
        return nil, invalid("Limit must be an integer from 1 to 200")
    end
    if input.status ~= nil and input.status ~= "queued" and input.status ~= "sent" and input.status ~= "failed" then
        return nil, invalid("Status must be queued, sent or failed")
    end
    if input.since ~= nil and (type(input.since) ~= "number" or input.since % 1 ~= 0
        or input.since < 0 or input.since > 9007199254740991) then
        return nil, invalid("Since must be a nonnegative Unix timestamp in milliseconds")
    end
    local cursor_time, cursor_id
    if input.cursor ~= nil then
        if type(input.cursor) ~= "string" then return nil, invalid("Invalid delivery log cursor") end
        cursor_time, cursor_id = input.cursor:match("^(%d+):([%w%-]+)$")
        cursor_time = cursor_time and math.tointeger(tonumber(cursor_time))
        if not cursor_time or cursor_time > 9007199254740991 or not uuid.validate(cursor_id) then
            return nil, invalid("Invalid delivery log cursor")
        end
    end
    local sender, err = viewer()
    if err then return nil, err end
    local args: {unknown} = {}
    local filters = {}
    local function bind(value: unknown): string
        args[#args + 1] = value
        return "$" .. tostring(#args)
    end
    if sender then filters[#filters + 1] = "sender=" .. bind(sender) end
    if input.status then filters[#filters + 1] = "status=" .. bind(input.status) end
    if input.since then filters[#filters + 1] = "created_at>=" .. bind(input.since) end
    if cursor_time then
        filters[#filters + 1] = "(created_at,id)<(" .. bind(cursor_time) .. "," .. bind(cursor_id) .. ")"
    end
    local where = #filters > 0 and " WHERE " .. table.concat(filters, " AND ") or ""
    local query = "SELECT " .. COLUMNS .. " FROM mail_message" .. where
        .. " ORDER BY created_at DESC, id DESC LIMIT " .. bind(input.limit + 1)
    return database.read(function(db: sql.DB): (types.ListResult?, error?)
        local rows, read_err = db:query(query, args)
        if read_err then return nil, read_err end
        local items: {types.LogMessage} = {}
        for index = 1, math.min(input.limit, #rows) do
            local entry, entry_err = message(rows[index] :: types.MessageRow, sender == nil)
            if entry_err then return nil, entry_err end
            items[index] = entry :: types.LogMessage
        end
        local more = #rows > input.limit
        local last = items[#items]
        return {items = items, has_more = more,
            next_cursor = more and (tostring(last.created_at) .. ":" .. last.message_id) or nil}, nil
    end)
end

return {get_message = get_message, list_messages = list_messages}
