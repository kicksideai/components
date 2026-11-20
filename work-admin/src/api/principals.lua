-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Display names resolve only after the caller reads this board through its contract.
local http = require("http")
local json = require("json")
local contract = require("contract")
local security = require("security")
local http_errors = require("http_errors")
local component = require("component")
local types = require("types")
local M = {}
local references = {
    type = "object", required = { "refs" },
    properties = { refs = {
        type = "array", maxItems = 200,
        items = { type = "object", required = { "type", "id" }, properties = {
            type = { enum = { "user", "group" } }, id = { type = "string", minLength = 1 },
        } },
    } },
}
local function fail(res: http.Response, err: error)
    res:set_status(http_errors.classify(err))
    res:write_json(http_errors.response(err))
end
local function open(id: string): (unknown, error?)
    local def, err = contract.get(id)
    if err then return nil, err end
    local bound, bind_err = def:with_actor(security.actor())
    if bind_err then return nil, bind_err end
    local scoped, scope_err = bound:with_scope(security.scope())
    if scope_err then return nil, scope_err end
    return scoped:open()
end
function M.post()
    local req, res = http.request(), http.response()
    if not req or not res then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "HTTP context required" }) end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() then res:set_status(401); res:write_json({ success = false, error = "authentication required" }); return end
    local id = tostring(req:param("id") or "")
    if id == "" then return fail(res, errors.new({ kind = errors.INVALID, message = "board id required" })) end
    local board, err = open("kickside.work:board")
    if err then return fail(res, err) end
    local _, access_err = (board :: types.Board):get_schema({ board_id = id })
    if access_err then return fail(res, access_err) end
    local _, admin_err = component.validate_access(id, component.ACCESS.ADMIN)
    if admin_err then return fail(res, admin_err) end
    local raw = req:body() or ""
    local valid = json.validate_string(references, raw)
    if not valid then
        return fail(res, errors.new({ kind = errors.INVALID, message = "refs must be an array of at most 200 user or group references",
            details = { code = "invalid_principal_refs" } }))
    end
    local body, body_err = json.decode(raw)
    if body_err then return fail(res, body_err) end
    local refs: { types.Map } = {}
    for _, ref in ipairs((body :: { refs: { types.Map } }).refs) do
        refs[#refs + 1] = { type = ref.type, id = ref.id }
    end
    local directory, directory_err = open("kickside.contract:directory")
    if directory_err then return fail(res, directory_err) end
    local result, resolve_err = (directory :: types.Directory):resolve({ refs = refs })
    if resolve_err then return fail(res, resolve_err) end
    res:write_json({ success = true, data = result })
end
return M
