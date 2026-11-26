-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local security = require("security")
local identity = require("identity")

local M = {}

local MAILER = "kickside.mail:mailer"
local LIBRARY = "kickside.mail:library"

function M.capabilities(): types.Capabilities
    return {
        send = security.can("access", MAILER),
        edit_library = security.can("access", LIBRARY),
        administer_delivery = security.can("mail.log.admin", MAILER)
            and security.can("access", "kickside.mail.api:delivery_status.endpoint"),
    }
end

function M.invalid_request(message: string): error
    return errors.new({kind = errors.INVALID, message = message, retryable = false, details = {code = "invalid_request"}})
end

function M.require_send(): error?
    if not security.can("access", MAILER) then
        return errors.new({kind = errors.PERMISSION_DENIED, message = "Mail send access is required",
            retryable = false, details = {code = "mail_send_denied"}})
    end
    return nil
end

function M.require_admin(): error?
    if not security.can("mail.log.admin", MAILER) then
        return errors.new({kind = errors.PERMISSION_DENIED, message = "Administer mail delivery access is required",
            retryable = false, details = {code = "mail_delivery_denied"}})
    end
    return nil
end

function M.log_scope(): (string?, error?)
    if security.can("mail.log.admin", MAILER) then return nil, nil end
    local actor, err = security.actor()
    if err then return nil, err end
    if not actor then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "A caller is required to read mail activity",
            retryable = false, details = {code = "mail_activity_denied"}})
    end
    local principal, key_err = identity.principal_of_key(actor:id())
    if key_err then return nil, key_err :: error end
    return identity.actor_key(principal) :: string, nil
end

function M.require_library(): error?
    if not security.can("access", LIBRARY) then
        return errors.new({kind = errors.PERMISSION_DENIED, message = "Edit mail library access is required",
            retryable = false, details = {code = "mail_library_denied"}})
    end
    return nil
end

function M.mailer(): (types.Mailer?, error?)
    local definition, definition_err = contract.get(MAILER)
    if definition_err then return nil, definition_err end
    local mailer, err = definition:open()
    return mailer :: types.Mailer?, err
end

function M.library(): (types.Library?, error?)
    local denied = M.require_library()
    if denied then return nil, denied end
    local definition, err = contract.get(LIBRARY)
    if err then return nil, err end
    local library, open_err = definition:open()
    return library :: types.Library?, open_err
end

function M.send(request: types.SendRequest): (types.SendResult?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):send(request)
end

function M.resend(message_id: string): (types.SendResult?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):resend(message_id)
end

function M.get_message(message_id: string): (types.LogMessage?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):get_message(message_id)
end

function M.list_messages(request: types.ListRequest): (types.ListResult?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):list_messages(request)
end

function M.list_templates(): (types.TemplateList?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):list_templates()
end

function M.get_template(input: types.TemplateRequest): (types.Template?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):get_template(input)
end

function M.preview(input: types.PreviewRequest): (types.PreviewResult?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):preview(input)
end

function M.delivery_status(): (types.DeliveryStatus?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):delivery_status()
end

function M.send_delivery_test(input: types.DeliveryTestRequest): (types.SendResult?, error?)
    local mailer, err = M.mailer()
    if err then return nil, err end
    return (mailer :: types.Mailer):send_delivery_test(input)
end

return M
