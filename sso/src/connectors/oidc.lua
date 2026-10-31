-- Generic OIDC engine shared by the google, microsoft, and oidc connectors.
-- Authorization-code + PKCE, id_token validation, and userinfo enrichment.
--
-- id_token trust: the token response is fetched directly from the provider's
-- token endpoint over TLS, so the id_token is authentic in transit. On top of
-- that we verify the RS256 or ES256 signature against the JWKS whenever a key is available
-- (the normal path) and always validate the iss/aud/exp/nonce claims. If the JWKS
-- cannot be fetched, we fall back to claim validation of the TLS-delivered token
-- and log it — never silently accepting an unvalidated token.

local http_client = require("http_client")
local json = require("json")
local crypto = require("crypto")
local logger = require("logger"):named("kickside.sso.oidc")
local util = require("sso_util")
local jwk = require("sso_jwk")

local M = {}

local CLOCK_SKEW = 120

-- discover fetches and maps an issuer's OIDC configuration.
function M.discover(issuer)
    if type(issuer) ~= "string" or issuer == "" then
        return nil, "issuer required"
    end
    local base = issuer:gsub("/+$", "")
    local resp, err = http_client.get(base .. "/.well-known/openid-configuration",
        { headers = { ["Accept"] = "application/json" } })
    if err then return nil, "discovery failed: " .. err end
    if resp.status_code >= 400 then
        return nil, "discovery http " .. tostring(resp.status_code)
    end
    local doc, derr = json.decode(resp.body or "")
    if derr then return nil, "discovery parse failed: " .. derr end
    return {
        issuer = doc.issuer or issuer,
        authorize = doc.authorization_endpoint,
        token = doc.token_endpoint,
        userinfo = doc.userinfo_endpoint,
        jwks = doc.jwks_uri,
    }
end

local function scopes_with_openid(scopes)
    local out = {}
    local has_openid = false
    for _, s in ipairs(scopes or {}) do
        out[#out + 1] = s
        if s == "openid" then has_openid = true end
    end
    if #out == 0 then out = { "email", "profile" } end
    if not has_openid then table.insert(out, 1, "openid") end
    return out
end

-- build_authorize_url builds the provider's authorization redirect.
function M.build_authorize_url(d, p)
    local q = {
        { "client_id", d.client_id },
        { "redirect_uri", p.redirect_uri },
        { "response_type", "code" },
        { "scope", table.concat(scopes_with_openid(d.scopes), " ") },
        { "state", p.state },
        { "nonce", p.nonce },
        { "code_challenge", p.code_challenge },
        { "code_challenge_method", "S256" },
    }
    return d.endpoints.authorize .. "?" .. util.query_string(q)
end

local function aud_matches(aud, client_id)
    if type(aud) == "string" then return aud == client_id end
    if type(aud) == "table" then
        for _, a in ipairs(aud) do
            if a == client_id then return true end
        end
    end
    return false
end

-- validate_id_token verifies the signature (when a key is available) and the
-- iss/aud/exp/nonce claims; returns the claim set.
function M.validate_id_token(d, id_token, nonce)
    local claims, signature_verified

    local pem, perr, alg = jwk.pem_for_token(d.endpoints.jwks, id_token)
    if pem then
        local c, verr = crypto.jwt.verify(id_token, pem, alg, true)
        if verr then
            return nil, "id_token signature invalid: " .. tostring(verr)
        end
        claims, signature_verified = c, true
    else
        local c, derr = jwk.payload(id_token)
        if derr then return nil, derr end
        logger:warn("jwks unavailable; validating id_token claims only", {
            provider = d.name, reason = perr,
        })
        claims, signature_verified = c, false
    end

    if type(claims) ~= "table" then
        return nil, "id_token has no claims"
    end

    -- Issuer pinning. A concrete issuer is matched exactly. A multi-tenant
    -- template ("…/{tenantid}/v2.0", Microsoft) is pinned to the token's own
    -- `tid`, so an attacker-controlled tenant cannot pass with a matching aud.
    local expected_iss = d.endpoints.issuer
    if expected_iss and expected_iss:find("{tenantid}", 1, true) then
        if type(claims.tid) ~= "string" or claims.tid == "" then
            return nil, "id_token missing tid for multi-tenant issuer"
        end
        expected_iss = (expected_iss:gsub("{tenantid}", claims.tid))
    end
    if expected_iss and claims.iss ~= expected_iss then
        return nil, "id_token issuer mismatch"
    end
    if not aud_matches(claims.aud, d.client_id) then
        return nil, "id_token audience mismatch"
    end
    if not signature_verified then
        if type(claims.exp) ~= "number" or (claims.exp + CLOCK_SKEW) < os.time() then
            return nil, "id_token expired"
        end
    end
    if nonce and claims.nonce ~= nonce then
        return nil, "id_token nonce mismatch"
    end
    return claims
end

function M.fetch_userinfo(url, access_token)
    if type(url) ~= "string" or url == "" or not access_token then return nil end
    local resp, err = http_client.get(url, {
        headers = { ["Accept"] = "application/json", ["Authorization"] = "Bearer " .. access_token },
    })
    if err or resp.status_code >= 400 then return nil end
    local data = json.decode(resp.body or "")
    if type(data) ~= "table" then return nil end
    return data
end

local function verified_from(claims, trust_email)
    if claims.email_verified == true then return true end
    if trust_email and type(claims.email) == "string" and claims.email ~= "" then return true end
    return false
end

-- extract_groups reads the configured groups claim from a claim set, returning a
-- clean array of non-empty group strings, or nil when the claim is absent or not a
-- list. The mapping from these IdP strings to internal groups happens later, in the
-- provisioner, against the admin-curated allowlist.
local function extract_groups(source, claim_name)
    if type(source) ~= "table" or type(claim_name) ~= "string" or claim_name == "" then
        return nil
    end
    local raw = source[claim_name]
    if type(raw) ~= "table" then return nil end
    local out = {}
    for _, g in ipairs(raw) do
        if type(g) == "string" and g ~= "" then out[#out + 1] = g end
    end
    if #out == 0 then return nil end
    return out
end

function M.normalize_identity(d, claims, claim_name)
    claim_name = claim_name or ((type(d.group_claim_name) == "string" and d.group_claim_name ~= "")
        and d.group_claim_name or "groups")
    return {
        provider = d.name,
        subject = claims.sub and tostring(claims.sub) or nil,
        email = claims.email,
        email_verified = verified_from(claims, d.trust_email),
        name = claims.name,
        avatar = claims.picture,
        groups = extract_groups(claims, claim_name),
    }
end

-- complete exchanges the code, validates the id_token, and returns a normalized
-- identity { provider, subject, email, email_verified, name, avatar }.
function M.complete(d, p)
    local resp, err = http_client.post(tostring(d.endpoints.token), {
        headers = {
            ["Content-Type"] = "application/x-www-form-urlencoded",
            ["Accept"] = "application/json",
        },
        body = util.form_encode({
            grant_type = "authorization_code",
            code = p.code,
            redirect_uri = p.redirect_uri,
            client_id = d.client_id,
            client_secret = d.client_secret,
            code_verifier = p.code_verifier,
        }),
    })
    if err then return nil, "token exchange failed: " .. err end
    if resp.status_code >= 400 then
        return nil, "token exchange http " .. tostring(resp.status_code) .. ": " .. (resp.body or "")
    end

    local tok, terr = json.decode(resp.body or "")
    if terr then return nil, "token parse failed: " .. terr end
    if type(tok) ~= "table" or not tok.id_token then
        return nil, "no id_token in response"
    end

    local claims, verr = M.validate_id_token(d, tok.id_token, p.nonce)
    if verr then return nil, verr end

    local claim_name = (type(d.group_claim_name) == "string" and d.group_claim_name ~= "") and d.group_claim_name or "groups"

    local identity = M.normalize_identity(d, claims, claim_name)

    if (not identity.email or not identity.name or not identity.avatar or not identity.groups) and tok.access_token then
        local ui = M.fetch_userinfo(d.endpoints.userinfo, tok.access_token)
        if ui then
            identity.subject = identity.subject or (ui.sub and tostring(ui.sub))
            identity.email = identity.email or ui.email
            if not identity.email_verified then
                identity.email_verified = verified_from(ui, d.trust_email)
            end
            identity.name = identity.name or ui.name
            identity.avatar = identity.avatar or ui.picture
            identity.groups = identity.groups or extract_groups(ui, claim_name)
        end
    end

    if not identity.subject then
        return nil, "id_token missing sub"
    end
    return identity
end

return M
