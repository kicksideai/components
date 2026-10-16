local test = require("test")
local oidc = require("sso_oidc")

local function identity_with_trust(trust_email, email_verified)
    return oidc.normalize_identity({
        name = "oidc",
        trust_email = trust_email,
    }, {
        sub = "user-x",
        email = "user@example.com",
        email_verified = email_verified,
        name = "User X",
        picture = "https://issuer.test/user.png",
    })
end

local function define_tests()
    describe("OIDC email trust", function()
        it("keeps an unverified provider email unverified by default", function()
            local identity = identity_with_trust(false, false)
            test.eq(identity.email, "user@example.com")
            test.eq(identity.email_verified, false)
        end)

        it("accepts an unverified provider email after explicit opt-in", function()
            local identity = identity_with_trust(true, nil)
            test.eq(identity.email, "user@example.com")
            test.eq(identity.email_verified, true)
        end)
    end)
end

return test.run_cases(define_tests)
