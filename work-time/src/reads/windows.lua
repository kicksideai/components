-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local access = require("access")
local input = require("input")
local types = require("types")
local M = {}
local DAY = 24 * time.HOUR
local FORMAT = "2006-01-02"
local WEEKDAY = { Mon = 0, Tue = 1, Wed = 2, Thu = 3, Fri = 4, Sat = 5, Sun = 6 }

function M.resolve(request: types.Request): (types.Window?, error?)
    local today, cutoff = input.dates(time.now())
    local first, last = request.from, request.to
    if not first and not last and request.item then return { from = cutoff, to = today }, nil end
    if not first or not last or first > last then
        return nil, access.problem(errors.INVALID, "invalid_time_query", "An ordered from and to date range is required")
    end
    local invalid = input.calendar_date(first) or input.calendar_date(last)
        or input.accept_date(first, today, cutoff) or input.accept_date(last, today, cutoff)
    if invalid then return nil, invalid end
    return { from = first, to = last }, nil
end

function M.monday(date: string): string
    local day = assert(time.parse(FORMAT, date))
    return day:add(-WEEKDAY[day:format("Mon")] * DAY):format(FORMAT)
end

function M.shift(date: string, days: integer): string
    return assert(time.parse(FORMAT, date)):add(days * DAY):format(FORMAT)
end

return M
