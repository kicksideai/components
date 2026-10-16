-- GitHub connector. GitHub is OAuth2 (not OIDC): no id_token, so identity comes
-- from the REST API. The primary verified email is read from /user/emails (the
-- /user endpoint omits the email when it is private), and verification is taken
-- from GitHub's own `verified` flag. GitHub does not support PKCE, so CSRF
-- protection rests on the state cookie.

local http_client = require("http_client")
local json = require("json")
local util = require("sso_util")

local M = {}


local function scopes(d)
    if d.scopes and #d.scopes > 0 then return d.scopes end
    return { "read:user", "user:email" }
end

function M.build_authorize_url(d, p)
    local q = {
        { "client_id", d.client_id },
        { "redirect_uri", p.redirect_uri },
        { "scope", table.concat(scopes(d), " ") },
        { "state", p.state },
    }
    return d.endpoints.authorize .. "?" .. util.query_string(q)
end

local function primary_verified_email(endpoints, headers)
    local resp, err = http_client.get(endpoints.emails, { headers = headers })
    if err or resp.status_code >= 400 then return nil, false end
    local emails = json.decode(resp.body or "")
    if type(emails) ~= "table" then return nil, false end

    for _, e in ipairs(emails) do
        if e.primary and e.verified then return e.email, true end
    end
    for _, e in ipairs(emails) do
        if e.verified then return e.email, true end
    end
    return nil, false
end

function M.complete(d, p)
    local resp, err = http_client.post(d.endpoints.token, {
        headers = {
            ["Content-Type"] = "application/x-www-form-urlencoded",
            ["Accept"] = "application/json",
        },
        body = util.form_encode({
            client_id = d.client_id,
            client_secret = d.client_secret,
            code = p.code,
            redirect_uri = p.redirect_uri,
        }),
    })
    if err then return nil, "token exchange failed: " .. err end
    if resp.status_code >= 400 then
        return nil, "token exchange http " .. tostring(resp.status_code)
    end

    local tok, terr = json.decode(resp.body or "")
    if terr then return nil, "token parse failed: " .. terr end
    if type(tok) ~= "table" or not tok.access_token then
        return nil, "no access token in response"
    end

    local headers = {
        ["Accept"] = "application/vnd.github+json",
        ["Authorization"] = "Bearer " .. tok.access_token,
        ["User-Agent"] = "kickside-sso",
    }

    local ures, uerr = http_client.get(d.endpoints.userinfo, { headers = headers })
    if uerr or ures.status_code >= 400 then
        return nil, "userinfo request failed"
    end
    local u = json.decode(ures.body or "")
    if type(u) ~= "table" or not u.id then
        return nil, "invalid userinfo response"
    end

    local email, verified = primary_verified_email(d.endpoints, headers)
    if not email and type(u.email) == "string" then
        email = u.email
    end

    return {
        provider = "github",
        subject = tostring(u.id),
        email = email,
        email_verified = verified,
        name = u.name or u.login,
        avatar = u.avatar_url,
    }
end

return M
