-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local security = require("security")
local data = require("data")

-- The default settings binding is the retention reader's declared boundary.
local function window(owner: string, denied: boolean?): (any?, error?)
    local binding = assert(registry.get("kickside.settings:settings_binding"))
    binding.data.contracts[1].methods.get = "app:fixture_settings_get"
    local overlay = assert(registry.overlay("app:retention_test"))
    assert(overlay:changes():update(binding):apply())
    local caller = data.caller(owner)
    if denied then
        caller = caller:with_scope(security.new_scope({ assert(security.policy("app:user")),
            assert(security.policy("app:deny_provider_security")) }))
    end
    local value, err = caller:call("app:probe", { op = "retention" })
    local cleanup = assert(registry.overlay("app:retention_test")):changes()
    cleanup:delete("kickside.settings:settings_binding")
    assert(cleanup:apply())
    return value, err
end

return { run = test.run_cases(function()
    test.describe("Retention settings", function()
        test.it("binds the caller actor and returns a native builder denial", function()
            local value, err = window("retention-reader")
            test.is_nil(err, tostring(err)); test.eq(value, "retention-reader")
            local denied, denied_err = window("retention-reader", true)
            test.is_nil(denied); test.not_nil(denied_err)
            test.is_true(errors.is(denied_err, errors.PERMISSION_DENIED)); test.is_false(denied_err:retryable())
        end)
        test.it("preserves native settings failure kind, retryability and details", function()
            local value, err = window("retention-native-failure")
            test.is_nil(value); test.not_nil(err); test.is_true(errors.is(err, errors.INVALID))
            test.is_false(err:retryable()); test.eq(err:details().code, "setting_rejected")
            local transient, transient_err = window("retention-transient-failure")
            test.is_nil(transient); test.not_nil(transient_err)
            test.is_true(errors.is(transient_err, errors.UNAVAILABLE)); test.is_true(transient_err:retryable())
            test.eq(transient_err:details().code, "settings_unavailable")
        end)
        test.it("returns a nonretryable error for a settings domain failure", function()
            local value, err = window("retention-domain-failure")
            test.is_nil(value); test.not_nil(err); test.is_true(errors.is(err, errors.INTERNAL))
            test.is_false(err:retryable()); test.eq(err:details().code, "retention_setting_failed")
        end)
    end)
end) }
