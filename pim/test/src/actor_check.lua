-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness family check: reports the actor it ran under as its finding.
local security = require("security")
local types = require("types")

local M = {}

function M.run(_input: types.CheckInput): { findings: { types.Finding } }
    local actor = security.actor()
    return { findings = { { code = actor and actor:id() or "no actor", message = "ran under this actor" } } }
end

return M
