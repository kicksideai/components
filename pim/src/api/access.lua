-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Shared parts of the catalog endpoints: the JSON response and the call through
-- the kickside.pim:catalog contract under the request's actor. The contract owns
-- access and validation; each endpoint answers { success, data } or the
-- platform's error classification.
local http = require("http")
local json = require("json")
local catalog_client = require("catalog_client")
local security = require("security")
local http_errors = require("http_errors")
local http_params = require("http_params")

local native_failure = require("native_failure")

local consts=require("consts")
local M = {}

type Envelope = { [string]: unknown }
type Body = { [string]: unknown }

local function respond(res: http.Response, status: number, body: Envelope)
    res:set_status(status)
    res:write_json(body)
end

local function failure(err: error): (number, Envelope)
    err = native_failure.coded(err, "internal")
    local status = http_errors.classify(err)
    return status, http_errors.response(err) :: Envelope
end

local function invalid(message: string, code: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code } })
end

local function reject(res: http.Response, err: error, status: number?)
    local classified, body = failure(err)
    respond(res, status or classified, body)
end

local function call(method: string, input: Body): (number, Envelope)
    local service, err = catalog_client.open()
    if err or not service then
        local status, body = failure(err :: error)
        return status, body
    end
    local fn = service[method]
    if not fn then
        local status, body = failure(errors.new({ kind = errors.INTERNAL, message = "catalog contract has no method " .. method,
            details = { code = "contract_unavailable" } }))
        return status, body
    end
    local data, cerr = fn(service, input)
    if cerr then
        local status, body = failure(cerr)
        return status, body
    end
    return http.STATUS.OK, { success = true, data = data }
end

local function begin(): (http.Response?, http.Request?)
    local res, req = http.response(), http.request({max_body=consts.LIMITS.request_bytes})
    if not res or not req then return nil, nil end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() then
        reject(res, errors.new({ kind = errors.PERMISSION_DENIED, message = "authentication required", details = { code = "authentication_required" } }), http.STATUS.UNAUTHORIZED)
        return nil, nil
    end
    return res, req
end

local function body_of(req: http.Request): (Body?, error?)
    local raw,read_err=req:body()
    if read_err then return nil,read_err end
    local text=raw or ""
    if text == "" then return {}, nil end
    local decoded, err = json.decode(text)
    if err then return nil, errors.new({ kind = errors.INVALID, message = "request body must be a JSON object", cause = err,
        details = { code = "invalid_json_body" } }) end
    if type(decoded) ~= "table" or (decoded :: { unknown })[1] ~= nil then
        return nil, invalid("request body must be a JSON object", "invalid_json_body")
    end
    return decoded :: Body, nil
end

-- ReadParams names what a read takes from its query string and route: text,
-- integer, JSON and comma-separated parameters, route parameters, and a product
-- addressed by sku or id.
type ReadParams = { text: { string }?, int: { string }?, bool: { string }?, json: { string }?, list: { string }?, path: { string }?, product: boolean? }

local function address(req: http.Request, input: Body, addressed: boolean?)
    if addressed ~= false then input.catalog_id = tostring(req:param("id") or "") end
end

-- command runs a contract method on the JSON body, with the named route parameters.
function M.command(method: string, path: { string }?, addressed: boolean?)
    local res, req = begin()
    if not res or not req then return end
    local input, err = body_of(req)
    if err or not input then return reject(res, err :: error) end
    address(req, input, addressed)
    for _, name in ipairs(path or {}) do input[name] = tostring(req:param(name) or "") end
    local status, body = call(method, input)
    respond(res, status, body)
end

-- read runs a contract method on parameters of the query string and route.
function M.read(method: string, params: ReadParams, addressed: boolean?)
    local res, req = begin()
    if not res or not req then return end
    local input: Body = {}
    address(req, input, addressed)
    for _, name in ipairs(params.path or {}) do input[name] = tostring(req:param(name) or "") end
    for _, name in ipairs(params.text or {}) do
        local v = req:query(name)
        if v and v ~= "" then input[name] = v end
    end
    for _, name in ipairs(params.int or {}) do
        local v, err = http_params.query_int(req, name)
        if err then return reject(res, err) end
        input[name] = v
    end
    for _, name in ipairs(params.bool or {}) do
        local v = req:query(name)
        if v == "true" then input[name] = true
        elseif v == "false" then input[name] = false
        elseif v and v ~= "" then return reject(res, invalid(name .. " must be true or false", "invalid_boolean_parameter")) end
    end
    for _, name in ipairs(params.json or {}) do
        local v = req:query(name)
        if v and v ~= "" then
            local decoded, err = json.decode(v)
            if err or type(decoded) ~= "table" then return reject(res, invalid(name .. " must be JSON", "invalid_json_parameter")) end
            input[name] = decoded
        end
    end
    for _, name in ipairs(params.list or {}) do
        local v = req:query(name)
        if v and v ~= "" then
            local items: { string } = {}
            for item in v:gmatch("[^,]+") do items[#items + 1] = item end
            input[name] = items
        end
    end
    if params.product then
        local id = req:query("id")
        if id and id ~= "" then
            input.product = { id = id }
        else
            local sku = req:query("sku")
            if sku and sku ~= "" then input.product = { sku = sku } end
        end
    end
    local status, body = call(method, input)
    respond(res, status, body)
end

return M
