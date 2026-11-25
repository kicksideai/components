-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local uploads = require("uploads")
local interleave = require("asset_interleave")

return {
    reap = function(component, id)
        interleave.pause_reap(id)
        return uploads.reap(component, id)
    end,
}
