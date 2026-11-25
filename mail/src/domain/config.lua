-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local message = require("message")
local types = require("types")

local M = {}
local LIMITS = {"max_recipients", "max_message_bytes"}

function M.setup_error(text: string, reason_code: string?, reason: string?): error
    return errors.new({kind = errors.INVALID, message = text, retryable = false,
        details = {code = "invalid_config", reason_code = reason_code, reason = reason}})
end

local function valid_key(value: unknown): boolean
    if type(value) ~= "string" or not message.header_length(value) then return false end
    for _, codepoint in utf8.codes(value) do
        if codepoint == 0x20 or codepoint == 0xA0 or codepoint == 0x1680
            or (codepoint >= 0x2000 and codepoint <= 0x200A)
            or codepoint == 0x202F or codepoint == 0x205F or codepoint == 0x3000 then
            return false
        end
    end
    return true
end

function M.descriptor_error(values: types.Record, id: string): error?
    for _, field in ipairs(LIMITS) do
        local value = values[field]
        if value ~= nil and (type(value) ~= "number" or value < 1 or value % 1 ~= 0) then
            return errors.new({kind = errors.INVALID, retryable = false,
                message = "Mail driver " .. id .. " requires a positive integer for " .. field,
                details = {code = "invalid_driver_descriptor"}})
        end
    end
    return nil
end

function M.api_key_issue(value: unknown): string?
    if value == nil or value == "" then return "api_key_required" end
    if not valid_key(value) then return "api_key_invalid" end
    return nil
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
