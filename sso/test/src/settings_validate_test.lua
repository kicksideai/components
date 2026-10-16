local test = require("test")
local contract = require("contract")
local security = require("security")

-- Verifies the validate_func (wired through the settings writer) blocks enabling a
-- provider with no credentials and permits it once they are set.
local function define_tests()
    describe("settings validate_func (provider enable gate)", function()
        local policy = security.policy("app:admin_scope")
        local inst = contract.get("kickside.settings:settings")
            :with_actor(security.new_actor("test", {}))
            :with_scope(security.new_scope({ policy }))
            :open()
        local function set(ns, key, value)
            return inst:set({ namespace = ns, key = key, value = value })
        end
        local GOOGLE_NS = "kickside.sso.providers.google"
        local OIDC_NS = "kickside.sso.providers.oidc"

        it("rejects enabling a provider without client credentials", function()
            set(GOOGLE_NS, "client_id", "")
            set(GOOGLE_NS, "client_secret", "")
            local r = set(GOOGLE_NS, "enabled", true)
            test.eq(r.success, false)
            test.is_true(type(r.error) == "string")
        end)

        it("permits enabling once credentials are configured", function()
            set(GOOGLE_NS, "client_id", "client-abc")
            set(GOOGLE_NS, "client_secret", "secret-xyz")
            local r = set(GOOGLE_NS, "enabled", true)
            test.eq(r.success, true)
        end)

        it("rejects enabling generic OIDC without an issuer", function()
            set(OIDC_NS, "client_id", "cid")
            set(OIDC_NS, "client_secret", "csec")
            set(OIDC_NS, "issuer", "")
            local r = set(OIDC_NS, "enabled", true)
            test.eq(r.success, false)
        end)
    end)
end

return test.run_cases(define_tests)
