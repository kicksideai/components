-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Display names resolve only after the caller reads this catalog through its contract.
local http = require("http")
local json = require("json")
local contract = require("contract")
local security = require("security")
local catalog_client = require("catalog_client")
local http_errors = require("http_errors")
local component = require("component")
local types = require("types")
local M = {}
local function fail(res: http.Response, err: error)
    res:set_status(http_errors.classify(err))
    res:write_json(http_errors.response(err))
end
local function invalid_refs(): error
    return errors.new({ kind = errors.INVALID, message = "refs must be an array of at most 200 user or group references",
        details = { code = "invalid_principal_refs" } })
end
function M.post()
    local req, res = http.request(), http.response()
    if not req or not res then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "HTTP context required" }) end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() then res:set_status(401); res:write_json({ success = false, error = "authentication required" }); return end
    local id = tostring(req:param("id") or "")
    if id == "" then return fail(res, errors.new({ kind = errors.INVALID, message = "catalog id required" })) end
    local catalog, err = catalog_client.open()
    if err or not catalog then return fail(res, err :: error) end
    local _, access_err = (catalog :: types.Catalog):get_schema({ catalog_id = id })
    if access_err then return fail(res, access_err) end
    local _, admin_err = component.validate_access(id, component.ACCESS.ADMIN)
    if admin_err then return fail(res, admin_err) end
    local definition, lookup_err = contract.get("kickside.contract:directory")
    if lookup_err then return fail(res, lookup_err) end
    local method, method_err = definition:method("resolve")
    if method_err then return fail(res, method_err) end
    local schemas = method.input_schemas
    if not schemas or not schemas[1] then
        return fail(res, errors.new({ kind = errors.INTERNAL, message = "directory resolve declares no input schema" }))
    end
    local schema = schemas[1].definition :: unknown
    if type(schema) == "table" then
        local bytes = schema :: { integer }
        local decoded, schema_err = json.decode(string.char(table.unpack(bytes)))
        if schema_err then return fail(res, schema_err) end
        schema = decoded
    end
    local raw = req:body() or ""
    if not json.validate_string(schema, raw) then return fail(res, invalid_refs()) end
    local body, body_err = json.decode(raw)
    if body_err then return fail(res, body_err) end
    local request = body :: types.PrincipalRefs
    local refs = request.refs
    if #refs > 200 then return fail(res, invalid_refs()) end
    for _, ref in ipairs(refs) do
        if ref.id == "" then return fail(res, invalid_refs()) end
    end
    local directory, directory_err = definition:with_actor(security.actor()):with_scope(security.scope()):open()
    if directory_err then return fail(res, directory_err) end
    local result, resolve_err = (directory :: types.Directory):resolve({ refs = refs })
    if resolve_err then return fail(res, resolve_err) end
    res:write_json({ success = true, data = result })
end
return M
