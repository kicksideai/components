-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local M = {}
function M.status()
    return {status="configured"}
end
function M.delete()
    return require("repository").delete(ctx.get("component_id"))
end
return M
