-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local security = require("security")

local M = {}

local MAILER = "kickside.mail:mailer"
local LIBRARY = "kickside.mail.library:list"

function M.capabilities(): types.Capabilities
    return {
        send = security.can("access", MAILER),
        edit_library = security.can("access", LIBRARY),
        administer_delivery = security.can("mail.log.admin", MAILER)
            and security.can("access", "kickside.mail.api:delivery_status.endpoint"),
    }
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

function M.require_library(): error?
    if not security.can("access", LIBRARY) then
        return errors.new({kind = errors.PERMISSION_DENIED, message = "Edit mail library access is required",
            retryable = false, details = {code = "mail_library_denied"}})
    end
    return nil
end

function M.open(): (types.Mailer?, error?)
    local definition, definition_err = contract.get("kickside.mail:mailer")
    if definition_err then return nil, definition_err end
    local mailer, err = definition:open()
    return mailer :: types.Mailer?, err
end

function M.send(request: types.SendRequest): (types.SendResult?, error?)
    local mailer, err = M.open()
    if err then return nil, err end
    return (mailer :: types.Mailer):send(request)
end

function M.resend(message_id: string): (types.SendResult?, error?)
    local mailer, err = M.open()
    if err then return nil, err end
    return (mailer :: types.Mailer):resend(message_id)
end

function M.get_message(message_id: string): (types.LogMessage?, error?)
    local mailer, err = M.open()
    if err then return nil, err end
    return (mailer :: types.Mailer):get_message(message_id)
end

function M.list_messages(request: types.ListRequest): (types.ListResult?, error?)
    local mailer, err = M.open()
    if err then return nil, err end
    return (mailer :: types.Mailer):list_messages(request)
end

return M
