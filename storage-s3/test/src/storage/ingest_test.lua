local test = require("test")
local registry = require("registry")

return { run = test.run_cases(function()
    test.describe("storage-s3 stage ordering", function()
        test.it("runs after every other universal upload stage", function()
            local stage = assert(registry.get("kickside.storage_s3:stage"))
            for _, entry in ipairs(assert(registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "upload.stage" }))) do
                if entry.id ~= stage.id then
                    test.is_true((entry.data.priority or 0) > stage.data.priority, entry.id .. " must run before storage relocation")
                end
            end
        end)
    end)
end) }
