-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local time = require("time")
local real = require("real")
local types = require("types")

local M = { shift = real.shift }

-- The harness can set the clock for a single owner callback.
function M.deadline(ms: integer): types.Deadline
    local now_ms = ctx.get("work_retention_now_ms")
    if type(now_ms) ~= "number" then return real.deadline(ms) end
    local ns = (now_ms + ms) * time.MILLISECOND
    local instant = time.unix(ns // time.SECOND, ns % time.SECOND):utc()
    return { at = instant:format("2006-01-02T15:04:05.000000000Z"), ns = instant:unix_nano() }
end

function M.now(): string
    return M.deadline(0).at
end

return M
