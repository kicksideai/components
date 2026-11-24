-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The installed delivery drivers, for the Mail settings block. Only delivery administrators may list them.
local http = require("http")
local registry = require("registry")
local security = require("security")
local http_errors = require("http_errors")
local types = require("types")

local M = {}
local DELIVERY = "kickside.mail.api:delivery_status.endpoint"

local function fail(res: http.Response, err: error)
    res:set_status(http_errors.classify(err))
    res:write_json(http_errors.response(err))
end

local function text(value: unknown): string?
    if type(value) == "string" and value:find("%S") then return value :: string end
    return nil
end

function M.list()
    local req, res = http.request(), http.response()
    if not req or not res then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "HTTP context required" }) end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() then
        res:set_status(401)
        res:write_json({ success = false, error = "authentication required" })
        return
    end
    if not security.can("access", DELIVERY) then
        return fail(res, errors.new({ kind = errors.PERMISSION_DENIED, retryable = false,
            message = "Administer mail delivery access is required", details = { code = "mail_delivery_denied" } }))
    end
    local entries, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.mail:driver" })
    if err then return fail(res, err) end
    local drivers: { types.Driver } = {}
    for _, entry in ipairs(entries) do
        local data = entry.data :: types.Record
        local id, label, ns = text(data.id), text(data.label), text(data.settings_ns)
        if id and label and ns then
            drivers[#drivers + 1] = {
                id = id :: string, label = label :: string, icon = text(data.icon) or "tabler:mail",
                description = text(data.description) or "", settings_ns = ns :: string,
                settings_view = text(data.settings_view),
            }
        end
    end
    table.sort(drivers, function(a: types.Driver, b: types.Driver): boolean return a.label < b.label end)
    res:write_json({ success = true, data = { items = drivers } })
end

return M
