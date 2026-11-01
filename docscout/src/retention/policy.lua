-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local M = { BATCH = 16 }
local LAYOUT = "2006-01-02T15:04:05.000Z"

-- Fixed-width UTC keeps the private recovery scheduling index chronological.
function M.window(): (string, string)
    local now = time.now():utc()
    return now:format(LAYOUT), now:add(30 * time.SECOND):format(LAYOUT)
end

return M
