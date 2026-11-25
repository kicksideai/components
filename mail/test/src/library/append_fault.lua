-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local threads = require("threads")
local interleave = require("asset_interleave")

return {
    wait_deadline = threads.wait_deadline,
    catch_up = function(...)
        if ctx.get("mail_test_catch_up_denied") then
            return nil, errors.new({kind = errors.PERMISSION_DENIED, retryable = false, message = "Test catch-up refused",
                details = {code = "fixture_catch_up_denied"}})
        end
        return threads.catch_up(...)
    end,
    replay = threads.replay,
    append = function(...)
        if ctx.get("mail_test_strand_restore") then
            return nil, errors.new({kind = errors.UNAVAILABLE, message = "Test lost append result",
                details = {cause = "test connection lost"}})
        end
        if ctx.get("mail_test_append_failure") then
            return nil, errors.new({kind = errors.UNAVAILABLE, message = "Test append failure",
                details = {code = "mail_test_append_failure"}})
        end
        interleave.pause("before_append")
        return threads.append(...)
    end,
}
