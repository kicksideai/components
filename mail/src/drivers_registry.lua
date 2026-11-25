-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local contract = require("contract")
local funcs = require("funcs")
local config = require("config")

local M = {sender = config.sender, reply_to = config.reply_to}
local REQUIRED = {"id", "label", "icon", "description", "binding", "settings_ns", "available_func"}

function M.discover(): ({[string]: types.Driver}?, error?)
    local entries, err = registry.find({[".kind"] = "registry.entry", ["meta.type"] = "kickside.mail:driver"})
    if err then return nil, err end
    local drivers = {}
    for _, entry in ipairs(entries) do
        local data = entry.data :: types.Record
        for _, field in ipairs(REQUIRED) do
            if type(data[field]) ~= "string" or not (data[field] :: string):find("%S") then
                return nil, errors.new({kind = errors.INVALID, retryable = false,
                    message = "Mail driver " .. tostring(entry.id) .. " requires " .. field,
                    details = {code = "invalid_driver_descriptor"}})
            end
        end
        local limit_err = config.descriptor_error(data, tostring(entry.id))
        if limit_err then return nil, limit_err end
        local view = data.settings_view
        if view ~= nil and (type(view) ~= "string" or not view:match("^[a-z][a-z0-9_.-]*%-[a-z0-9_.-]+$")) then
            return nil, errors.new({kind = errors.INVALID, retryable = false,
                message = "Mail driver " .. tostring(entry.id) .. " requires a custom element tag for settings_view",
                details = {code = "invalid_driver_descriptor", field = "settings_view"}})
        end
        local driver = data :: types.Driver
        if drivers[driver.id] then
            return nil, errors.new({kind = errors.INVALID, retryable = false,
                message = "Multiple mail drivers declare the ID " .. driver.id,
                details = {code = "duplicate_driver_id"}})
        end
        drivers[driver.id] = driver
    end
    return drivers, nil
end

function M.resolve(id: string?): (types.Driver?, error?)
    if not id or id == "" then
        return nil, config.setup_error("An active mail driver is required", "driver_required", "Choose a delivery service for Mail.")
    end
    local drivers, err = M.discover()
    if err then return nil, err end
    if not drivers[id] then
        return nil, config.setup_error("The active mail driver is not installed", "driver_not_installed",
            "Choose an installed delivery service for Mail.")
    end
    return drivers[id], nil
end

function M.transport(driver: types.Driver): (types.Transport?, error?)
    local definition, err = contract.get("kickside.mail:transport")
    if err then return nil, err end
    local transport, open_err = definition:open(driver.binding)
    return transport :: types.Transport?, open_err
end

function M.availability(driver: types.Driver): (types.Availability?, error?)
    local state, err = funcs.call(driver.available_func)
    if err then return nil, err end
    if type(state) ~= "table" or type(state.available) ~= "boolean"
        or (state.code ~= nil and (type(state.code) ~= "string" or not state.code:match("^[a-z][a-z0-9_]*$")))
        or (state.reason ~= nil and (type(state.reason) ~= "string" or not state.reason:find("%S"))) then
        return nil, errors.new({kind = errors.INTERNAL, message = "The mail driver returned an invalid configuration status",
            retryable = false, details = {code = "driver_availability_invalid"}})
    end
    if state.available then return {available = true}, nil end
    return {available = false, code = (state.code :: string?) or "driver_not_configured",
        reason = (state.reason :: string?) or ("Complete the " .. driver.label .. " settings to send mail.")}, nil
end

function M.check_available(driver: types.Driver): error?
    local state, err = M.availability(driver)
    if err then return err end
    if not state.available then return config.setup_error(state.reason :: string, state.code) end
    local _, open_err = M.transport(driver)
    return open_err
end

return M
