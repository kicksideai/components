local test = require("test")
local registry = require("registry")
local seed_plan = require("sso_seed_plan")

local SEED_POLICY = "kickside.sso.env:seed.env_read"

local function plan_map(plan)
    local out = {}
    for _, item in ipairs(plan) do out[item.key] = item.value end
    return out
end

local function policy_resources(): { [string]: boolean }
    local entry = registry.get(SEED_POLICY)
    test.not_nil(entry, SEED_POLICY)
    local data = (entry :: any).data or entry
    local policy = data.policy or data
    local granted = {}
    for _, resource in ipairs(policy.resources or {}) do granted[resource] = true end
    return granted
end

local function define_tests()
    test.describe("SSO boot seed plan", function()
        test.it("assigns the default group when a domain allowlist is present", function()
            local plan = plan_map(seed_plan.global_plan({
                allowed_email_domains = "example.com",
                default_group = "user",
            }))
            test.eq(plan.auto_provision, true)
            test.eq(plan.default_group, "user")
            test.eq(plan.enabled, true)
            test.eq(#(plan.allowed_email_domains :: { string }), 1)
            test.eq((plan.allowed_email_domains :: { string })[1], "example.com")
        end)

        test.it("splits and trims a multi-domain list", function()
            local plan = plan_map(seed_plan.global_plan({
                allowed_email_domains = " example.com , wippy.ai ,, ",
                default_group = "user",
            }))
            local domains = plan.allowed_email_domains :: { string }
            test.eq(#domains, 2)
            test.eq(domains[1], "example.com")
            test.eq(domains[2], "wippy.ai")
        end)

        test.it("omits the default group when none is configured", function()
            local plan = plan_map(seed_plan.global_plan({
                allowed_email_domains = "example.com",
                default_group = "  ",
            }))
            test.eq(plan.auto_provision, true)
            test.is_nil(plan.default_group)
        end)

        test.it("never provisions or grants a group without an allowlist", function()
            local plan = plan_map(seed_plan.global_plan({ default_group = "user" }))
            test.is_nil(plan.auto_provision)
            test.is_nil(plan.default_group)
            test.is_nil(plan.allowed_email_domains)
            test.eq(plan.enabled, true)
        end)

        test.it("grants the seed actor every bootstrap variable it reads", function()
            local granted = policy_resources()
            local entries = registry.find({ [".kind"] = "env.variable" }) or {}
            local checked = 0
            for _, entry in ipairs(entries) do
                local id = (entry :: any).id or ""
                if tostring(id):sub(1, #"kickside.sso.env:") == "kickside.sso.env:" then
                    checked = checked + 1
                    test.eq(granted[tostring(id)], true, "seed.env_read is missing " .. tostring(id))
                end
            end
            test.is_true(checked > 0)
        end)
    end)
end

return test.run_cases(define_tests)
