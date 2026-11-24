-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local GENERIC = "Ask a mail administrator to check why the message could not be delivered."
local CONFIG = "Ask a mail administrator to check the mail delivery settings."
local ATTACHMENT = "Check the message attachments before sending it again."
local REFUSED = "Ask a mail administrator to check why the message was refused."
local UNAVAILABLE = "Ask a mail administrator to check when mail delivery is available again."

local TEXT = {
    delivery_failed = GENERIC,
    delivery_interrupted = "Ask a mail administrator to check whether the interrupted message was delivered.",
    invalid_config = CONFIG,
    settings_read_failed = CONFIG,
    invalid_driver_descriptor = CONFIG,
    duplicate_driver_id = CONFIG,
    driver_availability_invalid = CONFIG,
    provider_endpoint_invalid = CONFIG,
    credentials_invalid = "Ask a mail administrator to check delivery authorization.",
    message_rejected = REFUSED,
    sender_or_recipient_not_allowed = REFUSED,
    provider_rejected = REFUSED,
    provider_response_invalid = GENERIC,
    provider_request_failed = UNAVAILABLE,
    provider_unavailable = UNAVAILABLE,
    rate_limited = "Ask a mail administrator to check when sending can resume after the rate limit.",
    quota_exhausted = "Ask a mail administrator to check the sending quota.",
    send_in_progress = "Ask a mail administrator to check whether delivery is still in progress.",
    idempotency_conflict = "Ask a mail administrator to check the conflicting delivery.",
    message_encoding_failed = GENERIC,
    attachment_encoding_failed = ATTACHMENT,
    attachment_unavailable = ATTACHMENT,
    incomplete_attachment = ATTACHMENT,
    invalid_attachment = ATTACHMENT,
    invalid_attachment_size = ATTACHMENT,
    invalid_attachment_filename = ATTACHMENT,
    attachments_too_large = ATTACHMENT,
    invalid_content_id = ATTACHMENT,
    too_many_recipients = "Reduce the number of recipients before sending the message again.",
    message_too_large = "Reduce the size of the message before sending it again.",
    mail_send_denied = "Ask a mail administrator to check the sender's permission to send mail.",
    lease_lost = "Ask a mail administrator to check whether the interrupted message was delivered.",
}

local function text(code: string): string
    return TEXT[code] or GENERIC
end

return {text = text}
