-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A per-invocation clock for deadline assertions, without waiting on the runner.
local time = require("time")
local types = require("types")
local real = require("real")
local M = {}
local instant: time.Time? = nil
function M.reset()
    instant = time.now():utc()
end
function M.advance(ms: integer)
    instant = assert(instant):add(ms * time.MILLISECOND)
end
function M.deadline(ms: integer): types.Deadline
    if not instant then return real.deadline(ms) end
    local at = instant:add(ms * time.MILLISECOND)
    return { at = at:format("2006-01-02T15:04:05.000000000Z"), ns = at:unix_nano() }
end
function M.passed(boundary: types.Deadline): boolean
    if not instant then return real.passed(boundary) end
    return instant:unix_nano() >= boundary.ns
end
function M.clear()
    instant = nil
end
return M
