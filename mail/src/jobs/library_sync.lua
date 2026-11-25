-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local live = require("live")
local notify = require("notify")

local function run(input: {payload: {seq: integer, uploads_changed: boolean?}}): (boolean?, error?)
    local published, err = live.publish(input.payload.seq)
    if err then
        return nil, errors.new({kind = err:kind(), message = err:message(), retryable = true, details = err:details()})
    end
    if input.payload.uploads_changed then notify.retention() end
    return published, nil
end

return {run = run}
