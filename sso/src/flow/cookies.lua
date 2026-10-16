-- Cookie helpers for the flow. The runtime's http response exposes only
-- set_header, so Set-Cookie is assembled by hand and the request Cookie header is
-- parsed by hand.

local M = {}

-- build assembles a Set-Cookie value: HttpOnly, SameSite=Lax (so it survives the
-- top-level GET navigation back from the provider), Path=/, and Secure on HTTPS.
function M.build(name, value, max_age, secure)
    local parts = { name .. "=" .. value, "Path=/", "HttpOnly", "SameSite=Lax" }
    if max_age ~= nil then parts[#parts + 1] = "Max-Age=" .. tostring(max_age) end
    if secure then parts[#parts + 1] = "Secure" end
    return table.concat(parts, "; ")
end

-- expire builds a Set-Cookie that clears a cookie immediately.
function M.expire(name, secure)
    return M.build(name, "", 0, secure)
end

-- read extracts a cookie value from the request Cookie header, or nil.
function M.read(req, name)
    local header = req:header("Cookie")
    if type(header) ~= "string" then return nil end
    for pair in header:gmatch("[^;]+") do
        local k, v = pair:match("^%s*([^=%s]+)=(.*)$")
        if k == name then return v end
    end
    return nil
end

return M
