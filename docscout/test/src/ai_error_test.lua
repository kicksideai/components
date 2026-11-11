-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local funcs = require("funcs")
return { run = test.run_cases(function()
    test.describe("Model error classification", function()
    for _, model in ipairs({ "plain", "terminal", "transient", "missing_structured" }) do
        test.it("preserves the retry classification of " .. model .. " errors", function()
            local overlay = assert(registry.overlay("app:ai_error_test"))
            local entry = assert(registry.get("kickside.docscout.engine:ai"))
            entry.data.imports.llm = "app:fixture_call_error"
            local changes = overlay:changes(); changes:update(entry); assert(changes:apply())
            local ok, failure = pcall(function()
                local value, err = funcs.call("app:fixture_call_error_probe", { model = model, structured = model == "missing_structured" })
                test.is_nil(value); test.not_nil(err)
                test.eq(err:retryable(), model == "transient" or model == "missing_structured")
            end)
            local restore = assert(registry.overlay("app:ai_error_test")):changes()
            restore:delete(entry.id); assert(restore:apply())
            if not ok then error(failure) end
        end)
    end
    end)
end) }
