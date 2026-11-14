-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
-- HTTP adapters over the kickside.work:board contract. Each endpoint opens the
-- contract under the request's actor and answers { success, data } or the
-- platform's error classification; the contract owns access and validation.
local http = require("http")
local json = require("json")
local board_client = require("board_client")
local security = require("security")
local http_errors = require("http_errors")

local M = {}

-- types.Envelope is the JSON body every endpoint answers.

function M.respond(res: http.Response, status: number, body: types.Envelope)
    res:set_status(status)
    res:write_json(body)
end

local function failure(err: error): (number, types.Envelope)
    local status = http_errors.classify(err)
    return status, http_errors.response(err) :: types.Envelope
end

function M.reject(res: http.Response, err: error)
    local status, body = failure(err)
    M.respond(res, status, body)
end

function M.invalid_json(res: http.Response)
    M.reject(res, errors.new({ kind = errors.INVALID, retryable = false, message = "invalid json",
        details = { code = "invalid_json" } }))
end


function M.call(method: string, input: types.Body, contract_id: string?): (number, types.Envelope)
    local data, err = board_client.call(method, input, contract_id)
    if err then
        local status, body = failure(err)
        return status, body
    end
    return http.STATUS.OK, { success = true, data = data }
end

local function begin(): (http.Response?, http.Request?)
    local res, req = http.response(), http.request()
    if not res or not req then return nil, nil end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() then
        local _, body = failure(errors.new({ details = { code = "access_denied" },  kind = errors.PERMISSION_DENIED, retryable = false, message = "authentication required" }))
        M.respond(res, http.STATUS.UNAUTHORIZED, body)
        return nil, nil
    end
    return res, req
end

local function body_of(req: http.Request): types.Body?
    local text = tostring(req:body() or "")
    if text == "" then return {} end
    local decoded: unknown = json.decode(text)
    if type(decoded) ~= "table" then return nil end
    return decoded :: types.Body
end

-- endpoint answers one route: it opens the request, decodes the body, copies
-- the route id into input[param] when a param is named and calls method on the
-- board contract, or on contract_id when one is named.
function M.endpoint(method: string, param: string?, contract_id: string?)
    local res, req = begin()
    if not res or not req then return end
    local input = body_of(req)
    if not input then return M.invalid_json(res) end
    if param then input[param] = tostring(req:param("id") or "") end
    if method == "list" and (contract_id == nil or contract_id == "kickside.work:packs") then
        for _, name in ipairs({ "limit", "after" }) do
            local raw = req:query(name)
            if raw ~= nil then input[name] = tonumber(raw) or raw end
        end
    end
    if method == "list" and contract_id == "kickside.work:packs" then input.pack = req:query("pack") end
    local status, body = M.call(method, input, contract_id)
    M.respond(res, status, body)
end

return M
