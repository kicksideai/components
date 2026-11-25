-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local live = require("live")
local notify = require("notify")

local function run(input: {payload: {seq: integer}}): (boolean?, error?)
    local published, err = live.publish(input.payload.seq)
    if err then return nil, err end
    notify.retention()
    return published, nil
end

return {run = run}
