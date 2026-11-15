-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Operands: request values resolved when a query compiles. { "$actor": "id" }
-- is the reader's actor and { "$now": "<ISO 8601 duration>" } the canonical
-- time at that offset from now, in weeks, days, hours, minutes and seconds.
-- Months and years vary in length, so they are refused.
local failure = require("failure")
local clock = require("clock")
local types = require("types")

local M = {}

-- MAX_OFFSET_SECONDS bounds a $now offset to the range of canonical timestamps.
local MAX_OFFSET_SECONDS = 86400 * 366 * 1000

local UNITS: { [string]: integer } = { W = 604800, D = 86400 }
local CLOCK_UNITS: { [string]: integer } = { H = 3600, M = 60, S = 1 }

local invalid = failure.invalid

-- seconds reads consecutive <digits><unit> pairs in the given units.
local function seconds(part: string, units: { [string]: integer }): integer?
    local total = 0
    local rest = part
    while rest ~= "" do
        local digits, unit, tail = rest:match("^(%d+)(%u)(.*)$")
        if not digits or not unit or not tail or #digits > 12 then return nil end
        local size = units[unit]
        local count = math.tointeger(tonumber(digits))
        if not size or not count then return nil end
        total = total + count * size
        rest = tail
    end
    return total
end

local function duration(text: string): integer?
    local sign, body = text:match("^(%-?)P(.+)$")
    if not sign or not body then return nil end
    local date, time_part = body:match("^([^T]*)T(.+)$")
    if not date or not time_part then date, time_part = body, "" end
    local day_seconds = seconds(date, UNITS)
    if not day_seconds then return nil end
    local clock_seconds = seconds(time_part, CLOCK_UNITS)
    if not clock_seconds then return nil end
    local total: integer = day_seconds + clock_seconds
    if total > MAX_OFFSET_SECONDS then return nil end
    return sign == "-" and -total or total
end

-- operand_name names the operand raw states, if it states one.
local function operand_name(raw: { [string]: unknown }): string?
    local name = next(raw)
    if type(name) == "string" and name:sub(1, 1) == "$" then return name end
    return nil
end

-- resolve returns raw, or the value of the operand raw states.
function M.resolve(reader: types.Reader, raw: unknown): (unknown, error?)
    if type(raw) ~= "table" then return raw, nil end
    local t = raw :: { [string]: unknown }
    local name = operand_name(t)
    if not name then return raw, nil end
    if next(t, name) ~= nil then return nil, invalid("an operand holds one key") end
    if name == "$actor" then
        if t[name] ~= "id" then return nil, invalid("$actor takes id") end
        if not reader.actor then return nil, invalid("$actor needs an identified reader") end
        return reader.actor, nil
    elseif name == "$now" then
        local text = t[name]
        local offset = type(text) == "string" and duration(text :: string) or nil
        if not offset then return nil, invalid("$now takes an ISO 8601 duration in weeks, days, hours, minutes and seconds") end
        return clock.offset(offset), nil
    end
    return nil, invalid("unknown operand " .. name)
end

return M
