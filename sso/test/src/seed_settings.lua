-- Harness-only boot seed: when SSO_OIDC_ISSUER is present in the environment,
-- configures the generic OIDC provider through the settings contract so the live
-- e2e (dex / Keycloak) can run without going through the admin UI. No-op without
-- the env, so the unit suites are unaffected.

local env = require("env")
local contract = require("contract")

local function run()
    local issuer = env.get("app.env:sso_oidc_issuer")
    if not issuer or issuer == "" then
        return { status = "success", message = "no SSO_OIDC_ISSUER; nothing seeded" }
    end

    local inst = contract.get("kickside.settings:settings"):open()
    local function set(ns, key, value)
        local r = inst:set({ namespace = ns, key = key, value = value, actor_id = "harness" })
        if not r or not r.success then
            error("seed_settings failed to set " .. ns .. "/" .. key .. ": " .. tostring(r and r.error))
        end
    end

    local GLOBAL_NS = "kickside.sso"
    local OIDC_NS = "kickside.sso.providers.oidc"

    local domains = {}
    for d in (env.get("app.env:sso_allowed_domains") or ""):gmatch("[^,]+") do
        domains[#domains + 1] = d
    end

    set(GLOBAL_NS, "public_base_path", env.get("app.env:sso_public_base_path") or "/api/public/sso")
    set(GLOBAL_NS, "auto_provision", true)
    set(GLOBAL_NS, "allowed_email_domains", domains)
    -- Credentials before the enable toggle: validate_func rejects enabling without them.
    set(OIDC_NS, "issuer", issuer)
    set(OIDC_NS, "client_id", env.get("app.env:sso_oidc_client_id") or "")
    set(OIDC_NS, "client_secret", env.get("app.env:sso_oidc_client_secret") or "")
    set(OIDC_NS, "enabled", true)
    set(GLOBAL_NS, "enabled", true)

    return { status = "success", message = "seeded OIDC provider from environment" }
end

return { run = run }
