-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local content = require("content")
local delivery = require("delivery")
local transports = require("transports")
local config = require("config")
local identity = require("identity")
local message = require("message")
local outbox = require("outbox")
local settings = require("settings")
local types = require("types")

local function prepare(row: types.MessageRow, driver: types.TransportStatus, deadline: string): (types.TransportRequest?, error?)
    local stored, err = delivery.content(row)
    if err then return nil, err end
    local payload = stored :: types.DeliveryContent
    local addresses = payload.addresses
    local limit_err = message.recipients_error(addresses, driver.max_recipients)
    if limit_err then return nil, limit_err end
    local execution, identity_err = identity.from_row(row.sender, row.actor_context)
    if identity_err then return nil, identity_err :: error end
    local request: types.TransportRequest = {
        from = {address = row.from_address, name = row.from_name},
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = row.reply_to,
        subject = row.subject, html = row.html, text = row.text, idempotency_key = row.id, deadline = deadline,
    }
    local size = message.delivery_size(request)
    local files, read_err = identity.run_as(execution, "kickside.mail.delivery:read_attachments", {
        refs = payload.attachments, message_bytes = size, max_message_bytes = driver.max_message_bytes,
    }, {deferred_owner = "kickside.mail.delivery:deliver"})
    if read_err then return nil, read_err :: error end
    request.attachments = files :: {types.Attachment}
    if payload.assets and #payload.assets > 0 then
        local completed, assets_err = content.attachments({library_assets = payload.assets, message_bytes = size,
            max_message_bytes = driver.max_message_bytes}, true, nil, files :: {types.Attachment})
        if assets_err then return nil, assets_err end
        request.attachments = completed
    end
    return request :: types.TransportRequest?, nil
end

local function send(row: types.MessageRow, driver: types.TransportStatus, transport: types.Transport, lease: types.Lease, deadline: string):
    (types.TransportResult?, error?, boolean)
    local ready_err = config.transport_ready_error(driver)
    if ready_err then return nil, ready_err, true end
    local request, prepare_err = prepare(row, driver, deadline)
    if prepare_err then return nil, prepare_err, true end
    local inactive = outbox.check_lease(row.job_id, lease)
    if inactive then return nil, inactive, true end
    local delivered, err = transport:send(request :: types.TransportRequest)
    return delivered, err, driver.idempotent
end

local function run(input: types.JobInput): (types.Record?, error?)
    local job = input.job
    local lease = {token = job.lease_token, execution_seq = job.execution_seq}
    local selection, settings_err = settings.driver()
    local active_driver = selection and selection.id
    local row, row_err = outbox.start(input.payload.message_id, job.id, lease,
        active_driver ~= "" and active_driver or nil)
    if row_err then return nil, row_err end
    local delivered: types.TransportResult?
    local delivery_err: error?
    local safe_to_retry = true
    if row.driver_id or not settings_err then
        local driver, transport
        driver, delivery_err, transport = transports.status(row.driver_id)
        if driver then
            delivered, delivery_err, safe_to_retry = send(row, driver, transport :: types.Transport, lease, job.deadline)
        end
    else
        delivery_err = settings_err
    end
    local completion, err = outbox.settle(row, lease, delivered, delivery_err, safe_to_retry)
    if err then return nil, err end
    return {self_completed = true, completion = completion}, nil
end

return {run = run}
