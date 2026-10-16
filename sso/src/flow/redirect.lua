-- Open-redirect guard for the post-login target. A same-origin absolute path is
-- always allowed; an absolute URL is allowed only when it starts with an
-- allowlisted origin. Anything else falls back to "/". Also appends the session
-- handoff as a URL fragment (fragments are not sent to servers, so the token does
-- not land in access logs).

local util = require("sso_util")

local M = {}

-- safe returns a vetted redirect target.
function M.safe(target, allowlist)
    if type(target) ~= "string" or target == "" then return "/" end
    -- Same-origin absolute path, but reject protocol-relative "//host".
    if target:sub(1, 1) == "/" and target:sub(1, 2) ~= "//" then
        return target
    end
    for _, allowed in ipairs(allowlist or {}) do
        -- Match an allowlisted origin only at a path boundary, so a prefix like
        -- "https://app.example.com" cannot be over-matched by
        -- "https://app.example.com.evil.com/…".
        if allowed ~= "" and target:sub(1, #allowed) == allowed then
            local boundary = target:sub(#allowed + 1, #allowed + 1)
            if boundary == "" or boundary == "/" or boundary == "?" or boundary == "#" then
                return target
            end
        end
    end
    return "/"
end

-- with_fragment appends "#key=value" to a target, url-encoding the value.
function M.with_fragment(target, key, value)
    return target .. "#" .. key .. "=" .. util.url_encode(value)
end

return M
