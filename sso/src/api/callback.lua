-- GET /api/sso/{provider}/callback — completes a login or a link. Verifies the
-- state cookie (CSRF), consumes the one-time flow payload, exchanges the code and
-- validates the identity, then either links it to the in-flight user or resolves a
-- local user and mints a session. The outcome is handed back to the SPA as a URL
-- fragment on the (allowlist-vetted) post-login target.

local http = require("http")

local consts = require("sso_consts")
local providers = require("sso_providers")
local provisioner = require("sso_provisioner")
local session = require("sso_session")
local flow_store = require("sso_flow_store")
local cookies = require("sso_cookies")
local reqinfo = require("sso_reqinfo")
local redirect = require("sso_redirect")
local config = require("sso_config")

local function redirect_to(res, location)
    res:set_header("Location", location)
    res:set_status(http.STATUS.FOUND)
end

local function fail(res, secure, target, message)
    res:set_header("Set-Cookie", cookies.expire(consts.FLOW_COOKIE, secure))
    redirect_to(res, redirect.with_fragment(target, "sso_error", tostring(message)))
end

local function json_error(res, secure, status, message)
    res:set_content_type(http.CONTENT.JSON)
    res:set_header("Set-Cookie", cookies.expire(consts.FLOW_COOKIE, secure))
    res:set_status(status)
    res:write_json({ success = false, error = message })
end

local function handler()
    local res = http.response()
    local req = http.request()
    if not req or not res then return nil, "Failed to get HTTP context" end

    local provider = req:param("provider")
    local secure = reqinfo.is_secure(req)

    local q_state = req:query("state")
    local cookie_state = cookies.read(req, consts.FLOW_COOKIE)

    -- CSRF: the callback state must match the cookie planted at start.
    if not q_state or q_state == "" or not cookie_state or cookie_state ~= q_state then
        return json_error(res, secure, http.STATUS.BAD_REQUEST, consts.ERROR.STATE_MISMATCH)
    end

    local payload, perr = flow_store.take(q_state)
    if not payload then
        return json_error(res, secure, http.STATUS.BAD_REQUEST, perr or consts.ERROR.FLOW_EXPIRED)
    end

    local target = redirect.safe(payload.post_login, config.global().redirect_allowlist)

    local q_error = req:query("error")
    if q_error and q_error ~= "" then
        return fail(res, secure, target, q_error)
    end

    local q_code = req:query("code")
    if not q_code or q_code == "" then
        return fail(res, secure, target, "missing authorization code")
    end

    local descriptor, derr = providers.resolve(provider)
    if not descriptor then
        return fail(res, secure, target, derr or consts.ERROR.PROVIDER_DISABLED)
    end

    local identity, ierr = providers.complete(descriptor, {
        code = q_code,
        redirect_uri = payload.redirect_uri,
        code_verifier = payload.code_verifier,
        nonce = payload.nonce,
    })
    if not identity then
        return fail(res, secure, target, ierr or consts.ERROR.USERINFO_FAILED)
    end

    -- Account-link flow: attach to the in-flight user; no new session.
    if payload.mode == "link" and payload.link_user_id then
        local _, lerr = provisioner.link(payload.link_user_id, identity)
        if lerr then
            return fail(res, secure, target, lerr)
        end
        res:set_header("Set-Cookie", cookies.expire(consts.FLOW_COOKIE, secure))
        return redirect_to(res, redirect.with_fragment(target, "sso_linked", identity.provider))
    end

    -- Login flow: resolve to a local user (find/link/create/deny) and mint a session.
    local user, uerr = provisioner.resolve(identity)
    if not user then
        return fail(res, secure, target, uerr or "login failed")
    end

    local minted, merr = session.mint(user, {
        ip_address = req:remote_addr() or "unknown",
        user_agent = req:header("User-Agent") or "unknown",
        sso_provider = identity.provider,
    })
    if not minted then
        return fail(res, secure, target, merr or "session error")
    end

    res:set_header("Set-Cookie", cookies.expire(consts.FLOW_COOKIE, secure))
    redirect_to(res, redirect.with_fragment(target, "sso_token", minted.token))
end

return { handler = handler }
