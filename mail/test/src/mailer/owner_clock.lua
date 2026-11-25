-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local time = require("time")

local function now()
    local millis, err = ctx.get("mail_test_now")
    if err and err:kind() == errors.NOT_FOUND then return time.now() end
    if err then error(err) end
    millis = millis :: integer
    return time.unix(millis // 1000, (millis % 1000) * 1000000)
end

return {now = now}
