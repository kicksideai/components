-- Maps a verified provider identity to a local account: find by linked identity,
-- else link to an account with the same verified email, else auto-create (when
-- enabled and the email domain is allowed), else deny. All account reads, the
-- passwordless create, group assignment, and reconciliation go through the
-- kickside.users:user_provisioning seam -- this module never touches the users
-- repositories or schema directly. Only the identity link table is SSO-owned.

local contract = require("contract")
local eligibility = require("credential_eligibility")
local errors = require("errors")

local consts = require("sso_consts")
local config = require("sso_config")
local identities_repo = require("identities_repo")

local M = {}

local PROVISIONING_CONTRACT = "kickside.users:user_provisioning"

function M.check_credentials(identifier)
    return eligibility.check("kickside.sso:credential_config", identifier)
end

local function provisioning()
    local def = contract.get(PROVISIONING_CONTRACT)
    if not def then return nil, "user provisioning contract unavailable" end
    return def:open()
end

-- load_active_user returns the contract user view for an active account, or
-- (nil, err). A non-active account is rejected before any session is minted.
local function load_active_user(identifier)
    local inst, oerr = provisioning()
    if not inst then return nil, oerr end
    local r = inst:get_user({ identifier = identifier })
    if not r or not r.ok then return nil, r and r.error or "user lookup failed" end
    if r.user.status ~= consts.USER_STATUS_ACTIVE then
        return nil, consts.ERROR.ACCOUNT_INACTIVE
    end
    return r.user
end

-- domain_allowed reports whether an email may auto-provision. An empty allowlist
-- denies everything (auto-provision must be opted into explicitly per domain).
local function domain_allowed(email, allowed)
    if not allowed or #allowed == 0 then return false end
    local domain = consts.domain_of(email)
    if not domain then return false end
    for _, d in ipairs(allowed) do
        if d == domain then return true end
    end
    return false
end

-- map_groups turns the IdP group strings on an identity into the internal security
-- groups SSO may assign. group_mapping (admin-curated) is both the translation
-- table AND the allowlist: only its declared target values are assignable, so an
-- IdP can never escalate to a group an admin did not map -- including the admin
-- group, which is granted only when it is an explicit mapping target. Unmapped IdP
-- groups are ignored; a missing or empty groups list yields an empty set.
local function map_groups(idp_groups, mapping)
    local desired, seen = {}, {}
    if type(idp_groups) ~= "table" or type(mapping) ~= "table" then
        return desired
    end

    local allowed = {}
    for _, target in pairs(mapping) do
        if type(target) == "string" and target ~= "" then allowed[target] = true end
    end

    for _, idp in ipairs(idp_groups) do
        local target = type(idp) == "string" and mapping[idp] or nil
        if type(target) == "string" and target ~= "" and allowed[target] and not seen[target] then
            seen[target] = true
            desired[#desired + 1] = target
        end
    end
    return desired
end

local function pending_plan(identity)
    local g = config.global()
    if not g.auto_provision then
        return nil, consts.ERROR.PROVISION_DISABLED
    end
    if not domain_allowed(identity.email, g.allowed_email_domains) then
        return nil, consts.ERROR.DOMAIN_NOT_ALLOWED
    end
    return {
        default_group = g.default_group,
        source = "sso:" .. identity.provider,
        group_ids = map_groups(identity.groups, g.group_mapping),
    }, nil
end

local function complete_pending(inst, user_id, identity, supplied_plan)
    local plan, plan_err = supplied_plan, nil
    if not plan then plan, plan_err = pending_plan(identity) end
    if plan_err or not plan then return nil, plan_err end
    local completed = inst:complete_passwordless_user({
        identifier = user_id,
        default_group = plan.default_group,
        source = plan.source,
        group_ids = plan.group_ids,
    })
    if not completed or not completed.ok then
        return nil, completed and completed.error or "provisioning completion failed"
    end
    return load_active_user(user_id)
end

-- reconcile_sso_groups reconciles the provider-sourced memberships of a user to the
-- mapped set on every login, leaving manual and other-provider memberships intact.
-- An absent groups claim reconciles to empty, dropping the provider's prior grants.
local function reconcile_sso_groups(user_id, identity)
    local inst, oerr = provisioning()
    if not inst then return oerr end
    local g = config.global()
    local desired = map_groups(identity.groups, g.group_mapping)
    local r = inst:apply_sourced_groups({
        identifier = user_id,
        source = "sso:" .. identity.provider,
        group_ids = desired,
    })
    if not r or not r.ok then return r and r.error or "group reconciliation failed" end
    return nil
end

-- finalize reconciles SSO group membership for an active user and returns the user
-- reloaded with the resulting groups, so the minted session reflects the new set.
local function finalize(user_id, identity)
    local _, uerr = load_active_user(user_id)
    if uerr then return nil, uerr end
    local rerr = reconcile_sso_groups(user_id, identity)
    if rerr then return nil, rerr end
    return load_active_user(user_id)
end

-- resolve turns a verified identity into an active local user, provisioning or
-- linking as policy allows. identity = { provider, subject, email, email_verified,
-- name, groups }. Returns (user, err).
function M.resolve(identity)
    if type(identity) ~= "table" or not identity.provider or not identity.subject then
        return nil, "provider and subject are required"
    end

    local inst, oerr = provisioning()
    if not inst then return nil, oerr end

    -- 1. Already linked: log in directly.
    local existing, ferr = identities_repo.find_by_subject(identity.provider, identity.subject)
    if ferr then return nil, ferr end
    if existing then
        local current = inst:get_user({ identifier = existing.user_id })
        if not current or not current.ok then
            return nil, current and current.error or "user lookup failed"
        end
        local user, uerr
        if current.user.provisioning_pending == true then
            user, uerr = complete_pending(inst, existing.user_id, identity)
        elseif current.user.status ~= consts.USER_STATUS_ACTIVE then
            return nil, consts.ERROR.ACCOUNT_INACTIVE
        else
            user, uerr = finalize(existing.user_id, identity)
        end
        if uerr or not user then return nil, uerr end
        local touched, touch_err = identities_repo.touch_login(existing.id)
        if touch_err or touched ~= true then return nil, touch_err or "failed to record identity login" end
        return user, nil
    end

    -- Linking and provisioning both require a verified email.
    if not identity.email_verified or not identity.email or identity.email == "" then
        return nil, consts.ERROR.EMAIL_UNVERIFIED
    end

    -- 2. Link to an existing account with the same verified email.
    local eligible, eligibility_err, guard_bound = M.check_credentials(identity.email)
    if eligibility_err then
        local details = eligibility_err:details()
        if not errors.is(eligibility_err, errors.NOT_FOUND) or type(details) ~= "table"
            or details.code ~= "USER_NOT_FOUND" then
            return nil, eligibility_err
        end
    end
    local matched = eligible and inst:get_user({ identifier = identity.email }) or nil
    if guard_bound and (not matched or not matched.ok) then
        return nil, matched and matched.error or "user lookup failed"
    end
    if matched and matched.ok then
        local plan, plan_err
        if matched.user.provisioning_pending == true then
            plan, plan_err = pending_plan(identity)
            if plan_err or not plan then return nil, plan_err end
        elseif matched.user.status ~= consts.USER_STATUS_ACTIVE then
            return nil, consts.ERROR.ACCOUNT_INACTIVE
        end
        local _, cerr = identities_repo.create({
            provider = identity.provider,
            subject = identity.subject,
            user_id = matched.user.user_id,
            email = identity.email,
            email_verified = true,
        })
        if cerr then return nil, cerr end
        if plan then
            return complete_pending(inst, matched.user.user_id, identity, plan)
        end
        return finalize(matched.user.user_id, identity)
    end

    -- 3. Auto-provision a new account if policy allows.
    local plan, plan_err = pending_plan(identity)
    if plan_err or not plan then return nil, plan_err end

    local created = inst:create_passwordless_user({ email = identity.email, full_name = identity.name })
    if not created or not created.ok then
        return nil, created and created.error or "failed to create account"
    end
    local user_id = created.user_id

    local _, cerr = identities_repo.create({
        provider = identity.provider,
        subject = identity.subject,
        user_id = user_id,
        email = identity.email,
        email_verified = true,
    })
    if cerr then return nil, cerr end
    return complete_pending(inst, user_id, identity, plan)
end

-- link attaches a provider identity to an already-authenticated user (the account
-- settings "connect" flow). Rejects an identity already bound elsewhere.
function M.link(user_id, identity)
    if not user_id or type(identity) ~= "table" or not identity.provider or not identity.subject then
        return nil, "user_id, provider and subject are required"
    end

    local eligible, eligibility_err = M.check_credentials(user_id)
    if not eligible then return nil, eligibility_err end

    local existing, ferr = identities_repo.find_by_subject(identity.provider, identity.subject)
    if ferr then return nil, ferr end
    if existing then
        if existing.user_id == user_id then return existing end
        return nil, "This provider account is already linked to another user"
    end

    return identities_repo.create({
        provider = identity.provider,
        subject = identity.subject,
        user_id = user_id,
        email = identity.email,
        email_verified = identity.email_verified and true or false,
    })
end

-- unlink removes a provider link, refusing to strip the only sign-in method from a
-- passwordless account (which would lock the user out).
function M.unlink(user_id, provider)
    if not user_id or not provider then
        return false, "user_id and provider are required"
    end

    local inst, oerr = provisioning()
    if not inst then return false, oerr end

    local r = inst:get_user({ identifier = user_id })
    if not r or not r.ok then return false, r and r.error or "user lookup failed" end

    if not r.user.has_password then
        local count = identities_repo.count_by_user(user_id)
        if count <= 1 then
            return false, consts.ERROR.LAST_CREDENTIAL
        end
    end

    return identities_repo.delete_for_user_provider(user_id, provider)
end

return M
