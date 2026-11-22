-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local waiters = require("waiters")
local M = {}

local commit: (() -> ())? = nil

function M.before_receive(fn: () -> ())
    commit = fn
end

M.begin_wait = waiters.begin_wait
M.close_wait = waiters.close_wait

function M.wait_until_reached(waiter: table): (table?, boolean, error?)
    local write = commit
    if write then
        commit = nil
        write()
    end
    return waiters.wait_until_reached(waiter)
end

return M
