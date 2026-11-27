-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local database = require("database")
local types = require("types")

local COLUMNS = [[id, status, created_at, attempts, next_attempt_at, sent_at, finished_at, sender,
    template, recipients, subject, reply_to, attachments, driver_id, provider_message_id,
    error_kind, error_code, error_message, provider_detail, origin_kind, origin_id, origin_label, resend_of,
    CASE WHEN failed_html IS NOT NULL OR failed_text IS NOT NULL THEN 1 ELSE 0 END AS has_failed_content]]
local RESEND_COLUMNS = "id,status,template,subject,recipients,reply_to,attachments,failed_html,failed_text"
local SUMMARY_WINDOW = 10000
local M = {}

function M.find_key(ex: database.Executor, scope: string, key: string): (types.KeyRow?, error?)
    local rows, err = ex:query("SELECT id, status, content_hash FROM mail_message WHERE idempotency_scope=$1 AND idempotency_key=$2",
        {scope, key})
    if err then return nil, err end
    return rows[1] :: types.KeyRow?, nil
end

function M.find_delivery(ex: database.Executor, scope: string, key: string): (types.DeliveryReceipt?, error?)
    local rows, err = ex:query([[SELECT message.id, message.status, message.idempotency_key AS message_key,
        message.content_hash, receipt.content_hash AS delivery_hash
        FROM mail_automation_receipt receipt JOIN mail_message message ON message.id=receipt.message_id
        WHERE receipt.scope=$1 AND receipt.delivery_key=$2]], {scope, key})
    if err then return nil, err end
    return rows[1] :: types.DeliveryReceipt?, nil
end

local function read_message(ex: database.Executor, id: string, sender: string?, columns: string): (types.MessageRow?, error?)
    local query = "SELECT " .. columns .. " FROM mail_message WHERE id=$1"
    local params = {id}
    if sender then
        query = query .. " AND sender=$2"
        params[2] = sender
    end
    local rows, err = ex:query(query, params)
    if err then return nil, err end
    if not rows[1] then
        return nil, errors.new({kind = errors.NOT_FOUND, message = "Mail message not found",
            retryable = false, details = {code = "message_not_found"}})
    end
    return rows[1] :: types.MessageRow, nil
end

function M.get(ex: database.Executor, id: string, sender: string?): (types.MessageRow?, error?)
    return read_message(ex, id, sender, COLUMNS)
end

function M.for_resend(ex: database.Executor, id: string, sender: string?): (types.MessageRow?, error?)
    return read_message(ex, id, sender, RESEND_COLUMNS)
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

function M.page(ex: database.Executor, dialect: string, query: types.ListQuery, sender: string?): (types.MessagePage?, error?)
    local args: {unknown} = {}
    local filters: {string} = {}
    local function bind(value: unknown): string
        args[#args + 1] = value
        return "$" .. tostring(#args)
    end
    local owner = sender and ("sender=" .. bind(sender)) or nil
    if owner then filters[#filters + 1] = owner end
    if query.template then filters[#filters + 1] = "template=" .. bind(query.template) end
    if query.status then filters[#filters + 1] = "status=" .. bind(query.status) end
    if query.since then filters[#filters + 1] = "created_at>=" .. bind(query.since) end
    local scope = where(filters)
    local order = " ORDER BY created_at DESC,id DESC"
    local bound = " LIMIT " .. tostring(SUMMARY_WINDOW)
    local search_cte = ""
    local summary = "SELECT COUNT(*) AS total,0 AS search_limited FROM (SELECT id FROM mail_message"
        .. scope .. " LIMIT " .. tostring(SUMMARY_WINDOW + 1) .. ") AS counted"
    local page_source = "mail_message"
    if query.q and query.q ~= "" then
        local search = search_clause(dialect, bind(query.q:lower()))
        search_cte = "search_window AS MATERIALIZED (SELECT id,created_at,subject,recipients FROM mail_message"
            .. scope .. order .. bound .. "), matches AS MATERIALIZED (SELECT id,created_at FROM search_window WHERE "
            .. search .. "), "
        summary = "SELECT COUNT(*) AS total, (SELECT COUNT(*) FROM search_window) AS search_limited FROM matches"
        filters = {}
        page_source = "matches"
    end
    local failures = "SELECT COUNT(*) AS failed_today FROM mail_message WHERE status='failed' AND finished_at>="
        .. bind(query.day_start) .. " AND finished_at<" .. bind(query.next_day)
    if owner then failures = failures .. " AND " .. owner end
    if query.before_time then
        filters[#filters + 1] = "(created_at,id)<(" .. bind(query.before_time) .. "," .. bind(query.before_id) .. ")"
    end
    local page_ids = "SELECT id FROM " .. page_source .. where(filters) .. order .. " LIMIT " .. bind(query.limit + 1)
    local page = "SELECT " .. COLUMNS .. " FROM mail_message WHERE id IN (" .. page_ids .. ")"
    local statement = "WITH " .. search_cte .. "summary AS (" .. summary .. "), failures AS (" .. failures
        .. "), page AS (" .. page .. ") SELECT page.*,total,search_limited,failed_today FROM summary "
        .. "CROSS JOIN failures LEFT JOIN page ON 1=1 ORDER BY page.created_at DESC,page.id DESC"
    local rows, read_err = ex:query(statement, args)
    if read_err then return nil, read_err end
    local size = rows[1].id and #rows or 0
    local items: {types.MessageRow} = {}
    for index = 1, math.min(query.limit, size) do
        items[index] = rows[index] :: types.MessageRow
    end
    local total = rows[1].total :: integer
    local lower_bound = total > SUMMARY_WINDOW or (rows[1].search_limited :: integer) >= SUMMARY_WINDOW
    return {items = items, has_more = size > query.limit, total = math.min(total, SUMMARY_WINDOW),
        total_is_lower_bound = lower_bound or nil, failed_today = rows[1].failed_today :: integer}, nil
end

function M.origin(row: types.MessageRow): types.Origin?
    if not row.origin_kind then return nil end
    return {kind = row.origin_kind, id = row.origin_id :: string, label = row.origin_label :: string}
end

function M.recent_senders(ex: database.Executor, template: string, since: integer, limit: integer): ({types.RecentSender}?, error?)
    local rows, err = ex:query([[WITH sources AS (
        SELECT sender,origin_kind,origin_id,origin_label,COUNT(*) AS count,
            COALESCE(origin_kind,'') AS kind_key,COALESCE(origin_id,'') AS id_key,COALESCE(origin_label,'') AS label_key
        FROM mail_message WHERE template=$1 AND created_at>=$2 AND status='sent'
        GROUP BY sender,origin_kind,origin_id,origin_label
    ) SELECT sender,origin_kind,origin_id,origin_label,count FROM sources
        ORDER BY count DESC,sender,kind_key,id_key,label_key LIMIT $3]], {template, since, limit})
    if err then return nil, err end

    local items: {types.RecentSender} = {}
    for index, row in ipairs(rows) do
        items[index] = {sender = row.sender :: string, origin = M.origin(row :: types.MessageRow), count = row.count :: integer}
    end
    return items, nil
end

function M.recent_sender_counts(ex: database.Executor, templates: {string}, since: integer): ({[string]: integer}?, error?)
    if #templates == 0 then return {}, nil end
    local args: {unknown} = {since}
    local placeholders = {}
    for i, name in ipairs(templates) do
        args[i + 1] = name
        placeholders[i] = "$" .. (i + 1)
    end
    local rows, err = ex:query([[SELECT template,COUNT(*) AS count FROM (
        SELECT template,sender,origin_kind,origin_id,origin_label FROM mail_message
        WHERE created_at>=$1 AND status='sent' AND template IN (]] .. table.concat(placeholders, ",") .. [[)
        GROUP BY template,sender,origin_kind,origin_id,origin_label
    ) AS sources GROUP BY template]], args)
    if err then return nil, err end
    local counts: {[string]: integer} = {}
    for _, row in ipairs(rows) do counts[row.template :: string] = row.count :: integer end
    return counts, nil
end

function M.content(row: types.MessageRow): (types.MessageContent?, error?)
    local addresses, addr_err = json.decode(row.recipients)
    if addr_err then return nil, addr_err end
    local attachments, refs_err = json.decode(row.attachments)
    if refs_err then return nil, refs_err end
    return {addresses = addresses :: types.Addresses, attachments = attachments :: {types.AttachmentRef}}, nil
end

return M
