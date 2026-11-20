-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local M = {}

function M.run(input: types.CheckInput): types.CheckResult
    local findings: { types.Finding } = {}
    if input.proposed_status ~= input.config.proposed or input.previous_status ~= input.config.previous then
        findings[1] = { code = "unexpected_status", message = "check received the wrong status transition" }
    elseif input.previous_status == "draft" and input.proposed_status == "active" then
        findings[1] = { code = "promotion_requires_approval", message = "draft promotion requires approval" }
    end
    return { findings = findings }
end

return M
