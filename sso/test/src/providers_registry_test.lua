local test = require("test")
local security = require("security")
local contract = require("contract")
local providers_registry = require("sso_providers_registry")
local config = require("sso_config")
local providers = require("sso_providers")

-- The provider set is registry-driven: descriptors are registry.entry rows with
-- meta.type = sso.provider. These cover discovery of the shipped providers and the
-- extensibility contract — the harness declares a fake "okta" descriptor + its
-- credential settings, and it must surface in enabled_providers()/resolve() with no
-- module code change.
local function ids(list)
    local set = {}
    for _, v in ipairs(list) do set[v] = true end
    return set
end

local function admin_settings()
    local policy = security.policy("app:admin_scope")
    return contract.get("kickside.settings:settings")
        :with_actor(security.new_actor("test", {}))
        :with_scope(security.new_scope({ policy }))
        :open()
end

local function define_tests()
    describe("provider discovery", function()
        it("discovers the shipped providers with their descriptor fields", function()
            local found = {}
            for _, d in ipairs(providers_registry.find_providers()) do
                found[d.id] = d
            end

            test.is_true(found.google ~= nil)
            test.eq(found.google.engine, "oidc")
            test.eq(found.google.label, "Google")
            test.eq(found.google.icon, "tabler:brand-google")
            test.is_true(found.google.endpoints ~= nil)
            test.eq(found.google.endpoints.token, "https://oauth2.googleapis.com/token")

            test.eq(found.microsoft.engine, "oidc")
            test.eq(found.microsoft.tenant_setting, "tenant")
            test.eq(found.microsoft.settings_ns, "kickside.sso.providers.microsoft")
            test.eq(found.microsoft.trust_email, true)
            test.is_nil(found.microsoft.endpoints)

            test.eq(found.github.engine, "github")
            test.eq(found.oidc.engine, "oidc")
            test.eq(found.oidc.issuer_setting, "issuer")
            test.eq(found.oidc.settings_ns, "kickside.sso.providers.oidc")
        end)

        it("orders descriptors by order then id", function()
            local seq = {}
            for _, d in ipairs(providers_registry.find_providers()) do
                seq[#seq + 1] = d.id
            end
            -- google(10) precedes microsoft(20) precedes github(30) precedes oidc(40).
            local pos = {}
            for i, id in ipairs(seq) do pos[id] = i end
            test.is_true(pos.google < pos.microsoft)
            test.is_true(pos.microsoft < pos.github)
            test.is_true(pos.github < pos.oidc)
        end)

        it("resolves known/unknown providers through discovery", function()
            test.is_true(providers_registry.is_known_provider("google"))
            test.is_true(providers_registry.get_provider("github") ~= nil)
            test.eq(providers_registry.is_known_provider("facebook"), false)
            test.is_nil(providers_registry.get_provider("facebook"))
        end)
    end)

    describe("registry-driven extensibility (new provider, no code change)", function()
        local inst = admin_settings()
        local function set(ns, key, value)
            return inst:set({ namespace = ns, key = key, value = value })
        end
        local OKTA_NS = "kickside.sso.providers.okta"

        it("discovers a harness-declared descriptor", function()
            local okta = providers_registry.get_provider("okta")
            test.is_true(okta ~= nil)
            test.eq(okta.engine, "oidc")
            test.eq(okta.label, "Okta (test)")
            test.eq(okta.settings_ns, OKTA_NS)
            test.eq(okta.trust_email_setting, "allow_unverified_email")
        end)

        it("surfaces the new provider in enabled_providers and resolve once configured", function()
            set("kickside.sso", "enabled", true)
            set(OKTA_NS, "client_id", "okta-cid")
            set(OKTA_NS, "client_secret", "okta-secret")
            local r = set(OKTA_NS, "enabled", true)
            test.eq(r.success, true)

            test.is_true(ids(config.enabled_providers()).okta == true)

            local desc, derr = providers.resolve("okta")
            test.is_nil(derr)
            test.is_true(desc ~= nil)
            test.eq(desc.engine, "oidc")
            test.eq(desc.client_id, "okta-cid")
            test.eq(desc.endpoints.authorize, "https://okta.test/oauth2/v1/authorize")
            test.eq(desc.trust_email, false)
            -- default_scopes carry through to the connector.
            test.eq(desc.scopes[1], "openid")

            set(OKTA_NS, "allow_unverified_email", true)
            desc, derr = providers.resolve("okta")
            test.is_nil(derr)
            test.eq(desc.trust_email, true)
        end)
    end)
end

return test.run_cases(define_tests)
