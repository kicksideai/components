local test = require("test")
local util = require("sso_util")
local redirect = require("sso_redirect")
local consts = require("sso_consts")

-- Pure-logic coverage for the encoding, open-redirect, and constant helpers.
-- DB- and provider-dependent paths are exercised by the harness suites in test/.
local function define_tests()
    describe("sso util encoding", function()
        it("base64url round-trips binary data", function()
            local samples = { "", "hello", "\0\1\2\255\254", "a?b/c+d=e" }
            for _, s in ipairs(samples) do
                test.eq(util.base64url_decode(util.base64url_encode(s)), s)
            end
        end)

        it("base64url output omits +, / and =", function()
            local e = util.base64url_encode("\251\255\254\253\252\250")
            test.is_true(e:find("[+/=]") == nil)
        end)

        it("url_encode preserves unreserved and escapes reserved", function()
            test.eq(util.url_encode("AZaz09-._~"), "AZaz09-._~")
            test.eq(util.url_encode("a b&c=d"), "a%20b%26c%3Dd")
        end)

        it("form_encode escapes keys and values", function()
            local body = util.form_encode({ code = "a/b+c" })
            test.is_true(body:find("code=a%2Fb%2Bc", 1, true) ~= nil)
        end)
    end)

    describe("redirect guard", function()
        it("allows same-origin absolute paths", function()
            test.eq(redirect.safe("/dashboard", {}), "/dashboard")
        end)

        it("rejects protocol-relative targets", function()
            test.eq(redirect.safe("//evil.com/x", {}), "/")
        end)

        it("rejects absolute URLs outside the allowlist", function()
            test.eq(redirect.safe("https://evil.com/x", { "https://app.example.com" }), "/")
        end)

        it("rejects a prefix over-match of an allowlisted origin", function()
            test.eq(redirect.safe("https://app.example.com.evil.com/x", { "https://app.example.com" }), "/")
        end)

        it("allows allowlisted absolute URLs", function()
            test.eq(
                redirect.safe("https://app.example.com/home", { "https://app.example.com" }),
                "https://app.example.com/home"
            )
        end)

        it("falls back to / for empty or nil targets", function()
            test.eq(redirect.safe("", {}), "/")
            test.eq(redirect.safe(nil, {}), "/")
        end)

        it("appends a url-encoded fragment", function()
            test.eq(redirect.with_fragment("/x", "sso_token", "a b"), "/x#sso_token=a%20b")
        end)
    end)

    describe("consts helpers", function()
        it("extracts a lowercased email domain", function()
            test.eq(consts.domain_of("User@Example.COM"), "example.com")
            test.is_nil(consts.domain_of("notanemail"))
            test.is_nil(consts.domain_of(nil))
        end)

        it("recognizes the shipped providers only", function()
            test.is_true(consts.is_known_provider("google"))
            test.is_true(consts.is_known_provider("microsoft"))
            test.is_true(consts.is_known_provider("oidc"))
            test.eq(consts.is_known_provider("facebook"), false)
        end)

        it("uses a locked-password sentinel that cannot be a sha512 digest", function()
            test.is_true(consts.NO_PASSWORD:find(":", 1, true) ~= nil)
            test.is_true(consts.NO_PASSWORD:find("!", 1, true) ~= nil)
        end)
    end)
end

return test.run_cases(define_tests)
