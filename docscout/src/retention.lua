-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The one retention window for processed documents and run history.
local contract = require("contract")
local security = require("security")
local time = require("time")
local error_envelope = require("error_envelope")

local M = {}

-- The configured window as its setting text, for example "2h".
function M.window(): (string?, error?)
    local actor, scope = security.actor(), security.scope()
    if not actor then
        return nil, errors.new({ kind = errors.UNAUTHENTICATED, retryable = false, message = "authentication required" })
    end
    if not scope then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, retryable = false, message = "authorization scope required" })
    end
    local definition, definition_err = contract.get("kickside.settings:settings")
    local wrapper, err = error_envelope.binding(definition, definition_err, "with_actor", "settings unavailable", "retention_settings_binding")
    if err then return nil, err end
    local actor_bound, actor_err = wrapper:with_actor(actor)
    wrapper, err = error_envelope.binding(actor_bound, actor_err, "with_scope", "settings actor binding failed", "retention_settings_binding")
    if err then return nil, err end
    local scope_bound, scope_err = wrapper:with_scope(scope)
    wrapper, err = error_envelope.binding(scope_bound, scope_err, "open", "settings scope binding failed", "retention_settings_binding")
    if err then return nil, err end
    local instance, open_err = wrapper:open()
    local settings, binding_err = error_envelope.binding(instance, open_err, "get", "settings unavailable", "retention_settings_binding")
    if binding_err then return nil, binding_err end
    local result, err = settings:get({ namespace = "kickside.docscout", key = "retention" })
    if err then return nil, err end
    if type(result) ~= "table" or result.success == false then
        return nil, errors.new({ kind = errors.INTERNAL, retryable = false,
            message = "retention setting is unavailable: " .. tostring(result and result.error),
            details = { code = "retention_setting_failed" } })
    end
    return tostring(result.value), nil
end

-- The RFC3339 instant at which something created now expires.
function M.expires_at(): (string?, error?)
    local window, err = M.window()
    if err then return nil, err end
    local duration, parse_err = time.parse_duration(window :: string)
    if parse_err then
        return nil, errors.new({ kind = errors.INVALID, message = "retention setting is not a duration: " .. tostring(window) })
    end
    return time.now():utc():add(duration):format(time.RFC3339), nil
end

return M
