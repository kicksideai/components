local test = require("test")
local registry = require("registry")

type FunctionEntry = { data: { security: { policies: { string } } } }

local function define_tests()
    test.describe("SSO session sandbox", function()
        test.it("carries every grant in the Users session minting sandbox", function()
            local login = registry.get("kickside.users.api:login") :: FunctionEntry?
            local callback = registry.get("kickside.sso.api:callback") :: FunctionEntry?
            test.not_nil(login)
            test.not_nil(callback)
            local grants: { [string]: boolean } = {}
            for _, policy in ipairs((callback :: FunctionEntry).data.security.policies) do
                grants[policy] = true
            end
            for _, policy in ipairs((login :: FunctionEntry).data.security.policies) do
                test.eq(grants[policy], true, "SSO session mint missing " .. policy)
            end
        end)
    end)
end

return { run_tests = test.run_cases(define_tests) }
