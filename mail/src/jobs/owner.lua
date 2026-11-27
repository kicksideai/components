-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local retention = require("retention")
local settings = require("settings")
local time = require("time")
local types = require("types")

local function run(input: types.OwnerInput): types.OwnerResult
    local window, err = settings.retention_window()
    if err then return {success = false, error = err} end
    local now = time.now():unix_nano() // 1000000
    local result, sweep_err = retention.sweep(now, window :: integer, input)
    if sweep_err then return {success = false, error = sweep_err} end
    return result :: types.OwnerResult
end

return {run = run}
