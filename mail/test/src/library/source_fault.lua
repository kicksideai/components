-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local thread_events = require("thread_events")
local interleave = require("asset_interleave")

return setmetatable({
    event_at = function(...)
        local event, err = thread_events.event_at(...)
        if event then interleave.pause("before_reserve") end
        return event, err
    end,
}, {__index = thread_events})
