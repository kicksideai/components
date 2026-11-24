-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local drivers = require("drivers")
local settings = require("settings")
local canonical_json = require("canonical_json")
local identity = require("identity")
local logger = require("logger")
local jobs = require("jobs")
local notifier = require("notifier")
local store = require("store")
local log = require("log")
local message = require("message")
local render = require("render")
local attachments = require("attachments")
local recipients = require("recipients")

local function preview(request: types.PreviewRequest): (types.PreviewResult?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(request) ~= "table" then return nil, errors.new({kind = errors.INVALID, retryable = false,
        message = "A template and variables are required", details = {code = "invalid_template"}}) end
    local rendered, render_err = render.render(request.template, request.vars)
    if render_err then return nil, render_err end
    local result = rendered :: types.Rendered
    return {subject = result.subject, html = result.html :: string, text = result.text :: string}, nil
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
        rendered, render_err = render.render(input.template, input.vars)
        if render_err then return nil, render_err end
    end
    local addresses, recipient_err = recipients.resolve(input)
    if recipient_err then return nil, recipient_err end

    local config, config_err = settings.read("kickside.mail")
    if config_err then return nil, config_err end
    config = config :: types.Settings
    local driver, driver_err = drivers.resolve(config.driver)
    if driver_err then return nil, driver_err end
    driver = driver :: types.Driver
    local limit_err = message.recipients_error(addresses, driver.max_recipients)
    if limit_err then return nil, limit_err end
    local unavailable = drivers.check_available(driver)
    if unavailable then return nil, unavailable end
    if not config.from_address or not config.from_address:find("%S") then
        return nil, settings.missing("A mail From address is required")
    end
    if not message.address(config.from_address) then
        return nil, settings.missing("The mail From address is invalid")
    end
    local name = config.from_name
    if name and name:find("%c") then
        return nil, settings.missing("The mail From name contains a control character")
    end
    if name and not name:find("%S") then name = nil end

    local reply_to = input.reply_to
    if not reply_to and not resend_of and config.reply_to and config.reply_to ~= "" then
        reply_to = config.reply_to
        if not message.address(reply_to) then
            return nil, settings.missing("The mail Reply-To address is invalid")
        end
    end

    if not rendered then
        rendered, render_err = render.body(input.subject :: string, input.text, input.html)
        if render_err then return nil, render_err end
    end

    local parts = rendered :: types.Rendered
    local body_err = message.body_error(parts.text, parts.html)
    if body_err then return nil, body_err end
    local from = {address = config.from_address, name = name}
    local bytes = message.delivery_size({
        from = from, reply_to = reply_to, to = addresses.to, cc = addresses.cc, bcc = addresses.bcc,
        subject = parts.subject, html = parts.html, text = parts.text,
    })
    local attachment_err = attachments.validate({
        refs = input.attachments, message_bytes = bytes, max_message_bytes = driver.max_message_bytes,
    })
    if attachment_err then return nil, attachment_err end

    local saved, save_err = store.insert({
        sender = actor.actor_id, actor_context = actor.actor_context, template = input.template,
        from = from,
        to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = reply_to,
        subject = parts.subject, html = parts.html, text = parts.text, attachments = input.attachments,
        idempotency_key = input.idempotency_key, content_hash = hash, origin = input.origin, resend_of = resend_of,
    })
    if save_err then return nil, save_err end
    if saved.inserted then
        local _, notify_err = notifier.notify({kind = "owner_eligibility_changed"})
        if notify_err then logger:error("Mail retention notification failed", {error = tostring(notify_err)}) end
        local _, nudge_err = jobs.nudge_workers()
        if nudge_err then logger:error("Mail job notification failed", {error = tostring(nudge_err)}) end
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
    return admit({to = addresses.to, cc = addresses.cc, bcc = addresses.bcc, reply_to = row.reply_to,
        template = row.template, attachments = refs},
        {subject = row.subject, html = row.failed_html, text = row.failed_text}, row.id)
end

return {send = send, preview = preview, resend = resend}
