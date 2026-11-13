-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Operands: request values resolved when a query compiles. { "$actor": "id" }
-- is the reader's actor and { "$now": "<ISO 8601 duration>" } the canonical
-- time at that offset from now, in weeks, days, hours, minutes and seconds.
-- Months and years vary in length, so they are refused.
local clock = require("clock")
local seams = require("seams")
local durations = require("durations")
local types = require("types")

local M = {}

-- MAX_OFFSET_SECONDS bounds a $now offset to the range of canonical timestamps.
local MAX_OFFSET_SECONDS = 86400 * 366 * 1000

local function invalid(message: string): error
    return errors.new({ details = { code = "invalid_operand" }, kind = errors.INVALID, message = message })
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
    if name == "$operand" then return seams.operand(reader, t[name]) end
    if name == "$actor" then
        if t[name] ~= "id" then return nil, invalid("$actor takes id") end
        if not reader.actor then return nil, invalid("$actor needs an identified reader") end
        return reader.actor, nil
    elseif name == "$now" then
        local text = t[name]
        local parsed = durations.duration(text, { signed = true, zero = true })
        local offset = parsed and math.tointeger(parsed)
        if not offset or math.abs(offset) > MAX_OFFSET_SECONDS then return nil, invalid("$now takes an ISO 8601 duration in weeks, days, hours, minutes and seconds") end
        return clock.offset(offset), nil
    end
    return nil, invalid("unknown operand " .. name)
end

return M
