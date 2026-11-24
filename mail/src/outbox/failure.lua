-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local GENERIC = "Ask a mail administrator to check why the message could not be delivered."
local CONFIG = "Ask a mail administrator to check the mail delivery settings."
local ATTACHMENT = "Check the message attachments before sending it again."
local REFUSED = "Ask a mail administrator to check why the message was refused."
local UNAVAILABLE = "Ask a mail administrator to check when mail delivery is available again."

local TEXT = {
    delivery_failed = GENERIC,
    delivery_interrupted = "Ask a mail administrator to check whether the interrupted message was delivered.",
    invalid_config = CONFIG,
    message_rejected = REFUSED,
    provider_rejected = REFUSED,
    provider_response_invalid = GENERIC,
    provider_request_failed = UNAVAILABLE,
    provider_transport_failed = UNAVAILABLE,
    provider_unavailable = UNAVAILABLE,
    rate_limited = "Ask a mail administrator to check when sending can resume after the rate limit.",
    message_encoding_failed = GENERIC,
    attachment_encoding_failed = ATTACHMENT,
    attachment_unavailable = ATTACHMENT,
    incomplete_attachment = ATTACHMENT,
    invalid_attachment = ATTACHMENT,
    attachment_empty = ATTACHMENT,
    invalid_attachment_size = ATTACHMENT,
    invalid_attachment_filename = ATTACHMENT,
    attachments_too_large = ATTACHMENT,
    invalid_content_id = ATTACHMENT,
    too_many_recipients = "Reduce the number of recipients before sending the message again.",
    message_too_large = "Reduce the size of the message before sending it again.",
    mail_send_denied = "Ask a mail administrator to check the sender's permission to send mail.",
    access_denied = "Ask a mail administrator to check the sender's permission to send mail.",
    lease_lost = "Ask a mail administrator to check whether the interrupted message was delivered.",
}

local PUBLIC_CODES = {
    credentials_invalid = "provider_rejected",
    authorization_refused = "provider_rejected",
    sender_or_recipient_not_allowed = "provider_rejected",
    request_rejected = "provider_rejected",
    idempotency_conflict = "provider_rejected",
    send_in_progress = "provider_unavailable",
    quota_exhausted = "rate_limited",
    settings_read_failed = "invalid_config",
    invalid_driver_descriptor = "invalid_config",
    duplicate_driver_id = "invalid_config",
    driver_availability_invalid = "invalid_config",
    provider_endpoint_invalid = "invalid_config",
}

local PUBLIC_KINDS = {
    provider_rejected = errors.INVALID,
    invalid_config = errors.INVALID,
    provider_unavailable = errors.UNAVAILABLE,
    rate_limited = errors.RATE_LIMITED,
}

local function public(kind: string, code: string): types.MessageError
    code = PUBLIC_CODES[code] or code
    if not TEXT[code] then code = "delivery_failed" end
    if code == "delivery_failed" and kind ~= errors.PERMISSION_DENIED then kind = errors.INTERNAL end
    return {kind = PUBLIC_KINDS[code] or kind, code = code, message = TEXT[code]}
end

return {public = public}
