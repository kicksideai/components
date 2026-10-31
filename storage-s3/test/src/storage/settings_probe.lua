local test = require("test")
local resources = require("resources")
local policy = require("policy")

return { run = test.run_cases(function()
    test.describe("storage-s3 settings", function()
        test.it("offers only native destinations granted by the runtime policy", function()
            local entries = assert(resources.s3_entries())
            test.eq(#entries, 1)
            test.eq(entries[1].id, "app.storage_s3:s3")
            for _, entry in ipairs(entries) do
                local checked = policy.validate({ value = { mode = "s3", resource_id = entry.id, prefix = "uploads" } })
                test.is_true(checked.valid, tostring(checked.error))
            end
        end)

        test.it("reserves resource discovery for settings validation", function()
            local value = { mode = "s3", resource_id = "app.storage_s3:alternate_s3", prefix = "uploads" }
            test.is_true(policy.validate_syntax({ value = value }).valid)
            test.is_false(policy.validate({ value = value }).valid)
        end)
    end)
end) }
