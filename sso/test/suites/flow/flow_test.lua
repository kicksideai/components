local test = require("test")
local cookies = require("sso_cookies")
local reqinfo = require("sso_reqinfo")

-- Unit coverage for the request-handling helpers the live flow depends on:
-- Set-Cookie assembly, Cookie-header parsing, host/scheme derivation, and the
-- public-base resolution (absolute URL passthrough vs path-under-origin).
local function fake_req(headers, host)
    return {
        header = function(_, name) return headers[name] end,
        host = function(_) return host end,
    }
end

local function define_tests()
    describe("cookies", function()
        it("builds an HttpOnly, SameSite=Lax cookie with Max-Age and Secure", function()
            local c = cookies.build("sso_flow", "abc", 600, true)
            test.is_true(c:find("sso_flow=abc", 1, true) == 1)
            test.is_true(c:find("HttpOnly", 1, true) ~= nil)
            test.is_true(c:find("SameSite=Lax", 1, true) ~= nil)
            test.is_true(c:find("Max-Age=600", 1, true) ~= nil)
            test.is_true(c:find("Secure", 1, true) ~= nil)
        end)

        it("omits Secure when not on https", function()
            local c = cookies.build("sso_flow", "abc", 600, false)
            test.is_true(c:find("Secure", 1, true) == nil)
        end)

        it("expires a cookie with Max-Age=0", function()
            test.is_true(cookies.expire("sso_flow", false):find("Max-Age=0", 1, true) ~= nil)
        end)

        it("reads a named cookie from the Cookie header", function()
            local req = fake_req({ Cookie = "a=1; sso_flow=xyz; b=2" })
            test.eq(cookies.read(req, "sso_flow"), "xyz")
            test.is_nil(cookies.read(req, "missing"))
            test.is_nil(cookies.read(fake_req({}), "sso_flow"))
        end)
    end)

    describe("reqinfo", function()
        it("uses request:host() (with port) and prefers X-Forwarded-Host", function()
            test.eq(reqinfo.host(fake_req({}, "localhost:19120")), "localhost:19120")
            test.eq(reqinfo.host(fake_req({ ["X-Forwarded-Host"] = "app.example.com" }, "x")), "app.example.com")
        end)

        it("treats localhost as http and other hosts as https", function()
            test.eq(reqinfo.scheme(fake_req({}, "localhost:19120")), "http")
            test.eq(reqinfo.scheme(fake_req({}, "app.example.com")), "https")
            test.eq(reqinfo.scheme(fake_req({ ["X-Forwarded-Proto"] = "https" }, "localhost:1")), "https")
        end)

        it("passes through an absolute public base verbatim", function()
            test.eq(reqinfo.public_base(fake_req({}, "x"), "https://app.example.com/api/public/sso"),
                "https://app.example.com/api/public/sso")
        end)

        it("prepends the request origin to a path public base", function()
            test.eq(reqinfo.public_base(fake_req({}, "localhost:19120"), "/api/public/sso"),
                "http://localhost:19120/api/public/sso")
        end)
    end)
end

return test.run_cases(define_tests)
