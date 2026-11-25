-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local settings = require("settings")
local drivers = require("drivers")
local config = require("config")
local settings_types = require("settings_types")
local definitions = require("settings_defs")

local function transports(installed: {[string]: types.Driver}): ({types.TransportStatus}?, error?)
    local result: {types.TransportStatus} = {}
    for _, driver in pairs(installed) do
        local opened, open_err = drivers.transport(driver)
        if open_err and open_err:kind() ~= errors.PERMISSION_DENIED and open_err:kind() ~= errors.NOT_FOUND then
            return nil, open_err
        end
        if opened then
            local state, err = drivers.availability(driver)
            if err then return nil, err end
            result[#result + 1] = {id = driver.id, title = driver.label, icon = driver.icon,
                description = driver.description, settings_ns = driver.settings_ns, ready = state.available,
                code = state.code, reason = state.reason,
                max_recipients = driver.max_recipients, max_message_bytes = driver.max_message_bytes}
        end
    end
    table.sort(result, function(a: types.TransportStatus, b: types.TransportStatus): boolean
        if a.title ~= b.title then return a.title < b.title end
        return a.id < b.id
    end)
    return result, nil
end

local function status(): (types.DeliveryStatus?, error?)
    local denied = client.require_admin()
    if denied then return nil, denied end
    local values, err = settings.mail()
    if err then return nil, err end
    local installed, discovery_err = drivers.discover()
    if discovery_err then return nil, discovery_err end
    local available, list_err = transports(installed)
    if list_err then return nil, list_err end

    local driver = installed[values.driver]
    local driver_err: error?
    if not driver then
        local _, issue = drivers.resolve(values.driver)
        driver_err = issue
    else
        local selected: types.TransportStatus?
        for _, candidate in ipairs(available) do
            if candidate.id == driver.id then selected = candidate break end
        end
        if not selected then
            driver_err = config.setup_error("The active mail driver is not admitted", "driver_not_admitted",
                "Choose an admitted delivery service for Mail.")
        elseif not selected.ready then
            driver_err = config.setup_error(selected.reason :: string, selected.code)
        end
    end
    local from, from_err = config.sender(values)
    local reply_to, reply_err = config.reply_to(values)
    local issue = driver_err or from_err or reply_err
    local details = issue and issue:details() or {}
    if issue and details.code ~= "invalid_config" then return nil, issue end
    return {driver = driver and {id = driver.id, label = driver.label} or nil,
        configured = issue == nil, ready = issue == nil, transports = available, from = from, reply_to = reply_to,
        code = details.reason_code :: string?, reason = issue and ((details.reason :: string?) or issue:message()) or nil}, nil
end

local function driver_settings(namespace: string): ({types.DriverSetting}?, error?)
    local snapshot, err = settings.namespace(namespace)
    if err then return nil, err end
    local overrides: {[string]: boolean} = {}
    for _, key in ipairs(snapshot.overridden or {}) do overrides[key] = true end
    local values = snapshot.values or {}
    local result: {types.DriverSetting} = {}
    for key, def in pairs(definitions.all()[namespace] or {}) do
        if def.read_access == nil or def.read_access == "admin" then
            local secret = settings_types.SECRET_TYPES[def.value_type] == true
            local row: types.DriverSetting = {namespace = namespace, key = key, value_type = def.value_type,
                title = def.title, description = def.description, order = def.order, editable = def.editable,
                schema = def.schema, is_secret = secret}
            if secret then
                row.has_value = overrides[key] == true
            else
                row.value, row.default = values[key], def.default
            end
            result[#result + 1] = row
        end
    end
    table.sort(result, function(a: types.DriverSetting, b: types.DriverSetting): boolean
        if (a.order or 100) ~= (b.order or 100) then return (a.order or 100) < (b.order or 100) end
        return a.key < b.key
    end)
    return result, nil
end

return {status = status, driver_settings = driver_settings}
