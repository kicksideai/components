-- Shared enable-gate logic that each provider's OWN validate function composes
-- (each provider submodule declares its own `validate` wired to its `enabled`
-- setting, so providers enable/disable independently). Blocks enabling a provider
-- that has no credentials, and a provider whose endpoints come from a configured
-- issuer (generic OIDC) until that issuer is set. This is also the seam where a
-- provider can add its own rules (plan/subscription gating, required tenant, …)
-- before delegating here. Returns { valid = bool, error? }.

local consts = require("sso_consts")
local config = require("sso_config")

local M = {}

-- check gates enabling `provider_id` given the settings-writer validate args
-- ({ key, value, old_value, definition }). A non-enable change always passes.
function M.check(provider_id, args)
    local value = type(args) == "table" and args.value or nil
    local enabling = value == true or value == "true"
    if not enabling then return { valid = true } end

    local cfg = config.provider(provider_id)
    if not cfg or not cfg.has_creds then
        return { valid = false, error = consts.ERROR.PROVIDER_MISCONFIGURED }
    end
    if cfg.descriptor.issuer_setting and (not cfg.issuer or cfg.issuer == "") then
        return { valid = false, error = "OIDC issuer must be set before enabling" }
    end
    return { valid = true }
end

return M
