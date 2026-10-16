local test = require("test")
local crypto = require("crypto")
local oidc = require("sso_oidc")
local github = require("sso_github")

-- Unit coverage for the connector layer: authorize-URL building and the
-- security-critical id_token claim validation (iss/aud/exp/nonce). The claim
-- checks run on the no-JWKS fallback path (empty jwks_uri), so no network is hit;
-- tokens are built with crypto.jwt.encode and the fallback decodes the payload.
local OIDC_D = {
    name = "oidc",
    client_id = "client-x",
    trust_email = false,
    endpoints = { jwks = "", issuer = "https://issuer.test" },
}

local function token(claims)
    return (crypto.jwt.encode(claims, "secret", "HS256"))
end

local function define_tests()
    describe("oidc.build_authorize_url", function()
        it("prepends openid scope and sets the S256 PKCE challenge + state + nonce", function()
            local url = oidc.build_authorize_url(
                { client_id = "cid", scopes = { "email" }, endpoints = { authorize = "https://idp/auth" } },
                { redirect_uri = "https://app/cb", state = "st", nonce = "no", code_challenge = "ch" }
            )
            test.is_true(url:find("https://idp/auth?", 1, true) == 1)
            test.is_true(url:find("scope=openid", 1, true) ~= nil)
            test.is_true(url:find("code_challenge_method=S256", 1, true) ~= nil)
            test.is_true(url:find("state=st", 1, true) ~= nil)
            test.is_true(url:find("nonce=no", 1, true) ~= nil)
        end)
    end)

    describe("github.build_authorize_url", function()
        it("uses the descriptor's enterprise authorize endpoint", function()
            local url = github.build_authorize_url(
                { client_id = "gid", endpoints = { authorize = "https://enterprise.example.invalid/login/oauth/authorize" } },
                { redirect_uri = "https://app/cb", state = "st" }
            )
            test.is_true(url:find("https://enterprise.example.invalid/login/oauth/authorize?", 1, true) == 1)
        end)

        it("builds a GitHub authorize URL with state and no PKCE", function()
            local url = github.build_authorize_url(
                { client_id = "gid", scopes = {}, endpoints = { authorize = "https://github.com/login/oauth/authorize" } },
                { redirect_uri = "https://app/cb", state = "st" }
            )
            test.is_true(url:find("github.com/login/oauth/authorize", 1, true) ~= nil)
            test.is_true(url:find("state=st", 1, true) ~= nil)
            test.is_true(url:find("code_challenge", 1, true) == nil)
        end)
    end)

    describe("oidc.validate_id_token claim checks", function()
        it("accepts a token with matching iss/aud/exp/nonce", function()
            local claims, err = oidc.validate_id_token(
                OIDC_D, token({ iss = "https://issuer.test", aud = "client-x", exp = 4102444800, nonce = "n1", sub = "u" }), "n1")
            test.is_nil(err)
            test.eq(claims.sub, "u")
        end)

        it("rejects an audience mismatch", function()
            local claims, err = oidc.validate_id_token(
                OIDC_D, token({ iss = "https://issuer.test", aud = "someone-else", exp = 4102444800 }), nil)
            test.is_nil(claims)
            test.is_true(err:find("audience", 1, true) ~= nil)
        end)

        it("rejects an issuer mismatch", function()
            local claims, err = oidc.validate_id_token(
                OIDC_D, token({ iss = "https://evil.test", aud = "client-x", exp = 4102444800 }), nil)
            test.is_nil(claims)
            test.is_true(err:find("issuer", 1, true) ~= nil)
        end)

        it("rejects an expired token", function()
            local claims, err = oidc.validate_id_token(
                OIDC_D, token({ iss = "https://issuer.test", aud = "client-x", exp = 1000000000 }), nil)
            test.is_nil(claims)
            test.is_true(err:find("expired", 1, true) ~= nil)
        end)

        it("rejects a nonce mismatch", function()
            local claims, err = oidc.validate_id_token(
                OIDC_D, token({ iss = "https://issuer.test", aud = "client-x", exp = 4102444800, nonce = "n1" }), "different")
            test.is_nil(claims)
            test.is_true(err:find("nonce", 1, true) ~= nil)
        end)
    end)

    describe("oidc.validate_id_token multi-tenant issuer pinning", function()
        local MT = {
            name = "microsoft",
            client_id = "client-x",
            trust_email = true,
            endpoints = { jwks = "", issuer = "https://login.microsoftonline.com/{tenantid}/v2.0" },
        }

        it("accepts a token whose iss matches its own tid", function()
            local claims, err = oidc.validate_id_token(MT, token({
                iss = "https://login.microsoftonline.com/tenant-1/v2.0",
                tid = "tenant-1", aud = "client-x", exp = 4102444800, sub = "u",
            }), nil)
            test.is_nil(err)
            test.eq(claims.sub, "u")
        end)

        it("rejects a token whose iss does not match its tid (foreign tenant)", function()
            local claims, err = oidc.validate_id_token(MT, token({
                iss = "https://login.microsoftonline.com/attacker-tenant/v2.0",
                tid = "tenant-1", aud = "client-x", exp = 4102444800,
            }), nil)
            test.is_nil(claims)
            test.is_true(err:find("issuer", 1, true) ~= nil)
        end)

        it("rejects a multi-tenant token with no tid", function()
            local claims, err = oidc.validate_id_token(MT, token({
                iss = "https://login.microsoftonline.com/tenant-1/v2.0",
                aud = "client-x", exp = 4102444800,
            }), nil)
            test.is_nil(claims)
            test.is_true(err:find("tid", 1, true) ~= nil)
        end)
    end)
end

return test.run_cases(define_tests)
