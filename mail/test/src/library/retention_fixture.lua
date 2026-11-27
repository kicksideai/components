-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
local process = require("process")
local time = require("time")

local SOURCE = "mail.fixture.retention"

local function ready()
    assert(events.send(SOURCE, "ready", "/ready"))
    return {success = true, deleted = 0}
end

local function start(state)
    local subscription = assert(events.subscribe(SOURCE, "ready"))
    local lifecycle = process.events()
    local pid, err = process.spawn_monitored("kickside.core.retention.service:sweeper_process", "app:processes")
    if not pid then
        subscription:close()
        error(err)
    end
    state.stop_retention = function()
        local _, cancel_err = process.cancel(pid)
        if cancel_err and not errors.is(cancel_err, errors.NOT_FOUND) then error(cancel_err) end
        local deadline = assert(time.after("8s"))
        repeat
            local stopped = channel.select({lifecycle:case_receive(), deadline:case_receive()})
            assert(stopped.channel == lifecycle and stopped.ok, "Core retention did not stop")
            local event = stopped.value
            if event.kind == process.event.EXIT and event.from == pid then
                assert(not (event.result and event.result.error), event.result and event.result.error)
                return
            end
        until false
    end
    local inbox = subscription:channel()
    local deadline = assert(time.after("8s"))
    local started = channel.select({inbox:case_receive(), deadline:case_receive()})
    subscription:close()
    assert(started.channel == inbox and started.ok, "Core retention did not start")
end

return {ready = ready, start = start}
