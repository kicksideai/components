-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local config = require("config")
local types = require("types")

local M = {}
local CONTRACT = "kickside.mail:transport"

local function not_installed(): error
    return config.setup_error("The active mail driver is not installed", "driver_not_installed",
        "Choose an installed delivery service for Mail.")
end

function M.open(id: string?): (types.Transport?, error?)
    if not id or id == "" then
        return nil, config.setup_error("An active mail driver is required", "driver_required", "Choose a delivery service for Mail.")
    end
    if not id:match("^[%w_.-]+:[%w_.-]+$") then return nil, not_installed() end
    local instance, err = contract.open(id)
    if err then
        if err:kind() == errors.PERMISSION_DENIED then return nil, config.driver_not_admitted() end
        if err:kind() == errors.NOT_FOUND then return nil, not_installed() end
        return nil, err
    end
    if not contract.is(instance, CONTRACT) then return nil, not_installed() end
    return instance :: types.Transport, nil
end

local function read_status(id: string, transport: types.Transport): (types.AdmittedTransport?, error?)
    local raw, err = transport:status()
    if err then return nil, err end
    local invalid = config.transport_status_error(raw, id)
    if invalid then return nil, invalid end
    local status = raw :: types.TransportStatus
    return {id = id, title = status.title, icon = status.icon, description = status.description, settings_ns = status.settings_ns,
        ready = status.ready, idempotent = status.idempotent, code = status.code, reason = status.reason,
        max_recipients = status.max_recipients, max_message_bytes = status.max_message_bytes}, nil
end

function M.status(id: string?): (types.AdmittedTransport?, error?, types.Transport?)
    local transport, err = M.open(id)
    if err then return nil, err end
    local status, status_err = read_status(id :: string, transport :: types.Transport)
    if status_err then return nil, status_err end
    return status :: types.AdmittedTransport?, nil, transport
end

function M.list(): ({types.AdmittedTransport}?, error?)
    local ids, err = contract.find_implementations(CONTRACT)
    if err then return nil, err end
    local result: {types.AdmittedTransport} = {}
    for _, id in ipairs(ids) do
        local instance, open_err = contract.open(id)
        if open_err then
            local kind = open_err:kind()
            if kind ~= errors.PERMISSION_DENIED and kind ~= errors.NOT_FOUND then return nil, open_err end
        else
            local status, status_err = read_status(id, instance :: types.Transport)
            if status_err then return nil, status_err end
            result[#result + 1] = status :: types.AdmittedTransport
        end
    end
    table.sort(result, function(a: types.AdmittedTransport, b: types.AdmittedTransport): boolean
        if a.title ~= b.title then return a.title < b.title end
        return a.id < b.id
    end)
    return result, nil
end

return M
