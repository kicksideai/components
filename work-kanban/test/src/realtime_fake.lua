-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness realtime binding accepts targeted notifications.
local M = {}
type Result = { success: boolean, error: string? }

function M.notify(): Result
    return { success = true }
end

function M.broadcast(): Result
    return { success = false, error = "board changes never broadcast to every client" }
end

return M
