-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local uploads = require("uploads")
local interleave = require("asset_interleave")

return {
    reap = function(component, id)
        if ctx.get("mail_test_reap_id") == id then interleave.pause("after_claim") end
        return uploads.reap(component, id)
    end,
}
