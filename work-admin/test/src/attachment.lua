-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
function M.delete(): { success: boolean }
    return { success = true }
end
function M.guard(): boolean
    return true
end
return M
