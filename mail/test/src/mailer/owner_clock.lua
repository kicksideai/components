-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local policy = require("policy")

local function now(): integer
    local now, err = ctx.get("mail_test_now")
    if err and err:kind() == errors.NOT_FOUND then return policy.now() end
    if err then error(err) end
    return now :: integer
end

return {
    now = now,
    BATCH = policy.BATCH,
    DAY_MS = policy.DAY_MS,
    RECHECK_MS = policy.RECHECK_MS,
    retention_days = policy.retention_days,
}
