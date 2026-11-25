-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local registry = require("registry")
local config = require("config")
local env = require("env")
local security = require("security")

local M = {missing = config.setup_error}

function M.namespace(namespace: string): (types.SettingsResult?, error?)
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
    return result, nil
end

function M.read(namespace: string): (types.Record?, error?)
    local result, err = M.namespace(namespace)
    if err then return nil, err end
    return result.values, nil
end

function M.appearance(): (types.Appearance?, error?)
    local values, err = M.read("kickside.ui")
    if err then return nil, err end
    local url, url_err = env.get("PUBLIC_API_URL")
    if url_err and url_err:kind() ~= errors.NOT_FOUND then return nil, url_err end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    local meta = actor and actor:meta()
    return {title = values.title, url = url, sender_name = meta and meta.full_name}, nil
end

function M.api_key(values: types.ApiSettings, service: string?): (string?, error?)
    local key = values.api_key
    local credential = service and ("a " .. service .. " API key") or "an API key"
    local issue = config.api_key_issue(key)
    if issue == "api_key_required" then
        return nil, M.missing("Add " .. credential .. " to send mail.", issue)
    end
    if issue then
        return nil, M.missing("Enter " .. credential .. " without spaces or line breaks.", issue)
    end
    return key, nil
end

function M.read_api_key(namespace: string, service: string?): (string?, error?)
    local values, err = M.read(namespace)
    if err then return nil, err end
    return M.api_key(values :: types.ApiSettings, service)
end

function M.available(err: error?): (types.Availability?, error?)
    if err then
        local details = err:details()
        if not details or details.code ~= "invalid_config" then return nil, err end
        return {available = false, code = details.reason_code :: string?, reason = err:message()}, nil
    end
    return {available = true}, nil
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
