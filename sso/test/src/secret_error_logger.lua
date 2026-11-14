-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
function M.named() return M end
function M.warn(_, message, fields) M.message, M.fields = message, fields end
return M
