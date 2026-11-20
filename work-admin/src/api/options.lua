-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Configuration discovery retains the caller's actor and scope at every boundary.
local http = require("http")
local contract = require("contract")
local security = require("security")
local component = require("component")
local http_errors = require("http_errors")
local field_types = require("field_types")
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
    if id == "" then return fail(res, errors.new({ kind = errors.INVALID, message = "board id required" })) end
    local def, err = contract.get("kickside.work:board")
    if err then return fail(res, err) end
    local bound, bind_err = def:with_actor(security.actor())
    if bind_err then return fail(res, bind_err) end
    local scoped, scope_err = bound:with_scope(security.scope())
    if scope_err then return fail(res, scope_err) end
    local client, open_err = scoped:open()
    if open_err then return fail(res, open_err) end
    local board = client :: types.Board
    local granted: { [string]: boolean } = {}
    for level, mask in pairs({ read = component.ACCESS.READ, write = component.ACCESS.WRITE, admin = component.ACCESS.ADMIN }) do
        local _, access_err = component.validate_access(id, mask)
        if access_err and access_err:kind() ~= errors.PERMISSION_DENIED then return fail(res, access_err) end
        granted[level] = access_err == nil
    end
    local options: types.Map = { plugins = {} }
    local installed: { types.FieldTypeOption } = {}
    local admission_err: error?
    if granted.admin then
        local found: types.Map?
        found, admission_err = board:schema_options({ board_id = id })
        if found then options = found end
    else
        local _, read_err = board:get_schema({ board_id = id })
        admission_err = read_err
    end
    if admission_err and (admission_err:details() or {}).code ~= "board_schema_missing" then return fail(res, admission_err) end
    if granted.admin then
        local found_types, types_err = field_types.field_types()
        if types_err then return fail(res, types_err) end
        installed = found_types or {}
    end
    res:write_json({ success = true, data = { access = granted, schema_options = options, installed_types = installed } })
end
return M
