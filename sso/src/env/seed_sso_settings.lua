-- Optional boot seed for SSO. Blank env variables are a no-op; complete
-- provider credential sets are written through kickside/settings and enabled.

local env = require("env")
local contract = require("contract")

local seed_plan = require("sso_seed_plan")

local GLOBAL_NS = "kickside.sso"

local function trim(value)
    return tostring(value or ""):match("^%s*(.-)%s*$") or ""
end

local function read(id: string): string
    local value = env.get(id)
    return trim(value)
end

local function settings()
    local def, derr = contract.get("kickside.settings:settings")
    if derr or not def then
        error("SSO settings seed: settings contract unavailable: " .. tostring(derr))
    end
    local inst, oerr = def:open()
    if oerr or not inst then
        error("SSO settings seed: settings open failed: " .. tostring(oerr))
    end
    return inst
end

local function set(inst: any, namespace: string, key: string, value: any)
    local result = inst:set({ namespace = namespace, key = key, value = value })
    if not result or not result.success then
        error("SSO settings seed: failed to set " .. namespace .. "/" .. key .. ": " .. tostring(result and result.error))
    end
end

type ProviderSeed = {
    namespace: string,
    client_id_env: string,
    client_secret_env: string,
    issuer_env: string?,
    tenant_env: string?,
}

local function seed_provider(inst: any, provider: ProviderSeed): boolean
    local client_id = read(tostring(provider.client_id_env or ""))
    local client_secret = read(tostring(provider.client_secret_env or ""))
    if client_id == "" or client_secret == "" then
        return false
    end

    if provider.issuer_env then
        local issuer = read(tostring(provider.issuer_env))
        if issuer == "" then return false end
        set(inst, provider.namespace, "issuer", issuer)
    end

    set(inst, provider.namespace, "client_id", client_id)
    set(inst, provider.namespace, "client_secret", client_secret)

    if provider.tenant_env then
        local tenant = read(tostring(provider.tenant_env))
        if tenant ~= "" then set(inst, provider.namespace, "tenant", tenant) end
    end

    -- Provider validate_func rejects enabled=true unless required fields are set.
    set(inst, provider.namespace, "enabled", true)
    return true
end

local function run()
    local providers: { ProviderSeed } = {
        {
            namespace = "kickside.sso.providers.google",
            client_id_env = "kickside.sso.env:google_client_id",
            client_secret_env = "kickside.sso.env:google_client_secret",
        },
        {
            namespace = "kickside.sso.providers.microsoft",
            client_id_env = "kickside.sso.env:microsoft_client_id",
            client_secret_env = "kickside.sso.env:microsoft_client_secret",
            tenant_env = "kickside.sso.env:microsoft_tenant",
        },
        {
            namespace = "kickside.sso.providers.github",
            client_id_env = "kickside.sso.env:github_client_id",
            client_secret_env = "kickside.sso.env:github_client_secret",
        },
        {
            namespace = "kickside.sso.providers.oidc",
            issuer_env = "kickside.sso.env:oidc_issuer",
            client_id_env = "kickside.sso.env:oidc_client_id",
            client_secret_env = "kickside.sso.env:oidc_client_secret",
        },
    }

    local any_enabled = false
    for _, provider in ipairs(providers) do
        if read(tostring(provider.client_id_env or "")) ~= ""
            and read(tostring(provider.client_secret_env or "")) ~= "" then
            any_enabled = true
            break
        end
    end
    if not any_enabled then
        return { status = "success", message = "no complete SSO provider env; nothing seeded" }
    end

    local inst = settings()
    local seeded = 0
    for _, provider in ipairs(providers) do
        if seed_provider(inst, provider) then seeded = seeded + 1 end
    end

    if seeded > 0 then
        local plan = seed_plan.global_plan({
            public_base_path = read("kickside.sso.env:public_base_path"),
            allowed_email_domains = read("kickside.sso.env:allowed_email_domains"),
            default_group = read("kickside.sso.env:default_group"),
        })
        for _, item in ipairs(plan) do
            set(inst, GLOBAL_NS, tostring(item.key), item.value)
        end
    end

    return { status = "success", message = "seeded " .. tostring(seeded) .. " SSO provider(s) from env" }
end

return { run = run }
