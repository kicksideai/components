-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local oidc = require("oidc")
local github = require("github")
local fixture = require("fixture")
local jwk = require("jwk")
local util = require("util")
local log = require("log")
local SENTINEL = "sso-error-secret-sentinel"
return {run = test.run_cases(function()
    test.describe("SSO token exchange error surface", function()
        test.it("keeps provider error bodies and request failures out of external errors", function()
            for _, connector in ipairs({oidc, github}) do
            local descriptor = {client_id = "example-client", client_secret = SENTINEL,
                endpoints = {token = "https://issuer.example/token"}}
            fixture.status, fixture.body, fixture.failure = 400, SENTINEL, nil
            local result, err = connector.complete(descriptor, {code = "code", redirect_uri = "https://app.example/callback"})
            test.is_nil(result)
            test.not_nil(err)
            test.is_nil((tostring(err):find(SENTINEL, 1, true)))
            fixture.failure = SENTINEL
            local value, failure = connector.complete(descriptor, {code = "code"})
            fixture.failure = nil
            test.is_nil(value)
            test.not_nil(failure)
            test.is_nil((tostring(failure):find(SENTINEL, 1, true)))
            end
        end)
        test.it("rejects malformed token JSON with the exact safe error for each connector", function()
            for _, connector in ipairs({oidc, github}) do
                fixture.status, fixture.body, fixture.failure = 200, '{"secret":"' .. SENTINEL, nil
                local result, err = connector.complete({client_id = "client", client_secret = SENTINEL,
                    endpoints = {token = "https://issuer.example/token"}}, {code = "code"})
                test.is_nil(result)
                test.eq(err, "token response is not valid JSON")
            end
        end)
        test.it("bounds JWKS and OIDC discovery transport and JSON errors", function()
            local _, jwt_err = jwk.decode_segment(util.base64url_encode('{"secret":"' .. SENTINEL))
            test.eq(jwt_err, "malformed JWT JSON")
            local token = util.base64url_encode('{"alg":"RS256"}') .. ".payload.signature"
            local url = "https://issuer.example/keys?api_key=" .. SENTINEL
            fixture.failure = "request to " .. url .. " failed"
            local _, err = jwk.pem_for_token(url, token)
            test.eq(err, "jwks fetch failed")
            local claims_token = util.base64url_encode('{"alg":"RS256"}') .. "." ..
                util.base64url_encode('{"aud":"client","exp":' .. tostring(os.time() + 300) .. '}') .. ".signature"
            local claims, claims_err = oidc.validate_id_token({client_id = "client", endpoints = {jwks = url}}, claims_token)
            test.is_nil(claims_err)
            test.eq(claims.aud, "client")
            test.eq(log.message, "jwks unavailable; validating id_token claims only")
            test.eq(log.fields.reason, "jwks fetch failed")
            local _, discovery_err = oidc.discover(url)
            test.eq(discovery_err, "discovery failed")
            fixture.status, fixture.body, fixture.failure = 200, '{"secret":"' .. SENTINEL, nil
            local _, parse_err = jwk.pem_for_token(url, token)
            test.eq(parse_err, "jwks parse failed")
            local _, discovery_parse_err = oidc.discover(url)
            test.eq(discovery_parse_err, "discovery parse failed")
        end)
    end)
end)}
