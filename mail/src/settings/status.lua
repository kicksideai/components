-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local settings = require("settings")
local drivers = require("drivers")

local function status(): (types.DeliveryStatus?, error?)
    local denied = client.require_admin()
    if denied then return nil, denied end
    local config, err = settings.read("kickside.mail")
    if err then return nil, err end
    local values = config :: types.Settings
    local driver, driver_err = drivers.resolve(values.driver)
    if driver then driver_err = drivers.check_available(driver) end
    local from, from_err = drivers.sender(values)
    local reply_to, reply_err = drivers.reply_to(values)
    local issue = driver_err or from_err or reply_err
    local details = issue and issue:details() or {}
    if issue and details.code ~= "invalid_config" then return nil, issue end
    return {driver = driver and {id = driver.id, label = driver.label} or nil, configured = issue == nil,
        from = from, reply_to = reply_to, code = details.reason_code :: string?, reason = issue and ((details.reason :: string?) or issue:message()) or nil}, nil
end

return {status = status}
