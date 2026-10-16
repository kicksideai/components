-- Small encoding helpers shared by the connectors and flow: RFC 3986 percent
-- encoding, form bodies, and base64url (the JWT/OAuth variant, which base64 does
-- not handle directly because it is unpadded and uses - / _).

local base64 = require("base64")

local M = {}

-- url_encode percent-encodes everything except the RFC 3986 unreserved set.
function M.url_encode(str)
    if type(str) ~= "string" then return "" end
    return (str:gsub("[^%w%-%._~]", function(c)
        return string.format("%%%02X", string.byte(c))
    end))
end

-- form_encode builds an application/x-www-form-urlencoded body.
function M.form_encode(params)
    local parts = {}
    for k, v in pairs(params) do
        parts[#parts + 1] = M.url_encode(tostring(k)) .. "=" .. M.url_encode(tostring(v))
    end
    return table.concat(parts, "&")
end

-- query_string builds a query string from an ordered list of {key, value} pairs,
-- preserving order (some providers are picky about parameter order).
function M.query_string(pairs_list)
    local parts = {}
    for _, kv in ipairs(pairs_list) do
        parts[#parts + 1] = M.url_encode(kv[1]) .. "=" .. M.url_encode(tostring(kv[2]))
    end
    return table.concat(parts, "&")
end

function M.base64url_encode(str)
    local e = base64.encode(str)
    if not e then return nil end
    return (e:gsub("%+", "-"):gsub("/", "_"):gsub("=", ""))
end

function M.base64url_decode(str)
    if type(str) ~= "string" then return nil end
    str = str:gsub("-", "+"):gsub("_", "/")
    local r = #str % 4
    if r == 2 then
        str = str .. "=="
    elseif r == 3 then
        str = str .. "="
    elseif r == 1 then
        return nil
    end
    return base64.decode(str)
end

return M
