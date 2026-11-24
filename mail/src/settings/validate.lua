-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local message = require("message")
local drivers = require("drivers")
local policy = require("policy")

local function address(input: types.SettingInput): types.SettingValidation
    if input.value == "" or message.address(input.value) then return {valid = true} end
    return {valid = false, error = "Enter a valid email address"}
end

local function driver(args: types.SettingInput): (types.SettingValidation?, error?)
    local _, err = drivers.resolve(args.value :: string?)
    if err then
        local details = err:details()
        if details and details.code == "invalid_config" then return {valid = false, error = err:message()}, nil end
        return nil, err
    end
    return {valid = true}, nil
end

local function retention(input: types.SettingInput): types.SettingValidation
    if policy.retention_days(input.value) then return {valid = true} end
    return {valid = false, error = "Retention days must be an integer from 1 to " .. tostring(policy.MAX_RETENTION_DAYS)}
end

return {address = address, driver = driver, retention = retention}
