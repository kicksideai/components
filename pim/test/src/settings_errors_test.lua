-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local defaults = require("defaults")
local function define()
    test.describe("settings failure vocabulary", function()
        for _, method in ipairs({ "read", "namespace" }) do
            for _, case in ipairs({
                { mode = "missing", kind = errors.UNAVAILABLE, code = "contract_unavailable", retryable = true },
                { mode = "no_client", kind = errors.UNAVAILABLE, code = "contract_unavailable", retryable = true },
                { mode = "unreadable", kind = errors.UNAVAILABLE, code = "settings_unavailable", retryable = true },
                { mode = "bad_value", kind = errors.INTERNAL, code = "settings_value_invalid", retryable = false },
                { mode = "native", kind = errors.PERMISSION_DENIED, code = "settings_access_denied", retryable = false },
                { mode = "response_native", kind = errors.PERMISSION_DENIED, code = "settings_access_denied", retryable = false },
            }) do
                test.it("returns " .. case.code .. " for " .. method .. " " .. case.mode, function()
                    fixture.set(case.mode)
                    local result, err = defaults[method]("kickside.pim")
                    test.is_nil(result)
                    test.not_nil(err)
                    test.eq(err:kind(), case.kind)
                    test.eq(err:details().code, case.code)
                    test.eq(err:retryable(), case.retryable)
                    if case.mode == "bad_value" or case.mode == "unreadable" then
                        test.eq(err:details().namespace, "kickside.pim")
                        if method == "read" then test.eq(type(err:details().key), "string") end
                    end
                    if case.code == "settings_access_denied" then test.eq(err:details().marker, "kept") end
                end)
            end
        end
    end)
end
return { run = test.run_cases(define) }
