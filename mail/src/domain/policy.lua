-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {
    MAX_ATTEMPTS = 32,
    MAX_RETENTION_DAYS = 3650,
    RECHECK_MS = 30000,
    BATCH = 200,
    DAY_MS = 86400000,
}
local BASE_MS = 1000
local CAP_MS = 300000
local MAX_HINT_MS = 900000
local RETRYABLE = {
    [errors.RATE_LIMITED] = true,
    [errors.UNAVAILABLE] = true,
    [errors.TIMEOUT] = true,
}

function M.retry_at(err: error, attempts: integer, now: integer, idempotent: boolean): integer?
    if attempts >= M.MAX_ATTEMPTS or not err:retryable() then return nil end
    local details = err:details()
    local kind = err:kind()
    local code = details and details.code
    if not RETRYABLE[kind] and code ~= "send_in_progress" then return nil end
    if not idempotent and (kind == errors.TIMEOUT or code == "provider_transport_failed"
        or code == "send_in_progress" or code == "delivery_uncertain") then
        return nil
    end
    local delay = math.min(CAP_MS, BASE_MS * 2 ^ (attempts - 1))
    local hint = details and details.retry_after_ms
    if type(hint) == "number" and hint >= 0 and hint < math.huge then
        delay = math.max(delay, math.min(hint, MAX_HINT_MS))
    end
    return now + math.ceil(delay)
end

function M.retention_days(value: unknown): integer?
    if type(value) ~= "number" or value < 1 or value > M.MAX_RETENTION_DAYS then return nil end
    return math.tointeger(value)
end

return M
