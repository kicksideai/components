-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Settings writer hook: rejects a PIM setting value outside its bounds.
local policy = require("policy")

local function validate(args: { key: string, value: unknown }): { valid: boolean, error: string? }
    local bad = policy.check(args.key, args.value)
    if bad then return { valid = false, error = bad } end
    return { valid = true }
end

return { validate = validate }
