-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Configuration discovery retains the caller's actor and scope at every boundary.
local http = require("http")
local contract = require("contract")
local security = require("security")
local component = require("component")
local http_errors = require("http_errors")
local plugins = require("plugins")
local types = require("types")
local catalog = require("catalog")
local M = {}
local function fail(res: http.Response, err: error)
    res:set_status(http_errors.classify(err))
    res:write_json(http_errors.response(err))
end
local function schema_missing(err: error): boolean
    return (err:details() or {}).code == "board_schema_missing"
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
    local options: types.SchemaOptions = { plugins = {}, field_types = {} }
    local choices = catalog.empty()
    if granted.admin then
        local found, options_err = board:schema_options({ board_id = id })
        if options_err then
            if not schema_missing(options_err) then return fail(res, options_err) end
            local found_types, types_err = plugins.field_types()
            if types_err then return fail(res, types_err) end
            options.field_types = found_types or {}
        elseif found then
            options = found
        end
        local discover, discovery_err = catalog.load(found)
        if discovery_err then return fail(res, discovery_err) end
        choices = assert(discover)
    else
        local _, read_err = board:get_schema({ board_id = id })
        if read_err and not schema_missing(read_err) then return fail(res, read_err) end
    end
    res:write_json({ success = true, data = { access = granted, schema_options = options, installed_types = options.field_types,
        guards = choices.guards, filters = choices.filters, board_apps = choices.board_apps } })
end
return M
