-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local signal = require("signal")

local function notify(input)
    if input.topic:match("^upload:") then
        assert(security.can("realtime.notify", "kickside.realtime:notify"))
        signal.publish("uploads")
    end
    return {success = true}
end

return {notify = notify}
