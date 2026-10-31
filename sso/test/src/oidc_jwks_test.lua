local test = require("test")
local crypto = require("crypto")
local registry = require("registry")
local oidc = require("sso_oidc")
local oauth_fixture = require("oauth_fixture")

local RSA_PRIVATE_PEM = [[-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAtScB7idg2HV7z8lzxgUkVC7krsc6spvTfby2y1pLbB/GROiX
FMX/ZrTiCfy69h7PhP+uXbzw7+aDnK5SyQ8gwvWnxQt3vUQ1cTLqZmgSzsjxjfM3
BjnNfZaFd1oXIp0cPsJJBzLj7Kzohm/vW/Vf5DrfoUU1HvFDwyvnK6/6eVJhUbQa
frtMNsyRfSgRyNr6pMc0y9xkRCao+NnesVunjEs021ZOWXAM09ZJo8tB+f75DXTR
9RdosiiZecqrsp4R9FYQfpcemb8ruTFnta4OaHq0HCy1zsTN2XeVn67FB2bm3lAI
k2ijhiPiGN5+9J1ps2YfKO8ktaeNOYDgeWizFQIDAQABAoIBABe7losm6Y8yRRhB
4kMNJWdKBXfIbi48MAcHFEOr/rmZqBYbCsAT+JPyGrMIQ04/VxyriqKJQF+Nqax7
QilJLBeeq24rRHKtXvsHmqHz/JLOzKa2OH0+UWeksrOiP+mu/6ZROdQRnL7DIGuM
eqVnjjqOZAHy2TTGkwQc2lpk4cHHCn6fzJgV8Y6/NJeoP/U2GFgKwpG0eLzbxB4o
VIs2trWpT9T2wYSQOqElyf+KSQWUEaQAIO4178H0fVkuBuqX7vJNedkEDUCKYSMQ
tkO/hujVetZnQMewFM5kLisIkaNebw8BZ+qIDtQW37ZkCjiX/GTH4Y73lGGsTtgL
1BYFKkECgYEA7MusQbsUI5OG7uTzbb5YdjAlfvQcaWdzNE6lCP4LgN/v5uVVB020
dLmC02ap8OOzmax89zqcgLVAZyl6K+lJxt2cVa/H4kiLFiTm7oY1hXX0JTw5Stqc
HPybgpjmSj6h3cY2UDKICSOepLkOID181b0+U7MDPTwHRrvbkHd3mpkCgYEAw9gT
UcLNVXXejRnwjXTkRHdmxpXinObxUxgnhBPwYmnOh1GVB/m7Qqs4HcPUjbyik+mX
hWKOhqv6pMHfUJlcHmrahdcKrkGXQwkOBswwmWUgaxlfrJSaVavfVl/Z7oggYQIk
XesqJfqXQScrxHz63HN+Xskxg50lawjdx7GFRd0CgYEAqlA/wDMvY/s7BN5Vm+xZ
MgClJ2+qc8F9YfTizNn0KihnI3p1MsCX95BqYWSo/GK6DeC7LRLR99zlyo1Rmv27
G7bPN+4rZTzqFO5Lzulm22wgQxvS1VzxBgRGUaNpl6L+x0VGUV5W68Pb2fxkBZpU
DGOFzaumu8dOMHjzji/vLZkCgYAqz3L5rnGgOtHZWlBBO8oiRU+MHXuZ/MnH9kG9
F3a2rJZe8jB3u9l5a2Aq8YHnMdMALlHW8IJjYfi6Rz7/qWZ/p6/5Ddbh3KiqGLKe
Pchp37dEchl96kYKcDWz9eP3xn39drBob12ZS7wAnAVvQDq+Mejv418VfCaPzTJd
0qplaQKBgFJ1u3pOfOF4BerC27JAsRhniSWsABmQpU/l5wSlIT3CQHpMkn1LbW6C
sJ85AaokrwY8XS3+n5fZmikwDUMCo283+UoJtPMlDjsWGTl/3TjfGzSZRbtjsQZ9
yRFcSrnL3d3IDakZ+nPQ+Q8dOkN4aDGsdm7itTSpghSvr3pnspRK
-----END RSA PRIVATE KEY-----]]

local RSA_N = "tScB7idg2HV7z8lzxgUkVC7krsc6spvTfby2y1pLbB_GROiXFMX_ZrTiCfy69h7PhP-uXbzw7-aDnK5SyQ8gwvWnxQt3vUQ1cTLqZmgSzsjxjfM3BjnNfZaFd1oXIp0cPsJJBzLj7Kzohm_vW_Vf5DrfoUU1HvFDwyvnK6_6eVJhUbQafrtMNsyRfSgRyNr6pMc0y9xkRCao-NnesVunjEs021ZOWXAM09ZJo8tB-f75DXTR9RdosiiZecqrsp4R9FYQfpcemb8ruTFnta4OaHq0HCy1zsTN2XeVn67FB2bm3lAIk2ijhiPiGN5-9J1ps2YfKO8ktaeNOYDgeWizFQ"

local EC_PRIVATE_PEM = [[-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIAZNv7BhvuFSSI7R50MsqxpAVzRxU4C2Hu8WXTuy3+G9oAoGCCqGSM49
AwEHoUQDQgAEH803eBvJF2q3yY057KtNp2xyZMZvz8mZGxDQrgZDsa1k3j9bRIlJ
pQygPwcVqHsKumi+M5KsjU5l1k/3ze+kOw==
-----END EC PRIVATE KEY-----]]

local EC_X = "H803eBvJF2q3yY057KtNp2xyZMZvz8mZGxDQrgZDsa0"
local EC_Y = "ZN4_W0SJSaUMoD8HFah7CrpovjOSrI1OZdZP983vpDs"

local EC_P384_X = "iA6VOn2V9mcm2b2D9XqO7TVYrJhMlNdu1dAQ3Iqe7k7sVhdMwp3gUAiEGAThAj3B"
local EC_P384_Y = "5Q7ZuZ8YNBUSUm9Bl0qqmP3VrYnPw4xqJHl1Xpnbe8fqD9HwIvUOEbHkPv7gvXjq"

local ISSUER = "https://issuer.test"
local CLIENT_ID = "client-x"
local FAR_FUTURE = 4102444800

local function provider()
    local port = assert(tostring(assert(registry.get("app:gateway")).data.addr):match(":(%d+)$"))
    return {
        name = "oidc",
        client_id = CLIENT_ID,
        trust_email = false,
        endpoints = { jwks = "http://127.0.0.1:" .. port .. "/api/public/fixture/jwks", issuer = ISSUER },
    }
end

local function signed(key_pem, alg, kid)
    local token, err = crypto.jwt.encode({
        iss = ISSUER, aud = CLIENT_ID, exp = FAR_FUTURE, sub = "user-" .. alg,
        _header = kid and { kid = kid } or nil,
    }, key_pem, alg)
    assert(token, tostring(err))
    return token
end

local function with_bad_signature(token)
    local at = #token - 10
    local replacement = token:sub(at, at) == "A" and "B" or "A"
    return token:sub(1, at - 1) .. replacement .. token:sub(at + 1)
end

local RSA_JWK = { kty = "RSA", kid = "rsa-1", n = RSA_N, e = "AQAB" }
local EC_JWK = { kty = "EC", kid = "ec-1", crv = "P-256", x = EC_X, y = EC_Y }
local EC_P384_JWK = { kty = "EC", kid = "ec-384", crv = "P-384", x = EC_P384_X, y = EC_P384_Y }

return {run = test.run_cases(function()
    describe("oidc.validate_id_token against a JWKS", function()
        it("verifies an ES256 id_token with the EC P-256 key of its kid", function()
            oauth_fixture.set_jwks({ RSA_JWK, EC_JWK })
            local claims, err = oidc.validate_id_token(provider(), signed(EC_PRIVATE_PEM, "ES256", "ec-1"), nil)
            test.is_nil(err)
            test.eq(claims.sub, "user-ES256")
        end)

        it("rejects an ES256 id_token with a bad signature", function()
            oauth_fixture.set_jwks({ RSA_JWK, EC_JWK })
            local token = with_bad_signature(signed(EC_PRIVATE_PEM, "ES256", "ec-1"))
            local claims, err = oidc.validate_id_token(provider(), token, nil)
            test.is_nil(claims)
            test.is_true(err:find("signature invalid", 1, true) ~= nil, tostring(err))
        end)

        it("still verifies an RS256 id_token with the RSA key of its kid", function()
            oauth_fixture.set_jwks({ EC_JWK, RSA_JWK })
            local claims, err = oidc.validate_id_token(provider(), signed(RSA_PRIVATE_PEM, "RS256", "rsa-1"), nil)
            test.is_nil(err)
            test.eq(claims.sub, "user-RS256")
        end)

        it("rejects an RS256 id_token with a bad signature", function()
            oauth_fixture.set_jwks({ EC_JWK, RSA_JWK })
            local token = with_bad_signature(signed(RSA_PRIVATE_PEM, "RS256", "rsa-1"))
            local claims, err = oidc.validate_id_token(provider(), token, nil)
            test.is_nil(claims)
            test.is_true(err:find("signature invalid", 1, true) ~= nil, tostring(err))
        end)

        it("verifies a no-kid RS256 token when an EC key comes first", function()
            oauth_fixture.set_jwks({ EC_JWK, RSA_JWK })
            local token = signed(RSA_PRIVATE_PEM, "RS256", nil)
            local claims, err = oidc.validate_id_token(provider(), token, nil)
            test.is_nil(err)
            test.eq(claims.sub, "user-RS256")
            local tampered, tampered_err = oidc.validate_id_token(provider(), with_bad_signature(token), nil)
            test.is_nil(tampered)
            test.is_true(tampered_err:find("signature invalid", 1, true) ~= nil, tostring(tampered_err))
        end)

        it("verifies a no-kid ES256 token when an RSA key comes first", function()
            oauth_fixture.set_jwks({ RSA_JWK, EC_JWK })
            local token = signed(EC_PRIVATE_PEM, "ES256", nil)
            local claims, err = oidc.validate_id_token(provider(), token, nil)
            test.is_nil(err)
            test.eq(claims.sub, "user-ES256")
            local tampered, tampered_err = oidc.validate_id_token(provider(), with_bad_signature(token), nil)
            test.is_nil(tampered)
            test.is_true(tampered_err:find("signature invalid", 1, true) ~= nil, tostring(tampered_err))
        end)

        it("rejects an unsupported algorithm instead of falling back to claims", function()
            oauth_fixture.set_jwks({ EC_JWK, RSA_JWK })
            local claims, err = oidc.validate_id_token(provider(), signed("fixture-secret", "HS256", nil), nil)
            test.is_nil(claims)
            test.is_true(err:find("signature invalid", 1, true) ~= nil, tostring(err))
        end)

        it("rejects an incompatible JWKS instead of falling back to claims", function()
            oauth_fixture.set_jwks({ EC_JWK })
            local claims, err = oidc.validate_id_token(provider(), signed(RSA_PRIVATE_PEM, "RS256", nil), nil)
            test.is_nil(claims)
            test.is_true(err:find("signature invalid", 1, true) ~= nil, tostring(err))
        end)

        it("selects a compatible key when different key types share a kid", function()
            oauth_fixture.set_jwks({
                { kty = "EC", kid = "shared", crv = "P-256", x = EC_X, y = EC_Y },
                { kty = "RSA", kid = "shared", n = RSA_N, e = "AQAB" },
            })
            local claims, err = oidc.validate_id_token(provider(), signed(RSA_PRIVATE_PEM, "RS256", "shared"), nil)
            test.is_nil(err)
            test.eq(claims.sub, "user-RS256")
        end)

        it("rejects an ES256 id_token whose kid names an RSA key", function()
            oauth_fixture.set_jwks({ RSA_JWK, EC_JWK })
            local claims, err = oidc.validate_id_token(provider(), signed(EC_PRIVATE_PEM, "ES256", "rsa-1"), nil)
            test.is_nil(claims)
            test.is_true(err:find("signature invalid", 1, true) ~= nil, tostring(err))
        end)

        it("skips an EC key on another curve when the id_token has no kid", function()
            oauth_fixture.set_jwks({ EC_P384_JWK, EC_JWK })
            local token = signed(EC_PRIVATE_PEM, "ES256", nil)
            local claims, err = oidc.validate_id_token(provider(), token, nil)
            test.is_nil(err)
            test.eq(claims.sub, "user-ES256")
            local tampered_claims, tampered_err = oidc.validate_id_token(provider(), with_bad_signature(token), nil)
            test.is_nil(tampered_claims)
            test.is_true(tampered_err:find("signature invalid", 1, true) ~= nil, tostring(tampered_err))
        end)
    end)
end)}
