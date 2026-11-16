-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local security = require("security")
local contract = require("contract")
local component = require("component")
local catalog_client = require("catalog_client")
local http_errors = require("http_errors")
local types = require("types")
local M = {}

local function fail(res: http.Response, err: error)
    res:set_status(http_errors.classify(err))
    res:write_json(http_errors.response(err))
end

function M.get()
    local req, res = http.request(), http.response()
    if not req or not res then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "HTTP context required" }) end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() then res:set_status(401); res:write_json({ success = false, error = "authentication required" }); return end
    local id = tostring(req:param("id") or "")
    if id == "" then return fail(res, errors.new({ kind = errors.INVALID, message = "catalog id required" })) end
    local catalog, err = catalog_client.open()
    if err or not catalog then return fail(res, err :: error) end
    local _, read_err = (catalog :: types.Catalog):get_schema({ catalog_id = id })
    if read_err then return fail(res, read_err) end
    local _, admin_err = component.validate_access(id, component.ACCESS.ADMIN)
    if admin_err then return fail(res, admin_err) end
    local definition, lookup_err = contract.get("kickside.settings:settings")
    if lookup_err then return fail(res, lookup_err) end
    local settings, open_err = definition:with_actor(security.actor()):with_scope(security.scope()):open()
    if open_err then return fail(res, open_err) end
    local result, read_defaults_err = (settings :: types.Settings):get_namespace({ namespace = "kickside.pim" })
    if read_defaults_err then return fail(res, read_defaults_err) end
    if not result or result.success ~= true or type(result.values) ~= "table" then
        return fail(res, errors.new({ kind = errors.UNAVAILABLE, message = "PIM policy defaults are unavailable" }))
    end
    res:write_json({ success = true, data = result.values })
end
return M
