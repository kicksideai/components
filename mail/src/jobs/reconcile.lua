-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local live = require("live")
local scratch = require("scratch")
local error_envelope = require("error_envelope")

local function boot_failure(err: error): {status: string, message: string, details: unknown}
    return {status = "error", message = err:message(), details = error_envelope.encode(err)}
end

local function boot(): {status: string, message: string?, details: unknown?}
    local _, clear_err = scratch.clear_workspace()
    if clear_err then return boot_failure(clear_err) end
    local _, err = live.reconcile(true)
    if err then return boot_failure(err) end
    return {status = "success"}
end

return {boot = boot}
