-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M={}
function M.run(_row_limit, _catalog_limit)
    return { deleted = 0, spent = 0, catalogs = 0, needs_continue = false, blocked = {} }, nil
end
return M
