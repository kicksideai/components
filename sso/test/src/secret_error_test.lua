-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local oidc = require("oidc")
local github = require("github")
local fixture = require("fixture")
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
    end)
end)}
