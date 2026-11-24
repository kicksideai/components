-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local jobs = require("jobs")
local json = require("json")
local policy = require("policy")
local sql = require("sql")
local types = require("types")
local uuid = require("uuid")
local asset_store = require("asset_store")

local M = {OWNER_KIND = "mail-message", WORKER = "kickside.mail.outbox:deliver"}

local function result(row: types.MessageRow, content_hash: string): (types.SendResult?, error?)
    if row.content_hash ~= content_hash then
        return nil, errors.new({kind = errors.CONFLICT, message = "This key already identifies a different message",
            retryable = false, details = {code = "idempotency_conflict"}})
    end
    return {message_id = row.id, status = row.status}, nil
end

function M.find_key(sender: string, key: string, content_hash: string): (types.SendResult?, error?)
    return database.read(function(db: sql.DB): (types.SendResult?, error?)
        local rows, err = db:query("SELECT id, status, content_hash FROM mail_message WHERE sender=$1 AND idempotency_key=$2",
            {sender, key})
        if err then return nil, err end
        if not rows[1] then return nil, nil end
        return result(rows[1] :: types.MessageRow, content_hash)
    end)
end

function M.insert(input: types.Admission): (types.AdmissionResult?, error?)
    local id = uuid.v7()
    local now = policy.now()
    local recipients, recipients_err = json.encode({to = input.to, cc = input.cc, bcc = input.bcc})
    if recipients_err then return nil, recipients_err end
    local refs, refs_err = json.encode(input.attachments or {})
    if refs_err then return nil, refs_err end

    return database.transaction(function(tx: sql.Transaction, dialect: string): (types.AdmissionResult?, error?)
        local rows, err = tx:query([[INSERT INTO mail_message (
            id, created_at, status, next_attempt_at, next_check_at, sender, actor_context, template,
            recipients, subject, html, text, from_address, from_name, reply_to, attachments, idempotency_key, content_hash,
            origin_kind, origin_id, origin_label, resend_of
        ) VALUES ($1,$2,'queued',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
        ON CONFLICT (sender, idempotency_key) WHERE idempotency_key IS NOT NULL
        DO UPDATE SET id=mail_message.id RETURNING id,status,content_hash]], {
            id, now, now + policy.RECHECK_MS, input.sender, input.actor_context, input.template or sql.NULL,
            recipients, input.subject, input.html or sql.NULL, input.text or sql.NULL, input.from.address,
            input.from.name or sql.NULL, input.reply_to or sql.NULL, refs, input.idempotency_key or sql.NULL,
            input.content_hash or sql.NULL, input.origin and input.origin.kind or sql.NULL,
            input.origin and input.origin.id or sql.NULL, input.origin and input.origin.label or sql.NULL,
            input.resend_of or sql.NULL,
        })
        if err then return nil, err end
        local stored = rows[1] :: types.MessageRow
        if stored.id ~= id then
            local existing, existing_err = result(stored, input.content_hash :: string)
            if existing_err then return nil, existing_err end
            return {message = existing :: types.SendResult, inserted = false}, nil
        end

        local reference_err = asset_store.link(tx, id, input.library_assets)
        if reference_err then return nil, reference_err end
        local job, queue_err = jobs.enqueue_tx(tx, dialect, {
            namespace = "mail", scope = id, key = "deliver",
            owner_locator = {kind = M.OWNER_KIND, id = id}, job_type = M.WORKER,
            immutable_payload = {message_id = id}, max_attempts = 1,
        })
        if queue_err then return nil, queue_err end
        local _, link_err = tx:execute("UPDATE mail_message SET job_id=$1 WHERE id=$2", {job.id, id})
        if link_err then return nil, link_err end
        return {message = {message_id = id, status = "queued"}, inserted = true}, nil
    end)
end

function M.start(id: string, job_id: string, driver_id: string?): (types.MessageRow?, error?)
    return database.read(function(db: sql.DB): (types.MessageRow?, error?)
        local rows, err = db:query([[UPDATE mail_message SET attempts=attempts+1, driver_id=$1
            WHERE id=$2 AND job_id=$3 AND status='queued' RETURNING *]], {driver_id or sql.NULL, id, job_id})
        if err then return nil, err end
        return rows[1] :: types.MessageRow?, nil
    end)
end

function M.finish(tx: sql.Transaction, id: string, job_id: string, now: integer,
    delivered: types.TransportResult?, cause: types.MessageError?): (boolean?, error?)
    local sent_at = delivered and now or sql.NULL
    local result, err = tx:execute([[UPDATE mail_message SET status=$1, finished_at=$2, sent_at=$3,
        provider_message_id=$4, error_kind=$5, error_code=$6, error_message=$7, provider_detail=$8,
        failed_html=CASE WHEN $1='failed' THEN html END, failed_text=CASE WHEN $1='failed' THEN text END,
        next_attempt_at=NULL, next_check_at=NULL, html=NULL, text=NULL, actor_context=NULL
        WHERE id=$9 AND job_id=$10 AND status='queued']], {
        delivered and "sent" or "failed", now, sent_at,
        delivered and delivered.provider_message_id or sql.NULL, cause and cause.kind or sql.NULL,
        cause and cause.code or sql.NULL, cause and cause.message or sql.NULL,
        cause and cause.provider_detail or sql.NULL, id, job_id,
    })
    if err then return nil, err end
    if result.rows_affected == 1 and delivered then
        local detach_err = asset_store.detach(tx, id)
        if detach_err then return nil, detach_err end
    end
    return result.rows_affected == 1, nil
end

function M.rearm(tx: sql.Transaction, row: types.MessageRow, next_at: integer, cause: types.MessageError): (boolean?, error?)
    local result, err = tx:execute([[UPDATE mail_message SET next_attempt_at=$1, next_check_at=$2,
        error_kind=$3, error_code=$4, error_message=$5, provider_detail=$6 WHERE id=$7 AND job_id=$8 AND status='queued']],
        {next_at, next_at + policy.RECHECK_MS, cause.kind, cause.code, cause.message, cause.provider_detail or sql.NULL, row.id, row.job_id})
    if err then return nil, err end
    return result.rows_affected == 1, nil
end

function M.origin(row: types.MessageRow): types.Origin?
    if not row.origin_kind then return nil end
    return {kind = row.origin_kind, id = row.origin_id :: string, label = row.origin_label :: string}
end

function M.recent_senders(template: string, since: integer): ({types.RecentSender}?, error?)
    return database.read(function(db: sql.DB): ({types.RecentSender}?, error?)
        local rows, err = db:query([[SELECT sender,origin_kind,origin_id,origin_label,COUNT(*) AS count
            FROM mail_message WHERE template=$1 AND created_at>=$2 AND status='sent'
            GROUP BY sender,origin_kind,origin_id,origin_label
            ORDER BY count DESC,sender,origin_kind,origin_id,origin_label]], {template, since})
        if err then return nil, err end
        local senders: {types.RecentSender} = {}
        for i, row in ipairs(rows) do
            senders[i] = {sender = row.sender :: string, origin = M.origin(row :: types.MessageRow), count = row.count :: integer}
        end
        return senders, nil
    end)
end

function M.recent_sender_counts(templates: {string}, since: integer): ({[string]: integer}?, error?)
    return database.read(function(db: sql.DB): ({[string]: integer}?, error?)
        local args: {unknown} = {since}
        local placeholders = {}
        for i, name in ipairs(templates) do
            args[i + 1] = name
            placeholders[i] = "$" .. (i + 1)
        end
        local rows, err = db:query([[SELECT template,COUNT(*) AS count FROM (
            SELECT template,sender,origin_kind,origin_id,origin_label FROM mail_message
            WHERE created_at>=$1 AND status='sent' AND template IN (]] .. table.concat(placeholders, ",") .. [[)
            GROUP BY template,sender,origin_kind,origin_id,origin_label
        ) AS sources GROUP BY template]], args)
        if err then return nil, err end
        local counts: {[string]: integer} = {}
        for _, row in ipairs(rows) do counts[row.template :: string] = row.count :: integer end
        return counts, nil
    end)
end

function M.content(row: types.MessageRow): (types.Addresses?, {types.AttachmentRef}?, error?)
    local addresses, addr_err = json.decode(row.recipients)
    if addr_err then return nil, nil, addr_err end
    local attachments, refs_err = json.decode(row.attachments)
    if refs_err then return nil, nil, refs_err end
    return addresses :: types.Addresses, attachments :: {types.AttachmentRef}, nil
end

M.asset_refs = asset_store.refs

return M
