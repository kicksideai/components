-- Reads SSO configuration from the kickside/settings service (admin-editable,
-- secrets decrypted on read). Global flags plus per-provider credentials, with
-- list parsing for domains/scopes. All reads go through the settings contract, so
-- a settings change takes effect without redeploy.

local contract = require("contract")
local consts = require("sso_consts")
local providers_registry = require("sso_providers_registry")

local M = {}

local function open_settings()
    local def = contract.get(consts.SETTINGS_CONTRACT)
    if not def then return nil end
    return def:open()
end

-- read fetches one setting value from a namespace. Global settings live in the
-- base sso namespace; each provider's credentials live in the provider submodule's
-- own namespace (descriptor.settings_ns).
local function read(inst, ns, key)
    if not inst then return nil end
    local r = inst:get({ namespace = ns, key = key })
    if r and r.success then return r.value end
    return nil
end

-- read_global fetches a global (module-wide) setting from the base namespace.
local function read_global(inst, key)
    return read(inst, consts.SETTINGS_NS, key)
end

local function as_bool(v)
    return v == true or v == "true" or v == 1
end

-- as_list accepts a JSON array (already decoded by the json setting type) or a
-- comma/space-separated string; returns a clean lowercased list.
local function as_list(v, lower)
    local out = {}
    local function push(s)
        if type(s) ~= "string" then return end
        s = s:gsub("^%s+", ""):gsub("%s+$", "")
        if s == "" then return end
        out[#out + 1] = lower and s:lower() or s
    end

    if type(v) == "table" then
        for _, item in ipairs(v) do push(item) end
    elseif type(v) == "string" then
        for token in v:gmatch("[^%s,]+") do push(token) end
    end
    return out
end

-- global returns module-wide configuration.
function M.global()
    local inst = open_settings()
    local base = read_global(inst, consts.KEY.PUBLIC_BASE_PATH)
    if type(base) ~= "string" or base == "" then
        base = consts.DEFAULT_PUBLIC_BASE_PATH
    end

    local claim = read_global(inst, consts.KEY.GROUP_CLAIM_NAME)
    if type(claim) ~= "string" or claim == "" then
        claim = consts.DEFAULT_GROUP_CLAIM
    end

    local mapping = read_global(inst, consts.KEY.GROUP_MAPPING)
    if type(mapping) ~= "table" then
        mapping = {}
    end

    return {
        enabled = as_bool(read_global(inst, consts.KEY.ENABLED)),
        auto_provision = as_bool(read_global(inst, consts.KEY.AUTO_PROVISION)),
        allowed_email_domains = as_list(read_global(inst, consts.KEY.ALLOWED_EMAIL_DOMAINS), true),
        default_group = read_global(inst, consts.KEY.DEFAULT_GROUP),
        group_claim_name = claim,
        group_mapping = mapping,
        redirect_allowlist = as_list(read_global(inst, consts.KEY.REDIRECT_ALLOWLIST), false),
        public_base_path = base,
    }
end

-- provider returns the configuration for one provider id, or nil for an unknown
-- provider. The descriptor (registry-driven) declares which extra settings to
-- read — tenant_setting / issuer_setting — so per-provider branching lives in the
-- descriptor, not here. has_creds reports whether both client id and secret are
-- present; cfg.descriptor carries the resolved descriptor for the connector.
function M.provider(name)
    local desc = providers_registry.get_provider(name)
    if not desc then return nil end

    -- Credentials live in the provider submodule's own namespace; the descriptor
    -- declares it. A descriptor without one falls back to the base namespace.
    local ns = desc.settings_ns or consts.SETTINGS_NS

    local inst = open_settings()
    local cfg = {
        name = name,
        descriptor = desc,
        enabled = as_bool(read(inst, ns, consts.PKEY.ENABLED)),
        client_id = read(inst, ns, consts.PKEY.CLIENT_ID),
        client_secret = read(inst, ns, consts.PKEY.CLIENT_SECRET),
        scopes = as_list(read(inst, ns, consts.PKEY.SCOPES), false),
        trust_email = desc.trust_email,
    }

    if desc.tenant_setting then
        cfg.tenant = read(inst, ns, desc.tenant_setting :: string)
    end
    if desc.issuer_setting then
        cfg.issuer = read(inst, ns, desc.issuer_setting :: string)
    end
    if desc.trust_email_setting then
        cfg.trust_email = cfg.trust_email or as_bool(read(inst, ns, desc.trust_email_setting :: string))
    end

    cfg.has_creds = type(cfg.client_id) == "string" and cfg.client_id ~= ""
        and type(cfg.client_secret) == "string" and cfg.client_secret ~= ""
    return cfg
end

-- enabled_providers lists providers that are both enabled and credentialed, the
-- set the login UI should offer. Honors the module-wide enable flag. Iterates the
-- discovered descriptors, so a new provider appears with no code change.
function M.enabled_providers()
    local g = M.global()
    local out = {}
    if not g.enabled then return out end

    for _, desc in ipairs(providers_registry.find_providers()) do
        local p = M.provider(desc.id)
        if p and p.enabled and p.has_creds then
            out[#out + 1] = desc.id
        end
    end
    return out
end

return M
