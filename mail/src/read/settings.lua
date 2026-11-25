-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local env = require("env")
local funcs = require("funcs")
local security = require("security")

local M = {}

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

function M.driver(): (types.DriverSelection?, error?)
    local selection, err = funcs.call("kickside.mail.read:driver_selection")
    return selection :: types.DriverSelection?, err
end

local function read_values(namespace: string): (types.Record?, error?)
    local result, err = M.namespace(namespace)
    if err then return nil, err end
    return result.values, nil
end

function M.mail(): (types.Settings?, error?)
    local values, err = read_values("kickside.mail")
    return values :: types.Settings?, err
end

function M.appearance(): (types.Appearance?, error?)
    local values, err = read_values("kickside.ui")
    if err then return nil, err end
    local url, url_err = env.get("PUBLIC_API_URL")
    if url_err and url_err:kind() ~= errors.NOT_FOUND then return nil, url_err end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    local meta = actor and actor:meta()
    return {title = values.title, url = url, sender_name = meta and meta.full_name}, nil
end

return M
