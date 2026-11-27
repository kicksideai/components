-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local types = require("types")

local function read(): (types.DriverSelection?, error?)
    local definition, definition_err = contract.get("kickside.settings:settings")
    if definition_err then return nil, definition_err end
    local settings, open_err = definition:open()
    if open_err then return nil, open_err end
    local result, read_err = (settings :: types.SettingsContract):get({namespace = "kickside.mail", key = "driver"})
    if read_err then return nil, read_err end
    if not result or not result.success or type(result.value) ~= "string" then
        return nil, errors.new({kind = errors.INTERNAL, retryable = false,
            message = result and result.error or "Mail driver setting is invalid",
            details = {code = "settings_read_failed", namespace = "kickside.mail", key = "driver"}})
    end
    return {id = result.value, revision = result.revision or 0}, nil
end

return {read = read}
