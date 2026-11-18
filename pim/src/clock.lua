-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Instants PIM compares: command deadlines and the canonical
-- RFC3339 UTC timestamps stored as TEXT so they compare as text.
local time = require("time")
local precise_format = "2006-01-02T15:04:05.000000000Z07:00"

local M = {}

-- Deadline is one instant, as the RFC3339 text the threads contract takes and
-- as nanoseconds for local checks.
type Deadline = { at: string, ns: integer }
M.Deadline = Deadline

-- deadline is the instant ms milliseconds from now.
function M.deadline(ms: integer): Deadline
    local instant = time.now():utc():add(ms * time.MILLISECOND)
    return { at = instant:format(precise_format), ns = instant:unix_nano() }
end

-- passed reports whether the deadline is behind us.
function M.passed(d: Deadline): boolean
    return time.now():unix_nano() >= d.ns
end

-- now is the canonical RFC3339 UTC timestamp.
function M.now(): string
    return time.now():utc():format(time.RFC3339)
end

function M.now_precise(): string
    return time.now():utc():format(precise_format)
end

-- offset is the canonical timestamp seconds from now.
function M.offset(seconds: integer): string
    return time.now():utc():add(seconds * time.SECOND):format(time.RFC3339)
end

-- ago is the canonical timestamp days before now.
function M.ago(days: integer): string
    return M.offset(-days * 86400)
end

function M.millis(): integer
    return math.floor(time.now():unix_nano() / 1000000)
end

function M.after(at: string, days: integer): string
    return assert(time.parse(time.RFC3339, at)):add(days * 86400 * time.SECOND):format(time.RFC3339)
end
return M
