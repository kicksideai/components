-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local signal = require("signal")
local time = require("time")

local function observe(topic, duration)
    local changes, close = signal.subscribe()
    return function(read, ready)
        local deadline = assert(time.after(duration))
        local result, err = read()
        if not err and not ready(result) then
            repeat
                local wake = channel.select({changes:case_receive(), deadline:case_receive()})
                if wake.channel == deadline then break end
                if not topic or wake.value == topic then result, err = read() end
            until err or ready(result)
        end
        close()
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
