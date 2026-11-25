-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local drivers = require("drivers")
local settings = require("settings")
local config = require("config")
local canonical_json = require("canonical_json")
local identity = require("identity")
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local jobs = require("jobs")
local policy = require("policy")
local reader = require("message_reader")
local repo = require("message_repo")
local time = require("time")
local uuid = require("uuid")
local security = require("security")
local resource = require("resource")
local library = require("library")
local notify = require("notify")
local message = require("message")
local live_preview = require("live_preview")
local attachments = require("attachments")
local recipients = require("recipients")

local function result(row: types.KeyRow, content_hash: string): (types.SendResult?, error?)
    if row.content_hash ~= content_hash then
        return nil, errors.new({kind = errors.CONFLICT, message = "This key already identifies a different message",
            retryable = false, details = {code = "idempotency_conflict"}})
    end
    return {message_id = row.id, status = row.status}, nil
end

local function find_key(sender: string, key: string, content_hash: string): (types.SendResult?, error?)
    return database.with_db(function(ex: types.Executor): (types.SendResult?, error?)
        local row, err = reader.find_key(ex, sender, key)
        if err or not row then return nil, err end
        return result(row, content_hash)
    end)
end

local function insert(input: types.Admission): (types.AdmissionResult?, error?)
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
            owner_locator = {kind = "mail-message", id = id}, job_type = "kickside.mail.delivery:deliver",
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

local function setup_error(issue: error): error
    local details = issue:details() or {}
    if details.code ~= "invalid_config" then return issue end
    return config.setup_error("Mail delivery requires setup. Ask a mail administrator to check the delivery settings.")
end

local function admit(input: types.SendRequest, rendered: types.Rendered?, resend_of: string?): (types.SendResult?, error?)
    local execution, capture_err = identity.capture()
    if capture_err then return nil, capture_err :: error end
    local actor_row, actor_err = identity.to_row(execution)
    if actor_err then return nil, actor_err :: error end
    local actor = actor_row :: types.ActorRow
    local key = input.idempotency_key
    local hash: string?
    if key then
        if input.sink_op then
            local origin = input.origin :: types.Origin
            local digest, key_err = canonical_json.hash({origin.id, input.sink_op, key})
            if key_err then return nil, key_err :: error end
            -- Direct keys cannot contain control characters.
            key = "automation\n" .. (digest :: string)
        end
        local content: types.Record = {}
        for field, value in pairs(input) do
            if field ~= "idempotency_key" and field ~= "origin" and field ~= "sink_op" then content[field] = value end
        end
        local hash_err
        hash, hash_err = canonical_json.hash(content)
        if hash_err then return nil, hash_err :: error end
        local existing, replay_err = find_key(actor.actor_id, key, hash :: string)
        if existing or replay_err then return existing, replay_err end
    end

    local values, settings_err = settings.mail()
    if settings_err then return nil, setup_error(settings_err) end
    local mail_settings = values :: types.Settings
    local found, driver_err = drivers.resolve(mail_settings.driver)
    if driver_err then return nil, setup_error(driver_err) end
    local driver = found :: types.Driver
    if driver.max_recipients then
        local limit_err = message.recipient_bound(input, driver.max_recipients)
        if limit_err then return nil, limit_err end
    end
    local addresses, recipient_err = recipients.resolve(input)
    if recipient_err then return nil, recipient_err end

    local ready_err = drivers.check_available(driver)
    if ready_err then return nil, setup_error(ready_err) end
    local from, from_err = config.sender(mail_settings)
    if from_err then return nil, setup_error(from_err) end
    local reply_to = input.reply_to
    if not reply_to and not resend_of then
        local reply_err
        reply_to, reply_err = config.reply_to(mail_settings)
        if reply_err then return nil, setup_error(reply_err) end
    end

    local render_err
    if not rendered and input.template then
        rendered, render_err = live_preview.template(input.template, input.vars, input.attachments)
        if render_err then return nil, render_err end
    end
    if not rendered then
        rendered, render_err = live_preview.body(input.subject :: string, input.text, input.html, input.attachments)
        if render_err then return nil, render_err end
    end

    local parts = rendered :: types.Rendered
    local body_err = message.body_error(parts.text, parts.html)
    if body_err then return nil, body_err end
    local bytes = message.delivery_size({
        from = from, reply_to = reply_to, to = addresses.to, cc = addresses.cc, bcc = addresses.bcc,
        subject = parts.subject, html = parts.html, text = parts.text,
    })
    local attachment_err = attachments.validate({
        refs = input.attachments, library_assets = parts.library_assets, message_bytes = bytes, max_message_bytes = driver.max_message_bytes,
    })
    if attachment_err then return nil, attachment_err end

    local origin: types.Origin? = input.origin
    if resend_of then
        origin = {kind = "resend", id = actor.actor_id, label = "Resent message"}
    end
    local saved, save_err = insert({
        sender = actor.actor_id, actor_context = actor.actor_context, template = input.template,
        from = from,
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = reply_to,
        subject = parts.subject, html = parts.html, text = parts.text, attachments = input.attachments,
        library_assets = parts.library_assets, idempotency_key = key, content_hash = hash, origin = origin, resend_of = resend_of,
    })
    if save_err then return nil, save_err end
    if saved.inserted then
        notify.activity()
        notify.retention()
        notify.nudge()
    end
    return saved.message, nil
end

local function send(request: unknown): (types.SendResult?, error?)
    local denied = client.require_send()
    if denied then return nil, denied end
    local input, err = message.validate(request)
    if err then return nil, err end
    return admit(input :: types.SendRequest)
end

local function resend(message_id: string): (types.SendResult?, error?)
    local denied = client.require_send()
    if denied then return nil, denied end
    local sender, err = client.log_scope()
    if err then return nil, err end
    if type(message_id) ~= "string" or not uuid.validate(message_id) then
        return nil, errors.new({kind = errors.INVALID, message = "A message ID is required",
            retryable = false, details = {code = "invalid_request"}})
    end
    local saved, read_err = database.with_db(function(ex: types.Executor): (types.ResendSource?, error?)
        local row, row_err = reader.for_resend(ex, message_id, sender)
        if row_err then return nil, row_err end
        if row.status ~= "failed" or (not row.failed_html and not row.failed_text) then
            return nil, errors.new({kind = errors.CONFLICT, message = "The message has no failed content to resend",
                retryable = false, details = {code = "mail_content_unavailable"}})
        end
        local content, decode_err = reader.content(row)
        if decode_err then return nil, decode_err end
        local assets, asset_err = asset_file_repo.refs(ex, row.id)
        if asset_err then return nil, asset_err end
        return {row = row, content = content, assets = assets :: {types.AssetRef}}, nil
    end)
    if read_err then return nil, read_err end
    local source = saved :: types.ResendSource
    local row, content = source.row, source.content
    local addresses = content.addresses
    return admit({to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = row.reply_to,
        template = row.template, attachments = content.attachments},
        {subject = row.subject, html = row.failed_html, text = row.failed_text, library_assets = source.assets}, row.id)
end

local function test_input(): (types.SendRequest?, error?)
    local actor, err = security.actor()
    if err then return nil, err end
    local meta = actor and actor:meta()
    local address = meta and meta.email
    if not meta or meta.user_id ~= actor:id() or not message.address(address) then
        return nil, errors.new({kind = errors.INVALID, message = "The acting person has no valid email address",
            retryable = false, details = {code = "recipient_address_missing"}})
    end
    return {to = {address :: string}, origin = {kind = "test", id = actor:id(),
        label = "Test email"}}, nil
end

local function library_send_test(request: types.TestSend): (types.SendResult?, error?)
    local denied = client.require_library() or client.require_send()
    if denied then return nil, denied end
    local input, err = test_input()
    if err then return nil, err end
    if type(request) ~= "table" or type(request.message) ~= "string" then
        return nil, resource.error(errors.INVALID, "invalid_mail_test", "Provide a library message to send")
    end
    for field in pairs(request) do
        if field ~= "message" and field ~= "vars" then
            return nil, resource.error(errors.INVALID, "invalid_mail_test", "A test is addressed to the acting person")
        end
    end
    local item, read_err = library.live_message(request.message)
    if read_err then return nil, read_err end
    input.template, input.vars = item.name, request.vars
    if input.vars == nil then input.vars = item.samples end
    return admit(input)
end

local function delivery_send_test(request: types.Record): (types.SendResult?, error?)
    local denied = client.require_admin() or client.require_send()
    if denied then return nil, denied end
    if type(request) ~= "table" or next(request) ~= nil then
        return nil, resource.error(errors.INVALID, "invalid_mail_test", "A test is addressed to the acting person")
    end
    local input, err = test_input()
    if err then return nil, err end
    input.subject, input.text = "Mail delivery test", "This is a test of your mail delivery settings."
    return admit(input)
end

return {send = send, resend = resend, library_send_test = library_send_test,
    delivery_send_test = delivery_send_test}
