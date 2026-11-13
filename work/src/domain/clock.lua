-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Instants Work compares: command and read deadlines, and the canonical
-- RFC3339 UTC timestamps stored as TEXT so they compare as text.
local time = require("time")
local types = require("types")

local M = {}

local STAMP = "2006-01-02T15:04:05.000000000Z"

-- deadline is the instant ms milliseconds from now.
function M.deadline(ms: integer): types.Deadline
    local instant = time.now():utc():add(ms * time.MILLISECOND)
    return { at = instant:format(STAMP), ns = instant:unix_nano() }
end

-- passed reports whether the deadline is behind us.
function M.passed(d: types.Deadline): boolean
    return time.now():unix_nano() >= d.ns
end

-- now is the canonical RFC3339 UTC timestamp.
function M.now(): string
    return time.now():utc():format(STAMP)
end

-- offset is the canonical timestamp seconds from now.
function M.offset(seconds: integer): string
    return time.now():utc():add(seconds * time.SECOND):format(STAMP)
end

return M
