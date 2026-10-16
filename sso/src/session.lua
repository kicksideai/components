-- Mints a session token for an authenticated user through the
-- kickside.users:user_provisioning seam, which reloads the user fresh and
-- mirrors the password-login path exactly (same actor metadata, group->scope
-- derivation, token store). SSO sessions are therefore indistinguishable from
-- password sessions, so /user/me, groups, sharing, and token_auth all work
-- unchanged.

local contract = require("contract")

local M = {}

local PROVISIONING_CONTRACT = "kickside.users:user_provisioning"

-- mint returns { token, is_admin, scope, expiration } for a user (a value with a
-- user_id), or (nil, err). The session reflects the user's current groups, since
-- the contract reloads them at mint time.
function M.mint(user, meta_extra)
    local def = contract.get(PROVISIONING_CONTRACT)
    if not def then return nil, "user provisioning contract unavailable" end
    local inst, oerr = def:open()
    if not inst then return nil, oerr end

    local meta = { auth_method = "sso" }
    if type(meta_extra) == "table" then
        for k, v in pairs(meta_extra) do meta[k] = v end
    end

    local r = inst:mint_session({ identifier = user.user_id, meta = meta })
    if not r or not r.ok then
        return nil, r and r.error or "session error"
    end

    return {
        token = r.token,
        is_admin = r.is_admin,
        scope = r.scope,
        expiration = r.expiration,
    }
end

return M
