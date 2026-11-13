-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local document = require("document")
local time = require("time")
local types = require("types")
local M = {}
local STAMP = "2006-01-02T15:04:05.000000000Z"

function M.duration(raw: unknown, options: { signed: boolean?, zero: boolean? }?): (number?, error?)
    local sign = 1
    if options and options.signed and type(raw) == "string" and raw:sub(1, 1) == "-" then sign, raw = -1, raw:sub(2) end
    if type(raw) == "string" and raw:sub(1, 1) == "P" then
        local rest = raw:sub(2)
        local seconds = 0
        local weeks = rest:match("^(%d+)W$")
        if weeks then
            seconds, rest = (tonumber(weeks) :: number) * 604800, ""
        else
            local days, tail = rest:match("^(%d+)D(.*)$")
            if days then seconds, rest = (tonumber(days) :: number) * 86400, tail :: string end
            if rest:sub(1, 1) == "T" then
                rest = rest:sub(2)
                if rest == "" then rest = "invalid" end
                for _, unit in ipairs({ { suffix = "H", scale = 3600 }, { suffix = "M", scale = 60 }, { suffix = "S", scale = 1 } }) do
                    local pattern = unit.suffix == "S" and "^(%d+%.?%d*)S(.*)$" or "^(%d+)" .. unit.suffix .. "(.*)$"
                    local amount, tail = rest:match(pattern)
                    if amount then seconds, rest = seconds + (tonumber(amount) :: number) * unit.scale, tail :: string end
                end
            end
        end
        if rest == "" and raw ~= "P" and (seconds > 0 or (options and options.zero)) and seconds < math.huge then return sign * seconds, nil end
    end
    return nil, errors.new({ kind = errors.INVALID, message = "duration is a positive wall-clock ISO 8601 duration", details = { code = "timer_duration_invalid" } })
end

function M.after(at: string, duration: string): (string?, error?)
    local seconds, err = M.duration(duration)
    if err or not seconds then return nil, err end
    local instant, ierr = time.parse(time.RFC3339, at)
    if ierr then return nil, ierr end
    return instant:utc():add(math.floor(seconds * 1000000000)):format(STAMP), nil
end

function M.deadline(timer: types.Timer, item: types.Item, board: types.Board, entered: string): (string?, error?)
    if timer.at_field then
        local f = board.model.fields[timer.at_field]
        local value = document.value(item.document, f.id)
        if value == nil then return nil, nil end
        return value :: string, nil
    end
    local duration = timer.after
    if timer.by then
        local f = board.model.fields[timer.by]
        local value = document.value(item.document, f.id)
        local key = type(value) == "string" and value or tostring(value)
        duration = timer.table[key]
        if not duration then return nil, errors.new({ kind = errors.INVALID, message = "timer lookup has no duration for " .. key, details = { code = "timer_lookup_missing" } }) end
    end
    return M.after(entered, duration :: string)
end
return M
