-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local types = require("types")

local M = {
    MAX_ATTEMPTS = 5,
    RECHECK_MS = 30000,
    BATCH = 200,
    DAY_MS = 86400000,
}
local BASE_MS = 1000
local CAP_MS = 8000
local MAX_RETENTION_DAYS = 3650
local RETRYABLE = {
    [errors.RATE_LIMITED] = true,
    [errors.UNAVAILABLE] = true,
    [errors.TIMEOUT] = true,
}

function M.now(): integer
    return time.now():unix_nano() // 1000000
end

function M.retry_at(err: error, attempts: integer, now: integer): integer?
    if attempts >= M.MAX_ATTEMPTS or not err:retryable() then return nil end
    local details = err:details()
    if not RETRYABLE[err:kind()] and not (details and details.code == "send_in_progress") then return nil end
    return now + math.floor(math.min(CAP_MS, BASE_MS * 2 ^ (attempts - 1)))
end

function M.retention_days(value: unknown): integer?
    if type(value) ~= "number" or value < 1 or value > MAX_RETENTION_DAYS then return nil end
    return math.tointeger(value)
end

function M.validate_retention(input: types.SettingInput): types.SettingValidation
    if M.retention_days(input.value) then return {valid = true} end
    return {valid = false, error = "Retention days must be an integer from 1 to " .. tostring(MAX_RETENTION_DAYS)}
end

return M
