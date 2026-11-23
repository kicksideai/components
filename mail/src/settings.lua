-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local registry = require("registry")

local M = {}

function M.read(namespace: string): (types.Record?, error?)
    local definition, definition_err = contract.get("kickside.settings:settings")
    if definition_err then return nil, definition_err end
    local settings, open_err = definition:open()
    if open_err then return nil, open_err end
    local result, read_err = (settings :: types.SettingsContract):get_namespace({namespace = namespace})
    if read_err then return nil, read_err end
    if not result.success then
        return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = result.error :: string,
            details = {code = "settings_read_failed", namespace = namespace}})
    end
    return result.values, nil
end

function M.missing(text: string): error
    return errors.new({kind = errors.INVALID, message = text, retryable = false,
        details = {code = "invalid_config"}})
end

function M.api_key(values: types.ApiSettings): (string?, error?)
    local key = values.api_key
    if not key or key == "" then return nil, M.missing("The active mail driver requires an API key") end
    if key:find("[%s%c]") then return nil, M.missing("The active mail driver API key is invalid") end
    return key, nil
end

function M.read_api_key(namespace: string): (string?, error?)
    local values, err = M.read(namespace)
    if err then return nil, err end
    return M.api_key(values :: types.ApiSettings)
end

function M.available(err: error?): (types.Availability?, error?)
    if err then
        local details = err:details()
        if not details or details.code ~= "invalid_config" then return nil, err end
    end
    return {available = err == nil, reason = err and err:message() or nil}, nil
end

function M.endpoint(id: string, region: string): (string?, error?)
    local entry, lookup_err = registry.get(id)
    if lookup_err then return nil, lookup_err end
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
