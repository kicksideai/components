-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Projection waits fit within both the command budget and the enclosing job.
local time = require("time")
local clock = require("clock")
local consts = require("consts")
local types = require("types")

local M = {}
function M.bound(boundary: string?): (types.Deadline?, error?)
    local deadline = clock.deadline(consts.LIMITS.command_deadline_ms)
    if boundary then
        local instant, err = time.parse(time.RFC3339, boundary)
        if err or not instant then
            return nil, errors.new({ kind = errors.INVALID, retryable = false,
                message = "job deadline is malformed", details = { code = "job_deadline" } })
        end
        local ns = instant:unix_nano()
        if ns < deadline.ns then deadline = { at = boundary, ns = ns } end
    end
    if clock.passed(deadline) then
        return nil, errors.new({ kind = errors.TIMEOUT, retryable = true,
            message = "job deadline passed", details = { code = "job_deadline" } })
    end
    return deadline, nil
end
return M
