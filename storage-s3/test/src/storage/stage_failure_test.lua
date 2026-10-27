local test = require("test")
local stage = require("stage")
local settings = require("settings")

return { run = test.run_cases(function()
    test.describe("storage policy failures", function()
        for _, retryable in ipairs({ false, true }) do
            test.it("keeps Settings classification for retryable=" .. tostring(retryable), function()
                local source = errors.new({ kind = retryable and errors.UNAVAILABLE or errors.PERMISSION_DENIED,
                    retryable = retryable, message = "policy read refused", details = { code = "policy_read",
                        cause = { message = "settings source", kind = errors.CONFLICT } } })
                settings.result = { success = false, error = source }
                local result, err = stage.process({ storage_path = "original" })
                test.is_nil(result)
                test.eq(source, err)
                test.eq(source:kind(), err:kind())
                test.eq(retryable, err:retryable())
                test.eq("policy_read", err:details().code)
                test.eq("settings source", err:details().cause.message)
            end)
        end
    end)
end) }
