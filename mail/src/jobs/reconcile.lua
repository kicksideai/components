-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local live = require("live")
local scratch = require("scratch")

local function boot(): {status: string, message: string?}
    local _, clear_err = scratch.clear_workspace()
    if clear_err then return {status = "error", message = clear_err:message()} end
    local _, err = live.reconcile(true)
    if err then return {status = "error", message = err:message()} end
    return {status = "success"}
end

return {boot = boot}
