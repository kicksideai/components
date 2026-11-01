-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local component = require("component")
local retention_notifier = require("retention_notifier")
local M = {}
function M.retention(): (boolean?, error?)
    return retention_notifier.notify({ kind = "docscout_expiry" })
end
function M.shared(component_id: string): (any?, error?)
    return component.notify_access(component_id, nil, { component_id = component_id })
end
function M.run(component_id: string, user_id: string, run_id: string): (any?, error?)
    local definition, err = contract.get("kickside.contract:realtime")
    if err then return nil, err end
    local instance, open_err = definition:with_actor(security.actor()):with_scope(security.scope()):open()
    if open_err then return nil, open_err end
    local result, notify_err = instance:notify({ user_id = user_id, topic = "docscout.runs." .. component_id,
        data = { component_id = component_id, run_id = run_id } })
    if notify_err then return nil, notify_err end
    if result.success ~= true then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, retryable = false, message = result.error,
            details = { code = "run_notification_refused" } })
    end
    return result, nil
end
return M
