-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local delivery = require("delivery")
local drivers = require("drivers")
local identity = require("identity")
local jobs = require("jobs")
local lease_release = require("lease_release")
local logger = require("logger")
local message = require("message")
local policy = require("policy")
local settings = require("settings")
local sql = require("sql")
local store = require("store")
local time = require("time")
local types = require("types")

local function active_driver(): (types.Driver?, error?)
    local config, err = settings.read("kickside.mail")
    if err then return nil, err end
    local mail_settings = config :: types.Settings
    return drivers.resolve(mail_settings.driver)
end

local function check_lease(job_id: string, lease: types.Lease): error?
    local valid, err = jobs.lease_valid(job_id, lease)
    if err then return err end
    if not valid then
        return errors.new({kind = errors.CONFLICT, message = "Mail delivery lease ended", retryable = false,
            details = {code = "lease_lost"}})
    end
    return nil
end

local function send(row: types.MessageRow, driver: types.Driver, lease: types.Lease): (types.TransportResult?, error?)
    local addresses, refs, decode_err = store.content(row)
    if decode_err then return nil, decode_err end
    local limit_err = message.recipients_error(addresses, driver.max_recipients)
    if limit_err then return nil, limit_err end
    local execution, identity_err = identity.from_row(row.sender, row.actor_context)
    if identity_err then return nil, identity_err :: error end
    local request: types.TransportRequest = {
        from = {address = row.from_address, name = row.from_name},
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = row.reply_to,
        subject = row.subject, html = row.html, text = row.text, idempotency_key = row.id,
    }
    local files, read_err = identity.run_as(execution, "kickside.mail.outbox:read_attachments", {
        refs = refs, message_bytes = message.delivery_size(request), max_message_bytes = driver.max_message_bytes,
    }, {deferred_owner = store.WORKER})
    if read_err then return nil, read_err :: error end
    local transport, open_err = drivers.transport(driver)
    if open_err then return nil, open_err end
    local inactive = check_lease(row.job_id, lease)
    if inactive then return nil, inactive end
    request.attachments = files :: {types.Attachment}
    return (transport :: types.Transport):send(request)
end

local function deliver(input: types.JobInput): (types.Record?, error?)
    local job = input.job
    local lease = {token = job.lease_token, execution_seq = job.execution_seq}
    local lease_err = check_lease(job.id, lease)
    if lease_err then return nil, lease_err end
    local driver, delivery_err = active_driver()
    local row, row_err = store.start(input.payload.message_id, job.id, driver and driver.id)
    if row_err then return nil, row_err end
    if not row then
        return nil, errors.new({kind = errors.NOT_FOUND, message = "The queued message is unavailable", retryable = false})
    end
    local delivered: types.TransportResult?
    if driver then delivered, delivery_err = send(row, driver, lease) end
    if not delivered and not delivery_err then
        delivery_err = errors.new({kind = errors.INTERNAL, message = "The mail driver returned no delivery result",
            retryable = false, details = {code = "provider_response_invalid"}})
    end
    local now = policy.now()
    local next_at: integer?
    local cause: types.MessageError?
    local options: types.Record = {}
    if delivery_err then
        local details = delivery_err:details()
        local code = details and details.code
        cause = {kind = delivery_err:kind(), code = type(code) == "string" and code or "delivery_failed",
            message = delivery_err:message(), provider_detail = delivery.clean_detail(details and details.provider_detail)}
        next_at = policy.retry_at(delivery_err, row.attempts, now)
        options.record = {status = "failed", error = cause.message}
        if next_at then
            options.rearm = time.unix(next_at // 1000, (next_at % 1000) * 1000000):utc():format("2006-01-02T15:04:05.000Z07:00")
        end
    end
    local completion, commit_err = database.transaction(function(tx: sql.Transaction, _dialect: string): (types.Record?, error?)
        local done, err = jobs.complete_tx(tx, job.id, lease, options)
        if err then return nil, err end
        local changed
        if next_at then
            changed, err = store.rearm(tx, row, next_at, cause :: types.MessageError)
        else
            changed, err = store.finish(tx, row.id, row.job_id, now, delivered, cause)
        end
        if err then return nil, err end
        if not changed then
            return nil, errors.new({kind = errors.CONFLICT, message = "The delivery log changed during settlement",
                retryable = false, details = {code = "delivery_state_changed"}})
        end
        return done :: types.Record, nil
    end)
    if commit_err then return nil, commit_err end
    local release_err = lease_release.notify(job.id, job.execution_seq, completion.owner_locator :: table)
    if release_err then logger:error("Mail lease release notification failed", {error = tostring(release_err)}) end
    if next_at then
        local _, nudge_err = jobs.nudge_workers()
        if nudge_err then logger:error("Mail job notification failed", {error = tostring(nudge_err)}) end
    end
    return {self_completed = true, completion = completion}, nil
end

return {deliver = deliver}
