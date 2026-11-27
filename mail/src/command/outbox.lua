-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local jobs = require("jobs")
local notify = require("notify")
local policy = require("policy")
local redact = require("redact")
local repo = require("message_repo")
local time = require("time")
local types = require("types")

local M = {}
local INTERRUPTED = {dead = true, cancelled = true, missing = true, done = true}

function M.check_lease(job_id: string, lease: types.Lease): error?
    local valid, err = jobs.lease_valid(job_id, lease)
    if err then return err end
    if not valid then
        return errors.new({kind = errors.CONFLICT, message = "Mail delivery lease ended",
            retryable = false, details = {code = "lease_lost"}})
    end
    return nil
end

function M.start(id: string, job_id: string, lease: types.Lease, driver_id: string?): (types.MessageRow?, error?)
    local inactive = M.check_lease(job_id, lease)
    if inactive then return nil, inactive end
    return database.with_db(function(ex: database.Executor): (types.MessageRow?, error?)
        local row, err = repo.start(ex, id, job_id, driver_id)
        if err then return nil, err end
        if not row then
            return nil, errors.new({kind = errors.NOT_FOUND, message = "The queued message is unavailable",
                retryable = false, details = {code = "mail_message_unavailable"}})
        end
        return row, nil
    end)
end

local function cause(row: types.MessageRow, err: error, uncertain: boolean): types.MessageError
    local details = err:details() or {}
    local code = details.code
    local content = {subject = row.subject, text = row.text, html = row.html}
    return {kind = err:kind(),
        code = uncertain and "delivery_uncertain"
            or (type(code) == "string" and code:match("^[a-z][a-z0-9_]*$") and code or "delivery_failed"),
        message = uncertain and "Delivery may have been accepted by the mail service"
            or redact.clean_detail(err:message(), content) or "Mail delivery failed",
        provider_detail = redact.clean_detail(details.provider_detail, content)}
end

function M.settle(row: types.MessageRow, lease: types.Lease, delivered: types.TransportResult?, delivery_err: error?,
    safe_to_retry: boolean): (types.JobCompletion?, error?)
    if not delivered and not delivery_err then
        delivery_err = errors.new({kind = errors.INTERNAL, message = "The mail driver returned no delivery result",
            retryable = false, details = {code = "provider_response_invalid"}})
    end
    local now = time.now():unix_nano() // 1000000
    local next_at: integer?
    local failure: types.MessageError?
    local options: types.Record = {}
    if delivery_err then
        failure = cause(row, delivery_err, not safe_to_retry and policy.ambiguous(delivery_err))
        next_at = policy.retry_at(delivery_err, row.attempts, now, safe_to_retry)
        options.record = {status = "failed", error = failure.code}
        if next_at then
            options.rearm = time.unix(next_at // 1000, (next_at % 1000) * 1000000):utc():format("2006-01-02T15:04:05.000Z07:00")
        end
    end
    local completion, commit_err = database.with_tx(function(tx: database.Transaction): (types.JobCompletion?, error?)
        local done, err = jobs.complete_tx(tx, row.job_id, lease, options)
        if err then return nil, err end
        local changed
        if next_at then
            changed, err = repo.rearm(tx, row.id, row.job_id, next_at, next_at + policy.RECHECK_MS, failure :: types.MessageError)
        else
            changed, err = repo.finish(tx, row.id, row.job_id, now, {delivered = delivered, cause = failure})
        end
        if err then return nil, err end
        if not changed then
            return nil, errors.new({kind = errors.CONFLICT, message = "The delivery log changed during settlement",
                retryable = false, details = {code = "delivery_state_changed"}})
        end
        if delivered then
            local _, detach_err = asset_file_repo.detach(tx, row.id)
            if detach_err then return nil, detach_err end
        end
        return done :: types.JobCompletion, nil
    end)
    if commit_err then return nil, commit_err end
    notify.activity()
    if next_at then notify.nudge() end
    return completion, nil
end

function M.interrupt(rows: {types.DueRow}, statuses: {[string]: string}, now: integer): error?
    local changed, err = database.with_tx(function(tx: database.Transaction): (boolean?, error?)
        local interrupted = false
        for _, row in ipairs(rows) do
            if INTERRUPTED[statuses[row.job_id] or "missing"] then
                local finished, finish_err = repo.finish(tx, row.id, row.job_id, now, {cause = {
                    kind = errors.UNAVAILABLE, code = "delivery_interrupted",
                    message = "Delivery was interrupted; the email may have been sent",
                }})
                if finish_err then return nil, finish_err end
                interrupted = interrupted or finished == true
            elseif row.next_check_at <= now then
                local _, recheck_err = repo.recheck(tx, row.id, row.next_check_at, now + policy.RECHECK_MS)
                if recheck_err then return nil, recheck_err end
            end
        end
        return interrupted, nil
    end)
    if err then return err end
    if changed then notify.activity() end
    return nil
end

return M
