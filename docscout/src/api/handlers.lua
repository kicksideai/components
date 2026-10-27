-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local extractors = require("extractors")
local http_errors = require("http_errors")
local M = {}
local function respond(value,err,status)
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)
    if err then
        res:set_status(http_errors.for_error(err))
        res:write_json({success=false,error=tostring(err)})
    else
        res:set_status(status or 200)
        res:write_json(value)
    end
end
local function body()
    local value,err = http.request():body_json()
    if err then return nil, errors.new({kind=errors.INVALID,message="Request must be valid JSON"}) end
    return value,nil
end
function M.create()
    local dto,err=body()
    if err then return respond(nil,err) end
    local value,create_err=extractors.create(dto)
    respond(value,create_err,201)
end
function M.get() respond(extractors.get(http.request():param("id"))) end
function M.list() respond(extractors.list()) end
function M.update()
    local dto,err=body()
    if err then return respond(nil,err) end
    respond(extractors.update(http.request():param("id"),dto))
end
function M.delete() respond(extractors.delete(http.request():param("id"))) end
function M.add_case()
    local dto,err=body()
    if err then return respond(nil,err) end
    respond(extractors.add_case(http.request():param("id"),dto))
end
function M.delete_case() respond(extractors.delete_case(http.request():param("id"),http.request():param("case_id"))) end
return M
