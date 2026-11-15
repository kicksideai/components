-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Teardown admits framework maintenance or a caller holding component DELETE.
local security = require("security")
local component = require("component")
local execution_identity = require("execution_identity")
local failure = require("failure")
local M = {}
function M.delete(component_id: string): error?
    local actor = security.actor()
    if not actor then
        return errors.new({ kind = errors.PERMISSION_DENIED, message = "component deletion requires an actor",
            details = { code = "authentication_required" } })
    end
    if execution_identity.is_maintenance_key(actor:id()) then return nil end
    local _, err = component.validate_access(component_id, component.ACCESS.DELETE)
    if err then return failure.coded(errors.wrap(err, "component deletion access"), "component_access_denied") end
    return nil
end
return M
