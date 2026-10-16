-- Shared constants for the kickside.sso module: settings vocabulary, the
-- locked-password sentinel, the flow cookie, and error strings, plus the
-- configured-DB resolver. The provider set itself is registry-driven (see
-- providers_registry); is_known_provider delegates there. Light helpers only.

local registry = require("registry")
local providers_registry = require("sso_providers_registry")

local M = {}

M.NAMESPACE = "kickside.sso"

-- Registry entry whose meta.db_id holds the configured database resource. The
-- target_db ns.requirement rewrites that field per deployment.
M.DB_CONFIG = "kickside.sso:db_config"

-- Settings live in this namespace and are read through the settings contract.
M.SETTINGS_NS = "kickside.sso"
M.SETTINGS_CONTRACT = "kickside.settings:settings"

-- Global (module-wide) setting keys.
M.KEY = {
    ENABLED = "enabled",
    AUTO_PROVISION = "auto_provision",
    ALLOWED_EMAIL_DOMAINS = "allowed_email_domains",
    DEFAULT_GROUP = "default_group",
    GROUP_CLAIM_NAME = "group_claim_name",
    GROUP_MAPPING = "group_mapping",
    REDIRECT_ALLOWLIST = "post_login_redirect_allowlist",
    PUBLIC_BASE_PATH = "public_base_path",
}

-- Default IdP groups claim name when group_claim_name is unset.
M.DEFAULT_GROUP_CLAIM = "groups"

-- Default mount path of the public SSO endpoints (the prefix of the public
-- router plus the module's /sso group). Used to build absolute authorize/callback
-- URLs. Overridable via the public_base_path setting when mounted elsewhere.
M.DEFAULT_PUBLIC_BASE_PATH = "/api/public/sso"

-- Per-provider key suffix; the full setting key is "<provider>_<suffix>".
M.PKEY = {
    ENABLED = "enabled",
    CLIENT_ID = "client_id",
    CLIENT_SECRET = "client_secret",
    SCOPES = "scopes",
}

-- Stored in app_users.password_hash for SSO-only accounts. It can never equal a
-- SHA-512 digest (it contains ':' and '!'), so user_repo.verify_password always
-- fails for these accounts: password login is disabled until the user sets one.
-- This is the idiomatic Unix shadow-file "!"/"*" locked-password convention, not
-- a random-password hack, and it keeps the module portable (no NOT NULL change to
-- app_users, which SQLite cannot drop in place).
M.NO_PASSWORD = "!sso:no-password"

-- Canonical active account status; an account must be active to sign in.
M.USER_STATUS_ACTIVE = "active"

-- Short-lived cookie carrying the in-flight flow's state for CSRF cross-check.
M.FLOW_COOKIE = "sso_flow"
M.FLOW_TTL_SECONDS = 600

-- Unreserved character set for a PKCE code verifier (RFC 7636).
M.PKCE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"

-- Identity link table owned by this module.
M.TABLE = "app_user_identities"

M.ERROR = {
    PROVIDER_UNKNOWN = "Unknown provider",
    PROVIDER_DISABLED = "Provider is not enabled",
    PROVIDER_MISCONFIGURED = "Provider is missing client credentials",
    STATE_MISMATCH = "State does not match (possible CSRF)",
    FLOW_EXPIRED = "Login flow expired; please try again",
    EMAIL_UNVERIFIED = "Provider did not return a verified email",
    DOMAIN_NOT_ALLOWED = "Email domain is not allowed to sign up",
    PROVISION_DISABLED = "Automatic account creation is disabled",
    ACCOUNT_INACTIVE = "Account is not active",
    REDIRECT_NOT_ALLOWED = "Redirect target is not allowed",
    TOKEN_EXCHANGE_FAILED = "Failed to exchange authorization code",
    USERINFO_FAILED = "Failed to retrieve user information",
    LAST_CREDENTIAL = "Cannot unlink the only sign-in method for this account",
}

-- domain_of returns the lowercased domain part of an email, or nil.
function M.domain_of(email)
    if type(email) ~= "string" then return nil end
    local at = email:find("@", 1, true)
    if not at then return nil end
    local domain = email:sub(at + 1):lower()
    if domain == "" then return nil end
    return domain
end

-- is_known_provider reports whether a provider descriptor is registered for name.
-- Delegates to the registry-driven discovery so the provider set has one source.
function M.is_known_provider(name)
    return providers_registry.is_known_provider(name)
end

-- db_id resolves the configured DB id the repo binds to, reading db_config's
-- meta.db_id so a target_db rebind reaches the persist layer.
function M.db_id(): string
    local entry, err = registry.get(M.DB_CONFIG)
    if not err and entry then
        local meta = entry.meta or {}
        if type(meta.db_id) == "string" and meta.db_id ~= "" then
            return meta.db_id
        end
    end
    error("kickside.sso:target_db was not bound by the host application", 2)
end

return M
