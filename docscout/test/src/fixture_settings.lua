-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")

return { get = function(_args: any): (any?, error?)
    local actor = security.actor()
    local id = actor and actor:id()
    if id == "retention-native-failure" then
        return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "setting rejected",
            details = { code = "setting_rejected" } })
    end
    if id == "retention-transient-failure" then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "settings unavailable",
            details = { code = "settings_unavailable" } })
    end
    if id == "retention-domain-failure" then return { success = false, error = "setting rejected" }, nil end
    return { success = true, value = id }, nil
end }
