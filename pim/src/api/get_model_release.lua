-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local M = {}

function M.handler()
    access.read("get_model_release", { path = { "request_id" } })
end

return M
