-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A read shares one scan allowance and the earlier of its caller and module deadlines.
local time = require("time")
local clock = require("clock")
local consts = require("consts")
local types = require("types")
local M = {}
function M.start(asked: types.ReadBudget?): (types.ReadAllowance?, error?)
    local rows = asked and asked.rows or 200000
    if math.tointeger(rows) == nil or rows < 1 or rows > 200000 then
        return nil, errors.new({ kind = errors.INVALID, message = "read scan allowance is 1..200000", details = { code = "invalid_read_budget" } })
    end
    local deadline = clock.deadline(consts.LIMITS.read_deadline_ms)
    if asked and asked.deadline then
        local at, err = time.parse(time.RFC3339, asked.deadline)
        if err or not at then return nil, errors.new({ kind = errors.INVALID, message = "read deadline is an instant", details = { code = "invalid_read_budget" } }) end
        if at:unix_nano() < deadline.ns then deadline = { at = asked.deadline, ns = at:unix_nano() } end
    end
    return { rows = rows, remaining = rows, deadline = deadline }, nil
end
function M.expired(allowance: types.ReadAllowance): boolean
    return allowance.remaining <= 0 or clock.passed(allowance.deadline)
end
function M.check(allowance: types.ReadAllowance): error?
    if clock.passed(allowance.deadline) then
        return errors.new({ kind = errors.TIMEOUT, message = "read deadline passed", details = { code = "read_deadline" } })
    end
    return nil
end
function M.usage(allowance: types.ReadAllowance): (types.BudgetUsage?, error?)
    local err = M.check(allowance)
    if err then return nil, err end
    return { rows_scanned = allowance.rows - allowance.remaining, rows_remaining = allowance.remaining,
        deadline_remaining_ms = math.max(0, math.floor((allowance.deadline.ns - time.now():unix_nano()) / 1000000)) }, nil
end

-- Point reads keep one deadline through snapshot work and reference resolution.
function M.run<T>(request: { budget: types.ReadBudget? }, read: (types.ReadContext) -> (T?, error?)): (T?, error?)
    local allowance, err = M.start(request.budget)
    if err or not allowance then return nil, err end
    local context: types.ReadContext = { allowance = allowance, admitted = {}, holders = {} }
    local result, rerr = read(context)
    if rerr then return nil, rerr end
    local expired = M.check(allowance)
    if expired then return nil, expired end
    return result, nil
end
return M
