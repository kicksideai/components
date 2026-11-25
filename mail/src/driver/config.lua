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

local function valid_authority(authority: string): boolean
    local host, port = authority:match("^([%w.%-]+):(%d+)$")
    if not host then host = authority:match("^[%w.%-]+$") end
    if not host then
        host, port = authority:match("^(%[[%x:.]+%]):(%d+)$")
        if not host then host = authority:match("^%[[%x:.]+%]$") end
    end
    local number = port and tonumber(port)
    return host ~= nil and (not port or (number ~= nil and number > 0 and number <= 65535))
end

local function valid_path(path: string): boolean
    if path:find("[^%w/%-._~!$&'()+,;=:%@%%]") or path:find("//", 1, true) then return false end
    if path:gsub("%%%x%x", ""):find("%%") then return false end
    for segment in path:gmatch("[^/]+") do
        local decoded = segment:gsub("%%(%x%x)", function(hex) return string.char(tonumber(hex, 16) :: integer) end)
        if decoded == "." or decoded == ".." or decoded:find("[%c/\\]") then return false end
    end
    return true
end

function M.endpoint(id: string, region: string, mode: string?): (string?, error?)
    local entry, err = registry.get(id)
    if err then return nil, err end
    local endpoints = entry.data.endpoints :: types.Record?
    local url = type(endpoints) == "table" and endpoints[region]
    if type(url) == "string" then
        local authority, path = url:match("^https://([^/]+)(.*)$")
        if authority and valid_authority(authority) then
            if mode == nil or mode == "origin" then
                if path == "" or path == "/" then return "https://" .. authority, nil end
            elseif mode == "exact" then
                if path:sub(1, 1) == "/" and valid_path(path) then return url, nil end
            elseif mode == "prefix" and path:sub(-2) == "/*" then
                local base = path:sub(1, -2)
                if valid_path(base) then return url:sub(1, -3), nil end
            end
        end
    end
    return nil, errors.new({kind = errors.INVALID, message = "Mail driver HTTPS endpoint is invalid",
        retryable = false, details = {code = "provider_endpoint_invalid"}})
end

return M
