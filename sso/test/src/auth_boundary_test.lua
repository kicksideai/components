local test = require("test")
local registry = require("registry")

type DependencyData = { component: string?, version: string? }
type DependencyEntry = {
    component: string?,
    version: string?,
    data: DependencyData?,
}
type FunctionData = { security: { policies: { string }? }? }
type FunctionEntry = { data: FunctionData? }

local EXPECTED_DEPS: { [string]: { string } } = {
    ["kickside.sso:dep.kickside.settings"] = { "kickside/settings", "*" },
    ["kickside.sso:dep.kickside.users"] = { "kickside/users", "*" },
    ["kickside.sso:dep.wippy.migration"] = { "wippy/migration", "*" },
}

local REQUIRED_USERS_POLICIES: { [string]: boolean } = {
    ["kickside.users.security:login_db_access"] = true,
    ["kickside.users.security:login_settings_read"] = true,
    ["kickside.users.security:login_env_read"] = true,
    ["kickside.users.security:login_actor_create"] = true,
    ["kickside.users.security:login_role_resolve"] = true,
    ["kickside.users.security:login_token_mint"] = true,
}

local function dependency_data(raw: DependencyEntry): DependencyData
    return raw.data or { component = raw.component, version = raw.version }
end

local function define_tests()
    test.describe("kickside SSO authentication boundary", function()
        test.it("declares the production services it calls directly", function()
            for id, expected in pairs(EXPECTED_DEPS) do
                local entry = registry.get(id) :: DependencyEntry?
                test.not_nil(entry, id)
                local data = dependency_data(entry :: DependencyEntry)
                test.eq(data.component, expected[1], id .. " component")
                test.eq(data.version, expected[2], id .. " version")
            end
        end)

        test.it("reuses the Users-owned least-privilege login policies", function()
            local callback = registry.get("kickside.sso.api:callback") :: FunctionEntry?
            test.not_nil(callback)
            local data = (callback :: FunctionEntry).data or {}
            local policies = (data.security and data.security.policies) or {}
            local found: { [string]: boolean } = {}
            for _, policy_id in ipairs(policies) do
                test.is_true(policy_id:sub(1, #"app.security:login.") ~= "app.security:login.")
                if REQUIRED_USERS_POLICIES[policy_id] then found[policy_id] = true end
            end
            for policy_id, _ in pairs(REQUIRED_USERS_POLICIES) do
                test.eq(found[policy_id], true, "callback missing " .. policy_id)
            end
        end)
    end)
end

return { run_tests = test.run_cases(define_tests) }
