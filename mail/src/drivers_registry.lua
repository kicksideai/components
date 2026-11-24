-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local contract = require("contract")
local funcs = require("funcs")
local settings = require("settings")

local M = {}
local LIMITS = {"max_recipients", "max_message_bytes"}
local REQUIRED = {"id", "label", "icon", "description", "binding", "settings_ns", "available_func"}

local function discover(): ({[string]: types.Driver}?, error?)
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
        for _, field in ipairs(LIMITS) do
            local value = data[field]
            if value ~= nil and (type(value) ~= "number" or value < 1 or value % 1 ~= 0) then
                return nil, errors.new({kind = errors.INVALID, retryable = false,
                    message = "Mail driver " .. tostring(entry.id) .. " requires a positive integer for " .. field,
                    details = {code = "invalid_driver_descriptor"}})
            end
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
    if not id or id == "" then return nil, settings.missing("An active mail driver is required") end
    local drivers, err = discover()
    if err then return nil, err end
    if not drivers[id] then return nil, settings.missing("The active mail driver is not installed") end
    return drivers[id], nil
end

function M.transport(driver: types.Driver): (types.Transport?, error?)
    local definition, err = contract.get("kickside.mail:transport")
    if err then return nil, err end
    local transport, open_err = definition:open(driver.binding)
    return transport :: types.Transport?, open_err
end

function M.check_available(driver: types.Driver): error?
    local state, err = funcs.call(driver.available_func)
    if err then return err end
    if type(state) ~= "table" then
        return errors.new({kind = errors.INTERNAL, message = "The mail driver returned no configuration status",
            retryable = false, details = {code = "driver_availability_invalid"}})
    end
    if state.available ~= true then
        return settings.missing((state.reason :: string?) or "The active mail driver is not configured")
    end
    local _, open_err = M.transport(driver)
    return open_err
end

return M
