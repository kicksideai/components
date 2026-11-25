-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local threads = require("threads")
local interleave = require("asset_interleave")

return {
    catch_up = threads.catch_up,
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
