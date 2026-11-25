-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local drivers = require("drivers")
local settings = require("settings")
local config = require("config")
local canonical_json = require("canonical_json")
local identity = require("identity")
local store = require("store")
local log = require("log")
local security = require("security")
local resource = require("resource")
local library = require("library")
local notify = require("notify")
local message = require("message")
local live_preview = require("live_preview")
local attachments = require("attachments")
local recipients = require("recipients")

local function unavailable(): error
    return config.setup_error("Mail delivery requires setup. Ask a mail administrator to check the delivery settings.")
end

local function admit(input: types.SendRequest, rendered: types.Rendered?, resend_of: string?): (types.SendResult?, error?)
    local execution, capture_err = identity.capture()
    if capture_err then return nil, capture_err :: error end
    local actor_row, actor_err = identity.to_row(execution)
    if actor_err then return nil, actor_err :: error end
    local actor = actor_row :: types.ActorRow
    local hash: string?
    if input.idempotency_key then
        local content: types.Record = {}
        for key, value in pairs(input) do
            if key ~= "idempotency_key" and key ~= "origin" then content[key] = value end
        end
        local hash_err
        hash, hash_err = canonical_json.hash(content)
        if hash_err then return nil, hash_err :: error end
        local existing, replay_err = store.find_key(actor.actor_id, input.idempotency_key, hash :: string)
        if existing or replay_err then return existing, replay_err end
    end

    local render_err
    if not rendered and input.template then
        rendered, render_err = live_preview.template(input.template, input.vars, input.attachments)
        if render_err then return nil, render_err end
    end
    local addresses, recipient_err = recipients.resolve(input)
    if recipient_err then return nil, recipient_err end

    local config, config_err = settings.mail()
    if config_err then return nil, unavailable() end
    config = config :: types.Settings
    local driver, driver_err = drivers.resolve(config.driver)
    if driver_err then return nil, unavailable() end
    driver = driver :: types.Driver
    local limit_err = message.recipients_error(addresses, driver.max_recipients)
    if limit_err then return nil, limit_err end
    if drivers.check_available(driver) then return nil, unavailable() end
    local from, from_err = drivers.sender(config)
    if from_err then return nil, unavailable() end
    local reply_to = input.reply_to
    if not reply_to and not resend_of then
        local reply_err
        reply_to, reply_err = drivers.reply_to(config)
        if reply_err then return nil, unavailable() end
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
    local saved, save_err = store.insert({
        sender = actor.actor_id, actor_context = actor.actor_context, template = input.template,
        from = from,
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = reply_to,
        subject = parts.subject, html = parts.html, text = parts.text, attachments = input.attachments,
        library_assets = parts.library_assets, idempotency_key = input.idempotency_key, content_hash = hash, origin = origin, resend_of = resend_of,
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
    local row, read_err = log.for_resend(message_id)
    if read_err then return nil, read_err end
    local addresses, refs, decode_err = store.content(row)
    if decode_err then return nil, decode_err end
    local assets, asset_err = store.asset_refs(row.id)
    if asset_err then return nil, asset_err end
    return admit({to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = row.reply_to,
        template = row.template, attachments = refs},
        {subject = row.subject, html = row.failed_html, text = row.failed_text, library_assets = assets}, row.id)
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
    local item, read_err = library.lookup({kind = "message", name = request.message})
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
