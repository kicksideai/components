local test = require("test")
local github = require("github")
local function define_tests()
    test.describe("GitHub SSO endpoints", function()
        test.it("uses the descriptor authorize endpoint", function()
            local url = github.build_authorize_url({ client_id = "gid", endpoints = { authorize = "https://enterprise.example.invalid/login/oauth/authorize" } }, { redirect_uri = "https://app/cb", state = "st" })
            test.is_true(url:find("https://enterprise.example.invalid/login/oauth/authorize?", 1, true) == 1)
        end)
    end)
end
local cases = test.run_cases(define_tests)
return { run = function(options) return cases(options) end }
