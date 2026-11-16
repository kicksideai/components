-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Observes the real retention service without generating a wake.
local process = require("process")
local time = require("time")
local channel = require("channel")
local M = {}
function M.observe(read: () -> (boolean?, error?)): (boolean?, error?)
    local events = process.events()
    local pid, err = process.spawn_monitored("kickside.core.retention.service:sweeper_process", "app:processes")
    if err then return nil, err end
    local done: boolean? = false
    local ceiling = time.now():unix_nano() + 20 * time.SECOND
    while not done and not err and time.now():unix_nano() < ceiling do
        time.sleep("20ms")
        done, err = read()
    end
    local _, cerr = process.cancel(pid)
    local timeout = time.after("5s")
    while not cerr do
        local selected = channel.select({ events:case_receive(), timeout:case_receive() })
        if selected.channel ~= events then
            cerr = errors.new({ kind = errors.TIMEOUT, message = "retention service does not stop", details = { code = "retention_test_timeout" } })
        elseif selected.value.kind == process.event.EXIT and tostring(selected.value.from) == tostring(pid) then
            break
        end
    end
    if err then return nil, err end
    if cerr then return nil, cerr end
    return done, nil
end
return M
