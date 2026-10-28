-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- HTTP handlers for extractors, their evaluation cases and evaluations. Errors
-- answer with the canonical envelope: message, kind, retryability and details.
local http = require("http")
local extractors = require("extractors")
local evals = require("evals")
local http_errors = require("http_errors")

local M = {}

local function respond(value: any, err: any, status: integer?)
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)
    if err then
        res:set_status(http_errors.for_error(err))
        res:write_json(http_errors.response(err))
        return
    end
    res:set_status(status or 200)
    res:write_json(value)
end

local function body(): (any?, error?)
    local value, err = http.request():body_json()
    if err or type(value) ~= "table" then return nil, errors.new({ kind = errors.INVALID, message = "Request must be a JSON object" }) end
    return value, nil
end

-- Path parameters come from the route template, so they are always present.
local function param(name: string): string return http.request():param(name) :: string end

function M.create()
    local dto, err = body()
    if err then return respond(nil, err) end
    local value, create_err = extractors.create(dto)
    respond(value, create_err, 201)
end

function M.get() respond(extractors.get(param("id"))) end

function M.list() respond(extractors.list()) end

function M.update()
    local dto, err = body()
    if err then return respond(nil, err) end
    respond(extractors.update(param("id"), dto))
end

function M.delete() respond(extractors.delete(param("id"))) end

function M.add_case()
    local dto, err = body()
    if err then return respond(nil, err) end
    local value, add_err = extractors.add_case(param("id"), dto)
    respond(value, add_err, 201)
end

function M.delete_case() respond(extractors.delete_case(param("id"), param("case_id"))) end

function M.start_eval()
    local value, err = evals.start(param("id"))
    respond(value, err, 202)
end

function M.list_evals() respond(evals.list(param("id"))) end

function M.get_eval() respond(evals.get(param("id"), param("eval_id"))) end

return M
