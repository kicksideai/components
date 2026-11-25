-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local settings = require("settings")
local transports = require("transports")
local config = require("config")
local database = require("database")
local message_reader = require("message_reader")
local asset_file_repo = require("asset_file_repo")

local function content(row: types.MessageRow): (types.DeliveryContent?, error?)
    local decoded, err = message_reader.content(row)
    if err then return nil, err end
    return database.with_db(function(ex: database.Executor): (types.DeliveryContent?, error?)
        local assets, read_err = asset_file_repo.refs(ex, row.id)
        if read_err then return nil, read_err end
        return {addresses = decoded.addresses, attachments = decoded.attachments, assets = assets :: {types.AssetRef}}, nil
    end)
end

local function status(): (types.DeliveryStatus?, error?)
    local denied = client.require_admin()
    if denied then return nil, denied end
    local values, err = settings.mail()
    if err then return nil, err end
    local mail_settings = values :: types.Settings
    local driver_revision, revision_err = settings.revision("kickside.mail", "driver")
    if revision_err then return nil, revision_err end
    local available, list_err = transports.list()
    if list_err then return nil, list_err end

    local selected: types.AdmittedTransport?
    for _, candidate in ipairs(available) do
        if candidate.id == mail_settings.driver then
            selected = candidate :: types.AdmittedTransport?
            break
        end
    end
    local driver_err: error?
    if selected then
        driver_err = config.transport_ready_error(selected)
    else
        local _, open_err = transports.open(mail_settings.driver)
        driver_err = open_err
        if not driver_err then driver_err = config.driver_not_admitted() end
    end

    local from, from_err = config.sender(mail_settings)
    local reply_to, reply_err = config.reply_to(mail_settings)
    local issue = driver_err or from_err or reply_err
    local details = issue and issue:details() or {}
    if issue and details.code ~= "invalid_config" and details.code ~= "driver_not_admitted" then return nil, issue end
    return {driver = selected and {id = selected.id, label = selected.title} or nil,
        configured = issue == nil, ready = issue == nil, transports = available, from = from, reply_to = reply_to,
        driver_revision = driver_revision :: integer,
        code = (details.reason_code or details.code) :: string?,
        reason = issue and ((details.reason :: string?) or issue:message()) or nil}, nil
end

return {content = content, status = status}
