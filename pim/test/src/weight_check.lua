-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness family check: an item's net weight must not exceed config.max (kg).
local types = require("types")

local M = {}

function M.run(input: types.CheckInput): { findings: { types.Finding } }
    local findings: { types.Finding } = {}
    local max = input.config.max
    for _, w in pairs(input.view["logistics.net_weight"] or {}) do
        local d = w :: types.Dec
        local kg = d.m * (10.0 ^ d.e)
        if type(max) == "number" and kg > max then
            findings[#findings + 1] = { code = "too_heavy", attribute = "logistics.net_weight", message = "net weight exceeds " .. max .. " kg" }
        end
    end
    return { findings = findings }
end

return M
