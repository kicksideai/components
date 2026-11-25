-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
local time = require("time")

local function until_state(read, matches, duration)
    local subscription = assert(events.subscribe("mail.fixture", "activity"))
    local changes = subscription:channel()
    local deadline = assert(time.after(duration))
    local result, err = read()
    while result and not err and not matches(result) do
        local wake = channel.select({changes:case_receive(), deadline:case_receive()})
        result, err = read()
        if wake.channel == deadline then break end
    end
    subscription:close()
    assert(result, tostring(err))
    assert(matches(result), "Unexpected Mail status " .. result.status .. " for " .. result.message_id)
    return result
end

local function terminal(read, duration)
    return until_state(read, function(result)
        return result.status == "sent" or result.status == "failed"
    end, duration)
end

return {terminal = terminal, until_state = until_state}
