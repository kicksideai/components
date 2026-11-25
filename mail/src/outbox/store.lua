-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local jobs = require("jobs")
local policy = require("policy")
local reader = require("message_reader")
local repo = require("message_repo")
local time = require("time")
local types = require("types")
local uuid = require("uuid")

local M = {OWNER_KIND = "mail-message", WORKER = "kickside.mail.outbox:deliver"}

local function result(row: types.KeyRow, content_hash: string): (types.SendResult?, error?)
    if row.content_hash ~= content_hash then
        return nil, errors.new({kind = errors.CONFLICT, message = "This key already identifies a different message",
            retryable = false, details = {code = "idempotency_conflict"}})
    end
    return {message_id = row.id, status = row.status}, nil
end

function M.find_key(sender: string, key: string, content_hash: string): (types.SendResult?, error?)
    return database.with_db(function(ex: types.Executor): (types.SendResult?, error?)
        local row, err = reader.find_key(ex, sender, key)
        if err or not row then return nil, err end
        return result(row, content_hash)
    end)
end

function M.insert(input: types.Admission): (types.AdmissionResult?, error?)
    local id = uuid.v7()
    local now = time.now():unix_nano() // 1000000
    local row: types.MessageInsert = {
        id = id, created_at = now, next_check_at = now + policy.RECHECK_MS,
        sender = input.sender, actor_context = input.actor_context, template = input.template,
        from = input.from, to = input.to, cc = input.cc, bcc = input.bcc, reply_to = input.reply_to,
        subject = input.subject, html = input.html, text = input.text, attachments = input.attachments,
        idempotency_key = input.idempotency_key, content_hash = input.content_hash, origin = input.origin, resend_of = input.resend_of,
    }
    return database.with_tx(function(tx: types.Transaction, dialect: string): (types.AdmissionResult?, error?)
        local stored, err = repo.insert(tx, row)
        if err then return nil, err end
        if not stored.inserted then
            local existing, existing_err = result(stored, row.content_hash :: string)
            if existing_err then return nil, existing_err end
            return {message = existing :: types.SendResult, inserted = false}, nil
        end

        local _, reference_err = asset_file_repo.link(tx, id, input.library_assets)
        if reference_err then return nil, reference_err end
        local job, queue_err = jobs.enqueue_tx(tx, dialect, {
            namespace = "mail", scope = id, key = "deliver",
            owner_locator = {kind = M.OWNER_KIND, id = id}, job_type = M.WORKER,
            immutable_payload = {message_id = id}, max_attempts = 1,
        })
        if queue_err then return nil, queue_err end
        local linked, link_err = repo.set_job(tx, id, job.id :: string)
        if link_err then return nil, link_err end
        if not linked then
            return nil, errors.new({kind = errors.INTERNAL, message = "The queued message could not be linked to its job",
                retryable = false, details = {code = "mail_job_link_missing"}})
        end
        return {message = {message_id = id, status = stored.status}, inserted = true}, nil
    end)
end

function M.start(id: string, job_id: string, driver_id: string?): (types.MessageRow?, error?)
    return database.with_db(function(ex: types.Executor): (types.MessageRow?, error?)
        return repo.start(ex, id, job_id, driver_id)
    end)
end

function M.finish(tx: types.Transaction, id: string, job_id: string, now: integer,
    delivered: types.TransportResult?, cause: types.MessageError?): (boolean?, error?)
    local changed, err = repo.finish(tx, id, job_id, now, {delivered = delivered, cause = cause})
    if err then return nil, err end
    if changed and delivered then
        local _, detach_err = asset_file_repo.detach(tx, id, time.now():unix_nano() // 1000000)
        if detach_err then return nil, detach_err end
    end
    return changed, nil
end

function M.rearm(tx: types.Transaction, row: types.MessageRow, next_at: integer,
    cause: types.MessageError): (boolean?, error?)
    return repo.rearm(tx, row.id, row.job_id, next_at, next_at + policy.RECHECK_MS, cause)
end

function M.content(row: types.MessageRow): (types.Addresses?, {types.AttachmentRef}?, error?)
    local content, err = reader.content(row)
    if err then return nil, nil, err end
    return content.addresses, content.attachments, nil
end

function M.asset_refs(id: string): ({types.AssetRef}?, error?)
    return database.with_db(function(ex: types.Executor): ({types.AssetRef}?, error?)
        return asset_file_repo.refs(ex, id)
    end)
end

return M
