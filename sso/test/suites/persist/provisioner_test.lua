local test = require("test")
local time = require("time")
local contract = require("contract")
local security = require("security")
local sql = require("sql")
local provisioner = require("sso_provisioner")
local consts = require("sso_consts")
local user_repo = require("user_repo")
local user_groups_repo = require("user_groups_repo")
local identities_repo = require("identities_repo")

type UserRow = {
    user_id: string,
    status: string,
    password_hash: string?,
}

-- Integration coverage for the provisioning policy against the real DB + kickside
-- users store + settings service: find-by-identity, link-by-verified-email,
-- auto-create-with-allowlist, and the deny paths.
local function settings()
    local policy = security.policy("app:admin_scope")
    return contract.get("kickside.settings:settings")
        :with_actor(security.new_actor("test", {}))
        :with_scope(security.new_scope({ policy }))
        :open()
end

local function set(key, value)
    local r = settings():set({ namespace = "kickside.sso", key = key, value = value })
    if not r or not r.success then
        error("failed to set " .. key .. ": " .. tostring(r and r.error))
    end
end

local function configure(auto_provision, domains)
    set(consts.KEY.AUTO_PROVISION, auto_provision)
    set(consts.KEY.ALLOWED_EMAIL_DOMAINS, domains)
end

local function define_tests()
    describe("provisioner.resolve", function()
        it("denies an unverified email", function()
            configure(true, { "allowed.com" })
            local user, err = provisioner.resolve({
                provider = "oidc", subject = "unv-1", email = "x@allowed.com", email_verified = false,
            })
            test.is_nil(user)
            test.eq(err, consts.ERROR.EMAIL_UNVERIFIED)
        end)

        it("denies a verified email outside the domain allowlist", function()
            configure(true, { "allowed.com" })
            local user, err = provisioner.resolve({
                provider = "oidc", subject = "dom-1", email = "y@evil.com", email_verified = true,
            })
            test.is_nil(user)
            test.eq(err, consts.ERROR.DOMAIN_NOT_ALLOWED)
        end)

        it("auto-creates a passwordless user for an allowed domain, then logs in idempotently", function()
            configure(true, { "allowed.com" })
            local user, err = provisioner.resolve({
                provider = "oidc", subject = "new-1", email = "new1@allowed.com", email_verified = true, name = "New One",
            })
            test.is_nil(err)
            test.eq(user.email, "new1@allowed.com")

            -- The stored account carries the locked-password sentinel.
            local row = user_repo.get("new1@allowed.com")
            test.not_nil(row)
            test.eq((row :: UserRow).password_hash, consts.NO_PASSWORD)

            -- A second login finds the existing identity (no duplicate row).
            local again, aerr = provisioner.resolve({
                provider = "oidc", subject = "new-1", email = "new1@allowed.com", email_verified = true,
            })
            test.is_nil(aerr)
            test.eq(again.user_id, user.user_id)
            test.eq(identities_repo.count_by_user(user.user_id), 1)
        end)

        it("keeps an incomplete account pending and resumes it on the next verified login", function()
            configure(true, { "allowed.com" })
            set(consts.KEY.GROUP_MAPPING, { engineering = "app.security:user" })
            local trigger_name = "sso_fail_pending_activation"
            local db, db_err = sql.get(consts.db_id())
            test.is_nil(db_err)
            local postgres = db:type() == sql.type.POSTGRES
            local create_trigger =
                "CREATE TRIGGER " .. trigger_name
                .. " BEFORE UPDATE OF status ON app_users"
                .. " WHEN OLD.email = 'resume-provisioning@allowed.com' AND NEW.status = 'active'"
                .. " BEGIN SELECT RAISE(FAIL, 'forced activation failure'); END"
            if postgres then
                local _, function_err = db:execute("CREATE FUNCTION " .. trigger_name .. "() RETURNS trigger"
                    .. " LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'forced activation failure'; END $$")
                test.is_nil(function_err)
                create_trigger = "CREATE TRIGGER " .. trigger_name .. " BEFORE UPDATE OF status ON app_users"
                    .. " FOR EACH ROW WHEN (OLD.email = 'resume-provisioning@allowed.com' AND NEW.status = 'active')"
                    .. " EXECUTE FUNCTION " .. trigger_name .. "()"
            end
            local _, trigger_err = db:execute(create_trigger)
            db:release()
            test.is_nil(trigger_err)

            local first, first_err = provisioner.resolve({
                provider = "oidc",
                subject = "resume-provisioning-1",
                email = "resume-provisioning@allowed.com",
                email_verified = true,
                name = "Resume Provisioning",
                groups = { "engineering" },
            })

            local cleanup_db, cleanup_err = sql.get(consts.db_id())
            test.is_nil(cleanup_err)
            local _, drop_err = cleanup_db:execute("DROP TRIGGER IF EXISTS " .. trigger_name
                .. (postgres and " ON app_users" or ""))
            if postgres then
                local _, function_drop_err = cleanup_db:execute("DROP FUNCTION " .. trigger_name .. "()")
                test.is_nil(function_drop_err)
            end
            cleanup_db:release()
            test.is_nil(drop_err)

            test.is_nil(first)
            test.contains(tostring(first_err), "forced activation failure")
            local pending = user_repo.get("resume-provisioning@allowed.com")
            test.not_nil(pending)
            local pending_user = pending :: UserRow
            test.eq(pending_user.status, "pending")
            test.eq(#user_groups_repo.get_user_groups(pending_user.user_id).groups, 0)
            local claimed = identities_repo.find_by_subject("oidc", "resume-provisioning-1")
            test.eq(claimed.user_id, pending_user.user_id)

            local resumed, resumed_err = provisioner.resolve({
                provider = "oidc",
                subject = "resume-provisioning-1",
                email = "resume-provisioning@allowed.com",
                email_verified = true,
                name = "Resume Provisioning",
                groups = { "engineering" },
            })
            test.is_nil(resumed_err)
            test.eq(resumed.user_id, pending_user.user_id)
            test.eq(resumed.status, "active")
            local groups = user_groups_repo.get_user_groups(resumed.user_id).groups
            test.eq(#groups, 1)
            test.eq(groups[1], "app.security:user")
            test.eq(identities_repo.count_by_user(resumed.user_id), 1)
        end)

        it("links a new identity to an existing account with the same verified email", function()
            local created, cerr = user_repo.create({
                user_id = "u-link-1", email = "link1@allowed.com", password = "password-1234", full_name = "Link One",
            })
            test.is_nil(cerr)
            test.is_true(created ~= nil)

            local user, err = provisioner.resolve({
                provider = "github", subject = "gh-1", email = "link1@allowed.com", email_verified = true,
            })
            test.is_nil(err)
            test.eq(user.user_id, "u-link-1")

            local link = identities_repo.find_by_subject("github", "gh-1")
            test.eq(link.user_id, "u-link-1")
        end)

        it("denies auto-creation when provisioning is disabled", function()
            configure(false, { "allowed.com" })
            local user, err = provisioner.resolve({
                provider = "oidc", subject = "off-1", email = "off1@allowed.com", email_verified = true,
            })
            test.is_nil(user)
            test.eq(err, consts.ERROR.PROVISION_DISABLED)
        end)
    end)

    describe("provisioner.unlink", function()
        it("refuses to unlink the only credential of a passwordless account", function()
            configure(true, { "allowed.com" })
            local user = provisioner.resolve({
                provider = "oidc", subject = "solo-1", email = "solo1@allowed.com", email_verified = true,
            })
            local ok, err = provisioner.unlink(user.user_id, "oidc")
            test.eq(ok, false)
            test.eq(err, consts.ERROR.LAST_CREDENTIAL)
        end)

        it("allows unlink when the account still has a password", function()
            user_repo.create({
                user_id = "u-pw-1", email = "pw1@allowed.com", password = "password-1234",
            })
            provisioner.resolve({
                provider = "github", subject = "gh-pw-1", email = "pw1@allowed.com", email_verified = true,
            })
            local ok, err = provisioner.unlink("u-pw-1", "github")
            test.is_nil(err)
            test.eq(ok, true)
        end)
    end)

    -- IdP group claims map to internal groups through the admin-curated
    -- group_mapping, and are reconciled as sso-sourced memberships on every login.
    describe("provisioner.resolve group mapping", function()
        it("maps an IdP group to its internal group and grants it (sso-sourced)", function()
            configure(true, { "allowed.com" })
            set(consts.KEY.GROUP_MAPPING, { engineering = "app.security:user" })

            local user, err = provisioner.resolve({
                provider = "oidc", subject = "grp-1", email = "grp1@allowed.com",
                email_verified = true, name = "Grp One", groups = { "engineering", "unmapped-team" },
            })
            test.is_nil(err)

            local res = user_groups_repo.get_user_groups(user.user_id)
            test.eq(#res.groups, 1)
            test.eq(res.groups[1], "app.security:user")
        end)

        it("ignores unmapped IdP groups and does not grant admin unless mapped", function()
            configure(true, { "allowed.com" })
            set(consts.KEY.GROUP_MAPPING, { engineering = "app.security:user" })

            local user = provisioner.resolve({
                provider = "oidc", subject = "grp-2", email = "grp2@allowed.com",
                email_verified = true, name = "Grp Two", groups = { "admins", "app.security:admin" },
            })
            local res = user_groups_repo.get_user_groups(user.user_id)
            test.eq(#res.groups, 0)
        end)

        it("grants admin only when an IdP group is explicitly mapped to it", function()
            configure(true, { "allowed.com" })
            set(consts.KEY.GROUP_MAPPING, { ["platform-admins"] = "app.security:admin" })

            local user = provisioner.resolve({
                provider = "oidc", subject = "grp-3", email = "grp3@allowed.com",
                email_verified = true, name = "Grp Three", groups = { "platform-admins" },
            })
            local res = user_groups_repo.get_user_groups(user.user_id)
            test.eq(#res.groups, 1)
            test.eq(res.groups[1], "app.security:admin")
        end)

        it("reconciles to empty when a later login carries no groups claim", function()
            configure(true, { "allowed.com" })
            set(consts.KEY.GROUP_MAPPING, { engineering = "app.security:user" })

            provisioner.resolve({
                provider = "oidc", subject = "grp-4", email = "grp4@allowed.com",
                email_verified = true, name = "Grp Four", groups = { "engineering" },
            })
            local user = provisioner.resolve({
                provider = "oidc", subject = "grp-4", email = "grp4@allowed.com", email_verified = true,
            })
            local res = user_groups_repo.get_user_groups(user.user_id)
            test.eq(#res.groups, 0)
        end)

        it("never deletes a manual grant during sso reconciliation", function()
            configure(true, { "allowed.com" })
            set(consts.KEY.GROUP_MAPPING, { engineering = "app.security:user" })

            local user = provisioner.resolve({
                provider = "oidc", subject = "grp-5", email = "grp5@allowed.com",
                email_verified = true, name = "Grp Five", groups = { "engineering" },
            })
            user_groups_repo.assign_user_to_group(user.user_id, "app.security:admin")

            provisioner.resolve({
                provider = "oidc", subject = "grp-5", email = "grp5@allowed.com", email_verified = true,
            })
            local res = user_groups_repo.get_user_groups(user.user_id)
            test.eq(#res.groups, 1)
            test.eq(res.groups[1], "app.security:admin")
        end)

        it("scopes reconciliation to the provider source", function()
            configure(true, { "allowed.com" })
            set(consts.KEY.GROUP_MAPPING, { engineering = "app.security:user" })

            local user = provisioner.resolve({
                provider = "oidc", subject = "iso-1", email = "iso1@allowed.com",
                email_verified = true, name = "Iso", groups = { "engineering" },
            })
            -- A second provider login (linked by email) with no groups reconciles
            -- only sso:github, leaving the sso:oidc grant intact.
            provisioner.resolve({
                provider = "github", subject = "gh-iso-1", email = "iso1@allowed.com", email_verified = true,
            })
            local res = user_groups_repo.get_user_groups(user.user_id)
            test.eq(#res.groups, 1)
            test.eq(res.groups[1], "app.security:user")
        end)
    end)

    -- One canonical timestamp representation: created_at/last_login_at are RFC3339
    -- UTC strings in both the persisted row and every read path, identical across
    -- SQLite and PostgreSQL. No unix integers, no per-DB shape.
    describe("identity timestamps are canonical RFC3339", function()
        it("stores and reads created_at/last_login_at as parseable RFC3339 strings", function()
            local owner, oerr = user_repo.create({
                email = "tsident@allowed.com", password = "password-1234", full_name = "TS Ident",
            })
            test.is_nil(oerr)
            local uid = tostring((owner :: any).user_id)

            local created, cerr = identities_repo.create({
                provider = "oidc", subject = "ts-ident-1", user_id = uid,
                email = "tsident@allowed.com", email_verified = true,
            })
            test.is_nil(cerr)
            test.not_nil(created)

            local row = identities_repo.find_by_subject("oidc", "ts-ident-1")
            test.not_nil(row)

            test.eq(type(row.created_at), "string")
            test.is_true(#tostring(row.created_at) > 0)
            local parsed, perr = time.parse(time.RFC3339, tostring(row.created_at))
            test.is_nil(perr)
            test.not_nil(parsed)

            test.eq(type(row.last_login_at), "string")
            local lparsed, lperr = time.parse(time.RFC3339, tostring(row.last_login_at))
            test.is_nil(lperr)
            test.not_nil(lparsed)

            -- touch_login rewrites last_login_at with the same canonical shape.
            local ok, terr = identities_repo.touch_login(row.id)
            test.is_nil(terr)
            test.is_true(ok)
            local after = identities_repo.find_by_subject("oidc", "ts-ident-1")
            local tparsed, tperr = time.parse(time.RFC3339, tostring(after.last_login_at))
            test.is_nil(tperr)
            test.not_nil(tparsed)
        end)
    end)
end

return test.run_cases(define_tests)
