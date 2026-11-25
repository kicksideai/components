-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local config = require("config")
local policy = require("policy")
local retention = require("retention")
local settings = require("settings")
local time = require("time")
local types = require("types")

local function run(input: types.OwnerInput): types.OwnerResult
    local values, err = settings.mail()
    if err then return {success = false, error = err} end
    local days = policy.retention_days(values.log_retention_days)
    if not days then
        return {success = false, error = config.setup_error("Mail delivery log retention days are invalid")}
    end
    local now = time.now():unix_nano() // 1000000
    local result, sweep_err = retention.sweep(now, days * policy.DAY_MS, input)
    if sweep_err then return {success = false, error = sweep_err} end
    return result :: types.OwnerResult
end

return {run = run}
