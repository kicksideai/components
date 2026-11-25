-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
local time = require("time")

local function terminal(read, duration)
    local subscription = assert(events.subscribe("mail.fixture", "activity"))
    local changes = subscription:channel()
    local deadline = assert(time.after(duration))
    local result, err = read()
    while result and result.status == "queued" and not err do
        local wake = channel.select({changes:case_receive(), deadline:case_receive()})
        result, err = read()
        if wake.channel == deadline then break end
    end
    subscription:close()
    assert(result, tostring(err))
    assert(result.status == "sent" or result.status == "failed", "Mail remained queued: " .. result.message_id)
    return result
end

return {terminal = terminal}
