-- Authenticated account-linking endpoints (bound to the app's authenticated
-- router, so security.actor() is the current user):
--   start_link → POST /api/sso/{provider}/link : returns the authorize URL for the
--                SPA to navigate to, and plants the flow cookie (mode=link).
--   unlink     → DELETE /api/sso/{provider}/link : removes a provider link.
-- The provider redirect lands on the public callback, which sees mode=link and
-- attaches the identity to link_user_id instead of minting a new session.

local http = require("http")
local security = require("security")
local crypto = require("crypto")
local hash = require("hash")

local consts = require("sso_consts")
local config = require("sso_config")
local util = require("sso_util")
local providers = require("sso_providers")
local provisioner = require("sso_provisioner")
local flow_store = require("sso_flow_store")
local cookies = require("sso_cookies")
local reqinfo = require("sso_reqinfo")

local function respond(res, status, body)
    res:set_content_type(http.CONTENT.JSON)
    res:set_status(status)
    res:write_json(body)
end

local function current_user_id()
    local actor = security.actor()
    if not actor then return nil end
    return actor:id()
end

local function start_link()
    local res = http.response()
    local req = http.request()

    local user_id = current_user_id()
    if not user_id then
        return respond(res, http.STATUS.UNAUTHORIZED, { success = false, error = "Not authenticated" })
    end

    local eligible, eligibility_err = provisioner.check_credentials(user_id)
    if not eligible then
        return respond(res, http.STATUS.FORBIDDEN, { success = false, error = tostring(eligibility_err) })
    end

    local provider = req:param("provider")
    if not consts.is_known_provider(provider) then
        return respond(res, http.STATUS.NOT_FOUND, { success = false, error = consts.ERROR.PROVIDER_UNKNOWN })
    end

    local descriptor, derr = providers.resolve(provider)
    if not descriptor then
        return respond(res, http.STATUS.BAD_REQUEST, { success = false, error = derr })
    end

    local redirect_uri = reqinfo.public_base(req, config.global().public_base_path) .. "/" .. provider .. "/callback"
    local state, serr = crypto.random.string(32)
    if not state then
        return respond(res, http.STATUS.INTERNAL_ERROR, { success = false, error = "Failed to generate state: " .. tostring(serr) })
    end

    local params = { redirect_uri = redirect_uri, state = state }
    local payload = {
        provider = provider,
        redirect_uri = redirect_uri,
        post_login = req:query("redirect") or "/",
        mode = "link",
        link_user_id = user_id,
        created_at = os.time(),
    }

    if providers.uses_pkce(descriptor) then
        local verifier, verr = crypto.random.string(64, consts.PKCE_CHARS)
        if not verifier then
            return respond(res, http.STATUS.INTERNAL_ERROR, { success = false, error = "Failed to generate verifier: " .. tostring(verr) })
        end
        local challenge_raw, herr = hash.sha256(verifier, true)
        if herr then
            return respond(res, http.STATUS.INTERNAL_ERROR, { success = false, error = "Failed to derive challenge" })
        end
        local nonce, nerr = crypto.random.string(32)
        if not nonce then
            return respond(res, http.STATUS.INTERNAL_ERROR, { success = false, error = "Failed to generate nonce: " .. tostring(nerr) })
        end
        params.code_challenge = util.base64url_encode(challenge_raw)
        params.nonce = nonce
        payload.code_verifier = verifier
        payload.nonce = nonce
    end

    local url = providers.build_authorize_url(descriptor, params)
    local ok, perr = flow_store.put(state, payload)
    if not ok then
        return respond(res, http.STATUS.INTERNAL_ERROR, { success = false, error = perr })
    end

    res:set_header("Set-Cookie", cookies.build(consts.FLOW_COOKIE, state, consts.FLOW_TTL_SECONDS, reqinfo.is_secure(req)))
    respond(res, http.STATUS.OK, { success = true, url = url })
end

local function unlink()
    local res = http.response()
    local req = http.request()

    local provider = req:param("provider")
    if not consts.is_known_provider(provider) then
        return respond(res, http.STATUS.NOT_FOUND, { success = false, error = consts.ERROR.PROVIDER_UNKNOWN })
    end

    local user_id = current_user_id()
    if not user_id then
        return respond(res, http.STATUS.UNAUTHORIZED, { success = false, error = "Not authenticated" })
    end

    local ok, err = provisioner.unlink(user_id, provider)
    if not ok then
        return respond(res, http.STATUS.BAD_REQUEST, { success = false, error = err })
    end
    respond(res, http.STATUS.OK, { success = true })
end

return {
    start_link = start_link,
    unlink = unlink,
}
