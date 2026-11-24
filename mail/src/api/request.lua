-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local json = require("json")
local security = require("security")
local types = require("types")
local http_errors = require("http_errors")
local canonical = require("canonical_json")

local M = {}

function M.invalid(message: string): error
    return errors.new({kind = errors.INVALID, message = message, retryable = false, details = {code = "invalid_request"}})
end

local function fail(res: http.Response, err: error, status: integer?)
    local body = http_errors.response(err)
    local detail = err:details() or {}
    body.code = detail.code or err:kind()
    res:set_status(status or http_errors.classify(err))
    res:write_json(body)
end

local function shape_content(value: unknown)
    if type(value) ~= "table" then return end
    local content = value :: types.Record
    if type(content.schema) == "table" then content.schema = canonical.normalize_schema(content.schema) end
    if type(content.samples) == "table" then content.samples = canonical.object(content.samples) end
end

local function shape_row(row: types.Record)
    shape_content(row)
    shape_content(row.original)
    shape_content(row.content)
end

local function shape_result(result: unknown)
    if type(result) ~= "table" then return end
    local row = result :: types.Record
    shape_row(row)
    if type(row.items) == "table" then
        for _, item in ipairs(row.items :: {types.Record}) do shape_row(item) end
    end
end

function M.handle(check: (() -> error?)?, run: (http.Request) -> (unknown, error?), status: integer?,
    respond: ((http.Request, http.Response, unknown) -> error?)?)
    local req, res = http.request(), http.response()
    if not req or not res then return nil, errors.new({kind = errors.UNAVAILABLE, message = "HTTP context required"}) end
    res:set_content_type(http.CONTENT.JSON)
    local actor, actor_err = security.actor()
    if actor_err then return fail(res, actor_err) end
    if not actor then
        return fail(res, errors.new({kind = errors.PERMISSION_DENIED, message = "Authentication required",
            details = {code = "authentication_required"}}), 401)
    end
    local denied = check and check()
    if denied then return fail(res, denied) end
    local result, err = run(req)
    if err then return fail(res, err) end
    if respond then return respond(req, res, result) end
    res:set_status(status or 200)
    shape_result(result)
    res:write_json({success = true, data = result})
end

function M.body(req: http.Request, optional: boolean?): (types.Record?, error?)
    local raw, read_err = req:body()
    if read_err then return nil, read_err end
    if optional and (raw == nil or raw == "") then return {}, nil end
    if type(raw) ~= "string" or not raw:match("^%s*{") then return nil, M.invalid("A JSON object is required") end
    local value, err = json.decode(raw)
    if err or type(value) ~= "table" then return nil, M.invalid("A valid JSON object is required") end
    return value :: types.Record, nil
end

function M.key(req: http.Request): types.ResourceKey
    return {kind = req:param("kind") or "message", name = req:param("name") or ""}
end

function M.resource(req: http.Request): (types.Record?, error?)
    local body, err = M.body(req)
    if err then return nil, err end
    local key = M.key(req)
    if (body.kind ~= nil and body.kind ~= key.kind) or (body.name ~= nil and body.name ~= key.name) then
        return nil, M.invalid("The resource key must match the URL")
    end
    body.kind, body.name = key.kind, key.name
    return body, nil
end

function M.items(items: unknown, err: error?): (types.Record?, error?)
    if err then return nil, err end
    return {items = items}, nil
end

return M
