-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local json = require("json")
local creation = require("creation")
local http_errors = require("http_errors")

local function handler()
    local req, res = http.request(), http.response()
    if not req or not res then return end
    res:set_content_type(http.CONTENT.JSON)
    local raw, body_err = req:body()
    local input, decode_err = nil, nil
    if not body_err then input, decode_err = json.decode(raw) end
    if body_err or decode_err or type(input) ~= "table" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({success=false, error="invalid request body"})
        return
    end
    local result, err = creation.create(input)
    if err then
        res:set_status(http_errors.classify(err))
        res:write_json({success=false, error=tostring(err), kind=err:kind()})
        return
    end
    res:set_status(http.STATUS.OK)
    res:write_json(result)
end
return {handler=handler}
