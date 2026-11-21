-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs - the caller's catalog directory, with optional filters.
local access = require("access")

local function handler()
    access.read("list", { text = { "text", "ui_app" }, bool = { "admin_only" }, int = { "limit", "after" } }, false)
end

return { handler = handler }
