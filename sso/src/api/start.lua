-- GET /api/sso/{provider}/start — begins a login. Generates state (CSRF) and, for
-- OIDC providers, a PKCE verifier/challenge and a nonce; stores the flow payload
-- server-side keyed by state; plants the state in an HttpOnly cookie; and 302s the
-- browser to the provider's authorization endpoint.

local http = require("http")
local crypto = require("crypto")
local hash = require("hash")

local consts = require("sso_consts")
local config = require("sso_config")
local util = require("sso_util")
local providers = require("sso_providers")
local flow_store = require("sso_flow_store")
local cookies = require("sso_cookies")
local reqinfo = require("sso_reqinfo")

local function json_error(res, status, message)
    res:set_content_type(http.CONTENT.JSON)
    res:set_status(status)
    res:write_json({ success = false, error = message })
end

local function handler()
    local res = http.response()
    local req = http.request()
    if not req or not res then return nil, "Failed to get HTTP context" end

    local provider = req:param("provider")
    if not consts.is_known_provider(provider) then
        return json_error(res, http.STATUS.NOT_FOUND, consts.ERROR.PROVIDER_UNKNOWN)
    end

    local descriptor, derr = providers.resolve(provider)
    if not descriptor then
        return json_error(res, http.STATUS.BAD_REQUEST, derr)
    end

    local redirect_uri = reqinfo.public_base(req, config.global().public_base_path) .. "/" .. provider .. "/callback"

    local state, serr = crypto.random.string(32)
    if not state then
        return json_error(res, http.STATUS.INTERNAL_ERROR, "Failed to generate state: " .. tostring(serr))
    end

    local params = { redirect_uri = redirect_uri, state = state }
    local payload = {
        provider = provider,
        redirect_uri = redirect_uri,
        post_login = req:query("redirect") or "/",
        mode = "login",
        created_at = os.time(),
    }

    if providers.uses_pkce(descriptor) then
        local verifier, verr = crypto.random.string(64, consts.PKCE_CHARS)
        if not verifier then
            return json_error(res, http.STATUS.INTERNAL_ERROR, "Failed to generate verifier")
        end
        local challenge_raw, herr = hash.sha256(verifier, true)
        if herr then
            return json_error(res, http.STATUS.INTERNAL_ERROR, "Failed to derive challenge")
        end
        local nonce, nerr = crypto.random.string(32)
        if not nonce then
            return json_error(res, http.STATUS.INTERNAL_ERROR, "Failed to generate nonce: " .. tostring(nerr))
        end
        params.code_challenge = util.base64url_encode(challenge_raw)
        params.nonce = nonce
        payload.code_verifier = verifier
        payload.nonce = nonce
    end

    local url = providers.build_authorize_url(descriptor, params)
    if not url then
        return json_error(res, http.STATUS.INTERNAL_ERROR, "Failed to build authorization URL")
    end

    local ok, perr = flow_store.put(state, payload)
    if not ok then
        return json_error(res, http.STATUS.INTERNAL_ERROR, perr)
    end

    res:set_header("Set-Cookie", cookies.build(consts.FLOW_COOKIE, state, consts.FLOW_TTL_SECONDS, reqinfo.is_secure(req)))
    res:set_header("Location", url)
    res:set_status(http.STATUS.FOUND)
end

return { handler = handler }
