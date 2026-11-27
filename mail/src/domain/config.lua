-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local message = require("message")
local types = require("types")

local M = {}
local LIMITS = {"max_recipients", "max_message_bytes"}

function M.setup_error(text: string, reason_code: string?, reason: string?): error
    return errors.new({kind = errors.INVALID, message = text, retryable = false,
        details = {code = "invalid_config", reason_code = reason_code, reason = reason}})
end

function M.driver_not_admitted(): error
    return errors.new({kind = errors.INVALID, message = "The active mail driver is not admitted", retryable = false,
        details = {code = "driver_not_admitted"}})
end

local function invalid_status(id: string, field: string): error
    return errors.new({kind = errors.INTERNAL, retryable = false,
        message = "Mail transport " .. id .. " returned an invalid " .. field,
        details = {code = "invalid_transport_status", field = field}})
end

function M.transport_status_error(status: unknown, id: string): error?
    if type(status) ~= "table" then return invalid_status(id, "status") end
    local fields = status :: types.Record
    for _, field in ipairs({"title", "icon", "description", "settings_ns"}) do
        if not message.nonempty(fields[field]) then return invalid_status(id, field) end
    end
    for _, field in ipairs({"ready", "idempotent"}) do
        if type(fields[field]) ~= "boolean" then return invalid_status(id, field) end
    end
    for _, field in ipairs(LIMITS) do
        local value = fields[field]
        if value ~= nil and (type(value) ~= "number" or value < 1 or value % 1 ~= 0) then
            return invalid_status(id, field)
        end
    end
    local code = fields.code
    if code ~= nil and (type(code) ~= "string" or not code:match("^[a-z][a-z0-9_]*$")) then
        return invalid_status(id, "code")
    end
    if fields.reason ~= nil and not message.nonempty(fields.reason) then return invalid_status(id, "reason") end
    return nil
end

function M.transport_ready_error(status: types.TransportStatus): error?
    if status.ready then return nil end
    return M.setup_error(status.reason or ("Complete the " .. status.title .. " settings to send mail."),
        status.code or "driver_not_configured")
end

function M.sender(config: types.Settings): (types.Mailbox?, error?)
    local address = config.from_address
    if not address or not address:find("%S") then
        return nil, M.setup_error("A mail From address is required", "from_address_required", "Enter a From address to send mail.")
    end
    if not message.address(address) then
        return nil, M.setup_error("The mail From address is invalid", "from_address_invalid",
            "Enter a valid From address, such as support@example.com.")
    end
    local name = config.from_name
    if name ~= nil then
        local issue = message.from_name_issue(name)
        if issue then return nil, M.setup_error(issue, "from_name_invalid") end
    end
    return {address = address, name = name and name:find("%S") and name or nil}, nil
end

function M.reply_to(config: types.Settings): (string?, error?)
    local address = config.reply_to
    if not address or address == "" then return nil, nil end
    if not message.address(address) then
        return nil, M.setup_error("The mail Reply-To address is invalid", "reply_to_invalid",
            "Enter a valid Reply-to address or leave it blank.")
    end
    return address, nil
end

return M
