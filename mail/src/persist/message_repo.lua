-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local sql = require("sql")
local database = require("database")
local types = require("types")

local M = {}

function M.insert(tx: sql.Transaction, row: types.MessageInsert): (types.InsertOutcome?, error?)
    local recipients, recipients_err = json.encode({to = row.to, cc = row.cc, bcc = row.bcc})
    if recipients_err then return nil, recipients_err end
    local refs, refs_err = json.encode(row.attachments or {})
    if refs_err then return nil, refs_err end

    local rows, err = tx:query([[INSERT INTO mail_message (
        id, created_at, status, next_attempt_at, next_check_at, sender, actor_context, template,
        recipients, subject, html, text, from_address, from_name, reply_to, attachments, idempotency_key, content_hash,
        origin_kind, origin_id, origin_label, resend_of, idempotency_scope
    ) VALUES ($1,$2,'queued',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    ON CONFLICT (idempotency_scope, idempotency_key) WHERE idempotency_key IS NOT NULL
    DO UPDATE SET id=mail_message.id RETURNING id,status,content_hash]], {
        row.id, row.created_at, row.next_check_at, row.sender, row.actor_context, row.template or sql.NULL,
        recipients, row.subject, row.html or sql.NULL, row.text or sql.NULL, row.from.address,
        row.from.name or sql.NULL, row.reply_to or sql.NULL, refs, row.idempotency_key or sql.NULL,
        row.content_hash or sql.NULL, row.origin and row.origin.kind or sql.NULL,
        row.origin and row.origin.id or sql.NULL, row.origin and row.origin.label or sql.NULL, row.resend_of or sql.NULL,
        row.idempotency_scope or sql.NULL,
    })
    if err then return nil, err end
    local stored = rows[1] :: types.KeyRow
    return {id = stored.id, status = stored.status, content_hash = stored.content_hash, inserted = stored.id == row.id}, nil
end

function M.set_job(tx: sql.Transaction, id: string, job_id: string): (boolean?, error?)
    local result, err = tx:execute("UPDATE mail_message SET job_id=$1 WHERE id=$2", {job_id, id})
    if err then return nil, err end
    return result.rows_affected == 1, nil
end

function M.start(ex: database.Executor, id: string, job_id: string, binding_id: string?): (types.MessageRow?, error?)
    local rows, err = ex:query([[UPDATE mail_message SET attempts=attempts+1, driver_id=COALESCE(driver_id,$1)
        WHERE id=$2 AND job_id=$3 AND status='queued' RETURNING *]], {binding_id or sql.NULL, id, job_id})
    if err then return nil, err end
    return rows[1] :: types.MessageRow?, nil
end

function M.finish(tx: sql.Transaction, id: string, job_id: string, now: integer, outcome: types.Outcome): (boolean?, error?)
    local delivered, cause = outcome.delivered, outcome.cause
    local result, err = tx:execute([[UPDATE mail_message SET status=$1, finished_at=$2, sent_at=$3,
        provider_message_id=$4, error_kind=$5, error_code=$6, error_message=$7, provider_detail=$8,
        failed_html=CASE WHEN $1='failed' THEN html END, failed_text=CASE WHEN $1='failed' THEN text END,
        next_attempt_at=NULL, next_check_at=NULL, html=NULL, text=NULL, actor_context=NULL
        WHERE id=$9 AND job_id=$10 AND status='queued']], {
        delivered and "sent" or "failed", now, delivered and now or sql.NULL,
        delivered and delivered.provider_message_id or sql.NULL, cause and cause.kind or sql.NULL,
        cause and cause.code or sql.NULL, cause and cause.message or sql.NULL,
        cause and cause.provider_detail or sql.NULL, id, job_id,
    })
    if err then return nil, err end
    return result.rows_affected == 1, nil
end

function M.rearm(tx: sql.Transaction, id: string, job_id: string, next_at: integer, recheck_at: integer,
    cause: types.MessageError): (boolean?, error?)
    local result, err = tx:execute([[UPDATE mail_message SET next_attempt_at=$1, next_check_at=$2,
        error_kind=$3, error_code=$4, error_message=$5, provider_detail=$6 WHERE id=$7 AND job_id=$8 AND status='queued']],
        {next_at, recheck_at, cause.kind, cause.code, cause.message, cause.provider_detail or sql.NULL, id, job_id})
    if err then return nil, err end
    return result.rows_affected == 1, nil
end

function M.recheck(tx: sql.Transaction, id: string, previous_check_at: integer, next_check_at: integer): (boolean?, error?)
    local result, err = tx:execute([[UPDATE mail_message SET next_check_at=$1
        WHERE id=$2 AND status='queued' AND next_check_at=$3]], {next_check_at, id, previous_check_at})
    if err then return nil, err end
    return result.rows_affected == 1, nil
end

function M.due_checks(ex: database.Executor, now: integer, limit: integer): ({types.DueRow}?, error?)
    local rows, err = ex:query([[SELECT id, job_id, next_check_at FROM mail_message
        WHERE status='queued' AND next_check_at<=$1 ORDER BY next_check_at,id LIMIT $2]], {now, limit})
    return rows :: {types.DueRow}?, err
end

function M.hinted(ex: database.Executor, id: string, job_id: string, now: integer): (types.DueRow?, error?)
    local rows, err = ex:query([[SELECT id, job_id, next_check_at FROM mail_message
        WHERE id=$1 AND job_id=$2 AND status='queued' AND next_check_at>$3]], {id, job_id, now})
    if err then return nil, err end
    return rows[1] :: types.DueRow?, nil
end

function M.prune_finished(tx: sql.Transaction, cutoff: integer, limit: integer): (integer?, error?)
    local result, err = tx:execute([[DELETE FROM mail_message WHERE id IN (
        SELECT id FROM mail_message WHERE finished_at <= $1
            AND NOT EXISTS (SELECT 1 FROM mail_message_asset WHERE message_id=mail_message.id)
        ORDER BY finished_at,id LIMIT $2
    )]], {cutoff, limit})
    if err then return nil, err end
    return result.rows_affected, nil
end

function M.next_deadlines(ex: database.Executor): (types.Deadlines?, error?)
    local rows, err = ex:query([[SELECT
        (SELECT next_check_at FROM mail_message WHERE status='queued' ORDER BY next_check_at,id LIMIT 1) AS check_at,
        (SELECT finished_at FROM mail_message WHERE finished_at IS NOT NULL ORDER BY finished_at,id LIMIT 1) AS finished_at]])
    if err then return nil, err end
    return rows[1] :: types.Deadlines, nil
end

return M
