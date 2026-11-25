-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
local time = require("time")

local function observe(topic, duration)
    local subscription = assert(events.subscribe("mail.fixture", topic))
    local changes = subscription:channel()
    return function(read, ready)
        local deadline = assert(time.after(duration))
        local result, err = read()
        while not err and not ready(result) do
            local wake = channel.select({changes:case_receive(), deadline:case_receive()})
            result, err = read()
            if wake.channel == deadline then break end
        end
        subscription:close()
        return result, err
    end
end

local function terminal(read, duration)
    local result, err = observe("activity", duration)(read, function(row)
        return row and row.status ~= "queued"
    end)
    assert(result, tostring(err))
    assert(result.status == "sent" or result.status == "failed", "Mail remained queued: " .. result.message_id)
    return result
end

return {terminal = terminal, observe = observe}
