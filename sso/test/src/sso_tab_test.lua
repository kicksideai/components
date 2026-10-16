local test = require("test")
local registry = require("registry")

-- Verifies the module contributes a discoverable Settings block: the settings
-- page scans `registry.find({["meta.type"]="kickside.settings:block"})` and reads
-- the custom fields off `entry.data`. We assert the SSO block is found and mounts
-- the admin element.
local function define_tests()
    describe("sso settings block", function()
        it("is discoverable as a kickside.settings:block mounting kickside-sso-admin", function()
            local entries, err = registry.find({ ["meta.type"] = "kickside.settings:block" })
            test.is_nil(err)

            local found = nil
            for _, entry in ipairs(entries or {}) do
                local e = (type(entry.data) == "table") and entry.data or entry
                if e.key == "sso" then found = e end
            end

            test.is_true(found ~= nil)
            test.eq(found.title, "Single sign-on")
            test.eq(found.group, "Single sign-on")
            test.eq(found.component_tag, "kickside-sso-admin")
            -- The global block drives the admin's global-only mode.
            test.is_true(type(found.config) == "table")
            test.eq(found.config.scope, "global")
        end)
    end)
end

return test.run_cases(define_tests)
