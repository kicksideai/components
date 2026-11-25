-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local registry = require("registry")
local config = require("config")
local message = require("message")
local types = require("types")

local M = {mailbox = message.mailbox, address = message.address, missing = config.setup_error}

function M.settings(namespace: string): (types.Record?, error?)
    local definition, err = contract.get("kickside.settings:settings")
    if err then return nil, err end
    local instance, open_err = definition:open()
    if open_err then return nil, open_err end
    local result, read_err = (instance :: types.SettingsContract):get_namespace({namespace = namespace})
    if read_err then return nil, read_err end
    if not result.success then
        return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = result.error :: string,
            details = {code = "settings_read_failed", namespace = namespace}})
    end
    return result.values, nil
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

function M.validate_api_key(input: types.SettingInput): types.SettingValidation
    if input.value == "" or valid_key(input.value) then return {valid = true} end
    return {valid = false, error = "Enter an API key without spaces or line breaks."}
end

function M.api_key(values: types.ApiSettings, service: string): (string?, error?)
    local key = values.api_key
    if not key or key == "" then
        return nil, config.setup_error("Add a " .. service .. " API key to send mail.", "api_key_required")
    end
    if not valid_key(key) then
        return nil, config.setup_error("Enter a " .. service .. " API key without spaces or line breaks.", "api_key_invalid")
    end
    return key, nil
end

function M.read_api_key(namespace: string, service: string): (string?, error?)
    local values, err = M.settings(namespace)
    if err then return nil, err end
    return M.api_key(values :: types.ApiSettings, service)
end

function M.status_error(err: error?): (types.TransportReadiness?, error?)
    if not err then return {ready = true}, nil end
    local details = err:details()
    if not details or details.code ~= "invalid_config" then return nil, err end
    return {ready = false, code = details.reason_code :: string?, reason = err:message()}, nil
end

function M.endpoint(id: string, region: string): (string?, error?)
    local entry, err = registry.get(id)
    if err then return nil, err end
    local url: unknown = entry.data.endpoints[region]
    local scheme, authority
    if type(url) == "string" and not url:find("[%c%s#@\\?]") then
        scheme, authority = url:match("^(https?)://([^/]+)/*$")
    end
    local host = authority and authority:match("^[^:]+")
    if scheme == "https" or (scheme == "http" and (host == "127.0.0.1" or host == "localhost")) then
        return ((url :: string):gsub("/+$", "")), nil
    end
    return nil, errors.new({kind = errors.INVALID, message = "Mail driver API base URL is invalid",
        retryable = false, details = {code = "provider_endpoint_invalid"}})
end

return M
