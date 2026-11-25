-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local live = require("live")
local notify = require("notify")
local error_envelope = require("error_envelope")

local function run(input: {payload: {seq: integer}}): (boolean?, error?)
    local published, err = live.publish(input.payload.seq)
    -- Jobs classifies deterministic failures by kind.
    if err and not err:retryable() then
        local details = err:details() or {}
        return nil, errors.new({kind = errors.INVALID, message = err:message(), retryable = false,
            details = {code = details.code or "mail_library_publication_failed", cause = error_envelope.encode(err)}})
    end
    if err then return nil, err end
    notify.retention()
    return published, nil
end

return {run = run}
