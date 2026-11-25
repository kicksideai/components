-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local message = require("message")
local transports = require("transports")
local policy = require("policy")

local function address(input: types.SettingInput): types.SettingValidation
    if input.value == "" or message.address(input.value) then return {valid = true} end
    return {valid = false, error = "Enter a valid email address"}
end

local function from_name(input: types.SettingInput): types.SettingValidation
    local issue = message.from_name_issue(input.value)
    return {valid = issue == nil, error = issue}
end

local function driver(args: types.SettingInput): (types.SettingValidation?, error?)
    local _, err = transports.status(args.value :: string?)
    if err then
        local details = err:details()
        if details and (details.code == "invalid_config" or details.code == "driver_not_admitted") then
            return {valid = false, error = err:message()}, nil
        end
        return nil, err
    end
    return {valid = true}, nil
end

local function retention(input: types.SettingInput): types.SettingValidation
    if policy.retention_days(input.value) then return {valid = true} end
    return {valid = false, error = "Retention days must be an integer from 1 to " .. tostring(policy.MAX_RETENTION_DAYS)}
end

return {address = address, from_name = from_name, driver = driver, retention = retention}
