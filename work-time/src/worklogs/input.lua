-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local hash = require("hash")
local access = require("access")
local values = require("values")
local types = require("types")

local M = {}
local DATE = "2006-01-02"
local DAY = 24 * time.HOUR

local function invalid(code: string, message: string): error
    return access.problem(errors.INVALID, code, message)
end

local function positive(value: unknown): integer?
    return type(value) == "number" and value > 0 and math.tointeger(value) or nil
end

local function identifier(value: unknown): boolean
    return type(value) == "string" and #value > 0 and #value <= 255 and not value:find("\0", 1, true)
end

function M.dates(now: time.Time): (string, string)
    return now:utc():format(DATE), now:utc():add(-364 * DAY):format(DATE)
end

function M.explicit_delete_deadline(created: string): (string?, error?)
    local day, err = time.parse(DATE, created)
    if err or not day then return nil, err end
    return day:add(30 * DAY):format(DATE), nil
end

function M.calendar_date(date: unknown): error?
    if type(date) == "string" and date:match("^%d%d%d%d%-%d%d%-%d%d$") then
        local parsed, err = time.parse(DATE, date)
        if not err and parsed and parsed:format(DATE) == date then return nil end
    end
    return invalid("worklog_date_invalid", "Work date must be an ISO date")
end

function M.accept_date(date: string, today: string, cutoff: string): error?
    if date >= cutoff and date <= today then return nil end
    return invalid("worklog_date_invalid", "Work date must be an ISO date within the last 365 UTC calendar days")
end

function M.validate(raw: unknown, operation: string): error?
    if type(raw) ~= "table" then return invalid("worklog_request_invalid", "Expected a worklog request object") end
    local input = raw :: { [string]: unknown }
    if not identifier(input.board_id) then return invalid("worklog_board_invalid", "A board ID is required") end
    if operation == "create" then
        if not identifier(input.item) then return invalid("worklog_item_invalid", "An item ID is required") end
        if not identifier(input.key) then return invalid("worklog_key_invalid", "A replay key is required") end
    else
        if not identifier(input.id) then return invalid("worklog_id_invalid", "A worklog ID is required") end
        if not positive(input.expected_version) then return invalid("worklog_version_invalid", "An expected worklog version is required") end
    end
    if operation == "delete" then return nil end
    if operation == "create" or input.minutes ~= nil then
        if not positive(input.minutes) then return invalid("worklog_minutes_invalid", "Minutes must be a positive integer") end
    end
    if operation == "create" or input.work_date ~= nil then
        local err = M.calendar_date(input.work_date)
        if err then return err end
    end
    if input.note ~= nil and (type(input.note) ~= "string" or input.note:find("\0", 1, true) or not utf8.len(input.note)) then
        return invalid("worklog_note_invalid", "Note must be plain UTF-8 text")
    end
    if operation == "edit" and input.minutes == nil and input.work_date == nil and input.note == nil then
        return invalid("worklog_request_invalid", "An edit needs minutes, a work date or a note")
    end
    return nil
end

function M.fingerprint(request: types.Create): (string?, error?)
    local digest, err = hash.sha256(values.canonical({
        item = request.item, minutes = request.minutes, work_date = request.work_date, note = request.note,
    }))
    if err then return nil, err end
    return tostring(digest), nil
end

function M.round(minutes: integer, increment: integer): (integer?, error?)
    local rounded = minutes // increment
    if minutes % increment * 2 >= increment then rounded = rounded + 1 end
    if rounded > math.maxinteger // increment then
        return nil, invalid("worklog_minutes_invalid", "Rounded minutes exceed the supported integer range")
    end
    return math.max(1, rounded) * increment, nil
end

return M
