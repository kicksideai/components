-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local policy = require("policy")
local types = require("types")
local M = {}
function M.validate(input: unknown): (unknown, error?)
    local request = input :: { key: string, value: unknown }
    local _, err = policy.effective({}, { [request.key] = request.value } :: types.PolicyDecl)
    if err then return nil, err end
    return { valid = true }, nil
end
return M
