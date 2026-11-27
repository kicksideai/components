-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local thread_events = require("thread_events")
local types = require("types")

local function run(input: {target: integer, deadline: string}): (boolean?, error?)
    local threads, open_err = thread_events.open()
    if open_err then return nil, open_err end
    local result, err = (threads :: types.LibraryThreads):catch_up_projection({
        thread_id = thread_events.library_thread_id(), kind = "kickside.mail:library_tables",
        target_seq = input.target, deadline = input.deadline,
    })
    if err then return nil, err end
    return result.done, nil
end

return {run = run}
