-- Derives the public origin/scheme of an incoming request so the module can build
-- its own absolute callback URL and decide whether to mark cookies Secure. Honors
-- reverse-proxy forwarding headers; treats localhost as plain HTTP so the flow
-- works in local development against dex/Keycloak over http.

local M = {}

local function forwarded_proto(req)
    local xf = req:header("X-Forwarded-Proto")
    if type(xf) == "string" and xf ~= "" then
        return (xf:match("[^,%s]+"))
    end
    return nil
end

-- host prefers the proxy-forwarded host, then the request Host (which the runtime
-- exposes via request:host(), not the header map — Go keeps Host off the header
-- map). Includes the port.
function M.host(req)
    local fwd = req:header("X-Forwarded-Host")
    if type(fwd) == "string" and fwd ~= "" then return fwd end
    local h = req:host()
    if type(h) == "string" and h ~= "" then return h end
    return "localhost"
end

function M.is_local(req)
    local h = M.host(req)
    return h:find("localhost", 1, true) ~= nil or h:find("127.0.0.1", 1, true) ~= nil
end

function M.scheme(req)
    local fp = forwarded_proto(req)
    if fp then return fp end
    if M.is_local(req) then return "http" end
    return "https"
end

function M.origin(req)
    return M.scheme(req) .. "://" .. M.host(req)
end

function M.is_secure(req)
    return M.scheme(req) == "https"
end

-- public_base resolves the external base of the public SSO endpoints. When the
-- configured value is an absolute URL it is used verbatim (robust behind proxies
-- and load balancers); otherwise it is treated as a path under the request origin.
function M.public_base(req, base)
    if type(base) == "string" and base:match("^https?://") then
        return base
    end
    return M.origin(req) .. (base or "")
end

return M
