-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local identity = require("identity")
local security = require("security")
local sql = require("sql")
local store = require("store")
local failure = require("failure")
local policy = require("policy")
local types = require("types")
local uuid = require("uuid")

local COLUMNS = [[id, status, created_at, attempts, next_attempt_at, sent_at, finished_at, sender,
    template, recipients, subject, reply_to, attachments, driver_id, provider_message_id,
    error_kind, error_code, error_message, provider_detail, origin_kind, origin_id, origin_label, resend_of,
    CASE WHEN failed_html IS NOT NULL OR failed_text IS NOT NULL THEN 1 ELSE 0 END AS has_failed_content]]
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
        last_error = {kind = row.error_kind, code = row.error_code :: string, message = admin and row.error_message :: string or failure.text(row.error_code :: string),
            provider_detail = admin and row.provider_detail or nil}
    end
    return {
        message_id = row.id, status = row.status, created_at = row.created_at, attempts = row.attempts,
        next_attempt_at = row.next_attempt_at, sent_at = row.sent_at, finished_at = row.finished_at,
        sender = row.sender, template = row.template, subject = row.subject, reply_to = row.reply_to,
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, attachments = refs,
        driver_id = admin and row.driver_id or nil, provider_message_id = admin and row.provider_message_id or nil,
        last_error = last_error,
        origin = store.origin(row), resend_of = row.resend_of,
        can_resend = row.status == "failed" and row.has_failed_content == 1,
    }, nil
end

local function read_message(message_id: string, columns: string, sender: string?): (types.MessageRow?, error?)
    if type(message_id) ~= "string" or not uuid.validate(message_id) then
        return nil, invalid("A message ID is required")
    end
    return database.read(function(db: sql.DB): (types.MessageRow?, error?)
        local query = "SELECT " .. columns .. " FROM mail_message WHERE id=$1"
        local params = {message_id}
        if sender then
            query = query .. " AND sender=$2"
            params[2] = sender
        end
        local rows, read_err = db:query(query, params)
        if read_err then return nil, read_err end
        if not rows[1] then
            return nil, errors.new({kind = errors.NOT_FOUND, message = "Mail message not found",
                retryable = false, details = {code = "message_not_found"}})
        end
        return rows[1] :: types.MessageRow, nil
    end)
end

local function get_message(message_id: string): (types.LogMessage?, error?)
    local sender, err = viewer()
    if err then return nil, err end
    local row, read_err = read_message(message_id, COLUMNS, sender)
    if read_err then return nil, read_err end
    return message(row :: types.MessageRow, sender == nil)
end

local function for_resend(message_id: string): (types.MessageRow?, error?)
    local sender, err = viewer()
    if err then return nil, err end
    local row, read_err = read_message(message_id, "id,status,template,subject,recipients,reply_to,attachments,failed_html,failed_text", sender)
    if read_err then return nil, read_err end
    if row.status ~= "failed" or (not row.failed_html and not row.failed_text) then
        return nil, errors.new({kind = errors.CONFLICT, message = "The message has no failed content to resend",
            retryable = false, details = {code = "mail_content_unavailable"}})
    end
    return row, nil
end

local function search_clause(dialect: string, needle: string): string
    if dialect == "postgres" then
        return "(strpos(lower(subject)," .. needle .. ")>0 OR EXISTS ("
            .. "SELECT 1 FROM jsonb_each(recipients::jsonb) AS kind "
            .. "CROSS JOIN LATERAL jsonb_array_elements_text(kind.value) AS address(value) "
            .. "WHERE strpos(lower(address.value)," .. needle .. ")>0))"
    end
    return "(instr(lower(subject)," .. needle .. ")>0 OR EXISTS ("
        .. "SELECT 1 FROM json_each(recipients) AS kind CROSS JOIN json_each(kind.value) AS address "
        .. "WHERE instr(lower(address.value)," .. needle .. ")>0))"
end

local function where(filters: {string}): string
    return #filters > 0 and " WHERE " .. table.concat(filters, " AND ") or ""
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
    if input.q ~= nil and (type(input.q) ~= "string" or #input.q > 256 or input.q:find("%z")) then
        return nil, invalid("Search must be text of up to 256 bytes")
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
    return database.read(function(db: sql.DB): (types.ListResult?, error?)
        local args: {unknown} = {}
        local filters: {string} = {}
        local function bind(value: unknown): string
            args[#args + 1] = value
            return "$" .. tostring(#args)
        end
        local owner = sender and ("sender=" .. bind(sender)) or nil
        if owner then filters[#filters + 1] = owner end
        if input.template then filters[#filters + 1] = "template=" .. bind(input.template) end
        if input.status then filters[#filters + 1] = "status=" .. bind(input.status) end
        if input.since then filters[#filters + 1] = "created_at>=" .. bind(input.since) end
        if input.q and input.q ~= "" then
            local dialect, dialect_err = db:type()
            if dialect_err then return nil, dialect_err end
            filters[#filters + 1] = search_clause(dialect, bind(input.q:lower()))
        end
        local summary = "SELECT COUNT(*) AS total FROM mail_message" .. where(filters)
        local start = (policy.now() // policy.DAY_MS) * policy.DAY_MS
        local failures = "SELECT COUNT(*) AS failed_today FROM mail_message WHERE status='failed' AND finished_at>="
            .. bind(start) .. " AND finished_at<" .. bind(start + policy.DAY_MS)
        if owner then failures = failures .. " AND " .. owner end
        if cursor_time then
            filters[#filters + 1] = "(created_at,id)<(" .. bind(cursor_time) .. "," .. bind(cursor_id) .. ")"
        end
        local page = "SELECT " .. COLUMNS .. " FROM mail_message" .. where(filters)
            .. " ORDER BY created_at DESC, id DESC LIMIT " .. bind(input.limit + 1)
        local query = "WITH summary AS (" .. summary .. "), failures AS (" .. failures .. "), page AS (" .. page .. ") "
            .. "SELECT page.*,total,failed_today FROM summary CROSS JOIN failures LEFT JOIN page ON 1=1 "
            .. "ORDER BY page.created_at DESC, page.id DESC"
        local rows, read_err = db:query(query, args)
        if read_err then return nil, read_err end
        local size = rows[1].id and #rows or 0
        local items: {types.LogMessage} = {}
        for index = 1, math.min(input.limit, size) do
            local entry, entry_err = message(rows[index] :: types.MessageRow, sender == nil)
            if entry_err then return nil, entry_err end
            items[index] = entry :: types.LogMessage
        end
        local more = size > input.limit
        local last = items[#items]
        return {items = items, has_more = more, total = rows[1].total :: integer, failed_today = rows[1].failed_today :: integer,
            next_cursor = more and (tostring(last.created_at) .. ":" .. last.message_id) or nil}, nil
    end)
end

return {get_message = get_message, list_messages = list_messages, for_resend = for_resend}
