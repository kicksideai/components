local test = require("test")
local registry = require("registry")

return { run = test.run_cases(function()
    test.describe("storage-s3 architecture", function()
        test.it("keeps packed reads in Uploads and does not retain placement state", function()
            test.is_nil((registry.get("kickside.storage_s3.storage:backend")))
            test.is_nil((registry.get("kickside.storage_s3.persist:locations")))
            test.is_nil((registry.get("kickside.storage_s3.service:offload_job")))
            test.not_nil((registry.get("kickside.uploads.binding:storage_adapter_default")))
        end)
    end)
end) }
