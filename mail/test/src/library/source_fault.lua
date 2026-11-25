-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local thread_events = require("thread_events")
local interleave = require("asset_interleave")

return setmetatable({
    prune_boundary = function(threads)
        local omitted = ctx.get("mail_test_no_prune_boundary")
        if omitted then return nil, errors.new({kind = errors.NOT_FOUND, message = "No prune boundary fixture"}) end
        return thread_events.prune_boundary(threads)
    end,
    event_at = function(...)
        local event, err = thread_events.event_at(...)
        if event then interleave.pause("before_reserve") end
        return event, err
    end,
}, {__index = thread_events})
