-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local events = require("events")
local security = require("security")

local function notify(input)
    if input.topic:match("^upload:") then
        assert(security.can("realtime.notify", "kickside.realtime:notify"))
        assert(events.send("mail.fixture", "uploads", input.topic))
    end
    return {success = true}
end

return {notify = notify}
