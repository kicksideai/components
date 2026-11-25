-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local types = require("types")
local drivers = require("drivers")
local client = require("client")

local function list(): ({items: {types.DriverSummary}}?, error?)
    local denied = client.require_admin()
    if denied then return nil, denied end
    local installed, err = drivers.discover()
    if err then return nil, err end
    local result: {types.DriverSummary} = {}
    for _, driver in pairs(installed) do
        local state, state_err = drivers.availability(driver)
        if state_err then return nil, state_err end
        local fields, fields_err = funcs.call("kickside.mail.read:driver_settings", driver.settings_ns)
        if fields_err then return nil, fields_err end
        result[#result + 1] = {id = driver.id, label = driver.label, icon = driver.icon,
            description = driver.description, settings_ns = driver.settings_ns, settings_view = driver.settings_view,
            availability = state, settings = fields :: {types.DriverSetting}}
    end
    table.sort(result, function(a: types.DriverSummary, b: types.DriverSummary): boolean
        if a.label ~= b.label then return a.label < b.label end
        return a.id < b.id
    end)
    return {items = result}, nil
end

return {list = list}
