-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local security = require("security")
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
    local values, read_err = (catalog :: types.Catalog):policy_defaults({ catalog_id = id })
    if read_err then return fail(res, read_err) end
    res:write_json({ success = true, data = values })
end
return M
