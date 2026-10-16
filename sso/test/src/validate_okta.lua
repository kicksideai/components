-- Harness Okta's own enable-gate (mirrors a real provider's validate.lua),
-- composing the shared gate. Proves a registry-declared provider gets independent
-- enable validation with no module code change.
local gate = require("sso_provider_gate")

local function validate(args)
    return gate.check("okta", args)
end

return { validate = validate }
