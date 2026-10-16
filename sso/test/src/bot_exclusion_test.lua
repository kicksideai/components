local test = require("test")
local registry = require("registry")
local http_client = require("http_client")
local json = require("json")
local errors = require("errors")
local funcs = require("funcs")
local sql = require("sql")
local crypto = require("crypto")
local contract = require("contract")
local security = require("security")
local users = require("user_repo")
local groups = require("user_groups_repo")
local lifecycle = require("user_lifecycle_repo")
local identities = require("identities_repo")
local provisioner = require("sso_provisioner")
local session = require("sso_session")
local index = require("session_index")
local oauth_fixture = require("oauth_fixture")
local flows = require("sso_flow_store")
local consts = require("sso_consts")
local fixtures = {}
local settings
local saved_settings = {}

local function execute(query)
    local db = assert(sql.get("app:db"))
    local result, err = query:run_with(db):exec()
    db:release()
    if err then error(tostring(err)) end
    return result
end

local function fixture(marked, passwordless)
    local id = assert(crypto.random.uuid())
    local create = passwordless and users.create_passwordless or users.create
    local user, err = create({user_id = id, email = id .. "@allowed.com", password = "sso-bot-fixture-password", status = "active"})
    test.is_nil(err)
    test.not_nil(user)
    fixtures[#fixtures + 1] = id
    test.not_nil((groups.assign_user_to_group(id, "app.security:admin")))
    if marked then execute(sql.builder.insert("app_user_bot_accounts"):set_map({user_id = id,
        created_by = "deleted-creator", created_at = "2026-10-09T00:00:00Z"})) end
    return id
end

local function identity(id, suffix)
    return {provider = "oidc", subject = id .. "-" .. suffix, email = id .. "@allowed.com",
        email_verified = true, groups = {"escalate"}}
end

local function no_sessions(id)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT COUNT(*) AS count FROM kickside_user_sessions WHERE user_id=$1", {id})
    db:release()
    test.is_nil(err)
    test.eq(tonumber(rows[1].count), 0)
end

local function no_provider_group(id)
    for _, group in ipairs(assert(groups.get_user_with_groups(id)).security_groups) do
        test.is_false(group == "app:bot_sso_escalation")
    end
end

local function complete_callback(id, mode, subject)
    local code = oauth_fixture.issue({subject = subject, email = id .. "@allowed.com"})
    local state = assert(crypto.random.uuid())
    local stored, store_err = flows.put(state, {provider = "github", redirect_uri = "http://fixture/callback",
        post_login = "/api/public/fixture/landing", mode = mode == "link" and "link" or "login",
        link_user_id = mode == "link" and id or nil})
    test.is_nil(store_err, tostring(store_err))
    test.is_true(stored)
    local port = assert(tostring(assert(registry.get("app:gateway")).data.addr):match(":(%d+)$"))
    local response, err = http_client.get("http://127.0.0.1:" .. port
        .. "/api/public/sso/github/callback?state=" .. state .. "&code=" .. code, {
        headers = {Cookie = consts.FLOW_COOKIE .. "=" .. state}})
    oauth_fixture.cleanup(code)
    test.is_nil(err)
    test.eq(response.status_code, 200, tostring(response.body))
    return response.url
end


local function bind_host_only()
    local original = assert(registry.current_version())
    local changes = assert(registry.snapshot()):changes()
    local entries = assert(registry.find({[".id"] = "kickside.contract:host_credential_eligibility"}))
    local host = entries[1] or {id = "kickside.contract:host_credential_eligibility", kind = "registry.entry", meta = {}, data = {}}
    host.meta.credential_eligibility = "kickside.users.binding:credential_eligibility"
    if #entries == 0 then changes:create(host) else changes:update(host) end
    local policies = assert(registry.find({[".id"] = "kickside.contract:host_credential_guard_call"}))
    if #policies > 0 then
        local policy = policies[1]
        policy.data.policy.resources = {"kickside.users.binding:credential_eligibility"}
        changes:update(policy)
    end
    local config = assert(registry.get("kickside.sso:credential_config"))
    config.meta.credential_eligibility = ""
    changes:update(config)
    test.is_nil(select(2, changes:apply()))
    return original
end
return {run = test.run_cases(function()
    test.describe("SSO bot exclusion", function()
        test.before_all(function()
            local policy = assert(security.policy("app:admin_scope"))
            settings = assert(assert(contract.get("kickside.settings:settings"))
                :with_actor(security.new_actor("test", {})):with_scope(assert(security.new_scope({policy}))):open())
            for _, setting in ipairs({
                {"kickside.sso", "auto_provision", true},
                {"kickside.sso", "allowed_email_domains", {"allowed.com"}},
                {"kickside.sso", "group_mapping", {escalate = "app:bot_sso_escalation"}},
                {"kickside.sso.providers.github", "client_id", "fixture-client"},
                {"kickside.sso.providers.github", "client_secret", "fixture-secret"},
                {"kickside.sso.providers.github", "enabled", true},
            }) do
                local previous = settings:get({namespace = setting[1], key = setting[2]})
                test.is_true(previous.success, tostring(previous.error))
                saved_settings[#saved_settings + 1] = {namespace = setting[1], key = setting[2], value = previous.value}
                local result = settings:set({namespace = setting[1], key = setting[2], value = setting[3]})
                test.is_true(result.success, tostring(result.error))
            end
        end)
        test.after_all(function()
            local disabled = settings:set({namespace = "kickside.sso.providers.github", key = "enabled", value = false})
            test.is_true(disabled.success, tostring(disabled.error))
            for _, previous in ipairs(saved_settings) do
                local restored = settings:set(previous)
                test.is_true(restored.success, tostring(restored.error))
            end
        end)
        test.after_each(function()
            for _, id in ipairs(fixtures) do
                execute(sql.builder.delete("app_user_identities"):where("user_id = ?", id))
                execute(sql.builder.delete("app_user_bot_accounts"):where("user_id = ?", id))
                local deleted, err = lifecycle.delete(id)
                test.is_nil(err)
                test.not_nil(deleted)
            end
            fixtures = {}
        end)
        test.it("RA-H51 sso refuses an admin-group bot through the host with an empty local guard", function()
            local original = bind_host_only()
            local id = fixture(true, true)
            local result, err = provisioner.link(id, identity(id, "host-only"))
            test.is_nil(select(2, registry.apply_version(original)))
            test.is_nil(result); test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
        end)
        test.it("RA-H51 sso keeps passwordless human admission with the host and an empty local guard", function()
            local original = bind_host_only()
            local id = fixture(false, true)
            local result, err = provisioner.link(id, identity(id, "host-only"))
            test.is_nil(select(2, registry.apply_version(original)))
            test.is_nil(err); test.not_nil(result)
        end)
        test.it("RA-H28 real provider callbacks refuse bot login and linking with a visible authentication error", function()
            for _, mode in ipairs({"email", "subject", "link"}) do
                local id = fixture(true, true)
                local subject = assert(crypto.random.uuid())
                if mode == "subject" then
                    test.not_nil((identities.create({provider = "github", subject = subject,
                        user_id = id, email = id .. "@allowed.com", email_verified = true})))
                end
                local location = complete_callback(id, mode, subject)
                test.contains(location, "sso_error=Authentication%20failed", tostring(location))
                test.is_false(location:find("sso_token", 1, true) ~= nil)
                test.is_false(location:find("sso_linked", 1, true) ~= nil)
                test.eq(identities.count_by_user(id), mode == "subject" and 1 or 0)
                no_sessions(id)
            end
        end)
        test.it("RA-H02 real provider completion mints a human session under the original passwordless UUID", function()
            local id = fixture(false, true)
            local location = complete_callback(id, "email", assert(crypto.random.uuid()))
            local encoded = location:match("#sso_token=(.+)$")
            test.not_nil(encoded)
            local token = assert(http_client.decode_uri(encoded))
            local tokens = assert(security.token_store("kickside.users.security:tokens"))
            local actor, scope, err = tokens:validate(token)
            tokens:close()
            test.is_nil(err)
            test.not_nil(scope)
            test.eq(actor:id(), id)
            test.eq(identities.count_by_user(id), 1)
            test.eq(assert(users.get(id)).password_hash, "!sso:no-password")
        end)
        test.it("RA-H26 protected eligibility refuses bot UUID and email even for a caller with no Users database access", function()
            local id = fixture(true, true)
            local scope = assert(security.new_scope({assert(security.policy("kickside.sso.api:credential_eligibility_policy"))}))
            local caller = funcs.new():with_actor(security.new_actor("credential-consumer", {})):with_scope(scope)
            for _, identifier in ipairs({id, id .. "@allowed.com"}) do
                local eligible, err = caller:call("kickside.users.binding:credential_eligibility", {identifier = identifier})
                test.is_nil(eligible)
                test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
                test.eq(err:details().code, "account_credential_ineligible")
            end
            no_sessions(id)
        end)
        test.it("RA-H45 eligibility preserves lookup outages without attempting email provisioning or explicit linking", function()
            local id = fixture(false, true)
            local db = assert(sql.get("app:db"))
            local _, rename_err = db:execute("ALTER TABLE app_user_bot_accounts RENAME TO bot_sso_unavailable_markers")
            test.is_nil(rename_err)
            local resolved, resolve_err = provisioner.resolve(identity(id, "outage"))
            local linked, link_err = provisioner.link(id, identity(id, "outage-link"))
            local _, restore_err = db:execute("ALTER TABLE bot_sso_unavailable_markers RENAME TO app_user_bot_accounts")
            db:release()
            test.is_nil(restore_err)
            test.is_nil(resolved)
            test.is_nil(linked)
            for _, err in ipairs({resolve_err, link_err}) do
                test.is_true(errors.is(err, errors.INTERNAL), tostring(err))
                test.eq(err:details().code, "DB_OPERATION_FAILED")
                test.not_nil(err:details().cause)
            end
            test.not_nil(resolve_err)
            test.not_nil(link_err)
            test.eq(identities.count_by_user(id), 0)
            no_sessions(id)
            no_provider_group(id)
        end)
        test.it("RA-H45 a missing account is typed NOT_FOUND rather than an eligibility refusal", function()
            local eligible, err = funcs.call("kickside.users.binding:credential_eligibility", {
                identifier = assert(crypto.random.uuid()) .. "@allowed.com"})
            test.is_nil(eligible)
            test.is_true(errors.is(err, errors.NOT_FOUND), tostring(err))
            test.eq(err:details().code, "USER_NOT_FOUND")
        end)
        test.it("RA-H29 link start refuses a forged bot session before creating the provider flow", function()
            local id = fixture(true, true)
            local tokens = assert(security.token_store("kickside.users.security:tokens"))
            local token = assert(tokens:create(security.new_actor(id, {user_id = id}),
                assert(security.named_scope("app.security:admin")), {expiration = "1h"}))
            local gateway = assert(registry.get("app:gateway"))
            local port = assert(tostring(gateway.data.addr):match(":(%d+)$"))
            local response, err = http_client.post("http://127.0.0.1:" .. port .. "/api/v1/sso/oidc/link", {
                headers = {["Authorization"] = "Bearer " .. token}, body = "{}"})
            local deleted, delete_err = index.discard_minted(token)
            tokens:close()
            test.is_nil(delete_err)
            test.not_nil(deleted)
            test.is_nil(err)
            test.eq(response.status_code, 401, tostring(response.body))
            local body = assert(json.decode(response.body))
            test.is_false(body.success)
            test.eq(body.error, "Authentication required")
            test.eq(body.details, "You must be authenticated to access this endpoint")
            test.is_nil(body.url)
            test.is_nil(response.headers["Set-Cookie"])
        end)
        test.it("RA-H29 explicit account linking refuses an admin-group bot before creating a provider identity", function()
            local id = fixture(true, false)
            local linked, err = provisioner.link(id, identity(id, "explicit"))
            test.is_nil(linked)
            test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            test.eq(err:details().code, "account_credential_ineligible")
            test.eq(identities.count_by_user(id), 0)
            no_sessions(id)
            no_provider_group(id)
        end)
        test.it("RA-H29 idempotent linking cannot return a seeded bot provider identity", function()
            local id = fixture(true, true)
            local info = identity(id, "existing")
            test.not_nil((identities.create({provider = info.provider, subject = info.subject,
                user_id = id, email = info.email, email_verified = true})))
            local linked, err = provisioner.link(id, info)
            test.is_nil(linked)
            test.not_nil(err)
            test.eq(identities.count_by_user(id), 1)
            no_sessions(id)
        end)
        test.it("RA-H29 existing-subject login refuses both credential forms without changing provider identity or groups", function()
            for _, passwordless in ipairs({false, true}) do
                local id = fixture(true, passwordless)
                local info = identity(id, "subject")
                test.not_nil((identities.create({provider = info.provider, subject = info.subject,
                    user_id = id, email = info.email, email_verified = true})))
                local before = assert(identities.find_by_subject(info.provider, info.subject))
                local user, err = provisioner.resolve(info)
                test.is_nil(user)
                test.not_nil(err)
                local after = assert(identities.find_by_subject(info.provider, info.subject))
                test.eq(after.last_login_at, before.last_login_at)
                no_sessions(id)
                no_provider_group(id)
            end
        end)
        test.it("RA-H29 verified email matching refuses bots before attempting account auto-creation", function()
            local id = fixture(true, true)
            local user, err = provisioner.resolve(identity(id, "email"))
            test.is_nil(user)
            test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            test.eq(err:details().code, "account_credential_ineligible")
            test.contains(tostring(err), "Authentication failed")
            test.eq(identities.count_by_user(id), 0)
            no_sessions(id)
            no_provider_group(id)
        end)
        test.it("RA-H29 pending bot provisioning neither activates nor reconciles provider groups", function()
            local id = fixture(true, true)
            execute(sql.builder.update("app_users"):set("status", "pending"):where("user_id = ?", id))
            local info = identity(id, "pending")
            test.not_nil((identities.create({provider = info.provider, subject = info.subject,
                user_id = id, email = info.email, email_verified = true})))
            local user, err = provisioner.resolve(info)
            test.is_nil(user)
            test.not_nil(err)
            test.eq(assert(users.get(id)).status, "pending")
            no_sessions(id)
            no_provider_group(id)
        end)
        test.it("RA-H28 direct SSO session mint refuses a bot without releasing a token", function()
            local id = fixture(true, true)
            local minted, err = session.mint({user_id = id}, {sso_provider = "oidc"})
            test.is_nil(minted)
            test.not_nil(err)
            no_sessions(id)
        end)
        test.it("RA-H02 unmarked passwordless humans link, reconcile and mint normally", function()
            local id = fixture(false, true)
            local info = identity(id, "human")
            local linked, link_err = provisioner.link(id, info)
            test.is_nil(link_err)
            test.not_nil(linked)
            local user, err = provisioner.resolve(info)
            test.is_nil(err)
            test.eq(user.user_id, id)
            local minted, mint_err = session.mint(user, {sso_provider = "oidc"})
            test.is_nil(mint_err)
            test.not_nil(minted.token)
            test.eq(assert(users.get(id)).password_hash, "!sso:no-password")
        end)
    end)
end)}
