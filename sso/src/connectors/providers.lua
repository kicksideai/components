-- Resolves a provider id into a connector descriptor (credentials + endpoints +
-- engine) and dispatches the authorize/complete calls to the right engine. The
-- provider set and its endpoint strategy are registry-driven: config.provider
-- attaches the discovered descriptor, and this layer turns it into a ready
-- connector — static endpoints when declared, otherwise issuer discovery (issuer
-- template + tenant, or a configured issuer). The engine field ('oidc'|'github')
-- selects the connector library; no provider name is hardcoded here.

local consts = require("sso_consts")
local config = require("sso_config")
local oidc = require("sso_oidc")
local github = require("sso_github")

local M = {}

-- merge_scopes unions the descriptor's default scopes with the admin-configured
-- extras, de-duplicated and order-preserving (defaults first).
local function merge_scopes(defaults, extras)
    local out, seen = {}, {}
    local function add(s)
        if type(s) == "string" and s ~= "" and not seen[s] then
            seen[s] = true
            out[#out + 1] = s
        end
    end
    for _, s in ipairs(defaults or {}) do add(s) end
    for _, s in ipairs(extras or {}) do add(s) end
    return out
end

-- resolve returns a connector descriptor for an enabled, credentialed provider,
-- or (nil, error) explaining why it is unavailable.
function M.resolve(name)
    local cfg = config.provider(name)
    if not cfg then return nil, consts.ERROR.PROVIDER_UNKNOWN end
    if not cfg.enabled then return nil, consts.ERROR.PROVIDER_DISABLED end
    if not cfg.has_creds then return nil, consts.ERROR.PROVIDER_MISCONFIGURED end

    local desc = cfg.descriptor
    local base = {
        name = name,
        engine = desc.engine,
        client_id = cfg.client_id,
        client_secret = cfg.client_secret,
        scopes = merge_scopes(desc.default_scopes, cfg.scopes),
        trust_email = cfg.trust_email,
        group_claim_name = config.global().group_claim_name,
    }

    -- GitHub uses the provider descriptor for OAuth and REST endpoints.
    if desc.engine == "github" then
        base.endpoints = desc.endpoints
        return base
    end

    -- OIDC: static endpoints when the descriptor declares them (Google), else
    -- discover from the issuer. A multi-tenant template substitutes {tenant} from
    -- the tenant setting; discovery keeps the {tenantid} issuer template, which
    -- oidc.validate_id_token pins to the token's own `tid`.
    if desc.endpoints then
        base.endpoints = desc.endpoints
        return base
    end

    local issuer
    if desc.issuer_template then
        local tenant = (type(cfg.tenant) == "string" and cfg.tenant ~= "") and cfg.tenant or "organizations"
        issuer = (desc.issuer_template:gsub("{tenant}", tenant))
    elseif desc.issuer_setting then
        issuer = cfg.issuer
    end

    if type(issuer) ~= "string" or issuer == "" then
        return nil, "OIDC issuer is not configured"
    end

    local disc, derr = oidc.discover(issuer)
    if derr then return nil, "OIDC discovery failed: " .. derr end
    base.endpoints = disc
    return base
end

function M.build_authorize_url(descriptor, params)
    if descriptor.engine == "github" then
        return github.build_authorize_url(descriptor, params)
    end
    return oidc.build_authorize_url(descriptor, params)
end

function M.complete(descriptor, params)
    if descriptor.engine == "github" then
        return github.complete(descriptor, params)
    end
    return oidc.complete(descriptor, params)
end

-- uses_pkce reports whether the provider participates in PKCE (GitHub does not).
function M.uses_pkce(descriptor)
    return descriptor.engine ~= "github"
end

return M
