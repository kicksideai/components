-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local message = require("message")

local function validate(input: types.SettingInput): types.SettingValidation
    if input.value == "" or message.address(input.value) then return {valid = true} end
    return {valid = false, error = "Enter a valid email address"}
end

return {validate = validate}
