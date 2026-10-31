-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")

return { run = test.run_cases(function()
    test.describe("packed S3 storage", function()
        test.it("registers a lowest-priority universal relocation stage without placement services", function()
            local stage = assert(registry.get("kickside.storage_s3:stage"))
            test.eq(stage.meta.type, "upload.stage")
            test.eq(stage.data.scope, "universal")
            test.eq(stage.data.priority, -100)
            test.eq(stage.data.func, "kickside.storage_s3.storage:stage")
            test.is_nil((registry.get("kickside.storage_s3.service:controller")))
            test.is_nil((registry.get("kickside.storage_s3.persist:locations")))
            test.is_nil((registry.get("kickside.storage_s3.storage:backend")))
        end)

        test.it("binds the Uploads runtime policy without replacing its storage adapter", function()
            local dependency = assert(registry.get("kickside.storage_s3:dep.kickside.uploads"))
            test.eq(#dependency.data.parameters, 1)
            test.eq(dependency.data.parameters[1].name, "kickside.uploads:storage_runtime_policy")
            test.eq(dependency.data.parameters[1].value, "kickside.storage_s3.security:runtime")
            local runtime = assert(registry.get("kickside.storage_s3.security:runtime"))
            local granted = false
            for _, resource in ipairs(runtime.data.policy.resources) do
                test.is_nil(resource:find("*", 1, true))
                if resource == "app.storage_s3:s3" then granted = true end
            end
            test.is_true(granted)
            test.eq(#runtime.data.groups, 0)
            test.is_nil((registry.get("kickside.storage_s3:staging_storage")))
        end)

        test.it("discovers native S3 entries instead of a single extension binding", function()
            local entries = assert(registry.find({ [".kind"] = "cloudstorage.s3" }))
            test.is_true(#entries > 0)
        end)
    end)
end) }
