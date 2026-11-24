-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local hash = require("hash")
local http = require("http")
local types = require("types")
local client = require("client")
local request = require("request")

local function respond(req: http.Request, res: http.Response, output: unknown): error?
    local asset = output :: types.AssetContent
    local condition, header_err = req:header("If-None-Match")
    if header_err then return header_err end
    local digest, hash_err = hash.sha256(asset.content_type .. "\0" .. asset.bytes)
    if hash_err then return hash_err end
    local etag = '"' .. tostring(asset.revision) .. "-" .. digest .. '"'
    local err = res:set_header("ETag", etag)
        or res:set_header("Cache-Control", "private, no-cache")
        or res:set_header("X-Content-Type-Options", "nosniff")
        or res:set_content_type(asset.content_type)
    if err then return err end
    for value in (condition or ""):gmatch("[^,]+") do
        local tag = value:match("^%s*(.-)%s*$") :: string
        if tag == "*" or tag == etag or tag == "W/" .. etag then return res:set_status(304) end
    end
    return res:write(asset.bytes)
end

local function handler()
    return request.handle(client.require_library, function(req)
        return funcs.call("kickside.mail.library:asset_content", req:param("name") or "")
    end, nil, respond)
end

return {handler = handler}
